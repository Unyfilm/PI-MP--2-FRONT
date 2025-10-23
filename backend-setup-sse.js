// Ejemplo de configuración del backend con Server-Sent Events
// Archivo: server.js

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Almacenar clientes SSE conectados
const sseClients = new Set();

// Endpoint SSE para tiempo real
app.get('/api/realtime/events', (req, res) => {
  // Configurar headers para SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Agregar cliente a la lista
  sseClients.add(res);
  console.log('👤 Cliente SSE conectado. Total:', sseClients.size);

  // Enviar evento de conexión
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Conectado al servidor de tiempo real',
    timestamp: Date.now()
  })}\n\n`);

  // Manejar desconexión
  req.on('close', () => {
    sseClients.delete(res);
    console.log('👋 Cliente SSE desconectado. Total:', sseClients.size);
  });
});

// Función para broadcast a todos los clientes SSE
function broadcastToSSEClients(eventType, data) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (error) {
      console.error('Error enviando a cliente SSE:', error);
      sseClients.delete(client);
    }
  });
}

// Endpoint para simular rating (para testing)
app.post('/api/realtime/simulate-rating', (req, res) => {
  const { movieId, rating, action } = req.body;
  
  console.log('📊 Simulando rating:', { movieId, rating, action });
  
  // Broadcast a todos los clientes conectados
  broadcastToSSEClients('rating-updated', {
    movieId,
    rating,
    action,
    userId: 'simulated-user',
    timestamp: Date.now()
  });

  res.json({ success: true, message: 'Rating simulado enviado' });
});

// Endpoint para obtener estadísticas
app.get('/api/realtime/stats', (req, res) => {
  res.json({
    connectedClients: sseClients.size,
    timestamp: Date.now()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor SSE corriendo en puerto ${PORT}`);
});

// Instalar dependencias:
// npm install express cors
