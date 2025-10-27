

interface CachedRatingStats {
  data: any;
  timestamp: number;
  ttl: number; 
}

class RatingCache {
  private cache = new Map<string, CachedRatingStats>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; 

  /**
   * Get cached rating stats for a movie
   * @param movieId - The movie ID
   * @returns Cached data or null if not found/expired
   */
  get(movieId: string): any | null {
    const cached = this.cache.get(movieId);
    
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(movieId);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached rating stats for a movie
   * @param movieId - The movie ID
   * @param data - The rating stats data
   * @param ttl - Time to live in milliseconds (optional)
   */
  set(movieId: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(movieId, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Invalidate cache for a specific movie
   * @param movieId - The movie ID
   */
  invalidate(movieId: string): void {
    this.cache.delete(movieId);
  }

 
  clear(): void {
    this.cache.clear();
  }

  
  size(): number {
    return this.cache.size;
  }
}

export const ratingCache = new RatingCache();
