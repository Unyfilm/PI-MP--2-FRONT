/**
 * Video Upload Component for UnyFilm
 * @fileoverview Component for uploading videos to Cloudinary
 */

import React, { useState, useRef, useCallback } from 'react';
import { cloudinaryService } from '../../services/cloudinaryService';
import type { VideoUploadProps, CloudinaryUploadResponse } from '../../types';
import './VideoUpload.css';


const VideoUpload: React.FC<VideoUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  acceptedFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  maxFileSize = 100 * 1024 * 1024, 
  folder = 'unyfilm-videos',
  tags = ['movie', 'upload']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const handleFileSelect = useCallback((file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      onUploadError(`Formato de archivo no soportado. Formatos permitidos: ${acceptedFormats.join(', ')}`);
      return;
    }

    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      onUploadError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [acceptedFormats, maxFileSize, onUploadError]);

  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

 
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (!cloudinaryService.isConfigured()) {
        throw new Error('Cloudinary no está configurado. Por favor, verifica las variables de entorno.');
      }

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response: CloudinaryUploadResponse = await cloudinaryService.uploadVideo(selectedFile, {
        folder,
        tags,
        resource_type: 'video',
        quality: 'auto'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const streamingUrl = cloudinaryService.generateStreamingUrl(response.public_id, 'auto');
      const thumbnailUrl = cloudinaryService.generateThumbnailUrl(response.public_id);

      const enhancedResponse: CloudinaryUploadResponse = {
        ...response,
        streaming_url: streamingUrl,
        thumbnail_url: thumbnailUrl
      } as CloudinaryUploadResponse & { streaming_url: string; thumbnail_url: string };

      onUploadSuccess(enhancedResponse);
      
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Error desconocido al subir el video');
    } finally {
      setIsUploading(false);
    }
  };

  
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="video-upload">
      <div className="video-upload__header">
        <h3>Subir Video</h3>
        <p>Selecciona un archivo de video para subir a la plataforma</p>
      </div>

      <div
        className={`video-upload__dropzone ${dragActive ? 'video-upload__dropzone--active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.map(format => `.${format}`).join(',')}
          onChange={handleFileInputChange}
          className="video-upload__input"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <div className="video-upload__placeholder">
            <div className="video-upload__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h4>Arrastra y suelta tu video aquí</h4>
            <p>o haz clic para seleccionar un archivo</p>
            <div className="video-upload__formats">
              <p>Formatos soportados: {acceptedFormats.join(', ')}</p>
              <p>Tamaño máximo: {Math.round(maxFileSize / (1024 * 1024))}MB</p>
            </div>
          </div>
        ) : (
          <div className="video-upload__file-info">
            <div className="video-upload__preview">
              {previewUrl && (
                <video
                  src={previewUrl}
                  className="video-upload__preview-video"
                  controls
                  muted
                />
              )}
            </div>
            <div className="video-upload__file-details">
              <h4>{selectedFile.name}</h4>
              <p>Tamaño: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              <p>Tipo: {selectedFile.type}</p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="video-upload__actions">
          {isUploading ? (
            <div className="video-upload__progress">
              <div className="video-upload__progress-bar">
                <div 
                  className="video-upload__progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>Subiendo... {Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div className="video-upload__buttons">
              <button
                type="button"
                onClick={handleUpload}
                className="video-upload__button video-upload__button--primary"
                disabled={!cloudinaryService.isConfigured()}
              >
                Subir Video
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="video-upload__button video-upload__button--secondary"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {!cloudinaryService.isConfigured() && (
        <div className="video-upload__warning">
          <p>⚠️ Cloudinary no está configurado. Por favor, configura las variables de entorno.</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
