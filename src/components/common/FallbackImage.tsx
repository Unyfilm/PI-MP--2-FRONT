import React from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';

/**
 * Componente de imagen de fallback para películas
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de imagen de fallback
 */
export const FallbackImage: React.FC<{
  title?: string;
  type?: 'poster' | 'port' | 'hero';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ title = 'Película', type = 'poster', size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-48 h-72',
    large: 'w-64 h-96'
  };

  const iconSizes = {
    small: 24,
    medium: 32,
    large: 48
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden`}
    >
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border border-white rounded"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border border-white rounded"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 border border-white rounded"></div>
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-3">
          {type === 'poster' ? (
            <ImageIcon size={iconSizes[size]} className="mx-auto opacity-70" />
          ) : (
            <Play size={iconSizes[size]} className="mx-auto opacity-70" />
          )}
        </div>
        
        <h3 className="text-sm font-medium leading-tight">
          {title}
        </h3>
        
        <p className="text-xs opacity-60 mt-1">
          {type === 'poster' ? 'Imagen no disponible' : 'Video no disponible'}
        </p>
      </div>
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-5"></div>
    </div>
  );
};

/**
 * Componente de imagen con fallback automático
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de imagen con fallback
 */
export const ImageWithFallback: React.FC<{
  src?: string;
  alt: string;
  title?: string;
  type?: 'poster' | 'port' | 'hero';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
}> = ({ 
  src, 
  alt, 
  title, 
  type = 'poster', 
  size = 'medium', 
  className = '',
  onError,
  onLoad
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Si hay error o no hay src, mostrar fallback
  if (hasError || !src) {
    return (
      <FallbackImage 
        title={title || alt}
        type={type}
        size={size}
        className={className}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default FallbackImage;
