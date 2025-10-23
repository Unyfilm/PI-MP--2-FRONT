import React from 'react';
import './VisualRatingStars.css';

/**
 * VisualRatingStarsProps
 *
 * Props for the visual rating stars component that displays average ratings
 * without interaction capabilities.
 */
interface VisualRatingStarsProps {
  averageRating: number;
  totalRatings?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  className?: string;
}

/**
 * VisualRatingStars
 *
 * Visual-only rating stars component that displays average ratings using
 * filled stars based on the rating value. Stars are not clickable and
 * only serve as a visual indicator of the movie's average rating.
 *
 * @param {VisualRatingStarsProps} props - Component props
 * @returns {JSX.Element} Visual rating stars UI
 */
export default function VisualRatingStars({
  averageRating,
  totalRatings = 0,
  size = 'medium',
  showCount = false,
  className = ''
}: VisualRatingStarsProps) {
  
  /**
   * Render individual star based on rating
   * @param {number} starIndex - Index of the star (0-4)
   * @returns {JSX.Element} Star element with appropriate fill
   */
  const renderStar = (starIndex: number) => {
    const starNumber = starIndex + 1;
    const isFullStar = starNumber <= Math.floor(averageRating);
    const isHalfStar = starNumber === Math.ceil(averageRating) && averageRating % 1 >= 0.5;
    
    return (
      <span
        key={starIndex}
        className={`visual-star visual-star--${size} ${
          isFullStar ? 'visual-star--full' :
          isHalfStar ? 'visual-star--half' : 'visual-star--empty'
        }`}
        aria-label={`${isFullStar ? 'Estrella completa' : isHalfStar ? 'Media estrella' : 'Estrella vacía'}`}
      >
        ★
      </span>
    );
  };

  return (
    <div className={`visual-rating-stars ${className}`}>
      <div className="visual-rating-stars__container">
        <div className="visual-rating-stars__stars">
          {Array.from({ length: 5 }, (_, index) => renderStar(index))}
        </div>
        {showCount && totalRatings > 0 && (
          <span className="visual-rating-stars__count">
            ({totalRatings})
          </span>
        )}
      </div>
    </div>
  );
}
