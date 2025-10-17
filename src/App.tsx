import React from "react";
import { Providers } from "./bootstrap/providers";
import AppRoutes from "./bootstrap/routes";

const App = () => (
  <Providers>
    <AppRoutes />
  </Providers>
);

export default App;
