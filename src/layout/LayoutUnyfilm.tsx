import React, { useState } from "react";
import { useLocation } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/footer/Footer";
import "../styles/LayoutUnyfilm.css";

/**
 * Props accepted by {@link LayoutUnyfilm}.
 */
interface LayoutUnyfilmProps {
    /**
     * The page content to render between the shared Navbar and Footer.
     */
    children: React.ReactNode;
}

/**
 * Shared application layout that renders a sidebar navigation, 
 * the current page content in a `<main>` region, and a footer at the bottom.
 *
 * @component
 * @param {LayoutUnyfilmProps} props - Component properties.
 * @param {React.ReactNode} props.children - Page content to render.
 * @returns {JSX.Element} The layout wrapper for app pages.
 */
const LayoutUnyfilm: React.FC<LayoutUnyfilmProps> = ({ children }) => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // Don't show sidebar on certain pages
    const hideSidebar = location.pathname === '/' || location.pathname === '/sobre-nosotros' || location.pathname === '/mapa-sitio';
    
    return (
        <div className="app-layout">
            {!hideSidebar && (
                <Sidebar 
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}
            <main className={`main-content ${hideSidebar ? 'full-width' : ''}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LayoutUnyfilm;