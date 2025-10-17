import { useState } from 'react';
// Reuse the same styles and layout from Login
import '../login/Login.scss';
import '../recover/ResetPassword.scss';
import { Mail, Lock, User, Eye, EyeOff, Calendar, UserPlus, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../../images/logo2.png';
import collage from '../../images/collage.jpg';
import type { RegisterFormData, AuthProps, InputChangeEvent } from '../../types';
import apiService from '../../services/apiService';

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
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');
    const navigate = useNavigate();

    // Checklist visual para contraseña
    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const handleRegister = async (): Promise<void> => {
        const formData: RegisterFormData = {
            nombres,
            apellidos,
            edad,
            email,
            password
        };
        // Validations
        const newErrors: Record<string, string> = {};
        if (!nombres) newErrors.nombres = 'Los nombres son requeridos';
        if (!apellidos) newErrors.apellidos = 'Los apellidos son requeridos';
        if (!edad) newErrors.edad = 'La edad es requerida';
        if (edad && (Number(edad) < 13 || Number(edad) > 120)) newErrors.edad = 'Ingresa una edad válida (13-120)';
        if (!email) newErrors.email = 'El correo electrónico es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) newErrors.email = 'Correo electrónico inválido';
        if (!password) newErrors.password = 'La contraseña es requerida';
        if (password && password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
        if (password && !/[A-Z]/.test(password)) newErrors.password = 'Debe incluir al menos una mayúscula';
        if (password && !/[a-z]/.test(password)) newErrors.password = 'Debe incluir al menos una minúscula';
        if (password && !/[0-9]/.test(password)) newErrors.password = 'Debe incluir al menos un número';
        if (password && !/[^A-Za-z0-9]/.test(password)) newErrors.password = 'Debe incluir al menos un carácter especial';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
        if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        setErrors(newErrors);
        setTouched({ nombres: true, apellidos: true, edad: true, email: true, password: true, confirmPassword: true });
        if (Object.keys(newErrors).length) return;

        setApiError('');
        try {
            setIsLoading(true);
            const res = await apiService.register({
                nombres,
                apellidos,
                edad,
                email,
                password
            });
            if (res.success) {
                // Registro exitoso: redirigir a home o login
                navigate('/home');
                if (onRegister) onRegister(formData);
            } else {
                setApiError(res.message || 'Error al registrarse');
            }
        } catch (err: any) {
            setApiError(err?.message || 'Error de red');
        } finally {
            setIsLoading(false);
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
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    return (
        <div className="login-page">
            <div className="login-page__bg-gradient login-page__bg-gradient--1" />
            <div className="login-page__bg-gradient login-page__bg-gradient--2" />

            <div className="login-page__container">
                {/* Left: Register Form with same layout as Login */}
                <div className="login-form">
                    <div className="login-form__logo">
                        <img src={logo2} alt="UnyFilm" className="login-form__logo-img" />
                    </div>

                    <h1 className="login-form__title">Registro</h1>
                    <p className="login-form__subtitle">Completa tus datos para crear tu cuenta</p>

                    <div className="login-form__form">
                        <div className="form-field">
                            <label className="form-field__label">Nombres</label>
                            <div className="form-field__input-wrapper">
                                <User size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="text" name="nombres" value={nombres} onChange={handleInputChange} placeholder="Ejemplo: Ana María" className={`form-field__input ${touched.nombres && errors.nombres ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.nombres && errors.nombres && <p className="form-field__error">{errors.nombres}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Apellidos</label>
                            <div className="form-field__input-wrapper">
                                <User size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="text" name="apellidos" value={apellidos} onChange={handleInputChange} placeholder="Ejemplo: García López" className={`form-field__input ${touched.apellidos && errors.apellidos ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.apellidos && errors.apellidos && <p className="form-field__error">{errors.apellidos}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Edad</label>
                            <div className="form-field__input-wrapper">
                                <Calendar size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="number" name="edad" value={edad} onChange={handleInputChange} placeholder="Ejemplo: 28" className={`form-field__input ${touched.edad && errors.edad ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.edad && errors.edad && <p className="form-field__error">{errors.edad}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Correo electrónico</label>
                            <div className="form-field__input-wrapper">
                                <Mail size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="email" name="email" value={email} onChange={handleInputChange} placeholder="Ejemplo: nombre@correo.com" className={`form-field__input ${touched.email && errors.email ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.email && errors.email && <p className="form-field__error">{errors.email}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Contraseña</label>
                            <div className="form-field__input-wrapper">
                                <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handleInputChange} placeholder="••••••••" className={`form-field__input form-field__input--password ${touched.password && errors.password ? 'form-field__input--error' : ''}`} />
                                <button type="button" className="form-field__toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={22} strokeWidth={2.5} color="#ffffff" /> : <Eye size={22} strokeWidth={2.5} color="#ffffff" />}</button>
                            </div>
                            {touched.password && errors.password && <p className="form-field__error">{errors.password}</p>}
                        </div>
                        {/* Checklist visual de requisitos - bajo el campo de contraseña */}
                        <div className={`password-checklist ${password ? 'password-checklist--show' : ''}`}>
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

                        <div className="form-field">
                            <label className="form-field__label">Confirmar contraseña</label>
                            <div className="form-field__input-wrapper">
                                <Lock size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={`form-field__input form-field__input--password ${touched.confirmPassword && errors.confirmPassword ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.confirmPassword && errors.confirmPassword && <p className="form-field__error">{errors.confirmPassword}</p>}
                        </div>

                        {apiError && (
                            <div className="form-field__error" role="alert" style={{ marginBottom: '8px' }}>
                                {apiError}
                            </div>
                        )}

                        <button onClick={handleRegister} disabled={isLoading} className={`login-form__button ${isLoading ? 'login-form__button--loading' : ''}`}>
                            <UserPlus size={18} />
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>

                    </div>

                    <div className="login-form__register">
                        <span className="login-form__register-text">¿Ya tienes cuenta? </span>
                        <Link to="/login" className="login-form__link login-form__link--bold">Inicia sesión</Link>
                    </div>
                </div>

                {/* Right: Image hero with same adjustment */}
                <div className="login-hero">
                    <img src={collage} alt="Collage" className="login-hero__image" />
                    <div className="login-hero__overlay" />
                </div>
            </div>
        </div>
    );
}
