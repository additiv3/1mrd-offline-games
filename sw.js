/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-119cea1';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-DYL8t8gK.js","./assets/BackupSheet-B34CsjqI.js","./assets/BonusSheet-Bt-2D8qI.js","./assets/ChallengesSheet-Bs1unjsn.js","./assets/PlayingCard-CLzB3IHa.js","./assets/ShopSheet-C8FGE-tZ.js","./assets/StatsSheet-C1rtypEl.js","./assets/backend-Dhq1nF9X.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-CIhMRYHJ.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--uMkhHiI.js","./assets/game-00VvCjSE.js","./assets/game-295p1IwA.js","./assets/game-48ucjllg.js","./assets/game-52D8mwP4.js","./assets/game-B16HJnk0.js","./assets/game-B1mOZ8PE.js","./assets/game-B48BsewU.js","./assets/game-BClOu6ws.js","./assets/game-BDkZlxGF.js","./assets/game-BKqYea5p.js","./assets/game-BLYECvvc.js","./assets/game-BNWsbHWR.js","./assets/game-BSwMnoti.js","./assets/game-BTLdEMMp.js","./assets/game-BTVbv1vJ.js","./assets/game-BW8eSkxZ.js","./assets/game-BZ0Q86ye.js","./assets/game-BZXiS-Fb.js","./assets/game-BZg1QcUP.js","./assets/game-BaRLy9ky.js","./assets/game-BbVvoNHe.js","./assets/game-Bgg173Wl.js","./assets/game-BidVqA3Z.js","./assets/game-BkSuoe-e.js","./assets/game-Bl4A2qnC.js","./assets/game-Bmbvvsni.js","./assets/game-BmoeeSah.js","./assets/game-BozzmYzy.js","./assets/game-Br6tXmls.js","./assets/game-BuauT8L3.js","./assets/game-BvckxrjI.js","./assets/game-BwJThxS_.js","./assets/game-BxSqeZ6X.js","./assets/game-Bxhz6VO7.js","./assets/game-C0SAL0ug.js","./assets/game-C0baC2YI.js","./assets/game-CC0nENUF.js","./assets/game-CEerWPet.js","./assets/game-CKloxt9r.js","./assets/game-CL5t3w0a.js","./assets/game-CMMmtTgJ.js","./assets/game-COsC3SkX.js","./assets/game-CRM1nIvM.js","./assets/game-CTkIdXoi.js","./assets/game-CUBfuD2o.js","./assets/game-CW8I-jBM.js","./assets/game-CWvB34-g.js","./assets/game-CXOfwU9k.js","./assets/game-CdXgtB0r.js","./assets/game-CfpqWshb.js","./assets/game-CfsaIq1x.js","./assets/game-CgFUHwbL.js","./assets/game-Chpek4u3.js","./assets/game-Cko1c8Yf.js","./assets/game-ClUNrLtb.js","./assets/game-Cn85qXYT.js","./assets/game-Co3NO5HL.js","./assets/game-CpUNwDPv.js","./assets/game-D-79-McI.js","./assets/game-D-VM6O-v.js","./assets/game-D0CV_905.js","./assets/game-D1CfJ25-.js","./assets/game-D1nzN5AH.js","./assets/game-D2_3iGfv.js","./assets/game-D5ZrOg0k.js","./assets/game-D6wN-ZUR.js","./assets/game-D920_qob.js","./assets/game-D9UCLBWP.js","./assets/game-DB0ribPi.js","./assets/game-DHrV9a-f.js","./assets/game-DJ4bjdly.js","./assets/game-DJd8I0Ey.js","./assets/game-DKt1MCkA.js","./assets/game-DLCsGUtx.js","./assets/game-DLavzgUp.js","./assets/game-DWniR6Rs.js","./assets/game-DXTSnQMm.js","./assets/game-D_lcZ1Fv.js","./assets/game-DbSttTFT.js","./assets/game-DgPmKR99.js","./assets/game-Dp5fdMxF.js","./assets/game-DranLi5Y.js","./assets/game-DxSW7NAk.js","./assets/game-IAjsP_4Z.js","./assets/game-IBbgJsr_.js","./assets/game-J58MOqug.js","./assets/game-JguDMiwo.js","./assets/game-L-ZPSI8k.js","./assets/game-LQTEvrUG.js","./assets/game-T1zUrpSj.js","./assets/game-VJyMZI8k.js","./assets/game-WSoLgUEm.js","./assets/game-Wko9-UPO.js","./assets/game-agUl4ebo.js","./assets/game-ai6Bd-6a.js","./assets/game-ala7wgfk.js","./assets/game-apBtduJ5.js","./assets/game-fJRtly8L.js","./assets/game-j52vRPQV.js","./assets/game-seH5xt5F.js","./assets/game-vBXMmUa6.js","./assets/game-xc3pXp8V.js","./assets/gameSkins-BBxRnUsV.js","./assets/guards-BRQZjza9.js","./assets/hud-Bvz4j6P6.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-o53R8TAZ.js","./assets/reactGame-C4oQ95sP.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-C33aV_tT.js","./assets/turns-DWTh5WW9.js","./assets/ui-bFxOEU9q.js","./assets/useCoopGame-CIDefH5j.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-KVxgyj9j.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-DoMqPm8L.css"];
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
