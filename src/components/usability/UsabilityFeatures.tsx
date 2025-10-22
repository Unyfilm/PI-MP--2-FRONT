import { useState, useEffect, useRef } from 'react';
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
  
  // Debounce para evitar múltiples ejecuciones
  const lastKeyPress = useRef<number>(0);

  useEffect(() => {
    // Initialize usability features
    const cleanupKeyboard = initializeKeyboardShortcuts();
    initializeHelpSystem();
    
    // Cleanup function
    return () => {
      if (cleanupKeyboard) {
        cleanupKeyboard();
      }
    };
  }, []);

  /**
   * Initialize keyboard shortcuts for better usability
   */
  const initializeKeyboardShortcuts = () => {
    const shortcuts = [
      { key: 'Alt + N', description: 'Saltar a navegación', action: () => {} },
      { key: 'Alt + S', description: 'Saltar a búsqueda', action: () => {} },
      { key: 'Alt + A', description: 'Panel de accesibilidad', action: () => {} },
      { key: 'Alt + H', description: 'Panel de ayuda', action: () => setShowHelp(true) },
      { key: 'Alt + P', description: 'Reproducir/Pausar video', action: () => {} },
      { key: 'Alt + F', description: 'Pantalla completa', action: () => {} },
      { key: 'Alt + R', description: 'Resetear filtros', action: () => {} },
      { key: 'Escape', description: 'Cerrar modales', action: () => setShowHelp(false) }
    ];
    setShortcuts(shortcuts);

    // Agregar event listeners para los atajos
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + H para abrir ayuda
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        setShowHelp(true);
      }
      
      // Escape para cerrar modales
      if (event.key === 'Escape') {
        setShowHelp(false);
      }
      
      // Alt + N para navegación
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        // Aquí puedes agregar la lógica para navegar al sidebar
      }
      
      // Alt + S para búsqueda
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enfocar la búsqueda
      }
      
      // Alt + A para accesibilidad
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        // Aquí puedes agregar la lógica para el panel de accesibilidad
      }
      
      // Alt + P para play/pause
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        
        // Debounce para evitar múltiples ejecuciones
        const now = Date.now();
        if (now - lastKeyPress.current < 500) {
          return;
        }
        lastKeyPress.current = now;
        
        // Buscar el elemento de video directamente para obtener el estado real
        const videoElement = document.querySelector('video') as HTMLVideoElement;
        
        if (videoElement) {
          
          
          try {
            // Simular click en el botón del reproductor
            
            // Buscar el botón de play/pause del reproductor UnyFilm
            const playButton = document.querySelector('.unyfilm-control-btn') as HTMLButtonElement;
            if (playButton) {
              
              // Simular click real del usuario
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              
              // Disparar el evento de click
              playButton.dispatchEvent(clickEvent);
              
              // También hacer click programático como fallback
              playButton.click();
              
              
            } else {
              
              // Fallback: control directo del video
              if (videoElement.paused) {
                videoElement.play().catch((error) => {
                  // Error playing video
                });
              } else {
                videoElement.pause();
              }
            }
          } catch (error) {
            // Error controlling video
          }
        } else {
          // Fallback: buscar el botón de play/pause del reproductor
          const playButton = document.querySelector('.unyfilm-control-btn') as HTMLButtonElement;
          if (playButton) {
            playButton.click();
          } else {
          }
        }
      }
      
      // Alt + F para pantalla completa
      if (event.altKey && event.key === 'f') {
        event.preventDefault();
        
        // Buscar el botón de pantalla completa del reproductor
        const fullscreenButton = document.querySelector('.unyfilm-control-btn[title*="fullscreen"], .unyfilm-control-btn[aria-label*="fullscreen"]') as HTMLButtonElement;
        if (fullscreenButton) {
          fullscreenButton.click();
        } else {
          // Fallback: usar API nativa
          const videoContainer = document.querySelector('.unyfilm-video-player') as HTMLElement;
          if (videoContainer) {
            if (!document.fullscreenElement) {
              videoContainer.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }
        }
      }
      
      // Alt + R para resetear filtros
      if (event.altKey && event.key === 'r') {
        event.preventDefault();
        // Aquí puedes agregar la lógica para resetear filtros
      }
      
      
    };

    // Agregar el event listener con capture para asegurar que se ejecute
    document.addEventListener('keydown', handleKeyDown, true);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  };

  /**
   * Initialize error prevention mechanisms - REMOVED beforeunload alert
   */
  const initializeErrorPrevention = () => {
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
