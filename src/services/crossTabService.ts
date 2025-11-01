
/**
 * Cross-Tab Communication Service
 * @fileoverview
 * Provides real-time synchronization between multiple browser tabs using the
 * BroadcastChannel API with a fallback to localStorage. This service allows
 * rating and movie statistics updates to be reflected across all open tabs.
 * 
 * @author
 *  - Hernan Garcia  
 *  - Juan Camilo Jimenez  
 *  - Julieta Arteta  
 *  - Jerson Otero  
 *  - Julian Mosquera
 */

/**
 * Represents a cross-tab synchronization event.
 * @interface CrossTabEvent
 */
interface CrossTabEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
  source: 'cross-tab';
}

/**
 * Service responsible for handling communication and synchronization between
 * browser tabs. Uses the BroadcastChannel API when available, and falls back
 * to localStorage-based message passing when not supported.
 *
 * @class CrossTabService
 * @singleton
 */
class CrossTabService {
  private static instance: CrossTabService;
  private broadcastChannel: BroadcastChannel | null = null;
  private isListening = false;

  /**
   * Returns a singleton instance of the CrossTabService.
   * @returns {CrossTabService} Instance of the service
   */
  static getInstance(): CrossTabService {
    if (!CrossTabService.instance) {
      CrossTabService.instance = new CrossTabService();
    }
    return CrossTabService.instance;
  }

  /**
   * Initializes cross-tab communication listeners.
   * Uses BroadcastChannel if supported, otherwise falls back to localStorage.
   */
  init() {
    if (this.isListening) {
      return;
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel('unyfilm-realtime');

        this.broadcastChannel.onmessage = (event) => {
          this.handleCrossTabEvent(event.data);
        };
      } else {
        this.setupLocalStorageListener();
      }

      this.isListening = true;
    } catch (error) {
    }
  }

  /**
   * Sets up a fallback event listener using the localStorage API.
   * This method is automatically used when BroadcastChannel is not available.
   * @private
   */ 
  private setupLocalStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'unyfilm-realtime-event' && event.newValue) {
        try {
          const crossTabEvent: CrossTabEvent = JSON.parse(event.newValue);
          this.handleCrossTabEvent(crossTabEvent);
        } catch (error) {
        }
      }
    });
  }

  /**
   * Handles an incoming cross-tab event and dispatches it as a CustomEvent.
   * @private
   * @param {CrossTabEvent} event - Event data to handle
   */
  private handleCrossTabEvent(event: CrossTabEvent) {
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'cross-tab'
      }
    }));
  }

 
  broadcastToOtherTabs(event: CrossTabEvent) {
    try {
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage(event);
      } else {
        localStorage.setItem('unyfilm-realtime-event', JSON.stringify(event));
        setTimeout(() => {
          localStorage.removeItem('unyfilm-realtime-event');
        }, 100);
      }
    } catch (error) {
    }
  }

  /**
   * Closes the broadcast channel and stops listening for cross-tab events.
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

/**
 * Initializes cross-tab synchronization.
 * Should be called once during application startup.
 */
export const initCrossTabSync = () => crossTabService.init();

/**
 * Broadcasts a "rating-updated" event to all other open browser tabs.
 * 
 * @param {string} movieId - The movie identifier
 * @param {number} rating - The new rating value
 * @param {string} action - Description of the performed action
 */
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
