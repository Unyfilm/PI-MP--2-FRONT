import { useEffect, useState } from 'react';
import { realtimeService, getRealtimeStatus } from '../services/realtimeService';

interface RealtimeStatus {
  connected: boolean;
  reconnectAttempts: number;
  maxAttempts: number;
}

/**
 * Hook para manejar la conexión en tiempo real
 */
export const useRealtimeConnection = () => {
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    reconnectAttempts: 0,
    maxAttempts: 5
  });

  useEffect(() => {
    // Conectar al servicio en tiempo real
    console.log('🔌 [HOOK] Iniciando conexión en tiempo real...');
    realtimeService.connect();

    // Actualizar estado cada segundo
    const statusInterval = setInterval(() => {
      const currentStatus = getRealtimeStatus();
      setStatus(currentStatus);
    }, 1000);

    // Cleanup al desmontar
    return () => {
      clearInterval(statusInterval);
      console.log('🔌 [HOOK] Limpiando conexión en tiempo real...');
    };
  }, []);

  return {
    ...status,
    isConnected: status.connected,
    isReconnecting: status.reconnectAttempts > 0 && status.reconnectAttempts < status.maxAttempts,
    hasFailed: status.reconnectAttempts >= status.maxAttempts
  };
};
