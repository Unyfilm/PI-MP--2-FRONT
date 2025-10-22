import { useState, useEffect } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { movieService, type Movie } from '../../services/movieService';
import './UnyFilmCatalog.css';

// Interfaces para el catálogo
interface MovieClickData {
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
}

interface UnyFilmCatalogProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
}

/**
 * Catalog page component with movie grid and filters
 */
export default function UnyFilmCatalog({ favorites, toggleFavorite, onMovieClick }: UnyFilmCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Cargar películas desde la API - CATÁLOGO INDEPENDIENTE
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Usar el endpoint para obtener TODAS las películas
        const moviesData = await movieService.getAllMovies();
        setMovies(moviesData);
        
        setIsLoading(false);
        } catch (error) {
          setError('Error al cargar las películas. Por favor, verifica que el servidor esté funcionando.');
          setIsLoading(false);
        }
    };

    loadMovies();
  }, []);

  // Búsqueda real usando endpoint de búsqueda
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        // Si no hay búsqueda, cargar todas las películas
        try {
          const allMovies = await movieService.getAllMovies();
          setMovies(allMovies);
        } catch (error) {
        }
        return;
      }

      try {
        setIsSearching(true);
        const searchResults = await movieService.searchMovies(searchQuery);
        setMovies(searchResults);
      } catch (error) {
        // En caso de error en búsqueda, mantener películas actuales
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce para evitar demasiadas búsquedas
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Obtener géneros únicos de las películas cargadas
  const availableGenres = Array.from(new Set(movies.flatMap(movie => movie.genre)));
  const genres = ['all', ...availableGenres];

  const filteredMovies = movies.filter((movie: Movie) => {
    // Si hay búsqueda, no filtrar por título (ya viene filtrado del endpoint)
    const matchesSearch = searchQuery.trim() === '' || 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || 
      movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return new Date(b.releaseDate || '').getFullYear() - new Date(a.releaseDate || '').getFullYear();
      case 'rating':
        return (b.rating.average || 0) - (a.rating.average || 0);
      default:
        return 0;
    }
  });

  const handleMovieClick = (movie: MovieClickData) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="unyfilm-catalog">
      {/* Header */}
      <div className="unyfilm-catalog__header">
        <div className="unyfilm-catalog__breadcrumb">
          <span>Catálogo</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="unyfilm-catalog__title-section">
        <h1 className="unyfilm-catalog__title">Todas las películas</h1>
        
        {/* Search Bar */}
        <div className="unyfilm-catalog__search">
          <div className="unyfilm-catalog__search-input-wrapper">
            <Search size={20} className="unyfilm-catalog__search-icon" />
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="unyfilm-catalog__search-input"
            />
            {isSearching && (
              <div className="unyfilm-catalog__search-loading">
                <div className="loading-spinner-small"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="unyfilm-catalog__controls">
          <div className="unyfilm-catalog__filters">
            <button 
              className="unyfilm-catalog__filter-button unyfilm-catalog__reset-btn"
              onClick={() => {
                // Reset all filters
                setSelectedGenre('all');
                setSortBy('title');
                setSearchQuery('');
              }}
              aria-label="Resetear filtros"
            >
              <Filter size={16} />
              Resetear
            </button>
            
            <select 
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className="unyfilm-catalog__genre-select"
              id="genre-filter"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'Todos los géneros' : genre}
                </option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="unyfilm-catalog__sort-select"
              id="sort-filter"
            >
              <option value="title">Ordenar por título</option>
              <option value="year">Ordenar por año</option>
              <option value="rating">Ordenar por rating</option>
            </select>
          </div>
          
          <div className="unyfilm-catalog__view-controls">
            <button 
              className={`unyfilm-catalog__view-button unyfilm-catalog__view-toggle ${viewMode === 'grid' ? 'unyfilm-catalog__view-button--active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Vista de cuadrícula"
            >
              <Grid size={16} />
            </button>
            <button 
              className={`unyfilm-catalog__view-button unyfilm-catalog__view-toggle ${viewMode === 'list' ? 'unyfilm-catalog__view-button--active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-label="Vista de lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="unyfilm-catalog__results-info">
        <p className="unyfilm-catalog__results-count">
          {sortedMovies.length} película{sortedMovies.length !== 1 ? 's' : ''} encontrada{sortedMovies.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Movie Grid */}
      {isLoading ? (
        <div className="unyfilm-catalog-loading">
          <div className="loading-spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      ) : error ? (
        <div className="unyfilm-catalog-error">
          <h2>Error al cargar el catálogo</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      ) : (
      <div className={`unyfilm-catalog__grid unyfilm-catalog__grid--${viewMode}`}>
          {sortedMovies.map((movie, index) => {
          return (
            <UnyFilmCard
                key={movie._id || index}
              title={movie.title}
              onMovieClick={() => handleMovieClick({ 
                title: movie.title, 
                index: index,
                videoUrl: movie.videoUrl || '',
                rating: movie.rating?.average || 0,
                year: movie.releaseDate && movie.releaseDate !== 'Invalid Date' ? new Date(movie.releaseDate).getFullYear() : 0,
                genre: movie.genre[0] || '',
                description: movie.description || '',
                synopsis: movie.synopsis || movie.description,
                genres: movie.genre,
                cloudinaryPublicId: movie.cloudinaryVideoId,
                cloudinaryUrl: movie.videoUrl,
                duration: movie.duration || 0
              })}
              description={movie.description || ''}
              image={movie.poster}
              fallbackImage={movie.trailer}
              genre={movie.genre[0] || ''}
              year={movie.releaseDate && movie.releaseDate !== 'Invalid Date' ? new Date(movie.releaseDate).getFullYear() : 0}
            />
          );
        })}
      </div>
      )}

      {/* No Results */}
      {sortedMovies.length === 0 && (
        <div className="unyfilm-catalog__no-results">
          <div className="unyfilm-catalog__no-results-icon">
            <Search size={48} />
          </div>
          <h3 className="unyfilm-catalog__no-results-title">No se encontraron películas</h3>
          <p className="unyfilm-catalog__no-results-description">
            Intenta ajustar tus filtros de búsqueda o explorar otros géneros.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {sortedMovies.length > 0 && (
        <div className="unyfilm-catalog__load-more">
          <button className="unyfilm-catalog__load-more-button">
            Cargar más películas
          </button>
        </div>
      )}
    </div>
  );
}
