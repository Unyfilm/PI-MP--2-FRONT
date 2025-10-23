/**
 * Servidor mock para simular eventos en tiempo real
 * En producción, esto sería reemplazado por un servidor real con WebSockets o SSE
 */

import { updateMockRatingStats } from './mockRatingService';
import { broadcastToOtherTabs } from './crossTabService';

interface MockEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
}

class MockRealtimeServer {
  private static instance: MockRealtimeServer;
  private events: MockEvent[] = [];
  private listeners: Set<(event: MockEvent) => void> = new Set();
  private isRunning = false;

  static getInstance(): MockRealtimeServer {
    if (!MockRealtimeServer.instance) {
      MockRealtimeServer.instance = new MockRealtimeServer();
    }
    return MockRealtimeServer.instance;
  }

  /**
   * Simular evento de rating actualizado
   */
  simulateRatingUpdate(movieId: string, rating: number, action: string, movieTitle: string) {
    const event: MockEvent = {
      type: 'rating-updated',
      movieId,
      data: {
        rating,
        action,
        movieTitle,
        userId: 'mock-user'
      },
      timestamp: Date.now()
    };

    console.log('🎭 [MOCK SERVER] Simulando evento de rating:', event);
    
    // Actualizar datos mock
    updateMockRatingStats(movieId, rating, action as 'create' | 'update' | 'delete');
    
    // Enviar evento a otras pestañas
    broadcastToOtherTabs(movieId, rating, action);
    
    this.broadcastEvent(event);
  }

  /**
   * Simular evento de estadísticas actualizadas
   */
  simulateStatsUpdate(movieId: string, averageRating: number, totalRatings: number) {
    const event: MockEvent = {
      type: 'rating-stats-updated',
      movieId,
      data: {
        averageRating,
        totalRatings
      },
      timestamp: Date.now()
    };

    console.log('🎭 [MOCK SERVER] Simulando evento de estadísticas:', event);
    this.broadcastEvent(event);
  }

  /**
   * Transmitir evento a todos los listeners
   */
  private broadcastEvent(event: MockEvent) {
    this.events.push(event);
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error en listener:', error);
      }
    });

    // También emitir evento del DOM para compatibilidad
    console.log('🎭 [MOCK SERVER] Emitiendo evento del DOM:', event);
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'mock-server'
      }
    }));
  }

  /**
   * Simular eventos aleatorios para testing
   */
  startRandomEvents() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎭 [MOCK SERVER] Iniciando eventos aleatorios...');

    const movieIds = [
      '68f84e9aba5b03d95f2d6ce1',
      '68f84e9aba5b03d95f2d6ce2',
      '68f84e9aba5b03d95f2d6ce3',
      '68f84e9aba5b03d95f2d6ce4',
      '68f84e9aba5b03d95f2d6ce5'
    ];

    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      const randomMovieId = movieIds[Math.floor(Math.random() * movieIds.length)];
      const randomRating = Math.floor(Math.random() * 5) + 1;
      const randomAction = Math.random() > 0.5 ? 'create' : 'update';

      this.simulateRatingUpdate(randomMovieId, randomRating, randomAction, 'Película Mock');
      
      // Simular estadísticas después de un delay
      setTimeout(() => {
        this.simulateStatsUpdate(randomMovieId, randomRating, Math.floor(Math.random() * 10) + 1);
      }, 1000);

    }, 10000); // Cada 10 segundos
  }

  /**
   * Detener eventos aleatorios
   */
  stopRandomEvents() {
    this.isRunning = false;
    console.log('🎭 [MOCK SERVER] Deteniendo eventos aleatorios...');
  }

  /**
   * Obtener historial de eventos
   */
  getEventHistory(): MockEvent[] {
    return [...this.events];
  }
}

export const mockRealtimeServer = MockRealtimeServer.getInstance();

// Función para simular evento manual
export const simulateRatingEvent = (movieId: string, rating: number, action: string = 'create') => {
  mockRealtimeServer.simulateRatingUpdate(movieId, rating, action, 'Película de Prueba');
};

// Función para simular estadísticas
export const simulateStatsEvent = (movieId: string, averageRating: number, totalRatings: number) => {
  mockRealtimeServer.simulateStatsUpdate(movieId, averageRating, totalRatings);
};
