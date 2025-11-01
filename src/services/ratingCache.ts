
/**
 * Represents a cached entry for movie rating statistics.
 *
 * @interface CachedRatingStats
 * @property {any} data - The cached rating statistics data.
 * @property {number} timestamp - The time (in milliseconds) when the data was cached.
 * @property {number} ttl - The time-to-live duration (in milliseconds) for this cached entry.
 */
interface CachedRatingStats {
  data: any;
  timestamp: number;
  ttl: number; 
}

/**
 * A simple in-memory cache for storing movie rating statistics.
 * Each entry has a time-to-live (TTL) after which it expires.
 *
 * @class RatingCache
 * @example
 * ```ts
 * const stats = { average: 4.2, totalRatings: 25 };
 * ratingCache.set("movie123", stats);
 * const cached = ratingCache.get("movie123");
 * console.log(cached); // { average: 4.2, totalRatings: 25 }
 * ```
 */
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
