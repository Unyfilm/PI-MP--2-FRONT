/**
 * Production Favorites Context Configuration
 * 
 * Configuración específica para el contexto de favoritos en producción
 * que optimiza el rendimiento y manejo de errores.
 */

import { PRODUCTION_CONFIG } from '../config/production';

export const PRODUCTION_FAVORITES_CONFIG = {
  CACHE: {
    DURATION: PRODUCTION_CONFIG.FAVORITES.CACHE_DURATION,
    MAX_SIZE: PRODUCTION_CONFIG.FAVORITES.MAX_CACHE_SIZE,
    ENABLE_OFFLINE: PRODUCTION_CONFIG.FAVORITES.ENABLE_OFFLINE_MODE
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  },
  TIMEOUT: {
    REQUEST: 30000,
    CACHE: 30000
  },
  DEBUG: {
    ENABLE_LOGGING: false,
    LOG_LEVEL: 'error'
  }
};

export const FAVORITES_PRODUCTION_ERRORS = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  AUTH: 'No autorizado. Inicia sesión nuevamente.',
  SERVER: 'Error del servidor. Intenta más tarde.',
  VALIDATION: 'Datos inválidos. Verifica la información.',
  NOT_FOUND: 'Recurso no encontrado.',
  CONFLICT: 'El recurso ya existe.',
  RATE_LIMIT: 'Demasiadas peticiones. Espera un momento.',
  TIMEOUT: 'La petición tardó demasiado. Intenta nuevamente.'
};

export const FAVORITES_PRODUCTION_MESSAGES = {
  LOADING: 'Cargando favoritos...',
  SUCCESS_ADD: 'Película agregada a favoritos',
  SUCCESS_REMOVE: 'Película eliminada de favoritos',
  SUCCESS_UPDATE: 'Favorito actualizado',
  ERROR_ADD: 'Error al agregar a favoritos',
  ERROR_REMOVE: 'Error al eliminar de favoritos',
  ERROR_UPDATE: 'Error al actualizar favorito',
  ERROR_LOAD: 'Error al cargar favoritos'
};
