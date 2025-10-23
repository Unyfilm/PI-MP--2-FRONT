// Ejemplo de configuración del backend con Socket.io
// Archivo: server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configurar CORS para Socket.io
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // URLs de tu frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Almacenar usuarios conectados
const connectedUsers = new Map();

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('👤 Usuario conectado:', socket.id);
  
  // Almacenar usuario
  connectedUsers.set(socket.id, {
    id: socket.id,
    connectedAt: new Date()
  });

  // Escuchar eventos de rating
  socket.on('rating-updated', (data) => {
    console.log('📊 Rating actualizado:', data);
    
    // Emitir a TODOS los usuarios conectados (excepto al que envió)
    socket.broadcast.emit('rating-updated', {
      ...data,
      timestamp: Date.now()
    });
  });

  // Escuchar eventos de estadísticas
  socket.on('rating-stats-updated', (data) => {
    console.log('📈 Estadísticas actualizadas:', data);
    
    // Emitir a TODOS los usuarios conectados
    socket.broadcast.emit('rating-stats-updated', {
      ...data,
      timestamp: Date.now()
    });
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('👋 Usuario desconectado:', socket.id);
    connectedUsers.delete(socket.id);
  });
});

// Endpoint para obtener estadísticas de conexión
app.get('/api/realtime/stats', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    users: Array.from(connectedUsers.values())
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor WebSocket corriendo en puerto ${PORT}`);
});

// Instalar dependencias:
// npm install express socket.io cors
