import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — deploys under a subfolder on GitHub Pages, so asset URLs stay
// relative. three.js is split into its own chunk so the storefront shell
// parses fast and the viewer streams in behind it.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
        },
      },
    },
  },
});
