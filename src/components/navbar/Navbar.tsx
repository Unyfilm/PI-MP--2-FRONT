import React from "react";
import { Link } from "react-router";
import "./Navbar.css";

/**
 * Sidebar navigation component with logo and vertical menu.
 *
 * @component
 * @returns {JSX.Element} A semantic sidebar navigation element with app links.
 * @accessibility
 * Uses semantic <nav> and <a> (via Link) for keyboard and screen reader navigation.
 */
const Navbar: React.FC = () => {
    return (
        <nav className="sidebar-nav">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src="/images/logo.png" alt="UnyFilm Logo" className="logo-image" />
                    <div className="logo-text">
                        <h1>UnyFilm</h1>
                        <p>Películas que nos unen</p>
                    </div>
                </div>
            </div>
            
            <div className="sidebar-menu">
                <Link to="/" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Inicio</span>
                </Link>
                <Link to="/peliculas" className="nav-link">
                    <span className="nav-icon">🎬</span>
                    <span className="nav-text">Películas</span>
                </Link>
                <Link to="/catalogo" className="nav-link">
                    <span className="nav-icon">📋</span>
                    <span className="nav-text">Catálogo</span>
                </Link>
                <Link to="/sobre-nosotros" className="nav-link">
                    <span className="nav-icon">ℹ️</span>
                    <span className="nav-text">Sobre nosotros</span>
                </Link>
            </div>
            
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">J</div>
                    <div className="user-info">
                        <span className="user-name">Usuario</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;