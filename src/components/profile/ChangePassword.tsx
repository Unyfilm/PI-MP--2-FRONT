import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';
import './ChangePassword.scss';

/**
 * ChangePassword
 *
 * Component for changing user password. Requires current password validation
 * and follows the same design pattern as other profile pages.
 *
 * @returns {JSX.Element} Change password page UI
 */
export default function ChangePassword() {
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Checklist visual para nueva contraseña
  const passwordChecks = {
    length: formData.newPassword.length >= 8,
    upper: /[A-Z]/.test(formData.newPassword),
    lower: /[a-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[@$!%*?&]/.test(formData.newPassword),
  };

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    
    if (!formData.currentPassword) {
      next.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!formData.newPassword) {
      next.newPassword = 'La nueva contraseña es requerida';
    } else if (!validatePassword(formData.newPassword)) {
      next.newPassword = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo';
    }
    
    if (!formData.confirmPassword) {
      next.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      next.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      next.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    
    return next;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const result = await changePassword(
          formData.currentPassword,
          formData.newPassword,
          formData.confirmPassword
        );
        
        if (result.success) {
          setSuccess(true);
          
          // Opcional: Logout automático después de cambiar contraseña para mayor seguridad
          setTimeout(() => {
            logout();
            navigate('/login', { 
              state: { message: 'Contraseña cambiada exitosamente. Inicia sesión nuevamente.' }
            });
          }, 2000);
        } else {
          setErrors({ general: result.message || 'Error al cambiar la contraseña' });
        }
      } catch (error) {
        console.error('Error changing password:', error);
        setErrors({ general: 'Error de conexión. Por favor, intenta de nuevo.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div className="profile-page">
        <div className="profile-mosaic" aria-hidden="true">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} className="profile-mosaic__tile" />
          ))}
        </div>
        <div className="profile-card">
          <h1 className="profile-card__title">¡Contraseña actualizada!</h1>
          <p className="profile-card__subtitle">
            Tu contraseña ha sido cambiada exitosamente.
          </p>
          <p className="profile-card__subtitle">
            Por seguridad, serás desconectado para que inicies sesión nuevamente...
          </p>

          <div className="profile-card__actions">
            <Link to="/login" className="profile-card__button">Ir al login ahora</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card change-password-card">
        <h1 className="profile-card__title">Cambiar contraseña</h1>
        <p className="profile-card__subtitle">
          Ingresa tu contraseña actual y define una nueva contraseña segura
        </p>

        <form onSubmit={handleSubmit} className="change-password-form">
          {errors.general && (
            <div className="form-field__error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          {/* Contraseña actual */}
          <div className="form-field">
            <label className="form-field__label">Contraseña actual</label>
            <div className="form-field__input-wrapper">
              <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('currentPassword')}
                placeholder="Ingresa tu contraseña actual"
                className={`form-field__input form-field__input--password ${touched.currentPassword && errors.currentPassword ? 'form-field__input--error' : ''}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="form-field__toggle">
                {showPasswords.current ? <EyeOff size={22} strokeWidth={2.5} color="#ffffff" /> : <Eye size={22} strokeWidth={2.5} color="#ffffff" />}
              </button>
            </div>
            {touched.currentPassword && errors.currentPassword && (
              <p className="form-field__error">{errors.currentPassword}</p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className="form-field">
            <label className="form-field__label">Nueva contraseña</label>
            <div className="form-field__input-wrapper">
              <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('newPassword')}
                placeholder="Nueva contraseña segura"
                className={`form-field__input form-field__input--password ${touched.newPassword && errors.newPassword ? 'form-field__input--error' : ''}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="form-field__toggle">
                {showPasswords.new ? <EyeOff size={22} strokeWidth={2.5} color="#ffffff" /> : <Eye size={22} strokeWidth={2.5} color="#ffffff" />}
              </button>
            </div>
            {touched.newPassword && errors.newPassword && (
              <p className="form-field__error">{errors.newPassword}</p>
            )}
          </div>

          {/* Checklist de nueva contraseña */}
          <div className={`password-checklist ${formData.newPassword ? 'password-checklist--show' : ''}`}>
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
              <span className="password-checklist__dot" /> Al menos un carácter especial (@$!%*?&)
              {passwordChecks.special && <CheckCircle size={14} className="password-checklist__icon" />}
            </div>
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="form-field">
            <label className="form-field__label">Confirmar nueva contraseña</label>
            <div className="form-field__input-wrapper">
              <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirma tu nueva contraseña"
                className={`form-field__input form-field__input--password ${touched.confirmPassword && errors.confirmPassword ? 'form-field__input--error' : ''}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="form-field__toggle">
                {showPasswords.confirm ? <EyeOff size={22} strokeWidth={2.5} color="#ffffff" /> : <Eye size={22} strokeWidth={2.5} color="#ffffff" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="form-field__error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="profile-card__actions change-password-actions">
            <Link to="/profile" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }}>
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`profile-card__button profile-card__button--primary ${isLoading ? 'profile-card__button--loading' : ''}`}>
              {isLoading ? (
                <>
                  <div className="profile-card__spinner" />
                  Cambiando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Cambiar contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}