import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: "jsdom",
    // hey! 👋 over here
    globals: true,
    setupFiles: "./src/tests/SetupTest.jsx",
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase from 500 KB to 1MB
  },
});
