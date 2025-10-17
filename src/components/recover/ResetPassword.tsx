import { useState } from 'react';
import { Lock, Check, CheckCircle } from 'lucide-react';
import './Recover.scss';
import './ResetPassword.scss';
import collage from '../../images/collage.jpg';

export default function ResetPassword() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Checklist visual para contraseña
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!password) next.password = 'La contraseña es requerida';
    if (password && password.length < 8) next.password = 'Mínimo 8 caracteres';
    if (password && !/[A-Z]/.test(password)) next.password = 'Debe incluir al menos una mayúscula';
    if (password && !/[a-z]/.test(password)) next.password = 'Debe incluir al menos una minúscula';
    if (password && !/[0-9]/.test(password)) next.password = 'Debe incluir al menos un número';
    if (password && !/[^A-Za-z0-9]/.test(password)) next.password = 'Debe incluir al menos un carácter especial';
    if (!confirmPassword) next.confirmPassword = 'Confirma tu contraseña';
    if (password && confirmPassword && password !== confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden';
    return next;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setTouched({ password: true, confirmPassword: true });
    if (Object.keys(v).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        // Aquí se confirmaría el cambio de contraseña contra la API
        setIsLoading(false);
        alert('Contraseña actualizada.');
      }, 1200);
    }
  };

  return (
    <div className="login-page login-page--bg-hero">
      <div className="login-page__bg-gradient login-page__bg-gradient--1" />
      <div className="login-page__bg-gradient login-page__bg-gradient--2" />

      <div className="login-page__container">
        <div className="login-form">
          <h1 className="login-form__title">Confirmar cambio de contraseña</h1>
          <p className="login-form__subtitle">Ingresa y confirma tu nueva contraseña</p>

          <form onSubmit={handleSubmit} className="login-form__form">
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

            {/* Checklist bajo el campo de nueva contraseña */}
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


