import { useEffect, useState } from 'react';
import { websocketService, getWebSocketStatus } from '../services/websocketService';

interface WebSocketStatus {
  connected: boolean;
  reconnectAttempts: number;
  maxAttempts: number;
}

/**
 * Hook para manejar la conexión WebSocket
 */
export const useWebSocketConnection = () => {
  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    reconnectAttempts: 0,
    maxAttempts: 5
  });

  useEffect(() => {
    console.log('🔌 [HOOK] Iniciando conexión WebSocket...');
    websocketService.connect();

    const statusInterval = setInterval(() => {
      const currentStatus = getWebSocketStatus();
      setStatus(currentStatus);
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      console.log('🔌 [HOOK] Limpiando conexión WebSocket...');
    };
  }, []);

  return {
    ...status,
    isConnected: status.connected,
    isReconnecting: status.reconnectAttempts > 0 && status.reconnectAttempts < status.maxAttempts,
    hasFailed: status.reconnectAttempts >= status.maxAttempts
  };
};
