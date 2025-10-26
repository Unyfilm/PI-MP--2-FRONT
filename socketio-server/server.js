
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "http://localhost:3000",  
      "http://localhost:4173", 
      "https://your-domain.com" 
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

const connectedUsers = new Map();
let totalConnections = 0;

io.on('connection', (socket) => {
  totalConnections++;
  const userInfo = {
    id: socket.id,
    connectedAt: new Date(),
    connectionNumber: totalConnections
  };
  
  connectedUsers.set(socket.id, userInfo);
  
  console.log(`👤 Usuario conectado: ${socket.id} (Total: ${connectedUsers.size})`);

  socket.emit('connected', {
    message: 'Conectado al servidor de tiempo real',
    socketId: socket.id,
    totalUsers: connectedUsers.size,
    timestamp: Date.now()
  });

  socket.on('rating-updated', (data) => {
    console.log('📊 Rating actualizado recibido:', data);
    
    if (!data.movieId || !data.rating) {
      console.warn('⚠️ Datos de rating inválidos:', data);
      return;
    }

    socket.broadcast.emit('rating-updated', {
      ...data,
      timestamp: Date.now(),
      serverProcessed: true
    });

    console.log(`📡 Rating broadcasted a ${connectedUsers.size - 1} usuarios`);
  });

  socket.on('rating-stats-updated', (data) => {
    console.log('📈 Estadísticas actualizadas recibidas:', data);
    
    socket.broadcast.emit('rating-stats-updated', {
      ...data,
      timestamp: Date.now(),
      serverProcessed: true
    });

    console.log(`📡 Estadísticas broadcasted a ${connectedUsers.size - 1} usuarios`);
  });

  socket.on('test-event', (data) => {
    console.log('🧪 Evento de prueba recibido:', data);
    
    socket.broadcast.emit('test-event-response', {
      originalData: data,
      serverResponse: 'Evento recibido correctamente',
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', (reason) => {
    connectedUsers.delete(socket.id);
    console.log(`👋 Usuario desconectado: ${socket.id} (Razón: ${reason}) (Total: ${connectedUsers.size})`);
  });

  socket.on('error', (error) => {
    console.error(`❌ Error en socket ${socket.id}:`, error);
  });
});

app.get('/api/realtime/stats', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    totalConnections,
    uptime: process.uptime(),
    timestamp: Date.now(),
    users: Array.from(connectedUsers.values())
  });
});

app.post('/api/realtime/simulate-rating', (req, res) => {
  const { movieId, rating, action } = req.body;
  
  if (!movieId || !rating) {
    return res.status(400).json({ 
      error: 'movieId y rating son requeridos' 
    });
  }

  console.log('📊 Simulando rating desde API:', { movieId, rating, action });
  
  io.emit('rating-updated', {
    movieId,
    rating,
    action: action || 'create',
    userId: 'api-simulated-user',
    timestamp: Date.now(),
    source: 'api'
  });

  res.json({ 
    success: true, 
    message: 'Rating simulado enviado a todos los usuarios',
    connectedUsers: connectedUsers.size
  });
});

app.get('/api/realtime/test', (req, res) => {
  res.json({
    message: 'Servidor Socket.io funcionando correctamente',
    connectedUsers: connectedUsers.size,
    timestamp: Date.now()
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'Servidor Socket.io para UnyFilm',
    endpoints: {
      stats: '/api/realtime/stats',
      test: '/api/realtime/test',
      simulate: 'POST /api/realtime/simulate-rating'
    },
    connectedUsers: connectedUsers.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.io corriendo en puerto ${PORT}`);
  console.log(`📡 WebSocket disponible en: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP API disponible en: http://localhost:${PORT}`);
  console.log(`📊 Estadísticas: http://localhost:${PORT}/api/realtime/stats`);
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
