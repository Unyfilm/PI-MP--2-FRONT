
class CloudinaryValidationService {
  
 
  isValidCloudinaryUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_]+\/(image|video)\/upload\//;
    return cloudinaryPattern.test(url);
  }

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

  getFallbackImageUrl(type: 'poster' | 'port' | 'hero' = 'poster'): string {
    const fallbackImages = {
      poster: '/images/default-movie.jpg',
      port: '/images/default-hero.jpg',
      hero: '/images/default-hero.jpg'
    };
    
    return fallbackImages[type];
  }

  getFallbackVideoUrl(): string {
    return '/videos/default-trailer.mp4';
  }

 
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
