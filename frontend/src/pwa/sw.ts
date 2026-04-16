/**
 * Custom service worker additions.
 *
 * This file is injected into the Workbox-generated service worker
 * via vite-plugin-pwa's `injectManifest` strategy.
 *
 * For now it only adds offline fallback behavior on top of the
 * pre-cache strategy Workbox generates automatically.
 */

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  void self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fallback: serve the cached shell for navigation requests
// when the network is unavailable.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/').then((r) => r ?? Response.error()),
      ),
    );
  }
});
