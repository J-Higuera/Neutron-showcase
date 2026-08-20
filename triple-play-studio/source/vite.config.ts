import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" — the site deploys under a subpath (GitHub Pages entry, dashboard /preview/)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
