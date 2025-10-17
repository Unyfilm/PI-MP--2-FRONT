import { Routes, Route, Navigate } from 'react-router-dom';
import MovieApp from '../components/MovieApp';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import Recover from '../components/recover/Recover';
import Profile from '../components/profile/Profile';
import ProfileEdit from '../components/profile/ProfileEdit';
import { ProtectedRoute, PublicRoute } from '../components/ProtectedRoute';

/**
 * Main application routes configuration
 * - Rutas públicas: login, register, recover (solo accesibles sin autenticación)
 * - Rutas protegidas: home, catalog, about, sitemap (requieren autenticación)
 * - Ruta raíz (/) redirige a login por defecto
 * @component
 * @returns {JSX.Element} Application routes
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta raíz: redirige a home si está autenticado, sino a login */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Rutas públicas (solo accesibles sin autenticación) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/recover" 
        element={
          <PublicRoute>
            <Recover />
          </PublicRoute>
        } 
      />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <MovieApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/catalog" 
        element={
          <ProtectedRoute>
            <MovieApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <MovieApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sitemap" 
        element={
          <ProtectedRoute>
            <MovieApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/edit" 
        element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404: redirige a home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
