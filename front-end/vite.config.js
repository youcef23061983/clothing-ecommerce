// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: "jsdom",
//     globals: true,
//     setupFiles: "./src/tests/SetupTest.jsx",
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//   },
// });
import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
export default {
  plugins: [react(), ssr()],
  server: {
    port: 3001, // Set the Vite dev server to run on port 3001
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/SetupTest.jsx",
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  ssr: {
    noExternal: ["@vitejs/plugin-react"], // Ensure SSR handles React properly
  },
};
