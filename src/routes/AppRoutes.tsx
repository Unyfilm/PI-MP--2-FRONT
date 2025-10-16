import { Routes, Route } from 'react-router-dom';
import MovieApp from '../components/MovieApp';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import Recover from '../components/recover/Recover';

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="*" element={<MovieApp />} />
    </Routes>
  );
}
