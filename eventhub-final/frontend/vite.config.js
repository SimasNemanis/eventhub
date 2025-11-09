import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api/proxy': {
        target: 'http://46.224.28.13:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/api'),
      },
    },
  },
});

