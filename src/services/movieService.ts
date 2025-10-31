
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
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
  defaultSubtitleLanguage?: string;
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

  async getAvailableMovies(): Promise<Movie[]> {
    try {
      return await this.getAllMovies();
    } catch (error) {
      return [];
    }
  }

  
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
