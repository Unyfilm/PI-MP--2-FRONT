import { useState, useEffect, useRef } from 'react';
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
// Importación eliminada - ya no usamos datos simulados

export default function MovieApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  // Eliminamos la funcionalidad de favoritos
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const playerProcessedRef = useRef<boolean>(false);

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
    
    // Solo ejecutar para rutas normales (no reproductor)
    if (!path.startsWith('/player/')) {
      // Rutas normales
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
      // Scroll to top when route changes (only for non-player routes)
      if (!path.startsWith('/player/')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location, navigate]);

  // Guardar película actual en localStorage cuando cambie
  useEffect(() => {
    if (currentMovie) {
      localStorage.setItem('unyfilm:currentMovie', JSON.stringify(currentMovie));
    } else {
      localStorage.removeItem('unyfilm:currentMovie');
    }
  }, [currentMovie]);

  // Manejar navegación del reproductor basada en la ruta
  useEffect(() => {
    const isPlayerRoute = location.pathname.startsWith('/player/');
    
    // Si estamos en el reproductor y no se ha procesado aún
    if (isPlayerRoute && !playerProcessedRef.current) {
      playerProcessedRef.current = true;
      
      // Si hay estado en la ubicación, usar esos datos (navegación directa)
      if (location.state?.movie) {
        setCurrentMovie(location.state.movie);
        setShowPlayer(true);
        setCurrentView(location.state.fromView || 'home');
      } else {
        // Si no hay estado (refresh), intentar cargar desde localStorage
        const savedMovie = localStorage.getItem('unyfilm:currentMovie');
        if (savedMovie) {
          try {
            const movieData = JSON.parse(savedMovie);
            setCurrentMovie(movieData);
            setShowPlayer(true);
            setCurrentView('home'); // Default a home si no sabemos de dónde vino
          } catch (error) {
            // Si hay error al parsear, redirigir a home
            navigate('/home', { replace: true });
          }
        } else {
          // Si no hay película guardada, redirigir a home
          navigate('/home', { replace: true });
        }
      }
    }

    // Si NO estamos en el reproductor pero el player sigue abierto, cerrarlo
    if (!isPlayerRoute && showPlayer) {
      // Usar setTimeout para suavizar la transición y evitar parpadeos
      setTimeout(() => {
        setShowPlayer(false);
        setCurrentMovie(null);
        playerProcessedRef.current = false;
      }, 50); // Pequeño delay para suavizar la transición
    }
  }, [location.pathname, navigate]);
  
  // Datos unificados: moviesData

  // Función de favoritos eliminada

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (_query: string): void => {
    // Search functionality can be implemented here
  };

  const handleMovieClick = (movie: MovieClickData): void => {
    // Crear datos de película directamente desde los datos recibidos
    const fullMovieData: MovieData = {
      title: movie.title,
      videoUrl: movie.videoUrl || '',
      rating: movie.rating || 0,
      year: movie.year || 0,
      genre: movie.genre || '',
      genres: (movie as any).genres || [movie.genre || ''],
      description: movie.description || '',
      duration: (movie as any).duration || 0
    };
    setCurrentMovie(fullMovieData);
    setShowPlayer(true);
    
    // Agregar al historial del navegador
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
    // Cerrar el reproductor inmediatamente para evitar parpadeos
    setShowPlayer(false);
    setCurrentMovie(null);
    
    // Navegar de vuelta a la página anterior usando el historial natural
    navigate(-1);
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
            onMovieClick={handleMovieClick}
          />
        )}
        {currentView === 'catalog' && (
          <UnyFilmCatalog 
            favorites={[]} 
            toggleFavorite={() => {}}
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
