/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-aa57b28';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-B8RSqVK6.js","./assets/canvasGame-DYwfHdDY.js","./assets/game-3cM5BqTR.js","./assets/game-68m5SpNB.js","./assets/game-9CdhlVV3.js","./assets/game-B3_JmEmN.js","./assets/game-BAODRwbQ.js","./assets/game-BAadC8N2.js","./assets/game-Btr7LU_5.js","./assets/game-C8CE6eGH.js","./assets/game-CLV74yqo.js","./assets/game-CepjcfmX.js","./assets/game-CyqnAw4z.js","./assets/game-DE4PO0DA.js","./assets/game-DEpfmtPL.js","./assets/game-DZwfwLN1.js","./assets/game-Da_AE7X8.js","./assets/game-DasSSsN5.js","./assets/game-GiTnmw7N.js","./assets/game-KqR5EUVf.js","./assets/game-YspXLBTV.js","./assets/game-bG9NdaU0.js","./assets/game-rg29qyAz.js","./assets/game-ssRFZldc.js","./assets/hud-Bq4cWFzA.js","./assets/reactGame-DZLYidON.js","./assets/useElementSize-Cat-AJ_f.js","./assets/useHints-DhGinuAq.js","./assets/game-B5ZEP-7k.css","./assets/index-CCfllU23.css"];
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
