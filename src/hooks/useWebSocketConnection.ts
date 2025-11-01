/**
 * @file useWebSocketConnection.ts
 * @description Custom React Hook for managing and monitoring the application's WebSocket connection.
 * It handles connection lifecycle, reconnection attempts, and exposes real-time
 * connection status updates to React components.
 *
 * The hook automatically initiates a WebSocket connection when mounted and polls
 * the connection state periodically to provide reactive UI feedback or logic control.
 *
 * @module Hooks/useWebSocketConnection
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import { useEffect, useState } from 'react';
import { websocketService, getWebSocketStatus } from '../services/websocketService';

/**
 * Represents the current WebSocket connection status.
 * @interface WebSocketStatus
 */
interface WebSocketStatus {
  connected: boolean;
  reconnectAttempts: number;
  maxAttempts: number;
}

/**
 * useWebSocketConnection
 *
 * Custom React hook that initializes and monitors a WebSocket connection.
 * It exposes real-time status flags that indicate whether the client is connected,
 * reconnecting, or has failed to establish a connection.
 *
 * @example
 * const { isConnected, isReconnecting, hasFailed } = useWebSocketConnection();
 *
 * @returns {{
 *   connected: boolean;
 *   reconnectAttempts: number;
 *   maxAttempts: number;
 *   isConnected: boolean;
 *   isReconnecting: boolean;
 *   hasFailed: boolean;
 * }} Connection state and derived flags for WebSocket handling and UI updates.
 */
export const useWebSocketConnection = () => {
  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    reconnectAttempts: 0,
    maxAttempts: 5
  });

  useEffect(() => {
    websocketService.connect();

    const statusInterval = setInterval(() => {
      const currentStatus = getWebSocketStatus();
      setStatus(currentStatus);
    }, 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  return {
    ...status,
    isConnected: status.connected,
    isReconnecting: status.reconnectAttempts > 0 && status.reconnectAttempts < status.maxAttempts,
    hasFailed: status.reconnectAttempts >= status.maxAttempts
  };
};
