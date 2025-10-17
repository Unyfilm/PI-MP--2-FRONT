import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login con la ruta actual como "from"
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

/**
 * Componente que redirige usuarios autenticados lejos de páginas públicas
 * Por ejemplo, si ya está logueado, no debería ver la página de login
 */
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/home' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir a la página principal
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no está autenticado, mostrar la página pública (login, register, etc.)
  return <>{children}</>;
};