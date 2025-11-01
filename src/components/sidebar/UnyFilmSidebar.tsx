/**
 * UnyFilmSidebar component
 * Fixed navigation sidebar with quick links, accessibility options and logout.
 * Uses Favorites and Auth contexts indirectly via navigation and actions.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Film, Heart, LogOut, Eye, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import logoImage from '../../images/logo3.png';
import './UnyFilmSidebar.css';
import type { ViewType } from '../../types';

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
  
  const accessibilityRef = useClickOutside<HTMLDivElement>(() => {
    setShowAccessibility(false);
  });

  const toggleAccessibility = () => {
    setShowAccessibility(!showAccessibility);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Download user manual PDF
   * Works in both development and production environments
   */
  const handleDownloadManual = () => {
    const fileName = 'ManualDeUsuarioUnyFilm.pdf';
    const filePath = `/${fileName}`;
    
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="unyfilm-sidebar">
      <div 
        className="unyfilm-sidebar__logo" 
        onClick={() => {
          const container = document.querySelector('.movie-app-container') as HTMLElement | null;
          if (container && container.classList.contains('movie-app-container--sidebar-open')) {
            container.classList.remove('movie-app-container--sidebar-open');
            const toggleBtn = document.querySelector('.sidebar-toggle') as HTMLElement | null;
            if (toggleBtn) toggleBtn.style.display = 'block';
          }
        }} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const container = document.querySelector('.movie-app-container') as HTMLElement | null;
            if (container && container.classList.contains('movie-app-container--sidebar-open')) {
              container.classList.remove('movie-app-container--sidebar-open');
              const toggleBtn = document.querySelector('.sidebar-toggle') as HTMLElement | null;
              if (toggleBtn) toggleBtn.style.display = 'block';
            }
          }
        }}
        role="button" 
        aria-label="Cerrar menú"
        tabIndex={0}
      >
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
        <NavIcon 
          icon={<FileText size={24} strokeWidth={2} />}
          label="Manual de Usuario"
          onClick={handleDownloadManual}
        />
      </nav>
      
      <div className="unyfilm-sidebar__bottom">
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
                    <input type="checkbox" tabIndex={0} aria-label="Activar alto contraste" />
                    <span>Alto contraste</span>
                  </label>
                  <label>
                    <input type="checkbox" tabIndex={0} aria-label="Reducir animaciones" />
                    <span>Reducir animaciones</span>
                  </label>
                  <label>
                    <input type="checkbox" tabIndex={0} aria-label="Mostrar indicadores de foco" />
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
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
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
      className={`unyfilm-sidebar__nav-icon ${active ? 'unyfilm-sidebar__nav-icon--active' : ''} ${isHover ? 'unyfilm-sidebar__nav-icon--hover' : ''}`}
      title={label}
      aria-label={label}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : "img"}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {React.cloneElement(icon as any, { 'aria-hidden': true })}
      <span className="sr-only">{label}</span>
    </div>
  );
}
