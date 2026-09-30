/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-3b64d8c';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-Cq-_mp44.js","./assets/canvasGame-DYwfHdDY.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game-5yzUm5N3.js","./assets/game-B0K2tCR9.js","./assets/game-B9cRL6-i.js","./assets/game-BNN6X6gr.js","./assets/game-Bebl6qxG.js","./assets/game-BjMMs9L5.js","./assets/game-ByaNJYAG.js","./assets/game-C-1BHjRB.js","./assets/game-C5iBp_wp.js","./assets/game-CNz0_koW.js","./assets/game-CQX_70ay.js","./assets/game-CdkXb_RN.js","./assets/game-CjQ2I4AE.js","./assets/game-CkQJhEKQ.js","./assets/game-CwHabAnP.js","./assets/game-D-HtJVoc.js","./assets/game-D6lglAD7.js","./assets/game-DH-OMSD9.js","./assets/game-DVE6tmQU.js","./assets/game-DgV5aeRe.js","./assets/game-Dl6GzN4C.js","./assets/game-Dn5Q8KZt.js","./assets/game-Dp1xzSAe.js","./assets/game-DseL8YQJ.js","./assets/game-HA6-S4cD.js","./assets/game-IpnxEY44.js","./assets/game-Qjm7ebbM.js","./assets/game-c_V80E9N.js","./assets/game-enRxx_Sp.js","./assets/game-n-rFECGm.js","./assets/game-qIAUY4hH.js","./assets/game-sYHpr7P1.js","./assets/game-t_FsuiBD.js","./assets/hud-CL-Fk6oY.js","./assets/reactGame-7dSOIqBG.js","./assets/useElementSize-MMbVJF-T.js","./assets/useHints-DdYwaRca.js","./assets/game-B5ZEP-7k.css","./assets/game-D99wKzYq.css","./assets/index-DXgZeO_K.css"];
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
