/**
 * Movie data constants and mock data for development.
 */

// Temporary inline types to fix import issues
interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  genre: string;
  rating: number;
  imageUrl: string;
  videoUrl: string;
  duration: number;
  director: string;
  cast: string[];
  ageRating: string;
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MovieCategory {
  id: string;
  name: string;
  description: string;
  movieCount: number;
}

/**
 * Mock movie data for development and testing.
 * Uses local images from the images folder.
 */
export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Peacemaker',
    description: 'A superhero action series following the adventures of Peacemaker, a vigilante who believes in achieving peace at any cost.',
    year: 2022,
    genre: 'Action',
    rating: 4.5,
    imageUrl: '/src/images/Peacemaker.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 45,
    director: 'James Gunn',
    cast: ['John Cena', 'Danielle Brooks', 'Freddie Stroma'],
    ageRating: 'TV-MA',
    isTrending: true,
    isFeatured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Peacemaker: Origins',
    description: 'The origin story of Peacemaker, exploring his early days and the events that shaped him into the hero he became.',
    year: 2022,
    genre: 'Action',
    rating: 4.3,
    imageUrl: '/src/images/Peacemaker2.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    duration: 50,
    director: 'James Gunn',
    cast: ['John Cena', 'Danielle Brooks', 'Freddie Stroma'],
    ageRating: 'TV-MA',
    isTrending: true,
    isFeatured: false,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    title: 'Peacemaker: Final Chapter',
    description: 'The epic conclusion of Peacemaker\'s journey, where he faces his greatest challenge yet.',
    year: 2022,
    genre: 'Action',
    rating: 4.7,
    imageUrl: '/src/images/Peacemaker3.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4',
    duration: 55,
    director: 'James Gunn',
    cast: ['John Cena', 'Danielle Brooks', 'Freddie Stroma'],
    ageRating: 'TV-MA',
    isTrending: true,
    isFeatured: false,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    title: 'Superman: Legacy',
    description: 'A modern retelling of Superman\'s origin story, focusing on his early days as a hero in Metropolis.',
    year: 2023,
    genre: 'Action',
    rating: 4.8,
    imageUrl: '/src/images/superman.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4',
    duration: 120,
    director: 'James Gunn',
    cast: ['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult'],
    ageRating: 'PG-13',
    isTrending: true,
    isFeatured: true,
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    title: 'Cura Mortal',
    description: 'A psychological thriller about a doctor who discovers a mysterious cure that comes with a deadly price.',
    year: 2023,
    genre: 'Thriller',
    rating: 4.2,
    imageUrl: '/src/images/curamortal.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    duration: 95,
    director: 'María González',
    cast: ['Ana García', 'Carlos Ruiz', 'Laura Martínez'],
    ageRating: 'R',
    isTrending: false,
    isFeatured: false,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '6',
    title: 'Desaparecidos',
    description: 'A gripping mystery about a detective investigating a series of disappearances in a small town.',
    year: 2023,
    genre: 'Mystery',
    rating: 4.4,
    imageUrl: '/src/images/desaparecidos.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_6mb.mp4',
    duration: 110,
    director: 'Pedro López',
    cast: ['Miguel Torres', 'Sofia Herrera', 'Diego Ramírez'],
    ageRating: 'TV-14',
    isTrending: false,
    isFeatured: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00Z'
  },
  {
    id: '7',
    title: 'Viaje a la Luna',
    description: 'A sci-fi adventure following a team of astronauts on their journey to establish the first lunar colony.',
    year: 2024,
    genre: 'Sci-Fi',
    rating: 4.6,
    imageUrl: '/src/images/viajealaluna.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4',
    duration: 130,
    director: 'Elena Vargas',
    cast: ['Roberto Silva', 'Carmen Díaz', 'Andrés Morales'],
    ageRating: 'PG-13',
    isTrending: true,
    isFeatured: false,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '8',
    title: 'Collage',
    description: 'An artistic drama exploring the interconnected lives of five strangers in a modern city.',
    year: 2024,
    genre: 'Drama',
    rating: 4.1,
    imageUrl: '/src/images/collage.jpg',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_8mb.mp4',
    duration: 105,
    director: 'Isabella Moreno',
    cast: ['Valentina Cruz', 'Sebastián Vega', 'Natalia Ríos'],
    ageRating: 'TV-MA',
    isTrending: false,
    isFeatured: false,
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  }
];

/**
 * Movie categories for filtering and organization.
 */
export const movieCategories: MovieCategory[] = [
  {
    id: '1',
    name: 'All Movies',
    description: 'All available movies',
    movieCount: mockMovies.length
  },
  {
    id: '2',
    name: 'Action',
    description: 'High-energy action movies',
    movieCount: mockMovies.filter(m => m.genre === 'Action').length
  },
  {
    id: '3',
    name: 'Thriller',
    description: 'Suspenseful and thrilling content',
    movieCount: mockMovies.filter(m => m.genre === 'Thriller').length
  },
  {
    id: '4',
    name: 'Mystery',
    description: 'Mysterious and puzzling stories',
    movieCount: mockMovies.filter(m => m.genre === 'Mystery').length
  },
  {
    id: '5',
    name: 'Sci-Fi',
    description: 'Science fiction adventures',
    movieCount: mockMovies.filter(m => m.genre === 'Sci-Fi').length
  },
  {
    id: '6',
    name: 'Drama',
    description: 'Emotional and character-driven stories',
    movieCount: mockMovies.filter(m => m.genre === 'Drama').length
  }
];

/**
 * Featured movies for the hero section.
 */
export const featuredMovies = mockMovies.filter(movie => movie.isFeatured);

/**
 * Trending movies for the trending section.
 */
export const trendingMovies = mockMovies.filter(movie => movie.isTrending);

/**
 * Get movies by genre.
 * 
 * @param genre - The genre to filter by
 * @returns Array of movies in the specified genre
 */
export const getMoviesByGenre = (genre: string): Movie[] => {
  if (genre === 'All Movies') {
    return mockMovies;
  }
  return mockMovies.filter(movie => movie.genre === genre);
};

/**
 * Search movies by title or description.
 * 
 * @param query - The search query
 * @returns Array of movies matching the search query
 */
export const searchMovies = (query: string): Movie[] => {
  if (!query.trim()) {
    return mockMovies;
  }
  
  const lowercaseQuery = query.toLowerCase();
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(lowercaseQuery) ||
    movie.description.toLowerCase().includes(lowercaseQuery) ||
    movie.director.toLowerCase().includes(lowercaseQuery) ||
    movie.cast.some(actor => actor.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Sort movies by different criteria.
 * 
 * @param movies - Array of movies to sort
 * @param sortBy - The field to sort by
 * @param sortOrder - The sort direction
 * @returns Sorted array of movies
 */
export const sortMovies = (
  movies: Movie[], 
  sortBy: 'title' | 'year' | 'rating' | 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Movie[] => {
  return [...movies].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};
