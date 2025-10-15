import React from 'react';
import { Home, Film, Heart, Users, Settings, LogOut, Info, Map } from 'lucide-react';
import logoImage from '../../images/logo 3.png';
import './UnyFilmSidebar.css';

/**
 * Sidebar component with fixed navigation
 * @param {Object} props - Component props
 * @param {string} props.currentView - Current active view
 * @param {Function} props.setCurrentView - Function to change view
 */
export default function UnyFilmSidebar({ currentView, setCurrentView }) {
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
        <NavIcon 
          active={currentView === 'home'} 
          onClick={() => setCurrentView('home')}
          icon={<Home size={24} strokeWidth={2} />}
          label="Inicio"
        />
        <NavIcon 
          active={currentView === 'catalog'} 
          onClick={() => setCurrentView('catalog')}
          icon={<Film size={24} strokeWidth={2} />}
          label="Catálogo"
        />
        <NavIcon 
          active={currentView === 'about'} 
          onClick={() => setCurrentView('about')}
          icon={<Info size={24} strokeWidth={2} />}
          label="Sobre Nosotros"
        />
        <NavIcon 
          active={currentView === 'sitemap'} 
          onClick={() => setCurrentView('sitemap')}
          icon={<Map size={24} strokeWidth={2} />}
          label="Mapa del Sitio"
        />
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
function NavIcon({ active = false, onClick, icon, label }) {
  const [isHover, setIsHover] = React.useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      className={`unyfilm-sidebar__nav-icon ${active ? 'unyfilm-sidebar__nav-icon--active' : ''} ${isHover ? 'unyfilm-sidebar__nav-icon--hover' : ''}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </div>
  );
}
