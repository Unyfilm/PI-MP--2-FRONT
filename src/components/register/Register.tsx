/**
 * @file Register.tsx
 * @description Allows users to create an account by entering their personal information,
 * validating fields in real time, and displaying password requirements.
 * Includes format, length, and password match validations, as well as visual feedback and integration with the authentication context.
 * @component
 * @author
 * Hernan Garcia
 * Juan Camilo Jimenez
 * Julieta Arteta
 * Jerson Otero
 * Julian Mosquera
 */
import { useState } from 'react';
import '../login/Login.scss';
import '../recover/ResetPassword.scss';
import { Mail, Lock, User, Eye, EyeOff, Calendar, UserPlus, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo2 from '../../images/logo2.png';
import collage from '../../images/collage.jpg';
import type { RegisterFormData, AuthProps, InputChangeEvent } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterProps extends AuthProps {
    className?: string;
    id?: string;
}

export default function Register({ onRegister }: RegisterProps = {}) {
    // Preferred English state (UI texts remain in Spanish)
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const handleRegister = async (): Promise<void> => {
        const formData: RegisterFormData = {
            firstName,
            lastName,
            age,
            // legacy fields for compatibility (will be ignored by service if English is present)
            nombres: firstName,
            apellidos: lastName,
            edad: age,
            email,
            password
        };
        
        const newErrors: Record<string, string> = {};
        if (!firstName) newErrors.firstName = 'Los nombres son requeridos';
        if (!lastName) newErrors.lastName = 'Los apellidos son requeridos';
        if (!age) newErrors.age = 'La edad es requerida';
        if (age && (Number(age) < 13 || Number(age) > 120)) newErrors.age = 'Ingresa una edad válida (13-120)';
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
        setTouched({ firstName: true, lastName: true, age: true, email: true, password: true, confirmPassword: true });
        if (Object.keys(newErrors).length) return;

        setApiError('');
        try {
            setIsLoading(true);
            const result = await register({
                firstName,
                lastName,
                age,
                // legacy copies
                nombres: firstName,
                apellidos: lastName,
                edad: age,
                email,
                password
            });
            if (result.success) {
                navigate('/home');
                if (onRegister) onRegister(formData);
            } else {
                setApiError(result.message || 'Error al registrarse');
            }
        } catch (err: any) {
            setApiError(err?.message || 'Error de red');
        } finally {
            setIsLoading(false);
        }
    };

    
    const handleInputChange = (e: InputChangeEvent): void => {
        const { name, value } = e.target;
        
        switch (name) {
            case 'nombres':
            case 'firstName':
                setFirstName(value);
                break;
            case 'apellidos':
            case 'lastName':
                setLastName(value);
                break;
            case 'edad':
            case 'age':
                setAge(value);
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
                                <input type="text" name="firstName" value={firstName} onChange={handleInputChange} placeholder="Ejemplo: Ana María" className={`form-field__input ${touched.firstName && errors.firstName ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.firstName && errors.firstName && <p className="form-field__error">{errors.firstName}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Apellidos</label>
                            <div className="form-field__input-wrapper">
                                <User size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="text" name="lastName" value={lastName} onChange={handleInputChange} placeholder="Ejemplo: García López" className={`form-field__input ${touched.lastName && errors.lastName ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.lastName && errors.lastName && <p className="form-field__error">{errors.lastName}</p>}
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Edad</label>
                            <div className="form-field__input-wrapper">
                                <Calendar size={22} strokeWidth={2.5} color="#ffffff" className="form-field__icon" />
                                <input type="number" name="age" value={age} onChange={handleInputChange} placeholder="Ejemplo: 28" className={`form-field__input ${touched.age && errors.age ? 'form-field__input--error' : ''}`} />
                            </div>
                            {touched.age && errors.age && <p className="form-field__error">{errors.age}</p>}
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

                
                <div className="login-hero">
                    <img src={collage} alt="Collage" className="login-hero__image" />
                    <div className="login-hero__overlay" />
                </div>
            </div>
        </div>
    );
}
