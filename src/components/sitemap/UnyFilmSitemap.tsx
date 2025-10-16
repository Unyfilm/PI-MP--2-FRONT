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
        <h1 className="unyfilm-sitemap__title">Mapa del sitio</h1>
      </div>

      <div className="unyfilm-sitemap__grid">
        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Soluciones</h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="#catalog">Catálogo de Películas</a></li>
            <li><a href="#trending">Películas en Tendencia</a></li>
            <li><a href="#popular">Populares</a></li>
            <li><a href="#kids">Para toda la familia</a></li>
            <li><a href="#action">Acción y Aventura</a></li>
            <li><a href="#comedy">Comedia</a></li>
            <li><a href="#drama">Drama</a></li>
          </ul>
        </div>

        <div className="unyfilm-sitemap__col">
          <h3 className="unyfilm-sitemap__col-title">Cuenta de usuario</h3>
          <ul className="unyfilm-sitemap__list">
            <li><a href="#login">Iniciar sesión</a></li>
            <li><a href="#register">Registrarse</a></li>
            <li><a href="#profile">Mi perfil</a></li>
            <li><a href="#favorites">Mis favoritos</a></li>
            <li><a href="#history">Historial</a></li>
            <li><a href="#settings">Configuración</a></li>
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
            <li><Mail size={14}/> contacto@unyfilm.com</li>
            <li><Phone size={14}/> +1 (555) 123-4567</li>
            <li><Globe size={14}/> www.unyfilm.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
