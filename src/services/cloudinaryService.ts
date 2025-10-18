/**
 * Cloudinary Service for UnyFilm
 * @fileoverview Service for handling video uploads and transformations with Cloudinary
 */

import { Cloudinary } from '@cloudinary/url-gen';
import { CLOUDINARY_CONFIG } from '../config/environment';

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

export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
  quality?: string;
  format?: string;
  resource_type?: 'video' | 'image' | 'raw' | 'auto';
}

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
 * Cloudinary service class for video operations
 */
class CloudinaryService {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  baseUrl: string;
  cloudinary: Cloudinary;

  constructor() {
    this.cloudName = CLOUDINARY_CONFIG.CLOUD_NAME;
    this.apiKey = CLOUDINARY_CONFIG.API_KEY;
    this.uploadPreset = CLOUDINARY_CONFIG.UPLOAD_PRESET;
    this.baseUrl = CLOUDINARY_CONFIG.BASE_URL;
    
    // Initialize Cloudinary instance
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: this.cloudName
      }
    });
  }

  /**
   * Upload a video file to Cloudinary
   * @param file - Video file to upload
   * @param options - Upload options
   * @returns Promise with upload response
   */
  async uploadVideo(
    file: File, 
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResponse> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);
    
    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    if (options.transformation) {
      formData.append('transformation', options.transformation);
    }
    if (options.quality) {
      formData.append('quality', options.quality);
    }
    if (options.format) {
      formData.append('format', options.format);
    }
    if (options.resource_type) {
      formData.append('resource_type', options.resource_type);
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get video information from Cloudinary
   * @param publicId - Public ID of the video
   * @returns Promise with video information
   */
  async getVideoInfo(publicId: string): Promise<CloudinaryVideoInfo> {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload/${publicId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get video info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cloudinary get video info error:', error);
      throw new Error(`Failed to get video information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimized video URL with transformations
   * @param publicId - Public ID of the video
   * @param transformations - Cloudinary transformation parameters
   * @returns Optimized video URL
   */
  generateVideoUrl(publicId: string, transformations: string = ''): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/video/upload`;
    const transformationString = transformations ? `/${transformations}` : '';
    return `${baseUrl}${transformationString}/${publicId}`;
  }

  /**
   * Generate thumbnail URL for video
   * @param publicId - Public ID of the video
   * @param time - Time in seconds for thumbnail (default: 1)
   * @param width - Thumbnail width (default: 300)
   * @returns Thumbnail URL
   */
  generateThumbnailUrl(publicId: string, time: number = 1, width: number = 300): string {
    const transformations = `w_${width},h_auto,c_fill,so_${time}`;
    return this.generateVideoUrl(publicId, transformations);
  }

  /**
   * Generate streaming URL with adaptive bitrate
   * @param publicId - Public ID of the video
   * @param quality - Video quality ('auto', 'high', 'medium', 'low')
   * @returns Streaming URL
   */
  generateStreamingUrl(publicId: string, quality: string = 'auto'): string {
    let transformations = '';
    
    switch (quality) {
      case 'high':
        transformations = 'q_auto,f_mp4,br_2000k';
        break;
      case 'medium':
        transformations = 'q_auto,f_mp4,br_1000k';
        break;
      case 'low':
        transformations = 'q_auto,f_mp4,br_500k';
        break;
      default:
        transformations = 'q_auto,f_mp4';
    }

    return this.generateVideoUrl(publicId, transformations);
  }

  /**
   * Delete video from Cloudinary
   * @param publicId - Public ID of the video to delete
   * @returns Promise with deletion result
   */
  async deleteVideo(publicId: string): Promise<{ result: string }> {
    if (!this.apiKey || !CLOUDINARY_CONFIG.API_SECRET) {
      throw new Error('API credentials are required for deletion');
    }

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await this.generateSignature(publicId, timestamp);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            timestamp: timestamp,
            signature: signature,
            api_key: this.apiKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate signature for authenticated requests
   * @param publicId - Public ID
   * @param timestamp - Timestamp
   * @returns Generated signature
   */
  private async generateSignature(publicId: string, timestamp: number): Promise<string> {
    // Note: In a real application, this should be done on the backend
    // for security reasons. This is a simplified version for demo purposes.
    const message = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.API_SECRET}`;
    
    // Simple hash function (in production, use proper crypto library)
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  /**
   * Check if Cloudinary is properly configured
   * @returns True if configuration is valid
   */
  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset);
  }

  /**
   * Get configuration status
   * @returns Configuration status object
   */
  getConfigStatus(): {
    cloudName: boolean;
    uploadPreset: boolean;
    apiKey: boolean;
    configured: boolean;
  } {
    return {
      cloudName: !!this.cloudName,
      uploadPreset: !!this.uploadPreset,
      apiKey: !!this.apiKey,
      configured: this.isConfigured(),
    };
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
