import React, { useState, useEffect } from 'react';
import { simulateRatingEvent, simulateStatsEvent } from '../../services/mockRealtimeServer';
import { getRealTimeStatus as getRealtimeStatus } from '../../services/realtimeService';
import { crossTabService } from '../../services/crossTabService';
import { getRealTimeStatus as getSocketStatus } from '../../services/realTimeService';
import './RealtimeTestPanel.css';

/**
 * Panel de prueba para verificar la funcionalidad de tiempo real
 * Solo se muestra en desarrollo
 */
const RealtimeTestPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [crossTabStatus, setCrossTabStatus] = useState<any>(null);
  const [socketStatus, setSocketStatus] = useState<any>(null);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      updateConnectionStatus();
      updateCrossTabStatus();
      updateSocketStatus();
    }
  }, []);

  const updateConnectionStatus = () => {
    const status = getRealtimeStatus();
    setConnectionStatus(status);
  };

  const updateCrossTabStatus = () => {
    const status = {
      isListening: crossTabService['isListening'],
      hasBroadcastChannel: !!crossTabService['broadcastChannel']
    };
    setCrossTabStatus(status);
  };

  const updateSocketStatus = () => {
    const status = getSocketStatus();
    setSocketStatus(status);
  };

  const handleSimulateRating = () => {
    // Usar IDs reales de películas
    const movieIds = [
      '68f84e9aba5b03d95f2d6ce1', // Superman (2025)
      '68f84e9aba5b03d95f2d6ce2', // Mortal Kombat 2
      '68f84e9aba5b03d95f2d6ce3', // Tron: Ares
      '68f84e9aba5b03d95f2d6ce4', // Avatar: El Origen del Agua
    ];
    
    const movieId = movieIds[Math.floor(Math.random() * movieIds.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    const action = Math.random() > 0.5 ? 'create' : 'update';
    
    console.log('🧪 [TEST] Simulando evento de rating:', { movieId, rating, action });
    console.log('🧪 [TEST] Busca la card con ID:', movieId);
    simulateRatingEvent(movieId, rating, action);
  };

  const handleSimulateStats = () => {
    const movieId = '68f84e9aba5b03d95f2d6ce1';
    const averageRating = Math.random() * 5;
    const totalRatings = Math.floor(Math.random() * 100) + 1;
    
    console.log('🧪 [TEST] Simulando evento de estadísticas:', { movieId, averageRating, totalRatings });
    simulateStatsEvent(movieId, averageRating, totalRatings);
  };

  if (!isVisible) return null;

  return (
    <div className="realtime-test-panel">
      <div className="realtime-test-panel__header">
        <h3>🧪 Panel de Prueba - Tiempo Real</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="close-btn"
        >
          ×
        </button>
      </div>
      
      <div className="realtime-test-panel__content">
        <div className="status-section">
          <h4>Estado de Conexión:</h4>
          <div className="status-info">
            <span className={`status-indicator ${connectionStatus?.connected ? 'connected' : 'disconnected'}`}>
              {connectionStatus?.connected ? '🟢 Conectado' : '🔴 Desconectado'}
            </span>
            <button onClick={updateConnectionStatus} className="refresh-btn">
              🔄 Actualizar
            </button>
          </div>
          
          <div className="status-info">
            <h5>Cross-Tab Sync:</h5>
            <div className="status-info">
              <span className={`status-indicator ${crossTabStatus?.isListening ? 'connected' : 'disconnected'}`}>
                {crossTabStatus?.isListening ? '🟢 Activo' : '🔴 Inactivo'}
              </span>
              <span className="status-detail">
                {crossTabStatus?.hasBroadcastChannel ? '📡 BroadcastChannel' : '💾 localStorage'}
              </span>
            </div>
          </div>
          
          <div className="status-info">
            <h5>Socket.io Server:</h5>
            <div className="status-info">
              <span className={`status-indicator ${socketStatus?.connected ? 'connected' : 'disconnected'}`}>
                {socketStatus?.connected ? '🟢 Conectado' : '🔴 Desconectado'}
              </span>
              <span className="status-detail">
                {socketStatus?.socketId ? `ID: ${socketStatus.socketId}` : 'Sin ID'}
              </span>
            </div>
          </div>
        </div>

        <div className="test-section">
          <h4>Simular Eventos:</h4>
          <div className="test-buttons">
            <button onClick={handleSimulateRating} className="test-btn">
              📊 Simular Rating (Aleatorio)
            </button>
            <button onClick={() => {
              console.log('🧪 [TEST] Simulando Superman específicamente');
              simulateRatingEvent('68f84e9aba5b03d95f2d6ce1', 4, 'create');
            }} className="test-btn">
              🦸 Simular Superman
            </button>
            <button onClick={() => {
              console.log('🧪 [TEST] Probando cross-tab directamente');
              const { broadcastToOtherTabs } = require('../../services/crossTabService');
              broadcastToOtherTabs('68f84e9aba5b03d95f2d6ce1', 5, 'create');
            }} className="test-btn">
              🔄 Test Cross-Tab
            </button>
            <button onClick={handleSimulateStats} className="test-btn">
              📈 Simular Estadísticas
            </button>
            <button onClick={() => {
              console.log('🧪 [TEST] Probando conexión al servidor Socket.io');
              fetch('http://localhost:3001/api/realtime/test')
                .then(res => res.json())
                .then(data => {
                  console.log('📡 Respuesta del servidor:', data);
                  alert(`Servidor: ${data.message}\nUsuarios conectados: ${data.connectedUsers}`);
                })
                .catch(error => {
                  console.error('❌ Error conectando al servidor:', error);
                  alert('❌ No se pudo conectar al servidor Socket.io\nAsegúrate de que esté corriendo en puerto 3001');
                });
            }} className="test-btn">
              🔌 Test Servidor
            </button>
          </div>
        </div>

        <div className="info-section">
          <h4>ℹ️ Información:</h4>
          <ul>
            <li>Este panel solo aparece en desarrollo</li>
            <li>Los eventos se simulan usando el mock server</li>
            <li>Revisa la consola para ver los logs</li>
            <li>Las cards deberían actualizarse automáticamente</li>
            <li><strong>Para probar entre usuarios:</strong></li>
            <li>1. Ejecuta el servidor: cd socketio-server && npm start</li>
            <li>2. Abre la app en diferentes navegadores/dispositivos</li>
            <li>3. Simula un rating en un dispositivo</li>
            <li>4. Deberías ver el cambio en tiempo real en otros dispositivos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RealtimeTestPanel;
