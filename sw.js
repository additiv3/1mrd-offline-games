/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-637c7f3';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CnhkDLS_.js","./assets/canvasGame-DYwfHdDY.js","./assets/game-0fuT6lHb.js","./assets/game-3VYBwYpb.js","./assets/game-B5q46_qe.js","./assets/game-BES-D2Wb.js","./assets/game-BFVFry9W.js","./assets/game-BGtHv7_q.js","./assets/game-BQYOuh-P.js","./assets/game-BVutGzeK.js","./assets/game-BVxvkSpB.js","./assets/game-BdxAjMSp.js","./assets/game-CFsw8vGP.js","./assets/game-CMR8lOn_.js","./assets/game-CVZ8IiON.js","./assets/game-CsG3473T.js","./assets/game-CwD1yhLJ.js","./assets/game-D0C5C8K1.js","./assets/game-D0zB0t3h.js","./assets/game-D8jRNUgl.js","./assets/game-DM6GIEky.js","./assets/game-DMFbwW3R.js","./assets/game-DRpSM1DR.js","./assets/game-Dqqjewim.js","./assets/game-DvigQ3_-.js","./assets/game-bpBvS_B4.js","./assets/game-u7m4RK0a.js","./assets/hud-DtisJaYP.js","./assets/reactGame-Be-oIPbq.js","./assets/useElementSize-WnVw_2Qz.js","./assets/useHints-XD0y0_g7.js","./assets/game-B5ZEP-7k.css","./assets/index-B-ajbomc.css"];
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
