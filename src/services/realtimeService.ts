/**
 * Real-time service for communication between users
 * Uses Socket.io to connect with the backend server
 */

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

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.isConnected || this.socket) {
      console.log('🔄 [REALTIME] Ya conectado, ignorando nueva conexión');
      return;
    }

    try {
      console.log('🔌 [REALTIME] Conectando al servidor WebSocket...');
      
      const serverUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' // Puerto del servidor backend
        : API_CONFIG.BASE_URL;

      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('✅ [REALTIME] Conectado al servidor WebSocket');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ [REALTIME] Desconectado del servidor:', reason);
        this.isConnected = false;
        this.handleReconnection();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ [REALTIME] Error de conexión:', error);
        this.handleReconnection();
      });

      this.socket.on('rating-updated', (data: RatingUpdateEvent) => {
        console.log('📡 [REALTIME] Rating actualizado recibido:', data);
        this.handleRatingUpdate(data);
      });

      this.socket.on('rating-stats-updated', (data: any) => {
        console.log('📊 [REALTIME] Estadísticas actualizadas:', data);
        this.handleStatsUpdate(data);
      });

    } catch (error) {
      console.error('❌ [REALTIME] Error conectando:', error);
      this.handleReconnection();
    }
  }

  /**
   * Manejar actualización de rating
   */
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

  /**
   * Manejar actualización de estadísticas
   */
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

  /**
   * Manejar reconexión automática
   */
  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ [REALTIME] Máximo de intentos de reconexión alcanzado');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 [REALTIME] Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, delay);
  }

  /**
   * Emitir evento de rating actualizado al servidor
   */
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

    console.log('📡 [REALTIME] Emitiendo evento de rating al servidor:', eventData);
    this.socket.emit('rating-updated', eventData);
  }

  /**
   * Obtener ID del usuario actual
   */
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

  /**
   * Desconectar del servidor
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 [REALTIME] Desconectando del servidor WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnectedToServer(): boolean {
    return this.isConnected && !!this.socket;
  }

  /**
   * Obtener estado de la conexión
   */
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