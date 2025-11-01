import React, { useEffect } from 'react';
import { Heart, Trash2, Star, Calendar, Clock } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import './FavoritesList.css';

/**
 * @file FavoritesList.tsx
 * @description
 * React component that displays a user's list of favorite movies.
 * It allows authenticated users to view, reload, and remove their favorite movies.
 *
 * The component interacts with the `FavoritesContext` to load and manage the user's
 * favorites, and with the `AuthContext` to ensure access is restricted to logged-in users.
 *
 * Includes formatted metadata such as rating, genre, duration, and date added.
 *
 * @module FavoritesList
 */

/**
 * @interface FavoritesListProps
 * @description
 * Defines the props accepted by the `FavoritesList` component.
 *
 * @property {() => void} [onClose] - Optional callback triggered when the close button is clicked.
 * @property {number} [maxItems=10] - Maximum number of favorite movies displayed.
 * @property {boolean} [showActions=true] - Whether to display the remove (delete) button.
 */
interface FavoritesListProps {
  onClose?: () => void;
  maxItems?: number;
  showActions?: boolean;
}

/**
 * @function FavoritesList
 * @description
 * Renders a list of the user's favorite movies with metadata and actions.
 * Handles states such as loading, error, and empty favorites.
 *
 * Automatically fetches favorites from context when a user logs in and none are loaded.
 *
 * @param {FavoritesListProps} props - The component's properties.
 * @returns {JSX.Element} Rendered favorites list with UI states.
 *
 * @example
 * ```tsx
 * <FavoritesList
 *   onClose={() => setShowFavorites(false)}
 *   maxItems={8}
 *   showActions={true}
 * />
 * ```
 */
const FavoritesList: React.FC<FavoritesListProps> = ({
  onClose,
  maxItems = 10,
  showActions = true
}) => {
  const { favorites, loading, error, loadFavorites, removeFromFavorites } = useFavoritesContext();
  const { user } = useAuth();

  useEffect(() => {
    if (user && favorites.length === 0 && !loading) {
      console.log('📋 FavoritesList: Cargando favoritos desde contexto...');
      loadFavorites();
    }
  }, [user, favorites.length, loading, loadFavorites]);

  /**
   * @function handleRemoveFavorite
   * @description
   * Handles the removal of a movie from the favorites list.
   * Confirms the action, calls the context removal function, and logs the result.
   *
   * @async
   * @param {string} favoriteId - The unique ID of the favorite entry to remove.
   * @param {string} movieTitle - The title of the movie to display in the confirmation message.
   * @returns {Promise<void>}
   */
  const handleRemoveFavorite = async (favoriteId: string, movieTitle: string) => {
    if (!confirm(`¿Eliminar "${movieTitle}" de favoritos?`)) {
      return;
    }

    try {
      const result = await removeFromFavorites(favoriteId);
      if (result.success) {
        console.log('✅ Favorito eliminado desde FavoritesList');
      } else {
        console.error('❌ Error eliminando favorito:', result.message);
        alert('Error al eliminar de favoritos');
      }
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      alert('Error al eliminar de favoritos');
    }
  };

  /**
   * @function formatDate
   * @description
   * Formats a date string into a localized human-readable format.
   *
   * @param {string} dateString - ISO date string to format.
   * @returns {string} Formatted date (e.g., "28 oct 2025").
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * @function formatDuration
   * @description
   * Converts a movie duration in minutes into hours and minutes.
   *
   * @param {number} minutes - Duration in minutes.
   * @returns {string} Duration string (e.g., "2h 15m" or "45m").
   */
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!user) {
    return (
      <div className="favorites-list favorites-list--empty">
        <div className="favorites-list__empty-state">
          <Heart size={48} className="favorites-list__empty-icon" />
          <p>Inicia sesión para ver tus favoritos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-list">
        <div className="favorites-list__loading">
          <div className="favorites-list__spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-list">
        <div className="favorites-list__error">
          <p>{error}</p>
          <button onClick={loadFavorites} className="favorites-list__retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-list favorites-list--empty">
        <div className="favorites-list__empty-state">
          <Heart size={48} className="favorites-list__empty-icon" />
          <h3>No tienes favoritos aún</h3>
          <p>Agrega películas a tus favoritos haciendo clic en el corazón</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <div className="favorites-list__header">
        <h3 className="favorites-list__title">
          <Heart size={20} />
          Mis Favoritos ({favorites.length})
        </h3>
        {onClose && (
          <button onClick={onClose} className="favorites-list__close-btn">
            ×
          </button>
        )}
      </div>

      <div className="favorites-list__content">
        {favorites.map((favorite) => (
          <div key={favorite._id} className="favorites-list__item">
            <div className="favorites-list__item-poster">
              <img
                src={favorite.movieId.poster || '/images/placeholder-movie.jpg'}
                alt={favorite.movieId.title}
                className="favorites-list__item-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-movie.jpg';
                }}
              />
            </div>

            <div className="favorites-list__item-info">
              <h4 className="favorites-list__item-title">
                {favorite.movieId.title}
              </h4>
              
              <div className="favorites-list__item-meta">
                {favorite.rating && (
                  <div className="favorites-list__item-rating">
                    <Star size={14} />
                    <span>{favorite.rating}/5</span>
                  </div>
                )}
                
                {favorite.movieId.duration && (
                  <div className="favorites-list__item-duration">
                    <Clock size={14} />
                    <span>{formatDuration(favorite.movieId.duration)}</span>
                  </div>
                )}
                
                <div className="favorites-list__item-date">
                  <Calendar size={14} />
                  <span>{formatDate(favorite.createdAt)}</span>
                </div>
              </div>

              {favorite.notes && (
                <p className="favorites-list__item-notes">
                  "{favorite.notes}"
                </p>
              )}

              {favorite.movieId.genre && favorite.movieId.genre.length > 0 && (
                <div className="favorites-list__item-genres">
                  {favorite.movieId.genre.slice(0, 2).map((genre, index) => (
                    <span key={index} className="favorites-list__item-genre">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {showActions && (
              <div className="favorites-list__item-actions">
                <button
                  onClick={() => handleRemoveFavorite(favorite._id, favorite.movieId.title)}
                  className="favorites-list__remove-btn"
                  title="Eliminar de favoritos"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {favorites.length >= maxItems && (
        <div className="favorites-list__footer">
          <p className="favorites-list__more-info">
            Mostrando {maxItems} de tus favoritos
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
