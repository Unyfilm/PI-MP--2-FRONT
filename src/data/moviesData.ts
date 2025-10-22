// IDs reales de películas desde MongoDB
// =====================================

// IDs de películas reales de la base de datos (9 películas disponibles)
export const movieIds = [
  "68f84e9aba5b03d95f2d6ce1", // Superman (2025)
  "68f84e9aba5b03d95f2d6ce2", // Mortal Kombat 2
  "68f84e9aba5b03d95f2d6ce3", // Tron: Ares
  "68f84e9aba5b03d95f2d6ce4", // Avatar: El Origen del Agua
  "68f84e9aba5b03d95f2d6ce5", // Primate (2026)
  "68f84e9aba5b03d95f2d6ce6", // Depredador: Tierras Salvajes
  "68f84e9aba5b03d95f2d6ce7", // Jujutsu Kaisen: Execution
  "68f84e9aba5b03d95f2d6ce8", // Frankenstein (2025)
  "68f84e9aba5b03d95f2d6ce9", // Kimetsu no Yaiba: Castillo Infinito
];

// Configuración para el carrusel y secciones
export const movieConfig = {
  featuredMovieId: "68f84e9aba5b03d95f2d6ce1", // Superman (2025) como película destacada - ID REAL
};

// Configuración de secciones para el home con películas reales organizadas por categoría
export const homeSections = [
  {
    id: 'trending',
    title: 'En Tendencia',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce1", // Superman (2025)
      "68f84e9aba5b03d95f2d6ce2", // Mortal Kombat 2
      "68f84e9aba5b03d95f2d6ce3", // Tron: Ares
    ]
  },
  {
    id: 'popular',
    title: 'Populares',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce4", // Avatar: El Origen del Agua
      "68f84e9aba5b03d95f2d6ce7", // Jujutsu Kaisen: Execution
      "68f84e9aba5b03d95f2d6ce9", // Kimetsu no Yaiba: Castillo Infinito
    ]
  },
  {
    id: 'kids',
    title: 'Para toda la familia',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce1", // Superman (2025)
      "68f84e9aba5b03d95f2d6ce4", // Avatar: El Origen del Agua
      "68f84e9aba5b03d95f2d6ce9", // Kimetsu no Yaiba: Castillo Infinito
    ]
  },
  {
    id: 'action',
    title: 'Acción y Aventura',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce1", // Superman (2025)
      "68f84e9aba5b03d95f2d6ce2", // Mortal Kombat 2
      "68f84e9aba5b03d95f2d6ce3", // Tron: Ares
      "68f84e9aba5b03d95f2d6ce6", // Depredador: Tierras Salvajes
    ]
  },
  {
    id: 'sci-fi',
    title: 'Ciencia Ficción',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce3", // Tron: Ares
      "68f84e9aba5b03d95f2d6ce4", // Avatar: El Origen del Agua
      "68f84e9aba5b03d95f2d6ce5", // Primate (2026)
    ]
  },
  {
    id: 'horror',
    title: 'Terror y Suspenso',
    movieIds: [
      "68f84e9aba5b03d95f2d6ce6", // Depredador: Tierras Salvajes
      "68f84e9aba5b03d95f2d6ce8", // Frankenstein (2025)
    ]
  }
];

export default movieIds;