// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     // 👋 add the line below to add jsdom to vite
//     environment: "jsdom",
//     // hey! 👋 over here
//     globals: true,
//     setupFiles: "./src/tests/SetupTest.jsx",
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ViteSSG } from "vite-plugin-ssg";

export default defineConfig({
  plugins: [
    react(),
    ViteSSG({
      // Configure the entry point and any other options for SSG if needed
      onBeforeRender({ Page, props }) {
        // You can customize this to fetch data before rendering the page, etc.
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/SetupTest.jsx",
  },
  build: {
    target: "esnext", // Set to modern JS (or modify as needed)
    outDir: "dist", // Output directory for static files
    ssr: true, // Enable SSR if you're using SSR features
    rollupOptions: {
      input: "src/main.js", // Your entry file for the app
    },
  },
});
