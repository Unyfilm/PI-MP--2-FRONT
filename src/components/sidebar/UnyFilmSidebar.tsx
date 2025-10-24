import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Film, Heart, LogOut, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import logoImage from '../../images/logo3.png';
import './UnyFilmSidebar.css';
import type { ViewType } from '../../types';

/**
 * UnyFilmSidebarProps
 *
 * Props for the fixed navigation sidebar.
 */
interface UnyFilmSidebarProps {
  currentView: ViewType;
}

/**
 * UnyFilmSidebar
 *
 * Fixed navigation sidebar with quick links, accessibility options,
 * and a logout action. Uses camelCase handlers and descriptive names.
 *
 * @param {UnyFilmSidebarProps} props - Sidebar props
 * @returns {JSX.Element} Sidebar UI
 */
export default function UnyFilmSidebar({ currentView }: UnyFilmSidebarProps) {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Hook para cerrar el panel de accesibilidad al hacer clic fuera
  const accessibilityRef = useClickOutside(() => {
    setShowAccessibility(false);
  });

  const toggleAccessibility = () => {
    setShowAccessibility(!showAccessibility);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="unyfilm-sidebar">
      <div className="unyfilm-sidebar__logo" onClick={() => {
        // Cerrar sidebar en móvil si existe el contenedor con clase abierta
        const container = document.querySelector('.movie-app-container') as HTMLElement | null;
        if (container && container.classList.contains('movie-app-container--sidebar-open')) {
          container.classList.remove('movie-app-container--sidebar-open');
          // Re-mostrar botón toggle si estaba oculto
          const toggleBtn = document.querySelector('.sidebar-toggle') as HTMLElement | null;
          if (toggleBtn) toggleBtn.style.display = 'block';
        }
      }} role="button" aria-label="Cerrar menú">
        <img 
          src={logoImage} 
          alt="UnyFilm Logo" 
          className="unyfilm-sidebar__logo-image"
        />
      </div>
      
      <nav className="unyfilm-sidebar__nav">
        <Link to="/home">
          <NavIcon 
            active={currentView === 'home'} 
            icon={<Home size={24} strokeWidth={2} />}
            label="Inicio"
          />
        </Link>
        <Link to="/catalog">
          <NavIcon 
            active={currentView === 'catalog'} 
            icon={<Film size={24} strokeWidth={2} />}
            label="Catálogo"
          />
        </Link>
        <Link to="/favorites">
          <NavIcon 
            active={currentView === 'favorites'} 
            icon={<Heart size={24} strokeWidth={2} />}
            label="Favoritos"
          />
        </Link>
      </nav>
      
      <div className="unyfilm-sidebar__bottom">
        {/* Accessibility button - only visible on mobile */}
        <div className="unyfilm-sidebar__accessibility">
          <NavIcon 
            icon={<Eye size={24} strokeWidth={2} />}
            label="Accesibilidad"
            onClick={toggleAccessibility}
          />
          {showAccessibility && (
            <>
              <div className="unyfilm-sidebar__accessibility-backdrop" onClick={() => setShowAccessibility(false)}></div>
              <div className="unyfilm-sidebar__accessibility-panel" ref={accessibilityRef}>
                <h4>Opciones de Accesibilidad</h4>
                <div className="unyfilm-sidebar__accessibility-controls">
                  <label>
                    <input type="checkbox" />
                    <span>Alto contraste</span>
                  </label>
                  <label>
                    <input type="checkbox" />
                    <span>Reducir animaciones</span>
                  </label>
                  <label>
                    <input type="checkbox" />
                    <span>Mostrar foco</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
        
        
        <NavIcon 
          icon={<LogOut size={24} strokeWidth={2} />}
          label="Cerrar Sesión"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

/**
 * NavIcon
 *
 * Generic navigation icon used within the sidebar.
 *
 * @param {{active?: boolean; icon: React.ReactNode; label: string; onClick?: () => void}} props - Icon props
 * @returns {JSX.Element} Icon button UI
 */
interface SidebarItemProps {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function NavIcon({ active = false, icon, label, onClick }: SidebarItemProps) {
  const [isHover, setIsHover] = React.useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      className={`unyfilm-sidebar__nav-icon ${active ? 'unyfilm-sidebar__nav-icon--active' : ''} ${isHover ? 'unyfilm-sidebar__nav-icon--hover' : ''}`}
      title={label}
      aria-label={label}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {icon}
    </div>
  );
}
