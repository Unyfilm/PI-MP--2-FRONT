import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, X } from 'lucide-react';
import './UnyFilmPlayer.css';

type Movie = {
  title: string;
  videoUrl: string;
  rating?: number;
  year?: number;
  genre?: string;
  description?: string;
};

interface PlayerProps {
  movie: Movie;
  onClose: () => void;
}

/**
 * Video Player component for playing movies
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie data to play
 * @param {Function} props.onClose - Function to close the player
 */
export default function UnyFilmPlayer({ movie, onClose }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

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
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="unyfilm-player-close-btn"
        aria-label="Cerrar reproductor"
      >
        <X size={24} />
      </button>

      {/* Video Container */}
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
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2334495e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232c3e50;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23grad1)'/%3E%3Cg transform='translate(400,225)'%3E%3Ccircle cx='-150' cy='-80' r='100' fill='%234a5568' opacity='0.3'/%3E%3Ccircle cx='150' cy='80' r='120' fill='%234a5568' opacity='0.2'/%3E%3Cpath d='M -200,150 L -100,50 L 0,120 L 100,20 L 200,150 Z' fill='%23718096' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E"
        >
          <source src={movie?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} type="video/mp4" />
        </video>

        {/* Video Controls */}
        <div className={`unyfilm-video-controls ${showControls ? 'show' : ''}`}>
          {/* Progress Bar */}
          <div onClick={handleSeek} className="unyfilm-progress-container">
            <div className="unyfilm-progress-bar">
              <div 
                className="unyfilm-progress-filled"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Control Buttons */}
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

      {/* Movie Info Section */}
      <div className="unyfilm-movie-info-section">
        <div className="unyfilm-movie-header">
          <h1 className="unyfilm-movie-title-main">{movie?.title || 'Película'}</h1>
          <div className="unyfilm-movie-rating">
            <span className="star">★</span> {movie?.rating || '4.5'}/10
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
          ></textarea>
          <button className="unyfilm-submit-review-btn">Publicar reseña</button>
        </div>
      </div>
    </div>
  );
}
