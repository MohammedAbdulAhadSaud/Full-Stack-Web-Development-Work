import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev: frontend on :5173 forwards /api calls to the Express server on :5000
// base "./" lets the built site work from a GitHub Pages sub-path
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:5000" } },
});
