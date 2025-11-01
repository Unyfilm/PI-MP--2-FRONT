
/**
 * Mock Realtime Server
 * @fileoverview
 * Provides a simulated real-time event system for ratings and statistics updates.
 * This service emulates a WebSocket or server push mechanism for development
 * and testing environments. It integrates with mock rating updates and
 * cross-tab communication to mimic a live data flow experience.
 * 
 * @note This mock server is for **development and testing** only.
 * It does not persist data or establish real network connections.
 * 
 * @version 3.0.0
 * @author
 *  - Hernan Garcia  
 *  - Juan Camilo Jimenez  
 *  - Julieta Arteta  
 *  - Jerson Otero  
 *  - Julian Mosquera
 */
import { updateMockRatingStats } from './mockRatingService';
import { broadcastToOtherTabs } from './crossTabService';

/**
 * Interface representing a mock real-time event.
 * 
 * @interface MockEvent
 * @property {'rating-updated' | 'rating-stats-updated'} type - The type of event emitted.
 * @property {string} movieId - Unique identifier for the affected movie.
 * @property {any} data - Associated payload containing event-specific data.
 * @property {number} timestamp - The timestamp when the event was generated.
 */
interface MockEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
}

/**
 * MockRealtimeServer class simulates a live server that dispatches events
 * across browser contexts. It maintains event listeners, logs, and can emit
 * randomized rating updates for testing the frontend real-time logic.
 * 
 * @class MockRealtimeServer
 * @singleton
 */
class MockRealtimeServer {
  private static instance: MockRealtimeServer;
  private events: MockEvent[] = [];
  private listeners: Set<(event: MockEvent) => void> = new Set();
  private isRunning = false;

  /**
   * Returns the singleton instance of the mock realtime server.
   * 
   * @static
   * @returns {MockRealtimeServer} The single instance of MockRealtimeServer.
   */
  static getInstance(): MockRealtimeServer {
    if (!MockRealtimeServer.instance) {
      MockRealtimeServer.instance = new MockRealtimeServer();
    }
    return MockRealtimeServer.instance;
  }
  /**
   * Simulates a new rating update event.
   * Updates the mock rating stats, notifies other browser tabs, and
   * broadcasts the event through the DOM.
   * 
   * @param {string} movieId - The movie being rated.
   * @param {number} rating - The numeric rating value (1–5).
   * @param {string} action - The rating action type ('create', 'update', or 'delete').
   * @param {string} movieTitle - The title of the movie for display purposes.
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

    
    updateMockRatingStats(movieId, rating, action as 'create' | 'update' | 'delete');
    
    broadcastToOtherTabs(movieId, rating, action);
    
    this.broadcastEvent(event);
  }

  /**
   * Simulates a movie statistics update event.
   * Typically triggered after a rating change.
   * 
   * @param {string} movieId - The movie whose statistics are being updated.
   * @param {number} averageRating - The new average rating.
   * @param {number} totalRatings - The updated total number of ratings.
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

    this.broadcastEvent(event);
  }

  /**
   * Broadcasts an event to all registered listeners and as a DOM CustomEvent.
   * 
   * @private
   * @param {MockEvent} event - The mock event to broadcast.
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
   * Starts automatic random event generation for testing real-time updates.
   * Emits simulated movie rating events every 10 seconds.
   */
  startRandomEvents() {
    if (this.isRunning) return;
    
    this.isRunning = true;

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
      
      setTimeout(() => {
        this.simulateStatsUpdate(randomMovieId, randomRating, Math.floor(Math.random() * 10) + 1);
      }, 1000);

    }, 10000); 
  }

  /**
   * Stops the generation of random mock events.
   */
  stopRandomEvents() {
    this.isRunning = false;
  }

  /**
   * Returns the full history of emitted mock events.
   * 
   * @returns {MockEvent[]} List of all mock events emitted since initialization.
   */
  getEventHistory(): MockEvent[] {
    return [...this.events];
  }
}

export const mockRealtimeServer = MockRealtimeServer.getInstance();

/**
 * Helper function to trigger a single mock rating event.
 * 
 * @param {string} movieId - The movie ID to simulate.
 * @param {number} rating - The rating value.
 * @param {string} [action='create'] - The rating action type.
 */
export const simulateRatingEvent = (movieId: string, rating: number, action: string = 'create') => {
  mockRealtimeServer.simulateRatingUpdate(movieId, rating, action, 'Película de Prueba');
};

/**
 * Helper function to trigger a mock statistics update event.
 * 
 * @param {string} movieId - The movie ID to simulate.
 * @param {number} averageRating - The new average rating.
 * @param {number} totalRatings - The total ratings count.
 */
export const simulateStatsEvent = (movieId: string, averageRating: number, totalRatings: number) => {
  mockRealtimeServer.simulateStatsUpdate(movieId, averageRating, totalRatings);
};
