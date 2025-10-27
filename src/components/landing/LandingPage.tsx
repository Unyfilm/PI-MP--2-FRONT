import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Film, Tv, Menu, X } from 'lucide-react';
import './LandingPage.css';
import '../footer/Footer.css';

/**
 * LandingPage
 * 
 * Página principal de la aplicación UnyFilm que se muestra antes del login/registro.
 * Incluye hero section, características, películas destacadas y footer completo.
 * 
 * @returns {JSX.Element} Landing page UI
 */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="landing-page">
      <nav className={`landing-navbar ${scrolled ? 'landing-navbar--scrolled' : ''}`}>
        <div className="landing-navbar__container">
          <div className="landing-navbar__content">
            <div className="landing-navbar__logo">
              <img 
                src="/images/logo4.png" 
                alt="UnyFilm Logo" 
                className="landing-navbar__logo-img"
              />
            </div>

            <div className="landing-navbar__actions">
              <Link to="/login" className="landing-navbar__btn-login">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="landing-navbar__btn-register">
                Registrarse
              </Link>
            </div>

            <button 
              className="landing-navbar__mobile-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="landing-mobile-menu">
            <div className="landing-mobile-menu__content">
              <Link to="/login" className="landing-mobile-menu__link">Iniciar Sesión</Link>
              <Link to="/register" className="landing-mobile-menu__btn-register">
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section id="inicio" className="landing-hero">
        <div className="landing-hero__bg">
            <img 
              src="/images/collage.jpg" 
              alt="Hero"
              className="landing-hero__image"
            />
          <div className="landing-hero__overlay"></div>
        </div>

        <div className="landing-hero__content">
          <div className="landing-hero__logo">
            <img 
              src="/images/logo3.png" 
              alt="UnyFilm Logo" 
              className="landing-hero__logo-img"
            />
          </div>
          <h1 className="landing-hero__title">
            El cine que te mueve, a un clic de ti.
          </h1>
          <p className="landing-hero__description">
            Descubre historias que te inspiran, te hacen reír y te conmueven.
            <br />
            Disfruta del mejor contenido donde quieras, cuando quieras.
          </p>
          <div className="landing-hero__actions">
            <Link to="/register" className="landing-hero__btn-primary">
              <Play className="landing-hero__btn-icon" size={24} />
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>


      <section id="por-que-unyfilm" className="landing-features">
        <div className="landing-section-container">
          <h2 className="landing-section-title landing-section-title--centered">
            ¿Por qué UnyFilm?
          </h2>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-card__icon">
                <Play size={32} />
              </div>
              <h3 className="landing-feature-card__title">Sin Publicidad</h3>
              <p className="landing-feature-card__description">
                Disfruta de tus películas favoritas sin interrupciones molestas.
              </p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-card__icon">
                <Film size={32} />
              </div>
              <h3 className="landing-feature-card__title">Contenido Exclusivo</h3>
              <p className="landing-feature-card__description">
                Accede a producciones originales y estrenos anticipados.
              </p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-card__icon">
                <Tv size={32} />
              </div>
              <h3 className="landing-feature-card__title">Multiplataforma</h3>
              <p className="landing-feature-card__description">
                Ve en cualquier dispositivo: TV, móvil, tablet o computadora.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-faq">
        <div className="landing-faq__container">
          <h2 className="landing-faq__title">
            Preguntas Frecuentes
          </h2>
          <div className="landing-faq__grid">
            <div className="landing-faq__item">
              <h3 className="landing-faq__question">¿Es gratis usar UnyFilm?</h3>
              <p className="landing-faq__answer">
                Sí, UnyFilm es completamente gratuito. No realizamos cobros ni suscripciones. 
                Puedes disfrutar de todo el contenido sin costo alguno.
              </p>
            </div>
            <div className="landing-faq__item">
              <h3 className="landing-faq__question">¿Necesito registrarme para ver películas?</h3>
              <p className="landing-faq__answer">
                Sí, necesitas crear una cuenta gratuita para acceder al catálogo de películas 
                y personalizar tu experiencia de visualización.
              </p>
            </div>
            <div className="landing-faq__item">
              <h3 className="landing-faq__question">¿Puedo descargar películas para ver sin internet?</h3>
              <p className="landing-faq__answer">
                Actualmente UnyFilm es una plataforma de streaming en línea que requiere conexión 
                a internet. 
              </p>
            </div>
            <div className="landing-faq__item">
              <h3 className="landing-faq__question">¿Hay contenido para toda la familia?</h3>
              <p className="landing-faq__answer">
                Sí, ofrecemos una amplia variedad de contenido incluyendo películas familiares, 
                documentales y contenido educativo para todas las edades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__bottom">
            <div className="footer__bottom-content">
              <p className="footer__copyright">
                © 2025 UnyFilm. Todos los derechos reservados.
              </p>
              <div className="footer__bottom-links">
                <a href="#inicio" className="footer__bottom-link">Inicio</a>
                <a href="#por-que-unyfilm" className="footer__bottom-link">¿Por qué UnyFilm?</a>
                <a href="#faq" className="footer__bottom-link">Preguntas Frecuentes</a>
                <Link to="/register" className="footer__bottom-link">Registrarse</Link>
                <Link to="/login" className="footer__bottom-link">Iniciar Sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
