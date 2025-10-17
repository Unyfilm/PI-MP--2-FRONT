import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';

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
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setName(user.firstName || '');
      setLastName(user.lastName || '');
      setAge(user.age ? user.age.toString() : '');
      setEmail(user.email || '');
    }
  }, [user]);

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
    </div>
  );
}


