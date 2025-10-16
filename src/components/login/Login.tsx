import { useState } from 'react';
import './Login.scss';
import type { LoginFormData, AuthProps, InputChangeEvent } from '../../types';

// Interface específica para las props del componente Login
interface LoginProps extends AuthProps {
    className?: string;
    id?: string;
}

export default function Login({ onLogin }: LoginProps = {}) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = (): void => {
        const formData: LoginFormData = {
            email,
            password
        };
        
        console.log('Login attempt:', formData);
        
        // Llamar a la función callback si existe
        if (onLogin) {
            onLogin(formData);
        }
    };

    const handleInputChange = (e: InputChangeEvent): void => {
        const { name, value } = e.target;
        
        switch (name) {
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
        <div className="login-container">
            {/* Overlay blanco translúcido solo en la parte derecha */}
            <div className="overlay"></div>

            {/* Left Panel - Login Form */}
            <div className="left-panel">
                <div className="content-wrapper">
                    {/* Logo */}
                    <div className="logo-container">
                        <img 
                            src="/src/images/logo 3.png" 
                            alt="UnyFilm Logo"
                            className="logo-image"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="title">Inicio de sesión</h2>

                    {/* Form Container */}
                    <div className="form-container">
                        {/* Email Field */}
                        <div className="input-field">
                            <label className="label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleInputChange}
                                placeholder="example@correo.com"
                                className="input email-input"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="input-field">
                            <label className="label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="input password-input"
                            />
                        </div>

                        {/* Login Button */}
                        <button onClick={handleLogin} className="btn btn-login">
                            Iniciar Sesión
                        </button>

                        {/* Forgot Password */}
                        <div className="forgot-password">
                            <a href="#" className="link">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="divider"></div>

                        {/* Register Section */}
                        <div className="register-section">
                            <p className="register-text">¿No tienes cuenta?</p>
                            <button className="btn btn-register">
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Background image */}
            <div className="right-panel">
                {/* Imagen del astronauta */}
                <div className="astronaut-image">
                    <img 
                        src="/src/images/astronaut.jpg" 
                        alt="Astronauta observando la Tierra desde el espacio"
                        className="astronaut-img"
                    />
                </div>
            </div>
        </div>
    );
}
