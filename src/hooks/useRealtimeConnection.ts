import { useEffect, useState } from 'react';
import { realTimeService, getRealTimeStatus } from '../services/realtimeService';

interface RealtimeStatus {
  connected: boolean;
  reconnectAttempts: number;
  maxAttempts: number;
}


export const useRealtimeConnection = () => {
  const [status, setStatus] = useState<RealtimeStatus>({
    connected: false,
    reconnectAttempts: 0,
    maxAttempts: 5
  });

  useEffect(() => {
    console.log('🔌 [HOOK] Iniciando conexión en tiempo real...');
    realTimeService.connect();

    const statusInterval = setInterval(() => {
      const currentStatus = getRealTimeStatus();
      setStatus(currentStatus);
    }, 1000);

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
