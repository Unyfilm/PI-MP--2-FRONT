/**
 * @file RealtimeStatus.tsx
 * @description
 * Developer-only diagnostic component that displays the real-time
 * connection status (connected, reconnecting, or failed) using color codes and icons.
 * 
 * It uses the custom hook {@link useRealtimeConnection} to monitor the application's
 * WebSocket or event-stream connection state and provides visual feedback for debugging.
 * 
 * The component is visible **only in development mode** and automatically hidden in production.
 *
 * @module RealtimeStatus
 * @version 1.0.0
 *
 * @authors
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import React from 'react';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';

/**
 * @component
 * @name RealtimeStatus
 * @description
 * A fixed-position overlay that displays the current real-time connection status.
 * Useful for debugging socket or live-data connectivity during development.
 * @returns {JSX.Element | null} A floating diagnostic UI for real-time status, or null in production mode.
 */

const RealtimeStatus: React.FC = () => {
  const { isConnected, isReconnecting, hasFailed, reconnectAttempts, maxAttempts } = useRealtimeConnection();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getStatusColor = () => {
    if (isConnected) return '#4ecdc4';
    if (isReconnecting) return '#f39c12';
    if (hasFailed) return '#e74c3c';
    return '#95a5a6';
  };

  const getStatusText = () => {
    if (isConnected) return 'Conectado';
    if (isReconnecting) return `Reconectando... (${reconnectAttempts}/${maxAttempts})`;
    if (hasFailed) return 'Desconectado';
    return 'Conectando...';
  };

  const getStatusIcon = () => {
    if (isConnected) return '🟢';
    if (isReconnecting) return '🟡';
    if (hasFailed) return '🔴';
    return '⚪';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '11px',
      zIndex: 9999,
      minWidth: '150px',
      border: `2px solid ${getStatusColor()}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{getStatusIcon()}</span>
        <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {getStatusText()}
        </span>
      </div>
      <div style={{ color: '#888', fontSize: '9px', marginTop: '2px' }}>
        Tiempo Real
      </div>
    </div>
  );
};

export default RealtimeStatus;
