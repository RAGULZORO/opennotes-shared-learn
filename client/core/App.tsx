import React from "react";
import { Providers } from "./providers";
import AppRoutes from "./routes";

const App = () => (
  <Providers>
    <AppRoutes />
  </Providers>
);

export default App;
