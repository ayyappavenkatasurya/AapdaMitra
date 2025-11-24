import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AapdaMitra - National Disaster Response',
        short_name: 'AapdaMitra',
        description: 'Emergency Response System for Viksit Bharat',
        theme_color: '#FF9933',
        icons: [
          {
            src: 'pwa-192x192.png', // You need to add these images to public folder later
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})