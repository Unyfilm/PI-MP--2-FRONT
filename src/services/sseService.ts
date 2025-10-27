

import { API_CONFIG } from '../config/environment';

interface SSEEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
}

class SSEService {
  private static instance: SSEService;
  private eventSource: EventSource | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  static getInstance(): SSEService {
    if (!SSEService.instance) {
      SSEService.instance = new SSEService();
    }
    return SSEService.instance;
  }

  
  connect() {
    if (this.isConnected || this.eventSource) {
      console.log('🔄 [SSE] Ya conectado, ignorando nueva conexión');
      return;
    }

    try {
      console.log('🔌 [SSE] Conectando al servidor SSE...');
      
      const sseUrl = `${API_CONFIG.BASE_URL}/api/realtime/events`;
      
      this.eventSource = new EventSource(sseUrl, {
        withCredentials: true
      });

      this.eventSource.onopen = () => {
        console.log('✅ [SSE] Conectado al servidor SSE');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const sseEvent: SSEEvent = JSON.parse(event.data);
          console.log('📡 [SSE] Evento recibido del servidor:', sseEvent);
          this.handleSSEEvent(sseEvent);
        } catch (error) {
          console.error('❌ [SSE] Error procesando evento:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('❌ [SSE] Error en conexión SSE:', error);
        this.isConnected = false;
        this.handleReconnection();
      };

      this.eventSource.addEventListener('rating-updated', (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data);
          console.log('📡 [SSE] Rating actualizado:', data);
          this.handleRatingUpdate(data);
        } catch (error) {
          console.error('❌ [SSE] Error procesando rating-updated:', error);
        }
      });

      this.eventSource.addEventListener('rating-stats-updated', (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data);
          console.log('📊 [SSE] Estadísticas actualizadas:', data);
          this.handleStatsUpdate(data);
        } catch (error) {
          console.error('❌ [SSE] Error procesando rating-stats-updated:', error);
        }
      });

    } catch (error) {
      console.error('❌ [SSE] Error conectando:', error);
      this.handleReconnection();
    }
  }

 
  private handleSSEEvent(event: SSEEvent) {
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'sse'
      }
    }));
  }


  private handleRatingUpdate(data: any) {
    window.dispatchEvent(new CustomEvent('rating-updated', {
      detail: {
        movieId: data.movieId,
        rating: data.rating,
        action: data.action,
        userId: data.userId,
        timestamp: data.timestamp,
        source: 'sse'
      }
    }));
  }

  
  private handleStatsUpdate(data: any) {
    window.dispatchEvent(new CustomEvent('rating-stats-updated', {
      detail: {
        movieId: data.movieId,
        averageRating: data.averageRating,
        totalRatings: data.totalRatings,
        timestamp: data.timestamp,
        source: 'sse'
      }
    }));
  }

  
  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ [SSE] Máximo de intentos de reconexión alcanzado');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 [SSE] Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, delay);
  }

 
  disconnect() {
    if (this.eventSource) {
      console.log('🔌 [SSE] Desconectando del servidor SSE...');
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  
  isConnectedToServer(): boolean {
    return this.isConnected && !!this.eventSource;
  }

  
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      readyState: this.eventSource?.readyState || null
    };
  }
}

export const sseService = SSEService.getInstance();

export const connectSSE = () => sseService.connect();

export const disconnectSSE = () => sseService.disconnect();

export const getSSEStatus = () => sseService.getConnectionStatus();
