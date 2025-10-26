import { Routes, Route, Navigate } from 'react-router-dom';
import MovieApp from '../components/MovieApp';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import Recover from '../components/recover/Recover';
import ResetPassword from '../components/recover/ResetPassword';
import Profile from '../components/profile/Profile';
import ProfileEdit from '../components/profile/ProfileEdit';
import LandingPage from '../components/landing/LandingPage';
import { ProtectedRoute, PublicRoute } from '../components/ProtectedRoute';

/**
 * AppRoutes
 *
 * Main application routes configuration.
 * - Public routes: login, register, recover (only accessible when unauthenticated)
 * - Protected routes: home, catalog, about, sitemap, profile, profile edit
 * - Root path redirects to /home (ProtectedRoute will handle auth)
 *
 * @returns {JSX.Element} Application routes tree wrapped with guards
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
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
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />
      
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
        path="/favorites" 
        element={
          <ProtectedRoute>
            <MovieApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/player/*" 
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
      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}