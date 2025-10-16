import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar } from 'lucide-react';
import './Profile.scss';

export default function ProfileEdit(): JSX.Element {
  const [name, setName] = useState('Usuario UnyFilm');
  const [lastName, setLastName] = useState('Apellido de Ejemplo');
  const [age, setAge] = useState('28');
  const [email, setEmail] = useState('usuario@unyfilm.com');

  return (
    <div className="profile-page">
      <div className="profile-mosaic" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="profile-mosaic__tile" />
        ))}
      </div>
      <div className="profile-card">
        <h1 className="profile-card__title">Editar perfil</h1>
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
          <Link to="/profile" className="profile-card__button">Guardar</Link>
          <Link to="/profile" className="profile-card__button" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancelar</Link>
        </div>
      </div>
    </div>
  );
}


