import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockVideoElement = {
  paused: true,
  play: vi.fn(),
  pause: vi.fn(),
  muted: false,
  volume: 0.5,
  currentTime: 0,
  requestFullscreen: vi.fn()
};

const mockSidebarElement = {
  focus: vi.fn(),
  querySelector: vi.fn().mockReturnValue({
    focus: vi.fn()
  })
};

const mockSearchInput = {
  focus: vi.fn(),
  select: vi.fn()
};

const mockMainContent = {
  focus: vi.fn()
};

describe('Keyboard Shortcuts Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    

    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      switch (selector) {
        case 'video':
          return mockVideoElement as any;
        case '.unyfilm-sidebar':
          return mockSidebarElement as any;
        case '#search-input':
          return mockSearchInput as any;
        case '.main-content':
          return mockMainContent as any;
        default:
          return null;
      }
    });

    Object.defineProperty(window, 'location', {
      value: {
        href: ''
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Navegación', () => {
    it('Alt + N debería enfocar el sidebar', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'n',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.unyfilm-sidebar');
    });

    it('Alt + S debería enfocar la búsqueda', () => {
      const event = new KeyboardEvent('keydown', {
        key: 's',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('#search-input');
      expect(mockSearchInput.focus).toHaveBeenCalled();
      expect(mockSearchInput.select).toHaveBeenCalled();
    });

    it('Alt + M debería enfocar el contenido principal', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'm',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.main-content');
      expect(mockMainContent.focus).toHaveBeenCalled();
    });
  });

  describe('Navegación entre páginas', () => {
    it('Alt + 1 debería navegar a inicio', () => {
      const event = new KeyboardEvent('keydown', {
        key: '1',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(window.location.href).toBe('/home');
    });

    it('Alt + 2 debería navegar a catálogo', () => {
      const event = new KeyboardEvent('keydown', {
        key: '2',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(window.location.href).toBe('/catalog');
    });

    it('Alt + 3 debería navegar a sobre nosotros', () => {
      const event = new KeyboardEvent('keydown', {
        key: '3',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(window.location.href).toBe('/about');
    });

    it('Alt + 4 debería navegar a mapa del sitio', () => {
      const event = new KeyboardEvent('keydown', {
        key: '4',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(window.location.href).toBe('/sitemap');
    });

    it('Alt + 5 debería navegar a perfil', () => {
      const event = new KeyboardEvent('keydown', {
        key: '5',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(window.location.href).toBe('/profile');
    });
  });

  describe('Control de Video', () => {
    it('Space debería reproducir/pausar video', () => {
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
      expect(mockVideoElement.play).toHaveBeenCalled();
    });

    it('Alt + P debería reproducir/pausar video', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'p',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Alt + F debería activar pantalla completa', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'f',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Alt + M debería silenciar/activar sonido', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'm',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Flecha izquierda debería retroceder 10 segundos', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Flecha derecha debería avanzar 10 segundos', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Flecha arriba debería subir volumen', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('Flecha abajo debería bajar volumen', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });
  });

  describe('Catálogo y Filtros', () => {
    it('Alt + R debería resetear filtros', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'r',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.unyfilm-catalog__reset-btn');
    });

    it('Alt + G debería cambiar vista', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'g',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.unyfilm-catalog__view-button[aria-label="Vista de cuadrícula"]');
    });

    it('Alt + O debería ordenar por título', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'o',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('#sort-filter');
    });

    it('Alt + Y debería ordenar por año', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('#sort-filter');
    });

    it('Alt + T debería ordenar por rating', () => {
      const event = new KeyboardEvent('keydown', {
        key: 't',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('#sort-filter');
    });
  });

  describe('Ayuda y Accesibilidad', () => {
    it('Alt + H debería abrir ayuda', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'h',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.usability-help-btn');
    });

    it('Alt + A debería abrir panel de accesibilidad', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.accessibility-toggle');
    });

    it('Escape debería cerrar modales', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('[role="dialog"]');
    });
  });

  describe('Prevención de Eventos', () => {
    it('debería prevenir eventos por defecto para atajos Alt', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'h',
        altKey: true,
        bubbles: true
      });
      
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('debería prevenir eventos por defecto para Space', () => {
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true
      });
      
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Compatibilidad con Inputs', () => {
    it('no debería ejecutar atajos cuando el foco está en un input', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'text';
      
      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        writable: true
      });
      
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        target: mockInput
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).not.toHaveBeenCalledWith('video');
    });
  });
});
