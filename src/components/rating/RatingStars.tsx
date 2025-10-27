import React, { useState } from 'react';
import './RatingStars.scss';

interface RatingStarsProps {
  movieId: string;
  readonly?: boolean;
  showAverage?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  movieId,
  readonly = false,
  onRatingChange
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRating = (rating: number) => {
    if (readonly) return;
    
    setUserRating(rating);
    console.log(`Calificando película ${movieId} con ${rating} estrellas`);
    
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const ratingToShow = hoverRating || userRating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= ratingToShow ? 'filled' : ''}`}
          onClick={() => handleRating(i)}
          onMouseEnter={() => !readonly && setHoverRating(i)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="rating-stars">
      <div className="stars-container">
        <div className="stars-row">
          {renderStars()}
        </div>
        {!readonly && (
          <span className="rating-text">
            {userRating ? `Tu calificación: ${userRating}/5` : '⭐ Calificar esta película'}
          </span>
        )}
      </div>
    </div>
  );
};

export default RatingStars;