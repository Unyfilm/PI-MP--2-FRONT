import React from "react";
import ReactDOM from "react-dom/client";
import RoutesUnyfilm from "./routes/RoutesUnyfilm.tsx";
import "./index.scss";

/**
 * Ensures the root element exists before rendering the app.
 * Using non-null assertion since this is guaranteed by the HTML template.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RoutesUnyfilm />
  </React.StrictMode>
);