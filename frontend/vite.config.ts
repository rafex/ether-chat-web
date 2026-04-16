/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
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
    ],
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
