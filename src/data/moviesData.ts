/**
 * @file movieConfig.ts
 * @description Defines configuration objects for the movie homepage layout,
 * including the featured movie and categorized home sections such as trending,
 * popular, and genre-based collections.
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */

/**
 * Global movie configuration object.
 * 
 * @property {string | null} featuredMovieId - The ID of the featured movie to be displayed
 * on the homepage banner. It can be dynamically assigned at runtime or remain `null`
 * if no movie is featured.
 */
export const movieConfig = {
  
  featuredMovieId: null,
};

/**
 * List of homepage movie sections.
 * 
 * Each section defines a category or genre displayed on the homepage,
 * including its internal identifier, display title, and an array of movie IDs
 * that belong to that section. These IDs can be dynamically loaded from
 * an API or assigned manually.
 * 
 * @typedef {Object} HomeSection
 * @property {string} id - Unique identifier for the section.
 * @property {string} title - Display name shown in the UI.
 * @property {string[]} movieIds - Array of movie IDs belonging to this section.
 * 
 * @type {HomeSection[]}
 */
export const homeSections = [
  {
    id: 'trending',
    title: 'En Tendencia',
    movieIds: [] 
  },
  {
    id: 'popular',
    title: 'Populares',
    movieIds: [] 
  },
  {
    id: 'kids',
    title: 'Para toda la familia',
    movieIds: [] 
  },
  {
    id: 'action',
    title: 'Acción y Aventura',
    movieIds: [] 
  },
  {
    id: 'sci-fi',
    title: 'Ciencia Ficción',
    movieIds: [] 
  },
  {
    id: 'horror',
    title: 'Terror y Suspenso',
    movieIds: [] 
  }
];

/**
 * Default export for the home sections configuration.
 * 
 * Useful for importing predefined homepage categories across components or pages.
 */
export default homeSections;