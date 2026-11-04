/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-7e79f15';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-DhEEsX1w.js","./assets/BackupSheet-DCsd8C1l.js","./assets/BonusSheet-BkiPzfSS.js","./assets/ChallengesSheet-DiNMZLyh.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-DfK7mfwU.js","./assets/StatsSheet-BqEp_yrS.js","./assets/backend-Bf5_fDGC.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/daily-Cq7x1oTw.js","./assets/firebaseBackend-DGeZ4xDD.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-8gcU1zlU.js","./assets/game-B6zs5H1R.js","./assets/game-B7qXD-4F.js","./assets/game-B7smFEaS.js","./assets/game-BJh9kcFa.js","./assets/game-BJmZtnq0.js","./assets/game-BK2eMc0G.js","./assets/game-BKOLvE6a.js","./assets/game-BLNdZFwT.js","./assets/game-BLUUwEER.js","./assets/game-BO9islyL.js","./assets/game-BV2WoI3f.js","./assets/game-BWO3gVmn.js","./assets/game-B_ux5A69.js","./assets/game-BbEIln9I.js","./assets/game-BdgTjM6U.js","./assets/game-Bdy5FqbH.js","./assets/game-Be_smK2g.js","./assets/game-BleAxKAG.js","./assets/game-BpYAEVAI.js","./assets/game-BvGj1hno.js","./assets/game-BvuJ2D-c.js","./assets/game-Bz5gm7E6.js","./assets/game-C-x1_hYA.js","./assets/game-C2R4ZF9y.js","./assets/game-C4FYwpo2.js","./assets/game-C601f5wE.js","./assets/game-C8IfHaKG.js","./assets/game-CF1Rj3-c.js","./assets/game-CHSk-e0W.js","./assets/game-CIOXRjKQ.js","./assets/game-CNFETa_i.js","./assets/game-CO5BIoBQ.js","./assets/game-COEMIZjA.js","./assets/game-COfXWDOU.js","./assets/game-CRlTwfDl.js","./assets/game-CSlnfO54.js","./assets/game-C_UHDTCL.js","./assets/game-CdOKe4y-.js","./assets/game-CfwWfWym.js","./assets/game-ChE_4Drl.js","./assets/game-ChecwWAJ.js","./assets/game-Cj2XaBtf.js","./assets/game-Clx11OCK.js","./assets/game-CnPkn2c_.js","./assets/game-Cp0M32Fc.js","./assets/game-CsDZDGrQ.js","./assets/game-CsTG0AOQ.js","./assets/game-CvkdtLDE.js","./assets/game-D15Vnd6-.js","./assets/game-D8NrLWYh.js","./assets/game-D9Dfraka.js","./assets/game-DAb3DNLs.js","./assets/game-DCFu9BIS.js","./assets/game-DEQk9cPO.js","./assets/game-DEQt-MVx.js","./assets/game-DHYRuTKS.js","./assets/game-DJ9zuuiU.js","./assets/game-DJku6Qk2.js","./assets/game-DNDWrmSa.js","./assets/game-DRhqxFYL.js","./assets/game-DWOmC6XR.js","./assets/game-DWcuQYX-.js","./assets/game-DXmOTj4u.js","./assets/game-D__ELnyZ.js","./assets/game-Dbx7-Mi_.js","./assets/game-DdmypV0D.js","./assets/game-DgarAL-Z.js","./assets/game-Dh3LTIXS.js","./assets/game-DieXYtbr.js","./assets/game-DlEGIg3J.js","./assets/game-DlpjJn3x.js","./assets/game-Dqy_cog4.js","./assets/game-Dwz4y5qA.js","./assets/game-DxJqr5OC.js","./assets/game-EUYeYX6X.js","./assets/game-FiHVc2uB.js","./assets/game-I_GIDA2l.js","./assets/game-Iyr87hR2.js","./assets/game-JACjxzcM.js","./assets/game-LWFsZBzn.js","./assets/game-NEG2F9f2.js","./assets/game-Ok6v3bBB.js","./assets/game-YU2U2jDR.js","./assets/game-fljOjCar.js","./assets/game-koLjJKgW.js","./assets/game-orYPlz5E.js","./assets/game-pbsaYwn6.js","./assets/game-s08d65qh.js","./assets/game-stH0xNeQ.js","./assets/game-uqwtSCJA.js","./assets/game-z8a3C7xr.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-BM8hwYoB.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-CnVuK9PF.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-BZl3Njga.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-CBevzPw8.css"];
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
