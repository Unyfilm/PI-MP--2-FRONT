import { useState, useEffect } from 'react';
import { Play, Star } from 'lucide-react';
import FavoriteButton from '../favorite/FavoriteButton';
import RatingStars from '../rating/RatingStars';
import { favoriteService } from '../../services/favoriteService';
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
  _id?: string;
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
  movieId?: string; 
}

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(image);
  
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(rating || 0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!movieId) return;
      
      const temporaryUserId = 'user-current-session';
      try {
        const result = await favoriteService.checkIsFavorite(movieId, temporaryUserId);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error('Error cargando estado de favorito:', error);
      }
    };

    loadFavoriteStatus();
  }, [movieId]);

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
      handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  const handleToggleFavorite = async (movieId: string | undefined) => {
    if (!movieId) {
      setShowMessage('❌ ID de película no disponible');
      setTimeout(() => setShowMessage(''), 3000);
      return;
    }
    
    const temporaryUserId = 'user-current-session';
    
    try {
      if (!isFavorite) {
        const result = await favoriteService.addToFavorites(movieId, temporaryUserId);
        
        if (result.success) {
          setShowMessage('🎬 Añadido a favoritos');
          setIsFavorite(true);
        } else {
          setShowMessage('❌ Error: ' + (result.message || 'No se pudo agregar a favoritos'));
        }
      } else {
        const result = await favoriteService.removeFromFavorites(movieId, temporaryUserId);
        
        if (result.success) {
          setShowMessage('🗑️ Eliminado de favoritos');
          setIsFavorite(false);
        } else {
          setShowMessage('❌ Error: ' + (result.message || 'No se pudo eliminar de favoritos'));
        }
      }
    } catch (error) {
      console.error('Error en favoritos:', error);
      setShowMessage('❌ Error de conexión con el servidor');
    } finally {
      setTimeout(() => setShowMessage(''), 3000);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      setUserRating(newRating);
      console.log(`Película ${movieId} calificada con ${newRating} estrellas`);
      
      const newTotal = totalRatings + 1;
      const newAverage = ((averageRating * totalRatings) + newRating) / newTotal;
      setAverageRating(newAverage);
      setTotalRatings(newTotal);
    } catch (error) {
      console.error('Error al calificar:', error);
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
      {/* BOTÓN DE FAVORITOS */}
      <div className="unyfilm-card__favorite">
        <FavoriteButton 
          movieId={movieId || title}
          isFavorite={isFavorite}
          onToggle={() => handleToggleFavorite(movieId)}
        />
      </div>

      {/* MENSAJE DE FAVORITOS - CORREGIDO */}
      {showMessage && (
        <div className="favorite-message">
          {showMessage}
        </div>
      )}

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
        
        {rating && rating > 0 && (
          <div className="unyfilm-card__rating">
            <Star size={14} fill="currentColor" />
            {rating.toFixed(1)}
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

          {movieId && (
            <div className="unyfilm-card__rating-section">
              <RatingStars
                movieId={movieId}
                onRatingChange={handleRatingChange}
                initialRating={userRating}
                averageRating={averageRating}
                totalRatings={totalRatings}
                readonly={false}
                size="small"
                showAverage={true}
              />
            </div>
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