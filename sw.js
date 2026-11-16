/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-0453df1';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-EuHkVEhP.js","./assets/BackupSheet-DMW95zBH.js","./assets/BonusSheet-v3nq6myG.js","./assets/ChallengesSheet-DavrTbob.js","./assets/PlayingCard-ChnvdrYv.js","./assets/ShopSheet-DsQ2KKdO.js","./assets/StatsSheet-wf1Ddvc_.js","./assets/backend-DGsl07mg.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-ByVOmtMt.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-2YQPuoHM.js","./assets/game-5B0c6aAK.js","./assets/game-6_4oauw3.js","./assets/game-6fZiHc9f.js","./assets/game-7HpwHJ22.js","./assets/game-7XX-dyb1.js","./assets/game-8l1-e0Li.js","./assets/game-8vIaLlto.js","./assets/game-B-uOXGy_.js","./assets/game-B3IwK9ut.js","./assets/game-B5d7JyLq.js","./assets/game-B7brlFJD.js","./assets/game-B7xkwQ1r.js","./assets/game-B9vUJ2CV.js","./assets/game-BABxn3XL.js","./assets/game-BGtSkYig.js","./assets/game-BJxCZz2B.js","./assets/game-BLmcBacg.js","./assets/game-BOv6lUdS.js","./assets/game-BPsnBXfJ.js","./assets/game-BTRSNqTd.js","./assets/game-BTlf87Vu.js","./assets/game-BXtpzdDn.js","./assets/game-BYCkyqhB.js","./assets/game-BanoEICH.js","./assets/game-BarbEV-Z.js","./assets/game-BeqK72yy.js","./assets/game-BgHsXslr.js","./assets/game-Bhg_Owle.js","./assets/game-BustR6O4.js","./assets/game-BvRj0OOE.js","./assets/game-BvfDjMZl.js","./assets/game-BwQuCt1P.js","./assets/game-C-ChdLoR.js","./assets/game-C3DryxhW.js","./assets/game-C7E9fsqA.js","./assets/game-C8JGANZB.js","./assets/game-C9maFeG9.js","./assets/game-CCnc87uh.js","./assets/game-CECKgoss.js","./assets/game-CEEAvYfd.js","./assets/game-CGvg3QFk.js","./assets/game-CI4SkDzs.js","./assets/game-CIZYIS7o.js","./assets/game-CLwIEtyV.js","./assets/game-CMa5NGi-.js","./assets/game-CN9F5DX_.js","./assets/game-CPbqHpwM.js","./assets/game-CQD_3PmM.js","./assets/game-CQM1Hpo_.js","./assets/game-CQpxtfJY.js","./assets/game-CSFdYNpJ.js","./assets/game-CSNY-gim.js","./assets/game-CWnvbKJr.js","./assets/game-CXVRWC1_.js","./assets/game-CZL3F60Y.js","./assets/game-CbnJsXXX.js","./assets/game-CnbVZwKy.js","./assets/game-CrQbLweE.js","./assets/game-Cs43fFjv.js","./assets/game-CwvLoUwZ.js","./assets/game-CyZzbrJS.js","./assets/game-CyuCDKDN.js","./assets/game-D8JjFbqe.js","./assets/game-DAm2sK4R.js","./assets/game-DBmynhhO.js","./assets/game-DCfLH8Z6.js","./assets/game-DCn_VA__.js","./assets/game-DD-UdprU.js","./assets/game-DFERS6P5.js","./assets/game-DFvaRQUN.js","./assets/game-DIwoVPJZ.js","./assets/game-DKJ-ngV5.js","./assets/game-DOONVZ7J.js","./assets/game-DRRylK-2.js","./assets/game-DSyXXI_z.js","./assets/game-DTNnlL3m.js","./assets/game-DTc960Gz.js","./assets/game-DU0njXgS.js","./assets/game-DUF6R8e4.js","./assets/game-DWLS0WtW.js","./assets/game-DXRendmg.js","./assets/game-DZ3gMtSE.js","./assets/game-Dbpscbfz.js","./assets/game-DeSZUabD.js","./assets/game-DeUGgdX8.js","./assets/game-DeVbDFyE.js","./assets/game-DhC9P0Uf.js","./assets/game-DkqhNwpy.js","./assets/game-DsIXS3pS.js","./assets/game-DxAWDinn.js","./assets/game-DxDWA1RR.js","./assets/game-DzO-Sk7J.js","./assets/game-NW1FxMzk.js","./assets/game-UbuIGqBQ.js","./assets/game-YLleQW7g.js","./assets/game-Yc2Yv5xJ.js","./assets/game-ZvnMVnOf.js","./assets/game-_Da6_Pub.js","./assets/game-b4qB4xOT.js","./assets/game-bAhRRuAR.js","./assets/game-bMnMbD-k.js","./assets/game-e8xS8Ai1.js","./assets/game-gD2yxsZX.js","./assets/game-gLLYUxbT.js","./assets/game-hX6qVYYG.js","./assets/game-kEFduGIN.js","./assets/game-o8tfAJRC.js","./assets/game-tL8VNg8W.js","./assets/game-xDoe5JjJ.js","./assets/game-xfNKUiRU.js","./assets/game-zT73fol4.js","./assets/gameSkins--gg3rACr.js","./assets/guards-BRQZjza9.js","./assets/guides-BFHaZoP-.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-CcCgElZX.js","./assets/reactGame-BHzYLEtP.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-DugudpfL.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-C73bwMjd.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-DpzLZu8H.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-CU_PKIaN.css"];
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
