
import { API_CONFIG } from '../config/environment';

let isApiHealthy: boolean | null = null;
let lastHealthCheck: number = 0;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes


export const checkApiHealth = async (): Promise<boolean> => {
  const now = Date.now();
  
  
  if (isApiHealthy !== null && (now - lastHealthCheck) < HEALTH_CHECK_INTERVAL) {
    return isApiHealthy;
  }

  try {
    
    
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000) 
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


export const shouldAttemptApiCall = async (): Promise<boolean> => {
  
  if (import.meta.env.DEV) {
    return true;
  }
  
  
  return await checkApiHealth();
};


export const resetHealthCheck = (): void => {
  isApiHealthy = null;
  lastHealthCheck = 0;
};
