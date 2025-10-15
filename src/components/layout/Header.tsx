import React, { useState } from "react";
import "./Header.css";

/**
 * Props for the Header component.
 */
interface HeaderProps {
  /** Current search query */
  searchQuery?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** User profile information */
  user?: {
    name: string;
    avatar?: string;
  };
}

/**
 * Main header component with search bar and user profile.
 * 
 * @component
 * @param {HeaderProps} props - Component properties
 * @returns {JSX.Element} The header component
 */
const Header: React.FC<HeaderProps> = ({ 
  searchQuery = "", 
  onSearchChange,
  user = { name: "Usuario" }
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearchQuery);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Catálogo</h1>
        </div>
        
        <div className="header-center">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar película"
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
          </form>
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
