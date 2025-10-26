import { useState, useEffect } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { movieService, type Movie } from '../../services/movieService';
import { type UnyFilmCatalogProps, type MovieClickData } from '../../types/catalog';
import './UnyFilmCatalog.css';

/**
 * UnyFilmCatalog Component
 * 
 * Displays a dynamic catalog of movies with search, sorting, and filtering capabilities.
 * Supports grid and list view modes, and performs both local and server-side searches.
 *
 * @component
 * @param {UnyFilmCatalogProps} props - Component properties.
 * @param {MovieClickData} props.onMovieClick - Callback when a movie is clicked.
 * @param {string} [props.searchQuery] - Initial search query.
 * @param {Movie[]} [props.favorites] - List of user's favorite movies.
 * @param {Function} [props.toggleFavorite] - Toggles a movie as favorite.
 * 
 * @returns {JSX.Element} The rendered movie catalog.
 * @author Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta, Jerson Otero, Julian Mosquera
 */
export default function UnyFilmCatalog({ favorites: _favorites, toggleFavorite: _toggleFavorite, onMovieClick, searchQuery: initialSearchQuery }: UnyFilmCatalogProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'server' | 'local' | null>(null);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  /**
   * Loads all movies on component mount.
   * Handles server errors gracefully.
   * @async
   */
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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

  /**
   * Performs debounced search based on the query.
   * Uses server search first, then local fallback if empty or error.
   * @async
   */
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
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
        
        if (searchResults.length === 0) {
          setSearchMode('local');
          const allMovies = await movieService.getAllMovies();
          const localResults = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
            movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setMovies(localResults);
        } else {
          setSearchMode('server');
          setMovies(searchResults);
        }
      } catch (error) {
        try {
          setSearchMode('local');
          const allMovies = await movieService.getAllMovies();
          const localResults = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setMovies(localResults);
        } catch (fallbackError) {
        }
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const availableGenres = Array.from(new Set(movies.flatMap(movie => movie.genre)));
  const genres = ['all', ...availableGenres];

  const filteredMovies = movies.filter((movie: Movie) => {
    const matchesGenre = selectedGenre === 'all' || 
      movie.genre.includes(selectedGenre);
    return matchesGenre;
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
     
      <div className="unyfilm-catalog__header">
        <div className="unyfilm-catalog__breadcrumb">
          <span>Catálogo</span>
        </div>
      </div>

    
      <div className="unyfilm-catalog__title-section">
        <h1 className="unyfilm-catalog__title">Todas las películas</h1>
        
       
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
          
          {searchQuery && !isSearching && (
            <div className="unyfilm-catalog__search-mode">
              {searchMode === 'server' && (
                <span className="search-mode-indicator server">
                  🔍 Búsqueda en servidor
                </span>
              )}
              {searchMode === 'local' && (
                <span className="search-mode-indicator local">
                  💻 Búsqueda local
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="unyfilm-catalog__controls">
          <div className="unyfilm-catalog__filters">
            <button 
              className="unyfilm-catalog__filter-button unyfilm-catalog__reset-btn"
              onClick={() => {
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

      
      <div className="unyfilm-catalog__results-info">
        <p className="unyfilm-catalog__results-count">
          {sortedMovies.length} película{sortedMovies.length !== 1 ? 's' : ''} encontrada{sortedMovies.length !== 1 ? 's' : ''}
        </p>
      </div>

     
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
              movieId={movie._id}
              onMovieClick={() => handleMovieClick({ 
                _id: movie._id,
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
              rating={movie.rating?.average || 0}
            />
          );
        })}
      </div>
      )}

     
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