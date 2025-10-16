import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  server: {
    port: 3001,
    host: true,
  },
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@entities": "/src/entities",
      "@features": "/src/features",
      "@shared": "/src/shared",
      "@widgets": "/src/widgets",
      "@pages": "/src/pages",
      "@providers": "/src/providers",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
