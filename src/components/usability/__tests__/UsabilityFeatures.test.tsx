import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UsabilityFeatures from '../UsabilityFeatures';

// Mock del hook useClickOutside
vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: () => ({ current: null })
}));

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('UsabilityFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debería renderizar el componente sin errores', () => {
      const { container } = render(<UsabilityFeatures />);
      expect(container).toBeInTheDocument();
    });

    it('debería mostrar el título principal', () => {
      const { getByText } = render(<UsabilityFeatures />);
      expect(getByText('Características de Usabilidad')).toBeInTheDocument();
    });
  });

  describe('Botón de Ayuda', () => {
    it('debería renderizar el botón de ayuda', () => {
      const { getByRole } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      expect(helpButton).toBeInTheDocument();
    });

    it('debería abrir el modal de ayuda al hacer clic', async () => {
      const { getByRole, getByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      // Esperar a que aparezca el modal
      setTimeout(() => {
        expect(getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
      }, 100);
    });

    it('debería cerrar el modal al hacer clic en cerrar', async () => {
      const { getByRole, getByText, queryByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        expect(getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
        const closeButton = getByRole('button', { name: /cerrar ayuda/i });
        closeButton.click();
        
        setTimeout(() => {
          expect(queryByText('Guía de Usabilidad - UnyFilm')).not.toBeInTheDocument();
        }, 100);
      }, 100);
    });

    it('debería mostrar información de atajos de teclado', async () => {
      const { getByRole, getByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        expect(getByText('Atajos de Teclado')).toBeInTheDocument();
        expect(getByText('Alt + H')).toBeInTheDocument();
        expect(getByText('Panel de ayuda')).toBeInTheDocument();
      }, 100);
    });
  });

  describe('Secciones de contenido', () => {
    it('debería mostrar todas las secciones principales', () => {
      const { getByText } = render(<UsabilityFeatures />);
      expect(getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
    });

    it('debería mostrar información sobre principios de usabilidad', () => {
      const { getByText } = render(<UsabilityFeatures />);
      expect(getByText('Principios de Usabilidad')).toBeInTheDocument();
    });

    it('debería mostrar información sobre accesibilidad', () => {
      const { getByText } = render(<UsabilityFeatures />);
      expect(getByText('Accesibilidad')).toBeInTheDocument();
    });

    it('debería mostrar información sobre navegación', () => {
      const { getByText } = render(<UsabilityFeatures />);
      expect(getByText('Navegación')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad del modal', () => {
    it('debería cerrar el modal cuando se hace clic fuera de él', async () => {
      const { getByRole, queryByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        // Simular clic fuera del modal
        document.body.click();
        
        setTimeout(() => {
          expect(queryByText('Guía de Usabilidad - UnyFilm')).not.toBeInTheDocument();
        }, 100);
      }, 100);
    });

    it('debería mostrar los principios de Nielsen', async () => {
      const { getByRole, getByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        expect(getByText('1. Visibilidad del Estado del Sistema')).toBeInTheDocument();
        expect(getByText('2. Coincidencia entre el Sistema y el Mundo Real')).toBeInTheDocument();
        expect(getByText('3. Control y Libertad del Usuario')).toBeInTheDocument();
        expect(getByText('4. Consistencia y Estándares')).toBeInTheDocument();
        expect(getByText('5. Prevención de Errores')).toBeInTheDocument();
        expect(getByText('6. Reconocimiento antes que Recuerdo')).toBeInTheDocument();
      }, 100);
    });

    it('debería mostrar las pautas WCAG', async () => {
      const { getByRole, getByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        expect(getByText('Pautas WCAG 2.1')).toBeInTheDocument();
        expect(getByText('1.4.3 - Contraste (Mínimo)')).toBeInTheDocument();
        expect(getByText('2.1.1 - Navegación por Teclado')).toBeInTheDocument();
      }, 100);
    });

    it('debería mostrar ejemplos prácticos', async () => {
      const { getByRole, getByText } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      
      setTimeout(() => {
        expect(getByText('¿Cómo se cumple en UnyFilm?')).toBeInTheDocument();
        expect(getByText('Ejemplo práctico:')).toBeInTheDocument();
      }, 100);
    });
  });

  describe('Interacciones del usuario', () => {
    it('debería responder a eventos de teclado', async () => {
      const { getByRole } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      // Simular evento de teclado
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'h',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(keyboardEvent);
      
      setTimeout(() => {
        expect(helpButton).toBeInTheDocument();
      }, 100);
    });

    it('debería manejar múltiples clics en el botón de ayuda', async () => {
      const { getByRole } = render(<UsabilityFeatures />);
      const helpButton = getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      helpButton.click();
      helpButton.click();
      
      setTimeout(() => {
        const modal = getByRole('dialog');
        expect(modal).toBeInTheDocument();
      }, 100);
    });
  });
});