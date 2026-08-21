import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Configure HMR according to environment flags
      hmr: process.env.DISABLE_HMR !== 'true',
      // Adjust file watch behavior for containerized performance
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
