import React, { useState } from 'react';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login attempt:', { email, password });
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@correo.com"
                                className="input email-input"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="input-field">
                            <label className="label">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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