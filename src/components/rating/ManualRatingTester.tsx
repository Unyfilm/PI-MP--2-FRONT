import React, { useState } from 'react';
import { emitRatingUpdate, emitStatsUpdate } from '../../services/ratingEventSystem';

/**
 * Componente para probar manualmente los eventos de rating
 */
const ManualRatingTester: React.FC = () => {
  const [testRating, setTestRating] = useState(3);

  const testRatingUpdate = () => {
    console.log('🧪 [MANUAL TEST] Emitiendo evento de prueba...');
    
    emitRatingUpdate({
      movieId: '68f84e9aba5b03d95f2d6ce4',
      rating: testRating,
      action: 'create',
      movieTitle: 'Primate (2026)',
      userId: 'test-user'
    });
  };

  const testStatsUpdate = () => {
    console.log('🧪 [MANUAL TEST] Emitiendo estadísticas de prueba...');
    
    emitStatsUpdate({
      movieId: '68f84e9aba5b03d95f2d6ce4',
      averageRating: testRating,
      totalRatings: 5
    });
  };

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
      <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>🧪 Manual Event Tester</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Rating: </label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={testRating} 
          onChange={(e) => setTestRating(Number(e.target.value))}
          style={{ width: '50px', marginLeft: '5px' }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button 
          onClick={testRatingUpdate}
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
          Test Rating Event
        </button>
        
        <button 
          onClick={testStatsUpdate}
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
          Test Stats Event
        </button>
      </div>
      
      <div style={{ color: '#888', fontSize: '10px', marginTop: '10px' }}>
        Movie ID: 68f84e9aba5b03d95f2d6ce4
      </div>
    </div>
  );
};

export default ManualRatingTester;
