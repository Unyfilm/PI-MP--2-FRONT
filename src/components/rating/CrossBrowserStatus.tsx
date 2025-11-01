/**
 * @file CrossBrowserStatus.tsx
 * @description
 * Displays a real-time development-only overlay showing the synchronization
 * status across different browser tabs or windows.
 * Uses a custom React hook (`useCrossBrowserSync`) to track a shared browser ID,
 * connection state, and polling interval.
 *
 * This component only renders in **development mode** and is automatically
 * hidden in production environments.
 *
 * @module CrossBrowserStatus
 *
 * @version 3.0.0
 *
 * @authors
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import React from 'react';
import { useCrossBrowserSync } from '../../hooks/useCrossBrowserSync';

/**
 * @component
 * @name CrossBrowserStatus
 * @description
 * Small fixed-position developer HUD (Heads-Up Display) that shows
 * the current cross-browser synchronization status, including:
 * - Unique browser instance ID
 * - Connection state (active or inactive)
 * - Polling interval in milliseconds
 *
 * Automatically disabled when `import.meta.env.MODE` is not `'development'`.
 *
 * @returns {JSX.Element | null} A floating sync status widget for developers, or `null` in production.
 *
 * @example
 * ```tsx
 * import CrossBrowserStatus from './components/debug/CrossBrowserStatus';
 *
 * function App() {
 *   return (
 *     <>
 *       <AppRoutes />
 *       <CrossBrowserStatus />
 *     </>
 *   );
 * }
 * ```
 */
const CrossBrowserStatus: React.FC = () => {
  const { browserId, isActive, pollInterval } = useCrossBrowserSync();

  
  if (import.meta.env.MODE !== 'development') {
    return null;
  }
  
  /**
   * Returns the color representing sync state.
   * @returns {string} Hex color for border and text.
   */
  const getStatusColor = () => {
    return isActive ? '#4ecdc4' : '#e74c3c';
  };

  /**
   * Returns a human-readable text for sync state.
   * @returns {string} The current sync status text.
   */
  const getStatusText = () => {
    return isActive ? 'Sincronizado' : 'Desconectado';
  };
  
  /**
   * Returns a visual emoji icon for sync status.
   * @returns {string} Emoji icon for sync status.
   */
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
