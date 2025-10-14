/**
 * Type definitions for movie-related data structures.
 */

/**
 * Represents a movie object with all its properties.
 * 
 * @interface Movie
 */
export interface Movie {
  /** Unique identifier for the movie */
  id: string;
  /** Movie title */
  title: string;
  /** Movie description or synopsis */
  description: string;
  /** Release year */
  year: number;
  /** Movie genre */
  genre: string;
  /** User rating (1-5 stars) */
  rating: number;
  /** URL to movie poster image */
  imageUrl: string;
  /** URL to movie video file */
  videoUrl: string;
  /** Movie duration in minutes */
  duration: number;
  /** Movie director */
  director: string;
  /** List of main actors */
  cast: string[];
  /** Movie age rating (PG, PG-13, R, etc.) */
  ageRating: string;
  /** Whether the movie is currently trending */
  isTrending: boolean;
  /** Whether the movie is featured */
  isFeatured: boolean;
  /** Date when the movie was added to the platform */
  createdAt: string;
  /** Date when the movie was last updated */
  updatedAt: string;
}

/**
 * Represents a movie category or genre.
 * 
 * @interface MovieCategory
 */
export interface MovieCategory {
  /** Unique identifier for the category */
  id: string;
  /** Category name */
  name: string;
  /** Category description */
  description: string;
  /** Number of movies in this category */
  movieCount: number;
}

/**
 * Represents search and filter parameters for movies.
 * 
 * @interface MovieFilters
 */
export interface MovieFilters {
  /** Search query string */
  search?: string;
  /** Filter by genre */
  genre?: string;
  /** Filter by year range */
  yearFrom?: number;
  yearTo?: number;
  /** Filter by rating minimum */
  minRating?: number;
  /** Filter by trending movies only */
  trendingOnly?: boolean;
  /** Filter by featured movies only */
  featuredOnly?: boolean;
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
 * Represents the response from movie API endpoints.
 * 
 * @interface MovieResponse
 * @template T - The type of data returned
 */
export interface MovieResponse<T = Movie> {
  /** Array of movie data */
  data: T[];
  /** Total number of movies matching the query */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages available */
  hasNextPage: boolean;
  /** Whether there are previous pages available */
  hasPrevPage: boolean;
}

/**
 * Represents a movie card component props.
 * 
 * @interface MovieCardProps
 */
export interface MovieCardProps {
  /** Movie data to display */
  movie: Movie;
  /** Whether the movie is favorited by the user */
  isFavorited?: boolean;
  /** Callback when movie is clicked */
  onMovieClick?: (movie: Movie) => void;
  /** Callback when favorite button is clicked */
  onFavoriteClick?: (movie: Movie) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the favorite button */
  showFavoriteButton?: boolean;
  /** Size variant for the card */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Represents the state of the movie catalog.
 * 
 * @interface MovieCatalogState
 */
export interface MovieCatalogState {
  /** Array of movies */
  movies: Movie[];
  /** Array of categories */
  categories: MovieCategory[];
  /** Current search query */
  searchQuery: string;
  /** Current selected genre */
  selectedGenre: string;
  /** Current sort option */
  sortBy: string;
  /** Current sort order */
  sortOrder: 'asc' | 'desc';
  /** Whether data is loading */
  isLoading: boolean;
  /** Current error message */
  error: string | null;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
}
