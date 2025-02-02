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
import ViteStaticSiteGenerator from "vite-plugin-static-site-generator";

export default defineConfig({
  plugins: [react(), ViteStaticSiteGenerator()],
  build: {
    outDir: "dist", // Output directory for your static site
  },
});
