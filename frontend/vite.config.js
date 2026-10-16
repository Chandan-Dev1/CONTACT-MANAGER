import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Backend ka port yahan change karein (default 3000).
// Frontend "/api/..." call karega aur Vite use backend tak proxy kar dega (CORS ki zaroorat nahi).
const BACKEND_URL = "http://localhost:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
