import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Film, Heart, Users, Settings, LogOut } from 'lucide-react';
import logoImage from '../../images/logo 3.png';
import './UnyFilmSidebar.css';
import type { ViewType } from '../../types';

// Interface específica para el sidebar
interface UnyFilmSidebarProps {
  currentView: ViewType;
}

/**
 * Sidebar component with fixed navigation
 */
export default function UnyFilmSidebar({ currentView }: UnyFilmSidebarProps) {
  return (
    <div className="unyfilm-sidebar">
      <div className="unyfilm-sidebar__logo">
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
        <NavIcon 
          icon={<Heart size={24} strokeWidth={2} />}
          label="Favoritos"
        />
        <NavIcon 
          icon={<Users size={24} strokeWidth={2} />}
          label="Usuarios"
        />
        <NavIcon 
          icon={<Settings size={24} strokeWidth={2} />}
          label="Configuración"
        />
      </nav>
      
      <div className="unyfilm-sidebar__bottom">
        <NavIcon 
          icon={<LogOut size={24} strokeWidth={2} />}
          label="Cerrar Sesión"
        />
      </div>
    </div>
  );
}

/**
 * Navigation icon component
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the icon is active
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.label - Accessibility label
 */
interface SidebarItemProps {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}

function NavIcon({ active = false, icon, label }: SidebarItemProps) {
  const [isHover, setIsHover] = React.useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`unyfilm-sidebar__nav-icon ${active ? 'unyfilm-sidebar__nav-icon--active' : ''} ${isHover ? 'unyfilm-sidebar__nav-icon--hover' : ''}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </div>
  );
}
