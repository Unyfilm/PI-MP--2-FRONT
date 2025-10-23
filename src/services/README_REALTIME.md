# Sistema de Tiempo Real para Calificaciones

## 🎯 Objetivo

Implementar sincronización en tiempo real de calificaciones entre diferentes usuarios sin necesidad de recargar la página.

## 🏗️ Arquitectura Actual

### Frontend (Implementado)
- ✅ **Eventos locales**: Funcionan en la misma página
- ✅ **Sistema de eventos**: `ratingEventSystem.ts`
- ✅ **Hooks de tiempo real**: `useRealtimeRatings.ts`
- ✅ **Simulador**: Para testing entre usuarios

### Backend (Pendiente)
- ❌ **Server-Sent Events (SSE)**: Para notificaciones del servidor
- ❌ **WebSockets**: Alternativa más robusta
- ❌ **Broadcasting**: Para enviar eventos a todos los usuarios

## 🚀 Implementación del Backend

### Opción 1: Server-Sent Events (SSE) - Recomendado

```javascript
// backend/routes/realtime.js
const express = require('express');
const router = express.Router();

// Almacenar conexiones activas
const activeConnections = new Set();

router.get('/api/realtime/events', (req, res) => {
  // Configurar SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Agregar conexión
  const connection = { res, id: Date.now() };
  activeConnections.add(connection);

  // Enviar evento de conexión
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Conectado al servidor de eventos'
  })}\n\n`);

  // Manejar desconexión
  req.on('close', () => {
    activeConnections.delete(connection);
  });
});

// Función para broadcast a todos los usuarios
function broadcastToAllUsers(event) {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  
  activeConnections.forEach(connection => {
    try {
      connection.res.write(message);
    } catch (error) {
      // Remover conexión si hay error
      activeConnections.delete(connection);
    }
  });
}

// Endpoint para recibir eventos de rating
router.post('/api/realtime/broadcast', (req, res) => {
  const { type, movieId, data } = req.body;
  
  // Broadcast a todos los usuarios conectados
  broadcastToAllUsers({
    type,
    movieId,
    data,
    timestamp: Date.now()
  });
  
  res.json({ success: true });
});

module.exports = router;
```

### Opción 2: WebSockets (Más Robusto)

```javascript
// backend/websocket.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  clients.add(ws);
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Broadcast a todos los clientes
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});
```

## 🔧 Integración con el Sistema Actual

### 1. Modificar `ratingService.ts`

```typescript
// Después de una calificación exitosa, notificar al servidor
export const rateMovie = async (movieId: string, rating: number): Promise<RatingResponse> => {
  // ... código existente ...
  
  if (data.success) {
    // Notificar al servidor para broadcast
    await fetch('/api/realtime/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'rating-updated',
        movieId,
        data: { rating, action: 'create' }
      })
    });
  }
  
  return data;
};
```

### 2. Actualizar `realtimeService.ts`

```typescript
// Reemplazar la implementación mock con SSE real
export class RealtimeService {
  connect() {
    this.eventSource = new EventSource('/api/realtime/events');
    // ... resto del código ...
  }
}
```

## 🧪 Testing

### Simulador Actual
- ✅ **Eventos manuales**: Botón "Simular Evento"
- ✅ **Eventos aleatorios**: Cada 10 segundos
- ✅ **Estado de conexión**: Indicador visual

### Testing Real
1. **Abrir dos pestañas** del navegador
2. **Calificar en una pestaña**
3. **Verificar que se actualice en la otra pestaña**

## 📋 Checklist de Implementación

### Backend
- [ ] Implementar endpoint SSE `/api/realtime/events`
- [ ] Implementar endpoint de broadcast `/api/realtime/broadcast`
- [ ] Integrar con sistema de calificaciones existente
- [ ] Manejar reconexión automática
- [ ] Logging y monitoreo

### Frontend
- [x] Sistema de eventos locales
- [x] Hooks de tiempo real
- [x] Simulador para testing
- [ ] Integrar con SSE real
- [ ] Manejar errores de conexión

## 🎯 Resultado Esperado

Una vez implementado el backend:

1. **Usuario A** califica una película
2. **Servidor** recibe la calificación
3. **Servidor** envía evento a todos los usuarios conectados
4. **Usuario B** recibe el evento automáticamente
5. **Usuario B** ve la actualización sin recargar la página

## 🔍 Debugging

### Logs a Revisar
- `🔌 [REALTIME] Conectando al servidor...`
- `📡 [REALTIME] Evento recibido del servidor:`
- `🎯 [REALTIME] Procesando evento rating-updated`

### Indicadores Visuales
- **Estado de conexión**: Esquina superior derecha
- **Simulador**: Esquina inferior derecha
- **Debugger**: Eventos en tiempo real

## 🚀 Próximos Pasos

1. **Implementar backend SSE** según el código de ejemplo
2. **Integrar con el sistema de calificaciones** existente
3. **Probar con múltiples usuarios** reales
4. **Optimizar rendimiento** y manejo de errores
5. **Implementar WebSockets** para mayor robustez
