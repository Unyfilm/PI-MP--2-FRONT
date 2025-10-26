// Configuración de películas dinámica - Los datos se cargan desde la API
export const movieConfig = {
  // El featured movie se obtiene dinámicamente desde la API
  featuredMovieId: null,
};

// Secciones de la página de inicio - Los datos se cargan dinámicamente desde la API
export const homeSections = [
  {
    id: 'trending',
    title: 'En Tendencia',
    movieIds: [] // Se llena dinámicamente desde getTrendingMovies()
  },
  {
    id: 'popular',
    title: 'Populares',
    movieIds: [] // Se llena dinámicamente desde getAvailableMovies()
  },
  {
    id: 'kids',
    title: 'Para toda la familia',
    movieIds: [] // Se llena dinámicamente desde getAvailableMovies()
  },
  {
    id: 'action',
    title: 'Acción y Aventura',
    movieIds: [] // Se llena dinámicamente desde getAvailableMovies()
  },
  {
    id: 'sci-fi',
    title: 'Ciencia Ficción',
    movieIds: [] // Se llena dinámicamente desde getAvailableMovies()
  },
  {
    id: 'horror',
    title: 'Terror y Suspenso',
    movieIds: [] // Se llena dinámicamente desde getAvailableMovies()
  }
];

// Los datos de películas se cargan dinámicamente desde la API
export default homeSections;