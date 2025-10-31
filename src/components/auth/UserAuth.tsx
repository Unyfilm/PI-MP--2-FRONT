import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, Trash2, LogOut, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';
import './UserAuth.css';

// User interface
interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  avatar: string;
}

/**
 * UserAuth
 *
 * React component that handles user authentication with mock functionality.
 * Provides login, registration, profile management, password recovery,
 * logout, and account deletion features. Uses form validation, modal control,
 * and localStorage for temporary session persistence.
 *
 * Overall structure:
 * - Main buttons (Login / Sign Up)
 * - Modals for Login, Register, Profile, and Password Recovery
 * - State management with useState and useClickOutside hooks
 * - Integration with the authentication context (useAuth)
 * - Navigation after logout using useNavigate
 *
 * Accessibility:
 * - Descriptive placeholders for form fields
 * - Buttons with lucide-react icons
 * - Click-outside modal closing support
 *
 * @file UserAuth.tsx
 * @component
 * @function UserAuth
 * @author Hernan Garcia, Juan Camilo Jimenez, Julieta Arteta, Jerson Otero, Julian Mosquera
 * @version 2.0.0
 * @since 2025-10
 *
 * @returns {JSX.Element} The complete user authentication interface including login, registration, profile, and password recovery.
 */

export default function UserAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: ''
  });
  const [recoveryForm, setRecoveryForm] = useState({ email: '' });

  /**
   * Handle user login
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would call API
    const mockUser = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      age: 25,
      email: loginForm.email,
      avatar: '/images/default-avatar.png'
    };
    
    setUser(mockUser);
    setIsLoggedIn(true);
    setShowLogin(false);
    setLoginForm({ email: '', password: '' });
    
    // Save to localStorage
    localStorage.setItem('unyfilm-user', JSON.stringify(mockUser));
    localStorage.setItem('unyfilm-logged-in', 'true');
  };

  /**
   * Handle user registration
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Mock registration
    const newUser = {
      id: Date.now(),
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      age: parseInt(registerForm.age),
      email: registerForm.email,
      avatar: '/images/default-avatar.png'
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
    setShowRegister(false);
    setRegisterForm({
      firstName: '',
      lastName: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    // Save to localStorage
    localStorage.setItem('unyfilm-user', JSON.stringify(newUser));
    localStorage.setItem('unyfilm-logged-in', 'true');
  };

  /**
   * Handle profile update
   */
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserData = { 
      ...user!, 
      ...profileForm,
      age: parseInt(profileForm.age) || user?.age || 0
    };
    setUser(updatedUser);
    setShowProfile(false);
    
    // Save to localStorage
    localStorage.setItem('unyfilm-user', JSON.stringify(updatedUser));
  };

  /**
   * Handle password recovery
   */
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password recovery
    alert(`Se ha enviado un enlace de recuperación a ${recoveryForm.email}`);
    setShowPasswordRecovery(false);
    setRecoveryForm({ email: '' });
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Hooks para cerrar modales al hacer clic fuera
  const loginModalRef = useClickOutside(() => setShowLogin(false));
  const registerModalRef = useClickOutside(() => setShowRegister(false));
  const profileModalRef = useClickOutside(() => setShowProfile(false));
  const recoveryModalRef = useClickOutside(() => setShowPasswordRecovery(false));

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      handleLogout();
      alert('Tu cuenta ha sido eliminada');
    }
  };

  return (
    <div className="user-auth">
      {!isLoggedIn ? (
        <div className="user-auth__buttons">
          <button 
            className="user-auth__btn user-auth__btn--login"
            onClick={() => setShowLogin(true)}
          >
            <User size={16} />
            Iniciar Sesión
          </button>
          <button 
            className="user-auth__btn user-auth__btn--register"
            onClick={() => setShowRegister(true)}
          >
            <Mail size={16} />
            Registrarse
          </button>
        </div>
      ) : (
        <div className="user-auth__profile">
          <button 
            className="user-auth__profile-btn"
            onClick={() => setShowProfile(true)}
          >
            <img 
              src={user?.avatar || '/images/default-avatar.png'} 
              alt={user?.firstName}
              className="user-auth__avatar"
            />
            <span>{user?.firstName}</span>
          </button>
        </div>
      )}

      
      {showLogin && (
        <div className="user-auth__modal" ref={loginModalRef}>
          <div className="user-auth__modal-content">
            <div className="user-auth__modal-header">
              <h2>Iniciar Sesión</h2>
              <button 
                onClick={() => setShowLogin(false)}
                className="user-auth__close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="user-auth__form">
              <div className="user-auth__field">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={loginForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <Lock size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={loginForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="user-auth__toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <button type="submit" className="user-auth__submit">
                Iniciar Sesión
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  setShowLogin(false);
                  setShowPasswordRecovery(true);
                }}
                className="user-auth__link"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </div>
        </div>
      )}

      
      {showRegister && (
        <div className="user-auth__modal" ref={registerModalRef}>
          <div className="user-auth__modal-content">
            <div className="user-auth__modal-header">
              <h2>Registrarse</h2>
              <button 
                onClick={() => setShowRegister(false)}
                className="user-auth__close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="user-auth__form">
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Nombres"
                  value={registerForm.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, firstName: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={registerForm.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, lastName: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="number"
                  placeholder="Edad"
                  value={registerForm.age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, age: e.target.value})}
                  required
                  min="13"
                  max="120"
                />
              </div>
              
              <div className="user-auth__field">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={registerForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={registerForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="user-auth__field">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={registerForm.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              
              <button type="submit" className="user-auth__submit">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      )}

      
      {showProfile && (
        <div className="user-auth__modal" ref={profileModalRef}>
          <div className="user-auth__modal-content">
            <div className="user-auth__modal-header">
              <h2>Mi Perfil</h2>
              <button 
                onClick={() => setShowProfile(false)}
                className="user-auth__close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="user-auth__form">
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Nombres"
                  value={profileForm.firstName || user?.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, firstName: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={profileForm.lastName || user?.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, lastName: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <User size={20} />
                <input
                  type="number"
                  placeholder="Edad"
                  value={profileForm.age || user?.age?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, age: e.target.value})}
                  required
                  min="13"
                  max="120"
                />
              </div>
              
              <div className="user-auth__field">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={profileForm.email || user?.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="user-auth__field">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Nueva contraseña (opcional)"
                  value={profileForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, password: e.target.value})}
                />
              </div>
              
              <div className="user-auth__actions">
                <button type="submit" className="user-auth__submit">
                  <Save size={16} />
                  Guardar Cambios
                </button>
                
                <button 
                  type="button"
                  onClick={handleDeleteAccount}
                  className="user-auth__delete"
                >
                  <Trash2 size={16} />
                  Eliminar Cuenta
                </button>
                
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="user-auth__logout"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showPasswordRecovery && (
        <div className="user-auth__modal" ref={recoveryModalRef}>
          <div className="user-auth__modal-content">
            <div className="user-auth__modal-header">
              <h2>Recuperar Contraseña</h2>
              <button 
                onClick={() => setShowPasswordRecovery(false)}
                className="user-auth__close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordRecovery} className="user-auth__form">
              <div className="user-auth__field">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={recoveryForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecoveryForm({...recoveryForm, email: e.target.value})}
                  required
                />
              </div>
              
              <button type="submit" className="user-auth__submit">
                <Key size={16} />
                Enviar Enlace de Recuperación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
