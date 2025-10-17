import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../login/Login.scss';
import './Recover.scss';
import collage from '../../images/collage.jpg';
import apiService from '../../services/apiService';

export default function Recover() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const validateEmail = (value: string): string => {
    if (!value) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Correo electrónico inválido';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    setTouched(true);
    
    if (!err) {
      setIsLoading(true);
      
      try {
        const response = await apiService.recoverPassword(email);
        
        if (response.success) {
          setEmailSent(true);
        } else {
          setError(response.message || 'Error al enviar el correo de recuperación');
        }
      } catch (error) {
        console.error('Error sending recovery email:', error);
        setError('Error de conexión. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Si el correo fue enviado exitosamente, mostrar pantalla de confirmación
  if (emailSent) {
    return (
      <div className="login-page login-page--bg-hero">
        <div className="login-page__bg-gradient login-page__bg-gradient--1" />
        <div className="login-page__bg-gradient login-page__bg-gradient--2" />

        <div className="login-page__container">
          <div className="login-form">
            <h1 className="login-form__title">¡Correo enviado!</h1>
            <p className="login-form__subtitle">
              Si tu correo está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="login-form__subtitle">
              Revisa tu bandeja de entrada (y la carpeta de spam) y sigue las instrucciones del correo.
            </p>

            <div className="login-form__register">
              <Link to="/login" className="login-form__link login-form__link--bold">Volver al login</Link>
            </div>
          </div>

          <div className="login-hero">
            <img src={collage} alt="Collage" className="login-hero__image" />
            <div className="login-hero__overlay" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page login-page--bg-hero">
      <div className="login-page__bg-gradient login-page__bg-gradient--1" />
      <div className="login-page__bg-gradient login-page__bg-gradient--2" />

      <div className="login-page__container">
        <div className="login-form">

          <h1 className="login-form__title">Recuperación de contraseña</h1>
          <p className="login-form__subtitle">Ingresa tu correo para enviarte instrucciones</p>

          <form onSubmit={handleSubmit} className="login-form__form">
            <div className="form-field">
              <label className="form-field__label">Correo electrónico</label>
              <div className="form-field__input-wrapper">
                <Mail size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => { setTouched(true); setError(validateEmail(email)); }}
                  placeholder="Ejemplo: nombre@correo.com"
                  className={`form-field__input ${touched && error ? 'form-field__input--error' : ''}`}
                />
              </div>
              {touched && error && (<p className="form-field__error">{error}</p>)}
            </div>

            <button type="submit" disabled={isLoading} className={`login-form__button ${isLoading ? 'login-form__button--loading' : ''}`}>
              {isLoading ? (
                <>
                  <div className="login-form__spinner" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar enlace de recuperación
                </>
              )}
            </button>
          </form>

          <div className="login-form__register">
            <Link to="/login" className="login-form__link login-form__link--bold">Volver al login</Link>
          </div>
        </div>

        <div className="login-hero">
          <img src={collage} alt="Collage" className="login-hero__image" />
          <div className="login-hero__overlay" />
        </div>
      </div>
    </div>
  );
}


