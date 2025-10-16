/**
 * API Service for UnyFilm
 * Mock implementation using localStorage for data persistence
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
  StorageKeys,
  ApiService
} from '../types';

// Base configuration
const API_CONFIG: ApiConfig = {
  BASE_URL: 'http://localhost:3000/api', // Mock backend URL
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

/**
 * Generic HTTP request handler
 * @param url - Request URL
 * @param options - Fetch options
 * @returns Response data
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
        'Authorization': `Bearer ${localStorage.getItem('unyfilm-token') || ''}`,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Mock implementation - return data from localStorage
    return mockApiCall<T>(url, options);
  }
};

/**
 * Mock API implementation using localStorage
 * @param url - Request URL
 * @param options - Request options
 * @returns Mock response data
 */
const mockApiCall = async <T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = options.method || 'GET';
  const endpoint = url.replace(API_CONFIG.BASE_URL, '');

  switch (endpoint) {
    case '/movies':
      return handleMoviesRequest(method, options) as Promise<ApiResponse<T>>;
    case '/users':
      return handleUsersRequest(method, options) as Promise<ApiResponse<T>>;
    case '/auth/login':
      return handleLoginRequest(options) as Promise<ApiResponse<T>>;
    case '/auth/register':
      return handleRegisterRequest(options) as Promise<ApiResponse<T>>;
    case '/auth/logout':
      return handleLogoutRequest() as Promise<ApiResponse<T>>;
    default:
      throw new Error('Endpoint not found');
  }
};

/**
 * Handle movies API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Movies data
 */
const handleMoviesRequest = async (method: string, options: RequestOptions): Promise<ApiResponse<Movie[] | Movie>> => {
  const movies: Movie[] = JSON.parse(localStorage.getItem('unyfilm-movies') || '[]');
  
  switch (method) {
    case 'GET':
      return {
        success: true,
        data: movies,
        total: movies.length
      } as ApiResponse<Movie[]>;
    
    case 'POST':
      const newMovie = JSON.parse(options.body || '{}') as Omit<Movie, 'id' | 'createdAt'>;
      const movieWithId: Movie = {
        ...newMovie,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      movies.push(movieWithId);
      localStorage.setItem('unyfilm-movies', JSON.stringify(movies));
      return {
        success: true,
        data: movieWithId
      } as ApiResponse<Movie>;
    
    case 'PUT':
      const updatedMovie = JSON.parse(options.body || '{}') as Movie;
      const movieIndex = movies.findIndex(m => m.id === updatedMovie.id);
      if (movieIndex !== -1) {
        movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
        localStorage.setItem('unyfilm-movies', JSON.stringify(movies));
        return {
          success: true,
          data: movies[movieIndex]
        } as ApiResponse<Movie>;
      }
      throw new Error('Movie not found');
    
    case 'DELETE':
      const movieId = JSON.parse(options.body || '{}').id;
      const filteredMovies = movies.filter(m => m.id !== movieId);
      localStorage.setItem('unyfilm-movies', JSON.stringify(filteredMovies));
      return {
        success: true,
        message: 'Movie deleted successfully'
      } as ApiResponse<void>;
    
    default:
      throw new Error('Method not allowed');
  }
};

/**
 * Handle users API requests
 * @param method - HTTP method
 * @param options - Request options
 * @returns Users data
 */
const handleUsersRequest = async (method: string, options: RequestOptions): Promise<ApiResponse<User[] | User>> => {
  const users: User[] = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
  switch (method) {
    case 'GET':
      return {
        success: true,
        data: users,
        total: users.length
      } as ApiResponse<User[]>;
    
    case 'POST':
      const newUser = JSON.parse(options.body || '{}') as Omit<User, 'id' | 'createdAt'>;
      const userWithId: User = {
        ...newUser,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      users.push(userWithId);
      localStorage.setItem('unyfilm-users', JSON.stringify(users));
      return {
        success: true,
        data: userWithId
      } as ApiResponse<User>;
    
    case 'PUT':
      const updatedUser = JSON.parse(options.body || '{}') as User;
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('unyfilm-users', JSON.stringify(users));
        return {
          success: true,
          data: users[userIndex]
        } as ApiResponse<User>;
      }
      throw new Error('User not found');
    
    case 'DELETE':
      const userId = JSON.parse(options.body || '{}').id;
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('unyfilm-users', JSON.stringify(filteredUsers));
      return {
        success: true,
        message: 'User deleted successfully'
      } as ApiResponse<void>;
    
    default:
      throw new Error('Method not allowed');
  }
};

/**
 * Handle login request
 * @param options - Request options
 * @returns Login response
 */
const handleLoginRequest = async (options: RequestOptions): Promise<ApiResponse<AuthResponse>> => {
  const { email, password }: LoginCredentials = JSON.parse(options.body || '{}');
  const users: User[] = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('unyfilm-token', token);
    localStorage.setItem('unyfilm-user', JSON.stringify(user));
    localStorage.setItem('unyfilm-logged-in', 'true');
    
    return {
      success: true,
      data: {
        user: { ...user, password: undefined },
        token
      }
    } as ApiResponse<AuthResponse>;
  }
  
  throw new Error('Invalid credentials');
};

/**
 * Handle register request
 * @param options - Request options
 * @returns Register response
 */
const handleRegisterRequest = async (options: RequestOptions): Promise<ApiResponse<AuthResponse>> => {
  const userData: RegisterData = JSON.parse(options.body || '{}');
  const users: User[] = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === userData.email)) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    ...userData,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('unyfilm-users', JSON.stringify(users));
  
  const token = `mock-token-${Date.now()}`;
  localStorage.setItem('unyfilm-token', token);
  localStorage.setItem('unyfilm-user', JSON.stringify(newUser));
  localStorage.setItem('unyfilm-logged-in', 'true');
  
  return {
    success: true,
    data: {
      user: { ...newUser, password: undefined },
      token
    }
  } as ApiResponse<AuthResponse>;
};

/**
 * Handle logout request
 * @returns Logout response
 */
const handleLogoutRequest = async (): Promise<ApiResponse<void>> => {
  localStorage.removeItem('unyfilm-token');
  localStorage.removeItem('unyfilm-user');
  localStorage.removeItem('unyfilm-logged-in');
  
  return {
    success: true,
    message: 'Logged out successfully'
  } as ApiResponse<void>;
};

// API Service Methods
export const apiService: ApiService = {
  // Movies API
  getMovies: (): Promise<ApiResponse<Movie[]>> => 
    makeRequest<Movie[]>(`${API_CONFIG.BASE_URL}/movies`),
  
  getMovie: (id: number): Promise<ApiResponse<Movie>> => 
    makeRequest<Movie>(`${API_CONFIG.BASE_URL}/movies/${id}`),
  
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
    makeRequest<User[]>(`${API_CONFIG.BASE_URL}/users`),
  
  getUser: (id: number): Promise<ApiResponse<User>> => 
    makeRequest<User>(`${API_CONFIG.BASE_URL}/users/${id}`),
  
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

  // Authentication API
  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => 
    makeRequest<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  register: (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => 
    makeRequest<AuthResponse>(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  logout: (): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/auth/logout`, {
      method: 'POST'
    }),
  
  recoverPassword: (email: string): Promise<ApiResponse<void>> => 
    makeRequest<void>(`${API_CONFIG.BASE_URL}/auth/recover`, {
      method: 'POST',
      body: JSON.stringify({ email })
    })
};

export default apiService;
