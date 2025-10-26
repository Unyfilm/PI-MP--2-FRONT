import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, X, Heart } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';
import InteractiveRating from '../rating/InteractiveRating';
import { useRealtimeRatings } from '../../hooks/useRealtimeRatings';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import { cloudinaryService } from '../../services/cloudinaryService';
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
  const [availableSubtitles, setAvailableSubtitles] = useState<string[]>([]);
  const [selectedSubtitleLanguage, setSelectedSubtitleLanguage] = useState<string>('es');
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

  const [_forceUpdate, setForceUpdate] = useState(0);
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

  // Cargar subtítulos disponibles cuando se monta el componente
  useEffect(() => {
    const loadAvailableSubtitles = async () => {
      console.log('🎬 Datos de la película recibidos:', {
        cloudinaryVideoId: movie?.cloudinaryVideoId,
        subtitles: movie?.subtitles,
        movieTitle: movie?.title
      });

      if (!movie?.cloudinaryVideoId) {
        console.log('⚠️ No hay cloudinaryVideoId disponible');
        return;
      }

      try {
        // Si el backend ya proporciona subtítulos, usarlos
        if (movie.subtitles && movie.subtitles.length > 0) {
          console.log('✅ Usando subtítulos del backend:', movie.subtitles);
          const availableLanguages = movie.subtitles.map(sub => sub.languageCode);
          setAvailableSubtitles(availableLanguages);
          
          // Usar el idioma por defecto o el primero disponible
          const defaultLang = movie.subtitles.find(sub => sub.isDefault)?.languageCode || availableLanguages[0];
          setSelectedSubtitleLanguage(defaultLang);
          console.log('🎯 Idioma de subtítulo seleccionado:', defaultLang);
        } else {
          console.log('⚠️ No hay subtítulos en el backend, intentando Cloudinary...');
          // Fallback: intentar cargar desde Cloudinary
          const subtitles = await cloudinaryService.getAvailableSubtitles(movie.cloudinaryVideoId);
          setAvailableSubtitles(subtitles);
          
          if (subtitles.length > 0) {
            console.log('✅ Subtítulos disponibles desde Cloudinary:', subtitles);
            setSelectedSubtitleLanguage(subtitles[0]);
          } else {
            console.log('⚠️ No hay subtítulos disponibles para esta película');
          }
        }
      } catch (error) {
        console.error('❌ Error cargando subtítulos:', error);
        setAvailableSubtitles([]);
      }
    };

    loadAvailableSubtitles();
  }, [movie?.cloudinaryVideoId, movie?.subtitles]);

  // Cargar subtítulos inmediatamente cuando estén disponibles
  useEffect(() => {
    const loadSubtitlesImmediately = async () => {
      if (availableSubtitles.length > 0 && subtitlesEnabled && !subtitleTrack && videoRef.current) {
        console.log('🔄 Cargando subtítulos inmediatamente...');
        
        // Limpiar tracks existentes primero
        const video = videoRef.current;
        const existingTracks = Array.from(video.textTracks);
        existingTracks.forEach(track => {
          if (track.kind === 'subtitles') {
            console.log('🗑️ Eliminando track existente:', track.label);
            track.mode = 'disabled';
          }
        });
        
        try {
          let subtitleContent: string;
          
          // Usar subtítulos del backend si están disponibles
          if (movie?.subtitles && movie.subtitles.length > 0) {
            const subtitleInfo = movie.subtitles.find(sub => sub.languageCode === selectedSubtitleLanguage);
            if (subtitleInfo && subtitleInfo.url) {
              console.log('📡 Cargando subtítulos desde URL del backend:', subtitleInfo.url);
              subtitleContent = await cloudinaryService.loadSubtitleFromUrl(subtitleInfo.url);
            } else {
              throw new Error(`Subtítulo no encontrado para idioma: ${selectedSubtitleLanguage}`);
            }
          } else {
            // Fallback: cargar desde Cloudinary
            console.log('🔄 Usando fallback de Cloudinary');
            subtitleContent = await cloudinaryService.loadSubtitleContent(
              movie?.cloudinaryVideoId || '', 
              selectedSubtitleLanguage
            );
          }
          
          console.log('📝 Contenido de subtítulos cargado:', subtitleContent.substring(0, 200) + '...');
          
          // Crear track de subtítulos
          const track = video.addTextTrack('subtitles', 'Subtítulos', selectedSubtitleLanguage);
          
          // Parsear contenido VTT y agregar cues
          const vttLines = subtitleContent.split('\n');
          let currentCue = null;
          let cueCount = 0;
          
          console.log('📋 Líneas VTT totales:', vttLines.length);
          
          for (let i = 0; i < vttLines.length; i++) {
            const line = vttLines[i].trim();
            
            if (line.includes('-->')) {
              // Línea de tiempo
              console.log('🕐 Procesando línea de tiempo:', line);
              const timeParts = line.split(' --> ');
              
              if (timeParts.length === 2) {
                const [startTime, endTime] = timeParts;
                console.log('⏰ Tiempos:', { startTime, endTime });
                
                currentCue = {
                  start: parseVTTTime(startTime.trim()),
                  end: parseVTTTime(endTime.trim()),
                  text: ''
                };
                
                console.log('📝 Cue creado:', currentCue);
              } else {
                console.warn('⚠️ Formato de tiempo incorrecto:', line);
              }
            } else if (currentCue && line && !line.startsWith('WEBVTT') && !line.startsWith('NOTE')) {
              // Línea de texto
              currentCue.text += (currentCue.text ? '\n' : '') + line;
              
              // Si la siguiente línea está vacía o es un nuevo tiempo, agregar el cue
              if (i === vttLines.length - 1 || !vttLines[i + 1].trim() || vttLines[i + 1].includes('-->')) {
                console.log('✅ Agregando cue:', currentCue);
                track.addCue(new VTTCue(currentCue.start, currentCue.end, currentCue.text));
                cueCount++;
                currentCue = null;
              }
            }
          }
          
          console.log(`📊 Total de cues agregados: ${cueCount}`);
          // Solo mostrar subtítulos si están habilitados
          track.mode = subtitlesEnabled ? 'showing' : 'hidden';
          setSubtitleTrack(track);
          console.log('✅ Subtítulos cargados exitosamente');
          console.log('🎯 Track creado:', {
            kind: track.kind,
            label: track.label,
            language: track.language,
            mode: track.mode,
            cues: track.cues ? track.cues.length : 0,
            subtitlesEnabled
          });
        } catch (error) {
          console.error('❌ Error cargando subtítulos:', error);
        }
      }
    };

    loadSubtitlesImmediately();
  }, [availableSubtitles, subtitlesEnabled, subtitleTrack, selectedSubtitleLanguage, movie?.subtitles, movie?.cloudinaryVideoId]);

  // Asegurar que los subtítulos se muestren cuando el video esté listo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      console.log('🎬 Video listo para reproducir, verificando subtítulos...');
      if (subtitleTrack) {
        const newMode = subtitlesEnabled ? 'showing' : 'hidden';
        console.log('🎯 Estableciendo modo de subtítulos:', newMode);
        subtitleTrack.mode = newMode;
        console.log('🎯 Modo del track después de establecer:', subtitleTrack.mode);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [subtitlesEnabled, subtitleTrack]);

  // Limpiar tracks cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const existingTracks = Array.from(video.textTracks);
        existingTracks.forEach(track => {
          if (track.kind === 'subtitles') {
            console.log('🗑️ Limpiando track al desmontar:', track.label);
            track.mode = 'disabled';
          }
        });
      }
    };
  }, []);

  const { isMovieInFavorites, addToFavorites, removeFromFavorites, getFavoriteById } = useFavoritesContext();

  const handleRatingUpdate = (newStats: RatingStats) => {
    setRatingStats(newStats);
  };


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = async () => {
      setDuration(video.duration);
      
      // Cargar subtítulos si están habilitados y hay subtítulos disponibles
      console.log('🎬 Condiciones para cargar subtítulos:', {
        subtitlesEnabled,
        availableSubtitlesLength: availableSubtitles.length,
        hasSubtitleTrack: !!subtitleTrack,
        selectedLanguage: selectedSubtitleLanguage
      });

      if (subtitlesEnabled && availableSubtitles.length > 0 && !subtitleTrack) {
        try {
          console.log('🎬 Cargando subtítulos para idioma:', selectedSubtitleLanguage);
          
          let subtitleContent: string;
          
          // Usar subtítulos del backend si están disponibles
          if (movie?.subtitles && movie.subtitles.length > 0) {
            const subtitleInfo = movie.subtitles.find(sub => sub.languageCode === selectedSubtitleLanguage);
            if (subtitleInfo && subtitleInfo.url) {
              console.log('📡 Cargando subtítulos desde URL del backend:', subtitleInfo.url);
              subtitleContent = await cloudinaryService.loadSubtitleFromUrl(subtitleInfo.url);
            } else {
              throw new Error(`Subtítulo no encontrado para idioma: ${selectedSubtitleLanguage}`);
            }
          } else {
            // Fallback: cargar desde Cloudinary
            console.log('🔄 Usando fallback de Cloudinary');
            subtitleContent = await cloudinaryService.loadSubtitleContent(
              movie?.cloudinaryVideoId || '', 
              selectedSubtitleLanguage
            );
          }
          
          console.log('📝 Contenido de subtítulos cargado:', subtitleContent.substring(0, 200) + '...');
          
          // Crear track de subtítulos
          const track = video.addTextTrack('subtitles', 'Subtítulos', selectedSubtitleLanguage);
          
          // Parsear contenido VTT y agregar cues
          const vttLines = subtitleContent.split('\n');
          let currentCue = null;
          let cueCount = 0;
          
          for (let i = 0; i < vttLines.length; i++) {
            const line = vttLines[i].trim();
            
            if (line.includes('-->')) {
              // Línea de tiempo
              const [startTime, endTime] = line.split(' --> ');
              currentCue = {
                start: parseVTTTime(startTime),
                end: parseVTTTime(endTime),
                text: ''
              };
            } else if (currentCue && line && !line.startsWith('WEBVTT') && !line.startsWith('NOTE')) {
              // Línea de texto
              currentCue.text += (currentCue.text ? '\n' : '') + line;
              
              // Si la siguiente línea está vacía o es un nuevo tiempo, agregar el cue
              if (i === vttLines.length - 1 || !vttLines[i + 1].trim() || vttLines[i + 1].includes('-->')) {
                track.addCue(new VTTCue(currentCue.start, currentCue.end, currentCue.text));
                cueCount++;
                currentCue = null;
              }
            }
          }
          
          console.log(`📊 Total de cues agregados: ${cueCount}`);
          track.mode = subtitlesEnabled ? 'showing' : 'hidden';
          setSubtitleTrack(track);
          console.log('✅ Subtítulos cargados exitosamente');
        } catch (error) {
          console.error('❌ Error cargando subtítulos:', error);
        }
      } else {
        console.log('⚠️ No se cargaron subtítulos. Razones:', {
          subtitlesEnabled,
          hasAvailableSubtitles: availableSubtitles.length > 0,
          hasSubtitleTrack: !!subtitleTrack
        });
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
  }, [subtitlesEnabled, subtitleTrack, availableSubtitles, selectedSubtitleLanguage, movie?.cloudinaryVideoId, movie?.subtitles]);

  // Función para parsear tiempo VTT
  const parseVTTTime = (timeStr: string): number => {
    if (!timeStr || typeof timeStr !== 'string') {
      console.warn('⚠️ Tiempo VTT inválido:', timeStr);
      return 0;
    }

    try {
      // VTT times can be HH:MM:SS.mmm or MM:SS.mmm
      // We need to handle both cases.
      const timeParts = timeStr.split(':');
      let hours = 0;
      let minutes = 0;
      let secondsAndMs = '';

      if (timeParts.length === 3) { // HH:MM:SS.mmm
        hours = parseInt(timeParts[0]) || 0;
        minutes = parseInt(timeParts[1]) || 0;
        secondsAndMs = timeParts[2];
      } else if (timeParts.length === 2) { // MM:SS.mmm
        minutes = parseInt(timeParts[0]) || 0;
        secondsAndMs = timeParts[1];
      } else {
        console.warn('⚠️ Formato de tiempo VTT inesperado:', timeStr);
        return 0;
      }

      const [secondsStr, millisecondsStr] = secondsAndMs.split('.'); // Split by period for milliseconds
      
      const secs = parseInt(secondsStr) || 0;
      const ms = parseInt(millisecondsStr) || 0;
      
      const totalSeconds = hours * 3600 + minutes * 60 + secs + ms / 1000;
      
      console.log(`🕐 Parseando tiempo: ${timeStr} → ${totalSeconds}s`);
      return totalSeconds;
    } catch (error) {
      console.error('❌ Error parseando tiempo VTT:', timeStr, error);
      return 0;
    }
  };


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
            newVideoUrl = baseUrl; 
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
    
    console.log('🎬 Toggle de subtítulos:', {
      newSubtitlesEnabled,
      availableSubtitles,
      subtitleTrack: !!subtitleTrack,
      movieSubtitles: movie?.subtitles,
      videoElement: !!videoRef.current,
      textTracks: videoRef.current ? videoRef.current.textTracks.length : 0,
      allTextTracks: videoRef.current ? Array.from(videoRef.current.textTracks).map(track => ({
        kind: track.kind,
        label: track.label,
        language: track.language,
        mode: track.mode,
        cues: track.cues ? track.cues.length : 0
      })) : []
    });
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      if (newSubtitlesEnabled) {
        // Solo activar si hay subtítulos disponibles
        if (availableSubtitles.length > 0 && subtitleTrack) {
          console.log('✅ Activando subtítulos existentes');
          subtitleTrack.mode = 'showing';
        } else if (availableSubtitles.length > 0) {
          // Recargar subtítulos si no están cargados
          console.log('🔄 Recargando subtítulos...');
          // El useEffect se encargará de cargar los subtítulos
        } else {
          console.log('⚠️ No hay subtítulos disponibles para esta película');
          setSubtitlesEnabled(false);
        }
      } else {
        // Ocultar todos los tracks de subtítulos
        console.log('❌ Ocultando todos los subtítulos');
        const allTracks = Array.from(video.textTracks);
        allTracks.forEach(track => {
          if (track.kind === 'subtitles') {
            console.log('🗑️ Ocultando track:', track.label);
            track.mode = 'hidden';
          }
        });
        
        if (subtitleTrack) {
          subtitleTrack.mode = 'hidden';
        }
      }
    }
  };

  const handleSubtitleLanguageChange = async (language: string) => {
    setSelectedSubtitleLanguage(language);
    
    if (videoRef.current && subtitlesEnabled) {
      try {
        // Limpiar todos los tracks de subtítulos existentes
        const video = videoRef.current;
        const existingTracks = Array.from(video.textTracks);
        existingTracks.forEach(track => {
          if (track.kind === 'subtitles') {
            console.log('🗑️ Eliminando track anterior:', track.label);
            track.mode = 'disabled';
          }
        });
        
        // Limpiar track anterior
        if (subtitleTrack) {
          subtitleTrack.mode = 'hidden';
        }
        
        // Cargar nuevo contenido de subtítulos
        let subtitleContent: string;
        
        // Usar subtítulos del backend si están disponibles
        if (movie?.subtitles && movie.subtitles.length > 0) {
          const subtitleInfo = movie.subtitles.find(sub => sub.languageCode === language);
          if (subtitleInfo && subtitleInfo.url) {
            subtitleContent = await cloudinaryService.loadSubtitleFromUrl(subtitleInfo.url);
          } else {
            throw new Error(`Subtítulo no encontrado para idioma: ${language}`);
          }
        } else {
          // Fallback: cargar desde Cloudinary
          subtitleContent = await cloudinaryService.loadSubtitleContent(
            movie?.cloudinaryVideoId || '', 
            language
          );
        }
        
        // Crear nuevo track
        const videoElement = videoRef.current;
        const track = videoElement.addTextTrack('subtitles', 'Subtítulos', language);
        
        // Parsear y agregar cues
        const vttLines = subtitleContent.split('\n');
        let currentCue = null;
        
        for (let i = 0; i < vttLines.length; i++) {
          const line = vttLines[i].trim();
          
          if (line.includes('-->')) {
            const [startTime, endTime] = line.split(' --> ');
            currentCue = {
              start: parseVTTTime(startTime),
              end: parseVTTTime(endTime),
              text: ''
            };
          } else if (currentCue && line && !line.startsWith('WEBVTT') && !line.startsWith('NOTE')) {
            currentCue.text += (currentCue.text ? '\n' : '') + line;
            
            if (i === vttLines.length - 1 || !vttLines[i + 1].trim() || vttLines[i + 1].includes('-->')) {
              track.addCue(new VTTCue(currentCue.start, currentCue.end, currentCue.text));
              currentCue = null;
            }
          }
        }
        
        track.mode = subtitlesEnabled ? 'showing' : 'hidden';
        setSubtitleTrack(track);
        console.log(`✅ Subtítulos cambiados a ${language}, modo: ${track.mode}`);
      } catch (error) {
        console.error('❌ Error cambiando idioma de subtítulos:', error);
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
        
        <div className="unyfilm-movie-info-section" style={{paddingBottom: 10}}>
          <div className="unyfilm-movie-header">
            <h1 className="unyfilm-movie-title-main">{movie?.title || 'Película'}</h1>
            <div className="unyfilm-movie-controls">
              <div className="unyfilm-movie-rating">
                <span className="star">★</span> {hasRealRatings ? averageRating.toFixed(1) : '0'}/5
                
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

          
          <div className={`unyfilm-video-controls ${showControls ? 'show' : ''}`}>
            
            <div onClick={handleSeek} className="unyfilm-progress-container">
              <div className="unyfilm-progress-bar">
                <div
                  className="unyfilm-progress-filled"
                  style={{ width: `${progress}%` }}
                ></div>
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

                {availableSubtitles.length > 0 && (
                  <select
                    value={selectedSubtitleLanguage}
                    onChange={(e) => handleSubtitleLanguageChange(e.target.value)}
                    className="unyfilm-subtitle-selector"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginRight: '8px'
                    }}
                  >
                    {availableSubtitles.map(lang => (
                      <option key={lang} value={lang} style={{ backgroundColor: '#333', color: 'white' }}>
                        {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={handleSubtitleToggle}
                  className={`unyfilm-control-btn ${subtitlesEnabled ? 'active' : ''}`}
                  aria-label={subtitlesEnabled ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
                  disabled={availableSubtitles.length === 0}
                  style={{
                    backgroundColor: subtitlesEnabled ? '#6366f1' : 'transparent',
                    color: subtitlesEnabled ? 'white' : availableSubtitles.length === 0 ? '#666' : 'white',
                    fontWeight: subtitlesEnabled ? 'bold' : 'normal',
                    opacity: availableSubtitles.length === 0 ? 0.5 : 1
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
          </div> 
          
          
          {qualityChangeMessage && (
            <div className="unyfilm-quality-message">
              {qualityChangeMessage}
            </div>
          )}
          
          
          {qualityChangeMessage && (
            <div className="unyfilm-loading-overlay">
              <div className="unyfilm-loading-spinner"></div>
            </div>
          )}
          
        </div> 

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

        
          {movie && movie._id && (
            <InteractiveRating
              movieId={movie._id}
              movieTitle={movie.title || 'Película'}
              onRatingUpdate={handleRatingUpdate}
            />
          )}

       
        </div>
      </div>
    </div>
  );
}
