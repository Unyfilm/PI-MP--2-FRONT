import { Link } from 'react-router-dom';
import { Mail, Phone, Globe } from 'lucide-react';
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
      </div>

      <div className="unyfilm-sitemap__grid">
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Soluciones</h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/catalog">Catálogo de Películas</Link></li>
            <li><Link to="/catalog">Películas en Tendencia</Link></li>
            <li><Link to="/catalog">Populares</Link></li>
            <li><Link to="/catalog">Para toda la familia</Link></li>
            <li><Link to="/catalog">Acción y Aventura</Link></li>
            <li><Link to="/catalog">Comedia</Link></li>
            <li><Link to="/catalog">Drama</Link></li>
          </ul>
        </div>

        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Cuenta de usuario</h3>
          <ul className="unyfilm-sitemap__list">
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
            <li><Link to="/profile">Mi perfil</Link></li>
            <li><Link to="/profile">Mis favoritos</Link></li>
            <li><Link to="/profile">Historial</Link></li>
            <li><Link to="/profile/edit">Configuración</Link></li>
          </ul>
        </div>

        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Recursos</h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="#help">Centro de ayuda</a></li>
            <li><a href="#faq">Preguntas frecuentes</a></li>
            <li><a href="#terms">Términos de servicio</a></li>
            <li><a href="#privacy">Política de privacidad</a></li>
            <li><a href="#cookies">Política de cookies</a></li>
          </ul>
        </div>

        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Contacto</h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="mailto:contacto@unyfilm.com"><Mail size={14}/> contacto@unyfilm.com</a></li>
            <li><a href="tel:+15551234567"><Phone size={14}/> +1 (555) 123-4567</a></li>
            <li><a href="https://www.unyfilm.com" target="_blank" rel="noopener noreferrer"><Globe size={14}/> www.unyfilm.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
