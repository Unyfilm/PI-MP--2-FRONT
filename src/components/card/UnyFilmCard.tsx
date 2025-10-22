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
  onMovieClick: (movie: MovieClickData) => void;
  image?: string;
  fallbackImage?: string;
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
  onMovieClick,
  image,
  fallbackImage,
  genre,
  rating,
  year,
  description
}: UnyFilmCardProps) {
  const [isHover, setIsHover] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(image);

  const handleImageError = () => {
    if (!imageError && fallbackImage) {
      setCurrentSrc(fallbackImage);
      setImageError(true);
      return;
    }
    setImageError(true);
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
        {!imageError && currentSrc ? (
          <img
            src={currentSrc}
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
        
        
      </div>
      
      <div className="unyfilm-card__content">
        <h3 className="unyfilm-card__title">{title}</h3>
        <div className="unyfilm-card__meta">
          {year && year > 1900 && <span className="unyfilm-card__year">{String(year)}</span>}
          {genre && <span className="unyfilm-card__genre">{genre}</span>}
          {rating && rating > 0 && (
            <span className="unyfilm-card__rating">
              <Star size={14} />
              {rating.toFixed(1)}
            </span>
          )}
          {(!rating || rating === 0) && (
            <span className="unyfilm-card__rating unyfilm-card__rating--no-rating">
              Sin puntuación
            </span>
          )}
        </div>
      </div>

      <div className="unyfilm-card__overlay">
        <div className="unyfilm-card__overlay-content">
          <h3 className="unyfilm-card__overlay-title">{title}</h3>
          
          <div className="unyfilm-card__overlay-meta">
            {rating && rating > 0 && rating >= 4.5 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--trending">
                Trending
              </span>
            )}
            {rating && rating > 0 && rating >= 4.8 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--top">
                Top 10
              </span>
            )}
            {year && year >= 2023 && (
              <span className="unyfilm-card__overlay-badge unyfilm-card__overlay-badge--new">
                Nuevo
              </span>
            )}
            {rating && rating > 0 && (
              <div className="unyfilm-card__overlay-rating">
                <Star size={12} />
                {rating.toFixed(1)}
              </div>
            )}
            {(!rating || rating === 0) && (
              <div className="unyfilm-card__overlay-rating unyfilm-card__overlay-rating--no-rating">
                Sin puntuación
              </div>
            )}
            {year && year > 1900 && (
              <span className="unyfilm-card__overlay-year">{String(year)}</span>
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
