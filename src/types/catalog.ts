/**
 * Interface for movie click data in catalog
 * @interface MovieClickData
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
}

/**
 * Interface for UnyFilm catalog component props
 * @interface UnyFilmCatalogProps
 */
export interface UnyFilmCatalogProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
  searchQuery: string;
}
