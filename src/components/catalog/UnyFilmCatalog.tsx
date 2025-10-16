import { useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import UnyFilmCard from '../card/UnyFilmCard';
import './UnyFilmCatalog.css';

// Interfaces para el catálogo
interface MovieData {
  title: string;
  videoUrl: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  image?: string;
}

interface MovieClickData {
  title: string;
  index: number;
  videoUrl: string;
  rating: number;
  year: number;
  genre: string;
  description: string;
}

interface UnyFilmCatalogProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  movieTitles: string[];
  movieData: MovieData[];
  onMovieClick: (movie: MovieClickData) => void;
}

/**
 * Catalog page component with movie grid and filters
 */
export default function UnyFilmCatalog({ favorites, toggleFavorite, movieTitles, movieData, onMovieClick }: UnyFilmCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');

  const genres = ['all', 'Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Romance', 'Terror'];

  const filteredMovies = movieTitles.filter((title: string) => {
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || title.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.localeCompare(b);
      case 'year':
        return b.localeCompare(a); // Assuming newer first
      case 'rating':
        return b.localeCompare(a); // Assuming higher rating first
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
        {sortedMovies.map((title, index) => {
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
          
          const movieInfo = movieData[index] || { title, videoUrl: '' };
          return (
            <UnyFilmCard
              key={index}
              title={title}
              isFavorite={favorites.includes(index)}
              onToggleFavorite={() => toggleFavorite(index)}
              onMovieClick={() => handleMovieClick({ 
                title, 
                index,
                videoUrl: movieInfo.videoUrl,
                rating: ratings[index % ratings.length],
                year: years[index % years.length],
                genre: genres[index % genres.length],
                description: descriptions[index] || "Una increíble aventura cinematográfica que no te puedes perder."
              })}
              description={descriptions[index] || "Una increíble aventura cinematográfica que no te puedes perder."}
              image={`/images/movie-${index + 1}.jpg`}
              genre={genres[index % genres.length]}
              rating={ratings[index % ratings.length]}
              year={years[index % years.length]}
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
