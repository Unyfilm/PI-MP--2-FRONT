export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genre: string;
  rating: number;
  imageUrl: string;
  videoUrl: string;
  duration?: number;
  director?: string;
  cast?: string[];
  language?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: number;
  minRating?: number;
  sortBy?: 'title' | 'year' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MovieResponse<T = Movie> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}