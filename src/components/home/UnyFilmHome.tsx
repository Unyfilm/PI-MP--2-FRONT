/**
 * @file UnyFilmHome.tsx
 * @description Home page component for the UnyFilm platform.
 * Displays a featured movie carousel (hero) and multiple curated sections such as Trending, Popular, Kids, Action, Comedy, Sci-Fi, Horror, and Drama.
 * Includes real-time ratings, dynamic transitions, asynchronous movie loading, and accessibility support.
 * 
 * @version 3.0.0
 * @author
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Play, Star, Flame, TrendingUp, Baby, Zap, Smile, Drama, Rocket, Skull } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { homeSections } from '../../data/moviesData';
import { movieService, type Movie } from '../../services/movieService';
import { useRealtimeRatings } from '../../hooks/useRealtimeRatings';
import { getMovieRatingStats } from '../../services/ratingService';
import './UnyFilmHome.css';

/**
 * @typedef {Object} MovieClickData
 * @property {string} [_id] - Unique identifier of the movie.
 * @property {string} title - Title of the movie.
 * @property {number} index - Index position in the carousel or list.
 * @property {string} videoUrl - URL of the movie's video file.
 * @property {number} rating - Average rating.
 * @property {number} year - Release year.
 * @property {string} genre - Primary genre of the movie.
 * @property {string} description - Short description of the movie.
 * @property {string} [synopsis] - Full synopsis of the movie.
 * @property {string[]} [genres] - Array of genres.
 * @property {string} [cloudinaryPublicId] - Cloudinary public video ID.
 * @property {string} [cloudinaryUrl] - Cloudinary video URL.
 * @property {number} [duration] - Duration in minutes.
 * @property {Array<{language: string, languageCode: string, url: string, isDefault: boolean}>} [subtitles] - Available subtitles metadata.
 */
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
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
};

/**
 * @interface HomeProps
 * @property {number[]} favorites - List of user's favorite movie IDs.
 * @property {(index: number) => void} toggleFavorite - Function to toggle favorite state.
 * @property {(movie: MovieClickData) => void} onMovieClick - Function triggered when a movie card is clicked.
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
 * @component
 * @param {Omit<HomeProps, 'favorites' | 'toggleFavorite'>} props - Component props excluding favorites and toggleFavorite.
 * @returns {JSX.Element} Rendered UnyFilm Home user interface.
 */
export default function UnyFilmHome({ onMovieClick }: Omit<HomeProps, 'favorites' | 'toggleFavorite'>) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionMovies, setSectionMovies] = useState<Record<string, Movie[]>>({});
  
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const carouselIntervalRef = useRef<number | null>(null);

  const { ratingStats, loadRatingStats } = useRealtimeRatings({
    movieId: featuredMovie?._id || '',
    autoLoad: true,
    enableRealtime: true
  });

  /** Local hero rating state used for immediate UI response */
  const [heroRating, setHeroRating] = useState<{ avg: number; total: number; loading: boolean }>({ avg: 0, total: 0, loading: true });
  
  /**
   * Selects the best available hero image source for the featured movie.
   * @param {Movie} movie - Movie object.
   * @returns {string} - Valid image URL or default fallback.
   */
  const getHeroImage = (movie: Movie): string => {
    if (movie.port) return movie.port;
    
    if (movie.poster) return movie.poster;
    
    if (movie.trailer) return movie.trailer;
    
    if (movie.videoUrl) return movie.videoUrl;
    
    return '/images/default-hero.jpg';
  };

  /**
   * Changes the featured hero movie to the next item in the carousel.
   * @function changeToNextMovie
   */
  const changeToNextMovie = useCallback(async () => {
    if (!featuredMovies.length || featuredMovies.length <= 1 || isTransitioning) {
      return;
    }
    
    setIsTransitioning(true);
    
    try {
      const nextIndex = (featuredIndex + 1) % featuredMovies.length;
      
      setFeaturedIndex(nextIndex);
      setFeaturedMovie(featuredMovies[nextIndex]);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    } catch (error) {
      setIsTransitioning(false);
    }
  }, [featuredIndex, featuredMovies, isTransitioning]);

  /**
   * Initializes the carousel autoplay feature with a 5-second interval.
   * @function startCarousel
   */
  const startCarousel = useCallback(() => {
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    
    const interval = setInterval(() => {
      changeToNextMovie();
    }, 5000);
    
    carouselIntervalRef.current = interval as any;
  }, [changeToNextMovie]);
  
  /**
   * Loads available movies for the carousel and categorized sections.
   * Handles errors gracefully and ensures fallback content.
   */
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let availableMovies: Movie[] = [];
        const sectionData: Record<string, Movie[]> = {};

            try {
              availableMovies = await movieService.getAvailableMovies();
            } catch (error) {
        }

        const carouselMovies = availableMovies.slice(0, 5);
        
        if (carouselMovies.length > 0) {
          setFeaturedMovies(carouselMovies);
          setFeaturedMovie(carouselMovies[0]);
          setFeaturedIndex(0);
        } else {
        }
        for (const section of homeSections) {
          try {
            let movies: Movie[] = [];
            
            if (section.id === 'trending') {
              try {
                movies = await movieService.getTrendingMovies();
              } catch (trendingError) {
                movies = availableMovies
                  .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
                  .slice(0, 3);
              }
            } else {
              const genreMap: Record<string, string[]> = {
                'popular': ['action', 'drama', 'comedy'],
                'kids': ['family', 'animation', 'comedy'],
                'action': ['action', 'adventure', 'thriller'],
                'sci-fi': ['sci-fi', 'fantasy', 'adventure'],
                'horror': ['horror', 'thriller', 'mystery']
              };
              
              const targetGenres = genreMap[section.id] || [];
              movies = availableMovies
                .filter(movie => 
                  movie.genre.some(genre => 
                    targetGenres.some(target => 
                      genre.toLowerCase().includes(target.toLowerCase())
                    )
                  )
                )
                .slice(0, 3);
            }
            
            if (movies.length === 0 && availableMovies.length > 0) {
              movies = availableMovies.slice(0, 3);
            }
            
            sectionData[section.id] = movies;
          } catch (error) {
            sectionData[section.id] = availableMovies.slice(0, 3);
          }
        }

        setSectionMovies(sectionData);
        setIsLoading(false);
        } catch (error) {
          setError('Error al cargar las películas. Por favor, verifica que el servidor esté funcionando.');
          setIsLoading(false);
        }
    };

    if (featuredMovies.length === 0 && Object.keys(sectionMovies).length === 0) {
      loadMovies();
    }
  }, []);

  /** Loads real-time rating stats whenever the featured movie changes */
  useEffect(() => {
    if (featuredMovie?._id) {
      loadRatingStats();
    }
  }, [featuredMovie?._id, loadRatingStats]);

  /**
   * Fetches hero rating stats safely with timeout control.
   * Prevents UI freeze when network delays occur.
   */
  useEffect(() => {
    let cancelled = false;
    let safetyTimer: number | null = null;
    const fetchHeroRating = async () => {
      if (!featuredMovie?._id) {
        setHeroRating({ avg: 0, total: 0, loading: false });
        return;
      }
      setHeroRating(prev => ({ ...prev, loading: true }));
      
      safetyTimer = window.setTimeout(() => {
        if (!cancelled) {
          setHeroRating(prev => ({ ...prev, loading: false }));
        }
      }, 2000);

      try {
        const stats = await getMovieRatingStats(featuredMovie._id);
        if (!cancelled) {
          setHeroRating({ avg: stats.averageRating || 0, total: stats.totalRatings || 0, loading: false });
        }
      } catch (e) {
        if (!cancelled) {
          setHeroRating({ avg: 0, total: 0, loading: false });
        }
      } finally {
        if (safetyTimer) {
          clearTimeout(safetyTimer);
        }
      }
    };
    fetchHeroRating();
    return () => { 
      cancelled = true; 
      if (safetyTimer) {
        clearTimeout(safetyTimer);
      }
    };
  }, [featuredMovie?._id]);
  
  /**
   * Manages the autoplay lifecycle for the hero carousel and cleanup.
   */
  useEffect(() => {
    if (featuredMovie && !isLoading && featuredMovies.length > 1) {
      if (!carouselIntervalRef.current) {
        setTimeout(() => {
          startCarousel();
        }, 100);
      }
    } else {
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
  
  /**
   * Handles movie card click events and triggers the external onMovieClick callback.
   * @param {MovieClickData} movie - Selected movie details.
   */
  const handleMovieClick = useCallback((movie: MovieClickData) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  }, [onMovieClick]);

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
                onMovieClick={() => {
                  handleMovieClick({
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
                    duration: movie.duration || 0,
                    subtitles: movie.subtitles
                  });
                }}
                description={movie.description || ''}
              />
            );
          })}
        </div>
      </div>
    );
  });

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
                {

(ratingStats && ratingStats.totalRatings > 0)
                    ? ratingStats.averageRating.toFixed(1)
                    : (heroRating.loading ? '…' : (heroRating.total > 0 ? heroRating.avg.toFixed(1) : '—'))
                }
              </span>
              <span className="hero-duration">{featuredMovie.duration ? `${featuredMovie.duration} min` : 'N/A'}</span>
            </div>
            
            <p className="unyfilm-home__hero-description">
              {featuredMovie.description || 'Descripción no disponible'}
            </p>
            
            <div className="unyfilm-home__hero-actions">
              <button 
                className="hero-btn hero-btn--primary"
        onClick={() => {
          handleMovieClick({
            _id: featuredMovie._id,
            title: featuredMovie.title,
            index: featuredIndex,
            videoUrl: featuredMovie.videoUrl || '',
            rating: ratingStats && ratingStats.totalRatings > 0 ? ratingStats.averageRating : 0,
            year: new Date(featuredMovie.releaseDate || '').getFullYear() || 0,
            genre: featuredMovie.genre[0] || '',
            description: featuredMovie.description || '',
            synopsis: featuredMovie.synopsis || featuredMovie.description,
            genres: featuredMovie.genre,
            cloudinaryPublicId: featuredMovie.cloudinaryVideoId,
            cloudinaryUrl: featuredMovie.videoUrl,
            duration: featuredMovie.duration || 0,
            subtitles: featuredMovie.subtitles
          });
        }}
              >
                <Play size={18} />
                Ver ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {memoizedMovieSections}
    </div>
  );
}