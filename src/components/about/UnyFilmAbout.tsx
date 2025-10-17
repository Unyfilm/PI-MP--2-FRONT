import { Users, Heart, Star, Award, Globe, Shield } from 'lucide-react';
import './UnyFilmAbout.css';

/**
 * About Us page component
 * @component
 * @returns {JSX.Element} About page with company information
 */
export default function UnyFilmAbout() {
  return (
    <div className="unyfilm-about">
      <div className="unyfilm-about__hero">
        <h1 className="unyfilm-about__title">Sobre UnyFilm</h1>
        <p className="unyfilm-about__subtitle">
          Tu plataforma de streaming favorita con el mejor contenido
        </p>
      </div>

      <div className="unyfilm-about__content">
        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Nuestra Misión</h2>
          <p className="unyfilm-about__text">
            En UnyFilm, creemos que el entretenimiento debe ser accesible para todos. 
            Nuestra misión es brindar una experiencia de streaming excepcional con 
            contenido de alta calidad y tecnología de vanguardia.
          </p>
        </section>

        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Nuestros Valores</h2>
          <div className="unyfilm-about__values">
            <div className="unyfilm-about__value">
              <Users className="unyfilm-about__value-icon" />
              <h3>Comunidad</h3>
              <p>Conectamos personas a través del entretenimiento</p>
            </div>
            <div className="unyfilm-about__value">
              <Heart className="unyfilm-about__value-icon" />
              <h3>Pasión</h3>
              <p>Amamos el cine y queremos compartirlo contigo</p>
            </div>
            <div className="unyfilm-about__value">
              <Star className="unyfilm-about__value-icon" />
              <h3>Calidad</h3>
              <p>Ofrecemos solo el mejor contenido</p>
            </div>
            <div className="unyfilm-about__value">
              <Award className="unyfilm-about__value-icon" />
              <h3>Excelencia</h3>
              <p>Nos esforzamos por superar expectativas</p>
            </div>
          </div>
        </section>

        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Nuestra Historia</h2>
          <p className="unyfilm-about__text">
            Fundada en 2023, UnyFilm nació de la visión de crear una plataforma 
            de streaming que priorice la experiencia del usuario y la calidad del 
            contenido. Desde nuestros inicios, hemos trabajado incansablemente 
            para ofrecer la mejor selección de películas y series.
          </p>
        </section>

        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Compromiso Global</h2>
          <div className="unyfilm-about__commitment">
            <Globe className="unyfilm-about__commitment-icon" />
            <p>
              Estamos comprometidos con la diversidad cultural y la representación 
              en el entretenimiento. Nuestra plataforma incluye contenido de todo 
              el mundo, celebrando diferentes culturas y perspectivas.
            </p>
          </div>
        </section>

        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Privacidad y Seguridad</h2>
          <div className="unyfilm-about__security">
            <Shield className="unyfilm-about__security-icon" />
            <p>
              Tu privacidad es nuestra prioridad. Utilizamos las mejores prácticas 
              de seguridad para proteger tu información personal y garantizar una 
              experiencia segura en nuestra plataforma.
            </p>
          </div>
        </section>

        <section className="unyfilm-about__section">
          <h2 className="unyfilm-about__section-title">Nuestro Equipo</h2>
          <div className="unyfilm-about__team">
            <div className="unyfilm-about__team-member">
              <div className="unyfilm-about__team-avatar">
                <Users className="unyfilm-about__team-icon" />
              </div>
              <h3>Hernan Garcia</h3>
              <p>Frontend</p>
            </div>
            <div className="unyfilm-about__team-member">
              <div className="unyfilm-about__team-avatar">
                <Users className="unyfilm-about__team-icon" />
              </div>
              <h3>Julieta Arteta</h3>
              <p>Frontend</p>
            </div>
            <div className="unyfilm-about__team-member">
              <div className="unyfilm-about__team-avatar">
                <Users className="unyfilm-about__team-icon" />
              </div>
              <h3>Juan Camilo Jimenez</h3>
              <p>Backend</p>
            </div>
            <div className="unyfilm-about__team-member">
              <div className="unyfilm-about__team-avatar">
                <Users className="unyfilm-about__team-icon" />
              </div>
              <h3>Jerson Otero</h3>
              <p>Frontend</p>
            </div>
            <div className="unyfilm-about__team-member">
              <div className="unyfilm-about__team-avatar">
                <Users className="unyfilm-about__team-icon" />
              </div>
              <h3>Julian Mosquera</h3>
              <p>Backend</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
