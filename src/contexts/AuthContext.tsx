/**
 * @file AuthContext.tsx
 * @description Provides a global authentication context that manages user session,
 * token persistence, and interaction with authentication and profile APIs.
 * Supports login, registration, logout, profile updates, password changes,
 * and account deletion. Ensures session integrity and handles token validation.
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import { apiService } from '../services/apiService';
import type { BackendUser } from '../services/authService';

/**
 * Defines the structure of the authentication context.
 */
interface AuthContextType {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (userData: {

    firstName?: string;
    lastName?: string;
    age?: string | number;

    nombres?: string;
    apellidos?: string;
    edad?: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (profileData: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
  }) => Promise<{ success: boolean; message?: string; user?: BackendUser }>;
  refreshProfile: () => Promise<{ success: boolean; message?: string; user?: BackendUser }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * useAuth
 *
 * Hook to consume the AuthContext. It enforces usage within an AuthProvider.
 *
 * @throws {Error} If used outside AuthProvider
 * @returns {AuthContextType} The auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider
 *
 * Provides authentication state (user, token) and actions (login, logout, register)
 * to all descendant components. It initializes the session by reading persisted
 * values from localStorage and performs minimal validation.
 *
 * @param {AuthProviderProps} props - React children wrapper
 * @returns {JSX.Element} Provider for authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserRaw = localStorage.getItem('auth:user');

        const legacyToken = localStorage.getItem('unyfilm-token');
        if (!storedToken && legacyToken) {
          localStorage.removeItem('unyfilm-token');
          localStorage.removeItem('auth:user');
          localStorage.removeItem('unyfilm-user');
        }

        if (storedToken && storedUserRaw) {
          const isJwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(storedToken);
          if (!isJwtLike) {
            localStorage.removeItem('token');
            localStorage.removeItem('unyfilm-token');
            localStorage.removeItem('auth:user');
            localStorage.removeItem('unyfilm-user');
            localStorage.removeItem('unyfilm-logged-in');
            setIsLoading(false);
            return;
          }
          let parsedUser: BackendUser | null = null;
          try {
            parsedUser = JSON.parse(storedUserRaw);
          } catch {
            parsedUser = null;
          }

          const isValidUser = !!(
            parsedUser && typeof parsedUser === 'object' &&
            (parsedUser as any).email && typeof (parsedUser as any).email === 'string'
          );

          const isBlockedEmail = (parsedUser as any)?.email?.toLowerCase?.() === 'usuariousuario@unyfilm.com';

          if (isValidUser && !isBlockedEmail) {
            setToken(storedToken);
            setUser(parsedUser as BackendUser);
          } else {
            if (isBlockedEmail) {
              localStorage.removeItem('token');
              localStorage.removeItem('unyfilm-token');
              localStorage.removeItem('auth:user');
              localStorage.removeItem('unyfilm-user');
              localStorage.removeItem('unyfilm-logged-in');
            } else {
              setToken(storedToken);
              setUser(parsedUser as BackendUser);
            }
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * login
   *
   * Performs a login request through the auth service and updates
   * the in-memory auth state.
   *
   * @param {string} email - User email in lowercase format
   * @param {string} password - User password
   * @returns {Promise<{success: boolean; message?: string}>} Operation result
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error al iniciar sesión' };
      }
    } catch (error: any) {
      return { success: false, message: error?.message || 'Error de red' };
    }
  };

  /**
   * register
   *
   * Performs a user registration through the auth service, accepting both
   * English and Spanish field names, and establishes the session on success.
   */
  const register: AuthContextType['register'] = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error al registrarse' };
      }
    } catch (error: any) {
      return { success: false, message: error?.message || 'Error de red' };
    }
  };

  /**
   * updateProfile
   *
   * Updates user profile information using the backend API
   * and updates the local user state if successful.
   */
  const updateProfile = async (profileData: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
  }) => {
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.data) {
        const refreshResult = await refreshProfile();
        
        if (refreshResult.success) {
          return { 
            success: true, 
            message: 'Perfil actualizado exitosamente',
            user: refreshResult.user
          };
        } else {
          const updatedUser: BackendUser = {
            _id: user?._id || '',
            username: user?.username || '',
            email: profileData.email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            age: profileData.age,
            profilePicture: user?.profilePicture || '',
            createdAt: user?.createdAt || '',
            updatedAt: new Date().toISOString()
          };
          
          setUser(updatedUser);
          localStorage.setItem('auth:user', JSON.stringify(updatedUser));
          
          return { 
            success: true, 
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
          };
        }
      } else {
        return { 
          success: false, 
          message: response.message || 'Error al actualizar el perfil' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.message || 'Error de red al actualizar el perfil' 
      };
    }
  };

  /**
   * refreshProfile
   *
   * Loads the user profile from the backend to ensure we have the latest data
   */
  const refreshProfile = async () => {
    try {
      if (!token) {
        return { success: false, message: 'No hay token de autenticación' };
      }
      
      const response = await apiService.getProfile();
      
      if (response.success && response.data) {
        const backendData = response.data;
        const refreshedUser: BackendUser = {
          _id: backendData.id?.toString() || user?._id || '',
          username: backendData.username || user?.username || '',
          email: backendData.email || user?.email || '',
          firstName: backendData.firstName || backendData.nombres || user?.firstName || '',
          lastName: backendData.lastName || backendData.apellidos || user?.lastName || '',
          age: backendData.age || (backendData.edad ? parseInt(backendData.edad) : user?.age),
          profilePicture: backendData.profilePicture || user?.profilePicture || '',
          createdAt: backendData.createdAt || user?.createdAt || '',
          updatedAt: backendData.updatedAt || new Date().toISOString()
        };
        
        setUser(refreshedUser);
        
        localStorage.setItem('auth:user', JSON.stringify(refreshedUser));
        
        return { 
          success: true, 
          message: 'Perfil actualizado desde el servidor',
          user: refreshedUser
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Error al cargar el perfil'
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.message || 'Error de red al cargar el perfil'
      };
    }
  };

  /**
   * logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('unyfilm-token');
    localStorage.removeItem('auth:user');
    localStorage.removeItem('unyfilm-logged-in');

    authService.logout().catch(() => {});
  };

  /**
   * deleteAccount
   */
  const deleteAccount = async (password: string) => {
    try {
      const response = await apiService.deleteAccount(password);
      
      if (response.success) {
        
        setUser(null);
        setToken(null);
        
        localStorage.removeItem('token');
        localStorage.removeItem('unyfilm-token');
        localStorage.removeItem('auth:user');
        localStorage.removeItem('unyfilm-logged-in');
        
        return { 
          success: true, 
          message: 'Cuenta eliminada exitosamente' 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Error al eliminar la cuenta'
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.message || 'Error de red al eliminar la cuenta' 
      };
    }
  };

  /**
   * changePassword
   */
  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      if (!token) {
        return { 
          success: false, 
          message: 'No hay sesión activa. Por favor, inicia sesión nuevamente.' 
        };
      }

      const response = await apiService.changePassword(currentPassword, newPassword, confirmPassword);
      
      if (response.success) {
        return { 
          success: true, 
          message: 'Contraseña actualizada exitosamente' 
        };
      } else {
        if (response.message?.includes('Invalid token') || response.message?.includes('Unauthorized')) {
          logout();
          return { 
            success: false, 
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' 
          };
        }
        
        return { 
          success: false, 
          message: response.message || 'Error al cambiar la contraseña' 
        };
      }
    } catch (error: any) {
      
      if (error?.message?.includes('ERR_CONNECTION_REFUSED') || 
          error?.message?.includes('Failed to fetch') ||
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          message: 'El servidor backend no está disponible. Por favor, asegúrate de que el backend esté ejecutándose en el puerto 5000.' 
        };
      }
      
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        logout();
        return { 
          success: false, 
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' 
        };
      }
      
      return { 
        success: false, 
        message: error?.message || 'Error de red al cambiar la contraseña' 
      };
    }
  };

  const isTokenValid = () => {
    if (!token) return false;
    

    const isJwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
    if (!isJwtLike) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {

      return true;
    }
  };

  const clearExpiredSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('auth:user');
    localStorage.removeItem('unyfilm-token');
    localStorage.removeItem('unyfilm-user');
  };

  useEffect(() => {
    if (token && !isTokenValid()) {
      clearExpiredSession();
    }
  }, [token]);

  const isAuthenticated = !!token && !!user && isTokenValid();

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    refreshProfile,
    deleteAccount,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};