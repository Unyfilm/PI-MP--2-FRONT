import { useEffect, useState } from 'react';
import { crossBrowserService, getCrossBrowserStatus } from '../services/crossBrowserService';

interface CrossBrowserStatus {
  browserId: string;
  isPolling: boolean;
  pollInterval: number;
}

/**
 * Hook para manejar la sincronización entre navegadores
 */
export const useCrossBrowserSync = () => {
  const [status, setStatus] = useState<CrossBrowserStatus>({
    browserId: '',
    isPolling: false,
    pollInterval: 2000
  });

  useEffect(() => {
    console.log('🌐 [HOOK] Iniciando sincronización entre navegadores...');
    crossBrowserService.startPolling();

    const statusInterval = setInterval(() => {
      const currentStatus = getCrossBrowserStatus();
      setStatus(currentStatus);
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      console.log('🌐 [HOOK] Limpiando sincronización entre navegadores...');
    };
  }, []);

  return {
    ...status,
    isActive: status.isPolling
  };
};
