import { useEffect, useState } from 'react';
import { crossBrowserService, getCrossBrowserStatus } from '../services/crossBrowserService';

interface CrossBrowserStatus {
  browserId: string;
  isPolling: boolean;
  pollInterval: number;
}


export const useCrossBrowserSync = () => {
  const [status, setStatus] = useState<CrossBrowserStatus>({
    browserId: '',
    isPolling: false,
    pollInterval: 2000
  });

  useEffect(() => {
    crossBrowserService.startPolling();

    const statusInterval = setInterval(() => {
      const currentStatus = getCrossBrowserStatus();
      setStatus(currentStatus);
    }, 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  return {
    ...status,
    isActive: status.isPolling
  };
};
