/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-97a46d5';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BK5JhTvs.js","./assets/canvasGame-sVtUKzmg.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game-5NsrGY4Z.js","./assets/game-B4fdxPPB.js","./assets/game-B6sqTWgp.js","./assets/game-B765zFGa.js","./assets/game-BN_oUdFs.js","./assets/game-BWryaVYB.js","./assets/game-BadiMDga.js","./assets/game-BiAabgRU.js","./assets/game-Blq2W_ru.js","./assets/game-BmFUcLcx.js","./assets/game-Bttcv6K8.js","./assets/game-C13rM02g.js","./assets/game-C29pWZLg.js","./assets/game-CA0Zjs4B.js","./assets/game-CMYNbGjC.js","./assets/game-CcL6obIs.js","./assets/game-Ci7iZwSZ.js","./assets/game-CtJyJya4.js","./assets/game-Cv2CCome.js","./assets/game-CzntvJCg.js","./assets/game-D2f1ETg4.js","./assets/game-D9w5ZPVU.js","./assets/game-DBLxF0nF.js","./assets/game-DBoIgXeW.js","./assets/game-DCzq19U7.js","./assets/game-DEKrofU3.js","./assets/game-DOAsD65z.js","./assets/game-Dbo77sPC.js","./assets/game-Dqox8Dw2.js","./assets/game-Dsmzie8t.js","./assets/game-bOAeqkCM.js","./assets/game-e9bIjsHu.js","./assets/game-gi9FDLf7.js","./assets/game-q3SXHDBC.js","./assets/game-yXtfuL4-.js","./assets/game-ynkJaIwu.js","./assets/guards-BRQZjza9.js","./assets/hud-BNNv1MYr.js","./assets/reactGame-DFNYgEXN.js","./assets/useElementSize-Dzj15GV9.js","./assets/useHints-CfEtjm_c.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-D7OTZlKx.css"];
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
