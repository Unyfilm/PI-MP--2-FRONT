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

const ENV_BASE = (ENV_API_CONFIG.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const ROOT_URL = ENV_BASE.replace(/\/api$/, '');

const API_CONFIG: ApiConfig = {
  BASE_URL: ROOT_URL,
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
 * Handle movies API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Movies data
 */

/**
 * Handle users API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Users data
 */

/**
 * Handle login request
 * @param options - Request options
 * @returns Login response
 */

/**
 * Handle register request
 * @param options - Request options
 * @returns Register response
 */

/**
 * Handle logout request
 * @returns Logout response
 */

export const apiService: ApiService = {
  getMovies: (): Promise<ApiResponse<Movie[]>> => 
    makeRequest<Movie[]>(`${API_CONFIG.BASE_URL}/api/movies`, { method: 'GET' }),
  
  getMovie: (id: number): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/api/movies/${id}`, { method: 'GET' }),
  
  createMovie: (movieData: Omit<Movie, 'id' | 'createdAt'>): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/api/movies`, {
      method: 'POST',
      body: JSON.stringify(movieData)
    }),
  
  updateMovie: (id: number, movieData: Partial<Movie>): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/api/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData)
    }),
  
  deleteMovie: (id: number): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/movies/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }),

  getUsers: (): Promise<ApiResponse<User[]>> => 
    makeRequest<User[]>(`${API_CONFIG.BASE_URL}/api/users`, { method: 'GET' }),
  
  getUser: (id: number): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/api/users/${id}`, { method: 'GET' }),
  
  createUser: (userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  updateUser: (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
  
  deleteUser: (id: number): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    }),

  getProfile: (): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/api/users/profile`, { method: 'GET' }),
  
  updateProfile: (profileData: { firstName: string; lastName: string; age: number; email: string }): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/api/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  deleteAccount: (password: string): Promise<ApiResponse<void>> => {
    return makeRequest<void>(`${API_CONFIG.BASE_URL}/api/users/account`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  },

  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
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
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ 
        token, 
        password: newPassword,  // El backend espera 'password', no 'newPassword'
        confirmPassword 
      })
    }),

  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    const fullUrl = `${API_CONFIG.BASE_URL}/api/users/change-password`;
    
    return makeRequest<void>(fullUrl, {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    });
  }
};

export default apiService;
