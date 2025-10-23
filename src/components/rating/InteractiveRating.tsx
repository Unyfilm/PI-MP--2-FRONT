import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getMovieRatingStats, getUserRating, rateMovie, updateRating, deleteRating } from '../../services/ratingService';
import type { RatingStats } from '../../services/ratingService';
import './InteractiveRating.css';

interface InteractiveRatingProps {
  movieId: string;
  movieTitle: string;
  onRatingUpdate?: (newStats: RatingStats) => void;
}

interface UserRating {
  id: string;
  rating: number;
  review?: string;
}

const InteractiveRating: React.FC<InteractiveRatingProps> = ({ 
  movieId, 
  movieTitle, 
  onRatingUpdate 
}) => {
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRatingData();
  }, [movieId]);

  const loadRatingData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar estadísticas de la película (con cache)
      const stats = await getMovieRatingStats(movieId);
      setRatingStats(stats);
      
      // Solo intentar cargar calificación del usuario si hay token
      const token = localStorage.getItem('token');
      if (token) {
        // Cargar calificación del usuario de forma silenciosa y no bloqueante
        getUserRating(movieId)
          .then(userRatingData => {
            if (userRatingData) {
              setUserRating(userRatingData);
            }
          })
          .catch(() => {
            // Ignorar errores silenciosamente - es normal que no exista calificación
          });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas de calificación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      setIsSubmitting(true);
      
      if (userRating) {
        await updateRating(userRating.id, rating);
        setUserRating({ ...userRating, rating });
      } else {
        const newRating = await rateMovie(movieId, rating);
        setUserRating(newRating);
      }
      
      await loadRatingData();
      
      if (onRatingUpdate && ratingStats) {
        onRatingUpdate(ratingStats);
      }
    } catch (error) {
      console.error('Error al calificar:', error);
      alert('Error al calificar la película');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    try {
      setIsSubmitting(true);
      await deleteRating(movieId);
      setUserRating(null);
      await loadRatingData();
      
      if (onRatingUpdate && ratingStats) {
        onRatingUpdate(ratingStats);
      }
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      alert('Error al eliminar calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoverRating || userRating?.rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= currentRating;
      const isHovered = hoverRating > 0 && i <= hoverRating;
      
      stars.push(
        <button
          key={i}
          className={`interactive-star ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
          onClick={() => handleRatingSubmit(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isSubmitting}
          aria-label={`Calificar con ${i} estrella${i > 1 ? 's' : ''}`}
        >
          <Star 
            size={24} 
            fill={isActive ? 'currentColor' : 'none'}
            className="star-icon"
          />
        </button>
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="interactive-rating-loading">
        <div className="loading-spinner"></div>
        <span>Cargando calificaciones...</span>
      </div>
    );
  }

  return (
    <div className="interactive-rating">
      <div className="interactive-rating__header">
        <h3>Calificar: {movieTitle}</h3>
        {ratingStats && (
          <div className="interactive-rating__stats">
            <div className="average-rating">
              <span className="rating-value">{ratingStats.averageRating.toFixed(1)}</span>
              <div className="stars-display">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(ratingStats.averageRating) ? 'currentColor' : 'none'}
                    className={`star ${i < Math.floor(ratingStats.averageRating) ? 'filled' : 'empty'}`}
                  />
                ))}
              </div>
              <span className="total-ratings">({ratingStats.totalRatings} calificaciones)</span>
            </div>
          </div>
        )}
      </div>

      <div className="interactive-rating__input">
        <div className="star-input-container">
          {renderStars()}
        </div>
        
        {userRating && (
          <div className="user-rating-info">
            <span>Tu calificación: {userRating.rating}/5</span>
            <button 
              className="delete-rating-btn"
              onClick={handleDeleteRating}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveRating;
