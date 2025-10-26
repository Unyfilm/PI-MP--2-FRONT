

/**
 * Application view types
 * @type {ViewType}
 */
export type ViewType = 'home' | 'catalog' | 'about' | 'sitemap' | 'favorites';

/**
 * Interface for movie data
 * @interface MovieData
 */
export interface MovieData {
  _id?: string;
  title: string;
  videoUrl: string;
  rating?: number;
  year?: number;
  genre?: string;
  genres?: string[];
  description?: string;
  image?: string;
  duration?: number;
  cloudinaryVideoId?: string;
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
}

/**
 * Interface for movie click data
 * @interface MovieClickData
 */
export interface MovieClickData {
  _id?: string;
  title: string;
  index?: number;
  videoUrl?: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
  duration?: number;
  subtitles?: Array<{
    language: string;
    languageCode: string;
    url: string;
    isDefault: boolean;
  }>;
}

/**
 * Interface for login form data
 * @interface LoginFormData
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Interface for registration form data
 * @interface RegisterFormData
 */
export interface RegisterFormData {
  nombres: string;
  apellidos: string;
  edad: string;
  email: string;
  password: string;
}

/**
 * Base interface for component props
 * @interface BaseComponentProps
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface AuthProps {
  onLogin?: (data: LoginFormData) => void;
  onRegister?: (data: RegisterFormData) => void;
}

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

export interface NavigationProps extends BaseComponentProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

export interface MovieListProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  movieTitles: string[];
  movieData: MovieData[];
  onMovieClick: (movie: MovieClickData) => void;
}

export interface PlayerProps {
  movie: MovieData;
  onClose: () => void;
}

export interface UsabilityFeaturesProps extends BaseComponentProps {
  onToggleTheme?: () => void;
  onToggleLanguage?: () => void;
}

export interface AccessibilityFeaturesProps extends BaseComponentProps {
  onToggleHighContrast?: () => void;
  onToggleScreenReader?: () => void;
}


export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: 'development' | 'production' | 'test';
}


export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FilterProps {
  genre?: string;
  year?: number;
  rating?: number;
  onFilterChange: (filters: Partial<FilterProps>) => void;
}

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
  nombres?: string;     
  apellidos?: string;   
  edad?: string;        
  age?: number;         
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
  image?: string;
  imageG?: string; 
  duration?: number;
  bitRate?: number;
  frameRate?: number;
  createdAt: string;
}

export interface ApiService {
  getMovies: () => Promise<ApiResponse<Movie[]>>;
  getMovie: (id: number) => Promise<ApiResponse<Movie>>;
  createMovie: (movieData: Omit<Movie, 'id' | 'createdAt'>) => Promise<ApiResponse<Movie>>;
  updateMovie: (id: number, movieData: Partial<Movie>) => Promise<ApiResponse<Movie>>;
  deleteMovie: (id: number) => Promise<ApiResponse<void>>;

  getUsers: () => Promise<ApiResponse<User[]>>;
  getUser: (id: number) => Promise<ApiResponse<User>>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<ApiResponse<User>>;
  updateUser: (id: number, userData: Partial<User>) => Promise<ApiResponse<User>>;
  deleteUser: (id: number) => Promise<ApiResponse<void>>;

  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (profileData: { firstName: string; lastName: string; age: number; email: string }) => Promise<ApiResponse<User>>;
  deleteAccount: (password: string) => Promise<ApiResponse<void>>;

  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (userData: RegisterData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  recoverPassword: (email: string) => Promise<ApiResponse<void>>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<ApiResponse<void>>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<ApiResponse<void>>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
}

export type StorageKeys = 
  | 'unyfilm-token'
  | 'unyfilm-user'
  | 'unyfilm-logged-in'
  | 'unyfilm-movies'
  | 'unyfilm-users';

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

export interface VideoUploadProps {
  onUploadSuccess: (response: CloudinaryUploadResponse) => void;
  onUploadError: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  folder?: string;
  tags?: string[];
}

export interface EnhancedPlayerProps extends PlayerProps {
  cloudinaryPublicId?: string;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  showSubtitles?: boolean;
  subtitleLanguage?: 'es' | 'en';
  onQualityChange?: (quality: string) => void;
  onSubtitleToggle?: (enabled: boolean) => void;
}
