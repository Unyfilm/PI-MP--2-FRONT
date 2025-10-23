import React, { useEffect, useState } from 'react';

interface DebugEvent {
  id: string;
  type: string;
  movieId: string;
  data: any;
  timestamp: number;
}

/**
 * Componente de debug para verificar eventos de rating
 * Solo se muestra en desarrollo
 */
const RatingDebugger: React.FC = () => {
  const [events, setEvents] = useState<DebugEvent[]>([]);

  useEffect(() => {
    const handleRatingUpdate = (event: CustomEvent) => {
      console.log('🐛 [DEBUG] Evento rating-updated recibido:', event.detail);
      setEvents(prev => [{
        id: `rating-${Date.now()}`,
        type: 'rating-updated',
        movieId: event.detail.movieId,
        data: event.detail,
        timestamp: Date.now()
      }, ...prev.slice(0, 9)]);
    };

    const handleStatsUpdate = (event: CustomEvent) => {
      console.log('🐛 [DEBUG] Evento rating-stats-updated recibido:', event.detail);
      setEvents(prev => [{
        id: `stats-${Date.now()}`,
        type: 'rating-stats-updated',
        movieId: event.detail.movieId,
        data: event.detail,
        timestamp: Date.now()
      }, ...prev.slice(0, 9)]);
    };

    window.addEventListener('rating-updated', handleRatingUpdate as EventListener);
    window.addEventListener('rating-stats-updated', handleStatsUpdate as EventListener);

    return () => {
      window.removeEventListener('rating-updated', handleRatingUpdate as EventListener);
      window.removeEventListener('rating-stats-updated', handleStatsUpdate as EventListener);
    };
  }, []);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>🐛 Rating Events Debug</h4>
      {events.length === 0 ? (
        <div style={{ color: '#888' }}>Esperando eventos...</div>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {events.map(event => (
            <div key={event.id} style={{ 
              marginBottom: '8px', 
              padding: '4px', 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              fontSize: '10px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#4ecdc4' }}>
                {event.type}
              </div>
              <div>Movie: {event.movieId}</div>
              <div>Rating: {event.data.averageRating || event.data.rating}</div>
              <div style={{ color: '#888', fontSize: '9px' }}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingDebugger;
