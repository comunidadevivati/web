import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/router/routes',
      generatedRouteTree: './src/app/router/routeTree.gen.ts',
      quoteStyle: 'single',
    }),

    react(),

    babel({
      presets: [reactCompilerPreset()],
    }),

    tailwindcss(),

    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      manifest: {
        id: '/',
        name: 'Comunidade Viva',
        short_name: 'Comunidade Viva',
        description: 'Aplicação oficial da Comunidade Viva',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
