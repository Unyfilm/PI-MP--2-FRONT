import React, { useEffect } from 'react';

/**
 * Componente para probar que los eventos se están emitiendo correctamente
 */
const EventTester: React.FC = () => {
  useEffect(() => {
    console.log('🧪 [EVENT TESTER] Iniciando test de eventos...');

    // Test 1: Emitir evento manual
    const testEvent = () => {
      console.log('🧪 [EVENT TESTER] Emitiendo evento de prueba...');
      
      // Emitir evento de prueba
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

      // Emitir evento de estadísticas
      window.dispatchEvent(new CustomEvent('rating-stats-updated', {
        detail: {
          movieId: 'test-movie-123',
          averageRating: 4.0,
          totalRatings: 1,
          timestamp: Date.now()
        }
      }));
    };

    // Test 2: Escuchar eventos
    const handleTestEvent = (event: CustomEvent) => {
      console.log('🧪 [EVENT TESTER] Evento recibido:', event.type, event.detail);
    };

    // Escuchar eventos
    window.addEventListener('rating-updated', handleTestEvent as EventListener);
    window.addEventListener('rating-stats-updated', handleTestEvent as EventListener);

    // Ejecutar test después de 2 segundos
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
