

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { type Favorite } from '../services/favoriteService';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);
  
  
  useEffect(() => {
    const currentUserId = user?._id?.toString() || null;
    
    if (currentUserId !== lastUserIdRef.current) {
      favoritesHook.clearFavorites();
      
      
      lastUserIdRef.current = currentUserId;
      
     
      if (currentUserId && user) {
        setTimeout(() => {
          favoritesHook.loadFavorites();
        }, 100);
      }
    }
  }, [user?._id, favoritesHook]);
  
  
  const isMovieInFavorites = (movieId: string): boolean => {
    
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede verificar favoritos');
      return false;
    }
    return favoritesHook.favorites.some(fav => fav.movieId._id === movieId);
  };

  
  const getFavoriteById = (movieId: string): Favorite | null => {
    
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede obtener favorito');
      return null;
    }
    return favoritesHook.favorites.find(fav => fav.movieId._id === movieId) || null;
  };

  
  const addToFavorites = async (movieId: string, notes?: string, rating?: number) => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede agregar a favoritos');
      return { success: false, message: 'Usuario no autenticado' };
    }
    return favoritesHook.addToFavorites(movieId, notes, rating);
  };

  
  const removeFromFavorites = async (favoriteId: string) => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede eliminar de favoritos');
      return { success: false, message: 'Usuario no autenticado' };
    }
    return favoritesHook.removeFromFavorites(favoriteId);
  };

  
  const loadFavorites = async () => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se pueden cargar favoritos');
      return;
    }
    return favoritesHook.loadFavorites();
  };

  const contextValue: FavoritesContextType = {
    favorites: user ? favoritesHook.favorites : [], 
    loading: favoritesHook.loading,
    error: favoritesHook.error,
    isLoaded: favoritesHook.isLoaded,
    isMovieInFavorites,
    getFavoriteById,
    addToFavorites,
    removeFromFavorites,
    loadFavorites,
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
