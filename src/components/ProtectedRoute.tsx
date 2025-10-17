import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 *
 * Route guard component that restricts access to authenticated users.
 * When the user is not authenticated, it redirects to /login preserving
 * the current location in navigation state.
 *
 * @param {ProtectedRouteProps} props - React children to render when allowed
 * @returns {JSX.Element} Either children, a loading placeholder, or a redirect
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
 * PublicRoute
 *
 * Redirects authenticated users away from public pages (e.g., login/register)
 * to the provided `redirectTo` path.
 *
 * @param {{children: React.ReactNode; redirectTo?: string}} props - Children and optional redirect path
 * @returns {JSX.Element} Either children, a loading placeholder, or a redirect
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