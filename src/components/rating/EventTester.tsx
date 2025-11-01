import React, { useEffect } from 'react';


const EventTester: React.FC = () => {
  useEffect(() => {
    const testEvent = () => {
      
      window.dispatchEvent(new CustomEvent('rating-updated', {
        detail: {
          movieId: 'test-movie-123',
          rating: 4,
          action: 'create',
          movieTitle: 'Película de Prueba',
          userId: 'test-user',
          timestamp: Date.now()
        }
      }));

      window.dispatchEvent(new CustomEvent('rating-stats-updated', {
        detail: {
          movieId: 'test-movie-123',
          averageRating: 4.0,
          totalRatings: 1,
          timestamp: Date.now()
        }
      }));
    };

    const handleTestEvent = (_event: CustomEvent) => {
    };

    window.addEventListener('rating-updated', handleTestEvent as EventListener);
    window.addEventListener('rating-stats-updated', handleTestEvent as EventListener);

    const timer = setTimeout(testEvent, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('rating-updated', handleTestEvent as EventListener);
      window.removeEventListener('rating-stats-updated', handleTestEvent as EventListener);
    };
  }, []);

  return null;
};

export default EventTester;
