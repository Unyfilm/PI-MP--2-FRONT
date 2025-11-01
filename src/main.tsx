import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import App from "./App";
import "./styles/main.scss";
import "./index.scss";

/**
 * @file main.tsx
 * @description
 * Entry point of the UnyFilm application.  
 * Initializes the React application, sets up routing, context providers, and global styles.
 *
 * The app is wrapped in:
 * - `BrowserRouter` for client-side routing.
 * - `AuthProvider` for authentication state management.
 * - `FavoritesProvider` for managing favorite movies.
 *
 * @example
 * ```tsx
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <BrowserRouter>
 *       <AuthProvider>
 *         <FavoritesProvider>
 *           <App />
 *         </FavoritesProvider>
 *       </AuthProvider>
 *     </BrowserRouter>
 *   </React.StrictMode>
 * );
 * ```
 *
 * @module Main
 * @author
 * Hernan Garcia  
 * Juan Camilo Jimenez  
 * Julieta Arteta  
 * Jerson Otero  
 * Julian Mosquera
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