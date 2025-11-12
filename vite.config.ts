import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/components/", replacement: path.resolve(__dirname, "./client/components/") },
      { find: "@/components", replacement: path.resolve(__dirname, "./client/components") },
      { find: "@/lib/", replacement: path.resolve(__dirname, "./client/shared/") },
      { find: "@/lib", replacement: path.resolve(__dirname, "./client/shared") },
  { find: "@/modules/", replacement: path.resolve(__dirname, "./client/modules/") },
  { find: "@/modules", replacement: path.resolve(__dirname, "./client/modules") },
  { find: "@/layout/", replacement: path.resolve(__dirname, "./client/layout/") },
  { find: "@/layout", replacement: path.resolve(__dirname, "./client/layout") },
  { find: "@/ui-kit/", replacement: path.resolve(__dirname, "./client/ui-kit/") },
  { find: "@/ui-kit", replacement: path.resolve(__dirname, "./client/ui-kit") },
      { find: "@/hooks/", replacement: path.resolve(__dirname, "./client/shared/hooks/") },
      { find: "@/hooks", replacement: path.resolve(__dirname, "./client/shared/hooks") },
      { find: "@/integrations/", replacement: path.resolve(__dirname, "./server/") },
      { find: "@/integrations", replacement: path.resolve(__dirname, "./server") },
      { find: "@/server/", replacement: path.resolve(__dirname, "./server/") },
      { find: "@/server", replacement: path.resolve(__dirname, "./server") },
      { find: "@/config/", replacement: path.resolve(__dirname, "./config/") },
      { find: "@/config", replacement: path.resolve(__dirname, "./config") },
  // Prefer `src/` for new development; keep `client/` mapping for backward compatibility
  { find: "@/", replacement: path.resolve(__dirname, "./src/") },
  { find: "@", replacement: path.resolve(__dirname, "./src") },
  { find: "@/client/", replacement: path.resolve(__dirname, "./client/") },
  { find: "@/client", replacement: path.resolve(__dirname, "./client") },
    ],
  },
  root: ".",
  build: {
    outDir: "dist",
  },
});

