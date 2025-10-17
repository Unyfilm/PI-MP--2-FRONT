import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function MovieApp() {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [favorites, setFavorites] = useState<number[]>([0, 4, 8]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  // Detectar la ruta actual y actualizar currentView
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
        setCurrentView('home');
    }
    // Always scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  const movieTitles: string[] = [
    'Piratas Espaciales', 'Galaxia Perdida', 'Aventura Cósmica', 'Misterio Estelar',
    'Amor en las Estrellas', 'Batalla Galáctica', 'Viaje Temporal', 'Nebulosa Oscura',
    'Planeta Desconocido', 'Fuerza Espacial', 'Cristal Mágico', 'Dimensión Paralela'
  ];

  const movieData: MovieData[] = [
    { title: 'Piratas Espaciales', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { title: 'Galaxia Perdida', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { title: 'Aventura Cósmica', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { title: 'Misterio Estelar', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { title: 'Amor en las Estrellas', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { title: 'Batalla Galáctica', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    { title: 'Viaje Temporal', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
    { title: 'Nebulosa Oscura', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    { title: 'Planeta Desconocido', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
    { title: 'Fuerza Espacial', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { title: 'Cristal Mágico', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4' },
    { title: 'Dimensión Paralela', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }
  ];

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
    // Buscar los datos completos de la película
    const fullMovieData: MovieData = movieData.find(m => m.title === movie.title) || {
      title: movie.title,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      rating: movie.rating || 4.5,
      year: movie.year || 2023,
      genre: movie.genre || 'Drama',
      description: movie.description || 'Una increíble aventura cinematográfica.'
    };
    setCurrentMovie(fullMovieData);
    setShowPlayer(true);
  };

  const handleClosePlayer = (): void => {
    setShowPlayer(false);
    setCurrentMovie(null);
  };

  // View changes are handled via route path in useEffect

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
            movieTitles={movieTitles.slice(0, 7)}
            movieData={movieData.slice(0, 7)}
            onMovieClick={handleMovieClick}
          />
        )}
        {currentView === 'catalog' && (
          <UnyFilmCatalog 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            movieTitles={movieTitles}
            movieData={movieData}
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
