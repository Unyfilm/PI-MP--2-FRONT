import React, { useState, useEffect } from 'react';
import { useRealtimeRatings } from '../../hooks/useRealtimeRatings';

interface SimpleRatingTestProps {
  movieId: string;
  title: string;
}


const SimpleRatingTest: React.FC<SimpleRatingTestProps> = ({ movieId, title }) => {
  const { ratingStats, isLoading } = useRealtimeRatings({
    movieId,
    autoLoad: true,
    enableRealtime: true
  });

  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const handleEvent = () => {
      console.log('🎯 [SIMPLE TEST] Evento recibido para:', movieId);
      setEventCount(prev => prev + 1);
    };

    window.addEventListener('rating-updated', handleEvent as EventListener);
    window.addEventListener('rating-stats-updated', handleEvent as EventListener);

    return () => {
      window.removeEventListener('rating-updated', handleEvent as EventListener);
      window.removeEventListener('rating-stats-updated', handleEvent as EventListener);
    };
  }, [movieId]);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>🧪 Simple Test: {title}</h4>
      <div>Movie ID: {movieId}</div>
      <div>Loading: {isLoading ? 'Sí' : 'No'}</div>
      <div>Rating: {ratingStats?.averageRating?.toFixed(1) || 'N/A'}</div>
      <div>Total: {ratingStats?.totalRatings || 0}</div>
      <div>Events: {eventCount}</div>
      <div style={{ color: '#888', fontSize: '10px' }}>
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SimpleRatingTest;
