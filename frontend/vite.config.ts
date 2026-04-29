/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import pug from 'pug';
import { resolve } from 'path';

function pugPlugin(): Plugin {
  return {
    name: 'vite-pug',
    transform(src, id) {
      if (!id.endsWith('.pug')) return;
      const compiled = pug.compileClient(src, {
        filename: id,
        doctype: 'html',
      });
      return {
        code: `${compiled}\nexport default template;`,
        map: null,
      };
    },
  };
}

export default defineConfig(
  defineVitestConfig({
    plugins: [
      pugPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/*.png', 'icons/*.svg'],
        manifest: false, // Usar manifest.json existente en public/
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 horas
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: false // Deshabilitar en desarrollo para evitar conflictos
        }
      })
    ],
    server: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss: https:; img-src 'self' data: blob:; font-src 'self'; worker-src 'self'",
    },
  },
  resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables" as *;`,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.ts'],
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html'),
        },
      },
    },
    publicDir: 'public',
  })
);
