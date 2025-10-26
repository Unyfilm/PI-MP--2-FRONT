
const { io } = require('socket.io-client');

console.log('🧪 Probando conexión al servidor Socket.io...');

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Conectado al servidor:', socket.id);
  
  socket.emit('test-event', {
    message: 'Prueba desde script',
    timestamp: Date.now()
  });
});

socket.on('test-event-response', (data) => {
  console.log('📡 Respuesta del servidor:', data);
  console.log('✅ Prueba exitosa!');
  process.exit(0);
});

socket.on('connected', (data) => {
  console.log('📊 Estado del servidor:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor');
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

setTimeout(() => {
  console.log('⏰ Timeout - No se pudo conectar al servidor');
  process.exit(1);
}, 10000);
