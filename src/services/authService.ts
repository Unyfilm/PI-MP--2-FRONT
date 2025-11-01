
/**
 * @file authService.ts
 * @description Authentication service that manages user login, registration, and logout.
 * Provides standardized backend request handling, error parsing, and localStorage session management.
 * 
 * This module serves as the primary interface between the frontend authentication logic
 * and the backend API endpoints under `/api/auth`.
 *
 * It supports both English and Spanish input fields for backward compatibility and
 * ensures consistent token persistence across browser reloads.
 * 
 * @module Services/AuthService
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import { API_CONFIG } from '../config/environment';

const ENV_BASE = (API_CONFIG.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const ROOT_URL = ENV_BASE.replace(/\/api$/, '');

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};


/**
 * Generates headers for authenticated requests by including
 * the stored Bearer token from localStorage.
 *
 * @function
 * @returns {HeadersInit} Headers including authorization token
 */
const authHeaders = (): HeadersInit => ({
  ...defaultHeaders,
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});
/**
 * Interface representing a backend user entity.
 * 
 * @interface BackendUser
 * @property {string} _id - Unique user identifier from the backend.
 * @property {string} username - System username.
 * @property {string} email - User's email address.
 * @property {string} [firstName] - User's first name.
 * @property {string} [lastName] - User's last name.
 * @property {number} [age] - User's age.
 * @property {string} [profilePicture] - URL of the user’s profile picture.
 * @property {string} [createdAt] - ISO date of creation.
 * @property {string} [updatedAt] - ISO date of last update.
 */
export interface BackendUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  profilePicture?: string;
  createdAt?: string;
  
  updatedAt?: string;
}
/**
 * Generic success response wrapper for backend API responses.
 * 
 * @template T
 * @interface BackendSuccessResponse
 * @property {true} success - Indicates success status.
 * @property {string} message - Human-readable message from backend.
 * @property {T} data - Payload data.
 * @property {string} [timestamp] - Optional timestamp of the response.
 */
export interface BackendSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp?: string;
}
/**
 * Generic error response wrapper for backend API responses.
 * 
 * @interface BackendErrorResponse
 * @property {false} success - Indicates error status.
 * @property {string} message - Error message.
 * @property {string} [error] - Technical error code or description.
 * @property {unknown} [details] - Additional error details.
 * @property {string} [timestamp] - Optional timestamp of the error.
 */
export interface BackendErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
  timestamp?: string;
}

/**
 * Union type representing either a success or an error response from the backend.
 * 
 * @template T
 */
export type BackendResponse<T> = BackendSuccessResponse<T> | BackendErrorResponse;

/**
 * Input credentials for login.
 * 
 * @interface LoginInput
 * @property {string} email - User email.
 * @property {string} password - User password.
 */
export interface LoginInput { email: string; password: string; }
/**
 * Registration input accepted by the UI layer.
 * English fields are preferred; Spanish legacy fields are accepted
 * for backward compatibility and will be normalized.
 */
export interface RegisterInput {

  firstName?: string;
  lastName?: string;
  age?: string | number;

  nombres?: string;
  apellidos?: string;
  edad?: string;
  email: string;
  password: string;
}
/**
 * Authentication payload returned upon successful login or registration.
 * 
 * @interface AuthData
 * @property {BackendUser} user - User profile data.
 * @property {string} token - JWT authentication token.
 */
export interface AuthData { user: BackendUser; token: string; }

/**
 * Parse a fetch Response into JSON when possible, otherwise
 * return a generic error wrapper preserving the HTTP message.
 *
 * @template T - Expected success payload type
 * @param {Response} res - Fetch response
 * @returns {Promise<BackendResponse<T>>} Parsed backend response
 */
const handleJson = async <T>(res: Response): Promise<BackendResponse<T>> => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  return { success: false, message: text || `HTTP ${res.status}`, error: text } as BackendErrorResponse;
};

/**
 * Perform a typed HTTP request against the backend with timeout and
 * unified error handling.
 *
 * @template T - Expected success payload type
 * @param {string} path - API path beginning with /api
 * @param {RequestInit} [init] - Fetch init options
 * @returns {Promise<BackendResponse<T>>} Backend response wrapper
 */
const request = async <T>(path: string, init?: RequestInit): Promise<BackendResponse<T>> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(import.meta.env.VITE_API_TIMEOUT) || 30000);
  try {
    const res = await fetch(`${ROOT_URL}${path}`, { ...init, signal: controller.signal });
    const data = await handleJson<T>(res);
    clearTimeout(timeout);
    return data;
  } catch (err: any) {
    clearTimeout(timeout);
    return { success: false, message: 'Error de red', error: err?.message || String(err) } as BackendErrorResponse;
  }
};

export const authService = {
  /**
   * Login with email and password
   * @param {LoginInput} input - Credentials { email, password }
   * @returns {Promise<BackendResponse<AuthData>>} Auth payload on success
   */
  async login(input: LoginInput) {
    const res = await request<AuthData>('/api/auth/login', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email: input.email, password: input.password })
    });
    if (res.success) {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('unyfilm-token', token);
      localStorage.setItem('auth:user', JSON.stringify(user));
      localStorage.setItem('unyfilm-logged-in', 'true');
    }
    return res;
  },

  /**
   * Register a new user, normalizing both English and Spanish field names.
   * @param {RegisterInput} input - Registration input from UI
   * @returns {Promise<BackendResponse<AuthData>>} Auth payload on success
   */
  async register(input: RegisterInput) {
    const firstName = (input.firstName ?? input.nombres ?? '').toString().trim();
    const lastName = (input.lastName ?? input.apellidos ?? '').toString().trim();
    const ageRaw = input.age ?? input.edad ?? '';
    const ageNum = typeof ageRaw === 'number' ? ageRaw : parseInt((ageRaw as string) || '0', 10);

    if (!input.email || !input.password || !firstName || !lastName || !ageNum || ageNum < 13 || ageNum > 120) {
      return {
        success: false,
        message: 'Email, contraseña, nombre, apellido y edad son requeridos',
        error: 'Validation error'
      } as BackendErrorResponse;
    }

    const payload = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      confirmPassword: input.password,
      firstName,
      lastName,
      age: ageNum
    };

    const res = await request<AuthData>('/api/auth/register', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });
    if (res.success) {
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('unyfilm-token', token);
      localStorage.setItem('auth:user', JSON.stringify(user));
      localStorage.setItem('unyfilm-logged-in', 'true');
    }
    return res;
  },

  /**
   * Logout current user and invalidate token server-side
   * @returns {Promise<BackendResponse<void>>} Result of the logout request
   */
  async logout() {
    const res = await request<void>('/api/auth/logout', {
      method: 'POST',
      headers: authHeaders()
    });
    localStorage.removeItem('token');
    localStorage.removeItem('unyfilm-token');
    localStorage.removeItem('auth:user');
    localStorage.removeItem('unyfilm-logged-in');
    return res;
  },

  authHeaders
};

export default authService;
