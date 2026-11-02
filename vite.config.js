import { defineConfig } from "vite";
export default defineConfig({
  // Relative asset URLs work at localhost, user domains, and GitHub Pages /repository/ paths.
  base: "./",
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
});
