import { Home, Film, User, Info, Mail, Phone, Globe } from 'lucide-react';
import './UnyFilmSitemap.css';

/**
 * Site Map component showing all available pages and sections
 * @component
 * @returns {JSX.Element} Site map with navigation structure
 */
export default function UnyFilmSitemap() {
  return (
    <div className="unyfilm-sitemap">
      <div className="unyfilm-sitemap__header">
        <h1 className="unyfilm-sitemap__title">Mapa del Sitio</h1>
        <p className="unyfilm-sitemap__subtitle">
          Navega fácilmente por todas las secciones de UnyFilm
        </p>
      </div>

      <div className="unyfilm-sitemap__content">
        <section className="unyfilm-sitemap__section">
          <h2 className="unyfilm-sitemap__section-title">
            <Home className="unyfilm-sitemap__icon" />
            Páginas Principales
          </h2>
          <div className="unyfilm-sitemap__links">
            <a href="#home" className="unyfilm-sitemap__link">
              <Home size={16} />
              Inicio
            </a>
            <a href="#catalog" className="unyfilm-sitemap__link">
              <Film size={16} />
              Catálogo de Películas
            </a>
            <a href="#about" className="unyfilm-sitemap__link">
              <Info size={16} />
              Sobre Nosotros
            </a>
            <a href="#profile" className="unyfilm-sitemap__link">
              <User size={16} />
              Mi Perfil
            </a>
          </div>
        </section>

        <section className="unyfilm-sitemap__section">
          <h2 className="unyfilm-sitemap__section-title">
            <Film className="unyfilm-sitemap__icon" />
            Contenido
          </h2>
          <div className="unyfilm-sitemap__links">
            <a href="#trending" className="unyfilm-sitemap__link">
              Películas en Tendencia
            </a>
            <a href="#popular" className="unyfilm-sitemap__link">
              Películas Populares
            </a>
            <a href="#kids" className="unyfilm-sitemap__link">
              Contenido Familiar
            </a>
            <a href="#action" className="unyfilm-sitemap__link">
              Acción y Aventura
            </a>
            <a href="#comedy" className="unyfilm-sitemap__link">
              Comedia
            </a>
            <a href="#drama" className="unyfilm-sitemap__link">
              Drama
            </a>
          </div>
        </section>

        <section className="unyfilm-sitemap__section">
          <h2 className="unyfilm-sitemap__section-title">
            <User className="unyfilm-sitemap__icon" />
            Cuenta de Usuario
          </h2>
          <div className="unyfilm-sitemap__links">
            <a href="#login" className="unyfilm-sitemap__link">
              Iniciar Sesión
            </a>
            <a href="#register" className="unyfilm-sitemap__link">
              Registrarse
            </a>
            <a href="#profile-edit" className="unyfilm-sitemap__link">
              Editar Perfil
            </a>
            <a href="#favorites" className="unyfilm-sitemap__link">
              Mis Favoritos
            </a>
            <a href="#history" className="unyfilm-sitemap__link">
              Historial de Visualización
            </a>
            <a href="#settings" className="unyfilm-sitemap__link">
              Configuración
            </a>
          </div>
        </section>

        <section className="unyfilm-sitemap__section">
          <h2 className="unyfilm-sitemap__section-title">
            <Globe className="unyfilm-sitemap__icon" />
            Información
          </h2>
          <div className="unyfilm-sitemap__links">
            <a href="#help" className="unyfilm-sitemap__link">
              Centro de Ayuda
            </a>
            <a href="#faq" className="unyfilm-sitemap__link">
              Preguntas Frecuentes
            </a>
            <a href="#terms" className="unyfilm-sitemap__link">
              Términos de Servicio
            </a>
            <a href="#privacy" className="unyfilm-sitemap__link">
              Política de Privacidad
            </a>
            <a href="#cookies" className="unyfilm-sitemap__link">
              Política de Cookies
            </a>
          </div>
        </section>

        <section className="unyfilm-sitemap__section">
          <h2 className="unyfilm-sitemap__section-title">
            <Mail className="unyfilm-sitemap__icon" />
            Contacto
          </h2>
          <div className="unyfilm-sitemap__contact">
            <div className="unyfilm-sitemap__contact-item">
              <Mail size={20} />
              <span>contacto@unyfilm.com</span>
            </div>
            <div className="unyfilm-sitemap__contact-item">
              <Phone size={20} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="unyfilm-sitemap__contact-item">
              <Globe size={20} />
              <span>www.unyfilm.com</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
