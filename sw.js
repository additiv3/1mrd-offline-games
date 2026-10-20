/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-72288b4';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CZofiWan.js","./assets/BackupSheet-azNuJZLI.js","./assets/BonusSheet-bd-lSqzq.js","./assets/ChallengesSheet-D6RkyWre.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-BhLQaIm9.js","./assets/StatsSheet-B5E6VSY3.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/daily-Cq7x1oTw.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-3xKVJ07T.js","./assets/game-9qH5FjGR.js","./assets/game-ANgA5NjJ.js","./assets/game-B-aiQPeQ.js","./assets/game-BH-ANhzv.js","./assets/game-BHK9qigk.js","./assets/game-BJ2JVGyP.js","./assets/game-BKC0vOr3.js","./assets/game-BNbWUUCY.js","./assets/game-BPst9vTA.js","./assets/game-BPuUHM-7.js","./assets/game-BWR6witn.js","./assets/game-Bb89x4cb.js","./assets/game-BcdMosJd.js","./assets/game-Bf9XGeEw.js","./assets/game-BgMwO5ug.js","./assets/game-BgOsjCZU.js","./assets/game-BgfMnlBB.js","./assets/game-BkjRGRXM.js","./assets/game-BlxCrMIG.js","./assets/game-Bn5KRacG.js","./assets/game-BnF0BRmz.js","./assets/game-BtQL1JAY.js","./assets/game-Bu3eOAsa.js","./assets/game-Bw20cI2S.js","./assets/game-BwlFOoTI.js","./assets/game-BzAwr7mj.js","./assets/game-C-_nYL_F.js","./assets/game-C-uvYgox.js","./assets/game-C1OYI48K.js","./assets/game-C2oexEbL.js","./assets/game-C5IHjWwm.js","./assets/game-CEtq4vE4.js","./assets/game-CI9Zrybw.js","./assets/game-CIl9Aryf.js","./assets/game-CJsT4ANm.js","./assets/game-CK1urnZa.js","./assets/game-CN3pp2O0.js","./assets/game-CVR2jd2n.js","./assets/game-Ce45j1Lw.js","./assets/game-CiVXlops.js","./assets/game-CjIDasq6.js","./assets/game-CkLP3CSZ.js","./assets/game-CkY3XpuR.js","./assets/game-Cl--Skcz.js","./assets/game-CprTj2tP.js","./assets/game-CsgItA7b.js","./assets/game-CswxNd5X.js","./assets/game-D-StPjpr.js","./assets/game-D1vZORSI.js","./assets/game-D3mNfTHT.js","./assets/game-D46Bx6T-.js","./assets/game-D8Ar1UW2.js","./assets/game-D9c0cOZA.js","./assets/game-DFAoG89q.js","./assets/game-DM0D5oUG.js","./assets/game-DMj5yOQf.js","./assets/game-DOz5Indg.js","./assets/game-DU7L9Kge.js","./assets/game-DZx680MY.js","./assets/game-DbBEufec.js","./assets/game-DbRDj9x-.js","./assets/game-DcETmmvj.js","./assets/game-DcwAQ3Y5.js","./assets/game-DeV4xlZR.js","./assets/game-Dj4_mEkd.js","./assets/game-DjNgqSfX.js","./assets/game-DmCyADnC.js","./assets/game-Dr7dBcTi.js","./assets/game-Drv9Jgl0.js","./assets/game-Dshde3sP.js","./assets/game-DvOC6Wvw.js","./assets/game-Dyl7QmGQ.js","./assets/game-Dzdc-n-6.js","./assets/game-HBENAbV_.js","./assets/game-JSLbNVVS.js","./assets/game-JVgNTTqI.js","./assets/game-LcsZ8_Z6.js","./assets/game-MbItqQpB.js","./assets/game-QwqE-a6e.js","./assets/game-RLJWenuI.js","./assets/game-ReV1oC9z.js","./assets/game-VBB-kb6k.js","./assets/game-dXJTgb5O.js","./assets/game-eZKi-RgO.js","./assets/game-nD3_ZiEW.js","./assets/game-qMIyKD8a.js","./assets/game-s9BlvlJL.js","./assets/game-syx772Md.js","./assets/game-vovRIEx3.js","./assets/game-yLbY7qdi.js","./assets/game-yjYoyzRr.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-BYWLBrfQ.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-1-o9pKzt.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-DTjkEphe.css"];
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
