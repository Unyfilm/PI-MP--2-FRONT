import { useState, useEffect } from 'react';
import { getMovieRatingStats } from '../services/ratingService';
import type { RatingStats } from '../services/ratingService';

/**
 * Hook para obtener calificaciones reales de usuarios
 * Solo muestra calificaciones cuando hay calificaciones reales de usuarios
 */
export const useRealRating = (movieId: string | undefined) => {
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealRatings, setHasRealRatings] = useState(false);

  useEffect(() => {
    if (!movieId) {
      setRatingStats(null);
      setHasRealRatings(false);
      return;
    }

    const loadRatingStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getMovieRatingStats(movieId);
        
        
        
        if (stats.totalRatings > 0) {
          setRatingStats(stats);
          setHasRealRatings(true);
        } else {
          setRatingStats(null);
          setHasRealRatings(false);
        }
      } catch (error) {
        setRatingStats(null);
        setHasRealRatings(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadRatingStats();
  }, [movieId]);

  return {
    ratingStats,
    isLoading,
    hasRealRatings,
    averageRating: ratingStats?.averageRating || 0,
    totalRatings: ratingStats?.totalRatings || 0
  };
};
