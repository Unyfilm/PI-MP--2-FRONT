import React from 'react';
import { useCrossBrowserSync } from '../../hooks/useCrossBrowserSync';


const CrossBrowserStatus: React.FC = () => {
  const { browserId, isActive, pollInterval } = useCrossBrowserSync();

  
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const getStatusColor = () => {
    return isActive ? '#4ecdc4' : '#e74c3c';
  };

  const getStatusText = () => {
    return isActive ? 'Sincronizado' : 'Desconectado';
  };

  const getStatusIcon = () => {
    return isActive ? '🌐' : '❌';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '90px',
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
        ID: {browserId.substring(0, 8)}...
      </div>
      <div style={{ color: '#888', fontSize: '9px' }}>
        Poll: {pollInterval}ms
      </div>
    </div>
  );
};

export default CrossBrowserStatus;
