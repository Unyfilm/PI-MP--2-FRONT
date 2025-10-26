import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { screen } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UsabilityFeatures from '../UsabilityFeatures';


vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: () => ({ current: null })
}));


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('UsabilityFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === '.unyfilm-sidebar') {
        return {
          focus: vi.fn(),
          querySelector: vi.fn().mockReturnValue({
            focus: vi.fn()
          })
        } as any;
      }
      if (selector === '#search-input') {
        return {
          focus: vi.fn(),
          select: vi.fn()
        } as any;
      }
      if (selector === '.main-content') {
        return {
          focus: vi.fn()
        } as any;
      }
      if (selector === 'video') {
        return {
          paused: true,
          play: vi.fn(),
          pause: vi.fn(),
          muted: false,
          volume: 0.5,
          currentTime: 0
        } as any;
      }
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Botón de Ayuda', () => {
    it('debería renderizar el botón de ayuda', () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      expect(helpButton).toBeInTheDocument();
    });

    it('debería abrir el modal de ayuda al hacer clic', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        expect(screen.getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
      });
    });

    it('debería cerrar el modal al hacer clic en el botón de cerrar', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      await waitFor(() => {
        expect(screen.getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /cerrar ayuda/i });
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Guía de Usabilidad - UnyFilm')).not.toBeInTheDocument();
      });
    });
  });

  describe('Atajos de Teclado', () => {
    it('debería mostrar los atajos de teclado en el modal', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        expect(screen.getByText('Atajos de Teclado')).toBeInTheDocument();
        expect(screen.getByText('Alt + H')).toBeInTheDocument();
        expect(screen.getByText('Panel de ayuda')).toBeInTheDocument();
      });
    });

    it('debería ejecutar Alt + H para abrir ayuda', () => {
      render(<UsabilityFeatures />);
      
      const event = new KeyboardEvent('keydown', {
        key: 'h',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(screen.getByText('Guía de Usabilidad - UnyFilm')).toBeInTheDocument();
    });

    it('debería ejecutar Alt + S para enfocar búsqueda', () => {
      render(<UsabilityFeatures />);
      
      const event = new KeyboardEvent('keydown', {
        key: 's',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('#search-input');
    });

    it('debería ejecutar Alt + N para enfocar sidebar', () => {
      render(<UsabilityFeatures />);
      
      const event = new KeyboardEvent('keydown', {
        key: 'n',
        altKey: true,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('.unyfilm-sidebar');
    });

    it('debería ejecutar Escape para cerrar modales', () => {
      render(<UsabilityFeatures />);
      
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      fireEvent.click(helpButton);
      
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(screen.queryByText('Guía de Usabilidad - UnyFilm')).not.toBeInTheDocument();
    });

    it('debería ejecutar Space para controlar video', () => {
      render(<UsabilityFeatures />);
      
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });

    it('debería ejecutar flechas para controlar video', () => {
      render(<UsabilityFeatures />);
      
      const leftEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true
      });
      document.dispatchEvent(leftEvent);
      
      const rightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true
      });
      document.dispatchEvent(rightEvent);
      
      expect(document.querySelector).toHaveBeenCalledWith('video');
    });
  });

  describe('Heurísticas de Usabilidad', () => {
    it('debería mostrar las 6 heurísticas de Nielsen', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        expect(screen.getByText('1. Visibilidad del Estado del Sistema')).toBeInTheDocument();
        expect(screen.getByText('2. Coincidencia entre el Sistema y el Mundo Real')).toBeInTheDocument();
        expect(screen.getByText('3. Control y Libertad del Usuario')).toBeInTheDocument();
        expect(screen.getByText('4. Consistencia y Estándares')).toBeInTheDocument();
        expect(screen.getByText('5. Prevención de Errores')).toBeInTheDocument();
        expect(screen.getByText('6. Reconocimiento antes que Recuerdo')).toBeInTheDocument();
      });
    });

    it('debería mostrar las pautas WCAG', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        expect(screen.getByText('Pautas WCAG 2.1')).toBeInTheDocument();
        expect(screen.getByText('1.4.3 - Contraste (Mínimo)')).toBeInTheDocument();
        expect(screen.getByText('2.1.1 - Navegación por Teclado')).toBeInTheDocument();
      });
    });

    it('debería mostrar ejemplos prácticos de las heurísticas', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        expect(screen.getByText('¿Cómo se cumple en UnyFilm?')).toBeInTheDocument();
        expect(screen.getByText('Ejemplo práctico:')).toBeInTheDocument();
      });
    });
  });

  describe('Notificaciones', () => {
    it('debería mostrar notificación de bienvenida para nuevos usuarios', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      render(<UsabilityFeatures />);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('unyfilm-visited', 'true');
    });

    it('no debería mostrar notificación para usuarios existentes', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      render(<UsabilityFeatures />);
      
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith('unyfilm-visited', 'true');
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener atributos ARIA correctos', () => {
      render(<UsabilityFeatures />);
      
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      expect(helpButton).toHaveAttribute('aria-pressed');
      expect(helpButton).toHaveAttribute('aria-label');
    });

    it('debería tener modal con atributos de accesibilidad', async () => {
      render(<UsabilityFeatures />);
      const helpButton = screen.getByRole('button', { name: /mostrar u ocultar ayuda/i });
      
      fireEvent.click(helpButton);
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('aria-labelledby');
      });
    });
  });
});
