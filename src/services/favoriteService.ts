

import { API_CONFIG } from '../config/environment';


export interface Favorite {
  _id: string;
  userId: string;
  movieId: {
    _id: string;
    title: string;
    poster: string;
    genre: string[];
    director: string;
    duration: number;
    releaseDate: string;
    videoUrl?: string;
    cloudinaryVideoId?: string;
    synopsis?: string;
    description?: string;
    trailer?: string;
    port?: string;
    rating?: {
      average?: number;
      count?: number;
    };
  };
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}


export interface FavoriteResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}


export interface FavoriteStats {
  totalFavorites: number;
  averageRating: number;
  mostFavoritedGenre: string;
}


class FavoriteService {
  private baseUrl: string;
  private favoritesCache: { [movieId: string]: { isFavorite: boolean; favoriteId?: string } } = {};
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 30000;

 
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

 
  private async getUserId(): Promise<string> {
    const userData = localStorage.getItem('auth:user');
    const token = localStorage.getItem('token');
    
    if (!userData) {
      throw new Error('No user data found - user not authenticated');
    }
    
    if (!token) {
      throw new Error('No authentication token found - user not logged in');
    }
    
    try {
      const user = JSON.parse(userData);
      const userId = user.id;
      
      console.log('🔍 Debug getUserId:', {
        user,
        userId,
        userIdType: typeof userId,
        userIdValue: userId,
        hasToken: !!token
      });
      
      const tokenObjectId = this.extractObjectIdFromToken();
      if (tokenObjectId) {
        console.log('✅ ObjectId extraído del JWT token:', tokenObjectId);
        return tokenObjectId;
      }
      
      if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
        console.log('🔍 UserId es un número, obteniendo ObjectId del backend...');
        try {
          return await this.getUserObjectId();
        } catch (backendError) {
          console.warn('⚠️ Error obteniendo ObjectId del backend, usando temporal:', backendError);
          return this.generateTemporaryObjectId();
        }
      }
      
      if (typeof userId === 'string' && /^[0-9a-fA-F]{24}$/.test(userId)) {
        console.log('✅ UserId es un ObjectId válido');
        return userId;
      }
      
      console.log('⚠️ UserId no es ni número ni ObjectId válido, obteniendo del backend...');
      try {
        return await this.getUserObjectId();
      } catch (backendError) {
        console.warn('⚠️ Error obteniendo ObjectId del backend, usando temporal:', backendError);
        return this.generateTemporaryObjectId();
      }
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Invalid user data format - please log in again');
    }
  }


  private extractObjectIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      const decodedPayload = JSON.parse(atob(payload));
      console.log('🔍 JWT payload:', decodedPayload);
      
      if (decodedPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decodedPayload.exp;
        const isExpired = currentTime > expirationTime;
        
        console.log('🔍 JWT Token Status:', {
          currentTime,
          expirationTime,
          isExpired,
          timeUntilExpiry: expirationTime - currentTime
        });
        
        if (isExpired) {
          console.warn('⚠️ JWT token expirado');
          return null;
        }
      }
      
      const possibleFields = ['_id', 'id', 'userId', 'user_id', 'sub'];
      for (const field of possibleFields) {
        if (decodedPayload[field] && /^[0-9a-fA-F]{24}$/.test(decodedPayload[field])) {
          console.log(`✅ ObjectId encontrado en JWT campo '${field}':`, decodedPayload[field]);
          return decodedPayload[field];
        }
      }
      
      return null;
    } catch (error) {
      console.log('⚠️ Error decodificando JWT token:', error);
      return null;
    }
  }

  
  private async getUserObjectId(): Promise<string> {
    try {
      console.log('🌐 Obteniendo ObjectId del usuario desde /users/profile...');
      
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      console.log('📥 Respuesta del endpoint /users/profile:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📋 Datos del perfil:', data);
        
        if (data.success && data.data) {
          const possibleIdFields = ['_id', 'id', 'userId', 'user_id'];
          
          for (const field of possibleIdFields) {
            if (data.data[field]) {
              const userId = data.data[field];
              console.log(`✅ ID encontrado en campo '${field}':`, userId);
              
              if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                console.log('✅ ObjectId válido encontrado:', userId);
                return userId;
              }
              
              if (typeof userId === 'number' || /^\d+$/.test(userId)) {
                console.log('⚠️ ID es un número, generando ObjectId temporal...');
                return this.generateTemporaryObjectId();
              }
            }
          }
          
          throw new Error('No se encontró un ID válido en la respuesta del perfil');
        } else {
          throw new Error('Respuesta del perfil no exitosa');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error del servidor: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
    } catch (error) {
      console.error('Error obteniendo ObjectId del usuario:', error);
      console.log('⚠️ Generando ObjectId temporal como fallback...');
      return this.generateTemporaryObjectId();
    }
  }

  
  private generateTemporaryObjectId(): string {
    const userData = localStorage.getItem('auth:user');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const user = JSON.parse(userData);
    const userId = user.id;
    
    const userIdHex = userId.toString(16).padStart(8, '0');
    const consistentObjectId = '000000000000000000000000'.substring(0, 16) + userIdHex;
    
    console.log('🔧 ObjectId temporal CONSISTENTE generado:', consistentObjectId, 'para userId:', userId);
    return consistentObjectId;
  }

 
  private invalidateCache(): void {
    this.favoritesCache = {};
    this.cacheTimestamp = 0;
  }

  async getMyFavorites(
    page: number = 1, 
    limit: number = 10, 
    filters: {
    genre?: string;
    fromDate?: string;
    toDate?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    } = {}
  ): Promise<FavoriteResponse<{ favorites: Favorite[]; pagination: any }>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await fetch(`${this.baseUrl}/favorites/me?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

    const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message,
          data: {
            favorites: data.data,      
            pagination: data.pagination 
          }
        };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error obteniendo favoritos:', error);
      throw error;
    }
  }


 
  async addToFavorites(movieId: string, notes: string = '', rating: number | null = null): Promise<FavoriteResponse<Favorite>> {
    try {
      const userId = await this.getUserId();
      
      console.log('🔍 Debug addToFavorites:', {
        movieId,
        movieIdLength: movieId.length,
        movieIdType: typeof movieId,
        userId,
        userIdType: typeof userId,
        notes,
        rating
      });
      if (!movieId || typeof movieId !== 'string' || movieId.trim() === '') {
        throw new Error('ID de película requerido');
      }
      
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        throw new Error('ID de usuario requerido');
      }

      const requestBody = {
        userId: String(userId).trim(),
        movieId: String(movieId).trim(),
        ...(notes && typeof notes === 'string' && notes.trim() !== '' && { notes: notes.trim() }),
        ...(rating !== null && rating !== undefined && rating >= 1 && rating <= 5 && { rating })
      };
      if (!/^[0-9a-fA-F]{24}$/.test(movieId)) {
        console.warn('⚠️ MovieId no parece ser un ObjectId válido:', movieId);
      }
      
      if (!/^[0-9a-fA-F]{24}$/.test(userId) && !/^\d+$/.test(userId)) {
        console.warn('⚠️ UserId no parece ser un ObjectId o número válido:', userId);
      }

      console.log('📤 Enviando datos a favoritos:', requestBody);
      console.log('📤 Headers enviados:', this.getAuthHeaders());

      const response = await fetch(`${this.baseUrl}/favorites`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.status === 400) {
        const errorData = await response.json();
        console.error('🚨 Error 400 - Datos enviados:', requestBody);
        console.error('🚨 Error 400 - Respuesta del backend:', errorData);
        throw new Error(`Error de validación: ${errorData.message || 'Datos inválidos'}`);
      }

      if (response.status === 403) {
        const errorData = await response.json();
        console.error('🚨 Error 403 - Datos enviados:', requestBody);
        console.error('🚨 Error 403 - Respuesta del backend:', errorData);
        console.error('🚨 Error 403 - Headers de respuesta:', Object.fromEntries(response.headers.entries()));
        throw new Error(`Error de permisos: ${errorData.message || 'No tienes permisos para realizar esta acción'}`);
      }

      if (response.status === 401) {
        throw new Error('No autorizado. Inicia sesión nuevamente.');
      }

      if (response.status === 403) {
        throw new Error('Error del servidor: No se pudo agregar a favoritos (403)');
      }

      if (response.status === 409) {
        throw new Error('Esta película ya está en tus favoritos');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Película agregada a favoritos:', data.data);
        this.invalidateCache();
        return data;
      } else {
        throw new Error(data.message || 'Error al agregar a favoritos');
      }
    } catch (error) {
      console.error('❌ Error agregando a favoritos:', error);
      throw error;
    }
  }

 
  async removeFromFavorites(favoriteId: string): Promise<FavoriteResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Favorito eliminado:', data.data);
        this.invalidateCache();
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      throw error;
    }
  }

 
  async getFavoriteById(favoriteId: string): Promise<FavoriteResponse<Favorite>> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites/me/${favoriteId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error obteniendo favorito:', error);
      throw error;
    }
  }

  
  async updateFavorite(favoriteId: string, updates: {
    notes?: string;
    rating?: number;
  }): Promise<FavoriteResponse<Favorite>> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites/${favoriteId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          notes: updates.notes,
          rating: updates.rating
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Favorito actualizado:', data.data);
        this.invalidateCache();
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error actualizando favorito:', error);
      throw error;
    }
  }

 
  async getUserFavorites(userId: string, page: number = 1, limit: number = 10): Promise<FavoriteResponse<{ favorites: Favorite[]; pagination: any }>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/favorites/${userId}?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message,
          data: {
            favorites: data.data,       
            pagination: data.pagination 
          }
        };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error obteniendo favoritos de usuario:', error);
      throw error;
    }
  }

 
  async isMovieInFavorites(movieId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No hay token de autenticación, retornando false');
        return false;
      }

      const now = Date.now();
      if (this.cacheTimestamp > 0 && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        const cachedResult = this.favoritesCache[movieId];
        if (cachedResult !== undefined) {
          console.log(`📋 Cache hit para película ${movieId}: ${cachedResult.isFavorite}`);
          return cachedResult.isFavorite;
        }
      }

      console.log(`🌐 Petición al backend para verificar ${movieId}`);
      const myFavorites = await this.getMyFavorites(1, 100);
      const isFavorite = myFavorites.data?.favorites.some(fav => fav.movieId._id === movieId) || false;
      this.favoritesCache[movieId] = { isFavorite, favoriteId: isFavorite ? 'cached' : undefined };
      this.cacheTimestamp = now;
      
      return isFavorite;
    } catch (error) {
      console.error('Error verificando favoritos:', error);
      return false;
    }
  }
}

export const favoriteService = new FavoriteService();


export default favoriteService;
