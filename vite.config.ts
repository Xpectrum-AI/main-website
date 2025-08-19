import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Set NODE_ENV for the build process
  process.env.NODE_ENV = mode;
  
  return {
  server: {
    host: "::",
    port: 8084,
    watch: {
      ignored: ["**/.git/**"], 
    },
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:8000',
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
