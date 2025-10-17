import { useEffect, useRef } from 'react';

/**
 * useClickOutside
 *
 * React hook that calls the provided callback when the user clicks
 * outside of the referenced element. Commonly used to close modals,
 * dropdowns, popovers, or any floating panel when clicking on the
 * page background.
 *
 * Notes:
 * - This hook attaches a global 'mousedown' event listener on mount
 *   and removes it on unmount to avoid memory leaks.
 * - The returned ref must be attached to the container that should
 *   remain open when clicked inside.
 * - The callback is expected to be a stable reference. Prefer wrapping
 *   it in useCallback when the parent re-renders frequently.
 *
 * @template T - The HTMLElement subtype the ref will point to (defaults to HTMLDivElement)
 * @param {() => void} callback - Function invoked when a click outside is detected
 * @returns {React.RefObject<T>} A React ref to attach to the target element
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
