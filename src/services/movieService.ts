
import { API_CONFIG } from '../config/environment';

/**
 * Interface representing a movie
 * @interface Movie
 */
export interface Movie {
  /** Unique movie identifier */
  _id: string;
  /** Movie title */
  title: string;
  /** Movie description */
  description: string;
  /** Optional movie synopsis */
  synopsis?: string;
  /** Movie poster URL */
  poster: string;
  /** Movie port image URL */
  port: string;
  /** Movie trailer URL */
  trailer: string;
  /** Movie video URL */
  videoUrl: string;
  /** Cloudinary video ID */
  cloudinaryVideoId: string;
  /** Movie duration in minutes */
  duration: number;
  /** Array of movie genres */
  genre: string[];
  /** Movie director */
  director: string;
  /** Array of cast members */
  cast: string[];
  /** Movie language */
  language: string;
  /** Array of movie tags */
  tags: string[];
  /** Number of views */
  views: number;
  /** Movie rating information */
  rating: {
    /** Average rating */
    average: number;
    /** Number of ratings */
    count: number;
  };
  /** Optional release date */
  releaseDate?: string;
  /** Whether the movie is active */
  isActive: boolean;
  /** Available subtitle languages */
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
  /** Default subtitle language */
  defaultSubtitleLanguage?: string;
}

/**
 * Interface for movie video information
 * @interface MovieVideoInfo
 */
export interface MovieVideoInfo {
  /** Movie ID */
  movieId: string;
  /** Movie title */
  title: string;
  /** Cloudinary video ID */
  cloudinaryVideoId: string;
  /** Video duration in seconds */
  duration: number;
  /** Video width in pixels */
  width: number;
  /** Video height in pixels */
  height: number;
  /** Video format */
  format: string;
}

/**
 * Interface for movie video response
 * @interface MovieVideoResponse
 */
export interface MovieVideoResponse {
  /** Video URL */
  videoUrl: string;
  /** Expiration time in seconds */
  expiresIn: number;
  /** Movie ID */
  movieId: string;
  /** Movie title */
  title: string;
  /** Video duration in seconds */
  duration: number;
}

/**
 * Service class for managing movie operations
 * Handles all movie-related API requests
 * @class MovieService
 */
class MovieService {
  /** Base URL for API requests */
  private baseUrl: string;

  /**
   * Creates an instance of MovieService
   */
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
  }

  /**
   * Get a complete movie by ID
   * @param {string} movieId - The movie ID to retrieve
   * @returns {Promise<Movie>} Complete movie information
   * @throws {Error} When movie is not found or API request fails
   */
  async getMovie(movieId: string): Promise<Movie> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/${movieId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.debug(`Película no encontrada: ${movieId}`);
        } else {
          console.error(`Error ${response.status}: ${response.statusText} para película ${movieId}`);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener la película');
      }
      
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get movie video (signed URL) by ID
   * @param {string} movieId - The movie ID to get video for
   * @returns {Promise<MovieVideoResponse>} Video response with signed URL
   * @throws {Error} When API request fails
   */
  async getMovieVideo(movieId: string): Promise<MovieVideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/${movieId}/video`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener el video');
      }
      
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get movie video information by ID
   * @param {string} movieId - The movie ID to get video info for
   * @returns {Promise<MovieVideoInfo>} Video information
   * @throws {Error} When API request fails
   */
  async getMovieVideoInfo(movieId: string): Promise<MovieVideoInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/${movieId}/video/info`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener la información del video');
      }
      
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get multiple movies by IDs with individual error handling
   * @param {string[]} movieIds - Array of movie IDs to retrieve
   * @returns {Promise<Movie[]>} Array of movies (null results are filtered out)
   * @throws {Error} When API request fails
   */
  async getMovies(movieIds: string[]): Promise<Movie[]> {
    try {
      const promises = movieIds.map(id => this.getMovieSafe(id));
      const results = await Promise.all(promises);
      const movies = results.filter((movie): movie is Movie => movie !== null);
      
      if (movies.length === 0) {
        return [];
      }
      
      return movies;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get movie with error handling and fallback
   * @param {string} movieId - The movie ID to retrieve
   * @returns {Promise<Movie | null>} Movie data or null if not found
   */
  async getMovieSafe(movieId: string): Promise<Movie | null> {
    try {
      return await this.getMovie(movieId);
    } catch (error) {
      if (error instanceof Error && !error.message.includes('404')) {
        console.warn(`Error cargando película ${movieId}:`, error.message);
      }
      return null;
    }
  }

  /**
   * Get all available movies
   * @returns {Promise<Movie[]>} Array of all movies
   * @throws {Error} When API request fails
   */
  async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener las películas');
      }
      
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available movies with fallback
   * @returns {Promise<Movie[]>} Array of available movies or empty array on error
   */
  async getAvailableMovies(): Promise<Movie[]> {
    try {
      return await this.getAllMovies();
    } catch (error) {
      return [];
    }
  }

  /**
   * Get trending movies
   * @returns {Promise<Movie[]>} Array of trending movies
   * @throws {Error} When API request fails
   */
  async getTrendingMovies(): Promise<Movie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/trending`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener las películas trending');
      }
      
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search movies by query
   * @param {string} query - Search query string
   * @returns {Promise<Movie[]>} Array of matching movies
   * @throws {Error} When API request fails
   */
  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al buscar películas');
      }
      
      return result.data || [];
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Singleton instance of MovieService
 * @type {MovieService}
 */
export const movieService = new MovieService();

/**
 * Default export of MovieService instance
 * @type {MovieService}
 */
export default movieService;
