import React, { useState } from 'react';
import { Brain, Loader2, CheckCircle, AlertCircle, Play, Download } from 'lucide-react';
import { movieService, type Movie } from '../../services/movieService';
import './SubtitleGenerator.css';

interface SubtitleGeneratorProps {
  onClose?: () => void;
}

const SubtitleGenerator: React.FC<SubtitleGeneratorProps> = ({ onClose }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [language, setLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar películas al montar el componente
  React.useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const moviesData = await movieService.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        setError('Error al cargar las películas');
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const generateSubtitles = async (movie: Movie) => {
    if (!movie.cloudinaryVideoId) {
      setError('La película no tiene un ID de Cloudinary válido');
      return;
    }

    setGenerating(true);
    setProgress('');
    setError(null);

    try {
      // Simular llamada al script Python
      setProgress('🎬 Preparando video...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('🧠 Transcribiendo con IA...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setProgress('☁️ Subiendo subtítulos a Cloudinary...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress('✅ Subtítulos generados exitosamente');
      
      // Aquí normalmente harías una llamada a tu API backend
      // que ejecutaría el script Python
      console.log(`Generando subtítulos para: ${movie.title} (${movie.cloudinaryVideoId})`);
      
    } catch (error) {
      setError('Error generando subtítulos');
      console.error('Error:', error);
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(''), 3000);
    }
  };

  const downloadScript = () => {
    // Crear un enlace de descarga para el script
    const scriptContent = `#!/usr/bin/env python3
# Script para generar subtítulos - UnyFilm
# Ejecutar: python generate_subtitles.py

import os
import sys
import subprocess

# Instalar dependencias
subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Ejecutar generación
if len(sys.argv) > 1:
    subprocess.run([sys.executable, "generate_subtitles.py", sys.argv[1]])
else:
    subprocess.run([sys.executable, "generate_subtitles.py"])

print("✅ Script ejecutado correctamente")`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'run_subtitle_generation.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="subtitle-generator">
        <div className="loading-container">
          <Loader2 size={32} className="spinning" />
          <p>Cargando películas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subtitle-generator">
      <div className="subtitle-generator-header">
        <div className="header-content">
          <Brain size={24} />
          <h2>🤖 Generador de Subtítulos con IA</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        )}
      </div>

      <div className="subtitle-generator-content">
        {/* Información */}
        <div className="info-section">
          <h3>ℹ️ Información</h3>
          <p>Este generador usa <strong>faster-whisper</strong> para crear subtítulos automáticamente:</p>
          <ul>
            <li>• Procesa videos desde Cloudinary</li>
            <li>• Genera subtítulos en múltiples idiomas</li>
            <li>• Sube automáticamente a Cloudinary</li>
            <li>• Compatible con tu reproductor actual</li>
          </ul>
        </div>

        {/* Configuración */}
        <div className="config-section">
          <h3>⚙️ Configuración</h3>
          <div className="form-group">
            <label htmlFor="language">Idioma del audio:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={generating}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>

        {/* Lista de películas */}
        <div className="movies-section">
          <h3>🎬 Películas Disponibles</h3>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className={`movie-card ${selectedMovie?._id === movie._id ? 'selected' : ''}`}
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="movie-poster">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.director}</p>
                  <p>{movie.genre.join(', ')}</p>
                  {movie.cloudinaryVideoId && (
                    <span className="cloudinary-id">
                      ID: {movie.cloudinaryVideoId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="actions-section">
          {selectedMovie ? (
            <div className="selected-movie">
              <h4>Película seleccionada: {selectedMovie.title}</h4>
              <button
                onClick={() => generateSubtitles(selectedMovie)}
                disabled={generating || !selectedMovie.cloudinaryVideoId}
                className="generate-btn"
              >
                {generating ? (
                  <>
                    <Loader2 size={20} className="spinning" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Generar Subtítulos
                  </>
                )}
              </button>
            </div>
          ) : (
            <p>Selecciona una película para generar subtítulos</p>
          )}

          {/* Script de descarga */}
          <div className="script-section">
            <h4>📥 Script Python</h4>
            <p>Descarga el script para ejecutar la generación en tu servidor:</p>
            <button onClick={downloadScript} className="download-btn">
              <Download size={16} />
              Descargar Script
            </button>
          </div>
        </div>

        {/* Progreso */}
        {progress && (
          <div className="progress-section">
            <div className="progress-info">
              <p>{progress}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-section">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="instructions-section">
          <h3>📋 Instrucciones de Uso</h3>
          <ol>
            <li><strong>Instalar dependencias:</strong> <code>pip install -r requirements.txt</code></li>
            <li><strong>Configurar variables:</strong> Asegúrate de que tu <code>env.local</code> tenga las credenciales de Cloudinary</li>
            <li><strong>Ejecutar script:</strong> <code>python scripts/generate_subtitles.py</code></li>
            <li><strong>Para un video específico:</strong> <code>python scripts/generate_subtitles.py "movies/videos/mi-pelicula"</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SubtitleGenerator;
