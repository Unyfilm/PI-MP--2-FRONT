
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
    
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: this.cloudName
      }
    });
  }

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
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

 
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
      throw new Error(`Failed to get video information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  
  generateVideoUrl(publicId: string, transformations: string = ''): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/video/upload`;
    const transformationString = transformations ? `/${transformations}` : '';
    return `${baseUrl}${transformationString}/${publicId}`;
  }

 
  generateThumbnailUrl(publicId: string, time: number = 1, width: number = 300): string {
    const transformations = `w_${width},h_auto,c_fill,so_${time}`;
    return this.generateVideoUrl(publicId, transformations);
  }


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
      throw new Error(`Failed to delete video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  
  private async generateSignature(publicId: string, timestamp: number): Promise<string> {
    const message = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.API_SECRET}`;
    
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    
    return Math.abs(hash).toString(16);
  }

  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset);
  }

 
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

 
  generateSubtitleUrl(videoPublicId: string, language: string = 'es'): string {
    const basePublicId = videoPublicId.replace('movies/videos/', '');
    const subtitlePublicId = `subtitles/${basePublicId}_${language}`;
    
    const url = `https://res.cloudinary.com/${this.cloudName}/raw/upload/${subtitlePublicId}.vtt`;
    
    return url;
  }

  async checkSubtitlesExist(videoPublicId: string, language: string = 'es'): Promise<boolean> {
    try {
      const subtitleUrl = this.generateSubtitleUrl(videoPublicId, language);
      const response = await fetch(subtitleUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`Error checking subtitles for ${videoPublicId}_${language}:`, error);
      return false;
    }
  }


  async getAvailableSubtitles(videoPublicId: string): Promise<string[]> {
    const languages = ['es', 'en']; 
    const availableLanguages: string[] = [];

    for (const lang of languages) {
      const exists = await this.checkSubtitlesExist(videoPublicId, lang);
      if (exists) {
        availableLanguages.push(lang);
      }
    }

    return availableLanguages;
  }

  async loadSubtitleContent(videoPublicId: string, language: string = 'es'): Promise<string> {
    try {
      const subtitleUrl = this.generateSubtitleUrl(videoPublicId, language);
      const response = await fetch(subtitleUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load subtitles: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      throw new Error(`Failed to load subtitle content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  
  async loadSubtitleFromUrl(subtitleUrl: string): Promise<string> {
    try {
      const response = await fetch(subtitleUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load subtitles: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      throw new Error(`Failed to load subtitle content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
