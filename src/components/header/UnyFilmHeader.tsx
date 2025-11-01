import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './UnyFilmHeader.scss';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * @file UnyFilmHeader.tsx
 * @description
 * Main header component for the UnyFilm platform.  
 * It provides a persistent search bar, a user profile dropdown, and accessibility attributes.
 * 
 * Follows the standard component structure and JSDoc conventions for TypeScript + React.  
 * Includes ARIA attributes for accessibility and keyboard navigation support.
 * 
 * @module UnyFilmHeader
 */

/**
 * @interface UnyFilmHeaderProps
 * @description
 * Defines the props for the `UnyFilmHeader` component.
 *
 * @property {string} searchQuery - Current search text.
 * @property {(query: string) => void} onSearch - Triggered when search input changes.
 * @property {(query: string) => void} onSearchSubmit - Triggered when user submits or stops typing.
 */
interface UnyFilmHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * @function UnyFilmHeader
 * @description
 * Persistent top navigation bar that includes a search field and a user profile menu.
 * 
 * Implements a delayed search submit (1s debounce) via `useEffect` for better UX.
 * The profile menu provides navigation to the user profile and logout functionality.
 *
 * @param {UnyFilmHeaderProps} props - Header props
 * @returns {JSX.Element} Header UI with search input and profile dropdown.
 *
 * @example
 * ```tsx
 * <UnyFilmHeader
 *   searchQuery={query}
 *   onSearch={setQuery}
 *   onSearchSubmit={handleSearchSubmit}
 * />
 * ```
 */
export default function UnyFilmHeader({ 
  searchQuery, 
  onSearch, 
  onSearchSubmit
}: UnyFilmHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') return;
    
    const timeoutId = setTimeout(() => {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

    /**
   * @function handleSearchChange
   * @description
   * Handles user input in the search field and triggers the onSearch callback.
   *
   * @param {InputChangeEvent} e - Change event from input field.
   * @returns {void}
   */
  const handleSearchChange = (e: InputChangeEvent): void => {
    const query = e.target.value;
    if (onSearch) {
      onSearch(query);
    }
  };

  /**
   * @function handleProfileClick
   * @description
   * Toggles visibility of the user profile dropdown.
   *
   * @returns {void}
   */
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className="unyfilm-header">
      <div className="unyfilm-header__container">
        
        <div className="unyfilm-header__search" id="search">
          <div className="unyfilm-header__search-input-container">
            <Search className="unyfilm-header__search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar película..."
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="unyfilm-header__search-input"
              id="search-input"
              tabIndex={0}
              aria-label="Buscar películas"
            />
          </div>
        </div>

        
        <div className="unyfilm-header__right">
         
          <div className="unyfilm-header__profile">
            <button
              onClick={handleProfileClick}
              className={`unyfilm-header__profile-btn ${showProfileMenu ? 'unyfilm-header__profile-btn--active' : ''}`}
              aria-label="Menú de perfil de usuario"
              aria-expanded={showProfileMenu}
              aria-haspopup="menu"
              aria-controls={showProfileMenu ? 'profile-menu' : undefined}
              tabIndex={0}
            >
              <div className="unyfilm-header__profile-avatar">
                <User size={20} aria-hidden="true" />
                <span className="sr-only">Abrir menú de perfil</span>
              </div>
              
            </button>

          
          {showProfileMenu && (
            <>
              <div className="unyfilm-profile-backdrop" onClick={() => setShowProfileMenu(false)} aria-hidden="true"></div>
              <UnyFilmDropdown onClose={() => setShowProfileMenu(false)} />
            </>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * UnyFilmDropdown
 *
 * Profile dropdown menu rendered under the header profile button.
 * Closes on outside click and exposes navigation actions including logout.
 *
 * @param {{ onClose: () => void }} props - Close handler
 * @returns {JSX.Element} Dropdown UI
 */
interface DropdownProps {
  onClose: () => void;
}

/**
 * @function UnyFilmDropdown
 * @description
 * Profile dropdown menu component rendered under the header profile button.  
 * Provides options to navigate to profile or logout.  
 * Closes automatically when clicking outside.
 *
 * @param {DropdownProps} props - Dropdown props.
 * @returns {JSX.Element} The dropdown menu UI.
 */
function UnyFilmDropdown({ onClose }: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('.unyfilm-header__profile')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  /**
   * @function handleMenuClick
   * @description
   * Handles click actions inside the dropdown (e.g., navigating or logging out).
   *
   * @param {'profile' | 'notifications' | 'settings' | 'help' | 'logout'} action - Menu action type.
   * @returns {void}
   */
  const handleMenuClick = (action: 'profile' | 'notifications' | 'settings' | 'help' | 'logout') => {
    if (action === 'profile') {
      navigate('/profile');
      onClose();
      return;
    }
    if (action === 'logout') {
      logout();
      navigate('/login');
      onClose();
      return;
    }
    onClose();
  };

  return (
    <div 
      className={`unyfilm-dropdown ${isVisible ? 'unyfilm-dropdown--visible' : ''}`}
      role="menu"
      aria-label="Menú de perfil"
      id="profile-menu"
      style={{
        position: 'absolute',
        zIndex: 9999,
        top: '50px',
        right: '0'
      }}
    >
      
      <div className="unyfilm-dropdown__menu">
        <MenuItem 
          icon={<User size={18} />} 
          text="Mi Perfil" 
          onClick={() => handleMenuClick('profile')}
        />
        <div className="unyfilm-dropdown__divider"></div>
        <MenuItem 
          icon={<LogOut size={18} />} 
          text="Cerrar Sesión" 
          danger 
          onClick={() => handleMenuClick('logout')}
        />
      </div>
    </div>
  );
}

/**
 * @interface MenuItemProps
 * @description
 * Props for the MenuItem component used inside the profile dropdown.
 *
 * @property {ReactNode} icon - Icon element displayed beside the text.
 * @property {string} text - Label of the menu item.
 * @property {boolean} [danger=false] - Marks the item as a dangerous action (e.g., logout).
 * @property {() => void} onClick - Click handler for the menu item.
 */
interface MenuItemProps {
  icon: ReactNode;
  text: string;
  danger?: boolean;
  onClick: () => void;
}

/**
 * @function MenuItem
 * @description
 * Stateless component representing a single item in the profile dropdown.  
 * Supports hover states, keyboard activation (Enter/Space), and ARIA roles.
 *
 * @param {MenuItemProps} props - Item properties.
 * @returns {JSX.Element} Rendered dropdown item.
 */
function MenuItem({ icon, text, danger = false, onClick }: MenuItemProps) {
  const [isHover, setIsHover] = useState(false);
  
  /**
   * @function handleKeyDown
   * @description
   * Enables keyboard navigation by triggering click on Enter or Space key.
   *
   * @param {React.KeyboardEvent} e - Keyboard event object.
   * @returns {void}
   */  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`unyfilm-dropdown__menu-item ${isHover ? 'unyfilm-dropdown__menu-item--hover' : ''} ${danger ? 'unyfilm-dropdown__menu-item--danger' : ''}`}
      role="menuitem"
      tabIndex={0}
      aria-label={text}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
