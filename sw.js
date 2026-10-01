/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-c3fb6dd';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BnBjjKpN.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game--VMxug5X.js","./assets/game-B8LKFVFl.js","./assets/game-BEmDut_t.js","./assets/game-BQ2Em3Z4.js","./assets/game-BU3Vr9TH.js","./assets/game-BV5dukOL.js","./assets/game-BVFX7T-o.js","./assets/game-BZy3gBMu.js","./assets/game-BfDS2WVj.js","./assets/game-Bi-5O1x9.js","./assets/game-BmdvwV_F.js","./assets/game-BqFsdC4B.js","./assets/game-Bu9X1Q52.js","./assets/game-BvS-KF5u.js","./assets/game-BzuZsSxS.js","./assets/game-C29K5Auj.js","./assets/game-CDuqGxmM.js","./assets/game-CEPrCoWR.js","./assets/game-CN5nMl4K.js","./assets/game-CO56CuZh.js","./assets/game-CQnqEQZw.js","./assets/game-CSwZw_1Y.js","./assets/game-CYANDQEw.js","./assets/game-C_5hM9p_.js","./assets/game-Ccl6iGBG.js","./assets/game-Cx6sq_tT.js","./assets/game-D5Q2Uejt.js","./assets/game-D9SW76u-.js","./assets/game-DF8QcFC-.js","./assets/game-DJxyy1lF.js","./assets/game-DQLYkYRa.js","./assets/game-DVQbFP_I.js","./assets/game-DVaQHjhN.js","./assets/game-DVhbhlP1.js","./assets/game-DcGg7la3.js","./assets/game-DkJsN7TA.js","./assets/game-Dkq2p_n_.js","./assets/game-DoN8kEde.js","./assets/game-Dt2RRzs9.js","./assets/game-DxzTYzpZ.js","./assets/game-N7vQYKxN.js","./assets/game-PYu8y6sV.js","./assets/game-bB1eBWz_.js","./assets/game-jghXu97p.js","./assets/game-mKnJyBM9.js","./assets/game-s2XPNX7r.js","./assets/game-ui_ExnEa.js","./assets/guards-BRQZjza9.js","./assets/hud-DDUc0WP_.js","./assets/reactGame-DAdsoEr1.js","./assets/search-CgP9J8U2.js","./assets/useElementSize-2NnHr0Ao.js","./assets/useHints-B5-TkbKN.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-D27E-qrd.css"];
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

/* Dateien unter assets/ tragen einen Hash im Namen und ändern sich nie → erst im Speicher nachsehen (sofort da,
   spart Datenvolumen und Wartezeit), nur bei Fehlen aus dem Netz holen und merken. */
function cacheFirst(req) {
  return caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
    return res;
  }));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Firebase & Co.: nie aus dem Cache
  if (url.pathname.endsWith('/version.json')) return;         // Update-Prüfung: immer frisch aus dem Netz
  if (url.pathname.includes('/assets/')) { e.respondWith(cacheFirst(req)); return; }
  e.respondWith(networkFirst(req));
});
