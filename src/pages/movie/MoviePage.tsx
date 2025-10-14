import React, { useState } from "react";
import Header from "../../components/layout/Header";
import MovieCard from "../../components/ui/MovieCard";
import { useMovies } from "../../hooks/useMovies";
import { MOVIE_GENRES } from "../../constants/movies";
import "../../styles/MoviePage.css";

/**
 * Movies catalog page with search, filters, and movie grid.
 * 
 * @component
 * @returns {JSX.Element} The movies catalog page
 */
const MoviePage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const {
    movies,
    loading,
    error,
    searchMovies,
    filterByGenre,
    clearFilters
  } = useMovies();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchMovies(query);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "") {
      clearFilters();
    } else {
      filterByGenre(genre);
    }
  };

  const handleMovieClick = (movie: any) => {
    console.log("Movie clicked:", movie);
    // TODO: Navigate to movie detail page
  };

  const handleFavoriteClick = (movie: any) => {
    console.log("Favorite clicked:", movie);
    // TODO: Toggle favorite status
  };

  return (
    <div className="movie-page">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        user={{ name: "Usuario" }}
      />
      
      <main className="movie-content">
        <div className="movie-header">
          <h1 className="page-title">Todas las películas</h1>
          
          <div className="filters">
            <select 
              className="genre-filter"
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
            >
              <option value="">Género</option>
              {MOVIE_GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando películas...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎬</div>
                <h3>No se encontraron películas</h3>
                <p>Intenta ajustar tus filtros de búsqueda</p>
                <button onClick={clearFilters}>
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MoviePage;