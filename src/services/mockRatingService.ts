/**
 * Servicio mock para simular datos de rating del backend
 * En desarrollo, este servicio intercepta las llamadas a ratingService
 * y devuelve datos simulados en lugar de hacer peticiones reales
 */

import type { RatingStats } from './ratingService';

// Cache de datos simulados
const mockDataCache = new Map<string, RatingStats>();

/**
 * Generar datos de rating simulados para una película
 */
const generateMockRatingStats = (movieId: string): RatingStats => {
  const averageRating = Math.random() * 2 + 3; // Entre 3 y 5
  const totalRatings = Math.floor(Math.random() * 100) + 5; // Entre 5 y 105
  
  return {
    movieId,
    averageRating: Number(averageRating.toFixed(1)),
    totalRatings,
    distribution: {
      '1': Math.floor(Math.random() * 5),
      '2': Math.floor(Math.random() * 10),
      '3': Math.floor(Math.random() * 15),
      '4': Math.floor(Math.random() * 20),
      '5': Math.floor(Math.random() * 25)
    }
  };
};

/**
 * Obtener estadísticas mock para una película
 */
export const getMockRatingStats = async (movieId: string): Promise<RatingStats> => {
  // Si ya tenemos datos en cache, devolverlos
  if (mockDataCache.has(movieId)) {
    return mockDataCache.get(movieId)!;
  }

  // Generar nuevos datos simulados
  const mockStats = generateMockRatingStats(movieId);
  mockDataCache.set(movieId, mockStats);
  
  console.log('🎭 [MOCK RATING] Generando estadísticas mock:', mockStats);
  return mockStats;
};

/**
 * Actualizar estadísticas mock cuando se recibe un evento
 */
export const updateMockRatingStats = (movieId: string, newRating: number, action: 'create' | 'update' | 'delete') => {
  const currentStats = mockDataCache.get(movieId);
  
  if (!currentStats) {
    // Si no hay datos, crear nuevos
    const newStats = generateMockRatingStats(movieId);
    newStats.averageRating = newRating;
    newStats.totalRatings = 1;
    mockDataCache.set(movieId, newStats);
    console.log('🎭 [MOCK RATING] Creando nuevas estadísticas:', newStats);
    return;
  }

  // Simular actualización de estadísticas
  let newTotalRatings = currentStats.totalRatings;
  let newAverageRating = currentStats.averageRating;

  if (action === 'create') {
    newTotalRatings += 1;
    // Calcular nuevo promedio
    const currentSum = currentStats.averageRating * currentStats.totalRatings;
    newAverageRating = (currentSum + newRating) / newTotalRatings;
  } else if (action === 'update') {
    // Para updates, mantener el total pero cambiar el promedio
    const currentSum = currentStats.averageRating * currentStats.totalRatings;
    newAverageRating = (currentSum - currentStats.averageRating + newRating) / newTotalRatings;
  } else if (action === 'delete') {
    newTotalRatings = Math.max(0, newTotalRatings - 1);
    if (newTotalRatings === 0) {
      newAverageRating = 0;
    } else {
      const currentSum = currentStats.averageRating * currentStats.totalRatings;
      newAverageRating = (currentSum - newRating) / newTotalRatings;
    }
  }

  const updatedStats: RatingStats = {
    ...currentStats,
    averageRating: Number(newAverageRating.toFixed(1)),
    totalRatings: newTotalRatings
  };

  mockDataCache.set(movieId, updatedStats);
  console.log('🎭 [MOCK RATING] Actualizando estadísticas:', updatedStats);
};

/**
 * Limpiar cache mock
 */
export const clearMockCache = () => {
  mockDataCache.clear();
  console.log('🎭 [MOCK RATING] Cache limpiado');
};
