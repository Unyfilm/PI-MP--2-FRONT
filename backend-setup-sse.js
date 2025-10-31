
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const sseClients = new Set();


app.get('/api/realtime/events', (req, res) => {
 
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  
  sseClients.add(res);
  console.log('👤 Cliente SSE conectado. Total:', sseClients.size);

 
  res.write(`data: ${JSON.stringify({
    type: 'connected',
    message: 'Conectado al servidor de tiempo real',
    timestamp: Date.now()
  })}\n\n`);

  
  req.on('close', () => {
    sseClients.delete(res);
    console.log('👋 Cliente SSE desconectado. Total:', sseClients.size);
  });
});


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


app.post('/api/realtime/simulate-rating', (req, res) => {
  const { movieId, rating, action } = req.body;
  
  console.log('📊 Simulando rating:', { movieId, rating, action });
  
  
  broadcastToSSEClients('rating-updated', {
    movieId,
    rating,
    action,
    userId: 'simulated-user',
    timestamp: Date.now()
  });

  res.json({ success: true, message: 'Rating simulado enviado' });
});


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
