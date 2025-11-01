
import { API_CONFIG } from '../config/environment';

/**
 * Represents a movie object returned from the backend.
 * 
 * @interface Movie
 * @property {string} _id - Unique movie identifier.
 * @property {string} title - Movie title.
 * @property {string} description - Movie description text.
 * @property {string} [synopsis] - Optional short synopsis.
 * @property {string} poster - URL of the movie poster image.
 * @property {string} port - URL of the movie port or banner image.
 * @property {string} trailer - URL of the movie trailer.
 * @property {string} videoUrl - URL to stream the movie video.
 * @property {string} cloudinaryVideoId - Cloudinary video asset identifier.
 * @property {number} duration - Movie duration in minutes.
 * @property {string[]} genre - List of genres associated with the movie.
 * @property {string} director - Movie director name.
 * @property {string[]} cast - Array of actor names.
 * @property {string} language - Movie language.
 * @property {string[]} tags - Additional tags or keywords.
 * @property {number} views - Total number of views.
 * @property {{ average: number; count: number }} rating - Rating summary (average and count).
 * @property {string} [releaseDate] - Movie release date in ISO format.
 * @property {boolean} isActive - Indicates whether the movie is available.
 * @property {Array<{ language: string; languageCode: string; url: string; isDefault: boolean }>} [subtitles] - List of available subtitle files.
 * @property {string} [defaultSubtitleLanguage] - Default subtitle language code.
 */
export interface Movie {
  _id: string;
  title: string;
  description: string;
  synopsis?: string;
  poster: string;
  port: string;
  trailer: string;
  videoUrl: string;
  cloudinaryVideoId: string;
  duration: number;
  genre: string[];
  director: string;
  cast: string[];
  language: string;
  tags: string[];
  views: number;
  rating: {
    average: number;
    count: number;
  };
  releaseDate?: string;
  isActive: boolean;
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
  defaultSubtitleLanguage?: string;
}

/**
 * Represents metadata of a movie video file.
 * 
 * @interface MovieVideoInfo
 * @property {string} movieId - ID of the associated movie.
 * @property {string} title - Video title.
 * @property {string} cloudinaryVideoId - Cloudinary public ID of the video.
 * @property {number} duration - Video duration in seconds.
 * @property {number} width - Video width in pixels.
 * @property {number} height - Video height in pixels.
 * @property {string} format - File format (e.g., "mp4").
 */
export interface MovieVideoInfo {
  movieId: string;
  title: string;
  cloudinaryVideoId: string;
  duration: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Represents a signed video URL response from the backend.
 * 
 * @interface MovieVideoResponse
 * @property {string} videoUrl - Temporary signed video URL.
 * @property {number} expiresIn - Expiration time of the URL in seconds.
 * @property {string} movieId - Associated movie ID.
 * @property {string} title - Movie title.
 * @property {number} duration - Video duration.
 */
export interface MovieVideoResponse {
  videoUrl: string;
  expiresIn: number;
  movieId: string;
  title: string;
  duration: number;
}

/**
 * Service class for managing all movie-related API operations.
 * Provides methods to fetch, search, and retrieve movie data and videos.
 * 
 * @class MovieService
 */
class MovieService {
  private baseUrl: string;

  /**
   * Creates an instance of MovieService and sets the base URL.
   */
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
  }

  /**
   * Retrieves full movie data by ID.
   * 
   * @async
   * @param {string} movieId - The ID of the movie to fetch.
   * @returns {Promise<Movie>} A Promise resolving with the complete movie object.
   * @throws {Error} If the movie is not found or the API request fails.
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
   * Retrieves a signed video URL for the specified movie.
   * 
   * @async
   * @param {string} movieId - The ID of the movie.
   * @returns {Promise<MovieVideoResponse>} A Promise resolving with video URL data.
   * @throws {Error} If the API request fails.
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
   * Retrieves detailed video metadata for a given movie.
   * 
   * @async
   * @param {string} movieId - The ID of the movie.
   * @returns {Promise<MovieVideoInfo>} A Promise resolving with video metadata.
   * @throws {Error} If the API request fails.
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
   * Fetches multiple movies by their IDs.
   * Invalid or missing movies are filtered out.
   * 
   * @async
   * @param {string[]} movieIds - Array of movie IDs.
   * @returns {Promise<Movie[]>} A Promise resolving with an array of valid movies.
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
   * Fetches a movie safely, returning `null` if not found or on error.
   * 
   * @async
   * @param {string} movieId - The ID of the movie.
   * @returns {Promise<Movie | null>} The movie or null if unavailable.
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
   * Retrieves all movies from the API.
   * 
   * @async
   * @returns {Promise<Movie[]>} Array of all movies.
   * @throws {Error} If the API request fails.
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
   * Retrieves all available movies, returning an empty array if unavailable.
   * 
   * @async
   * @returns {Promise<Movie[]>} Array of available movies or empty array on error.
   */
  async getAvailableMovies(): Promise<Movie[]> {
    try {
      return await this.getAllMovies();
    } catch (error) {
      return [];
    }
  }

  /**
   * Retrieves trending movies from the backend.
   * 
   * @async
   * @returns {Promise<Movie[]>} Array of trending movies.
   * @throws {Error} If the API request fails.
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
