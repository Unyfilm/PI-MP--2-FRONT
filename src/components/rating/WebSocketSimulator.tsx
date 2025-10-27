import React, { useState } from 'react';
import { sendWebSocketEvent } from '../../services/websocketService';


const WebSocketSimulator: React.FC = () => {
  const [testMovieId, setTestMovieId] = useState('68f84e9aba5b03d95f2d6ce4');
  const [testRating, setTestRating] = useState(3);

  const handleSendRatingEvent = () => {
    console.log('📤 [WEBSOCKET SIMULATOR] Enviando evento de rating...');
    
    sendWebSocketEvent({
      type: 'rating-updated',
      movieId: testMovieId,
      data: {
        rating: testRating,
        action: 'create',
        movieTitle: 'Película de Prueba WebSocket',
        userId: 'websocket-test-user'
      },
      timestamp: Date.now()
    });
  };

  const handleSendStatsEvent = () => {
    console.log('📤 [WEBSOCKET SIMULATOR] Enviando evento de estadísticas...');
    
    sendWebSocketEvent({
      type: 'rating-stats-updated',
      movieId: testMovieId,
      data: {
        averageRating: testRating,
        totalRatings: Math.floor(Math.random() * 10) + 1
      },
      timestamp: Date.now()
    });
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>🌐 WebSocket Simulator</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Movie ID: </label>
        <input 
          type="text" 
          value={testMovieId} 
          onChange={(e) => setTestMovieId(e.target.value)}
          style={{ 
            width: '150px', 
            marginLeft: '5px',
            padding: '2px 4px',
            fontSize: '11px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Rating: </label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={testRating} 
          onChange={(e) => setTestRating(Number(e.target.value))}
          style={{ 
            width: '50px', 
            marginLeft: '5px',
            padding: '2px 4px',
            fontSize: '11px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleSendRatingEvent}
          style={{
            background: '#4ecdc4',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Enviar Rating
        </button>
        
        <button 
          onClick={handleSendStatsEvent}
          style={{
            background: '#45b7d1',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Enviar Stats
        </button>
      </div>
      
      <div style={{ color: '#888', fontSize: '10px', marginTop: '10px' }}>
        Envía eventos entre navegadores
      </div>
    </div>
  );
};

export default WebSocketSimulator;
