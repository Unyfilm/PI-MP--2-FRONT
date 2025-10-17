/**
 * Cloudinary Video Player Component
 * @fileoverview Enhanced video player using @cloudinary/react
 */

import React, { useState, useRef, useEffect } from 'react';
import { Video, CloudinaryContext } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { CLOUDINARY_CONFIG } from '../../config/environment';
import type { Movie } from '../../types';
import './CloudinaryVideoPlayer.css';

interface CloudinaryVideoPlayerProps {
  movie: Movie;
  onClose: () => void;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  showSubtitles?: boolean;
  subtitleLanguage?: 'es' | 'en';
}

/**
 * Enhanced video player using Cloudinary's React components
 */
const CloudinaryVideoPlayer: React.FC<CloudinaryVideoPlayerProps> = ({
  movie,
  onClose,
  quality = 'auto',
  showSubtitles = false,
  subtitleLanguage = 'es'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentQuality, setCurrentQuality] = useState<string>(quality);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Initialize Cloudinary instance
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME
    }
  });

  // Get video public ID from movie
  const getVideoPublicId = (): string => {
    if (movie.cloudinaryPublicId) {
      return movie.cloudinaryPublicId;
    }
    
    // Extract public ID from Cloudinary URL if available
    if (movie.cloudinaryUrl) {
      const urlParts = movie.cloudinaryUrl.split('/');
      const publicIdIndex = urlParts.findIndex(part => part === 'upload') + 1;
      return urlParts[publicIdIndex] || movie.title.toLowerCase().replace(/\s+/g, '_');
    }
    
    // Fallback to movie title
    return movie.title.toLowerCase().replace(/\s+/g, '_');
  };

  const videoPublicId = getVideoPublicId();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
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
    <div className="cloudinary-video-player">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="cloudinary-player-close-btn"
        aria-label="Cerrar reproductor"
      >
        ✕
      </button>

      {/* Video Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`cloudinary-video-container ${isFullscreen ? 'fullscreen' : ''}`}
      >
        <CloudinaryContext cloudName={CLOUDINARY_CONFIG.CLOUD_NAME}>
          <Video
            publicId={videoPublicId}
            className="cloudinary-video-element"
            controls={false}
            ref={videoRef}
            poster={movie.thumbnailUrl}
            onLoadStart={() => console.log('Video loading started')}
            onLoadedData={() => console.log('Video loaded')}
            onError={(e) => console.error('Video error:', e)}
          />
        </CloudinaryContext>

        {/* Video Controls */}
        <div className={`cloudinary-video-controls ${showControls ? 'show' : ''}`}>
          {/* Progress Bar */}
          <div onClick={handleSeek} className="cloudinary-progress-container">
            <div className="cloudinary-progress-bar">
              <div 
                className="cloudinary-progress-filled"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="cloudinary-controls-bottom">
            <div className="cloudinary-controls-left">
              <button onClick={togglePlay} className="cloudinary-control-btn">
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <button onClick={() => skipTime(-10)} className="cloudinary-control-btn">
                ⏪
              </button>

              <button onClick={() => skipTime(10)} className="cloudinary-control-btn">
                ⏩
              </button>

              <div className="cloudinary-volume-control">
                <button onClick={toggleMute} className="cloudinary-control-btn">
                  {isMuted || volume === 0 ? '🔇' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="cloudinary-volume-slider"
                />
              </div>

              <div className="cloudinary-time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="cloudinary-controls-right">
              {/* Quality Selector */}
              <select 
                value={currentQuality} 
                onChange={(e) => setCurrentQuality(e.target.value)}
                className="cloudinary-quality-selector"
              >
                <option value="auto">Auto</option>
                <option value="high">Alta (1080p)</option>
                <option value="medium">Media (720p)</option>
                <option value="low">Baja (480p)</option>
              </select>

              {/* Subtitle Toggle */}
              <button 
                onClick={() => setShowControls(!showControls)}
                className={`cloudinary-control-btn ${showSubtitles ? 'active' : ''}`}
                aria-label={showSubtitles ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
              >
                CC
              </button>

              <button 
                onClick={toggleFullscreen} 
                className="cloudinary-control-btn"
                aria-label="Pantalla completa"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="cloudinary-movie-info-section">
        <div className="cloudinary-movie-header">
          <h1 className="cloudinary-movie-title-main">{movie.title}</h1>
          <div className="cloudinary-movie-rating">
            <span className="star">★</span> {movie.rating || '4.5'}/10
          </div>
        </div>

        <div className="cloudinary-movie-metadata">
          <span className="cloudinary-metadata-item">{movie.year || '2023'}</span>
          <span className="cloudinary-metadata-separator">•</span>
          <span className="cloudinary-metadata-item">{movie.genre || 'Drama'}</span>
          <span className="cloudinary-metadata-separator">•</span>
          <span className="cloudinary-metadata-item">2h 38m</span>
        </div>

        <div className="cloudinary-movie-description">
          <h3>Descripción</h3>
          <p className="cloudinary-description-text">
            {movie.description || 'Una increíble aventura cinematográfica que te mantendrá al borde del asiento desde el primer momento.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryVideoPlayer;
