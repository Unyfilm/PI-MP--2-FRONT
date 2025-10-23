import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Play, Heart, Star, Flame, TrendingUp, Baby, Zap, Smile, Drama, Rocket, Skull } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { movieConfig, homeSections } from '../../data/moviesData';
import { movieService, type Movie } from '../../services/movieService';
import { useRealRating } from '../../hooks/useRealRating';
import './UnyFilmHome.css';

type MovieClickData = {
  _id?: string;
  title: string;
  index: number;
  videoUrl: string;
  rating: number;
  year: number;
  genre: string;
  description: string;
  synopsis?: string;
  genres?: string[];
  cloudinaryPublicId?: string;
  cloudinaryUrl?: string;
  duration?: number;
};

/**
 * HomeProps
 *
 * Props for the UnyFilm home component containing hero and movie sections.
 */
interface HomeProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
}

/**
 * UnyFilmHome
 *
 * Home page component featuring a hero poster and several curated sections
 * (trending, popular, kids, action, comedy, drama). Handles image fallbacks
 * and delegates movie click events via props.
 *
 * @param {HomeProps} props - Home props
 * @returns {JSX.Element} Home UI
 */
export default function UnyFilmHome({ onMovieClick }: Omit<HomeProps, 'favorites' | 'toggleFavorite'>) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionMovies, setSectionMovies] = useState<Record<string, Movie[]>>({});
  
  // Estados para el carrusel automático
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const carouselIntervalRef = useRef<number | null>(null);

  // Hook para calificaciones reales
  const { hasRealRatings, averageRating, totalRatings } = useRealRating(featuredMovie?._id);

  // Función eliminada - ya no necesaria

  // Función para obtener la imagen del hero con fallbacks
  const getHeroImage = (movie: Movie): string => {
    // 1. Usar port (imagen grande) de la API
    if (movie.port) return movie.port;
    
    // 2. Usar poster como fallback
    if (movie.poster) return movie.poster;
    
    // 3. Usar trailer como fallback
    if (movie.trailer) return movie.trailer;
    
    // 4. Usar videoUrl como último recurso
    if (movie.videoUrl) return movie.videoUrl;
    
    // 5. Fallback por defecto
    return '/images/default-hero.jpg';
  };

  // Función para cambiar a la siguiente película en orden
  const changeToNextMovie = useCallback(async () => {
    if (!featuredMovies.length || featuredMovies.length <= 1 || isTransitioning) {
      return;
    }
    
    setIsTransitioning(true);
    
    try {
      const nextIndex = (featuredIndex + 1) % featuredMovies.length;
      
      // Cambiar la película inmediatamente pero mantener la transición
      setFeaturedIndex(nextIndex);
      setFeaturedMovie(featuredMovies[nextIndex]);
      
      // Esperar a que termine la animación completa
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Tiempo total de la animación (0.8s)
    } catch (error) {
      setIsTransitioning(false);
    }
  }, [featuredIndex, featuredMovies, isTransitioning]);

  // Función para iniciar el carrusel automático
  const startCarousel = useCallback(() => {
    // Limpiar intervalo existente si hay uno
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    
    // Crear nuevo intervalo
    const interval = setInterval(() => {
      changeToNextMovie();
    }, 5000); // Cambia cada 5 segundos
    
    carouselIntervalRef.current = interval;
  }, [changeToNextMovie]);

  // Cargar datos de la API
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let featuredMovieData: Movie | null = null;
        let availableMovies: Movie[] = [];
        const sectionData: Record<string, Movie[]> = {};

        // Primero intentar obtener todas las películas disponibles
        try {
          availableMovies = await movieService.getAvailableMovies();
        } catch (error) {
        }

        // Cargar películas para el carrusel (hasta 5 películas)
        let carouselMovies: Movie[] = [];
        
        // Usar las películas disponibles como carrusel
        if (availableMovies.length > 0) {
          carouselMovies = availableMovies.slice(0, 5);
        } else {
          // Intentar cargar películas específicas para el carrusel como fallback
          const carouselIds = [
            movieConfig.featuredMovieId,
            "68f84e9aba5b03d95f2d6ce2", // Mortal Kombat 2
            "68f84e9aba5b03d95f2d6ce3", // Tron: Ares
            "68f84e9aba5b03d95f2d6ce4", // Avatar: El Origen del Agua
            "68f84e9aba5b03d95f2d6ce5", // Primate (2026)
          ];
          
          try {
            carouselMovies = await movieService.getMovies(carouselIds);
          } catch (error) {
          }
        }
        
        // Configurar películas del carrusel
        if (carouselMovies.length > 0) {
          setFeaturedMovies(carouselMovies);
          setFeaturedMovie(carouselMovies[0]);
          setFeaturedIndex(0);
        } else {
        }

        // Cargar películas para cada sección
        for (const section of homeSections) {
          try {
            let movies: Movie[] = [];
            
            // Usar endpoint específico para trending
            if (section.id === 'trending') {
              try {
                movies = await movieService.getTrendingMovies();
              } catch (trendingError) {
                movies = await movieService.getMovies(section.movieIds);
              }
            } else {
              movies = await movieService.getMovies(section.movieIds);
            }
            
            // Si no se encontraron películas, usar fallback
            if (movies.length === 0) {
              
              // Fallback 1: usar películas disponibles
              if (availableMovies.length > 0) {
                // Tomar hasta 3 películas disponibles para la sección
                const fallbackMovies = availableMovies.slice(0, 3);
                sectionData[section.id] = fallbackMovies;
              }
              // Fallback 2: usar la película destacada si está disponible
              else if (featuredMovieData) {
                sectionData[section.id] = [featuredMovieData];
              }
              // Sin fallback final - sección vacía si no hay datos reales
              else {
                sectionData[section.id] = [];
              }
            } else {
              sectionData[section.id] = movies;
            }
          } catch (error) {
            
            // Fallback 1: usar películas disponibles
            if (availableMovies.length > 0) {
              const fallbackMovies = availableMovies.slice(0, 3);
              sectionData[section.id] = fallbackMovies;
            }
            // Fallback 2: usar la película destacada si está disponible
            else if (featuredMovieData) {
              sectionData[section.id] = [featuredMovieData];
            }
            // Sin fallback final - sección vacía si no hay datos reales
            else {
              sectionData[section.id] = [];
            }
          }
        }

        setSectionMovies(sectionData);
        setIsLoading(false);
        } catch (error) {
          setError('Error al cargar las películas. Por favor, verifica que el servidor esté funcionando.');
          setIsLoading(false);
        }
    };

    // Solo cargar si no hay datos ya cargados
    if (featuredMovies.length === 0 && Object.keys(sectionMovies).length === 0) {
      loadMovies();
    }
  }, []);

  // useEffect separado para manejar el carrusel automático
  useEffect(() => {
    if (featuredMovie && !isLoading && featuredMovies.length > 1) {
      // Solo iniciar el carrusel si no hay uno activo
      if (!carouselIntervalRef.current) {
        // Agregar un pequeño delay para evitar parpadeos
        setTimeout(() => {
          startCarousel();
        }, 100);
      }
    } else {
      // Limpiar el carrusel si no se cumplen las condiciones
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
        carouselIntervalRef.current = null;
      }
    }
    
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
        carouselIntervalRef.current = null;
      }
    };
  }, [featuredMovie, isLoading, featuredMovies.length, startCarousel]);

  const handleMovieClick = useCallback((movie: MovieClickData) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  }, [onMovieClick]);

  // Componente reutilizable para secciones de películas - memoizado para evitar re-renderizados
  const MovieSection = React.memo(({ title, icon, movies, subtitle, sectionId, handleMovieClick }: { 
    title: string; 
    icon: React.ReactNode; 
    movies: Movie[]; 
    subtitle?: string;
    sectionId: string;
    handleMovieClick: (movie: MovieClickData) => void;
  }) => {
    return (
      <div className="unyfilm-home__section">
        <div className="unyfilm-home__section-header">
          <h2 className="unyfilm-home__section-title">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="unyfilm-home__section-subtitle">{subtitle}</p>}
        </div>
        
        <div className="unyfilm-home__section-grid">
          {movies.map((movie, index) => {
            return (
              <UnyFilmCard
                key={`${sectionId}-${movie._id}-${index}`}
                title={movie.title}
                image={movie.poster || '/images/default-movie.jpg'}
                movieId={movie._id}
                onMovieClick={() => handleMovieClick({
                  _id: movie._id,
                  title: movie.title,
                  index: index,
                  videoUrl: movie.videoUrl || '',
                  rating: movie.rating?.average || 0,
                  year: new Date(movie.releaseDate || '').getFullYear() || 0,
                  genre: movie.genre[0] || '',
                  description: movie.description || '',
                  synopsis: movie.synopsis || movie.description,
                  genres: movie.genre,
                  cloudinaryPublicId: movie.cloudinaryVideoId,
                  cloudinaryUrl: movie.videoUrl,
                  duration: movie.duration || 0
                })}
                description={movie.description || ''}
              />
            );
          })}
        </div>
      </div>
    );
  });

  // Componente separado para todas las secciones de películas - completamente memoizado
  const MovieSections = React.memo(({ 
    sectionMovies,
    handleMovieClick 
  }: {
    sectionMovies: Record<string, Movie[]>;
    handleMovieClick: (movie: MovieClickData) => void;
  }) => {
    return (
      <div className="unyfilm-home__sections">
        {homeSections.map((section) => (
          <MovieSection 
            key={section.id}
            title={section.title} 
            icon={
              section.id === 'trending' ? <Flame size={24} /> :
              section.id === 'popular' ? <TrendingUp size={24} /> :
              section.id === 'kids' ? <Baby size={24} /> :
              section.id === 'action' ? <Zap size={24} /> :
              section.id === 'sci-fi' ? <Rocket size={24} /> :
              section.id === 'horror' ? <Skull size={24} /> :
              section.id === 'comedy' ? <Smile size={24} /> :
              section.id === 'drama' ? <Drama size={24} /> :
              <Star size={24} />
            }
            movies={sectionMovies[section.id] || []}
            subtitle={
              section.id === 'trending' ? "Las películas más populares del momento" :
              section.id === 'popular' ? "Favoritas de la audiencia" :
              section.id === 'kids' ? "Diversión para grandes y pequeños" :
              section.id === 'action' ? "Emociones que te mantendrán al borde del asiento" :
              section.id === 'sci-fi' ? "Viajes a mundos futuros e imaginarios" :
              section.id === 'horror' ? "Suspenso y terror que te pondrán los pelos de punta" :
              section.id === 'comedy' ? "Para reír y pasar un buen rato" :
              section.id === 'drama' ? "Historias que tocan el corazón" :
              "Contenido seleccionado"
            }
            sectionId={section.id}
            handleMovieClick={handleMovieClick}
          />
        ))}
      </div>
    );
  });

  // Memoizar las secciones de películas para evitar re-renderizados
  const memoizedMovieSections = useMemo(() => (
    <MovieSections 
      sectionMovies={sectionMovies}
      handleMovieClick={handleMovieClick}
    />
  ), [sectionMovies, handleMovieClick]);

  if (isLoading) {
    return (
      <div className="unyfilm-home__loading">
        <div className="loading-spinner"></div>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unyfilm-home__error">
        <h2>Error al cargar el contenido</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="unyfilm-home">
      {/* Hero Section - Separado para evitar re-renderizado de minicards */}
      {featuredMovie && (
        <div 
          className={`unyfilm-home__hero ${isTransitioning ? 'unyfilm-home__hero--transitioning' : ''}`}
        >
          <div className="unyfilm-home__hero-bg">
            <img 
              src={getHeroImage(featuredMovie)} 
              alt={featuredMovie.title}
              className="unyfilm-home__hero-image"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Fallback chain: poster -> trailer -> videoUrl -> default
                if (img.src !== featuredMovie.trailer && featuredMovie.trailer) {
                  img.src = featuredMovie.trailer;
                } else if (img.src !== featuredMovie.videoUrl && featuredMovie.videoUrl) {
                  img.src = featuredMovie.videoUrl;
                } else {
                  img.src = '/images/default-hero.jpg';
                }
              }}
            />
            <div className="unyfilm-home__hero-overlay"></div>
          </div>
          
          <div 
            className="unyfilm-home__hero-content"
            style={{
              animation: 'heroContentSlideIn 1.0s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both'
            }}
          >
            <h1 className="unyfilm-home__hero-title">{featuredMovie.title}</h1>
            
            <div className="unyfilm-home__hero-meta">
              <span className="hero-year">{new Date(featuredMovie.releaseDate || '').getFullYear() || 'N/A'}</span>
              <span className="hero-genre">{featuredMovie.genre[0] || 'N/A'}</span>
              <span className="hero-rating">
                <Star size={16} />
                {hasRealRatings ? averageRating.toFixed(1) : '0'}
              </span>
              <span className="hero-duration">{featuredMovie.duration ? `${featuredMovie.duration} min` : 'N/A'}</span>
            </div>
            
            <p className="unyfilm-home__hero-description">
              {featuredMovie.description || 'Descripción no disponible'}
            </p>
            
            <div className="unyfilm-home__hero-actions">
              <button 
                className="hero-btn hero-btn--primary"
                onClick={() => handleMovieClick({
                  _id: featuredMovie._id,
                  title: featuredMovie.title,
                  index: featuredIndex,
                  videoUrl: featuredMovie.videoUrl || '',
                  rating: hasRealRatings ? averageRating : 0,
                  year: new Date(featuredMovie.releaseDate || '').getFullYear() || 0,
                  genre: featuredMovie.genre[0] || '',
                  description: featuredMovie.description || '',
                  synopsis: featuredMovie.synopsis || featuredMovie.description,
                  genres: featuredMovie.genre,
                  cloudinaryPublicId: featuredMovie.cloudinaryVideoId,
                  cloudinaryUrl: featuredMovie.videoUrl,
                  duration: featuredMovie.duration || 0
                })}
              >
                <Play size={18} />
                Ver ahora
              </button>
              
              <button 
                className="hero-btn hero-btn--secondary"
                onClick={() => {}}
              >
                <Heart size={18} />
                Favoritos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Sections - Completamente memoizadas para evitar re-renderizado */}
      {memoizedMovieSections}
    </div>
  );
}