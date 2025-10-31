/**
 * Fixed Video Player component for UnyFilm
 * @fileoverview Fixed video player with proper JSX structure
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, X } from 'lucide-react';
import { cloudinaryService } from '../../services/cloudinaryService';
import type { EnhancedPlayerProps } from '../../types';
import './UnyFilmPlayer.css';

/**
 * Enhanced Video Player component for playing movies with Cloudinary support
 */
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
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Simulated comments
  type Comment = { id: number; author: string; content: string; date: string };
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Ana María', content: 'Una obra maestra, la fotografía es increíble.', date: '2025-10-12' },
    { id: 2, author: 'Carlos García', content: 'La banda sonora me encantó, muy inmersiva.', date: '2025-10-13' },
    { id: 3, author: 'Lucía Pérez', content: 'El guion flojea por momentos, pero entretiene.', date: '2025-10-15' }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Generate video URL based on Cloudinary or fallback
  useEffect(() => {
    const generateVideoUrl = () => {
      if (cloudinaryPublicId && cloudinaryService.isConfigured()) {
        // Use Cloudinary streaming URL with quality optimization
        const streamingUrl = cloudinaryService.generateStreamingUrl(cloudinaryPublicId, currentQuality);
        setVideoUrl(streamingUrl);
      // Removed cloudinaryUrl and streamingUrl as they don't exist in MovieData type
      } else {
        // Fallback to original video URL
        setVideoUrl(movie.videoUrl);
      }
    };

    generateVideoUrl();
  }, [cloudinaryPublicId, currentQuality, movie.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

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

  // Handle quality change
  const handleQualityChange = (newQuality: string) => {
    setCurrentQuality(newQuality);
    onQualityChange?.(newQuality);
  };

  // Handle subtitle toggle
  const handleSubtitleToggle = () => {
    const newSubtitlesEnabled = !subtitlesEnabled;
    setSubtitlesEnabled(newSubtitlesEnabled);
    onSubtitleToggle?.(newSubtitlesEnabled);
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
    <div className="unyfilm-player-page">
     
      <button 
        onClick={onClose}
        className="unyfilm-player-close-btn"
        aria-label="Cerrar reproductor"
      >
        <X size={24} />
      </button>

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
          poster={movie.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%2334495e'/%3E%3C/svg%3E"}
        >
          <source 
            src={videoUrl || movie?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
            type="video/mp4" 
          />
        </video>

        
        <div className={`unyfilm-video-controls ${showControls ? 'show' : ''}`}>
          
          <div onClick={handleSeek} className="unyfilm-progress-container">
            <div className="unyfilm-progress-bar">
              <div 
                className="unyfilm-progress-filled"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          
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
              >
                <option value="auto">Auto</option>
                <option value="high">Alta (1080p)</option>
                <option value="medium">Media (720p)</option>
                <option value="low">Baja (480p)</option>
              </select>

              
              <button 
                onClick={handleSubtitleToggle}
                className={`unyfilm-control-btn ${subtitlesEnabled ? 'active' : ''}`}
                aria-label={subtitlesEnabled ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
              >
                CC
              </button>

              <button className="unyfilm-control-btn">
                <Settings size={20} />
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
        </div>
      </div>

      
      <div className="unyfilm-movie-info-section">
        <div className="unyfilm-movie-header">
          <h1 className="unyfilm-movie-title-main">{movie?.title || 'Película'}</h1>
          <div className="unyfilm-movie-rating">
            <span className="star">★</span> {movie?.rating || 'N/A'}/5
          </div>
        </div>

        <div className="unyfilm-movie-metadata">
          <span className="unyfilm-metadata-item">{movie?.year || '2023'}</span>
          <span className="unyfilm-metadata-separator">•</span>
          <span className="unyfilm-metadata-item">{movie?.genre || 'Drama'}</span>
          <span className="unyfilm-metadata-separator">•</span>
          <span className="unyfilm-metadata-item">2h 38m</span>
        </div>

        <div className="unyfilm-movie-description">
          <h3>Descripción</h3>
          <p className="unyfilm-description-text">
            {movie?.description || 'Una increíble aventura cinematográfica que te mantendrá al borde del asiento desde el primer momento.'}
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

        <div className="unyfilm-user-rating-section">
          <h3>Tu calificación</h3>
          <div className="unyfilm-star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="unyfilm-rating-star">★</span>
            ))}
          </div>
        </div>

        <div className="unyfilm-review-section">
          <h3>Tu comentario</h3>
          <textarea
            placeholder="Comparte tus ideas sobre esta película."
            className="unyfilm-review-textarea"
          />
          <button className="unyfilm-submit-review-btn">Publicar reseña</button>
        </div>

       
        <div className="unyfilm-comments-section">
          <h3>Comentarios</h3>
          <ul className="unyfilm-comments-list">
            {comments.map((c) => (
              <li key={c.id} className="unyfilm-comment-item">
                <div className="unyfilm-comment-header">
                  <span className="unyfilm-comment-author">{c.author}</span>
                  <span className="unyfilm-comment-date">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                {editingId === c.id ? (
                  <div className="unyfilm-comment-edit">
                    <textarea
                      className="unyfilm-comment-textarea"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="unyfilm-comment-actions">
                      <button
                        className="unyfilm-comment-btn unyfilm-comment-btn--save"
                        onClick={() => {
                          setComments(prev => prev.map(x => x.id === c.id ? { ...x, content: editingText } : x));
                          setEditingId(null);
                          setEditingText('');
                        }}
                      >Guardar</button>
                      <button
                        className="unyfilm-comment-btn unyfilm-comment-btn--cancel"
                        onClick={() => { setEditingId(null); setEditingText(''); }}
                      >Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="unyfilm-comment-content">{c.content}</p>
                    <div className="unyfilm-comment-actions">
                      <button
                        className="unyfilm-comment-btn"
                        onClick={() => { setEditingId(c.id); setEditingText(c.content); }}
                      >Editar</button>
                      <button
                        className="unyfilm-comment-btn unyfilm-comment-btn--danger"
                        onClick={() => setComments(prev => prev.filter(x => x.id !== c.id))}
                      >Eliminar</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
