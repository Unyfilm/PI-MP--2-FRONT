import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from "./App";
// Importar estilos en orden correcto: main.scss incluye variables y mixins, luego estilos globales
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
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);