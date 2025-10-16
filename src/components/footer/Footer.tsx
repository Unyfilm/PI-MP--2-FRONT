import { Home, Film, User, Info, Map, Mail, Phone, Globe } from 'lucide-react';
import './Footer.css';

// Tipos locales para el footer
type ViewType = 'home' | 'catalog' | 'about' | 'sitemap';

interface FooterProps {
  setCurrentView: (view: ViewType) => void;
}

/**
 * Global Footer component that appears on all pages
 */
export default function Footer({ 
  setCurrentView
}: FooterProps) {
  /**
   * Handle navigation click with scroll to top
   * @param {string} view - View to navigate to
   */
  const handleNavigation = (view: ViewType): void => {
    setCurrentView(view);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Navigation Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <Home size={20} />
              Navegación
            </h3>
            <div className="footer__links">
              <button 
                onClick={() => handleNavigation('home')}
                className="footer__link"
              >
                <Home size={16} />
                Inicio
              </button>
              <button 
                onClick={() => handleNavigation('catalog')}
                className="footer__link"
              >
                <Film size={16} />
                Catálogo
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="footer__link"
              >
                <Info size={16} />
                Sobre Nosotros
              </button>
              <button 
                onClick={() => handleNavigation('sitemap')}
                className="footer__link"
              >
                <Map size={16} />
                Mapa del Sitio
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <Film size={20} />
              Contenido
            </h3>
            <div className="footer__links">
              <button 
                onClick={() => handleNavigation('catalog')}
                className="footer__link"
              >
                Películas en Tendencia
              </button>
              <button 
                onClick={() => handleNavigation('catalog')}
                className="footer__link"
              >
                Películas Populares
              </button>
              <button 
                onClick={() => handleNavigation('catalog')}
                className="footer__link"
              >
                Contenido Familiar
              </button>
            </div>
          </div>

          {/* User Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <User size={20} />
              Usuario
            </h3>
            <div className="footer__links">
              <button 
                onClick={() => handleNavigation('home')}
                className="footer__link"
              >
                Mi Perfil
              </button>
              <button 
                onClick={() => handleNavigation('home')}
                className="footer__link"
              >
                Mis Favoritos
              </button>
              <button 
                onClick={() => handleNavigation('home')}
                className="footer__link"
              >
                Historial
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <Mail size={20} />
              Contacto
            </h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Mail size={16} />
                <span>contacto@unyfilm.com</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="footer__contact-item">
                <Globe size={16} />
                <span>www.unyfilm.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p>&copy; 2025 UnyFilm. Todos los derechos reservados.</p>
            <div className="footer__bottom-links">
              <button className="footer__bottom-link">Términos de Servicio</button>
              <button className="footer__bottom-link">Política de Privacidad</button>
              <button className="footer__bottom-link">Cookies</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
