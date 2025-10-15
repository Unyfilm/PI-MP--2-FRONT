/**
 * API Service for UnyFilm
 * Mock implementation using localStorage for data persistence
 * @fileoverview Centralized API service with HTTP methods
 */

// Base configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Mock backend URL
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

/**
 * Generic HTTP request handler
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
const makeRequest = async (url, options = {}) => {
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
    return mockApiCall(url, options);
  }
};

/**
 * Mock API implementation using localStorage
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {Promise} Mock response data
 */
const mockApiCall = async (url, options) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = options.method || 'GET';
  const endpoint = url.replace(API_CONFIG.BASE_URL, '');

  switch (endpoint) {
    case '/movies':
      return handleMoviesRequest(method, options);
    case '/users':
      return handleUsersRequest(method, options);
    case '/auth/login':
      return handleLoginRequest(options);
    case '/auth/register':
      return handleRegisterRequest(options);
    case '/auth/logout':
      return handleLogoutRequest();
    default:
      throw new Error('Endpoint not found');
  }
};

/**
 * Handle movies API requests
 * @param {string} method - HTTP method
 * @param {Object} options - Request options
 * @returns {Promise} Movies data
 */
const handleMoviesRequest = async (method, options) => {
  const movies = JSON.parse(localStorage.getItem('unyfilm-movies') || '[]');
  
  switch (method) {
    case 'GET':
      return {
        success: true,
        data: movies,
        total: movies.length
      };
    
    case 'POST':
      const newMovie = JSON.parse(options.body);
      const movieWithId = {
        ...newMovie,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      movies.push(movieWithId);
      localStorage.setItem('unyfilm-movies', JSON.stringify(movies));
      return {
        success: true,
        data: movieWithId
      };
    
    case 'PUT':
      const updatedMovie = JSON.parse(options.body);
      const movieIndex = movies.findIndex(m => m.id === updatedMovie.id);
      if (movieIndex !== -1) {
        movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
        localStorage.setItem('unyfilm-movies', JSON.stringify(movies));
        return {
          success: true,
          data: movies[movieIndex]
        };
      }
      throw new Error('Movie not found');
    
    case 'DELETE':
      const movieId = JSON.parse(options.body).id;
      const filteredMovies = movies.filter(m => m.id !== movieId);
      localStorage.setItem('unyfilm-movies', JSON.stringify(filteredMovies));
      return {
        success: true,
        message: 'Movie deleted successfully'
      };
    
    default:
      throw new Error('Method not allowed');
  }
};

/**
 * Handle users API requests
 * @param {string} method - HTTP method
 * @param {Object} options - Request options
 * @returns {Promise} Users data
 */
const handleUsersRequest = async (method, options) => {
  const users = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
  switch (method) {
    case 'GET':
      return {
        success: true,
        data: users,
        total: users.length
      };
    
    case 'POST':
      const newUser = JSON.parse(options.body);
      const userWithId = {
        ...newUser,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      users.push(userWithId);
      localStorage.setItem('unyfilm-users', JSON.stringify(users));
      return {
        success: true,
        data: userWithId
      };
    
    case 'PUT':
      const updatedUser = JSON.parse(options.body);
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('unyfilm-users', JSON.stringify(users));
        return {
          success: true,
          data: users[userIndex]
        };
      }
      throw new Error('User not found');
    
    case 'DELETE':
      const userId = JSON.parse(options.body).id;
      const filteredUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('unyfilm-users', JSON.stringify(filteredUsers));
      return {
        success: true,
        message: 'User deleted successfully'
      };
    
    default:
      throw new Error('Method not allowed');
  }
};

/**
 * Handle login request
 * @param {Object} options - Request options
 * @returns {Promise} Login response
 */
const handleLoginRequest = async (options) => {
  const { email, password } = JSON.parse(options.body);
  const users = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
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
    };
  }
  
  throw new Error('Invalid credentials');
};

/**
 * Handle register request
 * @param {Object} options - Request options
 * @returns {Promise} Register response
 */
const handleRegisterRequest = async (options) => {
  const userData = JSON.parse(options.body);
  const users = JSON.parse(localStorage.getItem('unyfilm-users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === userData.email)) {
    throw new Error('User already exists');
  }
  
  const newUser = {
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
  };
};

/**
 * Handle logout request
 * @returns {Promise} Logout response
 */
const handleLogoutRequest = async () => {
  localStorage.removeItem('unyfilm-token');
  localStorage.removeItem('unyfilm-user');
  localStorage.removeItem('unyfilm-logged-in');
  
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

// API Service Methods
export const apiService = {
  // Movies API
  getMovies: () => makeRequest(`${API_CONFIG.BASE_URL}/movies`),
  getMovie: (id) => makeRequest(`${API_CONFIG.BASE_URL}/movies/${id}`),
  createMovie: (movieData) => makeRequest(`${API_CONFIG.BASE_URL}/movies`, {
    method: 'POST',
    body: JSON.stringify(movieData)
  }),
  updateMovie: (id, movieData) => makeRequest(`${API_CONFIG.BASE_URL}/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData)
  }),
  deleteMovie: (id) => makeRequest(`${API_CONFIG.BASE_URL}/movies/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  }),

  // Users API
  getUsers: () => makeRequest(`${API_CONFIG.BASE_URL}/users`),
  getUser: (id) => makeRequest(`${API_CONFIG.BASE_URL}/users/${id}`),
  createUser: (userData) => makeRequest(`${API_CONFIG.BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  updateUser: (id, userData) => makeRequest(`${API_CONFIG.BASE_URL}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  deleteUser: (id) => makeRequest(`${API_CONFIG.BASE_URL}/users/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  }),

  // Authentication API
  login: (credentials) => makeRequest(`${API_CONFIG.BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => makeRequest(`${API_CONFIG.BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  logout: () => makeRequest(`${API_CONFIG.BASE_URL}/auth/logout`, {
    method: 'POST'
  }),
  recoverPassword: (email) => makeRequest(`${API_CONFIG.BASE_URL}/auth/recover`, {
    method: 'POST',
    body: JSON.stringify({ email })
  })
};

export default apiService;
