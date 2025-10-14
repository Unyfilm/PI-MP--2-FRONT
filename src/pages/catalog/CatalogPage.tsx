import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MovieGrid from '../../components/ui/MovieGrid';
import SearchBar from '../../components/ui/SearchBar';
import { useMovieCatalog } from '../../hooks/useMovieCatalog';
import { Movie } from '../../types/movie';
import './CatalogPage.scss';

/**
 * CatalogPage component for displaying and managing the movie catalog.
 * Features search, filtering, sorting, and responsive grid layout.
 * 
 * @component
 * @returns {JSX.Element} Catalog page component
 * 
 * @example
 * ```tsx
 * <CatalogPage />
 * ```
 */
const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [favoritedMovies, setFavoritedMovies] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Use the movie catalog hook
  const {
    movies,
    categories,
    isLoading,
    error,
    searchQuery,
    selectedGenre,
    sortBy,
    sortOrder,
    currentPage,
    totalPages,
    handleSearch,
    handleGenreChange,
    handleSortChange,
    handlePageChange,
    refreshMovies,
    clearFilters
  } = useMovieCatalog();

  /**
   * Handles movie click navigation.
   */
  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  /**
   * Handles favorite button click.
   */
  const handleFavoriteClick = (movie: Movie) => {
    setFavoritedMovies(prev => {
      if (prev.includes(movie.id)) {
        return prev.filter(id => id !== movie.id);
      } else {
        return [...prev, movie.id];
      }
    });
  };

  /**
   * Handles search input changes with suggestions.
   */
  const handleSearchChange = (query: string) => {
    handleSearch(query);
    
    // Generate search suggestions based on movie titles
    if (query.length > 1) {
      const suggestions = movies
        .filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
        .map(movie => movie.title)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  /**
   * Handles search suggestion click.
   */
  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
    setSearchSuggestions([]);
  };

  /**
   * Handles sort option changes.
   */
  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
  };

  /**
   * Handles genre filter changes.
   */
  const handleGenreFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleGenreChange(e.target.value);
  };

  /**
   * Handles pagination.
   */
  const handlePagination = (page: number) => {
    handlePageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="catalog-page">
      {/* Header Section */}
      <header className="catalog-page__header">
        <div className="catalog-page__header-content">
          <h1 className="catalog-page__title">Movie Catalog</h1>
          <p className="catalog-page__subtitle">
            Discover and explore our collection of movies
          </p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <section className="catalog-page__filters">
        <div className="catalog-page__filters-container">
          {/* Search Bar */}
          <div className="catalog-page__search">
            <SearchBar
              value={searchQuery}
              placeholder="Search movies, directors, actors..."
              onSearch={handleSearchChange}
              onSubmit={handleSearchChange}
              suggestions={searchSuggestions}
              onSuggestionClick={handleSuggestionClick}
              className="catalog-page__search-bar"
            />
          </div>

          {/* Filter Controls */}
          <div className="catalog-page__controls">
            <div className="catalog-page__control-group">
              <label htmlFor="genre-filter" className="catalog-page__control-label">
                Genre
              </label>
              <select
                id="genre-filter"
                value={selectedGenre}
                onChange={handleGenreFilterChange}
                className="catalog-page__control-select"
                aria-label="Filter by genre"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.movieCount})
                  </option>
                ))}
              </select>
            </div>

            <div className="catalog-page__control-group">
              <label htmlFor="sort-filter" className="catalog-page__control-label">
                Sort by
              </label>
              <select
                id="sort-filter"
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortOptionChange}
                className="catalog-page__control-select"
                aria-label="Sort movies"
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="year-desc">Year (Newest)</option>
                <option value="year-asc">Year (Oldest)</option>
                <option value="rating-desc">Rating (Highest)</option>
                <option value="rating-asc">Rating (Lowest)</option>
                <option value="createdAt-desc">Recently Added</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="catalog-page__clear-filters"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="catalog-page__results">
        <div className="catalog-page__results-header">
          <h2 className="catalog-page__results-title">
            {selectedGenre === 'All Movies' ? 'All Movies' : selectedGenre}
          </h2>
          <p className="catalog-page__results-count">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
          </p>
        </div>

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          isLoading={isLoading}
          error={error}
          onMovieClick={handleMovieClick}
          onFavoriteClick={handleFavoriteClick}
          favoritedMovies={favoritedMovies}
          showFavoriteButton={true}
          cardSize="medium"
          className="catalog-page__movie-grid"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="catalog-page__pagination">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
              className="catalog-page__pagination-button"
              aria-label="Previous page"
            >
              ← Previous
            </button>
            
            <div className="catalog-page__pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="catalog-page__pagination-button"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {/* Refresh Button */}
        <div className="catalog-page__actions">
          <button
            onClick={refreshMovies}
            className="catalog-page__refresh-button"
            aria-label="Refresh movie catalog"
          >
            🔄 Refresh
          </button>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;
