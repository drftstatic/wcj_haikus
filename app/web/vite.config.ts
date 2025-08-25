import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for mobile performance
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom'],
          // Separate heavy utilities
          imageUtils: ['html-to-image'],
        },
      },
    },
    // Optimize chunk sizes for mobile
    chunkSizeWarningLimit: 150,
  },
  // Preload critical resources
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
