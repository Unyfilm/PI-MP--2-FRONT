import React, { useState } from 'react';
import { Heart, Play, Star } from 'lucide-react';
import './UnyFilmCard.css';

/**
 * Movie card component
 * @param {Object} props - Component props
 * @param {string} props.title - Movie title
 * @param {boolean} props.isFavorite - Whether the movie is favorited
 * @param {Function} props.onToggleFavorite - Function to toggle favorite
 * @param {Function} props.onMovieClick - Function to handle movie click
 * @param {string} props.image - Movie image URL
 * @param {string} props.genre - Movie genre
 * @param {number} props.rating - Movie rating
 * @param {string} props.year - Movie year
 */
export default function UnyFilmCard({ 
  title, 
  isFavorite, 
  onToggleFavorite, 
  onMovieClick,
  image,
  genre,
  rating,
  year,
  description
}) {
  const [isHover, setIsHover] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMovieClick) {
      onMovieClick({ 
        title, 
        image, 
        genre, 
        rating, 
        year, 
        description 
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e);
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver película ${title}`}
      className={`unyfilm-card ${isHover ? 'unyfilm-card--hover' : ''}`}
    >
      <div className="unyfilm-card__image-container">
        {!imageError && image ? (
          <img
            src={image}
            alt={title}
            className="unyfilm-card__image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="unyfilm-card__placeholder">
            <div className="unyfilm-card__placeholder-icon">
              <Play size={32} />
            </div>
            <span className="unyfilm-card__placeholder-text">{title}</span>
          </div>
        )}
        
        <button
          onClick={handleFavoriteClick}
          className={`unyfilm-card__favorite ${isFavorite ? 'unyfilm-card__favorite--active' : ''}`}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          <Heart
            size={16}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        </button>
        
      </div>
      
      <div className="unyfilm-card__content">
        <h3 className="unyfilm-card__title">{title}</h3>
        <div className="unyfilm-card__meta">
          {year && <span className="unyfilm-card__year">{year}</span>}
          {genre && <span className="unyfilm-card__genre">{genre}</span>}
          {rating && (
            <span className="unyfilm-card__rating">
              <Star size={14} />
              {rating}
            </span>
          )}
        </div>
      </div>

      <div className="unyfilm-card__overlay">
        <div className="unyfilm-card__overlay-content">
          <h3 className="unyfilm-card__overlay-title">{title}</h3>
          
          <div className="unyfilm-card__overlay-meta">
            {rating >= 4.5 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--trending">
                Trending
              </span>
            )}
            {rating >= 4.8 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--top">
                Top 10
              </span>
            )}
            {year >= 2023 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--new">
                Nuevo
              </span>
            )}
            {rating && (
              <div className="unyfilm-card__overlay-rating">
                <Star size={12} />
                {rating}
              </div>
            )}
            {year && (
              <span className="unyfilm-card__overlay-year">{year}</span>
            )}
            {genre && (
              <span className="unyfilm-card__overlay-genre">{genre}</span>
            )}
          </div>
          
          {description && (
            <p className="unyfilm-card__overlay-description">{description}</p>
          )}
          
          <button className="unyfilm-card__play-button">
            <Play size={16} />
            Reproducir
          </button>
        </div>
      </div>
    </div>
  );
}
