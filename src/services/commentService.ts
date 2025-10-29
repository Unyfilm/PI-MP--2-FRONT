import type { 
  Comment, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentPaginationResponse, 
  CommentService,
  ApiResponse 
} from '../types';
import { API_CONFIG as ENV_API_CONFIG } from '../config/environment';

const ENV_BASE = (ENV_API_CONFIG.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const ROOT_URL = ENV_BASE.replace(/\/api$/, '');

/**
 * Configuración de la API para el servicio de comentarios
 * @constant {Object} API_CONFIG
 */
const API_CONFIG = {
  BASE_URL: ROOT_URL,
  TIMEOUT: ENV_API_CONFIG.TIMEOUT || 10000,
  RETRY_ATTEMPTS: ENV_API_CONFIG.RETRY_ATTEMPTS || 3
};

/**
 * Función utilitaria para realizar peticiones HTTP con manejo de errores y timeout.
 * Incluye autenticación automática y manejo de respuestas JSON.
 * 
 * @async
 * @function makeRequest
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} url - URL de la petición
 * @param {RequestInit} options - Opciones adicionales para la petición
 * @returns {Promise<ApiResponse<T>>} Respuesta de la API con tipado genérico
 * 
 * @description
 * - Configura timeout automático
 * - Incluye token de autenticación del localStorage
 * - Maneja respuestas JSON y de texto
 * - Proporciona manejo consistente de errores
 */
const makeRequest = async <T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('unyfilm-token') || '';

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const json = contentType.includes('application/json') ? await response.json() : { message: await response.text() };

    if (!response.ok) {
      return {
        success: false,
        message: json?.message || `HTTP ${response.status}`,
        error: json?.error
      } as ApiResponse<T>;
    }

    return json as ApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Error de red',
      error: (error as any)?.message || String(error)
    } as ApiResponse<T>;
  }
};

/**
 * Servicio para gestionar operaciones CRUD de comentarios.
 * Implementa la interfaz CommentService con métodos para crear, leer, actualizar y eliminar comentarios.
 * 
 * @constant {CommentService} commentService
 */
export const commentService: CommentService = {
  /**
   * Crea un nuevo comentario para una película específica.
   * 
   * @async
   * @function createComment
   * @param {CreateCommentData} data - Datos del comentario a crear
   * @returns {Promise<ApiResponse<Comment>>} Respuesta con el comentario creado
   */
  createComment: (data: CreateCommentData): Promise<ApiResponse<Comment>> => 
    makeRequest<Comment>(`${API_CONFIG.BASE_URL}/api/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  /**
   * Obtiene comentarios públicos de una película específica con paginación.
   * 
   * @async
   * @function getCommentsByMovie
   * @param {string} movieId - ID de la película
   * @param {number} [page=1] - Número de página
   * @param {number} [limit=10] - Cantidad de comentarios por página
   * @returns {Promise<ApiResponse<CommentPaginationResponse>>} Respuesta con comentarios paginados
   */
  getCommentsByMovie: (movieId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CommentPaginationResponse>> => 
    makeRequest<CommentPaginationResponse>(`${API_CONFIG.BASE_URL}/api/comments/public/movie/${movieId}?page=${page}&limit=${limit}`, {
      method: 'GET'
    }),

  /**
   * Obtiene los comentarios del usuario autenticado con paginación.
   * 
   * @async
   * @function getMyComments
   * @param {number} [page=1] - Número de página
   * @param {number} [limit=10] - Cantidad de comentarios por página
   * @returns {Promise<ApiResponse<CommentPaginationResponse>>} Respuesta con comentarios del usuario
   */
  getMyComments: (page: number = 1, limit: number = 10): Promise<ApiResponse<CommentPaginationResponse>> => 
    makeRequest<CommentPaginationResponse>(`${API_CONFIG.BASE_URL}/api/comments/me?page=${page}&limit=${limit}`, {
      method: 'GET'
    }),

  /**
   * Actualiza el contenido de un comentario existente.
   * 
   * @async
   * @function updateComment
   * @param {string} commentId - ID del comentario a actualizar
   * @param {UpdateCommentData} data - Nuevos datos del comentario
   * @returns {Promise<ApiResponse<Comment>>} Respuesta con el comentario actualizado
   */
  updateComment: (commentId: string, data: UpdateCommentData): Promise<ApiResponse<Comment>> => 
    makeRequest<Comment>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /**
   * Elimina un comentario específico.
   * 
   * @async
   * @function deleteComment
   * @param {string} commentId - ID del comentario a eliminar
   * @returns {Promise<ApiResponse<void>>} Respuesta de confirmación de eliminación
   */
  deleteComment: (commentId: string): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'DELETE'
    }),

  /**
   * Obtiene un comentario específico por su ID.
   * 
   * @async
   * @function getComment
   * @param {string} commentId - ID del comentario
   * @returns {Promise<ApiResponse<Comment>>} Respuesta con el comentario solicitado
   */
  getComment: (commentId: string): Promise<ApiResponse<Comment>> => 
    makeRequest<Comment>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'GET'
    })
};

export default commentService;
