/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-3a28323';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-sj__KVS1.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-5JU70Yyr.js","./assets/game-7tHZPex0.js","./assets/game-9dsCHprm.js","./assets/game-B2593KD3.js","./assets/game-B4uYCcUq.js","./assets/game-B8r5suOt.js","./assets/game-BBFd6B2-.js","./assets/game-BBODNqrE.js","./assets/game-BHH8w0mV.js","./assets/game-BHxUlYLw.js","./assets/game-BIwFY0a1.js","./assets/game-BJvraWaW.js","./assets/game-BKF6rwnN.js","./assets/game-BLUc3xGk.js","./assets/game-BOWPM-VK.js","./assets/game-BPsotZTR.js","./assets/game-BQFTJ_oG.js","./assets/game-BSiB9qvt.js","./assets/game-BWfBdfD0.js","./assets/game-BYvZDrBV.js","./assets/game-B_vBUPXH.js","./assets/game-B_wu2WFs.js","./assets/game-BbzouVa0.js","./assets/game-BdZuNJfT.js","./assets/game-BecFU9R7.js","./assets/game-C-6U725y.js","./assets/game-C7u2oc1N.js","./assets/game-CCiroBcY.js","./assets/game-CDmIsBCQ.js","./assets/game-CEbxRThd.js","./assets/game-CFsOWj_b.js","./assets/game-CObHeRgG.js","./assets/game-CQcRET5o.js","./assets/game-CQsDz9A5.js","./assets/game-CV-BRfmN.js","./assets/game-CVapJE4c.js","./assets/game-CbN7yGRc.js","./assets/game-CgN6nYvY.js","./assets/game-Cu7YZDWm.js","./assets/game-CvOvySDW.js","./assets/game-CxTWuxVO.js","./assets/game-D0nuV-o5.js","./assets/game-D3IabDS2.js","./assets/game-D5aGcVyP.js","./assets/game-D6WhCHxn.js","./assets/game-D8g10P4h.js","./assets/game-DAgSa2Ge.js","./assets/game-DGLjMd5L.js","./assets/game-DHynOFX1.js","./assets/game-DIxdIjjm.js","./assets/game-DM2TZmdC.js","./assets/game-DMXn8L2i.js","./assets/game-DRbUVBUR.js","./assets/game-DTGFTil9.js","./assets/game-DUyy4u_e.js","./assets/game-DZ8XCK_p.js","./assets/game-DZHnbi2o.js","./assets/game-DasASYkP.js","./assets/game-DbJfSyU1.js","./assets/game-DelbovDQ.js","./assets/game-DjXDUt1F.js","./assets/game-DpqCUuZ0.js","./assets/game-DqvyyyTL.js","./assets/game-Du1aTugz.js","./assets/game-Dult9DCn.js","./assets/game-DuqkBM2R.js","./assets/game-FjIzeS60.js","./assets/game-KOCngopt.js","./assets/game-SQBU55Xn.js","./assets/game-TCFa90ue.js","./assets/game-VR2EPZrj.js","./assets/game-Y6WEANgS.js","./assets/game-mjNrUrHR.js","./assets/game-or4W4RCU.js","./assets/game-wSr1-Y5D.js","./assets/guards-BRQZjza9.js","./assets/hud-Ckykemsu.js","./assets/reactGame-DKu6v2wc.js","./assets/search-CgP9J8U2.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-By61zNVL.js","./assets/ui-Bs_ELAK7.js","./assets/useCountdown-Ctu3FovR.js","./assets/useElementSize-Bhu9y3ml.js","./assets/useHints-BaPGxQ-X.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-DKUMQA37.css"];
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
