import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Keyboard, Mouse, Sun } from 'lucide-react';
import './AccessibilityFeatures.css';
import { useLocation } from 'react-router-dom';

/**
 * @function AccessibilityFeatures
 * @description
 * A React functional component that provides a set of user-configurable accessibility
 * features and keyboard shortcuts for the application. It manages accessibility preferences,
 * persists them to localStorage, and applies visual adjustments globally via CSS classes.
 *
 * @features
 * - High contrast mode
 * - Reduced motion
 * - Font size control (small | normal | large | extra-large)
 * - Focus visibility toggle
 * - Skip links for navigation via keyboard
 * - Global keyboard shortcuts for accessibility and media control
 *
 * @accessibility
 * - Adds ARIA live regions for announcements
 * - Implements focus management for keyboard users
 * - Avoids overriding critical browser/AT shortcuts
 * 
 * @returns {JSX.Element} JSX element rendering the accessibility controls, skip links,
 * font-size notification, and live region for screen readers.
 */
export default function AccessibilityFeatures() {
  const location = useLocation();
  const isPlayerRoute = location.pathname.startsWith('/player');
  const isPublicRoute = location.pathname === '/'
    || location.pathname.startsWith('/login')
    || location.pathname.startsWith('/register')
    || location.pathname.startsWith('/recover')
    || location.pathname.startsWith('/reset-password');

  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [focusVisible, setFocusVisible] = useState(true);
  const [skipLinks, setSkipLinks] = useState(false); // default: disabled
  const [showFontChangeNotification, setShowFontChangeNotification] = useState(false);
  const fontNotifTimerRef = useRef<number | null>(null);

  /**
   * @effect Load saved accessibility preferences from localStorage on mount.
   */
  useEffect(() => {
    const savedPrefs = localStorage.getItem('unyfilm-accessibility');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setHighContrast(prefs.highContrast || false);
      setReducedMotion(prefs.reducedMotion || false);
      setFontSize(prefs.fontSize || 'normal');
      setFocusVisible(prefs.focusVisible !== false);
      setSkipLinks(prefs.skipLinks === true);
    }
  }, []);

  /**
   * @effect Apply visual accessibility features when state changes.
   */
  useEffect(() => {
    applyAccessibilityFeatures();
  }, [highContrast, reducedMotion, fontSize, focusVisible, skipLinks]);

  /**
   * @effect Handles font size notifications with auto-hide timer.
   */
  useEffect(() => {
    if (fontNotifTimerRef.current) {
      clearTimeout(fontNotifTimerRef.current);
      fontNotifTimerRef.current = null;
    }

    if (fontSize !== 'normal') {
      setShowFontChangeNotification(true);
      fontNotifTimerRef.current = window.setTimeout(() => {
        setShowFontChangeNotification(false);
        fontNotifTimerRef.current = null;
      }, 2000);
    } else {
      setShowFontChangeNotification(false);
    }

    return () => {
      if (fontNotifTimerRef.current) {
        clearTimeout(fontNotifTimerRef.current);
        fontNotifTimerRef.current = null;
      }
    };
  }, [fontSize]);

  /**
   * @function applyAccessibilityFeatures
   * @description
   * Applies CSS classes to the document root based on the user's selected
   * accessibility preferences and persists these preferences to localStorage.
   *
   * @returns {void}
   */
  const applyAccessibilityFeatures = () => {
    const x = window.scrollX;
    const y = window.scrollY;

    const root = document.documentElement;
    if (highContrast) root.classList.add('high-contrast'); else root.classList.remove('high-contrast');
    if (reducedMotion) root.classList.add('reduced-motion'); else root.classList.remove('reduced-motion');
    root.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${fontSize}`);
    if (focusVisible) root.classList.add('focus-visible'); else root.classList.remove('focus-visible');

    const prefs = { highContrast, reducedMotion, fontSize, focusVisible, skipLinks };
    localStorage.setItem('unyfilm-accessibility', JSON.stringify(prefs));

    requestAnimationFrame(() => {
      window.scrollTo(x, y);
    });
  };

  /**
   * @effect Sets up keyboard shortcuts and accessibility hotkeys on mount.
   */
  useEffect(() => {
    if (isPlayerRoute || isPublicRoute) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || (e.target && 'matches' in e.target && (e.target as Element).matches('input, textarea, [contenteditable]'))) {
        return;
      }
      const handledKeys = ['n', 's', 'a', 'h', 'p', 'f', 'r', 'v', 'o'];
      if (e.altKey && handledKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'Tab' && e.target === document.body) {
        const mainContent = document.querySelector('.main-content') as HTMLElement;
        if (mainContent) {
          mainContent.focus();
        }
      }
      if (e.altKey && e.key === 'n') {
        const sidebar = document.querySelector('.unyfilm-sidebar') as HTMLElement;
        if (sidebar) sidebar.focus();
      }
      if (e.altKey && e.key === 's') {
        const searchInput = document.querySelector('#search-input') as HTMLElement;
        if (searchInput) searchInput.focus();
      }
      if (e.altKey && e.key === 'a') {
        toggleAccessibilityPanel();
      }
      if (e.altKey && e.key === 'h') {
        const helpBtn = document.querySelector('.usability-help-btn') as HTMLElement;
        if (helpBtn) helpBtn.click();
      }
      if (e.key === 'Escape') {
        const panel = document.querySelector('.accessibility-panel');
        if (panel && panel.classList.contains('accessibility-panel--visible')) {
          panel.classList.remove('accessibility-panel--visible');
        }
        const helpModal = document.querySelector('.usability-help-modal');
        if (helpModal) {
          const closeBtn = helpModal.querySelector('.usability-help-close') as HTMLElement;
          if (closeBtn) closeBtn.click();
        }
        const player = document.querySelector('.unyfilm-player-page');
        if (player) {
          const closeBtn = player.querySelector('.unyfilm-player-close-btn') as HTMLElement;
          if (closeBtn) closeBtn.click();
        }
        const profileDropdown = document.querySelector('.unyfilm-dropdown--visible');
        if (profileDropdown) {
          const profileBtn = document.querySelector('.unyfilm-header__profile-btn') as HTMLElement;
          if (profileBtn) profileBtn.click();
        }
      }
      if (e.altKey && e.key === 'p') {
        const video = document.querySelector('.unyfilm-video-element') as HTMLVideoElement;
        if (video) {
          if (video.paused) video.play(); else video.pause();
        }
      }
      if (e.altKey && e.key === 'f') {
        const videoContainer = document.querySelector('.unyfilm-video-container');
        if (videoContainer) {
          const fullscreenBtn = videoContainer.querySelector('button[aria-label*="pantalla completa"]') as HTMLElement;
          if (fullscreenBtn) fullscreenBtn.click();
        }
      }
      if (e.altKey && e.key === 'r') {
        const resetBtn = document.querySelector('.unyfilm-catalog__reset-btn') as HTMLElement;
        if (resetBtn) resetBtn.click();
      }
      if (e.altKey && e.key === 'v') {
        const viewToggle = document.querySelector('.unyfilm-catalog__view-toggle') as HTMLElement;
        if (viewToggle) viewToggle.click();
      }
      if (e.altKey && e.key === 'o') {
        const sortBtn = document.querySelector('.unyfilm-catalog__sort-btn') as HTMLElement;
        if (sortBtn) sortBtn.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerRoute, isPublicRoute]);

  /**
   * @function toggleAccessibilityPanel
   * @description Toggles the visibility of the accessibility options panel.
   * @returns {void}
   */
  const toggleAccessibilityPanel = () => {
    const panel = document.querySelector('.accessibility-panel');
    if (panel) {
      panel.classList.toggle('accessibility-panel--visible');
    }
  };


  const shouldRenderUi = !(isPlayerRoute || isPublicRoute);

  return (
    <>
      {shouldRenderUi && skipLinks && (
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

      {shouldRenderUi && (
        <div className="accessibility-panel">
          <button 
            className="accessibility-toggle"
            onClick={toggleAccessibilityPanel}
            aria-label="Abrir panel de accesibilidad"
            title="Opciones de accesibilidad"
          >
            <Eye size={20} aria-hidden="true" />
            <span className="sr-only">Panel de accesibilidad</span>
          </button>

          <div className="accessibility-controls">
            <h3>Opciones de Accesibilidad</h3>
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
      )}

      {showFontChangeNotification && shouldRenderUi && (
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

      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        id="accessibility-announcements"
      >
      </div>
    </>
  );
}

/**
 * @function announceToScreenReader
 * @description Sends a message to the ARIA live region for screen reader users.
 * @param {string} message - The message to announce.
 * @returns {void}
 */
export const announceToScreenReader = (message: string) => {
  const announcements = document.getElementById('accessibility-announcements');
  if (announcements) {
    announcements.textContent = message;
  }
};