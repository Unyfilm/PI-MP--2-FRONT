# Configuración de Producción - UnyFilm

## 🚀 Configuración de Favoritos para Producción

### Variables de Entorno Requeridas

```bash
# API Configuration
VITE_API_BASE_URL=https://pi-mp-2-back-prod.onrender.com/api
VITE_API_TIMEOUT=30000
VITE_NODE_ENV=production

# Features
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dlyqtvvxv
VITE_CLOUDINARY_API_KEY=your_production_api_key
VITE_CLOUDINARY_API_SECRET=your_production_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_production_upload_preset
```

### Endpoints de Favoritos en Producción

Los siguientes endpoints deben estar disponibles en el backend de producción:

- `GET /api/favorites/me` - Obtener favoritos del usuario
- `POST /api/favorites` - Agregar película a favoritos
- `DELETE /api/favorites/:id` - Eliminar favorito
- `PUT /api/favorites/:id` - Actualizar favorito
- `GET /api/favorites/me/:id` - Obtener favorito específico
- `GET /api/favorites/:userId` - Obtener favoritos de usuario
- `GET /api/users/profile` - Obtener perfil del usuario

### Configuración de Build

```bash
# Build para producción
npm run build:production

# O build estándar
npm run build
```

### Verificación de Producción

1. **Verificar endpoints del backend:**
   ```bash
   curl -X GET https://pi-mp-2-back-prod.onrender.com/api/health
   ```

2. **Verificar autenticación:**
   - Login funcional
   - Token JWT válido
   - Perfil de usuario accesible

3. **Verificar favoritos:**
   - Agregar película a favoritos
   - Ver lista de favoritos
   - Eliminar de favoritos
   - Actualizar favoritos

### Troubleshooting

#### Error: "No authentication token found"
- Verificar que el usuario esté logueado
- Verificar que el token esté en localStorage
- Verificar que el token no haya expirado

#### Error: "User ID must be a valid MongoDB ObjectId"
- El backend espera un ObjectId de MongoDB
- El servicio intenta extraer el ObjectId del JWT token
- Si falla, intenta obtenerlo del endpoint `/users/profile`
- Como último recurso, genera un ObjectId temporal

#### Error: "Validation failed"
- Verificar que movieId sea válido
- Verificar que userId sea válido
- Verificar que los datos no estén vacíos

#### Error: "Solo puedes gestionar tus propios favoritos"
- El userId en el request body debe coincidir con el del JWT token
- Verificar que el usuario esté autenticado correctamente

### Optimizaciones de Producción

1. **Cache de favoritos:** 30 segundos de duración
2. **Timeout de requests:** 30 segundos
3. **Retry automático:** 3 intentos con backoff exponencial
4. **Manejo de errores:** Mensajes específicos para cada tipo de error
5. **Logging:** Solo errores en producción

### Monitoreo

- Verificar logs del backend para errores 400, 401, 403, 404, 409
- Monitorear tiempo de respuesta de los endpoints
- Verificar que el cache funcione correctamente
- Verificar que no haya memory leaks en el frontend

### Despliegue

El proyecto se despliega automáticamente en Vercel cuando se hace push a la rama `main` o `develop`.

La configuración de Vercel está en `vercel.json` y incluye:
- Variables de entorno de producción
- Configuración de build optimizada
- Rewrites para SPA
