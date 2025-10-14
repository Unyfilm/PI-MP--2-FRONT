/**
 * TypeScript type definitions for movie-related data structures.
 * Ensures type safety across the application.
 */

/**
 * Represents a movie object with all its properties.
 */
export interface Movie {
  /** Unique identifier for the movie */
  id: string;
  
  /** Movie title */
  title: string;
  
  /** Movie description or plot summary */
  description: string;
  
  /** Release year */
  year: number;
  
  /** Movie genre */
  genre: string;
  
  /** Average rating (1-5 stars) */
  rating: number;
  
  /** URL to the movie poster image */
  imageUrl: string;
  
  /** URL to the movie video file */
  videoUrl: string;
  
  /** Movie duration in minutes */
  duration?: number;
  
  /** Director name */
  director?: string;
  
  /** List of actors */
  cast?: string[];
  
  /** Movie language */
  language?: string;
  
  /** Whether the movie is available for streaming */
  isAvailable?: boolean;
  
  /** Creation timestamp */
  createdAt?: string;
  
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Represents search and filter parameters for movies.
 */
export interface MovieFilters {
  /** Search query string */
  search?: string;
  
  /** Filter by genre */
  genre?: string;
  
  /** Filter by year */
  year?: number;
  
  /** Filter by minimum rating */
  minRating?: number;
  
  /** Sort order */
  sortBy?: 'title' | 'year' | 'rating' | 'createdAt';
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  
  /** Page number for pagination */
  page?: number;
  
  /** Number of items per page */
  limit?: number;
}

/**
 * Represents the response from a movie API call.
 */
export interface MovieResponse<T = Movie> {
  /** Array of movies */
  data: T[];
  
  /** Total number of movies matching the query */
  total: number;
  
  /** Current page number */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Whether there are more pages */
  hasNextPage: boolean;
  
  /** Whether there are previous pages */
  hasPrevPage: boolean;
}