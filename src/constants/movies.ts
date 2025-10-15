/**
 * Constants related to movies and the movie catalog.
 * Contains default values, configuration, and static data.
 */

/**
 * Default movie genres available in the application.
 * 
 * @constant {string[]} MOVIE_GENRES
 */
export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western'
] as const;

/**
 * Sort options available for the movie catalog.
 * 
 * @constant {object} SORT_OPTIONS
 */
export const SORT_OPTIONS = {
  TITLE_ASC: 'title-asc',
  TITLE_DESC: 'title-desc',
  YEAR_ASC: 'year-asc',
  YEAR_DESC: 'year-desc',
  RATING_ASC: 'rating-asc',
  RATING_DESC: 'rating-desc',
  NEWEST: 'newest',
  OLDEST: 'oldest'
} as const;

/**
 * Default pagination settings.
 * 
 * @constant {object} PAGINATION_DEFAULTS
 */
export const PAGINATION_DEFAULTS = {
  /** Default number of movies per page */
  ITEMS_PER_PAGE: 12,
  
  /** Maximum number of movies per page */
  MAX_ITEMS_PER_PAGE: 50,
  
  /** Default page number */
  DEFAULT_PAGE: 1
} as const;

/**
 * Movie rating scale configuration.
 * 
 * @constant {object} RATING_SCALE
 */
export const RATING_SCALE = {
  /** Minimum rating value */
  MIN: 1,
  
  /** Maximum rating value */
  MAX: 5,
  
  /** Default rating value */
  DEFAULT: 0
} as const;

/**
 * Movie duration categories.
 * 
 * @constant {object} DURATION_CATEGORIES
 */
export const DURATION_CATEGORIES = {
  SHORT: { min: 0, max: 60, label: 'Short (< 1h)' },
  MEDIUM: { min: 60, max: 120, label: 'Medium (1-2h)' },
  LONG: { min: 120, max: 180, label: 'Long (2-3h)' },
  EPIC: { min: 180, max: Infinity, label: 'Epic (3h+)' }
} as const;

/**
 * Default movie poster placeholder.
 * 
 * @constant {string} DEFAULT_POSTER_URL
 */
export const DEFAULT_POSTER_URL = 'https://via.placeholder.com/300x450?text=No+Image';

/**
 * Default movie video placeholder.
 * 
 * @constant {string} DEFAULT_VIDEO_URL
 */
export const DEFAULT_VIDEO_URL = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';

/**
 * API endpoints for movie-related operations.
 * 
 * @constant {object} API_ENDPOINTS
 */
export const API_ENDPOINTS = {
  /** Get all movies */
  MOVIES: '/movies',
  
  /** Get movie by ID */
  MOVIE_BY_ID: (id: string) => `/movies/${id}`,
  
  /** Search movies */
  SEARCH_MOVIES: '/movies/search',
  
  /** Get movies by genre */
  MOVIES_BY_GENRE: (genre: string) => `/movies/genre/${genre}`,
  
  /** Get featured movies */
  FEATURED_MOVIES: '/movies/featured',
  
  /** Get popular movies */
  POPULAR_MOVIES: '/movies/popular',
  
  /** Get recent movies */
  RECENT_MOVIES: '/movies/recent'
} as const;

/**
 * Local storage keys for movie-related data.
 * 
 * @constant {object} STORAGE_KEYS
 */
export const STORAGE_KEYS = {
  /** User's favorite movies */
  FAVORITES: 'unyfilm_favorites',
  
  /** User's watch history */
  WATCH_HISTORY: 'unyfilm_watch_history',
  
  /** User's search history */
  SEARCH_HISTORY: 'unyfilm_search_history',
  
  /** User's preferred filters */
  PREFERRED_FILTERS: 'unyfilm_preferred_filters'
} as const;

/**
 * Error messages for movie-related operations.
 * 
 * @constant {object} ERROR_MESSAGES
 */
export const ERROR_MESSAGES = {
  MOVIE_NOT_FOUND: 'Movie not found',
  FAILED_TO_LOAD_MOVIES: 'Failed to load movies',
  FAILED_TO_LOAD_MOVIE: 'Failed to load movie details',
  SEARCH_FAILED: 'Search failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_MOVIE_ID: 'Invalid movie ID',
  MOVIE_UNAVAILABLE: 'This movie is currently unavailable'
} as const;

/**
 * Success messages for movie-related operations.
 * 
 * @constant {object} SUCCESS_MESSAGES
 */
export const SUCCESS_MESSAGES = {
  MOVIE_ADDED_TO_FAVORITES: 'Movie added to favorites',
  MOVIE_REMOVED_FROM_FAVORITES: 'Movie removed from favorites',
  SEARCH_COMPLETED: 'Search completed successfully'
} as const;
