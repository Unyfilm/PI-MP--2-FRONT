import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import App from "./App";
import "./styles/main.scss";
import "./index.scss";

/**
 * Ensures the root element exists before rendering the app.
 * Using non-null assertion since this is guaranteed by the HTML template.
 * Wrapping with AuthProvider for global authentication state management.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);