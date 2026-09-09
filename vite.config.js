import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/weather-app/',
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Clima',
        short_name: 'Clima',
        description: 'Aplicación del clima moderna y precisa',
        theme_color: '#f3f4f6',
        background_color: '#f3f4f6',
        display: 'standalone',
        icons: [
          {
            src: '/weather-app/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/weather-app/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
