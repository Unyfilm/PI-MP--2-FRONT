
import { API_CONFIG } from '../config/environment';

const ENV_BASE = (API_CONFIG.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const ROOT_URL = ENV_BASE.replace(/\/api$/, '');

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const authHeaders = (): HeadersInit => ({
  ...defaultHeaders,
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});
/**
 * Interface for backend user data
 * @interface BackendUser
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

export interface BackendSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp?: string;
}

export interface BackendErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
  timestamp?: string;
}

export type BackendResponse<T> = BackendSuccessResponse<T> | BackendErrorResponse;

export interface LoginInput { email: string; password: string; }
export interface RegisterInput {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  edad?: string;
}

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
   * Register a new user
   * @param {RegisterInput} input - Registration input from UI
   * @returns {Promise<BackendResponse<AuthData>>} Auth payload on success
   */
  async register(input: RegisterInput) {
    const age = parseInt(input.edad || '0', 10);
    
    if (!input.email || !input.password || !input.nombres || !input.apellidos || !age || age < 13 || age > 120) {
      return {
        success: false,
        message: 'Email, contraseña, nombre, apellido y edad son requeridos',
        error: 'Validation error'
      } as BackendErrorResponse;
    }

    const payload = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      confirmPassword: input.password, // ← OBLIGATORIO: mismo valor que password
      firstName: input.nombres.trim(),
      lastName: input.apellidos.trim(),
      age: age  // debe ser NUMBER no string
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
