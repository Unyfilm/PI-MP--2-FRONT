/**
 * Production Configuration for UnyFilm
 * 
 * Configuración específica para el entorno de producción
 * que asegura que los favoritos funcionen correctamente.
 */

export const PRODUCTION_CONFIG = {
  API: {
    BASE_URL: 'https://pi-mp-2-back-prod.onrender.com/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  FAVORITES: {
    CACHE_DURATION: 30000, // 30 segundos
    MAX_CACHE_SIZE: 100,
    ENABLE_OFFLINE_MODE: false
  },
  AUTH: {
    TOKEN_STORAGE_KEY: 'token',
    USER_STORAGE_KEY: 'user',
    SESSION_TIMEOUT: 3600000 // 1 hora
  },
  DEBUG: {
    ENABLE_LOGGING: false,
    ENABLE_PERFORMANCE_MONITORING: true,
    LOG_LEVEL: 'error'
  }
};

export const FAVORITES_ENDPOINTS = {
  GET_MY_FAVORITES: '/favorites/me',
  ADD_FAVORITE: '/favorites',
  REMOVE_FAVORITE: '/favorites',
  UPDATE_FAVORITE: '/favorites',
  GET_FAVORITE_BY_ID: '/favorites/me',
  GET_USER_FAVORITES: '/favorites',
  GET_FAVORITE_STATS: '/favorites/stats'
};

export const PRODUCTION_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  AUTH_ERROR: 'No autorizado. Inicia sesión nuevamente.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Datos inválidos. Verifica la información.',
  NOT_FOUND: 'Recurso no encontrado.',
  CONFLICT: 'El recurso ya existe.',
  RATE_LIMIT: 'Demasiadas peticiones. Espera un momento.'
};
