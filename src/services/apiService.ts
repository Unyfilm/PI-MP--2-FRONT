/**
 * ApiService (frontend)
 *
 * Centralized HTTP client for UnyFilm that integrates with the real backend
 * for movies and users. Authentication is delegated to authService.
 *
 * Conventions:
 * - camelCase for functions and variables
 * - PascalCase for exported interfaces and types
 * - Descriptive names for readability
 *
 * @fileoverview Centralized API service with HTTP methods and TypeScript types
 */

import type { 
  ApiConfig, 
  ApiResponse, 
  User, 
  Movie, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  RequestOptions, 
  ApiService
} from '../types';
import { API_CONFIG as ENV_API_CONFIG } from '../config/environment';
import { authService } from './authService';

// Base configuration desde environment
const API_CONFIG: ApiConfig = {
  // Usar la BASE_URL tal cual viene del environment (debería incluir /api)
  BASE_URL: (ENV_API_CONFIG.BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000/api'),
  TIMEOUT: ENV_API_CONFIG.TIMEOUT || 10000,
  RETRY_ATTEMPTS: ENV_API_CONFIG.RETRY_ATTEMPTS || 3
};

/**
 * makeRequest
 *
 * Generic HTTP request handler adding JSON headers, authorization token,
 * timeout via AbortController and unified JSON parsing.
 *
 * @template T - Expected payload type
 * @param {string} url - Request URL
 * @param {RequestOptions} [options] - Fetch options
 * @returns {Promise<ApiResponse<T>>} Typed API response
 */
const makeRequest = async <T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('unyfilm-token') || ''}`,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const json = contentType.includes('application/json') ? await response.json() : { message: await response.text() };

    console.log('[API] Response status:', response.status, 'Response:', json);

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

// Eliminado: mockApiCall y handlers mock. Ahora usamos backend real.

/**
 * Handle movies API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Movies data
 */
// Nota: se removieron handlers locales de movies/users para no mantener dos fuentes de verdad.

/**
 * Handle users API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Users data
 */
// --

/**
 * Handle login request
 * @param options - Request options
 * @returns Login response
 */
// Auth se maneja en authService

/**
 * Handle register request
 * @param options - Request options
 * @returns Register response
 */
// --

/**
 * Handle logout request
 * @returns Logout response
 */
// --

// API Service Methods
export const apiService: ApiService = {
  // Movies API
  getMovies: (): Promise<ApiResponse<Movie[]>> => 
    makeRequest<Movie[]>(`${API_CONFIG.BASE_URL}/movies`, { method: 'GET' }),
  
  getMovie: (id: number): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/movies/${id}`, { method: 'GET' }),
  
  createMovie: (movieData: Omit<Movie, 'id' | 'createdAt'>): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/movies`, {
      method: 'POST',
      body: JSON.stringify(movieData)
    }),
  
  updateMovie: (id: number, movieData: Partial<Movie>): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData)
    }),
  
  deleteMovie: (id: number): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }),

  // Users API
  getUsers: (): Promise<ApiResponse<User[]>> => 
    makeRequest<User[]>(`${API_CONFIG.BASE_URL}/users`, { method: 'GET' }),
  
  getUser: (id: number): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users/${id}`, { method: 'GET' }),
  
  createUser: (userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  updateUser: (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
  
  deleteUser: (id: number): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }),

  // Profile API
  getProfile: (): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users/profile`, { method: 'GET' }),
  
  updateProfile: (profileData: { firstName: string; lastName: string; age: number; email: string }): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  deleteAccount: (password: string): Promise<ApiResponse<void>> => {
    console.log('[API] Calling delete account endpoint with password length:', password.length);
    return makeRequest<void>(`${API_CONFIG.BASE_URL}/users/account`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  },

  // Authentication API
  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    // Delegar a authService para mapear correctamente y persistir token
    return authService.login({ email: credentials.email, password: credentials.password }) as unknown as Promise<ApiResponse<AuthResponse>>;
  },
  
  register: (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return authService.register({
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      email: userData.email,
      password: userData.password,
      edad: userData.edad
    }) as unknown as Promise<ApiResponse<AuthResponse>>;
  },
  
  logout: (): Promise<ApiResponse<void>> => {
    return authService.logout() as unknown as Promise<ApiResponse<void>>;
  },
  
  recoverPassword: (email: string): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email })
    })
};

export default apiService;
