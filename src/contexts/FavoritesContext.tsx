/**
 * Contexto Global de Favoritos
 * 
 * Proporciona estado global de favoritos para evitar múltiples peticiones
 * y sincronizar el estado entre todos los componentes.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { type Favorite } from '../services/favoriteService';
import { PRODUCTION_FAVORITES_CONFIG, FAVORITES_PRODUCTION_ERRORS, FAVORITES_PRODUCTION_MESSAGES } from './FavoritesContext.production';

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
  isMovieInFavorites: (movieId: string) => boolean;
  getFavoriteById: (movieId: string) => Favorite | null;
  addToFavorites: (movieId: string, notes?: string, rating?: number) => Promise<{ success: boolean; message?: string }>;
  removeFromFavorites: (favoriteId: string) => Promise<{ success: boolean; message?: string }>;
  loadFavorites: () => Promise<void>;
  getStats: () => { total: number; byGenre: Record<string, number> };
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const favoritesHook = useFavorites();
  
  const isMovieInFavorites = (movieId: string): boolean => {
    return favoritesHook.favorites.some(fav => fav.movieId._id === movieId);
  };

  const getFavoriteById = (movieId: string): Favorite | null => {
    return favoritesHook.favorites.find(fav => fav.movieId._id === movieId) || null;
  };

  const contextValue: FavoritesContextType = {
    favorites: favoritesHook.favorites,
    loading: favoritesHook.loading,
    error: favoritesHook.error,
    isLoaded: favoritesHook.isLoaded,
    isMovieInFavorites,
    getFavoriteById,
    addToFavorites: favoritesHook.addToFavorites,
    removeFromFavorites: favoritesHook.removeFromFavorites,
    loadFavorites: favoritesHook.loadFavorites,
    getStats: favoritesHook.getStats
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
