import React, { useState } from "react";
import { Movie } from "../../types";
import "./MovieCard.css";

/**
 * Props for the MovieCard component.
 */
interface MovieCardProps {
  /** Movie data to display */
  movie: Movie;
  /** Whether the movie is favorited */
  isFavorited?: boolean;
  /** Callback when movie is clicked */
  onMovieClick?: (movie: Movie) => void;
  /** Callback when favorite button is clicked */
  onFavoriteClick?: (movie: Movie) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Movie card component displaying movie information and actions.
 * 
 * @component
 * @param {MovieCardProps} props - Component properties
 * @returns {JSX.Element} The movie card component
 */
const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorited = false,
  onMovieClick,
  onFavoriteClick,
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(movie);
  };

  const handleCardClick = () => {
    onMovieClick?.(movie);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div 
      className={`movie-card ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="movie-poster-container">
        {imageError ? (
          <div className="movie-poster-placeholder">
            <div className="placeholder-icon">🎬</div>
            <span>No image</span>
          </div>
        ) : (
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="movie-poster"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <button
          className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          ❤️
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{movie.year}</span>
          <span className="movie-genre">{movie.genre}</span>
        </div>
        
        {movie.rating > 0 && (
          <div className="movie-rating">
            <div className="stars">
              {renderStars(movie.rating)}
            </div>
            <span className="rating-value">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
