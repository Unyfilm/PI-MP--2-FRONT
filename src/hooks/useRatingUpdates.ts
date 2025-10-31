

import { useEffect, useCallback } from 'react';
import { getMovieRatingStats } from '../services/ratingService';
import type { RatingStats } from '../services/ratingService';

interface RatingUpdateEvent {
  movieId: string;
  rating: number;
  action: 'create' | 'update' | 'delete';
}


export const useRatingUpdates = (
  movieId: string,
  onRatingUpdate: (stats: RatingStats) => void,
  enablePolling: boolean = false,
  pollInterval: number = 5000
) => {
  const handleRatingUpdate = useCallback(async (event: CustomEvent<RatingUpdateEvent>) => {
    const { movieId: eventMovieId } = event.detail;
    
    if (eventMovieId === movieId) {
      try {
        const stats = await getMovieRatingStats(movieId);
        onRatingUpdate(stats);
      } catch (error) {
        console.error('Error updating rating stats:', error);
      }
    }
  }, [movieId, onRatingUpdate]);

  useEffect(() => {
    let isProcessing = false;

    const eventHandler = (event: Event) => {
      if (isProcessing) return;
      isProcessing = true;
      handleRatingUpdate(event as CustomEvent<RatingUpdateEvent>);
      setTimeout(() => { isProcessing = false; }, 100);
    };

    const realtimeEventHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.movieId === movieId && !isProcessing) {
        isProcessing = true;
        console.log('🔄 [HOOK] Evento de tiempo real recibido:', customEvent.detail);
        getMovieRatingStats(movieId)
          .then(stats => {
            console.log('📊 [HOOK] Estadísticas actualizadas:', stats);
            onRatingUpdate(stats);
          })
          .catch(error => console.error('Error actualizando stats desde tiempo real:', error))
          .finally(() => {
            setTimeout(() => { isProcessing = false; }, 100);
          });
      }
    };

    window.addEventListener('ratingUpdated', eventHandler);
    window.addEventListener('rating-updated', realtimeEventHandler);

    return () => {
      window.removeEventListener('ratingUpdated', eventHandler);
      window.removeEventListener('rating-updated', realtimeEventHandler);
    };
  }, [movieId, onRatingUpdate]);

  useEffect(() => {
    if (!enablePolling) return;

    const interval = setInterval(async () => {
      try {
        const stats = await getMovieRatingStats(movieId);
        onRatingUpdate(stats);
      } catch (error) {
        console.error('Error polling rating stats:', error);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [movieId, onRatingUpdate, enablePolling, pollInterval]);
};


export const broadcastRatingUpdate = (
  movieId: string,
  rating: number,
  action: 'create' | 'update' | 'delete'
) => {
  
  const ratingEvent = new CustomEvent('rating-updated', {
    detail: { movieId, rating, action, source: 'interactive-rating' }
  });
  window.dispatchEvent(ratingEvent);
  
  
  const statsEvent = new CustomEvent('rating-stats-updated', {
    detail: { movieId, source: 'interactive-rating' }
  });
  window.dispatchEvent(statsEvent);
};

export default useRatingUpdates;
