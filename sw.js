/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-a35efd5';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BdmsEJ0w.js","./assets/BackupSheet-mCVel_WS.js","./assets/BonusSheet-DjYqlWck.js","./assets/ChallengesSheet-BMhyfzPz.js","./assets/PlayingCard-ChnvdrYv.js","./assets/ShopSheet-QCoB8PTQ.js","./assets/StatsSheet-u_2RVhWg.js","./assets/backend-_8kO7kAh.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-Dgzx4OPN.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-0utfcBZN.js","./assets/game-1YrgPjRy.js","./assets/game-6a5KPkFr.js","./assets/game-97xemDbL.js","./assets/game-9Cc2845E.js","./assets/game-AFMoBPtI.js","./assets/game-B-b2o-E4.js","./assets/game-B0EuLyvs.js","./assets/game-B1Yg5sNV.js","./assets/game-B2LfRVMe.js","./assets/game-B33gdz3m.js","./assets/game-B4MAxtz6.js","./assets/game-B54r5nVz.js","./assets/game-B5L_bJiR.js","./assets/game-B8BxAZPe.js","./assets/game-B8ehn0YG.js","./assets/game-BAHE3kDi.js","./assets/game-BASDzIuP.js","./assets/game-BGPNJXr9.js","./assets/game-BGw_EQZ4.js","./assets/game-BJwPvxlU.js","./assets/game-BKwLTlGg.js","./assets/game-BPw8oREo.js","./assets/game-BQYXZ7WE.js","./assets/game-BR1H2peh.js","./assets/game-BTJswTBV.js","./assets/game-BUFHpBEI.js","./assets/game-BVEsUHlq.js","./assets/game-BWFPn1L6.js","./assets/game-BX7l9Owy.js","./assets/game-Bgjr4a0k.js","./assets/game-Bhv-NQiL.js","./assets/game-BkWJJ8-V.js","./assets/game-BoNNTsFO.js","./assets/game-BpdGIXZQ.js","./assets/game-Bpo3ll9d.js","./assets/game-BrBaGHkd.js","./assets/game-BsWvNBkR.js","./assets/game-BtY5OI5t.js","./assets/game-BuCkHvlx.js","./assets/game-Bx3vxj9T.js","./assets/game-C-Xkoj2z.js","./assets/game-C-ag0ZjE.js","./assets/game-C0Lkv0I3.js","./assets/game-C0PtClbm.js","./assets/game-C0kaZGY9.js","./assets/game-C3BE4JLP.js","./assets/game-C3rbc51p.js","./assets/game-C3uk88jI.js","./assets/game-C3xCExFI.js","./assets/game-C5J-lH_g.js","./assets/game-CBryFh7p.js","./assets/game-CF5I5gr3.js","./assets/game-CIQkgNbA.js","./assets/game-CKCa3Lv6.js","./assets/game-CKxkeLb-.js","./assets/game-CM5wKTfZ.js","./assets/game-COu7ld4-.js","./assets/game-CQJHPAXO.js","./assets/game-CTgE-iyI.js","./assets/game-CU3jm9Vv.js","./assets/game-CYCdj_Lu.js","./assets/game-Cc47Nw6M.js","./assets/game-CeHTjW3i.js","./assets/game-CflMWa8e.js","./assets/game-ChU7pbKC.js","./assets/game-CjVbjx0S.js","./assets/game-ClzbaCZq.js","./assets/game-CoLMU9Qi.js","./assets/game-Cof-flJp.js","./assets/game-Cr6Ji7ZU.js","./assets/game-Cu7T_C0-.js","./assets/game-D1GLnB5w.js","./assets/game-D37Ey1zT.js","./assets/game-D3QQUp7q.js","./assets/game-D8ZXeiiw.js","./assets/game-D8sznz1G.js","./assets/game-DB6w4aaS.js","./assets/game-DKNBQlBG.js","./assets/game-DMv9lP6g.js","./assets/game-DNFzyO4C.js","./assets/game-DNJfNxf5.js","./assets/game-DPHoNseG.js","./assets/game-DSiV4ta8.js","./assets/game-DX9rQNve.js","./assets/game-DYl5HlSQ.js","./assets/game-Darixefx.js","./assets/game-DdhHUivm.js","./assets/game-Df7V9dgt.js","./assets/game-Dg3qyKDa.js","./assets/game-Dgh9dYal.js","./assets/game-DgtCkuMH.js","./assets/game-DiZ_wxoz.js","./assets/game-Dj3QoETg.js","./assets/game-DjKsFDQj.js","./assets/game-Dk_Ch4BT.js","./assets/game-DpepMgKp.js","./assets/game-Drxx8RQG.js","./assets/game-Ds7UfLwi.js","./assets/game-DxwQuUbV.js","./assets/game-Dz6057gO.js","./assets/game-GLfa1PQv.js","./assets/game-GvB-0CVT.js","./assets/game-H7Y8XDeD.js","./assets/game-HSp5cD8A.js","./assets/game-IqPTYIIt.js","./assets/game-Jo6KLcWG.js","./assets/game-LnXmcZyf.js","./assets/game-LwI3z-1z.js","./assets/game-Nrth8_Zg.js","./assets/game-QrHTcDiC.js","./assets/game-j3m773g6.js","./assets/game-jOQCFUIs.js","./assets/game-nJBiELW8.js","./assets/game-ovPwaSS5.js","./assets/game-y_vJotdS.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-JvpY_Aoh.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-C6pCBf9N.js","./assets/reactGame-POXIi3Y1.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-BdFmf3nf.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-1w0mDOhC.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-CETFl0HY.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-H8_22Zo9.css"];
const PREFIX = 'mrd-offline-games-';   // additiv3.github.io teilt sich den Cache mit anderen Apps → nur eigene löschen

/* Vorab laden in kleinen Päckchen (über 250 Dateien auf einmal überfordern schwaches Netz); was scheitert, wird einmal
   wiederholt. Fehlt danach noch etwas, holt cacheFirst() es beim ersten Öffnen des Spiels nach. */
function precache(cache, urls) {
  const failed = [];
  const one = (u) => cache.add(new Request(u, { cache: 'reload' })).catch(() => { failed.push(u); });
  let chain = Promise.resolve();
  for (let i = 0; i < urls.length; i += 12) {
    const part = urls.slice(i, i + 12);
    chain = chain.then(() => Promise.all(part.map(one)));
  }
  return chain.then(() => failed);
}

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => precache(c, PRECACHE).then((failed) => (failed.length ? precache(c, failed) : failed)))
    .then(() => self.skipWaiting()));
});

/* Alte Vorräte NICHT sofort löschen: Eine noch offene Seite der alten Version lädt ihre Spiele (Dateien mit altem Hash)
   sonst ins Leere – „Spiel konnte nicht geladen werden“. Aufgeräumt wird beim nächsten Seitenaufruf (siehe fetch). */
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

function dropOldCaches() {
  // Wird gerade eine neuere Version eingerichtet, gehört ein „fremder“ Vorrat ihr – dann nichts anfassen.
  if (self.registration.installing || self.registration.waiting) return Promise.resolve();
  return caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
    .catch(() => {});
}

/* Netz zuerst (höchstens 4 s warten, dann Speicher): eine neue Version ist sofort da,
   im Funkloch startet die App trotzdem aus dem Speicher.
   Aus dem Speicher zählt zuerst der Vorrat DIESER Version (sonst käme eine alte Startseite, deren Dateien gleich gelöscht
   werden); nur wenn dort nichts liegt, irgendein älterer – dann bleibt der alte Vorrat aber stehen (`keep`). */
function networkFirst(req, isPage) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (res, keep) => {
      if (done) return;
      done = true;
      if (isPage && !keep) dropOldCaches();
      resolve(res);
    };
    const fromCache = () => caches.open(CACHE)
      .then((c) => c.match(req, { ignoreSearch: true }).then((hit) => hit || c.match('./index.html')))
      .then((own) => (own ? { res: own, keep: false } : caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || caches.match('./index.html'))
        .then((old) => ({ res: old, keep: true }))));
    const timer = setTimeout(() => {
      fromCache().then((hit) => { if (hit.res) finish(hit.res, hit.keep); });
    }, 4000);
    // Neue Anfrage nur aus der URL: Seitenaufrufe (mode 'navigate') lassen sich in älterem Safari nicht mit Optionen kopieren
    fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
      clearTimeout(timer);
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
      finish(res, !(res && res.ok));
    }).catch(() => {
      clearTimeout(timer);
      fromCache().then((hit) => finish(hit.res || Response.error(), hit.keep));
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
  // Seitenaufruf = die App startet frisch mit der neuen Version → danach dürfen alte Vorräte weg (siehe networkFirst).
  e.respondWith(networkFirst(req, req.mode === 'navigate'));
});
