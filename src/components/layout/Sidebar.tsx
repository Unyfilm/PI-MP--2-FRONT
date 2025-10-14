import React from "react";
import { Link, useLocation } from "react-router";
import "./Sidebar.css";

/**
 * Props for the Sidebar component.
 */
interface SidebarProps {
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Callback when sidebar toggle is clicked */
  onToggle?: () => void;
}

/**
 * Navigation sidebar component with logo and menu items.
 * 
 * @component
 * @param {SidebarProps} props - Component properties
 * @returns {JSX.Element} The sidebar navigation
 */
const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: "🏠", label: "Inicio", id: "home" },
    { path: "/peliculas", icon: "🎬", label: "Películas", id: "movies" },
    { path: "/favoritos", icon: "❤️", label: "Favoritos", id: "favorites" },
    { path: "/usuarios", icon: "👥", label: "Usuarios", id: "users" },
    { path: "/configuracion", icon: "⚙️", label: "Configuración", id: "settings" },
    { path: "/logout", icon: "🚪", label: "Cerrar sesión", id: "logout" }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">▶️</div>
          <div className="logo-text">
            <h1>UnyFilm</h1>
            <p>Películas que nos unen</p>
          </div>
        </div>
        {onToggle && (
          <button className="sidebar-toggle" onClick={onToggle}>
            ☰
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
