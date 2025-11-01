/**
 * @file ProfileEdit.tsx
 * @description
 * User profile editing page for the UnyFilm platform.
 * Provides a complete editable form for updating user details
 * (name, age, email) and changing password securely.
 * Integrates with the authentication context (AuthContext)
 * for backend updates and applies WCAG accessibility standards.
 *
 * Includes password validation (uppercase, lowercase, numeric, special)
 * and real-time visual feedback checklist.
 *
 * @module ProfileEdit
 *
 * @version 3.0.0
 *
 * @authors
 *  Hernan Garcia,
 *  Juan Camilo Jimenez,
 *  Julieta Arteta,
 *  Jerson Otero,
 *  Julian Mosquera
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';
import './Notification.scss';

/**
 * @component
 * @name ProfileEdit
 * @description
 * Allows the authenticated user to edit personal information (name, last name, age, email)
 * and optionally update their password with security validations.
 * Interacts directly with the backend via `updateProfile` and `changePassword`
 * from the global `AuthContext`.
 *
 * Includes client-side validation, accessibility attributes, and success/error
 * notification banners that auto-dismiss after a few seconds.
 *
 * @returns {JSX.Element} A form-based, accessible profile editing interface.
 *
 * @example
 * ```tsx
 * import ProfileEdit from './pages/profile/ProfileEdit';
 * 
 * function App() {
 *   return <ProfileEdit />;
 * }
 * ```
 */
export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });


  const passwordChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  
  useEffect(() => {
    if (user) {
      setName(user.firstName || '');
      setLastName(user.lastName || '');
      setAge(user.age ? user.age.toString() : '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  /**
   * Displays an on-screen notification that auto-hides after 4 seconds.
   *
   * @param {'success' | 'error'} type - Notification type.
   * @param {string} message - Message to display to the user.
   * @returns {void}
   */
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      type,
      message,
      show: true
    });
    
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  /**
   * Saves edited user profile data to the backend.
   * Performs client-side validation before submitting.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
   
    if (!name.trim()) {
      setError('El nombre es requerido');
      setIsSaving(false);
      return;
    }
    
    if (!lastName.trim()) {
      setError('Los apellidos son requeridos');
      setIsSaving(false);
      return;
    }
    
    if (!email.trim()) {
      setError('El correo es requerido');
      setIsSaving(false);
      return;
    }
    
    const ageNumber = parseInt(age) || 0;
    if (ageNumber < 13 || ageNumber > 120) {
      setError('La edad debe estar entre 13 y 120 años');
      setIsSaving(false);
      return;
    }

    try {
      const result = await updateProfile({
        firstName: name.trim(),
        lastName: lastName.trim(),
        age: ageNumber,
        email: email.trim()
      });

      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.message || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      setError(error?.message || 'Error de red al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  /**
   * Handles password change submission with multi-level validation.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    setPasswordError('');
    

    if (!currentPassword.trim()) {
      setPasswordError('La contraseña actual es requerida');
      setIsChangingPassword(false);
      return;
    }
    
    if (!newPassword.trim()) {
      setPasswordError('La nueva contraseña es requerida');
      setIsChangingPassword(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      setIsChangingPassword(false);
      return;
    }


    if (!passwordChecks.upper) {
      setPasswordError('La nueva contraseña debe contener al menos una mayúscula');
      setIsChangingPassword(false);
      return;
    }

    if (!passwordChecks.lower) {
      setPasswordError('La nueva contraseña debe contener al menos una minúscula');
      setIsChangingPassword(false);
      return;
    }

    if (!passwordChecks.number) {
      setPasswordError('La nueva contraseña debe contener al menos un número');
      setIsChangingPassword(false);
      return;
    }

    if (!passwordChecks.special) {
      setPasswordError('La nueva contraseña debe contener al menos un carácter especial');
      setIsChangingPassword(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setIsChangingPassword(false);
      return;
    }
    
    if (currentPassword === newPassword) {
      setPasswordError('La nueva contraseña debe ser diferente a la actual');
      setIsChangingPassword(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword, confirmPassword);
      
      if (result.success) {
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
        setPasswordError('');
        showNotification('success', 'Contraseña cambiada exitosamente');
      } else {
        setPasswordError(result.message || 'Error al cambiar la contraseña');
        showNotification('error', result.message || 'Error al cambiar la contraseña');
      }
    } catch (error: any) {
      setPasswordError(error?.message || 'Error de red al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  /** Toggles password field visibility between text and password types. */
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /** Resets password inputs and hides the change password section. */
  const cancelPasswordChange = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordSection(false);
  };

  
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-mosaic" aria-hidden="true">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} className="profile-mosaic__tile" />
          ))}
        </div>
        <div className="profile-card">
          <h1 className="profile-card__title">Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <main className="profile-page" role="main" aria-labelledby="profile-edit-title">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card" role="form" aria-labelledby="profile-edit-title">
        <h1 id="profile-edit-title" className="profile-card__title">Editar perfil</h1>
        
        {error && (
          <div className="form-field__error" role="alert" aria-live="assertive" style={{ marginBottom: 16, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8 }}>
            {error}
          </div>
        )}
        
        <div className="form-field">
          <label className="form-field__label" htmlFor="profile-name">Nombre</label>
          <div className="form-field__input-wrapper">
            <UserIcon size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input id="profile-name" className="form-field__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ejemplo: Ana María" aria-label="Nombre" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label" htmlFor="profile-lastname">Apellidos</label>
          <div className="form-field__input-wrapper">
            <UserIcon size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input id="profile-lastname" className="form-field__input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ejemplo: García López" aria-label="Apellidos" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label" htmlFor="profile-age">Edad</label>
          <div className="form-field__input-wrapper">
            <Calendar size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input id="profile-age" className="form-field__input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ejemplo: 28" aria-label="Edad" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label" htmlFor="profile-email">Correo</label>
          <div className="form-field__input-wrapper">
            <Mail size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input id="profile-email" className="form-field__input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ejemplo: nombre@correo.com" aria-label="Correo electrónico" />
          </div>
        </div>

     
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 id="change-password-title" style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Cambiar contraseña</h3>
            <button 
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showPasswordSection ? 'Cancelar' : 'Cambiar contraseña'}
            </button>
          </div>

          {showPasswordSection && (
            <div>
              {passwordError && (
                <div className="form-field__error" role="alert" aria-live="assertive" style={{ marginBottom: 16, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8 }}>
                  {passwordError}
                </div>
              )}

              <div className="form-field" style={{ marginTop: 12 }}>
                <label className="form-field__label" htmlFor="current-password">Contraseña actual</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    id="current-password"
                    type={showPasswords.current ? 'text' : 'password'}
                    className="form-field__input" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="••••••••" 
                    aria-label="Contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                    aria-label={showPasswords.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPasswords.current ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="form-field" style={{ marginTop: 12 }}>
                <label className="form-field__label" htmlFor="new-password">Nueva contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    id="new-password"
                    type={showPasswords.new ? 'text' : 'password'}
                    className="form-field__input" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••" 
                    aria-label="Nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                    aria-label={showPasswords.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPasswords.new ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              
              {newPassword && (
                <div className="password-checklist password-checklist--show" style={{ marginTop: '12px' }}>
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
              )}

              <div className="form-field" style={{ marginTop: 12 }}>
                <label className="form-field__label" htmlFor="confirm-password">Confirmar nueva contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    id="confirm-password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className="form-field__input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    aria-label="Confirmar nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                    aria-label={showPasswords.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                    opacity: isChangingPassword ? 0.7 : 1,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {isChangingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
                <button 
                  onClick={cancelPasswordChange}
                  disabled={isChangingPassword}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                    opacity: isChangingPassword ? 0.7 : 1,
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card__actions" style={{ gap: 8 }}>
          <button 
            onClick={handleSave} 
            className="profile-card__button"
            disabled={isSaving}
            style={{ 
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button 
            onClick={handleCancel} 
            className="profile-card__button" 
            style={{ background: 'rgba(255,255,255,0.1)' }}
            disabled={isSaving}
          >
            Cancelar
          </button>
        </div>
      </div>

     
      {notification.show && (
        <div className={`password-notification password-notification--${notification.type}`}>
          <div className="password-notification__content">
            <div className="password-notification__icon">
              {notification.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>
            <span className="password-notification__message">
              {notification.message}
            </span>
          </div>
          <button
            className="password-notification__close"
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            aria-label="Cerrar notificación"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}
    </main>
  );
}


