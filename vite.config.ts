import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // State management
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],

          // UI libraries
          'vendor-ui': ['framer-motion', 'lucide-react'],

          // Redux slices - split by feature
          'store-auth': [
            './src/shared/store/slices/authSlice.ts',
            './src/infrastructure/repositories/AuthRepository.ts',
          ],
          'store-outfit': [
            './src/shared/store/slices/outfitSlice.ts',
            './src/infrastructure/repositories/OutfitRepository.ts',
          ],
          'store-social': [
            './src/shared/store/slices/socialSlice.ts',
            './src/infrastructure/repositories/SocialRepository.ts',
          ],
          'store-other': [
            './src/shared/store/slices/cartSlice.ts',
            './src/shared/store/slices/userSlice.ts',
            './src/shared/store/slices/wardrobeSlice.ts',
            './src/shared/store/slices/searchSlice.ts',
            './src/shared/store/slices/lookbookSlice.ts',
            './src/shared/store/slices/notificationSlice.ts',
          ],
        },
      },
    },
  },
})
