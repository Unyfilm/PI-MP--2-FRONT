import React from 'react';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';

/**
 * Componente para mostrar el estado de la conexión en tiempo real
 */
const RealtimeStatus: React.FC = () => {
  const { isConnected, isReconnecting, hasFailed, reconnectAttempts, maxAttempts } = useRealtimeConnection();

  // Solo mostrar en desarrollo
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
