/**
 * @file CloudinaryVideoPlayer.tsx
 * @description
 * Video player component that integrates Cloudinary-hosted movie content with custom controls.  
 * Handles playback, volume, progress, fullscreen mode, and accessibility-friendly controls.
 * Built with React hooks and designed for responsive and accessible media playback.
 * 
 * @version 3.0.0
 * @module CloudinaryVideoPlayer
 * 
 * @author
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import type { MovieData } from '../../types';
import './CloudinaryVideoPlayer.css';

/**
 * @typedef {Object} CloudinaryVideoPlayerProps
 * @property {MovieData} movie - The movie object containing video URL, title, and description.
 * @property {() => void} onClose - Callback function triggered when the close button or overlay is clicked.
 * @property {string} [quality] - Optional video quality setting.
 * @property {boolean} [showSubtitles] - Whether to display subtitles if available.
 */
interface CloudinaryVideoPlayerProps {
  movie: MovieData;
  onClose: () => void;
  quality?: string;
  showSubtitles?: boolean;
}

/**
 * @component
 * @name CloudinaryVideoPlayer
 * @description
 * A fully responsive video player that supports:
 * - Play / pause control
 * - Volume adjustment and mute toggle
 * - Seek bar and progress tracking
 * - Fullscreen mode
 * - Movie info display
 * 
 * Uses the Cloudinary-hosted `movie.videoUrl` as the source.
 *
 * @param {CloudinaryVideoPlayerProps} props - Component properties.
 * @returns {JSX.Element} A custom video player overlay with Cloudinary content.
 *
 * @example
 * ```tsx
 * <CloudinaryVideoPlayer 
 *    movie={selectedMovie}
 *    onClose={() => setShowPlayer(false)}
 * />
 * ```
 */
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

  /**
   * Initializes event listeners for video playback updates (time, metadata, pause, play, etc.).
   * Cleans up listeners when the component unmounts.
   */
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

  /**
   * Toggles between play and pause states.
   */
  const togglePlay = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  /**
   * Allows the user to seek to a specific position by clicking on the progress bar.
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event from the progress bar.
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  /**
   * Toggles audio mute on/off.
   */
  const toggleMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  /**
   * Handles user volume slider input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event for volume control.
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  /**
   * Toggles fullscreen mode for the video container.
   */
  const toggleFullscreen = (): void => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Calculates video progress percentage.
   * @type {number}
   */
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