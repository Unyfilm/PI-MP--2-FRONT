import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import './UnyFilmHeader.scss';

// Tipos locales para el header
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface UnyFilmHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * Header component with fixed search and profile
 */
export default function UnyFilmHeader({ 
  searchQuery, 
  onSearch, 
  onSearchSubmit
}: UnyFilmHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchChange = (e: InputChangeEvent): void => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // const handleNotificationClick = () => {
  //   setShowNotifications(!showNotifications);
  // };

  return (
    <header className="unyfilm-header">
      <div className="unyfilm-header__container">
        {/* Search Bar */}
        <div className="unyfilm-header__search" id="search">
          <form onSubmit={handleSearchSubmit} className="unyfilm-header__search-form">
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch && onSearch('')}
                  className="unyfilm-header__search-clear"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="unyfilm-header__right">
          {/* Profile Dropdown */}
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
              {/* Only the icon is displayed inside the circular button */}
            </button>

          {/* Profile Dropdown Menu */}
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
 * Profile dropdown menu component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Close handler
 */
interface DropdownProps {
  onClose: () => void;
}

function UnyFilmDropdown({ onClose }: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
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
      // Aquí puedes agregar lógica de logout
      console.log('Logout clicked');
      onClose();
      return;
    }
    console.log(`Menu clicked: ${action}`);
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
      <div className="unyfilm-dropdown__header">
        <div className="unyfilm-dropdown__user-info">
          <div className="unyfilm-dropdown__avatar">
            <User size={24} />
          </div>
          <div className="unyfilm-dropdown__details">
            <span className="unyfilm-dropdown__name">Usuario</span>
            <span className="unyfilm-dropdown__email">usuario@unyfilm.com</span>
          </div>
        </div>
      </div>
      
      <div className="unyfilm-dropdown__divider"></div>
      
      <div className="unyfilm-dropdown__menu">
        <MenuItem 
          icon={<User size={18} />} 
          text="Mi Perfil" 
          onClick={() => handleMenuClick('profile')}
        />
        <MenuItem 
          icon={<Bell size={18} />} 
          text="Notificaciones" 
          onClick={() => handleMenuClick('notifications')}
        />
        <MenuItem 
          icon={<Settings size={18} />} 
          text="Configuración" 
          onClick={() => handleMenuClick('settings')}
        />
        <MenuItem 
          icon={<HelpCircle size={18} />} 
          text="Ayuda" 
          onClick={() => handleMenuClick('help')}
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
 * Menu item component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.text - Menu text
 * @param {boolean} props.danger - Whether it's a danger action
 * @param {Function} props.onClick - Click handler
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
