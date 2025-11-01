import React, { useState, useEffect } from 'react';
import { Heart, Star, Tag } from 'lucide-react';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { movieService } from '../../services/movieService';
import UnyFilmCard from '../card/UnyFilmCard';
import './FavoritesPage.css';

/**
 * @file FavoritesPage.tsx
 * @description
 * Displays the user's list of favorite movies with quick statistics such as
 * total favorites and most frequently favorited genre.  
 * 
 * The component retrieves data from `FavoritesContext`, displays statistics,
 * and allows users to open movies directly in the player by clicking a card.
 * 
 * @module FavoritesPage
 */

/**
 * @interface FavoritesPageProps
 * @description
 * Props interface for the `FavoritesPage` component.
 *
 * @property {(movie: any) => void} onMovieClick - Callback triggered when a movie card is clicked.  
 * Receives the full movie data as an argument.
 */
interface FavoritesPageProps {
  onMovieClick: (movie: any) => void;
}

/**
 * @function FavoritesPage
 * @description
 * React component that lists the user's favorite movies with summary stats.  
 * It loads the user's favorites from context, computes the most favorited genre,
 * and provides movie cards that can open the player view.
 *
 * @param {FavoritesPageProps} props - Component properties.
 * @returns {JSX.Element} Rendered favorites page with header, stats, and movie cards.
 *
 * @example
 * ```tsx
 * <FavoritesPage onMovieClick={(movie) => console.log('Selected movie:', movie)} />
 * ```
 */
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

  /**
   * Loads favorites when the component mounts if not already loaded.
   * This ensures the user's favorites are fetched from the context.
   */
  useEffect(() => {
    if (!isLoaded && favorites.length === 0 && !loading) {
      console.log('📋 FavoritesPage: Cargando favoritos...');
      loadFavorites();
    }
  }, [isLoaded, favorites.length, loading, loadFavorites]);

  /**
   * Updates local stats when the favorites list changes.
   * Uses context-provided `getStats()` and helper function to calculate the most favorited genre.
   */
  useEffect(() => {
    const currentStats = getStats();
    setStats({
      totalFavorites: currentStats.total,
      mostFavoritedGenre: getMostFavoritedGenre(currentStats.byGenre)
    });
  }, [favorites, getStats]);

  /**
   * @function getMostFavoritedGenre
   * @description
   * Determines the genre with the highest number of favorites.
   *
   * @param {Record<string, number>} byGenre - Object mapping genres to their favorite count.
   * @returns {string} The genre with the most favorites or 'N/A' if none exist.
   */
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
                    duration: fullMovieData.duration || 0,
                    subtitles: fullMovieData.subtitles
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
                    duration: favorite.movieId.duration || 0,
                    subtitles: (favorite.movieId as any).subtitles
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