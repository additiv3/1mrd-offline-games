/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-15e8dc9';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BSceICVT.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/game-3mAH_fMa.js","./assets/game-5DwiDZUi.js","./assets/game-B2sGJcpl.js","./assets/game-B72RIUVU.js","./assets/game-B8lVAIJc.js","./assets/game-BApmoDdn.js","./assets/game-BCKlr08J.js","./assets/game-Bb2eSY1f.js","./assets/game-Bf4MX-1c.js","./assets/game-BhR5OGGn.js","./assets/game-BiCbPGz_.js","./assets/game-BjVil-jm.js","./assets/game-Bl6rYf3a.js","./assets/game-Bo--Nmve.js","./assets/game-Bqlqwjnr.js","./assets/game-C0-fcOga.js","./assets/game-CE6opF33.js","./assets/game-CEgcrSEe.js","./assets/game-CGCG_dzu.js","./assets/game-CVRtAGWj.js","./assets/game-CfvHdNgK.js","./assets/game-CnzUYXyV.js","./assets/game-Cz9CD2Qu.js","./assets/game-DD0Yj0uw.js","./assets/game-DEBk8aa7.js","./assets/game-DJEA6JpX.js","./assets/game-DQDlpb-6.js","./assets/game-DXxXoDvj.js","./assets/game-DaO6mcMI.js","./assets/game-SVga0jU8.js","./assets/game-X-6DiuDa.js","./assets/game-_T-_Qn3Z.js","./assets/game-dMg5q2AY.js","./assets/game-fRDbW9P2.js","./assets/game-jcorMrsn.js","./assets/game-lMbBiLGF.js","./assets/game-mqx2rcJI.js","./assets/game-nlUKn6iu.js","./assets/game-uQE-NhRW.js","./assets/game-uegN_lf-.js","./assets/game-y3fwKXSZ.js","./assets/game-yEu0Iadt.js","./assets/guards-BRQZjza9.js","./assets/hud-DNZ4SXXG.js","./assets/reactGame-DTqFRveE.js","./assets/useElementSize-BVn6SPLj.js","./assets/useHints-wXOsIHDG.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-BBsBu-6L.css"];
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
