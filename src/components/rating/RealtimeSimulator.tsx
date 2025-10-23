import React, { useState } from 'react';
import { mockRealtimeServer, simulateRatingEvent, simulateStatsEvent } from '../../services/mockRealtimeServer';

/**
 * Simulador de eventos en tiempo real para testing
 * Solo se muestra en desarrollo
 */
const RealtimeSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testMovieId, setTestMovieId] = useState('68f84e9aba5b03d95f2d6ce4');
  const [testRating, setTestRating] = useState(3);

  const handleStartRandomEvents = () => {
    if (isRunning) {
      mockRealtimeServer.stopRandomEvents();
      setIsRunning(false);
    } else {
      mockRealtimeServer.startRandomEvents();
      setIsRunning(true);
    }
  };

  const handleSimulateEvent = () => {
    console.log('🎭 [SIMULATOR] Simulando evento manual...');
    simulateRatingEvent(testMovieId, testRating, 'create');
    
    // Simular estadísticas después de un delay
    setTimeout(() => {
      simulateStatsEvent(testMovieId, testRating, Math.floor(Math.random() * 10) + 1);
    }, 500);
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>🎭 Simulador Tiempo Real</h4>
      
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
          onClick={handleSimulateEvent}
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
          Simular Evento
        </button>
        
        <button 
          onClick={handleStartRandomEvents}
          style={{
            background: isRunning ? '#e74c3c' : '#45b7d1',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          {isRunning ? 'Detener' : 'Iniciar'} Aleatorios
        </button>
      </div>
      
      <div style={{ color: '#888', fontSize: '10px', marginTop: '10px' }}>
        Simula eventos entre usuarios
      </div>
    </div>
  );
};

export default RealtimeSimulator;
