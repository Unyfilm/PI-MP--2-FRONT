
/**
 * Cross-Browser Synchronization Service
 * @fileoverview
 * Provides a mechanism to synchronize real-time events between multiple
 * browser tabs using localStorage. This service is primarily used to
 * broadcast updates such as rating changes or statistics across tabs.
 * 
 * @author
 *  - Hernan Garcia  
 *  - Juan Camilo Jimenez  
 *  - Julieta Arteta  
 *  - Jerson Otero  
 *  - Julian Mosquera
 */

/**
 * Represents a cross-browser synchronization event
 * @interface CrossBrowserEvent
 */
interface CrossBrowserEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
  browserId: string;
}

/**
 * Service responsible for managing event synchronization between browser tabs.
 * It uses localStorage polling to share events such as movie rating updates.
 * 
 * @class CrossBrowserService
 * @singleton
 */
class CrossBrowserService {
  private static instance: CrossBrowserService;
  private browserId: string;
  private isPolling = false;
  private pollInterval: number = 2000; 
  private lastProcessedTimestamp: number = 0;
  private pollTimer: number | null = null;

  static getInstance(): CrossBrowserService {
    if (!CrossBrowserService.instance) {
      CrossBrowserService.instance = new CrossBrowserService();
    }
    return CrossBrowserService.instance;
  }

  constructor() {
    this.browserId = this.generateBrowserId();
  }


  private generateBrowserId(): string {
    const existingId = localStorage.getItem('browser-id');
    if (existingId) {
      return existingId;
    }
    
    const newId = `browser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('browser-id', newId);
    return newId;
  }

  startPolling() {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    this.lastProcessedTimestamp = Date.now();

    this.pollTimer = setInterval(() => {
      this.checkForNewEvents();
    }, this.pollInterval) as any;
  }

  
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.isPolling = false;
  }

  
  private checkForNewEvents() {
    try {
      const eventsData = localStorage.getItem('cross-browser-events');
      if (!eventsData) return;

      const events: CrossBrowserEvent[] = JSON.parse(eventsData);
      
      const newEvents = events.filter(event => 
        event.timestamp > this.lastProcessedTimestamp && 
        event.browserId !== this.browserId
      );

      if (newEvents.length > 0) {
        newEvents.forEach(event => {
          this.processCrossBrowserEvent(event);
        });

        this.lastProcessedTimestamp = Math.max(...newEvents.map(e => e.timestamp));
      }
    } catch (error) {
      console.error('❌ [CROSS BROWSER] Error verificando eventos:', error);
    }
  }

  
  private processCrossBrowserEvent(event: CrossBrowserEvent) {
    window.dispatchEvent(new CustomEvent(event.type, {
      detail: {
        movieId: event.movieId,
        ...event.data,
        timestamp: event.timestamp,
        source: 'cross-browser',
        browserId: event.browserId
      }
    }));
  }

  
  sendEvent(type: 'rating-updated' | 'rating-stats-updated', movieId: string, data: any) {
    const event: CrossBrowserEvent = {
      type,
      movieId,
      data,
      timestamp: Date.now(),
      browserId: this.browserId
    };

    try {
      const existingEvents = localStorage.getItem('cross-browser-events');
      let events: CrossBrowserEvent[] = existingEvents ? JSON.parse(existingEvents) : [];

      events.push(event);

      if (events.length > 50) {
        events = events.slice(-50);
      }

      localStorage.setItem('cross-browser-events', JSON.stringify(events));
    } catch (error) {
      console.error('❌ [CROSS BROWSER] Error enviando evento:', error);
    }
  }

  
  getStatus() {
    return {
      browserId: this.browserId,
      isPolling: this.isPolling,
      pollInterval: this.pollInterval
    };
  }
}

export const crossBrowserService = CrossBrowserService.getInstance();

export const startCrossBrowserSync = () => crossBrowserService.startPolling();

export const stopCrossBrowserSync = () => crossBrowserService.stopPolling();

export const sendCrossBrowserEvent = (type: 'rating-updated' | 'rating-stats-updated', movieId: string, data: any) => {
  crossBrowserService.sendEvent(type, movieId, data);
};

export const getCrossBrowserStatus = () => crossBrowserService.getStatus();
