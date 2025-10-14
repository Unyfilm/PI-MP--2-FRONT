import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../types/movie';
import './MovieGrid.scss';

/**
 * Props interface for MovieGrid component.
 */
interface MovieGridProps {
  /** Array of movies to display */
  movies: Movie[];
  /** Whether the grid is currently loading */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Callback when a movie is clicked */
  onMovieClick?: (movie: Movie) => void;
  /** Callback when favorite button is clicked */
  onFavoriteClick?: (movie: Movie) => void;
  /** Array of favorited movie IDs */
  favoritedMovies?: string[];
  /** Grid layout variant */
  layout?: 'grid' | 'list';
  /** Number of columns for grid layout */
  columns?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the favorite button */
  showFavoriteButton?: boolean;
  /** Size variant for movie cards */
  cardSize?: 'small' | 'medium' | 'large';
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * MovieGrid component for displaying movies in a responsive grid layout.
 * Features modern Netflix/HBO Max inspired design with smooth animations
 * and accessibility considerations.
 * 
 * @component
 * @param {MovieGridProps} props - Component properties
 * @returns {JSX.Element} Movie grid component
 * 
 * @example
 * ```tsx
 * <MovieGrid 
 *   movies={movieList}
 *   onMovieClick={(movie) => navigateToMovie(movie.id)}
 *   onFavoriteClick={(movie) => toggleFavorite(movie.id)}
 *   favoritedMovies={userFavorites}
 *   layout="grid"
 *   columns={4}
 * />
 * ```
 */
const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  error = null,
  onMovieClick,
  onFavoriteClick,
  favoritedMovies = [],
  layout = 'grid',
  columns = 4,
  className = '',
  showFavoriteButton = true,
  cardSize = 'medium',
  emptyMessage = 'No movies found'
}) => {
  /**
   * Handles movie click event.
   */
  const handleMovieClick = (movie: Movie) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  /**
   * Handles favorite button click event.
   */
  const handleFavoriteClick = (movie: Movie) => {
    if (onFavoriteClick) {
      onFavoriteClick(movie);
    }
  };

  /**
   * Checks if a movie is favorited.
   */
  const isMovieFavorited = (movieId: string): boolean => {
    return favoritedMovies.includes(movieId);
  };

  /**
   * Renders loading state.
   */
  const renderLoadingState = () => (
    <div className="movie-grid__loading" role="status" aria-label="Loading movies">
      <div className="movie-grid__loading-spinner"></div>
      <p className="movie-grid__loading-text">Loading movies...</p>
    </div>
  );

  /**
   * Renders error state.
   */
  const renderErrorState = () => (
    <div className="movie-grid__error" role="alert">
      <div className="movie-grid__error-icon">⚠️</div>
      <h3 className="movie-grid__error-title">Something went wrong</h3>
      <p className="movie-grid__error-message">{error}</p>
      <button 
        className="movie-grid__error-retry"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  /**
   * Renders empty state.
   */
  const renderEmptyState = () => (
    <div className="movie-grid__empty" role="status">
      <div className="movie-grid__empty-icon">🎬</div>
      <h3 className="movie-grid__empty-title">No movies found</h3>
      <p className="movie-grid__empty-message">{emptyMessage}</p>
    </div>
  );

  /**
   * Renders the movie grid.
   */
  const renderMovieGrid = () => (
    <div 
      className={`movie-grid__container movie-grid__container--${layout}`}
      style={{ '--grid-columns': columns } as React.CSSProperties}
      role="grid"
      aria-label="Movie catalog"
    >
      {movies.map((movie) => (
        <div 
          key={movie.id} 
          className="movie-grid__item"
          role="gridcell"
        >
          <MovieCard
            movie={movie}
            isFavorited={isMovieFavorited(movie.id)}
            onMovieClick={handleMovieClick}
            onFavoriteClick={handleFavoriteClick}
            showFavoriteButton={showFavoriteButton}
            size={cardSize}
            className="movie-grid__card"
          />
        </div>
      ))}
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className={`movie-grid ${className}`}>
        {renderLoadingState()}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`movie-grid ${className}`}>
        {renderErrorState()}
      </div>
    );
  }

  // Show empty state
  if (movies.length === 0) {
    return (
      <div className={`movie-grid ${className}`}>
        {renderEmptyState()}
      </div>
    );
  }

  // Show movie grid
  return (
    <div className={`movie-grid movie-grid--${layout} ${className}`}>
      {renderMovieGrid()}
    </div>
  );
};

export default MovieGrid;
