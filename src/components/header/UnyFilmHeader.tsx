import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './UnyFilmHeader.scss';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;


interface UnyFilmHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * UnyFilmHeader
 *
 * Header component with a persistent search bar and user profile menu.
 * Follows camelCase for handlers and PascalCase for prop interfaces.
 *
 * @param {UnyFilmHeaderProps} props - Header props
 * @returns {JSX.Element} Header UI
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

  const handleSearchChange = (e: InputChangeEvent): void => {
    const query = e.target.value;
    if (onSearch) {
      onSearch(query);
    }
  };

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
            />
          </div>
        </div>

        
        <div className="unyfilm-header__right">
         
          <div className="unyfilm-header__profile">
            <button
              onClick={handleProfileClick}
              className={`unyfilm-header__profile-btn ${showProfileMenu ? 'unyfilm-header__profile-btn--active' : ''}`}
              aria-label="User profile"
              aria-expanded={showProfileMenu}
            >
              <div className="unyfilm-header__profile-avatar">
                <User size={20} />
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
 * MenuItem
 *
 * Stateless item for the profile dropdown menu.
 *
 * @param {{icon: React.ReactNode; text: string; danger?: boolean; onClick: () => void}} props - Item props
 * @returns {JSX.Element} Menu item UI
 */
interface MenuItemProps {
  icon: ReactNode;
  text: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({ icon, text, danger = false, onClick }: MenuItemProps) {
  const [isHover, setIsHover] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      className={`unyfilm-dropdown__menu-item ${isHover ? 'unyfilm-dropdown__menu-item--hover' : ''} ${danger ? 'unyfilm-dropdown__menu-item--danger' : ''}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
