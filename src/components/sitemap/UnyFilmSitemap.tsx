import { Link } from 'react-router-dom';
import { Home, Film, User, Heart, History, Mail, Phone, Globe, Info, Map, LogIn, UserPlus, Settings } from 'lucide-react';
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
        <h1 className="unyfilm-sitemap__title">Mapa del sitio</h1>
        <p className="unyfilm-sitemap__subtitle">Navega por todas las secciones disponibles en UnyFilm</p>
      </div>

      <div className="unyfilm-sitemap__grid">
        {/* Navegación Principal */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <Home size={20} />
            Navegación Principal
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/home"><Home size={16} /> Inicio</Link></li>
            <li><Link to="/catalog"><Film size={16} /> Catálogo</Link></li>
            <li><Link to="/about"><Info size={16} /> Sobre Nosotros</Link></li>
            <li><Link to="/sitemap"><Map size={16} /> Mapa del Sitio</Link></li>
          </ul>
        </div>

        {/* Contenido y Películas */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <Film size={20} />
            Contenido
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/catalog">Películas en Tendencia</Link></li>
            <li><Link to="/catalog">Películas Populares</Link></li>
            <li><Link to="/catalog">Contenido Familiar</Link></li>
            <li><Link to="/catalog">Acción y Aventura</Link></li>
            <li><Link to="/catalog">Comedia</Link></li>
            <li><Link to="/catalog">Drama</Link></li>
            <li><Link to="/catalog">Ciencia Ficción</Link></li>
            <li><Link to="/catalog">Animación</Link></li>
          </ul>
        </div>

        {/* Cuenta de Usuario */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <User size={20} />
            Cuenta de Usuario
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/login"><LogIn size={16} /> Iniciar Sesión</Link></li>
            <li><Link to="/register"><UserPlus size={16} /> Registrarse</Link></li>
            <li><Link to="/profile"><User size={16} /> Mi Perfil</Link></li>
            <li><Link to="/favorites"><Heart size={16} /> Mis Favoritos</Link></li>
            <li><Link to="/profile"><History size={16} /> Historial</Link></li>
            <li><Link to="/profile/edit"><Settings size={16} /> Configuración</Link></li>
          </ul>
        </div>

        {/* Recuperación de Cuenta */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <User size={20} />
            Recuperación
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/recover">Recuperar Contraseña</Link></li>
            <li><Link to="/reset-password">Restablecer Contraseña</Link></li>
          </ul>
        </div>

        {/* Recursos y Ayuda */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <Info size={20} />
            Recursos
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="#help">Centro de Ayuda</a></li>
            <li><a href="#faq">Preguntas Frecuentes</a></li>
            <li><a href="#tutorial">Tutorial de Uso</a></li>
            <li><a href="#accessibility">Características de Accesibilidad</a></li>
            <li><a href="#usability">Características de Usabilidad</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <Info size={20} />
            Legal
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="#terms">Términos de Servicio</a></li>
            <li><a href="#privacy">Política de Privacidad</a></li>
            <li><a href="#cookies">Política de Cookies</a></li>
            <li><a href="#dmca">DMCA</a></li>
            <li><a href="#copyright">Derechos de Autor</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">
            <Mail size={20} />
            Contacto
          </h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="mailto:contacto@unyfilm.com"><Mail size={16} /> contacto@unyfilm.com</a></li>
            <li><a href="tel:+15551234567"><Phone size={16} /> +1 (555) 123-4567</a></li>
            <li><a href="https://www.unyfilm.com" target="_blank" rel="noopener noreferrer"><Globe size={16} /> www.unyfilm.com</a></li>
            <li><a href="#support">Soporte Técnico</a></li>
            <li><a href="#feedback">Enviar Comentarios</a></li>
          </ul>
        </div>
      </div>

      {/* Información adicional */}
      <div className="unyfilm-sitemap__footer">
        <div className="unyfilm-sitemap__info">
          <h4>Información del Sitio</h4>
          <p>UnyFilm es una plataforma de streaming de películas con contenido diverso y características de accesibilidad avanzadas.</p>
          <div className="unyfilm-sitemap__features">
            <span className="feature-tag">Streaming HD</span>
            <span className="feature-tag">Accesibilidad</span>
            <span className="feature-tag">Responsive</span>
            <span className="feature-tag">Favoritos</span>
            <span className="feature-tag">Ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
