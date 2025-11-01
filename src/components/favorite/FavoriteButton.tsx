/**
 * FavoriteButton component
 * Toggles a movie as favorite using FavoritesContext with loading/animation states.
 */

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  movieId: string;
  movieTitle?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onToggle?: (isFavorite: boolean, movieId: string) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movieId,
  movieTitle,
  size = 'medium',
  showLabel = false,
  onToggle,
  className = ''
}) => {
  const { favorites, isMovieInFavorites, addToFavorites, removeFromFavorites, loading, getFavoriteById } = useFavoritesContext();
  const [isToggling, setIsToggling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMovieFavorite, setIsMovieFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkFavoriteStatus = () => {
      try {
        const isFavorite = isMovieInFavorites(movieId);
        const favorite = getFavoriteById(movieId);
        
        setIsMovieFavorite(isFavorite);
        setFavoriteId(favorite?._id || null);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [movieId, favorites, isMovieInFavorites, getFavoriteById, loading]); 

 
  const handleToggle = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling || loading) {
      return;
    }
    
    setIsToggling(true);
    setIsAnimating(true);
    
    try {
      if (isMovieFavorite && favoriteId) {
        
        const result = await removeFromFavorites(favoriteId);
        
        if (result.success) {
          setIsMovieFavorite(false);
          setFavoriteId(null);
          onToggle?.(false, movieId);
        } else {
        }
      } else {
        const result = await addToFavorites(movieId);
        
        if (result.success) {
          setIsMovieFavorite(true);
          if (result && typeof result === 'object' && '_id' in result) {
            setFavoriteId((result as any)._id);
          }
          onToggle?.(true, movieId);
        } else {
        }
      }
    } catch (error) {
    } finally {
      setIsToggling(false);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

 
  const getSizeClasses = (): string => {
    switch (size) {
      case 'small':
        return 'favorite-button--small';
      case 'large':
        return 'favorite-button--large';
      default:
        return 'favorite-button--medium';
    }
  };


  const getButtonText = (): string => {
    if (isMovieFavorite) {
      return 'En favoritos';
    }
    return 'Agregar a favoritos';
  };


  const getAriaLabel = (): string => {
    if (isMovieFavorite) {
      return `Eliminar ${movieTitle || 'película'} de favoritos`;
    }
    return `Agregar ${movieTitle || 'película'} a favoritos`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleToggle(e);
    }
  };

  return (
    <button
      className={`favorite-button ${getSizeClasses()} ${
        isMovieFavorite ? 'favorite-button--active' : ''
      } ${isAnimating ? 'favorite-button--animating' : ''} ${className}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      disabled={isToggling || loading}
      aria-label={getAriaLabel()}
      title={isMovieFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        className={`favorite-button__icon ${isMovieFavorite ? 'favorite-button__icon--filled' : ''}`}
      />
      
      {showLabel && (
        <span className="favorite-button__label">
          {getButtonText()}
        </span>
      )}
      
      {(isToggling || loading) && (
        <div className="favorite-button__loading">
          <div className="favorite-button__spinner"></div>
        </div>
      )}
    </button>
  );
};

export default FavoriteButton;