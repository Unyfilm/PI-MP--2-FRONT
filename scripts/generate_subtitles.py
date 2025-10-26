#!/usr/bin/env python3
"""
Script para generar subtítulos automáticamente usando faster-whisper
Integrado con tu sistema UnyFilm existente
"""

import os
import sys
import tempfile
import subprocess
import requests
from pathlib import Path
from cloudinary import api, uploader, config
from faster_whisper import WhisperModel
import webvtt
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('env.local')

# Configuración desde tu env.local
CLOUD_NAME = os.getenv('VITE_CLOUDINARY_CLOUD_NAME', 'dlyqtvvxv')
API_KEY = os.getenv('VITE_CLOUDINARY_API_KEY')
API_SECRET = os.getenv('VITE_CLOUDINARY_API_SECRET')

# Verificar configuración
if not API_KEY or not API_SECRET:
    print("Error: Configuración de Cloudinary no encontrada")
    print("Verifica que VITE_CLOUDINARY_API_KEY y VITE_CLOUDINARY_API_SECRET estén en env.local")
    sys.exit(1)

# Configuración de transcripción
LANG = "es"  # Cambia a 'en' para inglés
MODEL_NAME = "large-v3"  # "medium" si tu máquina es más modesta
DEVICE = "auto"  # "cuda" si tienes GPU, "cpu" si no

# Configurar Cloudinary
config(cloud_name=CLOUD_NAME, api_key=API_KEY, api_secret=API_SECRET)

def to_srt_timestamp(ts: float) -> str:
    """Convertir tiempo a formato SRT"""
    h = int(ts // 3600)
    m = int((ts % 3600) // 60)
    s = int(ts % 60)
    ms = int((ts % 1) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

def extract_audio(video_path: str, audio_path: str) -> None:
    """Extraer audio del video usando ffmpeg"""
    # Usar la ruta completa de ffmpeg
    ffmpeg_path = os.path.join(os.getcwd(), "ffmpeg", "ffmpeg-8.0-full_build", "bin", "ffmpeg.exe")
    cmd = [
        ffmpeg_path, "-y", "-i", video_path,
        "-ac", "1", "-ar", "16000",  # 16kHz mono
        audio_path
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error extrayendo audio: {e}")

def transcribe_to_vtt(audio_path: str, vtt_path: str) -> None:
    """Transcribir audio a VTT usando faster-whisper"""
    
    model = WhisperModel(MODEL_NAME, device=DEVICE)
    segments, info = model.transcribe(
        audio_path, 
        language=LANG, 
        vad_filter=True, 
        beam_size=5
    )
    
    # Crear SRT temporal
    srt_path = vtt_path.replace(".vtt", ".srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments, 1):
            start_time = to_srt_timestamp(segment.start)
            end_time = to_srt_timestamp(segment.end)
            text = segment.text.strip()
            
            f.write(f"{i}\n{start_time} --> {end_time}\n{text}\n\n")
    
    # Convertir SRT a VTT
    webvtt.from_srt(srt_path).save(vtt_path)

def subtitle_exists(public_id: str) -> bool:
    """Verificar si ya existen subtítulos"""
    try:
        api.resource(f"subtitles/{public_id}_{LANG}", resource_type="raw")
        return True
    except:
        return False

def download_video(video_url: str, output_path: str) -> None:
    """Descargar video desde Cloudinary"""
    with requests.get(video_url, stream=True) as r:
        r.raise_for_status()
        with open(output_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

def upload_subtitle(vtt_path: str, public_id: str) -> None:
    """Subir subtítulos a Cloudinary"""
    
    uploader.upload(
        vtt_path,
        resource_type="raw",
        public_id=f"subtitles/{public_id}_{LANG}",
        overwrite=True,
        tags=[f"subtitle", f"language-{LANG}", "ai-generated"]
    )

def process_video(public_id: str) -> bool:
    """Procesar un video específico"""
    # Verificar si ya existen subtítulos
    if subtitle_exists(public_id):
        return True
    
    # URL del video en Cloudinary
    video_url = f"https://res.cloudinary.com/{CLOUD_NAME}/video/upload/{public_id}.mp4"
    
    with tempfile.TemporaryDirectory() as temp_dir:
        mp4_path = os.path.join(temp_dir, "video.mp4")
        wav_path = os.path.join(temp_dir, "audio.wav")
        vtt_path = os.path.join(temp_dir, "subtitles.vtt")
        
        try:
            # Descargar video
            download_video(video_url, mp4_path)
            
            # Extraer audio
            extract_audio(mp4_path, wav_path)
            
            # Transcribir
            transcribe_to_vtt(wav_path, vtt_path)
            
            # Subir subtítulos
            upload_subtitle(vtt_path, public_id)
            
            return True
            
        except Exception as e:
            return False

def get_all_videos() -> list:
    """Obtener todos los videos de Cloudinary"""
    
    videos = []
    next_cursor = None
    
    while True:
        try:
            res = api.resources(
                type="upload",
                resource_type="video",
                max_results=100,
                next_cursor=next_cursor
            )
            
            for item in res.get("resources", []):
                videos.append(item["public_id"])
            
            next_cursor = res.get("next_cursor")
            if not next_cursor:
                break
                
        except Exception as e:
            break
    
    return videos

def process_all_videos() -> None:
    """Procesar todos los videos"""
    videos = get_all_videos()
    processed = 0
    failed = 0
    
    for i, public_id in enumerate(videos, 1):
        if process_video(public_id):
            processed += 1
        else:
            failed += 1

def main():
    """Función principal"""
    if len(sys.argv) > 1:
        # Procesar video específico
        public_id = sys.argv[1]
        process_video(public_id)
    else:
        # Procesar todos los videos
        process_all_videos()

if __name__ == "__main__":
    main()
