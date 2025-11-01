/**
 * Cloudinary Validation Service
 * @fileoverview Provides validation and fallback management for Cloudinary URLs used in UnyFilm.
 * Includes utilities for validating, checking existence, and processing fallback resources
 * for both images and videos.
 * 
 * @class CloudinaryValidationService
 * @author
 *  - Hernan Garcia
 *  - Juan Camilo Jimenez
 *  - Julieta Arteta
 *  - Jerson Otero
 *  - Julian Mosquera
 */
class CloudinaryValidationService {
  
  /**
   * Validates whether a given URL is a valid Cloudinary URL.
   * @param {string} url - The URL to validate.
   * @returns {boolean} True if the URL matches the Cloudinary format.
   */
  isValidCloudinaryUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_]+\/(image|video)\/upload\//;
    return cloudinaryPattern.test(url);
  }

  /**
   * Checks if a given Cloudinary URL exists by performing a HEAD request.
   * @param {string} url - The URL to verify.
   * @returns {Promise<boolean>} True if the URL exists and returns a valid response.
   */
  async validateUrlExists(url: string): Promise<boolean> {
    if (!this.isValidCloudinaryUrl(url)) {
      return false;
    }

    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' 
      });
      return response.ok;
    } catch (error) {
      console.warn(`⚠️ No se pudo validar URL: ${url}`, error);
      return false;
    }
  }

  /**
   * Returns a fallback image URL based on the given type.
   * @param {'poster' | 'port' | 'hero'} [type='poster'] - The image type.
   * @returns {string} The fallback image URL.
   */
  getFallbackImageUrl(type: 'poster' | 'port' | 'hero' = 'poster'): string {
    const fallbackImages = {
      poster: '/images/default-movie.jpg',
      port: '/images/default-hero.jpg',
      hero: '/images/default-hero.jpg'
    };
    
    return fallbackImages[type];
  }

  /**
   * Returns the fallback video URL.
   * @returns {string} The fallback video URL.
   */
  getFallbackVideoUrl(): string {
    return '/videos/default-trailer.mp4';
  }

  /**
   * Validates an image URL and returns either the valid URL or a fallback one.
   * @param {string} url - The original image URL.
   * @param {'poster' | 'port' | 'hero'} [type='poster'] - The image type.
   * @returns {Promise<string>} A valid image URL or a fallback.
   */
  async processImageUrl(url: string, type: 'poster' | 'port' | 'hero' = 'poster'): Promise<string> {
    if (!url) {
      return this.getFallbackImageUrl(type);
    }

    if (!this.isValidCloudinaryUrl(url)) {
      console.warn(`⚠️ URL de imagen inválida: ${url}`);
      return this.getFallbackImageUrl(type);
    }

    
    return url;
  }

  /**
   * Validates a video URL and returns either the valid URL or a fallback one.
   * @param {string} url - The original video URL.
   * @returns {Promise<string>} A valid video URL or a fallback.
   */
  async processVideoUrl(url: string): Promise<string> {
    if (!url) {
      return this.getFallbackVideoUrl();
    }

    if (!this.isValidCloudinaryUrl(url)) {
      console.warn(`⚠️ URL de video inválida: ${url}`);
      return this.getFallbackVideoUrl();
    }

    return url;
  }

  /**
   * Processes and validates all media URLs within a movie object.
   * Applies fallback URLs when necessary.
   * @param {any} movie - The movie object containing URLs.
   * @returns {Promise<any>} The movie object with processed URLs.
   */
  async processMovieUrls(movie: any): Promise<any> {
    if (!movie) {
      return movie;
    }

    try {
      const processedMovie = { ...movie };

      if (movie.poster) {
        processedMovie.poster = await this.processImageUrl(movie.poster, 'poster');
      }
      
      if (movie.port) {
        processedMovie.port = await this.processImageUrl(movie.port, 'port');
      }

      if (movie.videoUrl) {
        processedMovie.videoUrl = await this.processVideoUrl(movie.videoUrl);
      }
      
      if (movie.trailer) {
        processedMovie.trailer = await this.processVideoUrl(movie.trailer);
      }

      return processedMovie;
    } catch (error) {
      console.error('❌ Error procesando URLs de película:', error);
      return movie;
    }
  }

  /**
   * Processes and validates all media URLs within an array of movies.
   * @param {any[]} movies - The array of movie objects.
   * @returns {Promise<any[]>} The array of movies with validated URLs.
   */
  async processMoviesUrls(movies: any[]): Promise<any[]> {
    if (!Array.isArray(movies)) {
      return [];
    }

    try {
      const processedMovies = await Promise.all(
        movies.map(movie => this.processMovieUrls(movie))
      );
      
      return processedMovies;
    } catch (error) {
      console.error('❌ Error procesando URLs de películas:', error);
      return movies;
    }
  }
}


export const cloudinaryValidationService = new CloudinaryValidationService();


export default cloudinaryValidationService;
