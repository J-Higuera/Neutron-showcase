import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — the site deploys under a subfolder on GitHub Pages, so every
// asset URL must stay relative.
export default defineConfig({
  base: './',
  plugins: [react()],
});
