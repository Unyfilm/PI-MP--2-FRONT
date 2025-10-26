/**
 * Custom hook for managing favorites
 * 
 * Provides global favorites state with the new endpoint logic.
 * Implements all CRUD operations according to the provided guide.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { favoriteService, type Favorite } from '../services/favoriteService';

/**
 * Interface for useFavorites hook return value
 * @interface UseFavoritesReturn
 */
interface UseFavoritesReturn {
  
  favorites: Favorite[];
  
  loading: boolean;
  
  error: string | null;
  
  isLoaded: boolean;
  
  loadFavorites: () => Promise<void>;
  
  addToFavorites: (movieId: string, notes?: string, rating?: number) => Promise<{ success: boolean; message?: string }>;
  
  removeFromFavorites: (favoriteId: string) => Promise<{ success: boolean; message?: string }>;
  
  clearFavorites: () => void;
  
  updateFavorite: (favoriteId: string, updates: { notes?: string; rating?: number }) => Promise<{ success: boolean; message?: string }>;
  
  isMovieInFavorites: (movieId: string) => Promise<boolean>;
  
  getFavoriteById: (favoriteId: string) => Promise<Favorite | null>;
  
  clearFavorites: () => void;
  
  getStats: () => { total: number; byGenre: Record<string, number> };
}

/**
 * Custom hook for managing user favorites
 * @returns {UseFavoritesReturn} Object with favorites state and methods
 */
export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false); 

  /**
   * Cargar favoritos del usuario
   */
  const loadFavorites = useCallback(async () => {
    if (loadingRef.current) {
      console.log('📋 Favorites already loading, skipping...');
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Loading user favorites...');
      const result = await favoriteService.getMyFavorites(1, 100);
      
      if (result.success && result.data) {
        setFavorites(result.data.favorites);
        setIsLoaded(true);
        console.log('✅ Favorites loaded successfully:', result.data.favorites.length, 'items');
      } else {
        setError(result.message || 'Error al cargar favoritos');
        console.error('❌ Failed to load favorites:', result.message);
      }
    } catch (err: any) {
      const errorMsg = 'Error al cargar favoritos';
      setError(errorMsg);
      console.error('❌ Error loading favorites:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  /**
   * Agregar a favoritos
   */
  const addToFavorites = useCallback(async (
    movieId: string, 
    notes: string = '', 
    rating: number | null = null
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ Adding to favorites:', movieId);
      const result = await favoriteService.addToFavorites(movieId, notes, rating);
      
      if (result.success && result.data) {
        setFavorites(prev => {
          const exists = prev.some(fav => fav._id === result.data!._id);
          if (!exists) {
            return [...prev, result.data!];
          }
          return prev;
        });
        console.log('✅ Successfully added to favorites');
        return { success: true };
      } else {
        const errorMsg = result.message || 'Error al agregar a favoritos';
        setError(errorMsg);
        console.error('❌ Failed to add to favorites:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = 'Error al agregar a favoritos';
      setError(errorMsg);
      console.error('❌ Error adding to favorites:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar de favoritos
   */
  const removeFromFavorites = useCallback(async (
    favoriteId: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🗑️ Removing from favorites:', favoriteId);
      const result = await favoriteService.removeFromFavorites(favoriteId);
      
      if (result.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
        console.log('✅ Successfully removed from favorites');
        return { success: true };
      } else {
        const errorMsg = result.message || 'Error al eliminar de favoritos';
        setError(errorMsg);
        console.error('❌ Failed to remove from favorites:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = 'Error al eliminar de favoritos';
      setError(errorMsg);
      console.error('❌ Error removing from favorites:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar favorito
   */
  const updateFavorite = useCallback(async (
    favoriteId: string,
    updates: { notes?: string; rating?: number }
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('✏️ Updating favorite:', favoriteId);
      const result = await favoriteService.updateFavorite(favoriteId, updates);
      
      if (result.success && result.data) {
        setFavorites(prev => prev.map(fav => 
          fav._id === favoriteId ? { ...fav, ...updates } : fav
        ));
        console.log('✅ Successfully updated favorite');
        return { success: true };
      } else {
        const errorMsg = result.message || 'Error al actualizar favorito';
        setError(errorMsg);
        console.error('❌ Failed to update favorite:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = 'Error al actualizar favorito';
      setError(errorMsg);
      console.error('❌ Error updating favorite:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar si una película está en favoritos (usando cache local)
   */
  const isMovieInFavorites = useCallback(async (movieId: string): Promise<boolean> => {
    try {
      if (isLoaded && favorites.length >= 0) {
        const isFavorite = favorites.some(fav => fav.movieId._id === movieId);
        console.log(`🔍 Cache local - Película ${movieId} ${isFavorite ? 'está' : 'no está'} en favoritos`);
        return isFavorite;
      }
      
      console.log(`🌐 Petición al backend para verificar ${movieId}`);
      return await favoriteService.isMovieInFavorites(movieId);
    } catch (error) {
      console.error('Error verificando favoritos:', error);
      return false;
    }
  }, [favorites, isLoaded]);

  /**
   * Obtener favorito por ID
   */
  const getFavoriteById = useCallback(async (favoriteId: string): Promise<Favorite | null> => {
    try {
      const result = await favoriteService.getFavoriteById(favoriteId);
      return result.success && result.data ? result.data : null;
    } catch (error) {
      console.error('Error obteniendo favorito:', error);
      return null;
    }
  }, []);

  /**
   * Limpiar favoritos (al cerrar sesión)
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setError(null);
    setIsLoaded(false);
    loadingRef.current = false;
    console.log('🗑️ Favorites cleared');
  }, []);

  /**
   * Obtener estadísticas de favoritos
   */
  const getStats = useCallback(() => {
    const total = favorites.length;
    const byGenre: Record<string, number> = {};
    
    favorites.forEach(favorite => {
      favorite.movieId.genre.forEach(genre => {
        byGenre[genre] = (byGenre[genre] || 0) + 1;
      });
    });
    
    return { total, byGenre };
  }, [favorites]);

  /**
   * Cargar favoritos al montar el componente (optimizado)
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoaded && !loadingRef.current && favorites.length === 0) {
      console.log('🚀 Initializing favorites load...');
      loadFavorites();
    }
  }, [isLoaded, favorites.length]); 

  /**
   * Detectar cambios en el token del mismo tab
   */
  useEffect(() => {
    const checkTokenChange = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('auth:user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const currentUserId = user.id?.toString();
          
          
          if (currentUserId && !isLoaded && !loadingRef.current) {
            console.log('🔄 Token detectado, cargando favoritos para usuario:', currentUserId);
            loadFavorites();
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

  
    checkTokenChange();
    

    const interval = setInterval(checkTokenChange, 1000);
    
    return () => clearInterval(interval);
  }, [isLoaded, loadFavorites]);

  /**
   * Limpiar favoritos cuando el usuario cierre sesión
   * y cargar favoritos cuando el usuario se loguee
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
         
          console.log('🚪 Usuario cerró sesión, limpiando favoritos');
          clearFavorites();
        } else if (e.newValue && !e.oldValue) {
       
          console.log('🚪 Usuario se logueó, cargando favoritos');
          setTimeout(() => {
            loadFavorites();
          }, 500); 
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearFavorites, loadFavorites]);

  return {
    favorites,
    loading,
    error,
    isLoaded,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    updateFavorite,
    isMovieInFavorites,
    getFavoriteById,
    clearFavorites,
    getStats
  };
};

export default useFavorites;
