/**
 * ResetPassword component
 * Confirms a password change using a token from the URL query string.
 * Performs strong password validation before calling the API.
 */
import { useState, useEffect } from 'react';
import { Lock, Check, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './Recover.scss';
import './ResetPassword.scss';
import collage from '../../images/collage.jpg';
import apiService from '../../services/apiService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    
    if (!token) {
      next.token = 'Token de recuperación requerido';
    }
    
    if (!password) {
      next.password = 'La contraseña es requerida';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        next.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo';
      }
    }
    
    if (!confirmPassword) {
      next.confirmPassword = 'Confirma tu contraseña';
    } else if (password && confirmPassword && password !== confirmPassword) {
      next.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ password: true, confirmPassword: true });
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      try {
        
        const response = await apiService.resetPassword(token, password, confirmPassword);
        
        if (response.success) {
          setResetSuccess(true);
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setErrors({ general: response.message || 'Error al restablecer la contraseña' });
        }
      } catch (error) {
        setErrors({ general: 'Error de conexión. Por favor, intenta de nuevo.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  
  if (resetSuccess) {
    return (
      <div className="login-page login-page--bg-hero">
        <div className="login-page__bg-gradient login-page__bg-gradient--1" />
        <div className="login-page__bg-gradient login-page__bg-gradient--2" />

        <div className="login-page__container">
          <div className="login-form">
            <h1 className="login-form__title">¡Contraseña actualizada!</h1>
            <p className="login-form__subtitle">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="login-form__subtitle">
              Serás redirigido al login en unos segundos...
            </p>

            <div className="login-form__register">
              <Link to="/login" className="login-form__link login-form__link--bold">Ir al login ahora</Link>
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

  
  if (!token && searchParams.get('token') === null) {
    return (
      <div className="login-page login-page--bg-hero">
        <div className="login-page__bg-gradient login-page__bg-gradient--1" />
        <div className="login-page__bg-gradient login-page__bg-gradient--2" />

        <div className="login-page__container">
          <div className="login-form">
            <h1 className="login-form__title">Enlace inválido</h1>
            <p className="login-form__subtitle">
              Este enlace de recuperación no es válido o ha expirado.
            </p>
            <p className="login-form__subtitle">
              Por favor, solicita un nuevo enlace de recuperación.
            </p>

            <div className="login-form__register">
              <Link to="/recover" className="login-form__link login-form__link--bold">Solicitar nuevo enlace</Link>
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
          <h1 className="login-form__title">Confirmar cambio de contraseña</h1>
          <p className="login-form__subtitle">Ingresa y confirma tu nueva contraseña</p>

          <form onSubmit={handleSubmit} className="login-form__form">
            {errors.general && (
              <div className="form-field__error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {errors.general}
              </div>
            )}
            
            <div className="form-field">
              <label className="form-field__label">Nueva contraseña</label>
              <div className="form-field__input-wrapper">
                <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  placeholder="••••••••"
                  className={`form-field__input form-field__input--password ${touched.password && errors.password ? 'form-field__input--error' : ''}`}
                />
              </div>
              {touched.password && errors.password && (<p className="form-field__error">{errors.password}</p>)}
            </div>

            <div className={`password-checklist ${password ? 'password-checklist--show' : ''}`}>
              <div className={`password-checklist__item ${passwordChecks.length ? 'password-checklist__item--ok' : ''}`}>
                <span className="password-checklist__dot" /> Mínimo 8 caracteres
                {passwordChecks.length && <CheckCircle size={14} className="password-checklist__icon" />}
              </div>
              <div className={`password-checklist__item ${passwordChecks.upper ? 'password-checklist__item--ok' : ''}`}>
                <span className="password-checklist__dot" /> Al menos una mayúscula
                {passwordChecks.upper && <CheckCircle size={14} className="password-checklist__icon" />}
              </div>
              <div className={`password-checklist__item ${passwordChecks.lower ? 'password-checklist__item--ok' : ''}`}>
                <span className="password-checklist__dot" /> Al menos una minúscula
                {passwordChecks.lower && <CheckCircle size={14} className="password-checklist__icon" />}
              </div>
              <div className={`password-checklist__item ${passwordChecks.number ? 'password-checklist__item--ok' : ''}`}>
                <span className="password-checklist__dot" /> Al menos un número
                {passwordChecks.number && <CheckCircle size={14} className="password-checklist__icon" />}
              </div>
              <div className={`password-checklist__item ${passwordChecks.special ? 'password-checklist__item--ok' : ''}`}>
                <span className="password-checklist__dot" /> Al menos un carácter especial
                {passwordChecks.special && <CheckCircle size={14} className="password-checklist__icon" />}
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label">Confirmar contraseña</label>
              <div className="form-field__input-wrapper">
                <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                  placeholder="••••••••"
                  className={`form-field__input form-field__input--password ${touched.confirmPassword && errors.confirmPassword ? 'form-field__input--error' : ''}`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (<p className="form-field__error">{errors.confirmPassword}</p>)}
            </div>

            <button type="submit" disabled={isLoading} className={`login-form__button ${isLoading ? 'login-form__button--loading' : ''}`}>
               {isLoading ? (
                 <>
                   <div className="login-form__spinner" />
                   Guardando...
                 </>
               ) : (
                 <>
                   <Check size={18} />
                   Confirmar contraseña
                 </>
               )}
             </button>
           </form>
        </div>

        <div className="login-hero">
          <img src={collage} alt="Collage" className="login-hero__image" />
          <div className="login-hero__overlay" />
        </div>
      </div>
    </div>
  );
}


