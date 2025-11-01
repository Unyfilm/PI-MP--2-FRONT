import React from 'react';

/**
 * @file AccessibilityTest.tsx
 * @description
 * Development-only component used to verify screen reader and accessibility features
 * in the application. It provides a simple interface for testing ARIA live regions and
 * ensuring that interactive elements (e.g., buttons, links) are announced properly
 * by assistive technologies.
 *
 * @module AccessibilityTest
 */

/**
 * @function AccessibilityTest
 * @description
 * React functional component that renders an accessibility testing panel.
 * It allows developers to verify that screen readers announce button labels correctly.
 *
 * The component creates an ARIA live region dynamically and removes it after
 * a short timeout to simulate an announcement for accessibility validation.
 *
 * @example
 * ```tsx
 * <AccessibilityTest />
 * ```
 *
 * @returns {JSX.Element} A floating accessibility test panel with a "Probar Lector" button.
 */
export const AccessibilityTest: React.FC = () => {
  /**
   * @function testScreenReader
   * @description
   * Simulates an ARIA live region announcement to test screen reader behavior.
   * Creates a hidden element with `aria-live="polite"` and removes it after 3 seconds.
   *
   * This helps verify that assistive technologies (NVDA, VoiceOver, TalkBack, etc.)
   * correctly read dynamic updates and button labels.
   *
   * @returns {void}
   */
  const testScreenReader = () => {
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

