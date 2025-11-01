/**
 * Represents the structure of movie data when a user interacts with
 * a movie item in the catalog (e.g., clicks on it or selects it).
 *
 * @interface MovieClickData
 * @property {string} [_id] - Optional unique identifier for the movie.
 * @property {string} title - Title of the movie.
 * @property {number} index - Position or index of the movie in the catalog list.
 * @property {string} videoUrl - Direct URL to the movie video.
 * @property {number} rating - Current rating value of the movie.
 * @property {number} year - Year of release.
 * @property {string} genre - Primary genre of the movie.
 * @property {string} description - Short description or tagline for the movie.
 * @property {string} [synopsis] - Optional extended synopsis of the movie.
 * @property {string[]} [genres] - Optional list of genres associated with the movie.
 * @property {string} [cloudinaryPublicId] - Optional Cloudinary public identifier for the movie poster or video.
 * @property {string} [cloudinaryUrl] - Optional Cloudinary URL for optimized media delivery.
 * @property {number} [duration] - Optional total duration of the movie in minutes.
 * @property {Array<{language: string; languageCode: string; url: string; isDefault: boolean}>} [subtitles]
 * - Optional list of available subtitle tracks for the movie.
 */
export interface MovieClickData {
  _id?: string;
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
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
}

/**
 * Defines the props for the **UnyFilmCatalog** component.
 * This interface provides type safety and ensures that the catalog
 * can correctly manage favorites, search functionality, and movie interactions.
 *
 * @interface UnyFilmCatalogProps
 * @property {number[]} favorites - Array of movie indexes marked as favorites.
 * @property {(index: number) => void} toggleFavorite - Function to toggle the favorite state of a movie.
 * @property {(movie: MovieClickData) => void} onMovieClick - Callback triggered when a movie is clicked.
 * @property {string} searchQuery - Current search query used to filter movies in the catalog.
 */
export interface UnyFilmCatalogProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
  searchQuery: string;
}
