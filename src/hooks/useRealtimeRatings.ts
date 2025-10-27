import { useEffect, useState, useCallback } from 'react';
import { getMovieRatingStats, type RatingStats } from '../services/ratingService';

interface UseRealtimeRatingsOptions {
  movieId: string;
  autoLoad?: boolean;
  enableRealtime?: boolean;
}

/**
 * Hook to handle real-time ratings
 * Listens to update events and keeps the state synchronized
 */
export function useRealtimeRatings({ 
  movieId, 
  autoLoad = true, 
  enableRealtime = true 
}: UseRealtimeRatingsOptions) {
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRatingStats = useCallback(async () => {
    if (!movieId) return;

    try {
      setIsLoading(true);
      setError(null);
      const stats = await getMovieRatingStats(movieId);
      setRatingStats(stats);
    } catch (err) {
      console.error('Error loading rating stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (autoLoad) {
      loadRatingStats();
    }
  }, [autoLoad, loadRatingStats]);

  useEffect(() => {
    if (!enableRealtime || !movieId) return;

    const handleRatingUpdate = (event: CustomEvent) => {
      const { movieId: updatedMovieId, rating, action, source } = event.detail;
      
      console.log('🔄 [HOOK] Recibido evento rating-updated:', { updatedMovieId, movieId, rating, action, source });
      
      if (updatedMovieId === movieId) {
        console.log('🔄 [HOOK] Rating actualizado, recargando estadísticas para:', movieId);
        loadRatingStats();
      }
    };

    const handleStatsUpdate = (event: CustomEvent) => {
      const { movieId: updatedMovieId, averageRating, totalRatings, source } = event.detail;
      
      console.log('📊 [HOOK] Recibido evento rating-stats-updated:', { updatedMovieId, movieId, averageRating, totalRatings, source });
      
      if (updatedMovieId === movieId) {
        console.log('📊 [HOOK] Actualizando estadísticas en tiempo real para:', movieId, '→', averageRating);
        setRatingStats(prevStats => {
          if (!prevStats) return null;
          return {
            ...prevStats,
            averageRating,
            totalRatings
          };
        });
      }
    };

    const handleCacheInvalidation = (event: CustomEvent) => {
      const { invalidatedKeys } = event.detail;
      if (invalidatedKeys.includes(`rating-${movieId}`)) {
        console.log('🗑️ Cache invalidado, recargando estadísticas:', movieId);
        loadRatingStats();
      }
    };

    window.addEventListener('rating-updated', handleRatingUpdate as EventListener);
    window.addEventListener('rating-stats-updated', handleStatsUpdate as EventListener);
    window.addEventListener('cache-invalidated', handleCacheInvalidation as EventListener);

    return () => {
      window.removeEventListener('rating-updated', handleRatingUpdate as EventListener);
      window.removeEventListener('rating-stats-updated', handleStatsUpdate as EventListener);
      window.removeEventListener('cache-invalidated', handleCacheInvalidation as EventListener);
    };
  }, [enableRealtime, movieId, loadRatingStats]);

  return {
    ratingStats,
    isLoading,
    error,
    loadRatingStats,
    setRatingStats
  };
}

export default useRealtimeRatings;
