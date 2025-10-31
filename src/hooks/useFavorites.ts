

import { useState, useEffect, useCallback, useRef } from 'react';
import { favoriteService, type Favorite } from '../services/favoriteService';


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
  
  getStats: () => { total: number; byGenre: Record<string, number> };
}


export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false); 

  
  const loadFavorites = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const result = await favoriteService.getMyFavorites(1, 100);
      
      if (result.success && result.data) {
        setFavorites(result.data.favorites);
        setIsLoaded(true);
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

 
  const addToFavorites = useCallback(async (
    movieId: string, 
    notes: string = '', 
    rating: number | null = null
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await favoriteService.addToFavorites(movieId, notes, rating);
      
      if (result.success && result.data) {
        setFavorites(prev => {
          const exists = prev.some(fav => fav._id === result.data!._id);
          if (!exists) {
            return [...prev, result.data!];
          }
          return prev;
        });
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

 
  const removeFromFavorites = useCallback(async (
    favoriteId: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await favoriteService.removeFromFavorites(favoriteId);
      
      if (result.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
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


  const updateFavorite = useCallback(async (
    favoriteId: string,
    updates: { notes?: string; rating?: number }
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await favoriteService.updateFavorite(favoriteId, updates);
      
      if (result.success && result.data) {
        setFavorites(prev => prev.map(fav => 
          fav._id === favoriteId ? { ...fav, ...updates } : fav
        ));
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

  const isMovieInFavorites = useCallback(async (movieId: string): Promise<boolean> => {
    try {
      if (isLoaded && favorites.length >= 0) {
        const isFavorite = favorites.some(fav => fav.movieId._id === movieId);
        return isFavorite;
      }
      
      return await favoriteService.isMovieInFavorites(movieId);
    } catch (error) {
      console.error('Error verificando favoritos:', error);
      return false;
    }
  }, [favorites, isLoaded]);

 
  const getFavoriteById = useCallback(async (favoriteId: string): Promise<Favorite | null> => {
    try {
      const result = await favoriteService.getFavoriteById(favoriteId);
      return result.success && result.data ? result.data : null;
    } catch (error) {
      console.error('Error obteniendo favorito:', error);
      return null;
    }
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setError(null);
    setIsLoaded(false);
    loadingRef.current = false;
  }, []);

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

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isLoaded && !loadingRef.current && favorites.length === 0) {
      loadFavorites();
    }
  }, [isLoaded, favorites.length]); 

 
  useEffect(() => {
    const checkTokenChange = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('auth:user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const currentUserId = user._id?.toString();
          
          
          if (currentUserId && !isLoaded && !loadingRef.current) {
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

  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          clearFavorites();
        } else if (e.newValue && !e.oldValue) {
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
