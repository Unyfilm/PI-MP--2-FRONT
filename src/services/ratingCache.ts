

interface CachedRatingStats {
  data: any;
  timestamp: number;
  ttl: number; 
}

class RatingCache {
  private cache = new Map<string, CachedRatingStats>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; 

  
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

 
  set(movieId: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(movieId, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

 
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
