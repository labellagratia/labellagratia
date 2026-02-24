// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Configuração para GitHub Pages
  base: '/app/', // ← Nome do seu repositório no GitHub
  
  // Configuração de resolução de caminhos (alias @)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Configuração do servidor de desenvolvimento
  server: {
    host: '0.0.0.0', // ✅ Permite acesso externo na rede local
    port: 5173,
    strictPort: true,
  },
});