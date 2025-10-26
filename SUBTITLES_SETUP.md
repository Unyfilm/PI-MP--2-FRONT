# 🎬 Configuración de Subtítulos con IA - UnyFilm

Esta guía te ayudará a configurar subtítulos automáticos usando **faster-whisper** y **Cloudinary** en tu proyecto UnyFilm.

## 📋 Requisitos Previos

1. **Python 3.9+** instalado
2. **ffmpeg** instalado en tu sistema
3. **Credenciales de Cloudinary** configuradas en `env.local`
4. **Node.js y npm** (ya tienes esto)

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias Python

```bash
# Navegar a la carpeta del proyecto
cd PI-MP--2-FRONT

# Instalar dependencias
pip install -r scripts/requirements.txt
```

### 2. Instalar ffmpeg

**Windows:**
```bash
# Con Chocolatey
choco install ffmpeg

# O descargar desde https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

### 3. Configurar Variables de Entorno

Asegúrate de que tu `env.local` tenga las credenciales correctas:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
VITE_CLOUDINARY_API_KEY=tu_api_key_real
VITE_CLOUDINARY_API_SECRET=tu_api_secret_real
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset_real
```

## 🎯 Uso del Sistema

### Opción 1: Generar Subtítulos para TODOS los Videos

```bash
# Ejecutar desde la carpeta del proyecto
python scripts/generate_subtitles.py
```

### Opción 2: Generar Subtítulos para un Video Específico

```bash
# Reemplaza "movies/videos/mi-pelicula" con el public_id real
python scripts/generate_subtitles.py "movies/videos/mi-pelicula"
```

### Opción 3: Usar el Componente de Administración

1. **Importar el componente** en tu aplicación:
```typescript
import SubtitleGenerator from './components/admin/SubtitleGenerator';

// En tu componente de administración
<SubtitleGenerator onClose={() => setShowGenerator(false)} />
```

2. **Seleccionar película** y hacer clic en "Generar Subtítulos"

## 🔧 Configuración Avanzada

### Cambiar Idioma de Transcripción

Edita `scripts/generate_subtitles.py`:

```python
# Cambiar esta línea
LANG = "es"  # Cambia a 'en' para inglés, 'fr' para francés, etc.
```

### Usar GPU para Mejor Rendimiento

Si tienes una GPU NVIDIA con CUDA:

```python
# Cambiar esta línea en el script
DEVICE = "cuda"  # En lugar de "auto"
```

### Cambiar Modelo de IA

Para mejor calidad (más lento):
```python
MODEL_NAME = "large-v3"
```

Para velocidad (menor calidad):
```python
MODEL_NAME = "medium"
```

## 📁 Estructura de Archivos Generados

```
Cloudinary:
├── videos/
│   ├── mi-pelicula.mp4
│   └── otra-pelicula.mp4
└── subtitles/
    ├── mi-pelicula_es.vtt
    ├── mi-pelicula_en.vtt
    └── otra-pelicula_es.vtt
```

## 🎬 Cómo Funciona en el Frontend

### 1. Detección Automática

El reproductor detecta automáticamente si existen subtítulos:

```typescript
// En UnyFilmPlayer.tsx
const available = await cloudinaryService.getAvailableSubtitles(movie.cloudinaryVideoId);
```

### 2. Carga de Subtítulos

Los subtítulos se cargan automáticamente cuando se abre un video:

```typescript
// El reproductor carga subtítulos en español por defecto
const subtitleUrl = cloudinaryService.generateSubtitleUrl(movie.cloudinaryVideoId, 'es');
```

### 3. Selector de Idiomas

Si hay múltiples idiomas, aparece un selector:

```typescript
// El usuario puede cambiar entre idiomas disponibles
{availableSubtitles.map(lang => (
  <option key={lang} value={lang}>
    {lang === 'es' ? 'Español' : 'English'}
  </option>
))}
```

## 🚨 Solución de Problemas

### Error: "ffmpeg not found"

```bash
# Verificar instalación
ffmpeg -version

# Si no está instalado, instalar según tu sistema
```

### Error: "Cloudinary configuration missing"

Verifica que tu `env.local` tenga las credenciales correctas:

```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
```

### Error: "No module named 'faster_whisper'"

```bash
# Reinstalar dependencias
pip install -r scripts/requirements.txt
```

### Subtítulos no aparecen en el reproductor

1. **Verificar que se generaron:** Revisa en Cloudinary si existen los archivos `.vtt`
2. **Verificar URL:** Comprueba que la URL del subtítulo sea correcta
3. **Verificar formato:** Asegúrate de que el archivo sea formato VTT válido

## 📊 Rendimiento y Optimización

### Tiempos de Procesamiento

- **Video de 10 minutos:** ~2-3 minutos
- **Video de 30 minutos:** ~5-8 minutos
- **Video de 1 hora:** ~10-15 minutos

### Optimizaciones

1. **Usar GPU:** Reduce tiempo a la mitad
2. **Modelo más pequeño:** `medium` en lugar de `large-v3`
3. **Procesar en lote:** Mejor para múltiples videos

## 🔄 Automatización

### Script de Cron (Linux/macOS)

```bash
# Editar crontab
crontab -e

# Ejecutar cada 6 horas
0 */6 * * * cd /ruta/a/tu/proyecto && python scripts/generate_subtitles.py
```

### Task Scheduler (Windows)

1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Configurar para ejecutar el script Python

## 📈 Monitoreo

### Verificar Progreso

```bash
# El script muestra progreso en tiempo real
🎬 Procesando video: movies/videos/mi-pelicula
📥 Descargando video...
🎵 Extrayendo audio...
🧠 Transcribiendo con IA...
☁️ Subiendo subtítulos...
✅ Subtítulos generados para: movies/videos/mi-pelicula
```

### Verificar en Cloudinary

1. Ve a tu dashboard de Cloudinary
2. Busca la carpeta `subtitles/`
3. Verifica que existan los archivos `.vtt`

## 🎉 ¡Listo!

Una vez configurado, tu sistema:

1. **Genera subtítulos automáticamente** para todos los videos
2. **Los carga automáticamente** en el reproductor
3. **Permite cambiar idiomas** si hay múltiples disponibles
4. **Funciona sin cambios** en tu frontend existente

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** del script Python
2. **Verifica las credenciales** de Cloudinary
3. **Comprueba la instalación** de ffmpeg
4. **Revisa la consola** del navegador para errores

¡Disfruta de tus subtítulos automáticos! 🎬✨
