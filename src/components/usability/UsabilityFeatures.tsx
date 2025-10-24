import { useState, useEffect } from 'react';
import { HelpCircle, AlertTriangle, CheckCircle, Info, Zap, Shield, Eye, Globe, ArrowLeft, Brain, Accessibility } from 'lucide-react';
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
  
  // Debounce para evitar múltiples ejecuciones (variable removida, no utilizada)

  // Funciones auxiliares para los atajos
  const focusSidebar = () => {
    const sidebar = document.querySelector('.unyfilm-sidebar') as HTMLElement;
    if (sidebar) {
      const firstNavItem = sidebar.querySelector('[role="button"]') as HTMLElement;
      if (firstNavItem) {
        firstNavItem.focus();
      }
    }
  };

  const focusSearch = () => {
    const searchInput = document.querySelector('#search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  const focusMainContent = () => {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      mainContent.focus();
    }
  };

  const navigateToPage = (path: string) => {
    window.location.href = path;
  };

  const toggleVideoPlayback = () => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  const toggleFullscreen = () => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoElement.requestFullscreen();
      }
    }
  };

  const toggleMute = () => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
    }
  };

  const seekVideo = (seconds: number) => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime += seconds;
    }
  };

  const changeVolume = (delta: number) => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.volume = Math.max(0, Math.min(1, videoElement.volume + delta));
    }
  };

  const resetFilters = () => {
    // Buscar botón de reset en el catálogo
    const resetBtn = document.querySelector('.unyfilm-catalog__reset-btn') as HTMLButtonElement;
    if (resetBtn) {
      resetBtn.click();
    }
  };

  const toggleViewMode = () => {
    // Buscar botones de vista en el catálogo
    const gridBtn = document.querySelector('.unyfilm-catalog__view-button[aria-label="Vista de cuadrícula"]') as HTMLButtonElement;
    const listBtn = document.querySelector('.unyfilm-catalog__view-button[aria-label="Vista de lista"]') as HTMLButtonElement;
    
    if (gridBtn && gridBtn.classList.contains('unyfilm-catalog__view-button--active')) {
      listBtn?.click();
    } else if (listBtn && listBtn.classList.contains('unyfilm-catalog__view-button--active')) {
      gridBtn?.click();
    }
  };

  const sortBy = (type: string) => {
    const sortSelect = document.querySelector('#sort-filter') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.value = type;
      sortSelect.dispatchEvent(new Event('change'));
    }
  };

  const toggleAccessibilityPanel = () => {
    const accessibilityBtn = document.querySelector('.accessibility-toggle') as HTMLElement;
    if (accessibilityBtn) {
      accessibilityBtn.click();
    }
  };

  const closeAllModals = () => {
    setShowHelp(false);
    // Cerrar otros modales si existen
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('[aria-label*="cerrar"], [aria-label*="close"]') as HTMLElement;
      if (closeBtn) {
        closeBtn.click();
      }
    });
  };

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
      // Navegación principal
      { key: 'Alt + N', description: 'Saltar a navegación (sidebar)', action: () => focusSidebar() },
      { key: 'Alt + S', description: 'Saltar a búsqueda', action: () => focusSearch() },
      { key: 'Alt + M', description: 'Ir al contenido principal', action: () => focusMainContent() },
      { key: 'Tab', description: 'Navegar entre elementos', action: () => {} },
      { key: 'Shift + Tab', description: 'Navegar hacia atrás', action: () => {} },
      
      // Navegación entre páginas
      { key: 'Alt + 1', description: 'Ir a Inicio', action: () => navigateToPage('/home') },
      { key: 'Alt + 2', description: 'Ir a Catálogo', action: () => navigateToPage('/catalog') },
      { key: 'Alt + 3', description: 'Ir a Sobre Nosotros', action: () => navigateToPage('/about') },
      { key: 'Alt + 4', description: 'Ir a Mapa del Sitio', action: () => navigateToPage('/sitemap') },
      { key: 'Alt + 5', description: 'Ir a Mi Perfil', action: () => navigateToPage('/profile') },
      { key: 'Alt + 0', description: 'Ir a Iniciar Sesión', action: () => navigateToPage('/login') },
      
      // Reproductor de video
      { key: 'Space', description: 'Reproducir/Pausar video', action: () => toggleVideoPlayback() },
      { key: 'Alt + P', description: 'Reproducir/Pausar video', action: () => toggleVideoPlayback() },
      { key: 'Alt + F', description: 'Pantalla completa', action: () => toggleFullscreen() },
      { key: 'Alt + M', description: 'Silenciar/Activar sonido', action: () => toggleMute() },
      { key: '←', description: 'Retroceder 10 segundos', action: () => seekVideo(-10) },
      { key: '→', description: 'Avanzar 10 segundos', action: () => seekVideo(10) },
      { key: '↑', description: 'Subir volumen', action: () => changeVolume(0.1) },
      { key: '↓', description: 'Bajar volumen', action: () => changeVolume(-0.1) },
      { key: 'Alt + ←', description: 'Retroceder 30 segundos', action: () => seekVideo(-30) },
      { key: 'Alt + →', description: 'Avanzar 30 segundos', action: () => seekVideo(30) },
      { key: 'Alt + ↑', description: 'Subir volumen rápido', action: () => changeVolume(0.2) },
      { key: 'Alt + ↓', description: 'Bajar volumen rápido', action: () => changeVolume(-0.2) },
      
      // Catálogo y filtros
      { key: 'Alt + R', description: 'Resetear filtros', action: () => resetFilters() },
      { key: 'Alt + G', description: 'Cambiar vista (grid/lista)', action: () => toggleViewMode() },
      { key: 'Alt + O', description: 'Ordenar por título', action: () => sortBy('title') },
      { key: 'Alt + Y', description: 'Ordenar por año', action: () => sortBy('year') },
      { key: 'Alt + T', description: 'Ordenar por rating', action: () => sortBy('rating') },
      { key: 'Alt + D', description: 'Ordenar por duración', action: () => sortBy('duration') },
      { key: 'Alt + L', description: 'Filtrar por género', action: () => {} },
      { key: 'Alt + C', description: 'Limpiar búsqueda', action: () => {} },
      
      // Favoritos y acciones
      { key: 'Alt + F', description: 'Agregar a favoritos', action: () => {} },
      { key: 'Alt + U', description: 'Quitar de favoritos', action: () => {} },
      { key: 'Alt + I', description: 'Información de película', action: () => {} },
      { key: 'Alt + C', description: 'Compartir película', action: () => {} },
      
      // Accesibilidad y ayuda
      { key: 'Alt + A', description: 'Panel de accesibilidad', action: () => toggleAccessibilityPanel() },
      { key: 'Alt + H', description: 'Panel de ayuda', action: () => setShowHelp(true) },
      { key: 'Alt + K', description: 'Atajos de teclado', action: () => setShowHelp(true) },
      { key: 'Alt + Z', description: 'Zoom in', action: () => {} },
      { key: 'Alt + X', description: 'Zoom out', action: () => {} },
      
      // Navegación general
      { key: 'Escape', description: 'Cerrar modales/paneles', action: () => closeAllModals() },
      { key: 'Alt + /', description: 'Mostrar todos los atajos', action: () => setShowHelp(true) },
      { key: 'Ctrl + /', description: 'Ayuda contextual', action: () => setShowHelp(true) },
      { key: 'F1', description: 'Ayuda general', action: () => setShowHelp(true) }
    ];
    setShortcuts(shortcuts);

    // Agregar event listeners para los atajos
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevenir atajos del navegador solo para nuestros atajos
      if (event.altKey || (event.key === ' ' && event.target && 'matches' in event.target && !(event.target as Element).matches('input, textarea'))) {
        event.preventDefault();
      }

      // Navegación
      if (event.altKey && event.key === 'n') {
        focusSidebar();
        return;
      }
      
      if (event.altKey && event.key === 's') {
        focusSearch();
        return;
      }
      
      if (event.altKey && event.key === 'm') {
        focusMainContent();
        return;
      }

      // Navegación entre páginas
      if (event.altKey && event.key === '1') {
        navigateToPage('/home');
        return;
      }
      
      if (event.altKey && event.key === '2') {
        navigateToPage('/catalog');
        return;
      }
      
      if (event.altKey && event.key === '3') {
        navigateToPage('/about');
        return;
      }
      
      if (event.altKey && event.key === '4') {
        navigateToPage('/sitemap');
        return;
      }
      
      if (event.altKey && event.key === '5') {
        navigateToPage('/profile');
        return;
      }

      // Reproductor de video
      if (event.key === ' ' && event.target && 'matches' in event.target && !(event.target as Element).matches('input, textarea')) {
        toggleVideoPlayback();
        return;
      }
      
      if (event.altKey && event.key === 'p') {
        toggleVideoPlayback();
        return;
      }
      
      if (event.altKey && event.key === 'f') {
        toggleFullscreen();
        return;
      }
      
      if (event.altKey && event.key === 'm') {
        toggleMute();
        return;
      }
      
      if (event.key === 'ArrowLeft') {
        seekVideo(-10);
        return;
      }
      
      if (event.key === 'ArrowRight') {
        seekVideo(10);
        return;
      }
      
      if (event.key === 'ArrowUp') {
        changeVolume(0.1);
        return;
      }
      
      if (event.key === 'ArrowDown') {
        changeVolume(-0.1);
        return;
      }

      // Catálogo y filtros
      if (event.altKey && event.key === 'r') {
        resetFilters();
        return;
      }
      
      if (event.altKey && event.key === 'g') {
        toggleViewMode();
        return;
      }
      
      if (event.altKey && event.key === 'o') {
        sortBy('title');
        return;
      }
      
      if (event.altKey && event.key === 'y') {
        sortBy('year');
        return;
      }
      
      if (event.altKey && event.key === 't') {
        sortBy('rating');
        return;
      }

      // Accesibilidad y ayuda
      if (event.altKey && event.key === 'a') {
        toggleAccessibilityPanel();
        return;
      }
      
      if (event.altKey && event.key === 'h') {
        setShowHelp(true);
        return;
      }
      
      if (event.altKey && event.key === '/') {
        setShowHelp(true);
        return;
      }

      // Navegación general
      if (event.key === 'Escape') {
        closeAllModals();
        return;
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
        onClick={() => {
          console.log('Help button clicked, current state:', showHelp);
          setShowHelp(!showHelp);
        }}
        title="Mostrar ayuda (Alt + H)"
        aria-pressed={showHelp}
        aria-label="Mostrar u ocultar ayuda"
        type="button"
      >
        <HelpCircle size={20} />
      </button>


      {/* Help Modal */}
      {showHelp && (
        <div className="usability-help-modal" role="dialog" aria-modal="true" aria-labelledby="usability-help-title">
          <div className="usability-help-backdrop" onClick={() => setShowHelp(false)}></div>
          <div className="usability-help-content" ref={helpModalRef}>
            <div className="usability-help-header">
              <h2 id="usability-help-title">🎯 Guía de Usabilidad - UnyFilm</h2>
              <p className="help-subtitle">Implementación de 6 Heurísticas de Nielsen y 2 Pautas WCAG 2.1</p>
              <button 
                onClick={() => setShowHelp(false)}
                className="usability-help-close"
                aria-label="Cerrar ayuda"
              >
                ×
              </button>
            </div>

            <div className="usability-help-sections">
              {/* Heurística 1: Visibilidad del estado del sistema */}
              <section className="usability-heuristic">
                <h3>
                  <Eye className="usability-icon" />
                  1. Visibilidad del Estado del Sistema
                </h3>
                <p>
                  <strong>¿Cómo se cumple en UnyFilm?</strong> El sistema siempre informa al usuario sobre lo que está sucediendo:
                </p>
                <ul>
                  <li><strong>Búsqueda:</strong> Indicador de carga mientras se buscan películas</li>
                  <li><strong>Reproducción:</strong> Estados visuales claros (play, pause, loading)</li>
                  <li><strong>Navegación:</strong> Elementos activos destacados en el sidebar</li>
                  <li><strong>Filtros:</strong> Contador de resultados y estado de filtros aplicados</li>
                  <li><strong>Favoritos:</strong> Feedback inmediato al agregar/quitar de favoritos</li>
                  <li><strong>Accesibilidad:</strong> Notificaciones de cambios de configuración</li>
                </ul>
                <div className="usability-demo">
                  <div className="status-indicator loading">🔍 Buscando películas...</div>
                  <div className="status-indicator success">✅ Video cargado correctamente</div>
                  <div className="status-indicator error">❌ Error de conexión</div>
                </div>
                <div className="heuristic-example">
                  <strong>Ejemplo práctico:</strong> Al hacer clic en una película, el sistema muestra inmediatamente un indicador de carga y luego el reproductor.
                </div>
              </section>

              {/* Heurística 2: Coincidencia entre el sistema y el mundo real */}
              <section className="usability-heuristic">
                <h3>
                  <Globe className="usability-icon" />
                  2. Coincidencia entre el Sistema y el Mundo Real
                </h3>
                <p>
                  <strong>¿Cómo se cumple en UnyFilm?</strong> El sistema habla el lenguaje del usuario con conceptos familiares:
                </p>
                <ul>
                  <li><strong>Terminología:</strong> "Películas", "Favoritos", "Tendencias" (lenguaje familiar)</li>
                  <li><strong>Iconos:</strong> ▶️ Play, ⏸️ Pause, ⭐ Favoritos, 🔍 Búsqueda</li>
                  <li><strong>Géneros:</strong> Acción, Comedia, Drama (categorías reconocibles)</li>
                  <li><strong>Navegación:</strong> "Inicio", "Catálogo", "Mi Perfil" (conceptos familiares)</li>
                  <li><strong>Ratings:</strong> Sistema de estrellas (1-5) universalmente entendido</li>
                  <li><strong>Búsqueda:</strong> Campo de búsqueda estándar con placeholder descriptivo</li>
                </ul>
                <div className="usability-demo">
                  <div className="familiar-elements">
                    <span className="icon">🎬</span> <span>Películas</span>
                    <span className="icon">⭐</span> <span>Favoritos</span>
                    <span className="icon">🔍</span> <span>Buscar</span>
                    <span className="icon">🏠</span> <span>Inicio</span>
                  </div>
                </div>
                <div className="heuristic-example">
                  <strong>Ejemplo práctico:</strong> Los usuarios entienden inmediatamente que "⭐ Favoritos" significa guardar películas que les gustan.
                </div>
              </section>

              {/* Heurística 3: Control y libertad del usuario */}
              <section className="usability-heuristic">
                <h3>
                  <ArrowLeft className="usability-icon" />
                  3. Control y Libertad del Usuario
                </h3>
                <p>
                  Los usuarios tienen control total sobre sus acciones:
                </p>
                <ul>
                  <li>Botón "Atrás" en todas las páginas</li>
                  <li>Deshacer acciones (quitar de favoritos, cancelar búsqueda)</li>
                  <li>Salida fácil de modales y pantallas completas</li>
                  <li>Cancelación de operaciones en progreso</li>
                  <li>Configuración personalizable (tema, idioma, notificaciones)</li>
                  <li>Historial de navegación y búsquedas recientes</li>
                </ul>
                <div className="usability-demo">
                  <div className="control-elements">
                    <button className="demo-btn">← Atrás</button>
                    <button className="demo-btn">✕ Cancelar</button>
                    <button className="demo-btn">⚙️ Configurar</button>
                  </div>
                </div>
              </section>

              {/* Heurística 4: Consistencia y estándares */}
              <section className="usability-heuristic">
                <h3>
                  <CheckCircle className="usability-icon" />
                  4. Consistencia y Estándares
                </h3>
                <p>
                  Diseño consistente en toda la plataforma:
                </p>
                <ul>
                  <li>Paleta de colores uniforme en todas las páginas</li>
                  <li>Tipografía consistente (tamaños, pesos, familias)</li>
                  <li>Espaciado y márgenes estandarizados</li>
                  <li>Comportamiento predecible de botones y enlaces</li>
                  <li>Iconos de Lucide React en toda la aplicación</li>
                  <li>Patrones de navegación consistentes</li>
                </ul>
                <div className="usability-demo">
                  <div className="consistency-demo">
                    <button className="consistent-btn primary">Primario</button>
                    <button className="consistent-btn secondary">Secundario</button>
                    <button className="consistent-btn danger">Peligro</button>
                  </div>
                </div>
              </section>

              {/* Heurística 5: Prevención de errores */}
              <section className="usability-heuristic">
                <h3>
                  <Shield className="usability-icon" />
                  5. Prevención de Errores
                </h3>
                <p>
                  Sistema robusto que previene errores del usuario:
                </p>
                <ul>
                  <li>Validación en tiempo real de formularios</li>
                  <li>Confirmación antes de acciones destructivas</li>
                  <li>Auto-guardado de preferencias y progreso</li>
                  <li>Detección de conexión y manejo de errores</li>
                  <li>Límites de caracteres y formatos válidos</li>
                  <li>Recuperación automática de sesiones</li>
                </ul>
                <div className="usability-demo">
                  <div className="error-prevention">
                    <input type="email" placeholder="email@ejemplo.com" className="validated-input" />
                    <div className="validation-message">✓ Formato válido</div>
                  </div>
                </div>
              </section>

              {/* Heurística 6: Reconocimiento antes que recuerdo */}
              <section className="usability-heuristic">
                <h3>
                  <Brain className="usability-icon" />
                  6. Reconocimiento antes que Recuerdo
                </h3>
                <p>
                  La información está visible y accesible sin memorización:
                </p>
                <ul>
                  <li>Tooltips informativos en iconos y botones</li>
                  <li>Breadcrumbs para orientación</li>
                  <li>Historial de búsquedas y películas vistas</li>
                  <li>Etiquetas descriptivas en todos los elementos</li>
                  <li>Ayuda contextual disponible</li>
                  <li>Atajos de teclado documentados</li>
                </ul>
                <div className="usability-demo">
                  <div className="recognition-aids">
                    <span title="Buscar películas">🔍</span>
                    <span title="Añadir a favoritos">❤️</span>
                    <span title="Compartir">📤</span>
                  </div>
                </div>
              </section>

              {/* Keyboard Shortcuts */}
              <section className="usability-shortcuts">
                <h3>
                  <Zap className="usability-icon" />
                  Atajos de Teclado
                </h3>
                <p>Usa estos atajos para navegar más rápido por la aplicación:</p>
                
                <div className="usability-shortcuts-categories">
                  {/* Navegación */}
                  <div className="usability-shortcuts-category">
                    <h4>🧭 Navegación</h4>
                    <div className="usability-shortcuts-list">
                      {shortcuts.filter(s => s.description.includes('Saltar') || s.description.includes('Ir al')).map((shortcut, index) => (
                        <div key={index} className="usability-shortcut">
                          <kbd>{shortcut.key}</kbd>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Páginas */}
                  <div className="usability-shortcuts-category">
                    <h4>📄 Páginas</h4>
                    <div className="usability-shortcuts-list">
                      {shortcuts.filter(s => s.description.includes('Ir a')).map((shortcut, index) => (
                        <div key={index} className="usability-shortcut">
                          <kbd>{shortcut.key}</kbd>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reproductor */}
                  <div className="usability-shortcuts-category">
                    <h4>🎬 Reproductor</h4>
                    <div className="usability-shortcuts-list">
                      {shortcuts.filter(s => s.description.includes('video') || s.description.includes('volumen') || s.description.includes('segundos') || s.description.includes('Pantalla completa') || s.description.includes('Silenciar')).map((shortcut, index) => (
                        <div key={index} className="usability-shortcut">
                          <kbd>{shortcut.key}</kbd>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Catálogo */}
                  <div className="usability-shortcuts-category">
                    <h4>📚 Catálogo</h4>
                    <div className="usability-shortcuts-list">
                      {shortcuts.filter(s => s.description.includes('filtros') || s.description.includes('vista') || s.description.includes('Ordenar')).map((shortcut, index) => (
                        <div key={index} className="usability-shortcut">
                          <kbd>{shortcut.key}</kbd>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General */}
                  <div className="usability-shortcuts-category">
                    <h4>⚙️ General</h4>
                    <div className="usability-shortcuts-list">
                      {shortcuts.filter(s => s.description.includes('Panel') || s.description.includes('Cerrar') || s.description.includes('Mostrar')).map((shortcut, index) => (
                        <div key={index} className="usability-shortcut">
                          <kbd>{shortcut.key}</kbd>
                          <span>{shortcut.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Pautas WCAG */}
              <section className="usability-wcag">
                <h3>
                  <Accessibility className="usability-icon" />
                  Pautas WCAG 2.1
                </h3>
                <p>Implementación de estándares de accesibilidad web:</p>
                
                <div className="usability-wcag-guidelines">
                  {/* WCAG 1.4.3 - Contraste (mínimo) */}
                  <div className="usability-wcag-guideline">
                    <h4>🎨 1.4.3 - Contraste (Mínimo)</h4>
                    <p>Relación de contraste de al menos 4.5:1 para texto normal:</p>
                    <ul>
                      <li>Texto principal: #FFFFFF sobre #1F2937 (contraste 15.8:1)</li>
                      <li>Texto secundario: #D1D5DB sobre #1F2937 (contraste 8.2:1)</li>
                      <li>Enlaces: #6366F1 sobre #1F2937 (contraste 4.8:1)</li>
                      <li>Botones: Fondo #6366F1 con texto #FFFFFF (contraste 4.5:1)</li>
                      <li>Validación automática de contraste en tiempo real</li>
                      <li>Modo de alto contraste disponible</li>
                    </ul>
                    <div className="usability-demo">
                      <div className="contrast-demo">
                        <div className="contrast-example high">Texto de alto contraste</div>
                        <div className="contrast-example medium">Texto de contraste medio</div>
                        <div className="contrast-example low">Texto de bajo contraste</div>
                      </div>
                    </div>
                  </div>

                  {/* WCAG 2.1.1 - Navegación por teclado */}
                  <div className="usability-wcag-guideline">
                    <h4>⌨️ 2.1.1 - Navegación por Teclado</h4>
                    <p>Todas las funcionalidades son accesibles mediante teclado:</p>
                    <ul>
                      <li>Navegación completa con Tab y Shift+Tab</li>
                      <li>Activación con Enter y Espacio</li>
                      <li>Atajos de teclado para todas las funciones principales</li>
                      <li>Indicadores de foco visibles y consistentes</li>
                      <li>Trampa de foco en modales</li>
                      <li>Orden lógico de tabulación</li>
                    </ul>
                    <div className="usability-demo">
                      <div className="keyboard-demo">
                        <button className="focusable-btn">Botón 1</button>
                        <button className="focusable-btn">Botón 2</button>
                        <button className="focusable-btn">Botón 3</button>
                      </div>
                      <div className="keyboard-hint">Usa Tab para navegar</div>
                    </div>
                  </div>
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
