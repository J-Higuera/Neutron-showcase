import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" — the site deploys under a subpath (GitHub Pages entry, dashboard
// /preview/). Two pinned chunks via rolldown's native codeSplitting groups:
// "react" ships with the shell; "gl" (three + R3F) is reached ONLY through
// dynamic imports, so the museum shell parses and paints before any GL code
// arrives. react MUST hold the higher priority: groups form in priority
// order, and with gl first, react-dom is folded into the gl chunk and the
// entry ends up modulepreloading all 1.2MB again (the rollup-compat
// manualChunks route fails the same way). The probe asserts the split holds.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 2 },
            { name: "gl", test: /node_modules[\\/](three|@react-three)[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
});
