# Sistema de Calificaciones en Tiempo Real

## Descripción
Este sistema permite que las calificaciones de películas se actualicen en tiempo real en todas las tarjetas y componentes de la aplicación sin necesidad de recargar la página.

## Componentes Principales

### 1. RatingEventSystem (`ratingEventSystem.ts`)
- **Propósito**: Sistema de eventos globales para comunicar cambios de calificaciones
- **Funciones**:
  - `emitRatingUpdate()`: Emite eventos cuando se actualiza una calificación
  - `emitStatsUpdate()`: Emite eventos cuando cambian las estadísticas
  - `invalidateCache()`: Invalida caché y notifica a otros componentes

### 2. useRealtimeRatings Hook (`useRealtimeRatings.ts`)
- **Propósito**: Hook personalizado para manejar ratings en tiempo real
- **Características**:
  - Carga automática de estadísticas
  - Escucha eventos de actualización
  - Manejo de errores
  - Cache inteligente

### 3. RatingNotificationManager (`RatingNotificationManager.tsx`)
- **Propósito**: Muestra notificaciones cuando se actualizan calificaciones
- **Características**:
  - Notificaciones no intrusivas
  - Auto-dismiss después de 3 segundos
  - Animaciones suaves
  - Responsive

## Flujo de Actualización

```
1. Usuario califica película
   ↓
2. InteractiveRating envía petición al backend
   ↓
3. ratingService actualiza calificación
   ↓
4. Se emiten eventos: rating-updated, rating-stats-updated
   ↓
5. Todas las UnyFilmCard escuchan eventos
   ↓
6. Se actualizan automáticamente las estrellas
   ↓
7. Se muestra notificación al usuario
```

## Eventos Emitidos

### `rating-updated`
```typescript
{
  movieId: string;
  rating: number;
  action: 'create' | 'update' | 'delete';
  movieTitle?: string;
  userId?: string;
  timestamp: number;
}
```

### `rating-stats-updated`
```typescript
{
  movieId: string;
  averageRating: number;
  totalRatings: number;
  timestamp: number;
}
```

## Uso en Componentes

### En UnyFilmCard
```typescript
const { ratingStats, isLoading } = useRealtimeRatings({
  movieId: movieId || '',
  autoLoad: !!movieId,
  enableRealtime: true
});
```

### En InteractiveRating
```typescript
// Emitir eventos después de calificar
emitRatingUpdate({
  movieId,
  rating,
  action: 'create',
  movieTitle,
  userId: localStorage.getItem('userId')
});
```

## Características del Sistema

### ✅ Ventajas
- **Tiempo Real**: Actualizaciones instantáneas sin recargar
- **Eficiente**: Usa caché para evitar peticiones innecesarias
- **Escalable**: Sistema de eventos desacoplado
- **UX Mejorada**: Notificaciones y feedback visual
- **Robusto**: Manejo de errores 404 y fallbacks

### 🔧 Configuración
- **Cache TTL**: 5 minutos para estadísticas, 1 minuto para 404s
- **Notificaciones**: Auto-dismiss en 3 segundos
- **Throttling**: Evita actualizaciones excesivas
- **Fallbacks**: Estadísticas por defecto si falla la API

## Solución de Problemas

### Error 404 en Producción
- **Causa**: URLs sin `/api` en producción
- **Solución**: Configuración correcta en `environment.ts`
- **Verificación**: `API_CONFIG.BASE_URL` debe incluir `/api`

### Calificaciones No Se Actualizan
- **Verificar**: Eventos se están emitiendo
- **Debug**: Revisar console.log en navegador
- **Cache**: Limpiar caché del navegador

### Notificaciones No Aparecen
- **Verificar**: RatingNotificationManager está en App.tsx
- **CSS**: Verificar que los estilos se cargan
- **Eventos**: Verificar que se emiten `rating-updated`

## Mejoras Futuras
- [ ] Persistencia de notificaciones
- [ ] Sonidos de notificación
- [ ] Modo oscuro/claro para notificaciones
- [ ] Historial de calificaciones
- [ ] Sincronización entre pestañas
