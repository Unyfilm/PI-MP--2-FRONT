
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import type { MovieData } from '../../types';
import './CloudinaryVideoPlayer.css';

interface CloudinaryVideoPlayerProps {
  movie: MovieData;
  onClose: () => void;
  quality?: string;
  showSubtitles?: boolean;
}

const CloudinaryVideoPlayer: React.FC<CloudinaryVideoPlayerProps> = ({
  movie,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    }
  };

  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = (): void => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="cloudinary-player-overlay" onClick={onClose}>
      <div 
        className="cloudinary-player-container" 
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cloudinary-player-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="cloudinary-video-wrapper">
          <video
            ref={videoRef}
            src={movie.videoUrl}
            className="cloudinary-video"
            onClick={togglePlay}
          />

          {showControls && (
            <div className="cloudinary-controls">
              <div className="cloudinary-progress" onClick={handleSeek}>
                <div 
                  className="cloudinary-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="cloudinary-controls-bottom">
                <button onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <div className="cloudinary-volume">
                  <button onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>

                <div className="cloudinary-time">
                  <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                  <span> / </span>
                  <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                </div>

                <button onClick={toggleFullscreen}>
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cloudinary-info">
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryVideoPlayer;