/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep the CRA-era REACT_APP_ prefix so existing .env files, Dockerfile
  // build args, and CI secrets don't need to be renamed.
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
