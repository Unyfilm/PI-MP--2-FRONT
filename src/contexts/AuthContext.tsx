import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { BackendUser } from '../services/authService';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};