import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 3030,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3031",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3030,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3031",
        changeOrigin: true,
      },
    },
  },
  publicDir: "public",
});
