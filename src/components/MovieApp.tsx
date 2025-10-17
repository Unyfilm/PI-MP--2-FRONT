import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UnyFilmSidebar from './sidebar/UnyFilmSidebar';
import UnyFilmHeader from './header/UnyFilmHeader';
import UnyFilmHome from './home/UnyFilmHome';
import UnyFilmCatalog from './catalog/UnyFilmCatalog';
import UnyFilmAbout from './about/UnyFilmAbout';
import UnyFilmSitemap from './sitemap/UnyFilmSitemap';
import UnyFilmPlayer from './player/UnyFilmPlayer';
import UsabilityFeatures from './usability/UsabilityFeatures';
import AccessibilityFeatures from './accessibility/AccessibilityFeatures';
import Footer from './footer/Footer';
// import UserAuth from './auth/UserAuth';
import './MovieApp.css';
// import Login from './login/Login';
import type { MovieData, MovieClickData, ViewType } from '../types';
import { moviesData } from '../data/moviesData';

export default function MovieApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [favorites, setFavorites] = useState<number[]>([0, 4, 8]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  // Restaurar última ruta al cargar (si se entra por ruta desconocida)
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '' ) {
      const lastPath = localStorage.getItem('unyfilm:lastPath');
      if (lastPath && lastPath !== location.pathname) {
        navigate(lastPath, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar la ruta actual, actualizar vista y guardar última ruta
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/home':
        setCurrentView('home');
        break;
      case '/catalog':
        setCurrentView('catalog');
        break;
      case '/about':
        setCurrentView('about');
        break;
      case '/sitemap':
        setCurrentView('sitemap');
        break;
      default:
        // Mantener última vista si la ruta no está mapeada
        setCurrentView(prev => prev);
    }
    // Guardar última ruta navegada
    localStorage.setItem('unyfilm:lastPath', path);
    // Always scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  // Datos unificados: moviesData

  const toggleFavorite = (index: number): void => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query: string): void => {
    console.log('Search submitted:', query);
  };

  const handleMovieClick = (movie: MovieClickData): void => {
    // Buscar los datos completos en moviesData
    const full = moviesData.find(m => m.title === movie.title);
    const fullMovieData: MovieData = full ? {
      title: full.title,
      videoUrl: full.videoUrl,
      rating: full.rating ?? movie.rating ?? 4.5,
      year: full.year ?? movie.year ?? 2023,
      genre: full.genre ?? movie.genre ?? 'Drama',
      description: full.description ?? movie.description ?? ''
    } : {
      title: movie.title,
      videoUrl: movie.videoUrl,
      rating: movie.rating || 4.5,
      year: movie.year || 2023,
      genre: movie.genre || 'Drama',
      description: movie.description || ''
    };
    setCurrentMovie(fullMovieData);
    setShowPlayer(true);
  };

  const handleClosePlayer = (): void => {
    setShowPlayer(false);
    setCurrentMovie(null);
  };

  const handleViewChange = (view: ViewType): void => {
    setCurrentView(view);
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (sidebarOpen) {
        const sidebar = document.querySelector('.unyfilm-sidebar');
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if (sidebar && !sidebar.contains(target) && toggleBtn && !toggleBtn.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className={`movie-app-container ${sidebarOpen ? 'movie-app-container--sidebar-open' : ''}`}>
      {/* Fixed Sidebar */}
      <UnyFilmSidebar currentView={currentView} />

      {/* Fixed Header */}
      <UnyFilmHeader 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSearchSubmit={handleSearchSubmit}
      />
      {/* Toggle Sidebar Button (mobile) */}
      {!sidebarOpen && (
        <button className="sidebar-toggle" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}></button>
      )}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true"></div>}

      {/* User Authentication - Disabled */}
      {/* <UserAuth /> */}

      {/* Main Content */}
      <div className="main-content" id="main-content" tabIndex={-1}>
        {currentView === 'home' && (
          <UnyFilmHome 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            onMovieClick={handleMovieClick}
          />
        )}
        {currentView === 'catalog' && (
          <UnyFilmCatalog 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            onMovieClick={handleMovieClick}
          />
        )}
        {currentView === 'about' && (
          <UnyFilmAbout />
        )}
        {currentView === 'sitemap' && (
          <UnyFilmSitemap />
        )}
      </div>

      {/* Video Player Modal */}
      {showPlayer && currentMovie && (
        <UnyFilmPlayer 
          movie={currentMovie}
          onClose={handleClosePlayer}
        />
      )}

      {/* Usability Features */}
      <UsabilityFeatures />

      {/* Accessibility Features */}
      <AccessibilityFeatures />

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
