import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages sirve la app en /mi-coche-control/; Cloudflare en la raiz.
// En Cloudflare se define la variable de entorno BASE_PATH=/ al compilar.
const base = process.env.BASE_PATH ?? '/mi-coche-control/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Incluye las fuentes locales para que la app se vea igual sin conexion.
        globPatterns: ['**/*.{js,css,html,png,woff2,webmanifest}']
      },
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: base,
        lang: 'es',
        name: 'Mi Coche Control',
        short_name: 'Mi Coche',
        description: 'Mantenimiento preventivo y control integral de tu vehiculo',
        theme_color: '#0D0818',
        background_color: '#0D0818',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
