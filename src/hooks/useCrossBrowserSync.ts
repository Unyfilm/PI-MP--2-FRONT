/**
 * @file useCrossBrowserSync.ts
 * @description Custom React Hook that manages real-time synchronization status
 * between multiple browser instances using the cross-browser service.
 * It provides updates on the browser ID, polling activity, and polling interval.
 * 
 * @module Hooks/useCrossBrowserSync
 * 
 * @author
 * Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta,
 * Jerson Otero, Julian Mosquera
 */
import { useEffect, useState } from 'react';
import { crossBrowserService, getCrossBrowserStatus } from '../services/crossBrowserService';

/**
 * @typedef {Object} CrossBrowserStatus
 * @property {string} browserId - Unique identifier assigned to the current browser instance.
 * @property {boolean} isPolling - Indicates whether the background polling process is active.
 * @property {number} pollInterval - Time interval in milliseconds between each status update check.
 */
interface CrossBrowserStatus {
  browserId: string;
  isPolling: boolean;
  pollInterval: number;
}

/**
 * useCrossBrowserSync
 * 
 * Custom hook that enables live synchronization between browser tabs or windows.
 * It starts a polling service via `crossBrowserService` and continuously updates
 * synchronization status every second.
 * 
 * This hook is primarily used for development and testing environments to ensure
 * that rating updates, events, or shared states remain consistent across multiple
 * browser sessions.
 * 
 * @example
 * const { browserId, isActive, pollInterval } = useCrossBrowserSync();
 * 
 * @returns {{
 *   browserId: string;
 *   isPolling: boolean;
 *   pollInterval: number;
 *   isActive: boolean;
 * }} Current synchronization status for the browser.
 */
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
