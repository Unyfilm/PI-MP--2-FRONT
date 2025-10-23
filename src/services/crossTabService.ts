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
      return;
    }

    try {
      // Usar BroadcastChannel si está disponible (navegadores modernos)
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel('unyfilm-realtime');

        this.broadcastChannel.onmessage = (event) => {
          this.handleCrossTabEvent(event.data);
        };
      } else {
        // Fallback a localStorage para navegadores más antiguos
        this.setupLocalStorageListener();
      }

      this.isListening = true;
    } catch (error) {
      // Error inicializando cross-tab service
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
          this.handleCrossTabEvent(crossTabEvent);
        } catch (error) {
          // Error parseando evento de localStorage
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
    try {
      if (this.broadcastChannel) {
        // Usar BroadcastChannel (preferido)
        this.broadcastChannel.postMessage(event);
      } else {
        // Usar localStorage como fallback
        localStorage.setItem('unyfilm-realtime-event', JSON.stringify(event));
        // Remover inmediatamente para evitar loops
        setTimeout(() => {
          localStorage.removeItem('unyfilm-realtime-event');
        }, 100);
      }
    } catch (error) {
      // Error enviando evento cross-tab
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
