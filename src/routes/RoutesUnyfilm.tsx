import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import SiteMap from "../pages/site-map/SiteMap";
import MoviePage from "../pages/movie/MoviePage";
import LayoutUnyfilm from "../layout/LayoutUnyfilm";

/**
 * Top-level route configuration for the Unyfilm app.
 *
 * @component
 * @returns {JSX.Element} Router with all application routes inside a shared layout.
 * @remarks
 * - Uses `BrowserRouter` for clean URLs (history API).
 * - Wraps pages with `LayoutUnyfilm` to provide global UI (Navbar/Footer).
 */
const RoutesUnyfilm = () => {
    return (
        <BrowserRouter>
            <LayoutUnyfilm>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/peliculas" element={<MoviePage />} />
                    <Route path="/sobre-nosotros" element={<AboutPage />} />
                    <Route path="/mapa-sitio" element={<SiteMap />} />
                </Routes>
            </LayoutUnyfilm>
        </BrowserRouter>
    );
};

export default RoutesUnyfilm;
