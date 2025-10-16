import { useState } from 'react';
import { Heart, Play, Star } from 'lucide-react';
import './UnyFilmCard.css';

interface MovieClickData {
  title: string;
  index?: number;
  videoUrl?: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  image?: string;
}

interface UnyFilmCardProps {
  title: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onMovieClick: (movie: MovieClickData) => void;
  image?: string;
  genre?: string;
  rating?: number;
  year?: number;
  description?: string;
}

/**
 * Movie card component with TypeScript types
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
}: UnyFilmCardProps) {
  const [isHover, setIsHover] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e as any);
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
            {rating && rating >= 4.5 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--trending">
                Trending
              </span>
            )}
            {rating && rating >= 4.8 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--top">
                Top 10
              </span>
            )}
            {year && year >= 2023 && (
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
