/**
 * @file useRealRating.ts
 * @description Custom React Hook that retrieves and manages real-time rating statistics
 * for a specific movie. It fetches the average rating and total number of ratings
 * from the backend service and provides reactive updates whenever the movie ID changes.
 *
 * This hook ensures a clear distinction between movies with actual ratings
 * and those without, allowing the UI to render accurate feedback and statistics.
 *
 * @module Hooks/useRealRating
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import { useState, useEffect } from 'react';
import { getMovieRatingStats } from '../services/ratingService';
import type { RatingStats } from '../services/ratingService';

/**
 * useRealRating
 *
 * Custom hook for fetching and managing real rating statistics for a given movie.
 * It automatically retrieves data when the `movieId` changes and exposes loading
 * and availability states for flexible UI handling.
 *
 * @param {string | undefined} movieId - Unique identifier of the movie whose ratings will be fetched.
 * 
 * @example
 * const { averageRating, totalRatings, isLoading, hasRealRatings } = useRealRating(movieId);
 * 
 * @returns {{
 *  ratingStats: RatingStats | null;
 *  isLoading: boolean;
 *  hasRealRatings: boolean;
 *  averageRating: number;
 *  totalRatings: number;
 * }}
 * Returns the current rating statistics, loading state, and computed values.
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

    /**
     * Loads rating statistics for the given movie.
     * Updates both average rating and total rating count.
     */
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
