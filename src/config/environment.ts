/**
 * Environment configuration for UnyFilm (TypeScript)
 *
 * Exposes typed configuration objects loaded from Vite env variables.
 * Follows naming conventions: PascalCase for interfaces, UPPER_CASE-like
 * keys within config objects to mirror environment names.
 */

export interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  RETRY_DELAY: number;
}
export interface AppConfig {
  NAME: string;
  VERSION: string;
  DESCRIPTION: string;
  AUTHOR: string;
}
export interface VideoConfig {
  QUALITY: string;
  AUTOPLAY: boolean;
  CONTROLS: boolean;
  DEFAULT_VOLUME: number;
  SEEK_STEP: number;
}
export interface UiConfig {
  THEME: string;
  LANGUAGE: string;
  TIMEZONE: string;
  ANIMATIONS: boolean;
  TRANSITIONS: boolean;
}
export interface SecurityConfig {
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  SESSION_TIMEOUT: number;
  MAX_LOGIN_ATTEMPTS: number;
}
export interface ExternalServices {
  GOOGLE_ANALYTICS_ID: string;
  SENTRY_DSN: string;
  GOOGLE_MAPS_API_KEY: string;
}

export interface CloudinaryConfig {
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
  UPLOAD_PRESET: string;
  BASE_URL: string;
}
export interface DevConfig {
  DEBUG_MODE: boolean;
  LOG_LEVEL: string;
  MOCK_API: boolean;
}
export interface MovieUrls {
  [key: string]: string;
}

// Detect environment and set default API URL
const isProduction = import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production';
const defaultApiUrl = isProduction 
  ? 'https://pi-mp-2-back-prod.onrender.com/api' 
  : 'http://localhost:5000/api';

// Debug logging for production
if (isProduction) {
  console.log('Production environment detected');
  console.log('API_BASE_URL will be:', import.meta.env.VITE_API_BASE_URL || defaultApiUrl);
}

export const API_CONFIG: ApiConfig = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || defaultApiUrl,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || (isProduction ? 30000 : 10000),
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Environment configuration loaded

export const APP_CONFIG: AppConfig = {
  NAME: import.meta.env.VITE_APP_NAME || 'UnyFilm',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Tu plataforma de streaming favorita',
  AUTHOR: 'UnyFilm Team'
};

export const VIDEO_CONFIG: VideoConfig = {
  QUALITY: import.meta.env.VITE_VIDEO_QUALITY || '1080p',
  AUTOPLAY: import.meta.env.VITE_VIDEO_AUTOPLAY === 'true',
  CONTROLS: import.meta.env.VITE_VIDEO_CONTROLS !== 'false',
  DEFAULT_VOLUME: 0.8,
  SEEK_STEP: 10
};

export const UI_CONFIG: UiConfig = {
  THEME: import.meta.env.VITE_THEME || 'dark',
  LANGUAGE: import.meta.env.VITE_LANGUAGE || 'es',
  TIMEZONE: import.meta.env.VITE_TIMEZONE || 'America/Mexico_City',
  ANIMATIONS: true,
  TRANSITIONS: true
};

export const SECURITY_CONFIG: SecurityConfig = {
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'default-secret',
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || 'default-key',
  SESSION_TIMEOUT: 3600000,
  MAX_LOGIN_ATTEMPTS: 5
};

export const EXTERNAL_SERVICES: ExternalServices = {
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
};

export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  BASE_URL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}`
};

export const DEV_CONFIG: DevConfig = {
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true'
};

export const MOVIE_URLS: MovieUrls = {
  BIG_BUCK_BUNNY: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  ELEPHANTS_DREAM: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  FOR_BIGGER_BLAZES: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  FOR_BIGGER_ESCAPES: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  FOR_BIGGER_FUN: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  FOR_BIGGER_JOYRIDES: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  FOR_BIGGER_MELTDOWNS: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  SINTEL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  SUBARU_OUTBACK: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  TEARS_OF_STEEL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  VOLKSWAGEN_GTI: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  WE_ARE_GOING_ON_BULLRUN: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
};

const environment = {
  API_CONFIG,
  APP_CONFIG,
  VIDEO_CONFIG,
  UI_CONFIG,
  SECURITY_CONFIG,
  EXTERNAL_SERVICES,
  CLOUDINARY_CONFIG,
  DEV_CONFIG,
  MOVIE_URLS
};

export default environment;
