import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const api = loadEnv(mode, '.', '').VITE_API_PROXY || 'http://127.0.0.1:5050';
  return {
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy: { '/api': api } },
  preview: { port: 4173, proxy: { '/api': api } },
  build: {
    target: 'es2020',
    // Three.js, R3F and drei are reached only through the lazy() import of the 3D scene,
    // so they land in their own chunk that downloads after first paint.
    chunkSizeWarningLimit: 1100,
  },
  };
});
