/**
 * @file RatingStars.tsx
 * @description
 * Star-based rating component that allows users to rate a movie with 1–5 stars.
 * Supports hover effects, optional read-only mode, and external callbacks for handling rating changes.
 *
 * This component can be used both interactively (for logged-in users)
 * and in static mode to simply display a pre-existing rating.
 *
 * @module RatingStars
 *
 * @version 1.0.0
 *
 * @authors
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import React, { useState } from 'react';
import './RatingStars.scss';

/**
 * Props for the {@link RatingStars} component.
 *
 * @interface RatingStarsProps
 * @property {string} movieId - The unique identifier of the movie being rated.
 * @property {boolean} [readonly=false] - If true, disables interactivity and renders static stars.
 * @property {boolean} [showAverage] - (Optional) Whether to display an average rating label (not implemented yet).
 * @property {(rating: number) => void} [onRatingChange] - Callback function triggered when the user selects a rating.
 */
interface RatingStarsProps {
  movieId: string;
  readonly?: boolean;
  showAverage?: boolean;
  onRatingChange?: (rating: number) => void;
}

  /**
   * Renders the five stars with hover and selection effects.
   *
   * @function renderStars
   * @returns {JSX.Element[]} Array of rendered star elements.
   */
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