/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-fe0ed17';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CVc1lZOD.js","./assets/canvasGame-sVtUKzmg.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game-9hietax2.js","./assets/game-BVZik3cr.js","./assets/game-BbMPxxrC.js","./assets/game-BkUme8dL.js","./assets/game-BkXy8rTT.js","./assets/game-C1uk4vzK.js","./assets/game-C5eVtl4l.js","./assets/game-CCouS6Zz.js","./assets/game-CCrR_kyN.js","./assets/game-CFHdVaIq.js","./assets/game-COUu4q1M.js","./assets/game-CZYNZO_y.js","./assets/game-Cl1GWokd.js","./assets/game-Cl7c9UeD.js","./assets/game-CnDJE71r.js","./assets/game-Cp38IxlC.js","./assets/game-CtbbVD9z.js","./assets/game-CwPusYcg.js","./assets/game-CwTRJL7Z.js","./assets/game-D41thOJw.js","./assets/game-D65S08C7.js","./assets/game-DAka5x0_.js","./assets/game-DL7yLbKa.js","./assets/game-DMytFaT7.js","./assets/game-DVSwLgH2.js","./assets/game-DY5D3qvv.js","./assets/game-DaC60W2-.js","./assets/game-DfLu6Ki_.js","./assets/game-DjZV9VGy.js","./assets/game-DlPAoBlC.js","./assets/game-Dn4n1W0E.js","./assets/game-Do0EZufP.js","./assets/game-DxutDH4v.js","./assets/game-TVeWZ4_v.js","./assets/game-VyL-_wEw.js","./assets/game-b_z0ZEQL.js","./assets/game-c9--MhzI.js","./assets/game-uHxUdY9F.js","./assets/game-xVrpl9yR.js","./assets/guards-BRQZjza9.js","./assets/hud-D_7yuoPN.js","./assets/reactGame-Cssdc9CF.js","./assets/useElementSize-DHxl7LT2.js","./assets/useHints-DbO84ye7.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-ikgZ1AbU.css"];
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
