/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-a26d8af';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BAXPrK4l.js","./assets/BackupSheet-Bug6kRPe.js","./assets/BonusSheet-CYs_3P9S.js","./assets/ChallengesSheet-9uyGlFL8.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-B5Yo1OuX.js","./assets/StatsSheet-VXgAkDZl.js","./assets/backend-JbHSfcRj.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/daily-Cq7x1oTw.js","./assets/firebaseBackend-B_hPABwh.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-12QeeXFV.js","./assets/game-3hhif0d1.js","./assets/game-3s4dSbLD.js","./assets/game-4b6HaXx_.js","./assets/game-B3FHzQbf.js","./assets/game-B5ppKaCO.js","./assets/game-BB1XLakY.js","./assets/game-BCCEobe1.js","./assets/game-BDJAZs3l.js","./assets/game-BDh87To8.js","./assets/game-BHLu-Ir6.js","./assets/game-BJlhJgPU.js","./assets/game-BNAc80Wx.js","./assets/game-BQQrsyX6.js","./assets/game-BVSeZwf1.js","./assets/game-BXmTFNHr.js","./assets/game-BZgANEIK.js","./assets/game-BaqjEVBP.js","./assets/game-BjYwQdUW.js","./assets/game-Bkm_ZH5x.js","./assets/game-BllvVNol.js","./assets/game-BpRkCUYp.js","./assets/game-Br_6gdWa.js","./assets/game-BreDOsOs.js","./assets/game-BwqHAvBB.js","./assets/game-Bx6pqX48.js","./assets/game-ByMDblOf.js","./assets/game-C0poatpp.js","./assets/game-C1MNKwT6.js","./assets/game-CAZqpU1o.js","./assets/game-CGXWNtdk.js","./assets/game-CJxmR87M.js","./assets/game-CKGD6lLt.js","./assets/game-CQ91ooP8.js","./assets/game-CScMUvEj.js","./assets/game-CSr6f3j3.js","./assets/game-CZ-EbdRT.js","./assets/game-CbHEYJ_c.js","./assets/game-CfK8c3St.js","./assets/game-Cgmclhtz.js","./assets/game-ClDn97s6.js","./assets/game-CrdJd20C.js","./assets/game-Cs77O2r6.js","./assets/game-CtD19EwA.js","./assets/game-CwC5XPPx.js","./assets/game-CzrGsqV-.js","./assets/game-D-IrLMNg.js","./assets/game-D0Y6BQpd.js","./assets/game-D2T_6HG0.js","./assets/game-D3zsxrHy.js","./assets/game-D4XaJsTS.js","./assets/game-D5Uzd_xW.js","./assets/game-D64mne6I.js","./assets/game-D7aDoet3.js","./assets/game-DEYYUW5N.js","./assets/game-DIr9Zg0u.js","./assets/game-DJDK0_7V.js","./assets/game-DKhXOVj-.js","./assets/game-DNpisfYk.js","./assets/game-DSCzfMd2.js","./assets/game-DScn62hC.js","./assets/game-DWFhoyNP.js","./assets/game-DcD5svUz.js","./assets/game-DfPUQlRC.js","./assets/game-Di6DIZRo.js","./assets/game-Dx-9UT4v.js","./assets/game-DxkXl2pR.js","./assets/game-Eg-IUYLa.js","./assets/game-H_OoZJlJ.js","./assets/game-Hi3jRe4u.js","./assets/game-JmqT4Sj2.js","./assets/game-Mb2wwfRO.js","./assets/game-P7MDZKTi.js","./assets/game-RwL_i_ds.js","./assets/game-VKjXzM0z.js","./assets/game-VeEhrI8h.js","./assets/game-VqqUs-93.js","./assets/game-WVIXjR1Q.js","./assets/game-WpcA2pkA.js","./assets/game-XgyRNjc2.js","./assets/game-YJPUMFb_.js","./assets/game-_g--Hw2N.js","./assets/game-akuGfoVx.js","./assets/game-dWpZuwxA.js","./assets/game-gff08Tbt.js","./assets/game-h_x7upvy.js","./assets/game-kmIOBu9E.js","./assets/game-mOd0hL8o.js","./assets/game-p2Q1DVVo.js","./assets/game-pwtklYlV.js","./assets/game-tXeyCj8U.js","./assets/game-w7DYdA_1.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-DZX4suEE.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-D3MU-2hc.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-Di-v_QAr.css"];
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
