/**
 * Página de Favoritos
 * 
 * Muestra la lista de películas favoritas del usuario
 * con funcionalidad de eliminación y estadísticas.
 */

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Calendar, Tag, Play, RefreshCw } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { type Favorite } from '../../services/favoriteService';
import UnyFilmCard from '../card/UnyFilmCard';
import './FavoritesPage.css';

interface FavoritesPageProps {
  onMovieClick: (movie: any) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onMovieClick }) => {
  const { 
    favorites, 
    loading, 
    error, 
    isLoaded, 
    loadFavorites, 
    removeFromFavorites, 
    getStats 
  } = useFavoritesContext();
  
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    mostFavoritedGenre: 'N/A'
  });

  useEffect(() => {
    if (!isLoaded && favorites.length === 0 && !loading) {
      console.log('📋 FavoritesPage: Cargando favoritos...');
      loadFavorites();
    }
  }, [isLoaded, favorites.length, loading, loadFavorites]);

  useEffect(() => {
    const currentStats = getStats();
    setStats({
      totalFavorites: currentStats.total,
      mostFavoritedGenre: getMostFavoritedGenre(currentStats.byGenre)
    });
  }, [favorites, getStats]);


  const getMostFavoritedGenre = (byGenre: Record<string, number>): string => {
    const entries = Object.entries(byGenre);
    if (entries.length === 0) return 'N/A';
    
    const [mostFavorited] = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    return mostFavorited;
  };

  const handleRemoveFavorite = async (favoriteId: string, movieTitle: string) => {
    if (isRemoving) return;
    
    setIsRemoving(favoriteId);
    
    try {
      console.log('🗑️ Removing favorite:', favoriteId, movieTitle);
      const result = await removeFromFavorites(favoriteId);
      
      if (result.success) {
        console.log('✅ Favorite removed successfully');
      } else {
        console.error('❌ Failed to remove favorite:', result.message);
      }
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Refreshing favorites...');
    await loadFavorites();
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__loading">
          <div className="loading-spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__error">
          <h2>Error al cargar favoritos</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__header">
          <h1>Mis Favoritos</h1>
        </div>
        
        <div className="favorites-page__empty">
          <Heart size={64} className="empty-icon" />
          <h2>No tienes películas en favoritos</h2>
          <p>Agrega películas a tus favoritos para verlas aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__header">
        <div className="favorites-page__title">
          <h1>Mis Favoritos</h1>
          <span className="favorites-count">({favorites.length})</span>
        </div>
      </div>

      <div className="favorites-page__stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Heart size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalFavorites}</div>
            <div className="stat-label">Total Favoritos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.mostFavoritedGenre}</div>
            <div className="stat-label">Género Favorito</div>
          </div>
        </div>
      </div>

      <div className="favorites-page__grid">
        {favorites.map((favorite) => (
          <div key={favorite._id} className="favorite-card">
            <UnyFilmCard
              title={favorite.movieId.title}
              image={favorite.movieId.poster}
              fallbackImage=""
              genre={favorite.movieId.genre.join(', ')}
              rating={favorite.rating || 0}
              year={new Date(favorite.movieId.releaseDate).getFullYear()}
              description={favorite.notes || ''}
              movieId={favorite.movieId._id}
              onMovieClick={onMovieClick}
            />
            {(favorite.notes || favorite.rating) && (
              <div className="favorite-card__info">
                {favorite.notes && (
                  <div className="favorite-note">
                    <strong>Notas:</strong> {favorite.notes}
                  </div>
                )}
                {favorite.rating && (
                  <div className="favorite-rating">
                    <Star size={14} />
                    <span>{favorite.rating}/5</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;