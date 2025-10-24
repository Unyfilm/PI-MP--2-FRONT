/**
 * Servicio WebSocket para sincronización en tiempo real entre navegadores
 * Usa WebSocket para comunicación bidireccional
 */

interface WebSocketEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private serverUrl = 'wss://echo.websocket.org'; // Servidor público de prueba

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Conectar al servidor WebSocket
   */
  connect() {
    if (this.isConnected || this.ws) {
      console.log('🔄 [WEBSOCKET] Ya conectado, ignorando nueva conexión');
      return;
    }

    try {
      console.log('🔌 [WEBSOCKET] Conectando al servidor WebSocket...');
      
      this.ws = new WebSocket(this.serverUrl);
      
      this.ws.onopen = () => {
        console.log('✅ [WEBSOCKET] Conectado al servidor WebSocket');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📡 [WEBSOCKET] Mensaje recibido:', data);
          
          // Procesar evento según el tipo
          this.handleWebSocketEvent(data);
        } catch (error) {
          console.error('❌ [WEBSOCKET] Error procesando mensaje:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ [WEBSOCKET] Error en conexión:', error);
        this.isConnected = false;
        this.handleReconnection();
      };

      this.ws.onclose = () => {
        console.log('🔌 [WEBSOCKET] Conexión cerrada');
        this.isConnected = false;
        this.handleReconnection();
      };

    } catch (error) {
      console.error('❌ [WEBSOCKET] Error conectando:', error);
      this.handleReconnection();
    }
  }

  /**
   * Manejar reconexión automática
   */
  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ [WEBSOCKET] Máximo de intentos de reconexión alcanzado');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 [WEBSOCKET] Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, delay);
  }

  /**
   * Procesar eventos WebSocket
   */
  private handleWebSocketEvent(event: WebSocketEvent) {
    console.log(`🎯 [WEBSOCKET] Procesando evento ${event.type} para película ${event.movieId}`);
    
    // Emitir evento local para que los componentes lo escuchen
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'websocket'
      }
    }));
  }

  /**
   * Enviar evento al servidor
   */
  sendEvent(event: WebSocketEvent) {
    if (this.ws && this.isConnected) {
      console.log('📤 [WEBSOCKET] Enviando evento:', event);
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn('⚠️ [WEBSOCKET] No conectado, no se puede enviar evento');
    }
  }

  /**
   * Desconectar del servidor
   */
  disconnect() {
    if (this.ws) {
      console.log('🔌 [WEBSOCKET] Desconectando del servidor...');
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Obtener estado de la conexión
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }
}

// Exportar instancia singleton
export const websocketService = WebSocketService.getInstance();

// Función de conveniencia para conectar
export const connectWebSocket = () => websocketService.connect();

// Función de conveniencia para desconectar
export const disconnectWebSocket = () => websocketService.disconnect();

// Función de conveniencia para enviar evento
export const sendWebSocketEvent = (event: WebSocketEvent) => websocketService.sendEvent(event);

// Función de conveniencia para verificar estado
export const getWebSocketStatus = () => websocketService.getConnectionStatus();
