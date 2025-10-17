import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import { apiService } from '../services/apiService';
import type { BackendUser } from '../services/authService';

/**
 * AuthContextType
 *
 * Strongly-typed shape for authentication context values.
 * - Use camelCase for function names and properties
 * - Follows the convention of descriptive and concise names
 */
interface AuthContextType {
  user: BackendUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (userData: {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    edad: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (profileData: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
  }) => Promise<{ success: boolean; message?: string; user?: BackendUser }>;
  refreshProfile: () => Promise<{ success: boolean; message?: string; user?: BackendUser }>;
}

/**
 * AuthContext
 *
 * React context that provides authentication state and actions
 * across the entire application. Must be consumed via `useAuth`.
 */
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

  // Verificar token existente al cargar la app
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Solo confiar en la clave oficial 'token'. Ignorar 'unyfilm-token' para evitar sesiones viejas.
        const storedToken = localStorage.getItem('token');
        const storedUserRaw = localStorage.getItem('auth:user');

        // Migración/limpieza: si existe solo el token legacy sin el oficial, limpiar para evitar auto-login indeseado
        const legacyToken = localStorage.getItem('unyfilm-token');
        if (!storedToken && legacyToken) {
          console.warn('[Auth] Legacy token found without official token. Clearing stale auth data.');
          localStorage.removeItem('unyfilm-token');
          localStorage.removeItem('auth:user');
          localStorage.removeItem('unyfilm-user');
        }

        if (storedToken && storedUserRaw) {
          // Verificar formato básico de JWT para evitar aceptar strings inválidos
          const isJwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(storedToken);
          if (!isJwtLike) {
            console.warn('[Auth] Invalid token format. Clearing auth storage.');
            localStorage.removeItem('token');
            localStorage.removeItem('unyfilm-token');
            localStorage.removeItem('auth:user');
            localStorage.removeItem('unyfilm-user');
            localStorage.removeItem('unyfilm-logged-in');
            setIsLoading(false);
            return;
          }
          // Validar forma mínima del usuario antes de establecer sesión
          let parsedUser: BackendUser | null = null;
          try {
            parsedUser = JSON.parse(storedUserRaw);
          } catch {
            parsedUser = null;
          }

          const isValidUser = !!(
            parsedUser && typeof parsedUser === 'object' &&
            typeof (parsedUser as any)._id === 'string' && (parsedUser as any)._id.length > 0 &&
            typeof (parsedUser as any).email === 'string' && (parsedUser as any).email.includes('@')
          );

          // Evitar sesiones con el correo de pruebas reportado
          const isBlockedEmail = (parsedUser as any)?.email?.toLowerCase?.() === 'usuariousuario@unyfilm.com';

          if (isValidUser && !isBlockedEmail) {
            setToken(storedToken);
            setUser(parsedUser as BackendUser);
            // Refrescar perfil desde el backend para obtener datos actualizados
            setTimeout(() => {
              refreshProfile().catch(console.error);
            }, 100);
          } else {
            console.warn('[Auth] Invalid stored user detected. Clearing auth storage.');
            localStorage.removeItem('token');
            localStorage.removeItem('unyfilm-token');
            localStorage.removeItem('auth:user');
            localStorage.removeItem('unyfilm-user');
            localStorage.removeItem('unyfilm-logged-in');
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('unyfilm-token');
        localStorage.removeItem('auth:user');
        localStorage.removeItem('unyfilm-logged-in');
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
   * Performs a user registration through the auth service and establishes
   * the session on success.
   *
   * @param {{nombres: string; apellidos: string; email: string; password: string; edad: string}} userData - Registration input
   * @returns {Promise<{success: boolean; message?: string}>} Operation result
   */
  const register = async (userData: {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    edad: string;
  }) => {
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
   *
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result with success status
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
        // En lugar de mapear manualmente, vamos a refrescar el perfil completo desde el backend
        // para asegurarnos de que tenemos los datos más actuales
        const refreshResult = await refreshProfile();
        
        if (refreshResult.success) {
          return { 
            success: true, 
            message: 'Perfil actualizado exitosamente',
            user: refreshResult.user
          };
        } else {
          // Si falla el refresh, usar el mapeo manual como fallback
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
   *
   * @returns {Promise<{success: boolean, message?: string, user?: BackendUser}>}
   */
  const refreshProfile = async () => {
    try {
      if (!token) {
        return { success: false, message: 'No hay token de autenticación' };
      }
      
      const response = await apiService.getProfile();
      
      if (response.success && response.data) {
        // Mapear la respuesta del backend al formato BackendUser
        // Según README, el backend devuelve firstName, lastName, age
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
        
        // Actualizar el estado local del usuario
        setUser(refreshedUser);
        
        // Actualizar el usuario en localStorage
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
      console.error('[Auth] Error refreshing profile:', error);
      return { 
        success: false, 
        message: error?.message || 'Error de red al cargar el perfil'
      };
    }
  };

  /**
   * logout
   *
   * Clears in-memory auth state, removes persisted tokens, and
   * invokes the backend to invalidate the session token.
   *
   * @returns {void}
   */
  const logout = () => {
    // Limpiar estado local
    setUser(null);
    setToken(null);
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('unyfilm-token');
    localStorage.removeItem('auth:user');
    localStorage.removeItem('unyfilm-logged-in');

    // Llamar al backend para invalidar el token (opcional)
    authService.logout().catch(console.error);
  };

  const isAuthenticated = !!token && !!user;

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};