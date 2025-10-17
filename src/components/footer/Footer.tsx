import { Link } from 'react-router-dom';
import { Home, Film, User, Info, Map, Mail, Phone, Globe, Heart, History, Settings } from 'lucide-react';
import './Footer.css';

/**
 * Global Footer component with navigation to all existing pages
 * @component
 * @returns {JSX.Element} Footer with navigation links
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__content">
          {/* Navigation Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <Home size={20} />
              Navegación
            </h3>
            <div className="footer__links">
              <Link to="/home" className="footer__link">
                <Home size={16} />
                Inicio
              </Link>
              <Link to="/catalog" className="footer__link">
                <Film size={16} />
                Catálogo
              </Link>
              <Link to="/about" className="footer__link">
                <Info size={16} />
                Sobre Nosotros
              </Link>
              <Link to="/sitemap" className="footer__link">
                <Map size={16} />
                Mapa del Sitio
              </Link>
            </div>
          </div>

          {/* Content Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <Film size={20} />
              Contenido
            </h3>
            <div className="footer__links">
              <Link to="/catalog" className="footer__link">
                Películas en Tendencia
              </Link>
              <Link to="/catalog" className="footer__link">
                Películas Populares
              </Link>
              <Link to="/catalog" className="footer__link">
                Contenido Familiar
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="footer__section">
            <h3 className="footer__title">
              <User size={20} />
              Usuario
            </h3>
            <div className="footer__links">
              <Link to="/profile" className="footer__link">
                <User size={16} />
                Mi Perfil
              </Link>
              <Link to="/profile" className="footer__link">
                <Heart size={16} />
                Mis Favoritos
              </Link>
              <Link to="/profile" className="footer__link">
                <History size={16} />
                Historial
              </Link>
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

        {/* Bottom Horizontal Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © 2025 UnyFilm. Todos los derechos reservados.
            </p>
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

