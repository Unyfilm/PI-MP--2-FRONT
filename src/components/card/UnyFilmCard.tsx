import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import VisualRatingStars from '../rating/VisualRatingStars';
import { getMovieRatingStats, type RatingStats } from '../../services/ratingService';
import FavoriteButton from '../favorite/FavoriteButton';
import './UnyFilmCard.css';


interface MovieClickData {
  _id?: string;
  title: string;
  index?: number;
  videoUrl?: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  image?: string;
}

/**
 * Props for the {@link UnyFilmCard} component.
 * Defines all configurable options required to render a movie card.
 */
interface UnyFilmCardProps {
  title: string;
  onMovieClick: (movie: MovieClickData) => void;
  image?: string;
  fallbackImage?: string;
  genre?: string;
  rating?: number;
  year?: number;
  description?: string;
  movieId?: string; 
}

/**
 * UnyFilmCard
 *
 * A dynamic movie card component that displays key film details such as title, genre, year,
 * and rating. Includes support for hover animations, keyboard accessibility, and integration
 * with rating and favorite systems.
 *
 * Features:
 * - Displays movie image with fallback handling.
 * - Shows title, genre, year, and visual rating stats.
 * - Integrates `FavoriteButton` for quick favorites management.
 * - Supports keyboard navigation (`Enter` / `Space`) for accessibility.
 * - Fetches and displays rating statistics asynchronously.
 *
 * @file UnyFilmCard.tsx
 * @component
 * @function UnyFilmCard
 * @version 2.0
 * @since 2025-10
 * @author Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta, Jerson Otero, Julian Mosquera
 *
 * @param {UnyFilmCardProps} props - Component properties.
 * @returns {JSX.Element} Interactive and accessible movie card component.
 */
export default function UnyFilmCard({ 
  title, 
  onMovieClick,
  image,
  fallbackImage,
  genre,
  rating,
  year,
  description,
  movieId 
}: UnyFilmCardProps) {
  const [isHover, setIsHover] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(image);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);

  useEffect(() => {
    const loadRatingStats = async () => {
      if (!movieId || movieId.trim() === '') return;
      
      try {
        const stats = await getMovieRatingStats(movieId);
        setRatingStats(stats);
      } catch (error) {
        setRatingStats({
          movieId,
          averageRating: rating || 0,
          totalRatings: 0,
          distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        });
      }
    };

    loadRatingStats();
  }, [movieId, rating]);

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
        _id: movieId,
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
        
        
        {movieId && (
          <div className="unyfilm-card__favorite-button">
            <FavoriteButton
              movieId={movieId}
              movieTitle={title}
              size="small"
              showLabel={false}
            />
          </div>
        )}
      </div>
      
      <div className="unyfilm-card__content">
        <h3 className="unyfilm-card__title">{title}</h3>
        
       
        {movieId && ratingStats && (
          <div className="unyfilm-card__rating-stars">
            <VisualRatingStars
              averageRating={ratingStats.averageRating}
              totalRatings={ratingStats.totalRatings}
              size="small"
              showCount={false}
            />
          </div>
        )}
        
        <div className="unyfilm-card__meta">
          {year && year > 1900 && <span className="unyfilm-card__year">{String(year)}</span>}
          {genre && <span className="unyfilm-card__genre">{genre}</span>}
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