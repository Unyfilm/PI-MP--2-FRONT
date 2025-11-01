

import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/environment';

interface RatingUpdateEvent {
  movieId: string;
  rating: number;
  action: 'create' | 'update' | 'delete';
  userId: string;
  timestamp: number;
}

class RealTimeService {
  private static instance: RealTimeService;
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  
  connect() {
    if (this.isConnected || this.socket) {
      return;
    }

    try {
      const serverUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : API_CONFIG.BASE_URL;

      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (_reason) => {
        this.isConnected = false;
        this.handleReconnection();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ [REALTIME] Error de conexión:', error);
        this.handleReconnection();
      });

      this.socket.on('rating-updated', (data: RatingUpdateEvent) => {
        this.handleRatingUpdate(data);
      });

      this.socket.on('rating-stats-updated', (data: any) => {
        this.handleStatsUpdate(data);
      });

    } catch (error) {
      console.error('❌ [REALTIME] Error conectando:', error);
      this.handleReconnection();
    }
  }

  
  private handleRatingUpdate(data: RatingUpdateEvent) {
    window.dispatchEvent(new CustomEvent('rating-updated', {
      detail: {
        movieId: data.movieId,
        rating: data.rating,
        action: data.action,
        userId: data.userId,
        timestamp: data.timestamp,
        source: 'websocket'
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
        source: 'websocket'
      }
    }));
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, delay);
  }

  
  emitRatingUpdate(movieId: string, rating: number, action: 'create' | 'update' | 'delete') {
    if (!this.socket || !this.isConnected) {
      console.warn('⚠️ [REALTIME] No conectado al servidor, no se puede emitir evento');
      return;
    }

    const eventData: RatingUpdateEvent = {
      movieId,
      rating,
      action,
      userId: this.getCurrentUserId(),
      timestamp: Date.now()
    };

    this.socket.emit('rating-updated', eventData);
  }

  
  private getCurrentUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || 'anonymous';
      } catch {
        return 'anonymous';
      }
    }
    return 'anonymous';
  }

 
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

 
  isConnectedToServer(): boolean {
    return this.isConnected && !!this.socket;
  }

 
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      socketId: this.socket?.id || null
    };
  }
}

export const realTimeService = RealTimeService.getInstance();

export const connectRealTime = () => realTimeService.connect();

export const disconnectRealTime = () => realTimeService.disconnect();

export const emitRatingUpdate = (movieId: string, rating: number, action: 'create' | 'update' | 'delete') => {
  realTimeService.emitRatingUpdate(movieId, rating, action);
};

export const getRealTimeStatus = () => realTimeService.getConnectionStatus();