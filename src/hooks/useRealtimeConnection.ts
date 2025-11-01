/**
 * @file useRealtimeConnection.ts
 * @description Custom React Hook for managing and monitoring real-time WebSocket connection status.
 * It connects to the real-time service, tracks reconnection attempts, and provides
 * live updates on connection health for use across the application.
 *
 * This hook automatically initiates a connection when mounted and periodically
 * updates its internal state based on the connection's status.
 *
 * @module Hooks/useRealtimeConnection
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
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
    realTimeService.connect();

    const statusInterval = setInterval(() => {
      const currentStatus = getRealTimeStatus();
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
