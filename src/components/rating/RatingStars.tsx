import React, { useState, useEffect } from 'react';
import './RatingStars.scss';

interface RatingStarsProps {
  movieId: string;
  onRatingChange: (rating: number) => void;
  initialRating?: number;
  averageRating?: number;
  totalRatings?: number;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showAverage?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  movieId,
  onRatingChange,
  initialRating = 0,
  averageRating = 0,
  totalRatings = 0,
  readonly = false,
  size = 'medium',
  showAverage = true
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar rating cuando cambie initialRating
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRating = async (selectedRating: number) => {
    if (readonly || isLoading) return;
    
    setIsLoading(true);
    
    try {
      setRating(selectedRating);
      await onRatingChange(selectedRating);
    } catch (error) {
      console.error('Error setting rating:', error);
      // Revertir en caso de error
      setRating(initialRating);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'rating-stars--small';
      case 'large': return 'rating-stars--large';
      default: return 'rating-stars--medium';
    }
  };

  return (
    <div className={`rating-stars ${getSizeClass()} ${readonly ? 'rating-stars--readonly' : ''}`}>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= (hover || rating) ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly || isLoading}
            aria-label={`Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            title={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          >
            <span className="star">⭐</span>
          </button>
        ))}
      </div>

      {showAverage && averageRating > 0 && (
        <div className="rating-info">
          <span className="average-rating">
            {averageRating.toFixed(1)} ⭐
          </span>
          {totalRatings > 0 && (
            <span className="total-ratings">
              ({totalRatings} {totalRatings === 1 ? 'voto' : 'votos'})
            </span>
          )}
        </div>
      )}

      {!readonly && rating > 0 && (
        <div className="user-rating">
          Tu calificación: <strong>{rating} ⭐</strong>
        </div>
      )}

      {isLoading && (
        <div className="loading-message">
          Guardando calificación...
        </div>
      )}
    </div>
  );
};

export default RatingStars;