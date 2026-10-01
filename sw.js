/* 1 Milliarde Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-8c4f727';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BhMTjBXH.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--cLGt0X1.js","./assets/game-2UmZh2YS.js","./assets/game-2Vx9Ae3J.js","./assets/game-5JA3LBlv.js","./assets/game-B4geG_Is.js","./assets/game-B6HHM62a.js","./assets/game-B6zqICfN.js","./assets/game-B8ocCw08.js","./assets/game-B9tEHpo_.js","./assets/game-BFAfa7Mr.js","./assets/game-BJ4NvI5l.js","./assets/game-BKEUMO3d.js","./assets/game-BKV3HeK2.js","./assets/game-BPSGBRtk.js","./assets/game-BWQoKQ_Q.js","./assets/game-BbABQ8s4.js","./assets/game-Bdmxd_Un.js","./assets/game-BgJVZ_ni.js","./assets/game-BiRWuXYX.js","./assets/game-BrN_gENQ.js","./assets/game-BtAZOB8c.js","./assets/game-Bwonkrep.js","./assets/game-ByzydDCl.js","./assets/game-C5Ru0SYA.js","./assets/game-CEv3M_Zs.js","./assets/game-CHUsUA80.js","./assets/game-CKJvsBjb.js","./assets/game-CKrpAAL0.js","./assets/game-CQ91sC2N.js","./assets/game-CTO6vY02.js","./assets/game-Ca9mIejK.js","./assets/game-CaqPSFZh.js","./assets/game-CcrbUuis.js","./assets/game-Ce50iXHn.js","./assets/game-ChotPPZK.js","./assets/game-CjTAJONL.js","./assets/game-CjZubVF4.js","./assets/game-CroUZug7.js","./assets/game-Cs1VeUcu.js","./assets/game-Ct17TZ0b.js","./assets/game-D1ti_u-m.js","./assets/game-D2elM1rm.js","./assets/game-D2pWsRvj.js","./assets/game-D9DliyNV.js","./assets/game-DJEuPvF9.js","./assets/game-DS9yl20s.js","./assets/game-DU3f1xXI.js","./assets/game-DW2DjkqR.js","./assets/game-DWECzHa4.js","./assets/game-D_98l8oM.js","./assets/game-Dc2R--QC.js","./assets/game-DcY-Lvbr.js","./assets/game-DdRVkmq4.js","./assets/game-DnkLl0LC.js","./assets/game-DqxIDtuu.js","./assets/game-DrDzgLLn.js","./assets/game-DuaEmPCq.js","./assets/game-Dwe27F3F.js","./assets/game-DzPsdxtp.js","./assets/game-Pezsi8Cc.js","./assets/game-SGRIPMb4.js","./assets/game-T7T_aQ8V.js","./assets/game-hSz7qgQj.js","./assets/game-kEt4OnKF.js","./assets/game-sNEGDzrx.js","./assets/game-scKM_afk.js","./assets/guards-BRQZjza9.js","./assets/hud-DYOyBj3n.js","./assets/reactGame-bDlZcM2t.js","./assets/search-CgP9J8U2.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BnRjEkFT.js","./assets/ui-Dr9NuKng.js","./assets/useCountdown-CfOW64Cl.js","./assets/useElementSize-C5Esh6dl.js","./assets/useHints-5efx4AaC.js","./assets/game-B5ZEP-7k.css","./assets/game-DPoCpSei.css","./assets/index-6bFdkDN_.css"];
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
