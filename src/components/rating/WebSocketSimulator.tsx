/**
 * @file WebSocketSimulator.tsx
 * @description
 * Developer-only testing tool for broadcasting simulated WebSocket events
 * (e.g., movie rating updates or rating statistics) to verify real-time synchronization
 * between browser tabs and connected clients.
 * 
 * The simulator sends events through the {@link sendWebSocketEvent} service and displays
 * a small fixed-position UI in the corner of the screen. It allows developers to:
 * 
 * - Emit **rating update** events (`rating-updated`)
 * - Emit **rating statistics** events (`rating-stats-updated`)
 * - Test how different clients receive and react to these updates
 * 
 * This component is automatically hidden in production environments.
 *
 * @module WebSocketSimulator
 * @version 3.0.0
 * 
 * @authors
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import React, { useState } from 'react';
import { sendWebSocketEvent } from '../../services/websocketService';

/**
 * @component
 * @name WebSocketSimulator
 * @description
 * Interactive developer tool that simulates WebSocket messages being sent
 * to the server or other clients. Useful for testing cross-browser communication
 * and real-time rating synchronization during development.
 * 
 * It provides two test actions:
 * 
 * - **Enviar Rating:** Sends a `"rating-updated"` event containing rating data.
 * - **Enviar Stats:** Sends a `"rating-stats-updated"` event with aggregated statistics.
 * 
 * The UI only appears when `NODE_ENV === "development"`.
 *
 * @example
 * ```tsx
 * import WebSocketSimulator from '../components/debug/WebSocketSimulator';
 * 
 * function App() {
 *   return (
 *     <>
 *       <MainApp />
 *       <WebSocketSimulator />
 *     </>
 *   );
 * }
 * ```
 *
 * @returns {JSX.Element | null} A floating debug panel in development mode, or `null` in production.
 */
const WebSocketSimulator: React.FC = () => {
  const [testMovieId, setTestMovieId] = useState('68f84e9aba5b03d95f2d6ce4');
  const [testRating, setTestRating] = useState(3);

  /**
   * Sends a simulated "rating-updated" WebSocket event.
   * This mimics a user rating being submitted for a movie.
   * 
   * @function handleSendRatingEvent
   * @returns {void}
   */
  const handleSendRatingEvent = () => {
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

  /**
   * Sends a simulated "rating-stats-updated" WebSocket event.
   * This mimics an update to the movie’s aggregated rating statistics.
   * 
   * @function handleSendStatsEvent
   * @returns {void}
   */
  const handleSendStatsEvent = () => {
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
