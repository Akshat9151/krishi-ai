import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://krishi-ai-j359.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "https://krishi-ai-j359.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
