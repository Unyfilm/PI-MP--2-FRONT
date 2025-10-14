import React from "react";
import "../../styles/HomePage.css";
import { useNavigate } from "react-router";

/**
 * Home (landing) page of the application.
 *
 * @component
 * @returns {JSX.Element} The landing view with a CTA button to browse movies.
 * @example
 * // Renders a title, subtitle, and a button that navigates to "/peliculas"
 * <HomePage />
 */
const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Unyfilm</h1>
            <h2>Peliculas y mucho más</h2>
            <button onClick={() => navigate("peliculas")}>Ver peliculas</button>
        </div>
    );
};

export default HomePage;