// Servicio para manejar películas desde la API
// =============================================

import { API_CONFIG } from '../config/environment';

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
}

export interface MovieVideoInfo {
  movieId: string;
  title: string;
  cloudinaryVideoId: string;
  duration: number;
  width: number;
  height: number;
  format: string;
}

export interface MovieVideoResponse {
  videoUrl: string;
  expiresIn: number;
  movieId: string;
  title: string;
  duration: number;
}

class MovieService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
  }

  /**
   * Obtener película completa por ID
   */
  async getMovie(movieId: string): Promise<Movie> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movies/${movieId}`);
      
      if (!response.ok) {
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
   * Obtener solo el video (URL firmada) por ID
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
   * Obtener información del video por ID
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
   * Obtener múltiples películas por IDs con manejo de errores individual
   */
  async getMovies(movieIds: string[]): Promise<Movie[]> {
    try {
      const promises = movieIds.map(id => this.getMovieSafe(id));
      const results = await Promise.all(promises);
      // Filtrar los resultados nulos (películas no encontradas)
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
   * Obtener película con manejo de errores y fallback
   */
  async getMovieSafe(movieId: string): Promise<Movie | null> {
    try {
      return await this.getMovie(movieId);
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener todas las películas disponibles
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
   * Obtener películas disponibles con fallback
   */
  async getAvailableMovies(): Promise<Movie[]> {
    try {
      return await this.getAllMovies();
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtener películas trending
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
   * Buscar películas
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

export const movieService = new MovieService();
export default movieService;
