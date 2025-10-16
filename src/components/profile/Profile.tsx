import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Profile.scss';

export default function Profile(): JSX.Element {
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      setError('La contraseña es requerida');
      return;
    }
    // Aquí iría la llamada a API para eliminar la cuenta
    alert('Cuenta eliminada (demo).');
    setShowDelete(false);
    setPassword('');
    setError('');
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
          <span className="profile-card__value">Usuario UnyFilm</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Apellidos</span>
          <span className="profile-card__value">Apellido de Ejemplo</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Edad</span>
          <span className="profile-card__value">28</span>
        </div>
        <div className="profile-card__row">
          <span className="profile-card__label">Correo</span>
          <span className="profile-card__value">usuario@unyfilm.com</span>
        </div>

        <div className="profile-card__actions">
          <Link to="/home" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }}>Volver a inicio</Link>
          <Link to="/profile/edit" className="profile-card__button">Editar perfil</Link>
          <button className="profile-card__button profile-card__button--danger" onClick={() => setShowDelete(true)}>Eliminar cuenta</button>
        </div>
      </div>

      {showDelete && (
        <div className={`profile-modal profile-modal--dropdown`} role="dialog" aria-modal="true">
          <div className="profile-modal__backdrop" onClick={() => setShowDelete(false)} />
          <div className="profile-modal__content">
            <h2 className="profile-modal__title">Eliminar cuenta</h2>
            <p className="profile-modal__text">Ingresa tu contraseña para confirmar la eliminación. Esta acción no puede deshacerse.</p>
            <form onSubmit={handleConfirmDelete} className="profile-modal__form">
              <div className="form-field">
                <label className="form-field__label">Contraseña</label>
                <div className="form-field__input-wrapper">
                  <Lock size={20} color="#ffffff" className="form-field__icon" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`form-field__input form-field__input--password ${error ? 'form-field__input--error' : ''}`} />
                </div>
                {error && <p className="form-field__error">{error}</p>}
              </div>
              <div className="profile-modal__actions">
                <button type="button" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowDelete(false)}>Cancelar</button>
                <button type="submit" className="profile-card__button profile-card__button--danger">Eliminar definitivamente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


