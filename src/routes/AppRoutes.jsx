import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieApp from '../components/MovieApp';

/**
 * Main application routes configuration
 * @component
 * @returns {JSX.Element} Application routes
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MovieApp />} />
      <Route path="/home" element={<MovieApp />} />
      <Route path="/catalog" element={<MovieApp />} />
      <Route path="/about" element={<MovieApp />} />
      <Route path="/sitemap" element={<MovieApp />} />
      <Route path="*" element={<MovieApp />} />
    </Routes>
  );
}
