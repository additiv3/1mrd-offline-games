/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-234caaa';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-cG0kipwA.js","./assets/BackupSheet-DqOtG0hK.js","./assets/BonusSheet-DrmYEJEh.js","./assets/ChallengesSheet-B51cKI0C.js","./assets/PlayingCard-CLzB3IHa.js","./assets/ShopSheet-BjC7IZpP.js","./assets/StatsSheet-ncG6AKUO.js","./assets/backend-atkMC_Aa.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-C8vZGEXs.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-05CyYISq.js","./assets/game-0jktAbHZ.js","./assets/game-43d2KZpe.js","./assets/game-5tZ085uA.js","./assets/game-7GLtY4d0.js","./assets/game-7valFmAy.js","./assets/game-8_Gu0Vcf.js","./assets/game-B-8-xJvf.js","./assets/game-B01l-v7h.js","./assets/game-B0PyjRbw.js","./assets/game-B25YCHhs.js","./assets/game-B2ZBp_N1.js","./assets/game-B3oQgJyt.js","./assets/game-B5I9AEhI.js","./assets/game-B5esn7lC.js","./assets/game-B634N8tj.js","./assets/game-B7F7dYRL.js","./assets/game-B9hCWvgy.js","./assets/game-BGCYLnSI.js","./assets/game-BGlhiQi7.js","./assets/game-BNfFlwri.js","./assets/game-BYiMNoVX.js","./assets/game-B_2tx5mb.js","./assets/game-BbkrEc3o.js","./assets/game-Bd1R4jsy.js","./assets/game-BfwvQMOT.js","./assets/game-BjfefrC5.js","./assets/game-BmO0DJI-.js","./assets/game-Bn1VKG05.js","./assets/game-BobCkG0q.js","./assets/game-BsimVmLE.js","./assets/game-Bv6Nvsaz.js","./assets/game-BwCBQI9y.js","./assets/game-BytVXvI4.js","./assets/game-BzgCxJqJ.js","./assets/game-C2cKBQ8M.js","./assets/game-C7o2rTiH.js","./assets/game-CD4XhfJL.js","./assets/game-CFUjPgtn.js","./assets/game-CHkVio0k.js","./assets/game-CJCpAdcp.js","./assets/game-CJDIeGZS.js","./assets/game-CKZJ1KdS.js","./assets/game-CLcoyT4o.js","./assets/game-CLkgq7wA.js","./assets/game-CMmdnwVk.js","./assets/game-CXoZYpcd.js","./assets/game-CYAbxyoK.js","./assets/game-CZZ7vE3a.js","./assets/game-ClhHEi_3.js","./assets/game-CqZSaA55.js","./assets/game-CqtUoqzn.js","./assets/game-Cs3PVaQm.js","./assets/game-D-FWHSVM.js","./assets/game-D4-NSaOJ.js","./assets/game-D4Qrxwrr.js","./assets/game-D687f9Rw.js","./assets/game-DEoMZYEB.js","./assets/game-DGo7ODyx.js","./assets/game-DKaBUA72.js","./assets/game-DL8KQfcU.js","./assets/game-DODsBNY1.js","./assets/game-DOdT1JMO.js","./assets/game-DaNGkpeF.js","./assets/game-DcJTJIyI.js","./assets/game-DdrDa5Rf.js","./assets/game-DdrkL0VC.js","./assets/game-DfweLJdp.js","./assets/game-Dg5gmCyU.js","./assets/game-DiL8IIoQ.js","./assets/game-Dizmzo5_.js","./assets/game-Dj5k273i.js","./assets/game-DjDTsBgP.js","./assets/game-DrPdcz3z.js","./assets/game-DrqsOyuw.js","./assets/game-DsfuQ6vy.js","./assets/game-DxazShe6.js","./assets/game-Dy_jx89f.js","./assets/game-GPvJ_kIc.js","./assets/game-HPxOagNZ.js","./assets/game-L_Uv7D_f.js","./assets/game-MLrDJiGm.js","./assets/game-McqzQs6a.js","./assets/game-PQjOp3Ko.js","./assets/game-Pn8mFkd9.js","./assets/game-QbIz9Lcp.js","./assets/game-RGJMHdrj.js","./assets/game-RXJKoooK.js","./assets/game-RsgvorpE.js","./assets/game-VtEFlVGG.js","./assets/game-WfCH2xa1.js","./assets/game-mRYQP8Nr.js","./assets/game-nkbSk4JL.js","./assets/game-qPL7a1mj.js","./assets/game-xov7b70Y.js","./assets/gameSkins-BBxRnUsV.js","./assets/guards-BRQZjza9.js","./assets/hud-Bvz4j6P6.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-D3bdQF3H.js","./assets/reactGame-Dx6P5eD7.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-C33aV_tT.js","./assets/turns-BEdDdaCA.js","./assets/ui-ZLDkKAM0.js","./assets/useCoopGame-DdN1PCzr.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-CXaaXP5g.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-CEU8P9No.css"];
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
