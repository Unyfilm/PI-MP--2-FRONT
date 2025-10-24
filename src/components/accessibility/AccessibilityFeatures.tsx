import { useState, useEffect } from 'react';
import { Eye, EyeOff, Keyboard, Mouse, Sun } from 'lucide-react';
import './AccessibilityFeatures.css';

/**
 * AccessibilityFeatures
 *
 * A React functional component that provides a set of user-configurable accessibility
 * features and keyboard shortcuts for the application. The component manages local
 * state for accessibility preferences, persists them to localStorage, applies global
 * CSS classes to the document root, and exposes quick-access skip links and an
 * accessibility panel UI.
 *
 * Features
 * - High contrast mode: toggles a 'high-contrast' class on document.documentElement.
 * - Reduced motion: toggles a 'reduced-motion' class on document.documentElement.
 * - Font size: supports 'small' | 'normal' | 'large' | 'extra-large' by toggling
 *   corresponding 'font-{size}' classes on document.documentElement and showing a
 *   transient visual notification when changed.
 * - Focus indicators: toggles a 'focus-visible' class to control focus visibility.
 * - Skip links: optionally renders visually-hidden but keyboard-accessible links to
 *   jump to main content, navigation, and search.
 * - Persisting preferences: saves and restores preferences under the key
 *   'unyfilm-accessibility' in localStorage.
 *
 * Keyboard shortcuts (global keydown handlers)
 * - Alt + A : Toggle accessibility panel
 * - Alt + H : Open help panel (by simulating click on '.usability-help-btn')
 * - Alt + N : Focus navigation ('.unyfilm-sidebar')
 * - Alt + S : Focus search ( '#search-input' or header search input )
 * - Alt + P : Play / Pause video ('.unyfilm-video-element')
 * - Alt + F : Toggle fullscreen for player (clicks a fullscreen button found in
 *            '.unyfilm-video-container' with an aria-label containing "pantalla completa")
 * - Alt + R : Reset filters (clicks '.unyfilm-catalog__reset-btn')
 * - Alt + V : Toggle view mode (clicks '.unyfilm-catalog__view-toggle')
 * - Alt + O : Open sort options (clicks '.unyfilm-catalog__sort-btn')
 * - Escape  : Close accessibility panel, help modal, video player, or profile dropdown
 *             by finding corresponding elements and triggering close behaviors.
 * - Tab     : If tabbed from the document body, attempts to focus the main content
 *             element ('.main-content').
 *
 * Implementation notes / side effects
 * - The component directly manipulates document.documentElement classes to apply
 *   visual changes; ensure corresponding CSS rules exist for:
 *     .high-contrast, .reduced-motion, .font-small, .font-normal, .font-large,
 *     .font-extra-large, .focus-visible
 * - Keyboard handlers are attached to document on mount and removed on unmount.
 * - Skip links visually navigate and focus target elements and attempt smooth scrolling.
 * - An aria-live region (id="accessibility-announcements") is rendered for screen
 *   reader announcements; components may append announcements there as needed.
 * - The component does not accept props; all configuration is stored internally and
 *   persisted in localStorage. Consumers may need to coordinate if multiple places
 *   manipulate the same DOM classes or localStorage key.
 *
 * Accessibility considerations
 * - Uses ARIA live region for announcements and ensures focus management for skip
 *   links and keyboard shortcuts.
 * - Keyboard shortcuts may call e.preventDefault() for combinations using Alt or Ctrl
 *   — be careful to avoid overriding browser or AT-specific shortcuts that users rely on.
 *
 * @returns {JSX.Element} A JSX element containing skip links (optional), the
 * accessibility panel and controls, a transient font-change notification, and
 * an ARIA live region for announcements.
 */
export default function AccessibilityFeatures() {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [focusVisible, setFocusVisible] = useState(true);
  const [skipLinks, setSkipLinks] = useState(true);
  const [showFontChangeNotification, setShowFontChangeNotification] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('unyfilm-accessibility');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setHighContrast(prefs.highContrast || false);
      setReducedMotion(prefs.reducedMotion || false);
      setFontSize(prefs.fontSize || 'normal');
      setFocusVisible(prefs.focusVisible !== false);
      setSkipLinks(prefs.skipLinks !== false);
    }
  }, []);

  // Apply accessibility features when settings change
  useEffect(() => {
    applyAccessibilityFeatures();
  }, [highContrast, reducedMotion, fontSize, focusVisible, skipLinks]);

  // Show notification when font size changes
  useEffect(() => {
    if (fontSize !== 'normal') {
      setShowFontChangeNotification(true);
      const timer = setTimeout(() => {
        setShowFontChangeNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fontSize]);

  /**
   * Apply accessibility features to the document
   */
  const applyAccessibilityFeatures = () => {
    const root = document.documentElement;
    
    // High contrast mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size
    root.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${fontSize}`);

    // Focus visible
    if (focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Save preferences
    const prefs = {
      highContrast,
      reducedMotion,
      fontSize,
      focusVisible,
      skipLinks
    };
    localStorage.setItem('unyfilm-accessibility', JSON.stringify(prefs));
  };

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our custom shortcuts
      if (e.altKey || e.ctrlKey) {
        e.preventDefault();
      }

      // Skip to main content
      if (e.key === 'Tab' && e.target === document.body) {
        const mainContent = document.querySelector('.main-content') as HTMLElement;
        if (mainContent) {
          mainContent.focus();
        }
      }

      // Skip to navigation
      if (e.altKey && e.key === 'n') { // Alt + N
        const sidebar = document.querySelector('.unyfilm-sidebar') as HTMLElement;
        if (sidebar) {
          sidebar.focus();
        }
      }

      // Skip to search
      if (e.altKey && e.key === 's') { // Alt + S
        const searchInput = document.querySelector('#search-input') as HTMLElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Toggle accessibility panel
      if (e.altKey && e.key === 'a') { // Alt + A
        toggleAccessibilityPanel();
      }

      // Toggle help panel
      if (e.altKey && e.key === 'h') { // Alt + H
        const helpBtn = document.querySelector('.usability-help-btn') as HTMLElement;
        if (helpBtn) {
          helpBtn.click();
        }
      }

      // Close modals/panels with Escape
      if (e.key === 'Escape') {
        // Close accessibility panel
        const panel = document.querySelector('.accessibility-panel');
        if (panel && panel.classList.contains('accessibility-panel--visible')) {
          panel.classList.remove('accessibility-panel--visible');
        }

        // Close help modal
        const helpModal = document.querySelector('.usability-help-modal');
        if (helpModal) {
          const closeBtn = helpModal.querySelector('.usability-help-close') as HTMLElement;
          if (closeBtn) {
            closeBtn.click();
          }
        }

        // Close video player
        const player = document.querySelector('.unyfilm-player-page');
        if (player) {
          const closeBtn = player.querySelector('.unyfilm-player-close-btn') as HTMLElement;
          if (closeBtn) {
            closeBtn.click();
          }
        }

        // Close profile dropdown
        const profileDropdown = document.querySelector('.unyfilm-dropdown--visible');
        if (profileDropdown) {
          const profileBtn = document.querySelector('.unyfilm-header__profile-btn') as HTMLElement;
          if (profileBtn) {
            profileBtn.click();
          }
        }
      }

      // Video player controls
      if (e.altKey && e.key === 'p') { // Alt + P - Play/Pause
        const video = document.querySelector('.unyfilm-video-element') as HTMLVideoElement;
        if (video) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      }

      if (e.altKey && e.key === 'f') { // Alt + F - Fullscreen
        const videoContainer = document.querySelector('.unyfilm-video-container');
        if (videoContainer) {
          const fullscreenBtn = videoContainer.querySelector('button[aria-label*="pantalla completa"]') as HTMLElement;
          if (fullscreenBtn) {
            fullscreenBtn.click();
          }
        }
      }

      // Filter controls
      if (e.altKey && e.key === 'r') { // Alt + R - Reset filters
        const resetBtn = document.querySelector('.unyfilm-catalog__reset-btn') as HTMLElement;
        if (resetBtn) {
          resetBtn.click();
        }
      }

      // View mode toggle
      if (e.altKey && e.key === 'v') { // Alt + V - Toggle view mode
        const viewToggle = document.querySelector('.unyfilm-catalog__view-toggle') as HTMLElement;
        if (viewToggle) {
          viewToggle.click();
        }
      }

      // Sort controls
      if (e.altKey && e.key === 'o') { // Alt + O - Sort options
        const sortBtn = document.querySelector('.unyfilm-catalog__sort-btn') as HTMLElement;
        if (sortBtn) {
          sortBtn.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Toggle accessibility panel
   */
  const toggleAccessibilityPanel = () => {
    const panel = document.querySelector('.accessibility-panel');
    if (panel) {
      panel.classList.toggle('accessibility-panel--visible');
    }
  };

  return (
    <>
      {/* Skip Links */}
      {skipLinks && (
        <div className="skip-links">
          <a 
            href="#main-content" 
            className="skip-link"
            onClick={(e) => {
              e.preventDefault();
              const mainContent = document.querySelector('.main-content') as HTMLElement;
              if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Saltar al contenido principal
          </a>
          <a 
            href="#navigation" 
            className="skip-link"
            onClick={(e) => {
              e.preventDefault();
              const sidebar = document.querySelector('.unyfilm-sidebar') as HTMLElement;
              if (sidebar) {
                sidebar.focus();
                sidebar.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Saltar a la navegación
          </a>
          <a 
            href="#search" 
            className="skip-link"
            onClick={(e) => {
              e.preventDefault();
              const searchInput = document.querySelector('.unyfilm-header__search input') as HTMLElement;
              if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Saltar a la búsqueda
          </a>
        </div>
      )}

      {/* Accessibility Panel */}
      <div className="accessibility-panel">
        <button 
          className="accessibility-toggle"
          onClick={toggleAccessibilityPanel}
          aria-label="Abrir panel de accesibilidad"
          title="Opciones de accesibilidad"
        >
          <Eye size={20} />
        </button>

        <div className="accessibility-controls">
          <h3>Opciones de Accesibilidad</h3>
          
          {/* High Contrast */}
          <div className="accessibility-control">
            <label>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              <span className="control-label">
                <Eye className="control-icon" />
                Alto contraste
              </span>
            </label>
          </div>

          {/* Reduced Motion */}
          <div className="accessibility-control">
            <label>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />
              <span className="control-label">
                <Mouse className="control-icon" />
                Reducir animaciones
              </span>
            </label>
          </div>

          {/* Font Size */}
          <div className="accessibility-control">
            <label>
              <span className="control-label">
                <Keyboard className="control-icon" />
                Tamaño de fuente
              </span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                style={{
                  fontSize: fontSize === 'small' ? '10px' : fontSize === 'normal' ? '14px' : fontSize === 'large' ? '18px' : '22px',
                  padding: fontSize === 'small' ? '4px 8px' : fontSize === 'normal' ? '6px 10px' : fontSize === 'large' ? '8px 12px' : '10px 14px'
                }}
              >
                <option value="small">🔍 Pequeña (10px)</option>
                <option value="normal">📝 Normal (14px)</option>
                <option value="large">📖 Grande (20px)</option>
                <option value="extra-large">📚 Extra Grande (28px)</option>
              </select>
            </label>
          </div>

          {/* Focus Visible */}
          <div className="accessibility-control">
            <label>
              <input
                type="checkbox"
                checked={focusVisible}
                onChange={(e) => setFocusVisible(e.target.checked)}
              />
              <span className="control-label">
                <Sun className="control-icon" />
                Mostrar foco
              </span>
            </label>
          </div>

          {/* Skip Links */}
          <div className="accessibility-control">
            <label>
              <input
                type="checkbox"
                checked={skipLinks}
                onChange={(e) => setSkipLinks(e.target.checked)}
              />
              <span className="control-label">
                <EyeOff className="control-icon" />
                Enlaces de salto
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Font Size Change Notification */}
      {showFontChangeNotification && (
        <div className="font-change-notification">
          <div className="notification-content">
            <span className="notification-icon">📏</span>
            <span className="notification-text">
              Tamaño de fuente cambiado a: {
                fontSize === 'small' ? 'Pequeña' :
                fontSize === 'normal' ? 'Normal' :
                fontSize === 'large' ? 'Grande' : 'Extra Grande'
              }
            </span>
          </div>
        </div>
      )}

      {/* ARIA Live Region for announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        id="accessibility-announcements"
      >
        {/* Screen reader announcements will be inserted here */}
      </div>
    </>
  );
}

/**
 * Announce changes to screen readers
 * @param {string} message - Message to announce
 */
export const announceToScreenReader = (message: string) => {
  const announcements = document.getElementById('accessibility-announcements');
  if (announcements) {
    announcements.textContent = message;
  }
};
