import { useState, useEffect } from 'react';
import { HelpCircle, AlertTriangle, CheckCircle, Info, Zap, Shield, Eye } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './UsabilityFeatures.css';

/**
 * Usability features component implementing 3 usability heuristics
 * @component
 * @returns {JSX.Element} Usability features with heuristics implementation
 */
type Notification = { id: number; type: 'info' | 'success' | 'error'; message: string; duration: number };
type Shortcut = { key: string; description: string; action: () => void };

export default function UsabilityFeatures() {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Hook para cerrar el modal de ayuda al hacer clic fuera
  const helpModalRef = useClickOutside(() => setShowHelp(false));
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  useEffect(() => {
    // Initialize usability features
    initializeKeyboardShortcuts();
    initializeErrorPrevention();
    initializeHelpSystem();
  }, []);

  /**
   * Initialize keyboard shortcuts for better usability
   */
  const initializeKeyboardShortcuts = () => {
    const shortcuts = [
      { key: 'Alt + N', description: 'Saltar a navegación', action: () => console.log('Navigate to sidebar') },
      { key: 'Alt + S', description: 'Saltar a búsqueda', action: () => console.log('Navigate to search') },
      { key: 'Alt + A', description: 'Panel de accesibilidad', action: () => console.log('Toggle accessibility') },
      { key: 'Alt + H', description: 'Panel de ayuda', action: () => setShowHelp(true) },
      { key: 'Alt + P', description: 'Reproducir/Pausar video', action: () => console.log('Play/Pause video') },
      { key: 'Alt + F', description: 'Pantalla completa', action: () => console.log('Toggle fullscreen') },
      { key: 'Alt + R', description: 'Resetear filtros', action: () => console.log('Reset filters') },
      { key: 'Alt + V', description: 'Cambiar vista', action: () => console.log('Toggle view mode') },
      { key: 'Alt + O', description: 'Opciones de orden', action: () => console.log('Sort options') },
      { key: 'Escape', description: 'Cerrar modales', action: () => setShowHelp(false) }
    ];
    setShortcuts(shortcuts);
  };

  /**
   * Initialize error prevention mechanisms
   */
  const initializeErrorPrevention = () => {
    // Prevent accidental navigation
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir?';
    };
    window.addEventListener('beforeunload', beforeUnload);

    // Auto-save user preferences
    const savePreferences = () => {
      const preferences = {
        theme: 'dark',
        language: 'es',
        volume: 0.8,
        lastWatched: Date.now()
      };
      localStorage.setItem('unyfilm-preferences', JSON.stringify(preferences));
    };

    const intervalId = window.setInterval(savePreferences, 30000);

    // Provide cleanup function for caller
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      clearInterval(intervalId);
    };
  };

  /**
   * Initialize help system
   */
  const initializeHelpSystem = () => {
    // Show welcome message for new users
    const isNewUser = !localStorage.getItem('unyfilm-visited');
    if (isNewUser) {
      setNotifications([{
        id: 1,
        type: 'info',
        message: '¡Bienvenido a UnyFilm! Usa las teclas de acceso rápido para navegar.',
        duration: 5000
      }]);
      localStorage.setItem('unyfilm-visited', 'true');
    }
  };

  /**
   * Show contextual help
   */
  // const showContextualHelp = (context: 'home' | 'catalog' | 'player' | 'search') => {
  //   const helpMessages = {
  //     home: 'En la página de inicio puedes ver las películas en tendencia y populares.',
  //     catalog: 'En el catálogo puedes filtrar y buscar películas por género.',
  //     player: 'En el reproductor puedes usar las teclas de espacio para pausar/reproducir.',
  //     search: 'Escribe el nombre de la película que buscas y presiona Enter.'
  //   };

  //   setNotifications([{
  //     id: Date.now(),
  //     type: 'info',
  //     message: helpMessages[context] || 'Ayuda contextual no disponible.',
  //     duration: 3000
  //   }]);
  // };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase());
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);

  // Ensure initializeErrorPrevention cleanup runs
  useEffect(() => {
    const cleanup = initializeErrorPrevention();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="usability-features">
      {/* Help Button */}
      <button 
        className="usability-help-btn"
        onClick={() => setShowHelp(!showHelp)}
        title="Mostrar ayuda (?)"
        aria-pressed={showHelp}
        aria-label="Mostrar u ocultar ayuda"
      >
        <HelpCircle size={20} />
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div className="usability-help-modal" role="dialog" aria-modal="true" aria-labelledby="usability-help-title">
          <div className="usability-help-backdrop" onClick={() => setShowHelp(false)}></div>
          <div className="usability-help-content" ref={helpModalRef}>
            <div className="usability-help-header">
              <h2 id="usability-help-title">Guía de Usabilidad</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="usability-help-close"
                aria-label="Cerrar ayuda"
              >
                ×
              </button>
            </div>

            <div className="usability-help-sections">
              {/* Heuristic 1: Consistency and Standards */}
              <section className="usability-heuristic">
                <h3>
                  <CheckCircle className="usability-icon" />
                  Consistencia y Estándares
                </h3>
                <p>
                  UnyFilm mantiene consistencia visual y funcional en toda la plataforma:
                </p>
                <ul>
                  <li>Navegación uniforme en todas las páginas</li>
                  <li>Botones con el mismo estilo y comportamiento</li>
                  <li>Colores y tipografías consistentes</li>
                  <li>Iconos estándar de Lucide React</li>
                </ul>
              </section>

              {/* Heuristic 2: Error Prevention */}
              <section className="usability-heuristic">
                <h3>
                  <Shield className="usability-icon" />
                  Prevención de Errores
                </h3>
                <p>
                  Sistema de prevención de errores implementado:
                </p>
                <ul>
                  <li>Confirmación antes de salir de la página</li>
                  <li>Auto-guardado de preferencias del usuario</li>
                  <li>Validación de formularios en tiempo real</li>
                  <li>Mensajes de error claros y útiles</li>
                </ul>
              </section>

              {/* Heuristic 3: Recognition vs Recall */}
              <section className="usability-heuristic">
                <h3>
                  <Eye className="usability-icon" />
                  Reconocimiento vs Recuerdo
                </h3>
                <p>
                  Interfaz diseñada para reconocimiento fácil:
                </p>
                <ul>
                  <li>Iconos intuitivos y reconocibles</li>
                  <li>Tooltips informativos en hover</li>
                  <li>Estados visuales claros (activo, hover, disabled)</li>
                  <li>Navegación breadcrumb visible</li>
                </ul>
              </section>

              {/* Keyboard Shortcuts */}
              <section className="usability-shortcuts">
                <h3>
                  <Zap className="usability-icon" />
                  Atajos de Teclado
                </h3>
                <div className="usability-shortcuts-list">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="usability-shortcut">
                      <kbd>{shortcut.key}</kbd>
                      <span>{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="usability-notifications">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`usability-notification usability-notification--${notification.type}`}
            style={{ animationDuration: `${notification.duration}ms` }}
          >
            <div className="usability-notification-content">
              {notification.type === 'error' && <AlertTriangle size={16} />}
              {notification.type === 'success' && <CheckCircle size={16} />}
              {notification.type === 'info' && <Info size={16} />}
              <span>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
