/**
 * RatingService
 *
 * Service for handling movie ratings and statistics from the backend API.
 * Provides methods to fetch rating statistics and user ratings.
 *
 * @fileoverview Service for movie rating operations
 */

import { API_CONFIG } from '../config/environment';
import { ratingCache } from './ratingCache';

export interface RatingStats {
  movieId: string;
  averageRating: number;
  totalRatings: number;
  distribution: {
    [key: string]: number;
  };
}

export interface UserRating {
  id: string;
  movieId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  data?: RatingStats | UserRating;
}

/**
 * Get movie rating statistics (average, total ratings, distribution)
 * @param movieId - The movie ID to get statistics for
 * @returns Promise<RatingStats> - Rating statistics for the movie
 */
export const getMovieRatingStats = async (movieId: string): Promise<RatingStats> => {
  try {
    const cached = ratingCache.get(movieId);
    if (cached) {
      return cached;
    }

    if (!movieId || movieId.trim() === '') {
      return {
        movieId: movieId || 'unknown',
        averageRating: 0,
        totalRatings: 0,
        distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      };
    }

    const url = `${API_CONFIG.BASE_URL}/ratings/movie/${movieId}/stats`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        const defaultStats = {
          movieId,
          averageRating: 0,
          totalRatings: 0,
          distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        };
        ratingCache.set(movieId, defaultStats);
        return defaultStats;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RatingResponse = await response.json();
    
    if (data.success && data.data) {
      const stats = data.data as RatingStats;
      ratingCache.set(movieId, stats);
      return stats;
    } else {
      throw new Error(data.message || 'Error al obtener estadísticas de calificación');
    }
  } catch (error) {
    if (error instanceof Error && !error.message.includes('404')) {
    }
    return {
      movieId,
      averageRating: 0,
      totalRatings: 0,
      distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    };
  }
};

/**
 * Get user's rating for a specific movie
 * @param movieId - The movie ID to get user rating for
 * @returns Promise<UserRating | null> - User's rating or null if not rated
 */
export const getUserRating = async (movieId: string): Promise<UserRating | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/ratings/movie/${movieId}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RatingResponse = await response.json();
    
    if (data.success && data.data) {
      return data.data as UserRating;
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error && !error.message.includes('404')) {
    }
    return null;
  }
};

/**
 * Rate a movie (create or update rating)
 * @param movieId - The movie ID to rate
 * @param rating - Rating value (1-5)
 * @returns Promise<boolean> - Success status
 */
export const rateMovie = async (movieId: string, rating: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        movieId,
        rating
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RatingResponse = await response.json();
    
    if (data.success) {
      ratingCache.invalidate(movieId);
    }
    
    return data.success;
  } catch (error) {
    return false;
  }
};

/**
 * Update existing rating
 * @param ratingId - The rating ID to update
 * @param rating - New rating value (1-5)
 * @param movieId - The movie ID for cache invalidation
 * @returns Promise<boolean> - Success status
 */
export const updateRating = async (ratingId: string, rating: number, movieId?: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/ratings/${ratingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rating
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RatingResponse = await response.json();
    
    if (data.success && movieId) {
      ratingCache.invalidate(movieId);
    }
    
    return data.success;
  } catch (error) {
    return false;
  }
};

/**
 * Delete user's rating for a movie
 * @param movieId - The movie ID to delete rating for
 * @returns Promise<boolean> - Success status
 */
export const deleteRating = async (movieId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/ratings/movie/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RatingResponse = await response.json();
    
    if (data.success) {
      ratingCache.invalidate(movieId);
    }
    
    return data.success;
  } catch (error) {
    return false;
  }
};

export default {
  getMovieRatingStats,
  getUserRating,
  rateMovie,
  updateRating,
  deleteRating
};