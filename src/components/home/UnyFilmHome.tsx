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
export default function UnyFilmHome({ favorites, toggleFavorite, onMovieClick }: HomeProps) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [kidsMovies, setKidsMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);

  // Función para convertir ruta de pelis P a Portadas
  const getPortadasImage = (pelisPImage?: string): string => {
    if (!pelisPImage) return '/images/default-hero.jpg';
    
    // Extraer el nombre del archivo de la ruta de pelis P
    const fileName = pelisPImage.split('/').pop() || '';
    
    // Crear la nueva ruta para Portadas usando import.meta.url
    return new URL(`../images/Portadas/${fileName}`, import.meta.url).href;
  };

  // Función para obtener la imagen del hero con fallbacks
  const getHeroImage = (movie: Movie): string => {
    // 1. Intentar usar imageG si existe (ya apunta a Portadas)
    if (movie.imageG) return movie.imageG;
    
    // 2. Convertir imagen de pelis P a Portadas
    if (movie.image) return getPortadasImage(movie.image);
    
    // 3. Usar thumbnail si existe
    if (movie.thumbnailUrl) return movie.thumbnailUrl;
    
    // 4. Usar Cloudinary si existe
    if (movie.cloudinaryUrl) {
      return movie.cloudinaryUrl
        .replace('/video/upload/', '/image/upload/')
        .replace('.mp4', '.jpg');
    }
    
    // 5. Fallback por defecto
    return '/images/default-hero.jpg';
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Featured movie (first movie from our data)
      if (moviesData.length > 0) {
        setFeaturedMovie(moviesData[0]);
        setFeaturedIndex(0);
      }
      
      // Cargar diferentes secciones basadas en géneros
      setTrendingMovies(moviesData.slice(0, 6));
      setPopularMovies(moviesData.slice(1, 7));
      setKidsMovies(moviesData.filter(movie => 
        movie.genre?.includes('Animación') ||
        movie.genre?.includes('Aventura')
      ).slice(0, 6));
      setActionMovies(moviesData.filter(movie => 
        movie.genre?.includes('Acción') ||
        movie.genre?.includes('Aventura')
      ).slice(0, 6));
      setComedyMovies(moviesData.filter(movie => 
        movie.genre?.includes('Comedia')
      ).slice(0, 6));
      setDramaMovies(moviesData.filter(movie => 
        movie.genre?.includes('Drama')
      ).slice(0, 6));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMovieClick = (movie: MovieClickData) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  // Componente reutilizable para secciones de películas
  const MovieSection = ({ title, icon, movies, subtitle }: { 
    title: string; 
    icon: React.ReactNode; 
    movies: Movie[]; 
    subtitle?: string 
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
            const movieIndex = moviesData.findIndex(m => m.title === movie.title);
            return (
              <UnyFilmCard
                key={movie.id || index}
                title={movie.title}
                image={movie.image || '/images/default-movie.jpg'}
                isFavorite={favorites.includes(movieIndex)}
                onToggleFavorite={() => toggleFavorite(movieIndex)}
                onMovieClick={() => handleMovieClick({
                  title: movie.title,
                  index: movieIndex,
                  videoUrl: movie.videoUrl || '',
                  rating: movie.rating || 4.0,
                  year: movie.year || 2024,
                  genre: movie.genre || 'Acción',
                  description: movie.description || '',
                  synopsis: movie.description,
                  genres: movie.genre ? [movie.genre] : undefined,
                  cloudinaryPublicId: movie.cloudinaryPublicId,
                  cloudinaryUrl: movie.cloudinaryUrl
                })}
                description={movie.description || ''}
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="unyfilm-home__loading">
        <div className="loading-spinner"></div>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="unyfilm-home">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="unyfilm-home__hero">
          <div className="unyfilm-home__hero-bg">
            <img 
              src={getHeroImage(featuredMovie)} 
              alt={featuredMovie.title}
              className="unyfilm-home__hero-image"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Fallback chain: Portadas -> pelis P -> thumbnail -> Cloudinary -> default
                if (img.src !== featuredMovie.image && featuredMovie.image) {
                  img.src = featuredMovie.image;
                } else if (img.src !== featuredMovie.thumbnailUrl && featuredMovie.thumbnailUrl) {
                  img.src = featuredMovie.thumbnailUrl;
                } else if (img.src !== featuredMovie.cloudinaryUrl && featuredMovie.cloudinaryUrl) {
                  img.src = featuredMovie.cloudinaryUrl
                    .replace('/video/upload/', '/image/upload/')
                    .replace('.mp4', '.jpg');
                } else {
                  img.src = '/images/default-hero.jpg';
                }
              }}
            />
            <div className="unyfilm-home__hero-overlay"></div>
          </div>
          
          <div className="unyfilm-home__hero-content">
            {/* Tags de trending y featured */}
            <div className="unyfilm-home__hero-badges">
              <div className="unyfilm-home__hero-badge unyfilm-home__hero-badge--trending">
                <Flame size={14} />
                TRENDING
              </div>
              <div className="unyfilm-home__hero-badge unyfilm-home__hero-badge--featured">
                <Star size={14} />
                FEATURED
              </div>
            </div>
            
            <h1 className="unyfilm-home__hero-title">{featuredMovie.title}</h1>
            
            <div className="unyfilm-home__hero-meta">
              <span className="hero-year">{featuredMovie.year || 2024}</span>
              <span className="hero-genre">{featuredMovie.genre || 'Acción'}</span>
              <span className="hero-rating">
                <Star size={16} />
                {featuredMovie.rating || 4.5}
              </span>
              <span className="hero-duration">135 min</span>
            </div>
            
            <p className="unyfilm-home__hero-description">
              {featuredMovie.description || 'Una increíble experiencia cinematográfica te espera.'}
            </p>
            
            <div className="unyfilm-home__hero-actions">
              <button 
                className="hero-btn hero-btn--primary"
                onClick={() => handleMovieClick({
                  title: featuredMovie.title,
                  index: featuredIndex,
                  videoUrl: featuredMovie.videoUrl || '',
                  rating: featuredMovie.rating || 4.5,
                  year: featuredMovie.year || 2024,
                  genre: featuredMovie.genre || 'Acción',
                  description: featuredMovie.description || '',
                  synopsis: featuredMovie.description,
                  genres: featuredMovie.genre ? [featuredMovie.genre] : undefined
                })}
              >
                <Play size={18} />
                Ver ahora
              </button>
              
              <button 
                className={`hero-btn hero-btn--secondary ${favorites.includes(featuredIndex) ? 'active' : ''}`}
                onClick={() => toggleFavorite(featuredIndex)}
              >
                <Heart size={18} />
                Favoritos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Sections */}
      <div className="unyfilm-home__sections">
        <MovieSection 
          title="En Tendencia" 
          icon={<Flame size={24} />}
          movies={trendingMovies}
          subtitle="Las películas más populares del momento"
        />
        
        <MovieSection 
          title="Populares" 
          icon={<TrendingUp size={24} />}
          movies={popularMovies}
          subtitle="Favoritas de la audiencia"
        />
        
        <MovieSection 
          title="Para toda la familia" 
          icon={<Baby size={24} />}
          movies={kidsMovies}
          subtitle="Diversión para grandes y pequeños"
        />
        
        <MovieSection 
          title="Acción y Aventura" 
          icon={<Zap size={24} />}
          movies={actionMovies}
          subtitle="Emociones que te mantendrán al borde del asiento"
        />
        
        <MovieSection 
          title="Comedia" 
          icon={<Smile size={24} />}
          movies={comedyMovies}
          subtitle="Para reír y pasar un buen rato"
        />
        
        <MovieSection 
          title="Drama" 
          icon={<Drama size={24} />}
          movies={dramaMovies}
          subtitle="Historias que tocan el corazón"
        />
      </div>
    </div>
  );
}