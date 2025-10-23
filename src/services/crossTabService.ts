/**
 * Servicio para sincronización entre pestañas del navegador
 * Usa localStorage y BroadcastChannel para comunicar cambios entre ventanas
 */

interface CrossTabEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
  source: 'cross-tab';
}

class CrossTabService {
  private static instance: CrossTabService;
  private broadcastChannel: BroadcastChannel | null = null;
  private isListening = false;

  static getInstance(): CrossTabService {
    if (!CrossTabService.instance) {
      CrossTabService.instance = new CrossTabService();
    }
    return CrossTabService.instance;
  }

  /**
   * Inicializar el servicio de sincronización entre pestañas
   */
  init() {
    if (this.isListening) {
      console.log('🔄 [CROSS-TAB] Ya está escuchando, ignorando inicialización');
      return;
    }

    console.log('🚀 [CROSS-TAB] Inicializando servicio cross-tab...');

    try {
      // Usar BroadcastChannel si está disponible (navegadores modernos)
      if (typeof BroadcastChannel !== 'undefined') {
        console.log('📡 [CROSS-TAB] BroadcastChannel disponible, configurando...');
        this.broadcastChannel = new BroadcastChannel('unyfilm-realtime');
        
        this.broadcastChannel.onmessage = (event) => {
          console.log('🔄 [CROSS-TAB] Evento recibido de otra pestaña:', event.data);
          this.handleCrossTabEvent(event.data);
        };

        console.log('✅ [CROSS-TAB] BroadcastChannel inicializado correctamente');
      } else {
        console.log('💾 [CROSS-TAB] BroadcastChannel no disponible, usando localStorage...');
        // Fallback a localStorage para navegadores más antiguos
        this.setupLocalStorageListener();
        console.log('✅ [CROSS-TAB] localStorage listener inicializado');
      }

      this.isListening = true;
      console.log('🎉 [CROSS-TAB] Servicio cross-tab completamente inicializado');
    } catch (error) {
      console.error('❌ [CROSS-TAB] Error inicializando:', error);
    }
  }

  /**
   * Configurar listener de localStorage como fallback
   */
  private setupLocalStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'unyfilm-realtime-event' && event.newValue) {
        try {
          const crossTabEvent: CrossTabEvent = JSON.parse(event.newValue);
          console.log('🔄 [CROSS-TAB] Evento de localStorage:', crossTabEvent);
          this.handleCrossTabEvent(crossTabEvent);
        } catch (error) {
          console.error('❌ [CROSS-TAB] Error parseando evento de localStorage:', error);
        }
      }
    });
  }

  /**
   * Manejar eventos de otras pestañas
   */
  private handleCrossTabEvent(event: CrossTabEvent) {
    // Emitir evento del DOM para que los componentes lo escuchen
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'cross-tab'
      }
    }));
  }

  /**
   * Enviar evento a otras pestañas
   */
  broadcastToOtherTabs(event: CrossTabEvent) {
    console.log('📡 [CROSS-TAB] Intentando enviar evento a otras pestañas:', event);
    console.log('📡 [CROSS-TAB] Estado del servicio:', {
      isListening: this.isListening,
      hasBroadcastChannel: !!this.broadcastChannel
    });

    try {
      if (this.broadcastChannel) {
        // Usar BroadcastChannel (preferido)
        this.broadcastChannel.postMessage(event);
        console.log('✅ [CROSS-TAB] Evento enviado via BroadcastChannel:', event);
      } else {
        // Usar localStorage como fallback
        localStorage.setItem('unyfilm-realtime-event', JSON.stringify(event));
        // Remover inmediatamente para evitar loops
        setTimeout(() => {
          localStorage.removeItem('unyfilm-realtime-event');
        }, 100);
        console.log('✅ [CROSS-TAB] Evento enviado via localStorage:', event);
      }
    } catch (error) {
      console.error('❌ [CROSS-TAB] Error enviando evento:', error);
    }
  }

  /**
   * Cerrar conexión
   */
  close() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.isListening = false;
    console.log('🔌 [CROSS-TAB] Conexión cerrada');
  }
}

export const crossTabService = CrossTabService.getInstance();

// Función de conveniencia para inicializar
export const initCrossTabSync = () => crossTabService.init();

// Función de conveniencia para enviar eventos
export const broadcastToOtherTabs = (movieId: string, rating: number, action: string) => {
  const event: CrossTabEvent = {
    type: 'rating-updated',
    movieId,
    data: {
      rating,
      action,
      movieTitle: 'Película Actualizada',
      userId: 'cross-tab-user'
    },
    timestamp: Date.now(),
    source: 'cross-tab'
  };

  crossTabService.broadcastToOtherTabs(event);
};
