import React, { useState } from 'react';
import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import './UnyFilmHeader.css';

/**
 * Header component with fixed search and profile
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearch - Search handler
 * @param {Function} props.onSearchSubmit - Search submit handler
 */
export default function UnyFilmHeader({ searchQuery, onSearch, onSearchSubmit }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

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
          {/* Notifications */}
          <div className="unyfilm-header__notifications">
            <button
              onClick={handleNotificationClick}
              className="unyfilm-header__notification-btn"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="unyfilm-header__notification-badge">3</span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="unyfilm-header__profile">
            <button
              onClick={handleProfileClick}
              className="unyfilm-header__profile-btn"
              aria-label="User profile"
            >
              <div className="unyfilm-header__profile-avatar">
                <User size={20} />
              </div>
              <div className="unyfilm-header__profile-info">
                <span className="unyfilm-header__profile-name">Usuario</span>
                <span className="unyfilm-header__profile-email">usuario@unyfilm.com</span>
              </div>
              <div className={`unyfilm-header__profile-arrow ${showProfileMenu ? 'unyfilm-header__profile-arrow--open' : ''}`}>
                ▼
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <UnyFilmDropdown onClose={() => setShowProfileMenu(false)} />
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
function UnyFilmDropdown({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
    const handleClickOutside = (event) => {
      if (!event.target.closest('.unyfilm-header__profile')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMenuClick = (action) => {
    console.log(`Menu clicked: ${action}`);
    onClose();
  };

  return (
    <div className={`unyfilm-dropdown ${isVisible ? 'unyfilm-dropdown--visible' : ''}`}>
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
function MenuItem({ icon, text, danger = false, onClick }) {
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
