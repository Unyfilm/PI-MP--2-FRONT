/**
 * Represents a WebSocket event related to movie ratings.
 *
 * @interface WebSocketEvent
 * @property {'rating-updated' | 'rating-stats-updated'} type - Type of event.
 * @property {string} movieId - Unique identifier of the movie related to the event.
 * @property {any} data - Event data payload (e.g., rating info or stats).
 * @property {number} timestamp - Timestamp when the event occurred.
 */
interface WebSocketEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
}

/**
 * Service that manages real-time communication using **WebSocket**.
 * Provides automatic reconnection, event handling, and broadcasting through the browser’s `CustomEvent` API.
 *
 * @class WebSocketService
 * @example
 * ```ts
 * import { connectWebSocket, sendWebSocketEvent } from './websocketService';
 *
 * connectWebSocket();
 *
 * sendWebSocketEvent({
 *   type: 'rating-updated',
 *   movieId: '12345',
 *   data: { rating: 4 },
 *   timestamp: Date.now()
 * });
 * ```
 */
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private serverUrl = 'wss://echo.websocket.org';

  /**
   * Returns the singleton instance of the WebSocketService.
   *
   * @returns {WebSocketService} The singleton instance.
   */
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Establishes a WebSocket connection to the configured server.
   * Handles reconnection, event parsing, and browser event dispatching.
   *
   * @example
   * ```ts
   * websocketService.connect();
   * ```
   */
  connect() {
    if (this.isConnected || this.ws) {
      return;
    }

    try {
      
      this.ws = new WebSocket(this.serverUrl);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
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

  
  private handleWebSocketEvent(event: WebSocketEvent) {
    console.log(`🎯 [WEBSOCKET] Procesando evento ${event.type} para película ${event.movieId}`);
    
   
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'websocket'
      }
    }));
  }

  
  sendEvent(event: WebSocketEvent) {
    if (this.ws && this.isConnected) {
      console.log('📤 [WEBSOCKET] Enviando evento:', event);
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn('⚠️ [WEBSOCKET] No conectado, no se puede enviar evento');
    }
  }

  
  disconnect() {
    if (this.ws) {
      console.log('🔌 [WEBSOCKET] Desconectando del servidor...');
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }

 
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }
}


export const websocketService = WebSocketService.getInstance();


export const connectWebSocket = () => websocketService.connect();


export const disconnectWebSocket = () => websocketService.disconnect();


export const sendWebSocketEvent = (event: WebSocketEvent) => websocketService.sendEvent(event);


export const getWebSocketStatus = () => websocketService.getConnectionStatus();
