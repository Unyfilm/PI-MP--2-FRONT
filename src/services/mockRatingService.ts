

import type { RatingStats } from './ratingService';

const mockDataCache = new Map<string, RatingStats>();


const generateMockRatingStats = (movieId: string): RatingStats => {
  const averageRating = Math.random() * 2 + 3;
  const totalRatings = Math.floor(Math.random() * 100) + 5;
  
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


export const getMockRatingStats = async (movieId: string): Promise<RatingStats> => {
  if (mockDataCache.has(movieId)) {
    return mockDataCache.get(movieId)!;
  }
  const mockStats = generateMockRatingStats(movieId);
  mockDataCache.set(movieId, mockStats);
  
  console.log('🎭 [MOCK RATING] Generando estadísticas mock:', mockStats);
  return mockStats;
};


export const updateMockRatingStats = (movieId: string, newRating: number, action: 'create' | 'update' | 'delete') => {
  const currentStats = mockDataCache.get(movieId);
  
  if (!currentStats) {
    
    const newStats = generateMockRatingStats(movieId);
    newStats.averageRating = newRating;
    newStats.totalRatings = 1;
    mockDataCache.set(movieId, newStats);
    console.log('🎭 [MOCK RATING] Creando nuevas estadísticas:', newStats);
    return;
  }

 
  let newTotalRatings = currentStats.totalRatings;
  let newAverageRating = currentStats.averageRating;

  if (action === 'create') {
    newTotalRatings += 1;
    
    const currentSum = currentStats.averageRating * currentStats.totalRatings;
    newAverageRating = (currentSum + newRating) / newTotalRatings;
  } else if (action === 'update') {
    
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


export const clearMockCache = () => {
  mockDataCache.clear();
  console.log('🎭 [MOCK RATING] Cache limpiado');
};
