import { useState, useEffect, useCallback } from 'react';
// Temporary inline types to fix import issues
interface Movie {
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

interface MovieCategory {
  id: string;
  name: string;
  description: string;
  movieCount: number;
}

interface MovieFilters {
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

interface MovieCatalogState {
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
import { mockMovies, movieCategories, searchMovies, sortMovies, getMoviesByGenre } from '../constants/movies';
import { mockApiService } from '../services/mockApi';

/**
 * Custom hook for managing movie catalog state and operations.
 * Provides search, filtering, sorting, and pagination functionality.
 * 
 * @param {MovieFilters} initialFilters - Initial filter parameters
 * @returns {Object} Catalog state and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   movies,
 *   categories,
 *   isLoading,
 *   error,
 *   searchQuery,
 *   selectedGenre,
 *   handleSearch,
 *   handleGenreChange,
 *   handleSortChange,
 *   refreshMovies
 * } = useMovieCatalog();
 * ```
 */
export const useMovieCatalog = (initialFilters: MovieFilters = {}) => {
  // Initial state
  const [state, setState] = useState<MovieCatalogState>({
    movies: [],
    categories: movieCategories,
    searchQuery: '',
    selectedGenre: 'All Movies',
    sortBy: 'title',
    sortOrder: 'asc',
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  });

  /**
   * Updates the catalog state.
   */
  const updateState = useCallback((updates: Partial<MovieCatalogState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Loads movies from the API with current filters.
   */
  const loadMovies = useCallback(async (filters: MovieFilters = {}) => {
    try {
      updateState({ isLoading: true, error: null });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredMovies = [...mockMovies];

      // Apply search filter
      if (filters.search && filters.search.trim()) {
        filteredMovies = searchMovies(filters.search);
      }

      // Apply genre filter
      if (filters.genre && filters.genre !== 'All Movies') {
        filteredMovies = getMoviesByGenre(filters.genre);
      }

      // Apply year filter
      if (filters.yearFrom) {
        filteredMovies = filteredMovies.filter(movie => movie.year >= filters.yearFrom!);
      }
      if (filters.yearTo) {
        filteredMovies = filteredMovies.filter(movie => movie.year <= filters.yearTo!);
      }

      // Apply rating filter
      if (filters.minRating) {
        filteredMovies = filteredMovies.filter(movie => movie.rating >= filters.minRating!);
      }

      // Apply trending filter
      if (filters.trendingOnly) {
        filteredMovies = filteredMovies.filter(movie => movie.isTrending);
      }

      // Apply featured filter
      if (filters.featuredOnly) {
        filteredMovies = filteredMovies.filter(movie => movie.isFeatured);
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredMovies = sortMovies(
          filteredMovies,
          filters.sortBy,
          filters.sortOrder || 'asc'
        );
      }

      // Calculate pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const totalPages = Math.ceil(filteredMovies.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

      updateState({
        movies: paginatedMovies,
        isLoading: false,
        currentPage: page,
        totalPages,
        error: null
      });

    } catch (error) {
      updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load movies'
      });
    }
  }, [updateState]);

  /**
   * Handles search query changes.
   */
  const handleSearch = useCallback((query: string) => {
    updateState({ searchQuery: query });
    loadMovies({
      ...initialFilters,
      search: query,
      genre: state.selectedGenre,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder
    });
  }, [updateState, loadMovies, initialFilters, state.selectedGenre, state.sortBy, state.sortOrder]);

  /**
   * Handles genre filter changes.
   */
  const handleGenreChange = useCallback((genre: string) => {
    updateState({ selectedGenre: genre });
    loadMovies({
      ...initialFilters,
      search: state.searchQuery,
      genre,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder
    });
  }, [updateState, loadMovies, initialFilters, state.searchQuery, state.sortBy, state.sortOrder]);

  /**
   * Handles sort option changes.
   */
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    updateState({ sortBy, sortOrder });
    loadMovies({
      ...initialFilters,
      search: state.searchQuery,
      genre: state.selectedGenre,
      sortBy,
      sortOrder
    });
  }, [updateState, loadMovies, initialFilters, state.searchQuery, state.selectedGenre]);

  /**
   * Handles page changes for pagination.
   */
  const handlePageChange = useCallback((page: number) => {
    updateState({ currentPage: page });
    loadMovies({
      ...initialFilters,
      search: state.searchQuery,
      genre: state.selectedGenre,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      page
    });
  }, [updateState, loadMovies, initialFilters, state.searchQuery, state.selectedGenre, state.sortBy, state.sortOrder]);

  /**
   * Refreshes the movie catalog.
   */
  const refreshMovies = useCallback(() => {
    loadMovies({
      ...initialFilters,
      search: state.searchQuery,
      genre: state.selectedGenre,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      page: state.currentPage
    });
  }, [loadMovies, initialFilters, state.searchQuery, state.selectedGenre, state.sortBy, state.sortOrder, state.currentPage]);

  /**
   * Clears all filters and resets to default state.
   */
  const clearFilters = useCallback(() => {
    updateState({
      searchQuery: '',
      selectedGenre: 'All Movies',
      sortBy: 'title',
      sortOrder: 'asc',
      currentPage: 1
    });
    loadMovies(initialFilters);
  }, [updateState, loadMovies]);

  /**
   * Loads movies on component mount.
   */
  useEffect(() => {
    loadMovies(initialFilters);
  }, []); // Remove dependencies to prevent infinite loop

  return {
    // State
    movies: state.movies,
    categories: state.categories,
    isLoading: state.isLoading,
    error: state.error,
    searchQuery: state.searchQuery,
    selectedGenre: state.selectedGenre,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    currentPage: state.currentPage,
    totalPages: state.totalPages,

    // Actions
    handleSearch,
    handleGenreChange,
    handleSortChange,
    handlePageChange,
    refreshMovies,
    clearFilters,

    // Utility functions
    loadMovies
  };
};
