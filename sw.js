/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-9ce1596';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-DRjOEewu.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-39vEVMIG.js","./assets/game-8FaQ-aJl.js","./assets/game-AY5tnzZ3.js","./assets/game-B306qcY8.js","./assets/game-BAXqQz7W.js","./assets/game-BAcHWYqS.js","./assets/game-BCavnn0D.js","./assets/game-BE8sUuAo.js","./assets/game-BGmk4AZh.js","./assets/game-BGqhhmZ_.js","./assets/game-BLZZLwPC.js","./assets/game-BPqMrEqV.js","./assets/game-BZqk1fQG.js","./assets/game-BeDZ1LSJ.js","./assets/game-BefaiIQ7.js","./assets/game-BgYn1UQD.js","./assets/game-BssFg5rW.js","./assets/game-BwASV7N7.js","./assets/game-C4j6DMvf.js","./assets/game-C9T7jxsT.js","./assets/game-CCTIGq9a.js","./assets/game-CKn5pXMH.js","./assets/game-CQSF8v1d.js","./assets/game-CY2egeBA.js","./assets/game-CccvdAfz.js","./assets/game-CgmwqwK6.js","./assets/game-Cizc1EYm.js","./assets/game-CkKQRqoA.js","./assets/game-ClruRXRM.js","./assets/game-CmliFZsc.js","./assets/game-Cn-vx2G4.js","./assets/game-CowN6veG.js","./assets/game-CsdhV1uN.js","./assets/game-Ct_N2vPZ.js","./assets/game-CtyDKhek.js","./assets/game-Cugjesi9.js","./assets/game-DBJuM5l7.js","./assets/game-DEu6zYpC.js","./assets/game-DLnNJsZi.js","./assets/game-DMbfucGe.js","./assets/game-DQAqzAaX.js","./assets/game-DRTEb-WZ.js","./assets/game-DUjiFjO_.js","./assets/game-DZQIFiKo.js","./assets/game-DZfbABOy.js","./assets/game-DfySqqWv.js","./assets/game-Dh3dMbpQ.js","./assets/game-DrShDisX.js","./assets/game-Dt6FFmdG.js","./assets/game-Dv8c8JK_.js","./assets/game-DxjoglWd.js","./assets/game-IrPb4RdZ.js","./assets/game-NnugPV2o.js","./assets/game-TDlXZSah.js","./assets/game-Xrk_jAhI.js","./assets/game-afX1-9TN.js","./assets/game-jtBrpEd-.js","./assets/game-kCL69Q_a.js","./assets/game-lyKOkH3g.js","./assets/guards-BRQZjza9.js","./assets/hud-ms4m4jaJ.js","./assets/reactGame-CgimbYFS.js","./assets/search-CgP9J8U2.js","./assets/useElementSize-BR1k6zfk.js","./assets/useHints-dFY5YSJ1.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-Cgufj2T5.css"];
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
