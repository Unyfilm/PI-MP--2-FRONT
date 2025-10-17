import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';

/**
 * Profile
 *
 * User profile summary page with basic information and actions
 * (edit profile, navigate home, and delete account modal).
 * Uses real user data from AuthContext.
 *
 * @returns {JSX.Element} Profile page UI
 */
export default function Profile() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCloseModal = () => {
    setShowDelete(false);
    setPassword('');
    setError('');
    setIsDeleting(false);
  };

  // Mostrar loading si no hay usuario cargado
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-mosaic" aria-hidden="true">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} className="profile-mosaic__tile" />
          ))}
        </div>
        <div className="profile-card">
          <h1 className="profile-card__title">Cargando perfil...</h1>
        </div>
      </div>
    );
  }

  const handleConfirmDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!password) {
      setError('La contraseña es requerida');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const result = await deleteAccount(password);
      
      if (result.success) {
        // Cerrar el modal antes de redirigir
        handleCloseModal();
        
        // Redirigir al login después de eliminar la cuenta
        navigate('/login');
      } else {
        // El backend devolvió un error (ej. contraseña incorrecta)
        setError(result.message || 'Error al eliminar la cuenta. Verifica que la contraseña sea correcta.');
      }
    } catch (error: any) {
      setError(error?.message || 'Error de red al eliminar la cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card">
        <h1 className="profile-card__title">Mi perfil</h1>
        <div className="profile-card__row">
          <span className="profile-card__label">Nombre</span>
          <span className="profile-card__value">{user.firstName || 'No especificado'}</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Apellidos</span>
          <span className="profile-card__value">{user.lastName || 'No especificado'}</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Edad</span>
          <span className="profile-card__value">{user.age ? user.age.toString() : 'No especificado'}</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Correo</span>
          <span className="profile-card__value">{user.email}</span>
        </div>

        <div className="profile-card__actions">
          <Link to="/home" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }}>Volver al inicio</Link>
          <Link to="/profile/edit" className="profile-card__button">Editar perfil</Link>
          <button className="profile-card__button profile-card__button--danger" onClick={() => setShowDelete(true)}>Eliminar cuenta</button>
        </div>
      </div>

      {showDelete && (
        <div className={`profile-modal profile-modal--dropdown`} role="dialog" aria-modal="true">
          <div className="profile-modal__backdrop" onClick={handleCloseModal} />
          <div className="profile-modal__content">
            <h2 className="profile-modal__title">Eliminar cuenta</h2>
            <p className="profile-modal__text">Ingresa tu contraseña para confirmar la eliminación. Esta acción no puede deshacerse.</p>
            <form onSubmit={handleConfirmDelete} className="profile-modal__form">
              <div className="form-field">
                <label className="form-field__label">Contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={20} color="#ffffff" className="form-field__icon" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className={`form-field__input form-field__input--password ${error ? 'form-field__input--error' : ''}`}
                    disabled={isDeleting}
                  />
                </div>
                {error && <p className="form-field__error">{error}</p>}
              </div>
              <div className="profile-modal__actions">
                <button 
                  type="button" 
                  className="profile-card__button" 
                  style={{ background: 'rgba(255,255,255,0.1)' }} 
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="profile-card__button profile-card__button--danger"
                  disabled={isDeleting}
                  style={{ 
                    opacity: isDeleting ? 0.7 : 1,
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar definitivamente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


