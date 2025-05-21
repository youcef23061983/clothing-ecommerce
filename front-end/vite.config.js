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

//  this is for letting req.cookies.token work on react vite

// /import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // Proxy configuration
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//         cookieDomainRewrite: {
//           '.*': 'localhost'
//         },
//         headers: {
//           Connection: 'keep-alive'
//         }
//       }
//     },
//     // HMR configuration (add this right under proxy)
//     hmr: {
//       clientPort: 5173 // Forces WebSocket to use same port
//     }
//   },
//   test: {
//     environment: "jsdom",
//     globals: true,
//     setupFiles: "./src/tests/SetupTest.jsx",
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//   }
// });
