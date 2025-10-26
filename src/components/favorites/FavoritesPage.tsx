
import React, { useState, useEffect } from 'react';
import { Heart, Star, Tag } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { movieService } from '../../services/movieService';
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
    getStats 
  } = useFavoritesContext();
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
              onMovieClick={async () => {
                try {
                  console.log('🎬 FavoritesPage - Obteniendo datos completos de la película:', favorite.movieId._id);
                  
                  const fullMovieData = await movieService.getMovie(favorite.movieId._id);
                  
                  console.log('🎬 FavoritesPage - Datos completos obtenidos:', {
                    movieId: fullMovieData._id,
                    hasVideoUrl: !!fullMovieData.videoUrl,
                    hasCloudinaryId: !!fullMovieData.cloudinaryVideoId,
                    hasSynopsis: !!fullMovieData.synopsis
                  });
                  
                  onMovieClick({
                    _id: fullMovieData._id,
                    title: fullMovieData.title,
                    index: 0,
                    videoUrl: fullMovieData.videoUrl || '',
                    rating: favorite.rating || fullMovieData.rating?.average || 0,
                    year: new Date(fullMovieData.releaseDate || '').getFullYear(),
                    genre: fullMovieData.genre[0] || '',
                    description: favorite.notes || fullMovieData.description || '',
                    synopsis: fullMovieData.synopsis || fullMovieData.description,
                    genres: fullMovieData.genre,
                    cloudinaryPublicId: fullMovieData.cloudinaryVideoId,
                    cloudinaryUrl: fullMovieData.videoUrl,
                    duration: fullMovieData.duration || 0
                  });
                } catch (error) {
                  console.error('❌ Error obteniendo datos completos de la película:', error);
                  onMovieClick({
                    _id: favorite.movieId._id,
                    title: favorite.movieId.title,
                    index: 0,
                    videoUrl: favorite.movieId.videoUrl || '',
                    rating: favorite.rating || 0,
                    year: new Date(favorite.movieId.releaseDate).getFullYear(),
                    genre: favorite.movieId.genre[0] || '',
                    description: favorite.notes || '',
                    synopsis: favorite.movieId.synopsis || favorite.movieId.description,
                    genres: favorite.movieId.genre,
                    cloudinaryPublicId: favorite.movieId.cloudinaryVideoId,
                    cloudinaryUrl: favorite.movieId.videoUrl,
                    duration: favorite.movieId.duration || 0
                  });
                }
              }}
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