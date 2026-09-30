/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-91cfdef';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CD2ydsUu.js","./assets/canvasGame-DYwfHdDY.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game-B-6A87DH.js","./assets/game-B1a-f3Bi.js","./assets/game-BCLr_FwA.js","./assets/game-BHhqqaO8.js","./assets/game-BW-UxHHE.js","./assets/game-BWQ8D29a.js","./assets/game-Bd4ne4kb.js","./assets/game-BhcZ1k8T.js","./assets/game-BjIIaOR-.js","./assets/game-BkDBL_3o.js","./assets/game-BsCB2N0z.js","./assets/game-CEv5nAbp.js","./assets/game-Cj8xWVjq.js","./assets/game-CnB_YwVr.js","./assets/game-Cn_MBG6t.js","./assets/game-CwIuKRa_.js","./assets/game-CyRUmjq4.js","./assets/game-DC8XQowD.js","./assets/game-DJmapWkr.js","./assets/game-DmZcCHaA.js","./assets/game-DoJQhddS.js","./assets/game-DoRoXVux.js","./assets/game-DqrPDOUA.js","./assets/game-DwNxnNXV.js","./assets/game-LTsUB-oR.js","./assets/game-N4QshTxm.js","./assets/game-YSwM68Q7.js","./assets/game-lB0jwSGC.js","./assets/game-qvM1-3TI.js","./assets/game-wgAO_14e.js","./assets/hud-1mVdqzRP.js","./assets/reactGame-BfjgRi2n.js","./assets/useElementSize-B1fGYn-R.js","./assets/useHints-DEkQZH2E.js","./assets/game-B5ZEP-7k.css","./assets/game-D99wKzYq.css","./assets/index-DrsPlfH5.css"];
const PREFIX = 'mrd-offline-games-';   // additiv3.github.io teilt sich den Cache mit anderen Apps → nur eigene löschen

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => Promise.all(PRECACHE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Netz zuerst (höchstens 4 s warten, dann Speicher): eine neue Version ist sofort da,
   im Funkloch startet die App trotzdem aus dem Speicher. */
function networkFirst(req) {
  return new Promise((resolve) => {
    let done = false;
    const fromCache = () => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'));
    const timer = setTimeout(() => {
      fromCache().then((hit) => { if (hit && !done) { done = true; resolve(hit); } });
    }, 4000);
    // Neue Anfrage nur aus der URL: Seitenaufrufe (mode 'navigate') lassen sich in älterem Safari nicht mit Optionen kopieren
    fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
      clearTimeout(timer);
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
      if (!done) { done = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      fromCache().then((hit) => { if (!done) { done = true; resolve(hit || Response.error()); } });
    });
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Firebase & Co.: nie aus dem Cache
  if (url.pathname.endsWith('/version.json')) return;         // Update-Prüfung: immer frisch aus dem Netz
  e.respondWith(networkFirst(req));
});
