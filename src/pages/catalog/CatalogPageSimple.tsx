import React from 'react';
import './CatalogPage.scss';

/**
 * Simplified CatalogPage for debugging
 */
const CatalogPageSimple: React.FC = () => {
  return (
    <div className="catalog-page">
      {/* Top Header */}
      <header className="catalog-page__top-header">
        <div className="catalog-page__top-content">
          <h1 className="catalog-page__page-title">Catálogo</h1>
          <div className="catalog-page__top-actions">
            <div className="catalog-page__user-avatar">J</div>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <section className="catalog-page__results">
        <div className="catalog-page__results-header">
          <h2 className="catalog-page__results-title">Todas las películas</h2>
          <p className="catalog-page__results-count">8 películas encontradas</p>
        </div>

        {/* Simple Movie Grid */}
        <div className="catalog-page__movie-grid">
          <div className="movie-grid__container">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="movie-grid__item">
                <div className="movie-card">
                  <div className="movie-card__poster">
                    <div className="movie-card__placeholder">
                      <div className="movie-card__placeholder-icon">🎬</div>
                      <div className="movie-card__placeholder-text">Película {i}</div>
                    </div>
                  </div>
                  <div className="movie-card__title-container">
                    <h3 className="movie-card__title-text">Película {i}</h3>
                    <div className="movie-card__title-meta">
                      <span className="movie-card__title-year">2023</span>
                      <span className="movie-card__title-rating">★ 4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogPageSimple;
