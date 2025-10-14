import React, { useState } from 'react';
import './MovieCard.scss';

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

interface MovieCardProps {
  movie: Movie;
  isFavorited?: boolean;
  onMovieClick?: (movie: Movie) => void;
  onFavoriteClick?: (movie: Movie) => void;
  className?: string;
  showFavoriteButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * MovieCard component for displaying individual movie information.
 * Features a modern design inspired by Netflix/HBO Max with hover effects
 * and interactive elements.
 * 
 * @component
 * @param {MovieCardProps} props - Component properties
 * @returns {JSX.Element} Movie card component
 * 
 * @example
 * ```tsx
 * <MovieCard 
 *   movie={movieData}
 *   onMovieClick={(movie) => console.log('Clicked:', movie.title)}
 *   onFavoriteClick={(movie) => toggleFavorite(movie.id)}
 *   isFavorited={false}
 * />
 * ```
 */
const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorited = false,
  onMovieClick,
  onFavoriteClick,
  className = '',
  showFavoriteButton = true,
  size = 'medium'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Handles movie card click event.
   */
  const handleMovieClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  /**
   * Handles favorite button click event.
   * Prevents event bubbling to avoid triggering movie click.
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(movie);
    }
  };

  /**
   * Handles image load success.
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  /**
   * Handles image load error.
   */
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`movie-card movie-card--${size} ${className}`}
      onClick={handleMovieClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleMovieClick();
        }
      }}
      aria-label={`View details for ${movie.title}`}
    >
      {/* Movie Poster Container */}
      <div className="movie-card__poster">
        {!imageError ? (
          <img
            src={movie.imageUrl}
            alt={`${movie.title} poster`}
            className={`movie-card__image ${imageLoaded ? 'movie-card__image--loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__placeholder">
            <div className="movie-card__placeholder-icon">🎬</div>
            <span className="movie-card__placeholder-text">No Image</span>
          </div>
        )}
        
        {/* Overlay with movie info */}
        <div className="movie-card__overlay">
          <div className="movie-card__info">
            <h3 className="movie-card__title">{movie.title}</h3>
            <div className="movie-card__meta">
              <span className="movie-card__year">{movie.year}</span>
              <span className="movie-card__genre">{movie.genre}</span>
              <span className="movie-card__rating">
                ⭐ {movie.rating.toFixed(1)}
              </span>
            </div>
            <p className="movie-card__description">
              {movie.description.length > 100 
                ? `${movie.description.substring(0, 100)}...` 
                : movie.description
              }
            </p>
            <div className="movie-card__actions">
              <button 
                className="movie-card__play-button"
                aria-label={`Play ${movie.title}`}
              >
                ▶️ Play
              </button>
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            className={`movie-card__favorite ${isFavorited ? 'movie-card__favorite--active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="movie-card__favorite-icon">
              {isFavorited ? '❤️' : '🤍'}
            </span>
          </button>
        )}

        {/* Age Rating Badge */}
        <div className="movie-card__age-rating">
          {movie.ageRating}
        </div>

        {/* Trending Badge */}
        {movie.isTrending && (
          <div className="movie-card__trending-badge">
            🔥 Trending
          </div>
        )}

        {/* Featured Badge */}
        {movie.isFeatured && (
          <div className="movie-card__featured-badge">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Movie Title (visible on hover or always for small cards) */}
      <div className="movie-card__title-container">
        <h3 className="movie-card__title-text">{movie.title}</h3>
        <div className="movie-card__title-meta">
          <span className="movie-card__title-year">{movie.year}</span>
          <span className="movie-card__title-rating">⭐ {movie.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
