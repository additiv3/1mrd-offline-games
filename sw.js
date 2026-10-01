/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-0503f05';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-Bre9dgfN.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--bhG84Id.js","./assets/game-0z83m5pH.js","./assets/game-2P308ls7.js","./assets/game-7yYeaNns.js","./assets/game-8h6Z6h98.js","./assets/game-8pb7WYFU.js","./assets/game-B0NoCXIk.js","./assets/game-B2wI2xmt.js","./assets/game-B4aws7U5.js","./assets/game-B7_1jE6X.js","./assets/game-BNS7XAso.js","./assets/game-BUbcATK7.js","./assets/game-BdxcDcBl.js","./assets/game-Bfs0RY7W.js","./assets/game-Bj9sR5Sl.js","./assets/game-BnN9_UqY.js","./assets/game-Br2e2Hb8.js","./assets/game-BsuiDLU4.js","./assets/game-Bv2Rv9gY.js","./assets/game-BvdJF3hV.js","./assets/game-BxGyNCMz.js","./assets/game-BxVFALAS.js","./assets/game-C-Q5QbH-.js","./assets/game-C43NcYRa.js","./assets/game-C4mJGV6l.js","./assets/game-CAMdSmLN.js","./assets/game-CBpiE5Wa.js","./assets/game-CDwgiD6c.js","./assets/game-CG6LJjIb.js","./assets/game-CKHbR93t.js","./assets/game-CMYLTss_.js","./assets/game-CP9M-tQX.js","./assets/game-CP_HGg97.js","./assets/game-CRpVuz_w.js","./assets/game-CSQMwfNe.js","./assets/game-CURPgeVt.js","./assets/game-CYxudSfM.js","./assets/game-CcmsVbu0.js","./assets/game-CdLOLQ0L.js","./assets/game-CiRmL4RQ.js","./assets/game-CvvE_kCt.js","./assets/game-Cyea6EGa.js","./assets/game-Czm-hRFJ.js","./assets/game-D4mikkoy.js","./assets/game-D5v31ut4.js","./assets/game-D6npx6YZ.js","./assets/game-D7-t7YkE.js","./assets/game-D7LChRWy.js","./assets/game-DHFwtmjy.js","./assets/game-DHXoANXz.js","./assets/game-DJeDAJ_f.js","./assets/game-DJnjVxRU.js","./assets/game-DOrnOhmN.js","./assets/game-DVkkG6TO.js","./assets/game-DWHkb16m.js","./assets/game-DbY9ViRD.js","./assets/game-DkH0TgJN.js","./assets/game-Doe3bMu1.js","./assets/game-DqLOIWh-.js","./assets/game-Dr0WGYLI.js","./assets/game-DrtkiKB3.js","./assets/game-Dw2gy7r5.js","./assets/game-Dz9MPecm.js","./assets/game-ENJeHaRU.js","./assets/game-J77akCJq.js","./assets/game-N_r_9fRB.js","./assets/game-SYwNmIOG.js","./assets/game-XXP2Yx4a.js","./assets/game-YJ2ZUD76.js","./assets/game-jMg4yijd.js","./assets/game-t8FiOXT5.js","./assets/game-wGwPV4jC.js","./assets/guards-BRQZjza9.js","./assets/hud-DRkQH6dH.js","./assets/reactGame-DAuDOpBk.js","./assets/search-CgP9J8U2.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-B0_itaz4.js","./assets/ui-CN9gAV71.js","./assets/useCountdown-DUhVCghL.js","./assets/useElementSize-BCDL6hC0.js","./assets/useHints-B0is0Dvk.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-D35FLnGR.css"];
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
