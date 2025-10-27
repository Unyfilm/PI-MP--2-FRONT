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
const express = require('express');
const router = express.Router();

const activeConnections = new Set();

router.get('/api/realtime/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const connection = { res, id: Date.now() };
  activeConnections.add(connection);

  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Conectado al servidor de eventos'
  })}\n\n`);

  req.on('close', () => {
    activeConnections.delete(connection);
  });
});

function broadcastToAllUsers(event) {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  
  activeConnections.forEach(connection => {
    try {
      connection.res.write(message);
    } catch (error) {
      activeConnections.delete(connection);
    }
  });
}

router.post('/api/realtime/broadcast', (req, res) => {
  const { type, movieId, data } = req.body;
  
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
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  clients.add(ws);
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
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
export const rateMovie = async (movieId: string, rating: number): Promise<RatingResponse> => {
  
  if (data.success) {
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

export class RealtimeService {
  connect() {
    this.eventSource = new EventSource('/api/realtime/events');
    
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
