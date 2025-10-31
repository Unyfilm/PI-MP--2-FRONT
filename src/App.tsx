import AppRoutes from './routes/AppRoutes';
import UsabilityFeatures from './components/usability/UsabilityFeatures';
import AccessibilityFeatures from './components/accessibility/AccessibilityFeatures';

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
