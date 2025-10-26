import { Users, Heart, Star, Award, Globe, Shield } from 'lucide-react';
import './UnyFilmAbout.css';

/**
 * UnyFilmAbout
 *
 * React functional component that renders the "About" page for the UnyFilm application.
 * The component is purely presentational (no props) and organizes content into a hero
 * region and multiple informational sections describing mission, values, history,
 * global commitment, privacy & security, and the team.
 *
 * Structure (high level):
 * - root container: .unyfilm-about
 * - hero: .unyfilm-about__hero
 *   - title: .unyfilm-about__title
 *   - subtitle: .unyfilm-about__subtitle
 * - content: .unyfilm-about__content
 *   - sections: .unyfilm-about__section
 *     - section title: .unyfilm-about__section-title
 *     - section text: .unyfilm-about__text
 * - values grid: .unyfilm-about__values
 *   - individual value: .unyfilm-about__value (icon, heading, text)
 * - commitment / security blocks include icon containers with dedicated classes
 * - team list: .unyfilm-about__team with team-member cards and avatar/icon containers
 *
 * Icons:
 * - The component uses inline icon components (e.g., Users, Heart, Star, Award, Globe, Shield).
 * - Treat these icons as decorative by default or ensure they expose accessible names.
 *   If icons convey information, provide accessible text through aria-label or wrap with
 *   an element that has an appropriate accessible name. Otherwise, mark them aria-hidden.
 *
 * Accessibility notes:
 * - The component uses semantic headings (h1, h2, h3). Ensure document heading order is preserved
 *   when the component is used in larger pages.
 * - Ensure focusable interactive elements (if any are added later) receive appropriate keyboard handling.
 *
 * Styling and customization:
 * - Styling follows a BEM-like convention with the "unyfilm-about" prefix. Customize appearance by
 *   overriding these classes in your stylesheet or by composing additional wrappers.
 * - Consider extracting repeated pieces (value cards, team members) into smaller subcomponents
 *   if you need to render dynamic content or support lists from data sources.
 *
 * Internationalization:
 * - All visible text is currently hard-coded (Spanish). For i18n support, replace static strings
 *   with translations sourced from a localization system or pass localized strings via props.
 *
 * Extensibility:
 * - The component is stateless and can be extended to accept props for dynamic content (e.g., values list,
 *   team members array, localized strings) or callback handlers if interactive behavior is required.
 *
 * Example:
 * <UnyFilmAbout />
 *
 * @public
 * @author Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta, Jerson Otero, Julian Mosquera
 * @version 2.0.0
 * @since 2025-10
 * @returns {JSX.Element} A JSX element representing the UnyFilm "About" page.
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
