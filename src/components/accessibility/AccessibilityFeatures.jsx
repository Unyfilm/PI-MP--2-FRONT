import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Volume2, VolumeX, Keyboard, Mouse, Sun, Moon } from 'lucide-react';
import './AccessibilityFeatures.css';

/**
 * Accessibility features component implementing WCAG guidelines
 * @component
 * @returns {JSX.Element} Accessibility features with WCAG compliance
 */
export default function AccessibilityFeatures() {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [focusVisible, setFocusVisible] = useState(true);
  const [skipLinks, setSkipLinks] = useState(true);

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
    root.classList.remove('font-small', 'font-normal', 'font-large');
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
    const handleKeyDown = (e) => {
      // Prevent default for our custom shortcuts
      if (e.altKey || e.ctrlKey) {
        e.preventDefault();
      }

      // Skip to main content
      if (e.key === 'Tab' && e.target === document.body) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.focus();
        }
      }

      // Skip to navigation
      if (e.altKey && e.key === 'n') { // Alt + N
        const sidebar = document.querySelector('.unyfilm-sidebar');
        if (sidebar) {
          sidebar.focus();
        }
      }

      // Skip to search
      if (e.altKey && e.key === 's') { // Alt + S
        const searchInput = document.querySelector('#search-input');
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
        const helpBtn = document.querySelector('.usability-help-btn');
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
          const closeBtn = helpModal.querySelector('.usability-help-close');
          if (closeBtn) {
            closeBtn.click();
          }
        }

        // Close video player
        const player = document.querySelector('.unyfilm-player-page');
        if (player) {
          const closeBtn = player.querySelector('.unyfilm-player-close-btn');
          if (closeBtn) {
            closeBtn.click();
          }
        }

        // Close profile dropdown
        const profileDropdown = document.querySelector('.unyfilm-dropdown--visible');
        if (profileDropdown) {
          const profileBtn = document.querySelector('.unyfilm-header__profile-btn');
          if (profileBtn) {
            profileBtn.click();
          }
        }
      }

      // Video player controls
      if (e.altKey && e.key === 'p') { // Alt + P - Play/Pause
        const video = document.querySelector('.unyfilm-video-element');
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
          const fullscreenBtn = videoContainer.querySelector('button[aria-label*="pantalla completa"]');
          if (fullscreenBtn) {
            fullscreenBtn.click();
          }
        }
      }

      // Filter controls
      if (e.altKey && e.key === 'r') { // Alt + R - Reset filters
        const resetBtn = document.querySelector('.unyfilm-catalog__reset-btn');
        if (resetBtn) {
          resetBtn.click();
        }
      }

      // View mode toggle
      if (e.altKey && e.key === 'v') { // Alt + V - Toggle view mode
        const viewToggle = document.querySelector('.unyfilm-catalog__view-toggle');
        if (viewToggle) {
          viewToggle.click();
        }
      }

      // Sort controls
      if (e.altKey && e.key === 'o') { // Alt + O - Sort options
        const sortBtn = document.querySelector('.unyfilm-catalog__sort-btn');
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
              const mainContent = document.querySelector('.main-content');
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
              const sidebar = document.querySelector('.unyfilm-sidebar');
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
              const searchInput = document.querySelector('.unyfilm-header__search input');
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
              >
                <option value="small">Pequeña</option>
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
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
export const announceToScreenReader = (message) => {
  const announcements = document.getElementById('accessibility-announcements');
  if (announcements) {
    announcements.textContent = message;
  }
};
