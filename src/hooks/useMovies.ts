/**
 * Custom React hook for managing movie data and operations.
 * Provides state management and API interactions for movies.
 */

import { useState, useEffect, useCallback } from 'react';
import { Movie, MovieFilters, MovieResponse } from '../types/movie';
import { apiService } from '../services/api';
import { ERROR_MESSAGES } from '../constants/movies';

/**
 * State interface for the useMovies hook.
 * 
 * @interface UseMoviesState
 */
interface UseMoviesState {
  /** Array of movies */
  movies: Movie[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error message */
  error: string | null;
  
  /** Total number of movies */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Whether there are more pages */
  hasNextPage: boolean;
  
  /** Whether there are previous pages */
  hasPrevPage: boolean;
}

/**
 * Actions interface for the useMovies hook.
 * 
 * @interface UseMoviesActions
 */
interface UseMoviesActions {
  /** Load movies with optional filters */
  loadMovies: (filters?: MovieFilters) => Promise<void>;
  
  /** Load more movies (pagination) */
  loadMoreMovies: () => Promise<void>;
  
  /** Search movies */
  searchMovies: (query: string) => Promise<void>;
  
  /** Filter movies by genre */
  filterByGenre: (genre: string) => Promise<void>;
  
  /** Clear all filters */
  clearFilters: () => Promise<void>;
  
  /** Refresh movies */
  refreshMovies: () => Promise<void>;
}

/**
 * Return type for the useMovies hook.
 * 
 * @type UseMoviesReturn
 */
type UseMoviesReturn = UseMoviesState & UseMoviesActions;

/**
 * Custom hook for managing movie data and operations.
 * 
 * @param {MovieFilters} initialFilters - Initial filters to apply
 * @returns {UseMoviesReturn} Movies state and actions
 * 
 * @example
 * ```typescript
 * const { movies, loading, loadMovies, searchMovies } = useMovies();
 * 
 * // Load movies with filters
 * await loadMovies({ genre: 'Action', year: 2023 });
 * 
 * // Search movies
 * await searchMovies('Avengers');
 * ```
 */
export const useMovies = (initialFilters: MovieFilters = {}): UseMoviesReturn => {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filters, setFilters] = useState<MovieFilters>(initialFilters);

  /**
   * Load movies with the current filters.
   * 
   * @param {MovieFilters} newFilters - Optional new filters to apply
   */
  const loadMovies = useCallback(async (newFilters?: MovieFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const currentFilters = newFilters || filters;
      const response = await apiService.get<MovieResponse>('/movies', {
        ...currentFilters,
        page: currentFilters.page || 1
      });

      setState(prev => ({
        ...prev,
        movies: response.data.data,
        total: response.data.total,
        page: response.data.page,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage,
        loading: false
      }));

      if (newFilters) {
        setFilters(currentFilters);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_LOAD_MOVIES
      }));
    }
  }, [filters]);

  /**
   * Load more movies for pagination.
   */
  const loadMoreMovies = useCallback(async () => {
    if (!state.hasNextPage || state.loading) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const response = await apiService.get<MovieResponse>('/movies', {
        ...filters,
        page: state.page + 1
      });

      setState(prev => ({
        ...prev,
        movies: [...prev.movies, ...response.data.data],
        page: response.data.page,
        hasNextPage: response.data.hasNextPage,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_LOAD_MOVIES
      }));
    }
  }, [filters, state.page, state.hasNextPage, state.loading]);

  /**
   * Search movies by query.
   * 
   * @param {string} query - Search query
   */
  const searchMovies = useCallback(async (query: string) => {
    await loadMovies({ ...filters, search: query, page: 1 });
  }, [loadMovies, filters]);

  /**
   * Filter movies by genre.
   * 
   * @param {string} genre - Genre to filter by
   */
  const filterByGenre = useCallback(async (genre: string) => {
    await loadMovies({ ...filters, genre, page: 1 });
  }, [loadMovies, filters]);

  /**
   * Clear all filters and reload movies.
   */
  const clearFilters = useCallback(async () => {
    await loadMovies({ page: 1 });
  }, [loadMovies]);

  /**
   * Refresh movies with current filters.
   */
  const refreshMovies = useCallback(async () => {
    await loadMovies(filters);
  }, [loadMovies, filters]);

  // Load movies on mount
  useEffect(() => {
    loadMovies();
  }, []);

  return {
    ...state,
    loadMovies,
    loadMoreMovies,
    searchMovies,
    filterByGenre,
    clearFilters,
    refreshMovies
  };
};
