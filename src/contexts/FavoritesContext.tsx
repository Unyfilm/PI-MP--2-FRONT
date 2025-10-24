/**
 * Contexto Global de Favoritos
 * 
 * Proporciona estado global de favoritos para evitar múltiples peticiones
 * y sincronizar el estado entre todos los componentes.
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  
  // Invalidar cache de favoritos cuando cambia el usuario
  useEffect(() => {
    const currentUserId = user?.id?.toString() || null;
    
    if (currentUserId !== lastUserIdRef.current) {
      console.log('🔄 Usuario cambió, invalidando cache de favoritos:', {
        previousUserId: lastUserIdRef.current,
        currentUserId: currentUserId
      });
      
      // Limpiar favoritos del hook
      favoritesHook.clearFavorites();
      
      // Actualizar referencia del usuario
      lastUserIdRef.current = currentUserId;
      
      // Si hay un nuevo usuario autenticado, cargar sus favoritos
      if (currentUserId && user) {
        console.log('🔄 Nuevo usuario detectado, cargando favoritos...');
        // Usar setTimeout para asegurar que el clearFavorites se complete primero
        setTimeout(() => {
          favoritesHook.loadFavorites();
        }, 100);
      }
    }
  }, [user?.id, favoritesHook]);
  
  // Función optimizada para verificar si una película está en favoritos (sin peticiones)
  const isMovieInFavorites = (movieId: string): boolean => {
    // Validar que el usuario esté autenticado
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede verificar favoritos');
      return false;
    }
    return favoritesHook.favorites.some(fav => fav.movieId._id === movieId);
  };

  // Función optimizada para obtener favorito por movieId (sin peticiones)
  const getFavoriteById = (movieId: string): Favorite | null => {
    // Validar que el usuario esté autenticado
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede obtener favorito');
      return null;
    }
    return favoritesHook.favorites.find(fav => fav.movieId._id === movieId) || null;
  };

  // Función wrapper para addToFavorites con validación de usuario
  const addToFavorites = async (movieId: string, notes?: string, rating?: number) => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede agregar a favoritos');
      return { success: false, message: 'Usuario no autenticado' };
    }
    return favoritesHook.addToFavorites(movieId, notes, rating);
  };

  // Función wrapper para removeFromFavorites con validación de usuario
  const removeFromFavorites = async (favoriteId: string) => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se puede eliminar de favoritos');
      return { success: false, message: 'Usuario no autenticado' };
    }
    return favoritesHook.removeFromFavorites(favoriteId);
  };

  // Función wrapper para loadFavorites con validación de usuario
  const loadFavorites = async () => {
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, no se pueden cargar favoritos');
      return;
    }
    return favoritesHook.loadFavorites();
  };

  const contextValue: FavoritesContextType = {
    favorites: user ? favoritesHook.favorites : [], // Solo mostrar favoritos si hay usuario autenticado
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
