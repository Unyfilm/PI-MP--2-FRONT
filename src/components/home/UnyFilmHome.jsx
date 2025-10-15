import React, { useState, useEffect } from 'react';
import { Play, Heart, Star, Flame, ArrowRight, TrendingUp, Users, Baby, Zap, Smile, Drama } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import './UnyFilmHome.css';

/**
 * Home page component with hero section and trending movies
 * @param {Object} props - Component props
 * @param {Array} props.favorites - Array of favorite movie indices
 * @param {Function} props.toggleFavorite - Function to toggle favorite
 * @param {Array} props.movieTitles - Array of movie titles
 */
export default function UnyFilmHome({ favorites, toggleFavorite, movieTitles, movieData, onMovieClick }) {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [kidsMovies, setKidsMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setFeaturedMovie({
        title: "Piratas Espaciales",
        year: 2023,
        genre: "Comedia / Acción",
        rating: 4.8,
        duration: 120,
        description: "Una aventura épica en el espacio donde un grupo de piratas espaciales debe salvar la galaxia de una amenaza alienígena.",
        image: "/images/space-pirates.jpg"
      });
      
      // Cargar diferentes secciones
      setTrendingMovies(movieTitles.slice(0, 6));
      setPopularMovies(movieTitles.slice(1, 7));
      setKidsMovies(movieTitles.slice(2, 8));
      setActionMovies(movieTitles.slice(3, 9));
      setComedyMovies(movieTitles.slice(4, 10));
      setDramaMovies(movieTitles.slice(5, 11));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [movieTitles]);

  const handleMovieClick = (movie) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleFavoriteClick = (movie) => {
    console.log('Favorite clicked:', movie);
  };

  const handleViewCatalog = () => {
    console.log('View catalog clicked');
  };

  // Componente reutilizable para secciones de películas
  const MovieSection = ({ title, icon, movies, subtitle, startIndex = 0 }) => {
    const descriptions = [
      "Una épica aventura espacial llena de acción y misterio que te mantendrá al borde del asiento.",
      "Un viaje emocionante a través de galaxias desconocidas donde cada planeta guarda secretos increíbles.",
      "Una historia de amor que trasciende el tiempo y el espacio, demostrando que el amor es universal.",
      "Una batalla épica entre el bien y el mal en el cosmos, donde el destino de la galaxia está en juego.",
      "Un thriller psicológico ambientado en el futuro que explora los límites de la mente humana.",
      "Una comedia espacial llena de aventuras y risas que te hará reír hasta las lágrimas.",
      "Un drama emocional sobre la supervivencia humana en un universo hostil y desconocido.",
      "Una aventura de ciencia ficción que combina tecnología avanzada con emociones humanas.",
      "Un misterio cósmico que desafía las leyes de la física y la realidad tal como la conocemos.",
      "Una odisea espacial que sigue a un grupo de héroes en su misión de salvar la humanidad.",
      "Un romance intergaláctico que demuestra que el amor puede florecer en cualquier lugar del universo.",
      "Una saga épica que abarca generaciones y civilizaciones enteras en el cosmos."
    ];
    
    const genres = ["Acción", "Ciencia Ficción", "Aventura", "Drama", "Comedia", "Romance", "Terror", "Thriller", "Misterio", "Fantasía", "Romance", "Épico"];
    const years = [2020, 2021, 2022, 2023, 2024];
    const ratings = [4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0];

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
          {movies.map((title, index) => {
            const movieIndex = startIndex + index;
            const movieInfo = movieData[movieIndex] || { title, videoUrl: '' };
            return (
              <UnyFilmCard
                key={movieIndex}
                title={title}
                isFavorite={favorites.includes(movieIndex)}
                onToggleFavorite={() => toggleFavorite(movieIndex)}
                onMovieClick={() => handleMovieClick({ 
                  title, 
                  index: movieIndex,
                  videoUrl: movieInfo.videoUrl,
                  rating: ratings[movieIndex % ratings.length],
                  year: years[movieIndex % years.length],
                  genre: genres[movieIndex % genres.length],
                  description: descriptions[movieIndex % descriptions.length]
                })}
                description={descriptions[movieIndex % descriptions.length]}
                year={years[movieIndex % years.length]}
                genre={genres[movieIndex % genres.length]}
                rating={ratings[movieIndex % ratings.length]}
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

  return (
    <div className="unyfilm-home">
      {/* Hero Section */}
      <div className="unyfilm-home__hero">
        <div className="unyfilm-home__hero-background">
          <div className="unyfilm-home__hero-overlay"></div>
        </div>
        
        <svg className="unyfilm-home__spaceship" viewBox="0 0 500 400">
          <defs>
            <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <ellipse cx="250" cy="200" rx="180" ry="60" fill="url(#shipGradient)" />
          <path d="M 100,200 L 70,220 L 100,210 Z" fill="#1e40af" />
          <path d="M 400,200 L 430,220 L 400,210 Z" fill="#1e40af" />
          <ellipse cx="250" cy="180" rx="50" ry="30" fill="#60a5fa" opacity="0.6" />
          <path d="M 150,200 L 50,160 L 120,195 Z" fill="#2563eb" opacity="0.7" />
          <path d="M 350,200 L 450,160 L 380,195 Z" fill="#2563eb" opacity="0.7" />
          <rect x="220" y="210" width="60" height="8" fill="#1e40af" opacity="0.8" />
          <circle cx="200" cy="200" r="8" fill="#60a5fa" />
          <circle cx="300" cy="200" r="8" fill="#60a5fa" />
        </svg>

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
              onClick={() => handleMovieClick(featuredMovie)}
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

      {/* Trending Movies Section */}
      <MovieSection
        title="Películas en tendencia"
        icon={<Flame size={24} />}
        movies={trendingMovies}
        subtitle="Descubre las películas más populares del momento"
        startIndex={0}
      />

      {/* Popular Movies Section */}
      <MovieSection
        title="Populares"
        icon={<TrendingUp size={24} />}
        movies={popularMovies}
        subtitle="Las películas más vistas por nuestros usuarios"
        startIndex={1}
      />

      {/* Kids Movies Section */}
      <MovieSection
        title="Para toda la familia"
        icon={<Baby size={24} />}
        movies={kidsMovies}
        subtitle="Contenido perfecto para disfrutar en familia"
        startIndex={2}
      />

      {/* Action Movies Section */}
      <MovieSection
        title="Acción y Aventura"
        icon={<Zap size={24} />}
        movies={actionMovies}
        subtitle="Películas llenas de adrenalina y emociones"
        startIndex={3}
      />

      {/* Comedy Movies Section */}
      <MovieSection
        title="Comedia"
        icon={<Smile size={24} />}
        movies={comedyMovies}
        subtitle="Ríe a carcajadas con nuestras mejores comedias"
        startIndex={4}
      />

      {/* Drama Movies Section */}
      <MovieSection
        title="Drama"
        icon={<Drama size={24} />}
        movies={dramaMovies}
        subtitle="Historias profundas que tocarán tu corazón"
        startIndex={5}
      />

      {/* Site Map Section */}
      <div className="unyfilm-home__sitemap">
        <div className="unyfilm-home__sitemap-content">
          <h2 className="unyfilm-home__sitemap-title">Explora UnyFilm</h2>
          <div className="unyfilm-home__sitemap-links">
            <button className="unyfilm-home__sitemap-link">
              <Play size={20} />
              Catálogo de Películas
            </button>
            <button className="unyfilm-home__sitemap-link">
              <Heart size={20} />
              Mis Favoritos
            </button>
            <button className="unyfilm-home__sitemap-link">
              <Star size={20} />
              Sobre Nosotros
            </button>
            <button className="unyfilm-home__sitemap-link">
              <Star size={20} />
              Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
