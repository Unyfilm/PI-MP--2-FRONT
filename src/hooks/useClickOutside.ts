import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para detectar clics fuera de un elemento
 * Útil para cerrar modales, dropdowns, etc. al hacer clic fuera
 * 
 * @param callback - Función a ejecutar cuando se hace clic fuera
 * @returns ref - Referencia al elemento que se debe monitorear
 */
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Agregar listener cuando el componente se monta
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
