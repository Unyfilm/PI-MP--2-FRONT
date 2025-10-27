

interface CrossTabEvent {
  type: 'rating-updated' | 'rating-stats-updated';
  movieId: string;
  data: any;
  timestamp: number;
  source: 'cross-tab';
}

class CrossTabService {
  private static instance: CrossTabService;
  private broadcastChannel: BroadcastChannel | null = null;
  private isListening = false;

  static getInstance(): CrossTabService {
    if (!CrossTabService.instance) {
      CrossTabService.instance = new CrossTabService();
    }
    return CrossTabService.instance;
  }

  
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

  
  close() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.isListening = false;
  }
}

export const crossTabService = CrossTabService.getInstance();

export const initCrossTabSync = () => crossTabService.init();

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
