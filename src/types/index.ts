/**
 * Shared TypeScript types for the UnyFilm frontend
 *
 * Conventions
 * - PascalCase for exported interfaces and types
 * - camelCase for properties and function names
 * - Descriptive names to reflect purpose and usage
 */

// Tipos de vista de la aplicación
export type ViewType = 'home' | 'catalog' | 'about' | 'sitemap';

// Tipos de datos de película
export interface MovieData {
  title: string;
  videoUrl: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  image?: string;
}

// Tipos para datos de película al hacer click
export interface MovieClickData {
  title: string;
  index?: number;
  videoUrl?: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
}

// Tipos para formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nombres: string;
  apellidos: string;
  edad: string;
  email: string;
  password: string;
}

// Tipos para props de componentes
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Tipos para componentes de autenticación
export interface AuthProps {
  onLogin?: (data: LoginFormData) => void;
  onRegister?: (data: RegisterFormData) => void;
}

// Tipos para componentes de película
export interface MovieCardProps extends BaseComponentProps {
  title: string;
  isFavorite: boolean;
  onToggleFavorite: (index: number) => void;
  onMovieClick: (movie: MovieClickData) => void;
  image?: string;
  genre?: string;
  rating?: number;
  year?: number;
  description?: string;
}

// Tipos para componentes de navegación
export interface NavigationProps extends BaseComponentProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

// Tipos para componentes de búsqueda
export interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

// Tipos para componentes de lista de películas
export interface MovieListProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  movieTitles: string[];
  movieData: MovieData[];
  onMovieClick: (movie: MovieClickData) => void;
}

// Tipos para reproductor de video
export interface PlayerProps {
  movie: MovieData;
  onClose: () => void;
}

// Tipos para características de usabilidad
export interface UsabilityFeaturesProps extends BaseComponentProps {
  onToggleTheme?: () => void;
  onToggleLanguage?: () => void;
}

// Tipos para características de accesibilidad
export interface AccessibilityFeaturesProps extends BaseComponentProps {
  onToggleHighContrast?: () => void;
  onToggleScreenReader?: () => void;
}

// Tipos para footer

// Tipos para eventos
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

// Tipos para estados de carga
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos para configuración de la aplicación
export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: 'development' | 'production' | 'test';
}


// Tipos para paginación
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Tipos para filtros
export interface FilterProps {
  genre?: string;
  year?: number;
  rating?: number;
  onFilterChange: (filters: Partial<FilterProps>) => void;
}

// Tipos para API Service
export interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}

export interface User {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  nombres?: string;     // Compatibilidad con formato de registro
  apellidos?: string;   // Compatibilidad con formato de registro
  edad?: string;        // Compatibilidad con formato de registro
  age?: number;         // Campo real del backend
  email: string;
  password?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombres: string;
  apellidos: string;
  edad: string;
  email: string;
  password: string;
}

export interface Movie {
  id: number;
  title: string;
  videoUrl: string;
  cloudinaryPublicId?: string;
  cloudinaryUrl?: string;
  thumbnailUrl?: string;
  streamingUrl?: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  image?: string; // pelis P (cards pequeñas)
  imageG?: string; // Portadas (card grande)
  duration?: number;
  bitRate?: number;
  frameRate?: number;
  createdAt: string;
}

export interface ApiService {
  // Movies API
  getMovies: () => Promise<ApiResponse<Movie[]>>;
  getMovie: (id: number) => Promise<ApiResponse<Movie>>;
  createMovie: (movieData: Omit<Movie, 'id' | 'createdAt'>) => Promise<ApiResponse<Movie>>;
  updateMovie: (id: number, movieData: Partial<Movie>) => Promise<ApiResponse<Movie>>;
  deleteMovie: (id: number) => Promise<ApiResponse<void>>;

  // Users API
  getUsers: () => Promise<ApiResponse<User[]>>;
  getUser: (id: number) => Promise<ApiResponse<User>>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<ApiResponse<User>>;
  updateUser: (id: number, userData: Partial<User>) => Promise<ApiResponse<User>>;
  deleteUser: (id: number) => Promise<ApiResponse<void>>;

  // Profile API
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (profileData: { firstName: string; lastName: string; age: number; email: string }) => Promise<ApiResponse<User>>;
  deleteAccount: (password: string) => Promise<ApiResponse<void>>;

  // Authentication API
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (userData: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  recoverPassword: (email: string) => Promise<ApiResponse<void>>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<ApiResponse<void>>;
}

// Tipos para request options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
}

// Tipos para localStorage keys
export type StorageKeys = 
  | 'unyfilm-token'
  | 'unyfilm-user'
  | 'unyfilm-logged-in'
  | 'unyfilm-movies'
  | 'unyfilm-users';

// Tipos para Cloudinary
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  duration?: number;
  bit_rate?: number;
  frame_rate?: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
  quality?: string;
  format?: string;
  resource_type?: 'video' | 'image' | 'raw' | 'auto';
}

export interface CloudinaryVideoInfo {
  public_id: string;
  url: string;
  secure_url: string;
  duration: number;
  width: number;
  height: number;
  format: string;
  bit_rate: number;
  frame_rate: number;
  created_at: string;
}

// Tipos para componentes de subida de video
export interface VideoUploadProps {
  onUploadSuccess: (response: CloudinaryUploadResponse) => void;
  onUploadError: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  folder?: string;
  tags?: string[];
}

// Tipos para reproductor mejorado
export interface EnhancedPlayerProps extends PlayerProps {
  cloudinaryPublicId?: string;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  showSubtitles?: boolean;
  subtitleLanguage?: 'es' | 'en';
  onQualityChange?: (quality: string) => void;
  onSubtitleToggle?: (enabled: boolean) => void;
}
