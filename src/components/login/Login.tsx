/**
 * @file Login.tsx
 * @description
 * Login page component for the UnyFilm platform.  
 * Handles user authentication via email and password, client-side validation, and accessibility labels.
 * The UI text remains in Spanish as per UX copy requirements.
 * 
 * Implements validation rules, password visibility toggle, error feedback, and navigation after successful login.
 * 
 * @version 3.0.0
 * @module Login
 * 
 * @author
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../../images/logo2.png';
import collage from '../../images/collage.jpg';
import './Login.scss';
import { useAuth } from '../../contexts/AuthContext';

/**
 * @interface FormErrors
 * @description
 * Represents the validation error messages for each field in the login form.
 *
 * @property {string} email - Error message for the email field.
 * @property {string} password - Error message for the password field.
 */
interface FormErrors {
  email: string;
  password: string;
}

/**
 * @interface TouchedFields
 * @description
 * Tracks whether each form field has been interacted with to manage error visibility.
 *
 * @property {boolean} email - True if email input has been touched.
 * @property {boolean} password - True if password input has been touched.
 */
interface TouchedFields {
  email: boolean;
  password: boolean;
}

/**
 * Login Component
 * 
 * Renders the email/password login form and manages:
 * - Form state and validation
 * - Password visibility toggle
 * - API authentication via context
 * - Client-side accessibility feedback
 *
 * @function Login
 * @returns {JSX.Element} Rendered login form UI.
 */
export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<TouchedFields>({ email: false, password: false });
  const [apiError, setApiError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  /**
   * Validates the email format and presence.
   * @param {string} value - User-entered email value.
   * @returns {string} Validation error message or an empty string if valid.
   */
  const validateEmail = (value: string): string => {
    if (!value) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Correo electrónico inválido';
    return '';
  };

  
  /**
   * Validates the password's strength and length.
   * @param {string} value - User-entered password.
   * @returns {string} Validation error message or an empty string if valid.
   */
  const validatePassword = (value: string): string => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'Debe incluir al menos una mayúscula';
    if (!/[a-z]/.test(value)) return 'Debe incluir al menos una minúscula';
    if (!/[0-9]/.test(value)) return 'Debe incluir al menos un número';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Debe incluir al menos un carácter especial';
    return '';
  };

  /**
   * Handles real-time validation and updates email input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  /**
   * Handles real-time validation and updates password input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  /**
   * Marks a field as touched and triggers its validation.
   * @param {keyof TouchedFields} field - Field name ('email' or 'password').
   */
  const handleBlur = (field: keyof TouchedFields): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };
  
  /**
   * Handles the login form submission and triggers authentication.
   * Performs client-side validation before sending credentials to the backend.
   * @param {React.FormEvent<HTMLFormElement>} e - Submit event.
   * @returns {Promise<void>} - Asynchronous login result.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    setApiError('');
    if (!emailError && !passwordError) {
      try {
        setIsLoading(true);
        const result = await login(email, password);
        if (result.success) {
          navigate('/home');
        } else {
          setApiError(result.message || 'Error al iniciar sesión');
        }
      } catch (err: any) {
        setApiError(err?.message || 'Error de red');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg-gradient login-page__bg-gradient--1" />
      <div className="login-page__bg-gradient login-page__bg-gradient--2" />

      <div className="login-page__container">
        <div className="login-form">
          <div className="login-form__logo">
            <img src={logo2} alt="UnyFilm" className="login-form__logo-img" />
          </div>

          <h1 className="login-form__title">Inicio de sesión</h1>
          <p className="login-form__subtitle">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="login-form__form">
            {apiError && (
              <div className="form-field__error" role="alert" style={{ marginBottom: '8px' }}>
                {apiError}
              </div>
            )}
            <div className="form-field">
              <label className="form-field__label">Correo electrónico</label>
              <div className="form-field__input-wrapper">
                <Mail size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="example@correo.com"
                  className={`form-field__input ${errors.email && touched.email ? 'form-field__input--error' : ''}`}
                  tabIndex={0}
                  aria-label="Correo electrónico"
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="form-field__error" role="alert">{errors.email}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-field__label">Contraseña</label>
              <div className="form-field__input-wrapper">
                <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`form-field__input form-field__input--password ${errors.password && touched.password ? 'form-field__input--error' : ''}`}
                  tabIndex={0}
                  aria-label="Contraseña"
                  aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                  aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="form-field__toggle"
                  tabIndex={0}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={22} strokeWidth={2.5} color="#ffffff" /> : <Eye size={22} strokeWidth={2.5} color="#ffffff" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id="password-error" className="form-field__error" role="alert">{errors.password}</p>
              )}
            </div>

          <div className="login-form__forgot">
            <Link to="/recover" className="login-form__link">¿Olvidaste tu contraseña?</Link>
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`login-form__button ${isLoading ? 'login-form__button--loading' : ''}`}
              tabIndex={0}
              aria-label="Iniciar sesión"
            >
              {isLoading ? (
                <>
                  <div className="login-form__spinner" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-form__register">
            <span className="login-form__register-text">¿No tienes cuenta? </span>
            <Link to="/register" className="login-form__link login-form__link--bold">Regístrate</Link>
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
