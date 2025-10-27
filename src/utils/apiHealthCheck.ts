/**
 * API Health Check Utility
 * 
 * Provides utilities to check if the backend API is available
 * and handle graceful degradation when it's not.
 */

import { API_CONFIG } from '../config/environment';

let isApiHealthy: boolean | null = null;
let lastHealthCheck: number = 0;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if the API is healthy by making a simple request
 * @returns Promise<boolean> - True if API is healthy, false otherwise
 */
export const checkApiHealth = async (): Promise<boolean> => {
  const now = Date.now();
  
  // Return cached result if it's recent
  if (isApiHealthy !== null && (now - lastHealthCheck) < HEALTH_CHECK_INTERVAL) {
    return isApiHealthy;
  }

  try {
    // Try to make a simple request to check if API is available
    // Use the base URL without /api for health check
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    isApiHealthy = response.ok;
    lastHealthCheck = now;
    
    if (!isApiHealthy) {
      console.warn('API health check failed:', response.status);
    }
    
    return isApiHealthy;
  } catch (error) {
    console.warn('API health check failed:', error);
    isApiHealthy = false;
    lastHealthCheck = now;
    return false;
  }
};

/**
 * Check if we should attempt API calls based on health status
 * @returns Promise<boolean> - True if we should attempt API calls
 */
export const shouldAttemptApiCall = async (): Promise<boolean> => {
  // In development, always attempt API calls
  if (import.meta.env.DEV) {
    return true;
  }
  
  // In production, check API health first
  return await checkApiHealth();
};

/**
 * Reset the health check cache (useful for testing)
 */
export const resetHealthCheck = (): void => {
  isApiHealthy = null;
  lastHealthCheck = 0;
};
