import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, '.', '').VITE_BASE_PATH || '/',
  build: { rollupOptions: { input: { main: 'index.html', open: 'open/index.html' }, output: { manualChunks(id) {
    if (id.includes('@rive-app')) return 'rive';
    if (id.includes('node_modules/react')) return 'react';
  } } } },
}));
