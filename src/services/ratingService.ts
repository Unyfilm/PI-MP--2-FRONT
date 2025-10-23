export interface Rating {
  movieId: string;
  userId: string;
  rating: number;
  createdAt?: Date;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  averageRating?: number;
  userRating?: number;
  totalRatings?: number;
}

class RatingService {
  private baseURL = 'http://localhost:5000/api';

  async rateMovie(movieId: string, rating: number): Promise<RatingResponse> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${this.baseURL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId, rating })
      });

      if (!response.ok) {
        throw new Error('Error al calificar la película');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rating movie:', error);
      throw error;
    }
  }

  async getUserRating(movieId: string): Promise<number | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${this.baseURL}/ratings/movie/${movieId}/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Error al obtener calificación');

      const data = await response.json();
      return data.rating || null;
    } catch (error) {
      console.error('Error getting user rating:', error);
      return null;
    }
  }

  async getAverageRating(movieId: string): Promise<{ average: number; count: number }> {
    try {
      const response = await fetch(`${this.baseURL}/ratings/movie/${movieId}/average`);
      
      if (!response.ok) {
        return { average: 0, count: 0 };
      }

      const data = await response.json();
      return data || { average: 0, count: 0 };
    } catch (error) {
      console.error('Error getting average rating:', error);
      return { average: 0, count: 0 };
    }
  }
}

export const ratingService = new RatingService();