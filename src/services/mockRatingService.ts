/**
 * Mock Rating Service
 * @fileoverview
 * Provides simulated rating data for movies when the backend is unavailable
 * or for development/testing purposes. This mock service generates and updates
 * fake rating statistics stored in memory using a Map-based cache.
 * 
 * @author
 *  - Hernan Garcia  
 *  - Juan Camilo Jimenez  
 *  - Julieta Arteta  
 *  - Jerson Otero  
 *  - Julian Mosquera
 * @version 3.0.0
 */

import type { RatingStats } from './ratingService';

/**
 * In-memory cache for storing mock rating statistics.
 * Uses the movie ID as the key and `RatingStats` as the value.
 */
const mockDataCache = new Map<string, RatingStats>();


/**
 * Generates random mock rating statistics for a given movie.
 * Used when no existing data is found in the cache.
 * 
 * @function generateMockRatingStats
 * @param {string} movieId - The unique movie identifier
 * @returns {RatingStats} Randomly generated rating statistics
 */
const generateMockRatingStats = (movieId: string): RatingStats => {
  const averageRating = Math.random() * 2 + 3;
  const totalRatings = Math.floor(Math.random() * 100) + 5;
  
  return {
    movieId,
    averageRating: Number(averageRating.toFixed(1)),
    totalRatings,
    distribution: {
      '1': Math.floor(Math.random() * 5),
      '2': Math.floor(Math.random() * 10),
      '3': Math.floor(Math.random() * 15),
      '4': Math.floor(Math.random() * 20),
      '5': Math.floor(Math.random() * 25)
    }
  };
};


/**
 * Retrieves mock rating statistics for a movie from cache or generates new data if missing.
 * 
 * @async
 * @function getMockRatingStats
 * @param {string} movieId - The unique movie identifier
 * @returns {Promise<RatingStats>} A promise that resolves with the movie's rating stats
 */
export const getMockRatingStats = async (movieId: string): Promise<RatingStats> => {
  if (mockDataCache.has(movieId)) {
    return mockDataCache.get(movieId)!;
  }
  const mockStats = generateMockRatingStats(movieId);
  mockDataCache.set(movieId, mockStats);
  
  return mockStats;
};

/**
 * Updates the mock rating statistics for a specific movie.
 * Handles create, update, and delete actions for simulated ratings.
 * 
 * @function updateMockRatingStats
 * @param {string} movieId - The movie identifier
 * @param {number} newRating - The new rating value
 * @param {'create' | 'update' | 'delete'} action - The action performed on the rating
 */
export const updateMockRatingStats = (movieId: string, newRating: number, action: 'create' | 'update' | 'delete') => {
  const currentStats = mockDataCache.get(movieId);
  
  if (!currentStats) {
    
    const newStats = generateMockRatingStats(movieId);
    newStats.averageRating = newRating;
    newStats.totalRatings = 1;
    mockDataCache.set(movieId, newStats);

    return;
  }

 
  let newTotalRatings = currentStats.totalRatings;
  let newAverageRating = currentStats.averageRating;

  if (action === 'create') {
    newTotalRatings += 1;
    
    const currentSum = currentStats.averageRating * currentStats.totalRatings;
    newAverageRating = (currentSum + newRating) / newTotalRatings;
  } else if (action === 'update') {
    
    const currentSum = currentStats.averageRating * currentStats.totalRatings;
    newAverageRating = (currentSum - currentStats.averageRating + newRating) / newTotalRatings;
  } else if (action === 'delete') {
    newTotalRatings = Math.max(0, newTotalRatings - 1);
    if (newTotalRatings === 0) {
      newAverageRating = 0;
    } else {
      const currentSum = currentStats.averageRating * currentStats.totalRatings;
      newAverageRating = (currentSum - newRating) / newTotalRatings;
    }
  }

  const updatedStats: RatingStats = {
    ...currentStats,
    averageRating: Number(newAverageRating.toFixed(1)),
    totalRatings: newTotalRatings
  };

  mockDataCache.set(movieId, updatedStats);
};


export const clearMockCache = () => {
  mockDataCache.clear();
};
