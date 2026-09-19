import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Usar rutas relativas para compatibilidad con GitHub Pages
  base: "./",
  build: {
    // Generar en la carpeta "docs" para GitHub Pages
    outDir: "docs",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          state: ["zustand"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
