import { useState, useEffect } from 'react';
import { Play, Heart, Star, Flame, TrendingUp, Baby, Zap, Smile, Drama } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { moviesData } from '../../data/moviesData';
import type { Movie } from '../../types';
import './UnyFilmHome.css';

type MovieClickData = {
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
};

interface HomeProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
}

/**
 * Home page component with hero section and trending movies
 * @param {Object} props - Component props
 * @param {Array} props.favorites - Array of favorite movie indices
 * @param {Function} props.toggleFavorite - Function to toggle favorite
 * @param {Array} props.movieTitles - Array of movie titles
 */
export default function UnyFilmHome({ favorites, toggleFavorite, onMovieClick }: HomeProps) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(true);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [kidsMovies, setKidsMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Featured movie (first movie from our data)
      setFeaturedMovie(moviesData[0]);
      setFeaturedIndex(0);
      
      // Cargar diferentes secciones basadas en géneros
      setTrendingMovies(moviesData.slice(0, 6));
      setPopularMovies(moviesData.slice(1, 7));
      setKidsMovies(moviesData.filter(movie => 
        movie.genres?.includes('Animación') || 
        movie.genres?.includes('Aventura')
      ).slice(0, 6));
      setActionMovies(moviesData.filter(movie => 
        movie.genres?.includes('Acción') || 
        movie.genres?.includes('Aventura')
      ).slice(0, 6));
      setComedyMovies(moviesData.filter(movie => 
        movie.genres?.includes('Comedia')
      ).slice(0, 6));
      setDramaMovies(moviesData.filter(movie => 
        movie.genres?.includes('Drama')
      ).slice(0, 6));
      setIsLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotación del hero
  useEffect(() => {
    if (isLoading || moviesData.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(false);
      // Esperar a que haga fade-out y luego cambiar el contenido
      const next = (featuredIndex + 1) % moviesData.length;
      setTimeout(() => {
        setFeaturedMovie(moviesData[next]);
        setFeaturedIndex(next);
        setIsFading(true);
      }, 800); // duración del fade-out (debe empatar con CSS)
    }, 10000); // cada 7s

    return () => clearInterval(interval);
  }, [featuredIndex, isLoading]);

  const handleMovieClick = (movie: MovieClickData) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleFavoriteClick = (movie: Movie | null) => {
    console.log('Favorite clicked:', movie);
  };


  // Componente reutilizable para secciones de películas
  const MovieSection = ({ title, icon, movies, subtitle }: { title: string; icon: React.ReactNode; movies: Movie[]; subtitle?: string }) => {
    const toGFolder = (path?: string): string => {
      if (!path) return '';
      return path
        .replace('/pelis%20P/', '/pelis%20G/')
        .replace('/pelis P/', '/pelis G/');
    };
    return (
      <div className="unyfilm-home__section">
        <div className="unyfilm-home__section-header">
          <h2 className="unyfilm-home__section-title">
            {icon}
            {title}
          </h2>
          <p className="unyfilm-home__section-subtitle">{subtitle}</p>
        </div>
        
        <div className="unyfilm-home__section-grid">
          {movies.map((movie, index) => {
            return (
              <UnyFilmCard
                key={movie.id}
                title={movie.title}
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie.id)}
                onMovieClick={() => handleMovieClick({ 
                  title: movie.title, 
                  index: movie.id,
                  videoUrl: movie.videoUrl,
                  rating: movie.rating || 4.0,
                  year: movie.year || 2024,
                  genre: movie.genre || 'Acción',
                  description: movie.description || '',
                  synopsis: movie.synopsis,
                  genres: movie.genres,
                  cloudinaryPublicId: movie.cloudinaryPublicId,
                  cloudinaryUrl: movie.cloudinaryUrl
                })}
                description={movie.description || ''}
                image={movie.image}
                fallbackImage={movie.thumbnailUrl || movie.cloudinaryUrl?.replace('/video/upload/','/image/upload/').replace('.mp4','.jpg')}
                year={movie.year || 2024}
                genre={movie.genre || 'Acción'}
                rating={movie.rating || 4.0}
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="unyfilm-home">
        <div className="unyfilm-home__loading">
          <div className="unyfilm-home__spinner"></div>
          <p>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  const SHOW_HERO = false; // ocultar temporalmente la card grande

  return (
    <div className="unyfilm-home">
      {/* Hero Section */}
      {SHOW_HERO && (
      <div className={`unyfilm-home__hero ${isFading ? 'is-fade-in' : 'is-fade-out'}`}>
        <div className="unyfilm-home__hero-background">
          <div className="unyfilm-home__hero-overlay"></div>
        </div>
        
        {/* Imagen/Póster de la película destacada (lado derecho) */}
        {featuredMovie && (
          <img
            className="unyfilm-home__hero-poster"
            src={(() => {
              // 1) SIEMPRE usar local en carpeta G si existe (imageG)
              if (featuredMovie.imageG) return featuredMovie.imageG;
              // Fallback por si solo existe image en P
              const local = (featuredMovie.image || '')
                .replace('/pelis%20P/', '/pelis%20G/')
                .replace('/pelis P/', '/pelis G/');
              if (local) return local;
              // 2) Fallback: thumbnail
              if (featuredMovie.thumbnailUrl) return featuredMovie.thumbnailUrl;
              // 3) Fallback: derivado de Cloudinary
              if (featuredMovie.cloudinaryUrl) {
                return featuredMovie.cloudinaryUrl
                  .replace('/video/upload/', '/image/upload/')
                  .replace('.mp4', '.jpg');
              }
              return '';
            })()}
            alt={featuredMovie.title}
            loading="eager"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              const movie = featuredMovie;
              // Si falla el local G o el actual, prueba thumbnail
              if (movie?.thumbnailUrl && !img.dataset.fallbackThumb) {
                img.dataset.fallbackThumb = '1';
                img.src = movie.thumbnailUrl;
                return;
              }
              // Luego intenta derivado de cloudinary
              if (movie?.cloudinaryUrl && !img.dataset.fallbackCloudinary) {
                img.dataset.fallbackCloudinary = '1';
                img.src = movie.cloudinaryUrl
                  .replace('/video/upload/', '/image/upload/')
                  .replace('.mp4', '.jpg');
                return;
              }
              // Último recurso: placeholder
              if (!img.dataset.fallbackPlaceholder) {
                img.dataset.fallbackPlaceholder = '1';
                img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 450%22%3E%3Crect width=%22800%22 height=%22450%22 fill=%22%23222b3a%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2236%22 font-family=%22Arial%2C%20sans-serif%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
              }
            }}
          />
        )}

        {/* Nave eliminada */}

        <div className="unyfilm-home__hero-content">
          <div className="unyfilm-home__hero-badges">
            <span className="unyfilm-home__hero-badge unyfilm-home__hero-badge--trending">
              <Flame size={16} />
              Trending
            </span>
            <span className="unyfilm-home__hero-badge unyfilm-home__hero-badge--featured">
              <Star size={16} />
              Featured
            </span>
          </div>
          
          <h1 className="unyfilm-home__hero-title">
            {featuredMovie?.title}
          </h1>
          
          <div className="unyfilm-home__hero-meta">
            <span className="unyfilm-home__hero-year">{featuredMovie?.year}</span>
            <span className="unyfilm-home__hero-genre">{featuredMovie?.genre}</span>
            <span className="unyfilm-home__hero-rating">
              <Star size={16} />
              {featuredMovie?.rating}
            </span>
            <span className="unyfilm-home__hero-duration">{featuredMovie?.duration} min</span>
          </div>
          
          <p className="unyfilm-home__hero-description">
            {featuredMovie?.description}
          </p>
          
          <div className="unyfilm-home__hero-actions">
            <button 
              className="unyfilm-home__hero-button unyfilm-home__hero-button--primary"
              onClick={() => {
                if (!featuredMovie) return;
                handleMovieClick({
                  title: featuredMovie.title,
                  index: 0,
                  videoUrl: featuredMovie.videoUrl || '',
                  rating: Number(featuredMovie.rating ?? 0),
                  year: Number(featuredMovie.year ?? new Date().getFullYear()),
                  genre: featuredMovie.genre ?? '',
                  description: featuredMovie.description ?? ''
                });
              }}
            >
              <Play size={20} />
              Ver ahora
            </button>
            
            <button 
              className="unyfilm-home__hero-button unyfilm-home__hero-button--secondary"
              onClick={() => handleFavoriteClick(featuredMovie)}
            >
              <Heart size={20} />
              Favoritos
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Trending Movies Section */}
      <MovieSection
        title="Películas en tendencia"
        icon={<Flame size={24} />}
        movies={trendingMovies}
        subtitle="Descubre las películas más populares del momento"
      />

      {/* Popular Movies Section */}
      <MovieSection
        title="Populares"
        icon={<TrendingUp size={24} />}
        movies={popularMovies}
        subtitle="Las películas más vistas por nuestros usuarios"
      />

      {/* Kids Movies Section */}
      <MovieSection
        title="Para toda la familia"
        icon={<Baby size={24} />}
        movies={kidsMovies}
        subtitle="Contenido perfecto para disfrutar en familia"
      />

      {/* Action Movies Section */}
      <MovieSection
        title="Acción y Aventura"
        icon={<Zap size={24} />}
        movies={actionMovies}
        subtitle="Películas llenas de adrenalina y emociones"
      />

      {/* Comedy Movies Section */}
      <MovieSection
        title="Comedia"
        icon={<Smile size={24} />}
        movies={comedyMovies}
        subtitle="Ríe a carcajadas con nuestras mejores comedias"
      />

      {/* Drama Movies Section */}
      <MovieSection
        title="Drama"
        icon={<Drama size={24} />}
        movies={dramaMovies}
        subtitle="Historias profundas que tocarán tu corazón"
      />

      {/* Removed "Explora UnyFilm" quick links as requested */}
    </div>
  );
}
