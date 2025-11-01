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
 * API configuration for the Comment Service
 * @constant {Object} API_CONFIG
 */
const API_CONFIG = {
  BASE_URL: ROOT_URL,
  TIMEOUT: ENV_API_CONFIG.TIMEOUT || 10000,
  RETRY_ATTEMPTS: ENV_API_CONFIG.RETRY_ATTEMPTS || 3
};

/**
 * Utility function to perform HTTP requests with error handling and timeout.
 * Automatically includes authentication headers and handles JSON responses.
 * 
 * @async
 * @function makeRequest
 * @template T - Expected response data type
 * @param {string} url - Request URL
 * @param {RequestInit} [options={}] - Additional request options
 * @returns {Promise<ApiResponse<T>>} Typed API response
 * 
 * @description
 * - Sets up an automatic timeout
 * - Includes authentication token from localStorage
 * - Handles JSON and plain text responses
 * - Provides consistent error handling
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
 * Comment Service
 * @constant {CommentService} commentService
 * @description
 * Service to manage CRUD operations for comments.
 * Implements the CommentService interface with methods to create, read,
 * update, and delete comments.
 * 
 * @author
 *  - Hernan Garcia  
 *  - Juan Camilo Jimenez  
 *  - Julieta Arteta  
 *  - Jerson Otero  
 *  - Julian Mosquera
 */
export const commentService: CommentService = {
  /**
   * Creates a new comment for a specific movie.
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
   * Retrieves comments for a specific movie with pagination.
   * 
   * @async
   * @function getCommentsByMovie
   * @param {string} movieId - ID of the movie
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Number of comments per page
   * @returns {Promise<ApiResponse<CommentPaginationResponse>>} Response with paginated comments
   */
  getCommentsByMovie: (movieId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CommentPaginationResponse>> => 
    makeRequest<CommentPaginationResponse>(`${API_CONFIG.BASE_URL}/api/comments/public/movie/${movieId}?page=${page}&limit=${limit}`, {
      method: 'GET'
    }),

  /**
   * Retrieves comments made by the authenticated user with pagination.
   * 
   * @async
   * @function getMyComments
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Number of comments per page
   * @returns {Promise<ApiResponse<CommentPaginationResponse>>} Respuesta con comentarios del usuario
   */
  getMyComments: (page: number = 1, limit: number = 10): Promise<ApiResponse<CommentPaginationResponse>> => 
    makeRequest<CommentPaginationResponse>(`${API_CONFIG.BASE_URL}/api/comments/me?page=${page}&limit=${limit}`, {
      method: 'GET'
    }),

  /**
   * Updates the content of an existing comment.
   * 
   * @async
   * @function updateComment
   * @param {string} commentId - ID of the comment to update
   * @param {UpdateCommentData} data - New comment data
   * @returns {Promise<ApiResponse<Comment>>} Response with the updated comment
   */
  updateComment: (commentId: string, data: UpdateCommentData): Promise<ApiResponse<Comment>> => 
    makeRequest<Comment>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /**
   * Deletes a specific comment.
   * 
   * @async
   * @function deleteComment
   * @param {string} commentId - ID of the comment to delete
   * @returns {Promise<ApiResponse<void>>} Response confirming deletion
   */
  deleteComment: (commentId: string): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'DELETE'
    }),

  /**
   * Retrieves a specific comment by its ID.
   * 
   * @async
   * @function getComment
   * @param {string} commentId - ID of the comment
   * @returns {Promise<ApiResponse<Comment>>} Response with the requested comment
   */
  getComment: (commentId: string): Promise<ApiResponse<Comment>> => 
    makeRequest<Comment>(`${API_CONFIG.BASE_URL}/api/comments/${commentId}`, {
      method: 'GET'
    })
};

export default commentService;
