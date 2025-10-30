/**
 * useClickOutside
 * Calls the provided handler when a click occurs outside the referenced element.
 * @param onOutsideClick - callback to execute on outside clicks
 * @returns React.RefObject to attach to the root element
 */
import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(onOutsideClick: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOutsideClick]);

  return ref;
}

export default useClickOutside;
