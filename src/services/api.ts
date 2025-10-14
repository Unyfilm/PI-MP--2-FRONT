/**
 * API service for handling HTTP requests to the backend.
 * Uses the Fetch API exclusively as required by the project specifications.
 */

/**
 * Configuration interface for API requests.
 */
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Default API configuration using environment variables.
 */
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Check if we should use mock API for development.
 */
const shouldUseMockApi = (): boolean => {
  return import.meta.env.VITE_NODE_ENV === 'development' && 
         import.meta.env.VITE_ENABLE_DEBUG === 'true';
};

/**
 * HTTP methods supported by the API service.
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Request options interface for API calls.
 */
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

/**
 * API response interface for consistent response handling.
 */
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

/**
 * API error class for handling HTTP errors.
 */
class ApiError extends Error {
  public status: number;
  public response?: Response;

  constructor(message: string, status: number, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Main API service class for handling HTTP requests.
 * 
 * @class ApiService
 * @example
 * ```typescript
 * const api = new ApiService();
 * const users = await api.get('/users');
 * const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });
 * ```
 */
export class ApiService {
  private config: ApiConfig;

  /**
   * Creates an instance of ApiService.
   * 
   * @param {Partial<ApiConfig>} config - Optional configuration override.
   */
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Makes an HTTP request with the specified options.
   * 
   * @private
   * @param {string} endpoint - The API endpoint to call.
   * @param {RequestOptions} options - Request configuration options.
   * @returns {Promise<ApiResponse>} The API response.
   * @throws {ApiError} When the request fails or times out.
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    // Set up timeout
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);
    
    try {
      const response = await fetch(url, {
        method: options.method,
        headers: { ...this.config.headers, ...options.headers },
        body: options.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        success: true,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  /**
   * Performs a GET request.
   * 
   * @param {string} endpoint - The API endpoint.
   * @param {Record<string, string>} headers - Optional headers.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Performs a POST request.
   * 
   * @param {string} endpoint - The API endpoint.
   * @param {any} data - The data to send.
   * @param {Record<string, string>} headers - Optional headers.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * Performs a PUT request.
   * 
   * @param {string} endpoint - The API endpoint.
   * @param {any} data - The data to send.
   * @param {Record<string, string>} headers - Optional headers.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * Performs a DELETE request.
   * 
   * @param {string} endpoint - The API endpoint.
   * @param {Record<string, string>} headers - Optional headers.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

/**
 * Default API service instance.
 * Use this for most API calls throughout the application.
 */
export const apiService = new ApiService();

/**
 * Export the ApiError class for error handling.
 */
export { ApiError };
