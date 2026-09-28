/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-v8-full-overhaul';
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-512.png",
  "./version.json",
  "./assets/index-BCeFSnmE.css",
  "./assets/game-B5ZEP-7k.css",
  "./assets/index-ONzyNlzA.js",
  "./assets/reactGame-y65cNbT4.js",
  "./assets/card-graphics.js",
  "./assets/challenges-manager.js",
  "./assets/daily-manager.js",
  "./assets/shop-manager.js",
  "./assets/game-BZGM6-ZV.js",
  "./assets/game-CD5igE3r.js",
  "./assets/game-DxiGv2Ac.js",
  "./assets/game-wasser-sortieren.js",
  "./assets/game-pong-duell.js",
  "./assets/game-tierturm.js",
  "./assets/game-sandfall.js",
  "./assets/game-solitaer.js",
  "./assets/game-spider-solitaer.js",
  "./assets/game-spades.js",
  "./assets/game-sudoku.js",
  "./assets/game-kniffel.js",
  "./assets/game-cross-sum.js",
  "./assets/game-snake.js",
  "./assets/game-2048.js",
  "./assets/game-maulwurf.js",
  "./assets/game-memory.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate für assets und shell
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);

      return cached || network || new Response("Offline", { status: 503 });
    })
  );
});
