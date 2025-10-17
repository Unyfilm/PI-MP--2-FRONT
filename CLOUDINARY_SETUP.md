# Configuración de Cloudinary para UnyFilm

Esta guía te ayudará a configurar Cloudinary para manejar videos en tu plataforma de streaming UnyFilm.

## 📋 Requisitos Previos

1. Cuenta de Cloudinary (gratuita disponible)
2. Node.js y npm instalados
3. Proyecto UnyFilm configurado

## 🚀 Pasos de Configuración

### 1. Crear cuenta en Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com)
2. Regístrate con tu email
3. Confirma tu cuenta
4. Accede al Dashboard

### 2. Obtener credenciales

En el Dashboard de Cloudinary, encontrarás:

- **Cloud Name**: Nombre de tu cuenta
- **API Key**: Clave pública
- **API Secret**: Clave secreta (manténla privada)

### 3. Configurar Upload Preset

1. Ve a **Settings** → **Upload**
2. Crea un nuevo **Upload Preset**:
   - Nombre: `unyfilm-videos`
   - Signing Mode: `Unsigned` (para subidas desde frontend)
   - Folder: `unyfilm-videos`
   - Resource Type: `Video`
   - Quality: `Auto`

### 4. Configurar variables de entorno

Actualiza tu archivo `env.local` con tus credenciales:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
VITE_CLOUDINARY_API_KEY=tu_api_key_real
VITE_CLOUDINARY_API_SECRET=tu_api_secret_real
VITE_CLOUDINARY_UPLOAD_PRESET=unyfilm-videos
```

### 5. Instalar dependencias

```bash
npm install
```

## 🎬 Funcionalidades Implementadas

### Servicio de Cloudinary (`src/services/cloudinaryService.ts`)

- ✅ Subida de videos
- ✅ Generación de URLs optimizadas
- ✅ Transformaciones de calidad
- ✅ Thumbnails automáticos
- ✅ Streaming adaptativo

### Componente de Subida (`src/components/upload/VideoUpload.tsx`)

- ✅ Drag & Drop
- ✅ Validación de formatos
- ✅ Barra de progreso
- ✅ Preview de video
- ✅ Manejo de errores

### Reproductor Mejorado (`src/components/player/UnyFilmPlayer.tsx`)

- ✅ Calidad adaptativa
- ✅ Soporte para subtítulos
- ✅ URLs optimizadas de Cloudinary
- ✅ Thumbnails personalizados

## 🔧 Uso en tu Aplicación

### Subir un video

```tsx
import VideoUpload from './components/upload/VideoUpload';

function MyComponent() {
  const handleUploadSuccess = (response) => {
    console.log('Video subido:', response.public_id);
    // Guardar en tu base de datos
  };

  const handleUploadError = (error) => {
    console.error('Error:', error);
  };

  return (
    <VideoUpload
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      folder="my-videos"
      tags={['movie', 'upload']}
    />
  );
}
```

### Reproducir video con Cloudinary

```tsx
import UnyFilmPlayer from './components/player/UnyFilmPlayer';

function PlayerComponent() {
  const movie = {
    title: "Mi Película",
    cloudinaryPublicId: "videos/mi-pelicula",
    // ... otros datos
  };

  return (
    <UnyFilmPlayer
      movie={movie}
      cloudinaryPublicId="videos/mi-pelicula"
      quality="auto"
      showSubtitles={true}
      onClose={() => console.log('Cerrar')}
    />
  );
}
```

## 🎯 Transformaciones Disponibles

### Calidad de Video

- **Auto**: Calidad automática basada en conexión
- **High**: 1080p (2MB/s)
- **Medium**: 720p (1MB/s)
- **Low**: 480p (500KB/s)

### URLs Generadas

```typescript
// URL de streaming optimizada
const streamingUrl = cloudinaryService.generateStreamingUrl(publicId, 'high');

// Thumbnail del video
const thumbnailUrl = cloudinaryService.generateThumbnailUrl(publicId, 5, 300);

// URL con transformaciones personalizadas
const customUrl = cloudinaryService.generateVideoUrl(publicId, 'w_800,h_450,c_fill');
```

## 🔒 Seguridad

### Configuración Segura

1. **Nunca** expongas tu API Secret en el frontend
2. Usa **Upload Presets** con modo `Unsigned`
3. Configura **CORS** en Cloudinary para tu dominio
4. Usa **folders** para organizar contenido

### Configuración de CORS

En Cloudinary Dashboard:
1. Ve a **Settings** → **Security**
2. Agrega tu dominio: `https://tu-dominio.vercel.app`
3. Configura **Allowed URL patterns**

## 📊 Monitoreo y Analytics

### Métricas Disponibles

- Tiempo de carga de videos
- Calidad de reproducción
- Errores de subida
- Uso de ancho de banda

### Dashboard de Cloudinary

- Estadísticas de uso
- Almacenamiento utilizado
- Transformaciones aplicadas
- Costos de ancho de banda

## 🚨 Solución de Problemas

### Error: "Cloudinary no está configurado"

**Solución**: Verifica que las variables de entorno estén configuradas correctamente.

```bash
# Verificar variables
echo $VITE_CLOUDINARY_CLOUD_NAME
```

### Error: "Upload failed"

**Posibles causas**:
1. CORS no configurado
2. Upload Preset incorrecto
3. Archivo muy grande
4. Formato no soportado

**Solución**:
```typescript
// Verificar configuración
console.log(cloudinaryService.getConfigStatus());
```

### Video no se reproduce

**Verificar**:
1. URL generada correctamente
2. Video subido exitosamente
3. Permisos de acceso
4. Formato compatible

## 📈 Optimizaciones

### Para Producción

1. **CDN Global**: Cloudinary usa CDN automáticamente
2. **Compresión**: Videos se comprimen automáticamente
3. **Formatos**: Conversión automática a MP4/WebM
4. **Caché**: URLs con versionado para caché eficiente

### Mejores Prácticas

1. **Nombres descriptivos**: `movies/action-2024-trailer`
2. **Tags organizados**: `['movie', 'action', 'trailer']`
3. **Folders estructurados**: `movies/genre/year/`
4. **Calidad apropiada**: Usa 'auto' para mejor experiencia

## 🆘 Soporte

### Recursos Adicionales

- [Documentación Cloudinary](https://cloudinary.com/documentation)
- [API Reference](https://cloudinary.com/documentation/image_transformations)
- [Ejemplos de Transformaciones](https://cloudinary.com/documentation/video_transformations)

### Contacto

Si tienes problemas con la integración:

1. Revisa la consola del navegador
2. Verifica las variables de entorno
3. Consulta la documentación de Cloudinary
4. Contacta al equipo de desarrollo

---

¡Tu plataforma de streaming ahora está lista para manejar videos con Cloudinary! 🎬✨
