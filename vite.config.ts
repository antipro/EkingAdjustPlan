import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: env.VITE_MOCK === 'false' ? {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:31006/dom-mdm',
          changeOrigin: true,
          headers: {
            ACCESS_TOKEN: env.ACCESS_TOKEN || '',
            Authorization: env.AUTHORIZATION || '',
          },
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/uc': {
          target: env.VITE_API_UC_URL || 'http://192.168.1.231:9446/uc',
          changeOrigin: true,
          headers: {
            ACCESS_TOKEN: env.ACCESS_TOKEN || '',
            Authorization: env.AUTHORIZATION || '',
          },
          rewrite: (path) => path.replace(/^\/uc/, '')
        }
      } : undefined,
    },
  };
});
