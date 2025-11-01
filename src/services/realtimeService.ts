

import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/environment';

/**
 * Represents an event triggered when a movie rating is updated in real time.
 *
 * @interface RatingUpdateEvent
 * @property {string} movieId - The unique ID of the movie being rated.
 * @property {number} rating - The rating value assigned to the movie.
 * @property {'create' | 'update' | 'delete'} action - The type of action performed on the rating.
 * @property {string} userId - The unique identifier of the user who performed the rating.
 * @property {number} timestamp - The timestamp of when the event occurred.
 */
interface RatingUpdateEvent {
  movieId: string;
  rating: number;
  action: 'create' | 'update' | 'delete';
  userId: string;
  timestamp: number;
}

/**
 * Service that manages real-time communication using WebSocket via Socket.IO.
 * Handles rating updates, statistics synchronization, and automatic reconnection.
 *
 * @class RealTimeService
 * @example
 * ```ts
 * import { connectRealTime, emitRatingUpdate } from './realTimeService';
 *
 * connectRealTime();
 * emitRatingUpdate('movie123', 4.5, 'create');
 * ```
 */
class RealTimeService {
  private static instance: RealTimeService;
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  /**
   * Returns the singleton instance of the RealTimeService.
   *
   * @returns {RealTimeService} The singleton instance.
   */
  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  /**
   * Establishes a connection to the WebSocket server.
   * Automatically sets up listeners for rating and statistics updates.
   *
   * @example
   * ```ts
   * realTimeService.connect();
   * ```
   */
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

  /**
   * Dispatches a `rating-updated` event to the browser’s global window object.
   *
   * @private
   * @param {RatingUpdateEvent} data - The rating update event data.
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
   * Dispatches a `rating-stats-updated` event to the browser’s global window object.
   *
   * @private
   * @param {any} data - The updated rating statistics data.
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
   * Handles reconnection logic with exponential backoff.
   * Retries connection attempts up to a maximum number.
   *
   * @private
   */
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
  /**
   * Emits a rating update event to the WebSocket server.
   *
   * @param {string} movieId - The ID of the movie being rated.
   * @param {number} rating - The numeric rating value.
   * @param {'create' | 'update' | 'delete'} action - The action performed.
   *
   * @example
   * ```ts
   * realTimeService.emitRatingUpdate('movie123', 5, 'create');
   * ```
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

    this.socket.emit('rating-updated', eventData);
  }

  /**
   * Retrieves the current user's ID from the authentication token.
   * Falls back to `"anonymous"` if unavailable.
   *
   * @private
   * @returns {string} The user ID or `"anonymous"`.
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
   * Disconnects from the WebSocket server.
   * Cleans up the socket instance.
   *
   * @example
   * ```ts
   * realTimeService.disconnect();
   * ```
   */
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

  /**
   * Retrieves the current connection status, including reconnect attempts and socket ID.
   *
   * @returns {{ connected: boolean; reconnectAttempts: number; maxAttempts: number; socketId: string | null }}
   * The current connection status object.
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