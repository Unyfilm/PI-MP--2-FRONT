import { useState } from 'react';
import './Register.scss';
import type { RegisterFormData, AuthProps, InputChangeEvent } from '../../types';

// Interface específica para las props del componente Register
interface RegisterProps extends AuthProps {
    className?: string;
    id?: string;
}

export default function Register({ onRegister }: RegisterProps = {}) {
    const [nombres, setNombres] = useState<string>('');
    const [apellidos, setApellidos] = useState<string>('');
    const [edad, setEdad] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRegister = (): void => {
        const formData: RegisterFormData = {
            nombres,
            apellidos,
            edad,
            email,
            password
        };
        
        console.log('Register attempt:', formData);
        
        // Llamar a la función callback si existe
        if (onRegister) {
            onRegister(formData);
        }
    };

    // Handler genérico para cambios en inputs
    const handleInputChange = (e: InputChangeEvent): void => {
        const { name, value } = e.target;
        
        switch (name) {
            case 'nombres':
                setNombres(value);
                break;
            case 'apellidos':
                setApellidos(value);
                break;
            case 'edad':
                setEdad(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="register-container">
            {/* Overlay translúcido sobre el lado derecho */}
            <div className="overlay-register"></div>

            {/* Left Panel - Register Form */}
            <div className="left-panel-register">
                <div className="content-wrapper-register">
                    {/* Logo */}
                    <div className="logo-container-register">
                        <img 
                            src="/src/images/logo 3.png" 
                            alt="UnyFilm Logo"
                            className="logo-image-register"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="title-register">Registro</h2>

                    {/* Form Container */}
                    <div className="form-container-register">
                        {/* Nombres Field */}
                        <div className="input-field-register">
                            <label className="label-register">Nombres</label>
                            <div className="input-wrapper-register">
                                <svg className="input-icon-register" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                                </svg>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={nombres}
                                    onChange={handleInputChange}
                                    placeholder="Pepito"
                                    className="input-register nombres-input"
                                />
                            </div>
                        </div>

                        {/* Apellidos Field */}
                        <div className="input-field-register">
                            <label className="label-register">Apellidos</label>
                            <div className="input-wrapper-register">
                                <svg className="input-icon-register" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                                </svg>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={apellidos}
                                    onChange={handleInputChange}
                                    placeholder="Perez"
                                    className="input-register apellidos-input"
                                />
                            </div>
                        </div>

                        {/* Edad Field */}
                        <div className="input-field-register">
                            <label className="label-register">Edad</label>
                            <div className="input-wrapper-register">
                                <svg className="input-icon-register" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <input
                                    type="number"
                                    name="edad"
                                    value={edad}
                                    onChange={handleInputChange}
                                    placeholder="28"
                                    className="input-register edad-input"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="input-field-register">
                            <label className="label-register">Correo electrónico</label>
                            <div className="input-wrapper-register">
                                <svg className="input-icon-register" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4"/>
                                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
                                </svg>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    placeholder="example@correo.com"
                                    className="input-register email-input-register"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="input-field-register">
                            <label className="label-register">Contraseña</label>
                            <div className="input-wrapper-register">
                                <svg className="input-icon-register" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/>
                                    <path d="m21 2-9.6 9.6"/>
                                    <circle cx="7.5" cy="15.5" r="5.5"/>
                                </svg>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="input-register password-input-register"
                                />
                            </div>
                        </div>

                        {/* Register Button */}
                        <button onClick={handleRegister} className="btn-register-submit">
                            Registrarse
                        </button>

                        {/* Divider */}
                        <div className="divider-register"></div>

                        {/* Login Link */}
                        <div className="login-section">
                            <p className="login-text">
                                ¿Ya tienes cuenta? <a href="#" className="link-register">Iniciar Sesión</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Background image */}
            <div className="right-panel-register">
                {/* Imagen del astronauta */}
                <div className="astronaut-image-register">
                    <img 
                        src="/src/images/astronaut.jpg" 
                        alt="Astronauta observando la Tierra desde el espacio"
                        className="astronaut-img-register"
                    />
                </div>
            </div>
        </div>
    );
}
