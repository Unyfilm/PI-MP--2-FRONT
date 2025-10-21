import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';
import './Notification.scss';

/**
 * ProfileEdit
 *
 * Edit profile form with real backend integration. On save it updates
 * the user profile via API and navigates back to the Profile page.
 * On cancel it navigates back without saving changes.
 *
 * @returns {JSX.Element} Profile edit UI
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
  
  // Estados para cambio de contraseña
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
  
  // Estados para notificaciones
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });

  // Validaciones de contraseña (igual que en registro)
  const passwordChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setName(user.firstName || '');
      setLastName(user.lastName || '');
      setAge(user.age ? user.age.toString() : '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      type,
      message,
      show: true
    });
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    // Validaciones básicas
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

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    setPasswordError('');
    
    // Validaciones
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

    // Validaciones de seguridad de contraseña
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
        // Limpiar campos y cerrar sección
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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const cancelPasswordChange = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordSection(false);
  };

  // Si no hay usuario, mostrar loading
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
    <div className="profile-page">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card">
        <h1 className="profile-card__title">Editar perfil</h1>
        
        {error && (
          <div className="form-field__error" style={{ marginBottom: 16, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8 }}>
            {error}
          </div>
        )}
        
        <div className="form-field">
          <label className="form-field__label">Nombre</label>
          <div className="form-field__input-wrapper">
            <UserIcon size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input className="form-field__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ejemplo: Ana María" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label">Apellidos</label>
          <div className="form-field__input-wrapper">
            <UserIcon size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input className="form-field__input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ejemplo: García López" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label">Edad</label>
          <div className="form-field__input-wrapper">
            <Calendar size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input className="form-field__input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ejemplo: 28" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label className="form-field__label">Correo</label>
          <div className="form-field__input-wrapper">
            <Mail size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
            <input className="form-field__input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ejemplo: nombre@correo.com" />
          </div>
        </div>

        {/* Sección de cambio de contraseña */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Cambiar contraseña</h3>
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
                <div className="form-field__error" style={{ marginBottom: 16, padding: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8 }}>
                  {passwordError}
                </div>
              )}

              <div className="form-field" style={{ marginTop: 12 }}>
                <label className="form-field__label">Contraseña actual</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    type={showPasswords.current ? 'text' : 'password'}
                    className="form-field__input" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-field" style={{ marginTop: 12 }}>
                <label className="form-field__label">Nueva contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    type={showPasswords.new ? 'text' : 'password'}
                    className="form-field__input" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Checklist visual de requisitos de contraseña */}
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
                <label className="form-field__label">Confirmar nueva contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                  <input 
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className="form-field__input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
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

      {/* Componente de notificación */}
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
    </div>
  );
}


