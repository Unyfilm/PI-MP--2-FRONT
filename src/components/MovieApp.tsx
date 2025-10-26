import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UnyFilmSidebar from './sidebar/UnyFilmSidebar';
import UnyFilmHeader from './header/UnyFilmHeader';
import UnyFilmHome from './home/UnyFilmHome';
import UnyFilmCatalog from './catalog/UnyFilmCatalog';
import UnyFilmAbout from './about/UnyFilmAbout';
import UnyFilmSitemap from './sitemap/UnyFilmSitemap';
import FavoritesPage from './favorites/FavoritesPage';
import UnyFilmPlayer from './player/UnyFilmPlayer';
import UsabilityFeatures from './usability/UsabilityFeatures';
import AccessibilityFeatures from './accessibility/AccessibilityFeatures';
import Footer from './footer/Footer';
import './MovieApp.css';
import type { MovieData, MovieClickData, ViewType } from '../types';

/**
 * Main application component
 * Handles routing, state management, and renders the appropriate views
 * @component MovieApp
 * @returns {JSX.Element} The main application component
 */
export default function MovieApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const playerProcessedRef = useRef<boolean>(false);
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '' ) {
      const lastPath = localStorage.getItem('unyfilm:lastPath');
      if (lastPath && lastPath !== location.pathname) {
        navigate(lastPath, { replace: true });
      }
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    
    if (!path.startsWith('/player/')) {
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
        case '/favorites':
          setCurrentView('favorites');
          break;
        default:
          setCurrentView(prev => prev);
      }
      
      localStorage.setItem('unyfilm:lastPath', path);
      if (!path.startsWith('/player/')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location, navigate]);
  useEffect(() => {
    if (currentMovie) {
      localStorage.setItem('unyfilm:currentMovie', JSON.stringify(currentMovie));
    } else {
      localStorage.removeItem('unyfilm:currentMovie');
    }
  }, [currentMovie]);

  useEffect(() => {
    const isPlayerRoute = location.pathname.startsWith('/player/');
    
    if (isPlayerRoute && !playerProcessedRef.current) {
      playerProcessedRef.current = true;
      
      if (location.state?.movie) {
        setCurrentMovie(location.state.movie);
        setShowPlayer(true);
        setCurrentView(location.state.fromView || 'home');
      } else {
        const savedMovie = localStorage.getItem('unyfilm:currentMovie');
        if (savedMovie) {
          try {
            const movieData = JSON.parse(savedMovie);
            setCurrentMovie(movieData);
            setShowPlayer(true);
            setCurrentView('home');
          } catch (error) {
            navigate('/home', { replace: true });
          }
        } else {
          navigate('/home', { replace: true });
        }
      }
    }

    if (!isPlayerRoute && showPlayer) {
      setTimeout(() => {
        setShowPlayer(false);
        setCurrentMovie(null);
        playerProcessedRef.current = false;
      }, 50);
    }
  }, [location.pathname, navigate]);
  
  const handleSearch = useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const handleSearchSubmit = useCallback((query: string): void => {
    if (query.trim()) {
      setCurrentView('catalog');
      navigate('/catalog');
    }
  }, [navigate]);

  const handleMovieClick = (movie: MovieClickData): void => {
    const fullMovieData: MovieData = {
      _id: movie._id,
      title: movie.title,
      videoUrl: movie.videoUrl || '',
      rating: movie.rating || 0,
      year: movie.year || 0,
      genre: movie.genre || '',
      genres: (movie as any).genres || [movie.genre || ''],
      description: movie.description || '',
      duration: (movie as any).duration || 0,
      cloudinaryVideoId: (movie as any).cloudinaryPublicId || (movie as any).cloudinaryVideoId,
      subtitles: (movie as any).subtitles
    };
    setCurrentMovie(fullMovieData);
    setShowPlayer(true);
    
    const playerState = {
      movie: fullMovieData,
      fromView: currentView
    };
    navigate(`/player/${encodeURIComponent(movie.title)}`, { 
      state: playerState,
      replace: false 
    });
  };

  const handleClosePlayer = (): void => {
    setShowPlayer(false);
    setCurrentMovie(null);
    navigate(-1);
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (sidebarOpen) {
        const backdrop = document.querySelector('.sidebar-backdrop');
        
        if (backdrop && target === backdrop) {
          setSidebarOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [sidebarOpen]);

  return (
    <div className={`movie-app-container ${sidebarOpen ? 'movie-app-container--sidebar-open' : ''}`}>
      <UnyFilmSidebar currentView={currentView} />

      <UnyFilmHeader 
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSearchSubmit={handleSearchSubmit}
      />
      {!sidebarOpen && (
        <button className="sidebar-toggle" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}></button>
      )}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true"></div>}


      <div className="main-content" id="main-content" tabIndex={-1}>
        {currentView === 'home' && (
          <UnyFilmHome 
            onMovieClick={handleMovieClick}
          />
        )}
        {currentView === 'catalog' && (
          <UnyFilmCatalog 
            favorites={[]} 
            toggleFavorite={() => {}}
            onMovieClick={handleMovieClick}
            searchQuery={searchQuery || ''}
          />
        )}
        {currentView === 'about' && (
          <UnyFilmAbout />
        )}
        {currentView === 'sitemap' && (
          <UnyFilmSitemap />
        )}
        {currentView === 'favorites' && (
          <FavoritesPage 
            onMovieClick={handleMovieClick}
          />
        )}
      </div>

      {showPlayer && currentMovie && (
        <UnyFilmPlayer 
          movie={currentMovie}
          onClose={handleClosePlayer}
        />
      )}

      <UsabilityFeatures />

      <AccessibilityFeatures />

      <Footer />

    </div>
  );
}
