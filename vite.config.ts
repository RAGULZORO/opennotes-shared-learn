import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
      { find: "@/integrations/", replacement: path.resolve(__dirname, "./src/integrations/") },
      { find: "@/integrations", replacement: path.resolve(__dirname, "./src/integrations") },
      { find: "@/server/", replacement: path.resolve(__dirname, "./server/") },
      { find: "@/server", replacement: path.resolve(__dirname, "./server") },
      { find: "@/config/", replacement: path.resolve(__dirname, "./config/") },
      { find: "@/config", replacement: path.resolve(__dirname, "./config") },
      { find: "@/shared/", replacement: path.resolve(__dirname, "./src/shared/") },
      { find: "@/shared", replacement: path.resolve(__dirname, "./src/shared") },
      // Fallback: generic @/ maps to src/
      { find: "@/", replacement: path.resolve(__dirname, "./src/") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  root: ".",
  build: {
    outDir: "dist",
  },
}));
