import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, X, Heart } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';
import InteractiveRating from '../rating/InteractiveRating';
import { useRealtimeRatings } from '../../hooks/useRealtimeRatings';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import type { EnhancedPlayerProps } from '../../types';
import type { RatingStats } from '../../services/ratingService';
import './UnyFilmPlayer.css';

export default function UnyFilmPlayer({ 
  movie, 
  onClose, 
  cloudinaryPublicId,
  quality = 'auto',
  showSubtitles = false,
  onQualityChange,
  onSubtitleToggle
}: EnhancedPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentQuality, setCurrentQuality] = useState<string>(quality);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(showSubtitles);
  const [subtitleTrack, setSubtitleTrack] = useState<TextTrack | null>(null);
  const [qualityChangeMessage, setQualityChangeMessage] = useState<string>('');
  const [, setRatingStats] = useState<RatingStats | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const cld = new Cloudinary({ cloud: { cloudName: 'dlyqtvvxv' } });

  const { ratingStats, loadRatingStats } = useRealtimeRatings({
    movieId: movie?._id || '',
    autoLoad: true,
    enableRealtime: true
  });

  const hasRealRatings = ratingStats && ratingStats.totalRatings > 0;
  const averageRating = ratingStats?.averageRating || 0;

  useEffect(() => {
    console.log('📊 Player: Rating stats actualizadas:', {
      movieId: movie?._id,
      ratingStats,
      hasRealRatings,
      averageRating
    });
  }, [ratingStats, hasRealRatings, averageRating, movie?._id]);

  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    if (ratingStats) {
      setForceUpdate(prev => prev + 1);
    }
  }, [ratingStats]);

  useEffect(() => {
    if (movie?._id) {
      console.log('🔄 Player: Recargando estadísticas para película:', movie._id);
      loadRatingStats();
    }
  }, [movie?._id, loadRatingStats]);

  useEffect(() => {
    if (!movie?._id) return;

    const handleRatingUpdate = (event: CustomEvent) => {
      console.log('🎯 [PLAYER] Evento recibido directamente:', {
        eventType: event.type,
        movieId: movie._id,
        eventDetail: event.detail
      });
      
      if (event.detail?.movieId === movie._id) {
        console.log('🎯 [PLAYER] Evento para esta película, forzando recarga');
        loadRatingStats();
      }
    };

    window.addEventListener('rating-updated', handleRatingUpdate as EventListener);
    window.addEventListener('rating-stats-updated', handleRatingUpdate as EventListener);
    window.addEventListener('ratingUpdated', handleRatingUpdate as EventListener);

    return () => {
      window.removeEventListener('rating-updated', handleRatingUpdate as EventListener);
      window.removeEventListener('rating-stats-updated', handleRatingUpdate as EventListener);
      window.removeEventListener('ratingUpdated', handleRatingUpdate as EventListener);
    };
  }, [movie?._id, loadRatingStats]);

  const { isMovieInFavorites, addToFavorites, removeFromFavorites, getFavoriteById } = useFavoritesContext();

  const handleRatingUpdate = (newStats: RatingStats) => {
    setRatingStats(newStats);
  };


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      
      if (subtitlesEnabled && !subtitleTrack) {
        const track = video.addTextTrack('subtitles', 'Subtítulos', 'es');
        track.mode = 'showing';
        setSubtitleTrack(track);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [subtitlesEnabled, subtitleTrack]);


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async (): Promise<void> => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const skipTime = (seconds: number): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (newQuality: string) => {
    setCurrentQuality(newQuality);
    onQualityChange?.(newQuality);
    
    if (videoRef.current && movie?.videoUrl) {
      let newVideoUrl = '';
      const baseUrl = movie.videoUrl;
      
      if (baseUrl.includes('cloudinary.com')) {
        const urlParts = baseUrl.split('/');
        const publicIdWithVersion = urlParts[urlParts.length - 1];
        const publicId = publicIdWithVersion.split('.')[0];
        const fullPublicId = `movies/videos/${publicId}`;
        
        const video = cld.video(fullPublicId);
        
        switch (newQuality) {
          case 'high':
            newVideoUrl = video.addTransformation('w_1920,h_1080,c_fill').format('auto').toURL();
            break;
          case 'medium':
            newVideoUrl = video.addTransformation('w_1280,h_720,c_fill').format('auto').toURL();
            break;
          case 'low':
            newVideoUrl = video.addTransformation('w_854,h_480,c_fill').format('auto').toURL();
            break;
          default:
            newVideoUrl = baseUrl; // Usar URL original
        }
        
        const currentTime = videoRef.current.currentTime;
        const wasPlaying = !videoRef.current.paused;
        
        videoRef.current.src = newVideoUrl;
        videoRef.current.load();
        
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current!.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current!.play();
          }
        }, { once: true });
        
        const qualityNames = {
          'auto': 'Automática',
          'high': 'Alta (1080p)',
          'medium': 'Media (720p)',
          'low': 'Baja (480p)'
        };
        
        setQualityChangeMessage(`🔄 Cambiando a: ${qualityNames[newQuality as keyof typeof qualityNames]}`);
        setTimeout(() => setQualityChangeMessage(''), 3000);
      }
    }
  };

  const handleSubtitleToggle = () => {
    const newSubtitlesEnabled = !subtitlesEnabled;
    setSubtitlesEnabled(newSubtitlesEnabled);
    onSubtitleToggle?.(newSubtitlesEnabled);
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      if (newSubtitlesEnabled) {
        if (!subtitleTrack) {
          const track = video.addTextTrack('subtitles', 'Subtítulos', 'es');
          track.mode = 'showing';
          setSubtitleTrack(track);
        } else {
          subtitleTrack.mode = 'showing';
        }
      } else {
        if (subtitleTrack) {
          subtitleTrack.mode = 'hidden';
        }
      }
    }
  };


  const handleMouseMove = (): void => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;



  return (
    <div className="unyfilm-player-wrapper">
      <div className="unyfilm-player-page">
        {/* Mosaico animado de fondo */}
        <div className="unyfilm-player-mosaic" aria-hidden="true">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} className="unyfilm-player-mosaic__tile" />
          ))}
        </div>
        
        <button 
          onClick={onClose}
          className="unyfilm-player-close-btn"
          aria-label="Cerrar reproductor"
        >
          <X size={24} />
        </button>
        {/* Título encima del reproductor */}
        <div className="unyfilm-movie-info-section" style={{paddingBottom: 10}}>
          <div className="unyfilm-movie-header">
            <h1 className="unyfilm-movie-title-main">{movie?.title || 'Película'}</h1>
            <div className="unyfilm-movie-controls">
              <div className="unyfilm-movie-rating">
                <span className="star">★</span> {hasRealRatings ? averageRating.toFixed(1) : '0'}/5
                {/* Debug info */}
                <small style={{fontSize: '10px', opacity: 0.7, marginLeft: '8px'}}>
                  ({ratingStats?.totalRatings || 0} ratings)
                </small>
              </div>
              <button 
                className={`unyfilm-favorite-btn ${movie?._id && isMovieInFavorites(movie._id) ? 'active' : ''}`}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!movie?._id) return;
                  
                  try {
                    if (isMovieInFavorites(movie._id)) {
                      const favorite = getFavoriteById(movie._id);
                      if (favorite) {
                        await removeFromFavorites(favorite._id);
                      }
                    } else {
                      await addToFavorites(movie._id);
                    }
                  } catch (error) {
                    console.error('Error toggling favorite:', error);
                  }
                }}
                title={movie?._id && isMovieInFavorites(movie._id) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className={`unyfilm-video-container ${isFullscreen ? 'fullscreen' : ''}`}
        >
          <video
            ref={videoRef}
            onClick={togglePlay}
            className="unyfilm-video-element"
            poster={
              movie.image ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%2334495e'/%3E%3C/svg%3E"
            }
          >
            <source src={movie?.videoUrl || ''} type="video/mp4" />
          </video>

          {!isPlaying && (
            <button
              type="button"
              className="unyfilm-center-play"
              aria-label="Reproducir"
              onClick={togglePlay}
            >
              <Play size={56} />
            </button>
          )}

          {/* 🔹 Contenedor completo de controles */}
          <div className={`unyfilm-video-controls ${showControls ? 'show' : ''}`}>
            {/* 🔹 Barra de progreso */}
            <div onClick={handleSeek} className="unyfilm-progress-container">
              <div className="unyfilm-progress-bar">
                <div
                  className="unyfilm-progress-filled"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* 🔹 Sección inferior de controles */}
            <div className="unyfilm-controls-bottom">
              <div className="unyfilm-controls-left">
                <button onClick={togglePlay} className="unyfilm-control-btn">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button onClick={() => skipTime(-10)} className="unyfilm-control-btn">
                  <SkipBack size={20} />
                </button>

                <button onClick={() => skipTime(10)} className="unyfilm-control-btn">
                  <SkipForward size={20} />
                </button>

                <div className="unyfilm-volume-control">
                  <button onClick={toggleMute} className="unyfilm-control-btn">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="unyfilm-volume-slider"
                  />
                </div>

                <div className="unyfilm-time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="unyfilm-controls-right">
                <select
                  value={currentQuality}
                  onChange={(e) => handleQualityChange(e.target.value)}
                  className="unyfilm-quality-selector"
                  disabled={!cloudinaryPublicId}
                  style={{
                    backgroundColor: cloudinaryPublicId ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: cloudinaryPublicId ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <option value="auto">Auto {currentQuality === 'auto' ? '✓' : ''}</option>
                  <option value="high">Alta (1080p) {currentQuality === 'high' ? '✓' : ''}</option>
                  <option value="medium">Media (720p) {currentQuality === 'medium' ? '✓' : ''}</option>
                  <option value="low">Baja (480p) {currentQuality === 'low' ? '✓' : ''}</option>
                </select>

                <button
                  onClick={handleSubtitleToggle}
                  className={`unyfilm-control-btn ${subtitlesEnabled ? 'active' : ''}`}
                  aria-label={subtitlesEnabled ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
                  style={{
                    backgroundColor: subtitlesEnabled ? '#6366f1' : 'transparent',
                    color: subtitlesEnabled ? 'white' : 'white',
                    fontWeight: subtitlesEnabled ? 'bold' : 'normal'
                  }}
                >
                  CC{subtitlesEnabled ? ' ✓' : ''}
                </button>


                <button
                  onClick={toggleFullscreen}
                  className="unyfilm-control-btn"
                  aria-label="Pantalla completa"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div> {/* ← cierre correcto del div .unyfilm-video-controls */}
          
          {/* Mensaje de cambio de calidad */}
          {qualityChangeMessage && (
            <div className="unyfilm-quality-message">
              {qualityChangeMessage}
            </div>
          )}
          
          {/* Indicador de carga cuando cambia calidad */}
          {qualityChangeMessage && (
            <div className="unyfilm-loading-overlay">
              <div className="unyfilm-loading-spinner"></div>
            </div>
          )}
          
        </div> {/* ← cierre correcto del div .unyfilm-video-container */}

        <div className="unyfilm-movie-info-section">

          <div className="unyfilm-movie-metadata">
            <span className="unyfilm-metadata-item">{movie?.year || 'N/A'}</span>
            <span className="unyfilm-metadata-separator">•</span>
            <span className="unyfilm-metadata-item">{movie?.genre || 'N/A'}</span>
            <span className="unyfilm-metadata-separator">•</span>
            <span className="unyfilm-metadata-item">
              {movie?.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A'}
            </span>
          </div>

          <div className="unyfilm-movie-description">
            <h3>Descripción</h3>
            <p className="unyfilm-description-text">
              {movie?.description || 'Descripción no disponible'}
            </p>
          </div>

          {(movie as any)?.synopsis && (
            <div className="unyfilm-movie-synopsis">
              <h3>Sinopsis</h3>
              <p className="unyfilm-synopsis-text">
                {(movie as any).synopsis}
              </p>
            </div>
          )}

          {(movie as any)?.genres && (
            <div className="unyfilm-movie-genres">
              <h3>Géneros</h3>
              <div className="unyfilm-genres-list">
                {(movie as any).genres.map((genre: string, index: number) => (
                  <span key={index} className="unyfilm-genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sistema de Calificación Interactiva */}
          {movie && movie._id && (
            <InteractiveRating
              movieId={movie._id}
              movieTitle={movie.title || 'Película'}
              onRatingUpdate={handleRatingUpdate}
            />
          )}

          {/* Secciones de calificación y comentarios eliminadas */}
        </div>
      </div>
    </div>
  );
}
