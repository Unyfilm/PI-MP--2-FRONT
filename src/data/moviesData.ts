// IDs reales de películas desde MongoDB
// =====================================

// IDs reales de películas desde la base de datos (9 películas disponibles)
export const movieIds = [
  "68fb2c610f34b66d0eb4d9c7",
  "68fb2c610f34b66d0eb4d9be",
  "68fb2c610f34b66d0eb4d9bf",
  "68fb2c610f34b66d0eb4d9c0",
  "68fb2c610f34b66d0eb4d9c1",
  "68fb2c610f34b66d0eb4d9c4",
  "68fb2c610f34b66d0eb4d9c2",
  "68fb2c610f34b66d0eb4d9c5",
  "68fb2c610f34b66d0eb4d9c6",
];

// Configuración para el carrusel y secciones
export const movieConfig = {
  featuredMovieId: "68fb2c610f34b66d0eb4d9c7",
};

// Configuración de secciones para el home con películas reales organizadas por categoría
export const homeSections = [
  {
    id: 'trending',
    title: 'En Tendencia',
    movieIds: [
      "68fb2c610f34b66d0eb4d9c7", // Superman
      "68fb2c610f34b66d0eb4d9be", // Mortal Kombat 2
      "68fb2c610f34b66d0eb4d9bf", // Tron Ares
    ]
  },
  {
    id: 'popular',
    title: 'Populares',
    movieIds: [
      "68fb2c610f34b66d0eb4d9c0", // Avatar - El Camino Del Agua
      "68fb2c610f34b66d0eb4d9c2", // Jujutsu Kaisen - Ejecucion
      "68fb2c610f34b66d0eb4d9c6", // Demon Slayer Kimetsu no Yaiba The Movie: Infinity Castle
    ]
  },
  {
    id: 'kids',
    title: 'Para toda la familia',
    movieIds: [
      "68fb2c610f34b66d0eb4d9c7", // Superman
      "68fb2c610f34b66d0eb4d9c0", // Avatar - El Camino Del Agua
      "68fb2c610f34b66d0eb4d9c6", // Demon Slayer Kimetsu no Yaiba The Movie: Infinity Castle
    ]
  },
  {
    id: 'action',
    title: 'Acción y Aventura',
    movieIds: [
      "68fb2c610f34b66d0eb4d9c7", // Superman
      "68fb2c610f34b66d0eb4d9be", // Mortal Kombat 2
      "68fb2c610f34b66d0eb4d9bf", // Tron Ares
      "68fb2c610f34b66d0eb4d9c4", // Depredador - Tierras Salvajes
    ]
  },
  {
    id: 'sci-fi',
    title: 'Ciencia Ficción',
    movieIds: [
      "68fb2c610f34b66d0eb4d9bf", // Tron Ares
      "68fb2c610f34b66d0eb4d9c0", // Avatar - El Camino Del Agua
      "68fb2c610f34b66d0eb4d9c1", // PRIMATE
    ]
  },
  {
    id: 'horror',
    title: 'Terror y Suspenso',
    movieIds: [
      "68fb2c610f34b66d0eb4d9c4", // Depredador - Tierras Salvajes
      "68fb2c610f34b66d0eb4d9c5", // Frankenstein (2025)
    ]
  }
];

export default movieIds;