// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // ✅ User Site usa raiz absoluta
  base: '/',
  
  build: {
    // ✅ Cache busting: novo hash a cada build
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash:8].js`,
        chunkFileNames: `assets/[name]-[hash:8].js`,
        assetFileNames: `assets/[name]-[hash:8].[ext]`
      }
    }
    // ✅ Removido terserOptions (causava erro de tipo)
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});