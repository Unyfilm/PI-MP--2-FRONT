

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
 * Interface for registration form data (UI)
 * Spanish keys kept for backward-compatibility; prefer English keys.
 * @interface RegisterFormData
 */
export interface RegisterFormData {

  firstName?: string;
  lastName?: string;
  age?: string;

  nombres?: string;
  apellidos?: string;
  edad?: string;
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

/**
 * Interface for authentication component props
 * @interface AuthProps
 */
export interface AuthProps {
  onLogin?: (data: LoginFormData) => void;
  onRegister?: (data: RegisterFormData) => void;
}

/**
 * Interface for movie card component props
 * @interface MovieCardProps
 */
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

/**
 * Interface for navigation component props
 * @interface NavigationProps
 */
export interface NavigationProps extends BaseComponentProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

/**
 * Interface for search component props
 * @interface SearchProps
 */
export interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * Interface for movie list component props
 * @interface MovieListProps
 */
export interface MovieListProps {
  favorites: number[];
  toggleFavorite: (index: number) => void;
  movieTitles: string[];
  movieData: MovieData[];
  onMovieClick: (movie: MovieClickData) => void;
}

/**
 * Interface for video player component props
 * @interface PlayerProps
 */
export interface PlayerProps {
  movie: MovieData;
  onClose: () => void;
}

/**
 * Interface for usability features component props
 * @interface UsabilityFeaturesProps
 */
export interface UsabilityFeaturesProps extends BaseComponentProps {
  onToggleTheme?: () => void;
  onToggleLanguage?: () => void;
}

/**
 * Interface for accessibility features component props
 * @interface AccessibilityFeaturesProps
 */
export interface AccessibilityFeaturesProps extends BaseComponentProps {
  onToggleHighContrast?: () => void;
  onToggleScreenReader?: () => void;
}

/**
 * Type for input change events
 * @type {InputChangeEvent}
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
/**
 * Type for button click events
 * @type {ButtonClickEvent}
 */
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
/**
 * Type for form submit events
 * @type {FormSubmitEvent}
 */
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

/**
 * Interface for loading state
 * @interface LoadingState
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/**
 * Interface for application configuration
 * @interface AppConfig
 */
export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: 'development' | 'production' | 'test';
}

/**
 * Interface for pagination component props
 * @interface PaginationProps
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Interface for filter component props
 * @interface FilterProps
 */
export interface FilterProps {
  genre?: string;
  year?: number;
  rating?: number;
  onFilterChange: (filters: Partial<FilterProps>) => void;
}

/**
 * Interface for API configuration
 * @interface ApiConfig
 */
export interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
}

/**
 * Generic interface for API responses
 * @interface ApiResponse
 * @template T - The type of data returned
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
}

/**
 * Interface for user data (keeps Spanish legacy fields for compatibility)
 * @interface User
 */
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

/**
 * Interface for authentication response
 * @interface AuthResponse
 */
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

/**
 * Interface for login credentials
 * @interface LoginCredentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for user registration data (service)
 * English preferred; Spanish accepted for compatibility.
 * @interface RegisterData
 */
export interface RegisterData {
  firstName?: string;
  lastName?: string;
  age?: string;
  nombres?: string;
  apellidos?: string;
  edad?: string;
  email: string;
  password: string;
}

/**
 * Interface for movie data (legacy)
 * @interface Movie
 */
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

/**
 * Interface for API service methods
 * @interface ApiService
 */
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

/**
 * Interface for HTTP request options
 * @interface RequestOptions
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
}

/**
 * Type for storage keys
 * @type {StorageKeys}
 */
export type StorageKeys = 
  | 'unyfilm-token'
  | 'unyfilm-user'
  | 'unyfilm-logged-in'
  | 'unyfilm-movies'
  | 'unyfilm-users';

/**
 * Interface for Cloudinary upload response
 * @interface CloudinaryUploadResponse
 */
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

/**
 * Interface for Cloudinary upload options
 * @interface CloudinaryUploadOptions
 */
export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
  quality?: string;
  format?: string;
  resource_type?: 'video' | 'image' | 'raw' | 'auto';
}

/**
 * Interface for Cloudinary video information
 * @interface CloudinaryVideoInfo
 */
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

/**
 * Interface for video upload component props
 * @interface VideoUploadProps
 */
export interface VideoUploadProps {
  onUploadSuccess: (response: CloudinaryUploadResponse) => void;
  onUploadError: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
  folder?: string;
  tags?: string[];
}

/**
 * Interface for enhanced video player props
 * @interface EnhancedPlayerProps
 */
export interface EnhancedPlayerProps extends PlayerProps {
  cloudinaryPublicId?: string;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  showSubtitles?: boolean;
  subtitleLanguage?: 'es' | 'en';
  onQualityChange?: (quality: string) => void;
  onSubtitleToggle?: (enabled: boolean) => void;
}

/**
 * Interface for comment data
 * @interface Comment
 */
export interface Comment {
  _id: string;
  content: string;
  movieId: string;
  userId: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username?: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * Interface for comment creation data
 * @interface CreateCommentData
 */
export interface CreateCommentData {
  movieId: string;
  content: string;
}

/**
 * Interface for comment update data
 * @interface UpdateCommentData
 */
export interface UpdateCommentData {
  content: string;
}

/**
 * Interface for comment pagination response
 * @interface CommentPaginationResponse
 */
export interface CommentPaginationResponse {
  comments: Comment[];
  totalComments: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Interface for comment service methods
 * @interface CommentService
 */
export interface CommentService {
  createComment: (data: CreateCommentData) => Promise<ApiResponse<Comment>>;
  getCommentsByMovie: (movieId: string, page?: number, limit?: number) => Promise<ApiResponse<CommentPaginationResponse>>;
  getMyComments: (page?: number, limit?: number) => Promise<ApiResponse<CommentPaginationResponse>>;
  updateComment: (commentId: string, data: UpdateCommentData) => Promise<ApiResponse<Comment>>;
  deleteComment: (commentId: string) => Promise<ApiResponse<void>>;
  getComment: (commentId: string) => Promise<ApiResponse<Comment>>;
}