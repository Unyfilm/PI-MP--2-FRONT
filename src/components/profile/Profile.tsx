/**
 * @file Profile.tsx
 * @description
 * User profile page for UnyFilm platform.
 * Displays personal information from the authenticated user, allows navigation,
 * profile editing, and secure account deletion through password confirmation.
 * Includes accessible modal dialog with form validation and feedback messages.
 *
 * @module Profile
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

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.scss';

/**
 * @component
 * @name Profile
 * @description
 * User profile summary page showing account data from `AuthContext`.
 * Provides options to:
 * - View profile details
 * - Edit personal information
 * - Return to the homepage
 * - Permanently delete account via password confirmation modal
 *
 * Implements WCAG accessibility standards and form validation with feedback.
 *
 * @returns {JSX.Element} A responsive, accessible user profile page.
 *
 * @example
 * ```tsx
 * import Profile from './pages/profile/Profile';
 * 
 * function App() {
 *   return <Profile />;
 * }
 * ```
 */
export default function Profile() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  /**
   * Closes the delete account modal and resets its internal state.
   * @function
   * @returns {void}
   */
  const handleCloseModal = () => {
    setShowDelete(false);
    setPassword('');
    setError('');
    setIsDeleting(false);
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
          <h1 className="profile-card__title">Cargando perfil...</h1>
        </div>
      </div>
    );
  }
  
  /**
   * Handles form submission for account deletion.
   * Verifies the entered password and calls `deleteAccount` from context.
   *
   * @async
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   * @returns {Promise<void>}
   */
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
        handleCloseModal();
        
        navigate('/login');
      } else {
        setError(result.message || 'Error al eliminar la cuenta. Verifica que la contraseña sea correcta.');
      }
    } catch (error: any) {
      setError(error?.message || 'Error de red al eliminar la cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="profile-page" role="main" aria-labelledby="profile-title">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card" aria-describedby="profile-summary">
        <h1 id="profile-title" className="profile-card__title">Mi perfil</h1>
        <p id="profile-summary" className="sr-only">Resumen de información de perfil</p>
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
          <Link to="/home" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label="Volver al inicio">Volver al inicio</Link>
          <Link to="/profile/edit" className="profile-card__button" aria-label="Editar perfil">Editar perfil</Link>
          <button className="profile-card__button profile-card__button--danger" onClick={() => setShowDelete(true)} aria-haspopup="dialog" aria-controls={showDelete ? 'delete-account-modal' : undefined} aria-label="Eliminar cuenta">Eliminar cuenta</button>
        </div>
      </div>

      {showDelete && (
        <div className={`profile-modal profile-modal--dropdown`} role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc" id="delete-account-modal">
          <div className="profile-modal__backdrop" onClick={handleCloseModal} />
          <div className="profile-modal__content">
            <h2 id="delete-title" className="profile-modal__title">Eliminar cuenta</h2>
            <p id="delete-desc" className="profile-modal__text">Ingresa tu contraseña para confirmar la eliminación. Esta acción no puede deshacerse.</p>
            <form onSubmit={handleConfirmDelete} className="profile-modal__form" aria-labelledby="delete-title" aria-describedby="delete-desc">
              <div className="form-field">
                <label className="form-field__label" htmlFor="delete-password">Contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={20} color="#ffffff" className="form-field__icon" />
                  <input 
                    id="delete-password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className={`form-field__input form-field__input--password ${error ? 'form-field__input--error' : ''}`}
                    disabled={isDeleting}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'delete-error' : undefined}
                  />
                </div>
                {error && <p id="delete-error" className="form-field__error" role="alert" aria-live="assertive">{error}</p>}
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
    </main>
  );
}