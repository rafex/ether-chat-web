/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
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

export default defineConfig({
  plugins: [
    pugPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
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
});
