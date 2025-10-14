/**
 * Mock API service for development when backend is not available.
 * This service simulates API responses for frontend development.
 */

/**
 * Mock user data for development.
 */
const mockUsers = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    age: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'García',
    email: 'maria@example.com',
    age: 30,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Mock movie data for development.
 */
const mockMovies = [
  {
    id: '1',
    title: 'The Matrix',
    description: 'A computer hacker learns about the true nature of reality.',
    year: 1999,
    genre: 'Sci-Fi',
    rating: 8.7,
    imageUrl: 'https://via.placeholder.com/300x450?text=The+Matrix',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  },
  {
    id: '2',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 8.8,
    imageUrl: 'https://via.placeholder.com/300x450?text=Inception',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
  },
];

/**
 * Simulates network delay for realistic development experience.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API service that simulates backend responses.
 * 
 * @class MockApiService
 * @example
 * ```typescript
 * const mockApi = new MockApiService();
 * const users = await mockApi.get('/users');
 * ```
 */
export class MockApiService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  /**
   * Simulates a GET request with mock data.
   */
  async get<T>(endpoint: string): Promise<T> {
    await delay(500); // Simulate network delay

    if (endpoint === '/users') {
      return mockUsers as T;
    }
    
    if (endpoint === '/movies') {
      return mockMovies as T;
    }

    if (endpoint.startsWith('/users/')) {
      const id = endpoint.split('/')[2];
      const user = mockUsers.find(u => u.id === id);
      return user as T;
    }

    if (endpoint.startsWith('/movies/')) {
      const id = endpoint.split('/')[2];
      const movie = mockMovies.find(m => m.id === id);
      return movie as T;
    }

    throw new Error(`Mock API: Endpoint ${endpoint} not found`);
  }

  /**
   * Simulates a POST request with mock data.
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    await delay(800); // Simulate network delay

    if (endpoint === '/users') {
      const newUser = {
        id: String(mockUsers.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser as T;
    }

    if (endpoint === '/auth/login') {
      const { email, password } = data;
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        user,
        token: 'mock-jwt-token-' + Date.now(),
      } as T;
    }

    if (endpoint === '/auth/register') {
      const newUser = {
        id: String(mockUsers.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
      } as T;
    }

    throw new Error(`Mock API: POST endpoint ${endpoint} not implemented`);
  }

  /**
   * Simulates a PUT request with mock data.
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    await delay(600); // Simulate network delay

    if (endpoint.startsWith('/users/')) {
      const id = endpoint.split('/')[2];
      const userIndex = mockUsers.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      return mockUsers[userIndex] as T;
    }

    throw new Error(`Mock API: PUT endpoint ${endpoint} not implemented`);
  }

  /**
   * Simulates a DELETE request with mock data.
   */
  async delete<T>(endpoint: string): Promise<T> {
    await delay(400); // Simulate network delay

    if (endpoint.startsWith('/users/')) {
      const id = endpoint.split('/')[2];
      const userIndex = mockUsers.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUser = mockUsers.splice(userIndex, 1)[0];
      return deletedUser as T;
    }

    throw new Error(`Mock API: DELETE endpoint ${endpoint} not implemented`);
  }
}

/**
 * Default mock API service instance.
 */
export const mockApiService = new MockApiService();
