import AppRoutes from './routes/AppRoutes';
import UsabilityFeatures from './components/usability/UsabilityFeatures';
import AccessibilityFeatures from './components/accessibility/AccessibilityFeatures';

/**
 * Root component of the UnyFilm application.
 *
 * @component
 * @description
 * The `App` component serves as the main entry point for the application.
 * It renders the global routes and includes usability and accessibility
 * enhancement layers that improve the overall user experience.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom/client';
 * import App from './App';
 *
 * ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
 * ```
 *
 * @returns {JSX.Element} The main application structure including routes,
 * usability, and accessibility features.
 */
function App() {
  return (
    <>
      <AppRoutes />
      <UsabilityFeatures />
      <AccessibilityFeatures />
    </>
  );
}

export default App;
