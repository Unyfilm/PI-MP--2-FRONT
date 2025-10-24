/**
 * Componente de Lista de Favoritos
 * 
 * Muestra una lista de películas favoritas del usuario con opciones
 * para eliminar y actualizar favoritos.
 */

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Star, Calendar, Clock } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import './FavoritesList.css';

interface FavoritesListProps {
  onClose?: () => void;
  maxItems?: number;
  showActions?: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  onClose,
  maxItems = 10,
  showActions = true
}) => {
  const { favorites, loading, error, loadFavorites, removeFromFavorites } = useFavoritesContext();
  const { user } = useAuth();

  // Cargar favoritos al montar el componente (solo si no están cargados)
  useEffect(() => {
    if (user && favorites.length === 0 && !loading) {
      console.log('📋 FavoritesList: Cargando favoritos desde contexto...');
      loadFavorites();
    }
  }, [user, favorites.length, loading, loadFavorites]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
