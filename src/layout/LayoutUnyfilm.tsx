import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./LayoutUnyfilm.css";

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
 * Shared application layout with sidebar navigation and main content area.
 * Features a fixed left sidebar and scrollable main content.
 *
 * @component
 * @param {LayoutUnyfilmProps} props - Component properties.
 * @param {React.ReactNode} props.children - Page content to render.
 * @returns {JSX.Element} The layout wrapper for app pages.
 */
const LayoutUnyfilm: React.FC<LayoutUnyfilmProps> = ({ children }) => {
    return (
        <div className="layout-container">
            <aside className="layout-sidebar">
                <Navbar />
            </aside>
            <main className="layout-main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LayoutUnyfilm;