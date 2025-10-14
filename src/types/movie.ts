export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genre: string;
  rating: number;
  imageUrl: string;
  videoUrl: string;
  duration: number;
  director: string;
  cast: string[];
  ageRating: string;
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovieCategory {
  id: string;
  name: string;
  description: string;
  movieCount: number;
}

export interface MovieFilters {
  search?: string;
  genre?: string;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  trendingOnly?: boolean;
  featuredOnly?: boolean;
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

export interface MovieCardProps {
  movie: Movie;
  isFavorited?: boolean;
  onMovieClick?: (movie: Movie) => void;
  onFavoriteClick?: (movie: Movie) => void;
  className?: string;
  showFavoriteButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface MovieCatalogState {
  movies: Movie[];
  categories: MovieCategory[];
  searchQuery: string;
  selectedGenre: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}
