import { useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import { moviesData, availableGenres } from '../../data/moviesData';
import type { Movie } from '../../types';
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

  const genres = ['all', ...availableGenres];

  const filteredMovies = moviesData.filter((movie: Movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || 
      movie.genres?.includes(selectedGenre) || 
      movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return (b.year || 0) - (a.year || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
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
      <div className={`unyfilm-catalog__grid unyfilm-catalog__grid--${viewMode}`}>
        {sortedMovies.map((movie, index) => {
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
              genre={movie.genre || 'Acción'}
              rating={movie.rating || 4.0}
              year={movie.year || 2024}
            />
          );
        })}
      </div>

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
