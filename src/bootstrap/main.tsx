import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";
// Use the original client stylesheet to retain full theme variables and dark-mode rules
import "../../client/core/index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
