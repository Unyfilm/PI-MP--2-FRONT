
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);


const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // URLs de tu frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(cors());
app.use(express.json());


const connectedUsers = new Map();


io.on('connection', (socket) => {
  console.log('👤 Usuario conectado:', socket.id);
  
  
  connectedUsers.set(socket.id, {
    id: socket.id,
    connectedAt: new Date()
  });

  
  socket.on('rating-updated', (data) => {
    console.log('📊 Rating actualizado:', data);
    
    
    socket.broadcast.emit('rating-updated', {
      ...data,
      timestamp: Date.now()
    });
  });

  
  socket.on('rating-stats-updated', (data) => {
    console.log('📈 Estadísticas actualizadas:', data);
    
    
    socket.broadcast.emit('rating-stats-updated', {
      ...data,
      timestamp: Date.now()
    });
  });

  
  socket.on('disconnect', () => {
    console.log('👋 Usuario desconectado:', socket.id);
    connectedUsers.delete(socket.id);
  });
});


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

