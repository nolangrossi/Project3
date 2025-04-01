import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true
      }
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // File to include before running tests
  },
});
