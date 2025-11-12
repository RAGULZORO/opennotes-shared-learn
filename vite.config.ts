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
      { find: "@/components/", replacement: path.resolve(__dirname, "./src/components/") },
      { find: "@/components", replacement: path.resolve(__dirname, "./src/components") },
      { find: "@/lib/", replacement: path.resolve(__dirname, "./src/shared/") },
      { find: "@/lib", replacement: path.resolve(__dirname, "./src/shared") },
  { find: "@/modules/", replacement: path.resolve(__dirname, "./src/features/") },
  { find: "@/modules", replacement: path.resolve(__dirname, "./src/features") },
  { find: "@/layout/", replacement: path.resolve(__dirname, "./src/layout/") },
  { find: "@/layout", replacement: path.resolve(__dirname, "./src/layout") },
  { find: "@/ui-kit/", replacement: path.resolve(__dirname, "./src/components/ui/") },
  { find: "@/ui-kit", replacement: path.resolve(__dirname, "./src/components/ui") },
      { find: "@/hooks/", replacement: path.resolve(__dirname, "./src/hooks/") },
      { find: "@/hooks", replacement: path.resolve(__dirname, "./src/hooks") },
      { find: "@/integrations/", replacement: path.resolve(__dirname, "./src/integrations/") },
      { find: "@/integrations", replacement: path.resolve(__dirname, "./src/integrations") },
      { find: "@/server/", replacement: path.resolve(__dirname, "./server/") },
      { find: "@/server", replacement: path.resolve(__dirname, "./server") },
      { find: "@/config/", replacement: path.resolve(__dirname, "./config/") },
      { find: "@/config", replacement: path.resolve(__dirname, "./config") },
      { find: "@/shared/", replacement: path.resolve(__dirname, "./src/shared/") },
      { find: "@/shared", replacement: path.resolve(__dirname, "./src/shared") },
  // Prefer `src/` for new development
  { find: "@/", replacement: path.resolve(__dirname, "./src/") },
  { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  root: ".",
  build: {
    outDir: "dist",
  },
});

