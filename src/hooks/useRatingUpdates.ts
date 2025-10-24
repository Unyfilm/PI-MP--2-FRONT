/**
 * Custom hook for real-time rating updates
 * 
 * Provides a way to listen for rating changes across the application
 * and update all rating displays in real-time.
 */

import { useEffect, useCallback } from 'react';
import { getMovieRatingStats } from '../services/ratingService';
import type { RatingStats } from '../services/ratingService';

interface RatingUpdateEvent {
  movieId: string;
  rating: number;
  action: 'create' | 'update' | 'delete';
}

/**
 * Custom hook for real-time rating updates
 * @param movieId - The movie ID to listen for updates
 * @param onRatingUpdate - Callback function when rating is updated
 * @param enablePolling - Whether to enable polling for updates
 * @param pollInterval - Polling interval in milliseconds
 */
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

/**
 * Broadcast rating update to all components
 * @param movieId - The movie ID that was updated
 * @param rating - The new rating value
 * @param action - The action performed (create, update, delete)
 */
export const broadcastRatingUpdate = (
  movieId: string,
  rating: number,
  action: 'create' | 'update' | 'delete'
) => {
  const event = new CustomEvent('ratingUpdated', {
    detail: { movieId, rating, action }
  });
  
  window.dispatchEvent(event);
};

export default useRatingUpdates;
