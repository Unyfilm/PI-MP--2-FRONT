import React from 'react';

/**
 * Componente de prueba para verificar la accesibilidad
 * Solo para desarrollo - NO incluir en producción
 */
export const AccessibilityTest: React.FC = () => {
  const testScreenReader = () => {
    // Simular anuncios para probar lectores de pantalla
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = 'Prueba de accesibilidad: Todos los botones deben ser anunciados por el lector de pantalla';
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 3000);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <h4>Prueba de Accesibilidad</h4>
      <p>1. Activa un lector de pantalla (NVDA, VoiceOver, TalkBack)</p>
      <p>2. Navega con Tab por la aplicación</p>
      <p>3. Verifica que todos los botones sean anunciados</p>
      <button 
        onClick={testScreenReader}
        style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        aria-label="Probar anuncio de lector de pantalla"
      >
        Probar Lector
      </button>
    </div>
  );
};

export default AccessibilityTest;
