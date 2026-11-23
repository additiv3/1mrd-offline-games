/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-8ada237';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BQYZKms8.js","./assets/BackupSheet-BdPC7WFI.js","./assets/BonusSheet-DjsqPrFw.js","./assets/ChallengesSheet-DCk-C0m3.js","./assets/PlayingCard-DM-ffpHc.js","./assets/ShopSheet-B0k95Xgo.js","./assets/StatsSheet-Odgwh5zh.js","./assets/backend-DO7t0umN.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-XFWWJhsu.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-0fM0GG33.js","./assets/game-1xiaBmcn.js","./assets/game-2TH55QSs.js","./assets/game-3Qh-a5lv.js","./assets/game-6JTKZ3VN.js","./assets/game-6oWTsCHm.js","./assets/game-7Dg5KOzK.js","./assets/game-B0tVNJvz.js","./assets/game-B2OwEuIl.js","./assets/game-B2RYafKs.js","./assets/game-B7FlWkwI.js","./assets/game-B8sV-pdh.js","./assets/game-BBLDeM9b.js","./assets/game-BEWXUg3u.js","./assets/game-BF8t7-AB.js","./assets/game-BHl3B4d4.js","./assets/game-BKfalQbr.js","./assets/game-BQ0fOZcJ.js","./assets/game-BV4bcDqU.js","./assets/game-BcfwC-uV.js","./assets/game-BctGyxJ9.js","./assets/game-BcuxSWtU.js","./assets/game-BdfgzCxU.js","./assets/game-BdhUnk7u.js","./assets/game-BdwX3-p-.js","./assets/game-BhBcCbA-.js","./assets/game-BjyHXQMm.js","./assets/game-BrroQu74.js","./assets/game-Bto1Gqlh.js","./assets/game-ByCAvTxF.js","./assets/game-BydBYul6.js","./assets/game-ByhNpx0A.js","./assets/game-C0fAI797.js","./assets/game-C1tH8ZCq.js","./assets/game-C4QWxNrk.js","./assets/game-C4pzLdWi.js","./assets/game-C4v_iUNg.js","./assets/game-CC6NFwcJ.js","./assets/game-CCM3tn_R.js","./assets/game-CELxwidA.js","./assets/game-CFatifTf.js","./assets/game-CIUPmlyR.js","./assets/game-CNJHjtCd.js","./assets/game-CPjWf7EX.js","./assets/game-CQxNCgo6.js","./assets/game-CR6-YmCy.js","./assets/game-CSqw1Vhk.js","./assets/game-CV8jJf0x.js","./assets/game-CZnblyWA.js","./assets/game-CaYPNkMj.js","./assets/game-CbvqaCaj.js","./assets/game-CdBeTzAm.js","./assets/game-Cf0OgmkC.js","./assets/game-Cf3vEXOY.js","./assets/game-CfuDIdz2.js","./assets/game-CgOuGTKj.js","./assets/game-Cj3pUXs9.js","./assets/game-CjdWJP7s.js","./assets/game-CksAPttS.js","./assets/game-CmLYx1yp.js","./assets/game-CnDACfkG.js","./assets/game-Cp2AvdJL.js","./assets/game-Cq4H1oV7.js","./assets/game-CrJvC5TE.js","./assets/game-CrjDNfVy.js","./assets/game-Crl8a9FK.js","./assets/game-CrnO6dVo.js","./assets/game-CsjfaPIF.js","./assets/game-Cu714bDf.js","./assets/game-Cuj7EOUr.js","./assets/game-CyQqMx8O.js","./assets/game-CyVuNuuh.js","./assets/game-D4rThYmt.js","./assets/game-D8qnYxTg.js","./assets/game-DB30KA0A.js","./assets/game-DB5wqH-g.js","./assets/game-DHkRdjCA.js","./assets/game-DI9oINEN.js","./assets/game-DICIfTxL.js","./assets/game-DN8JbcL_.js","./assets/game-DNjpw_je.js","./assets/game-DSxnC5rf.js","./assets/game-DZ4ih9qU.js","./assets/game-DfANrk17.js","./assets/game-DfuZslG4.js","./assets/game-DhKnn9xt.js","./assets/game-DhUTKluj.js","./assets/game-Dm5Nyq6j.js","./assets/game-DmmDjBsN.js","./assets/game-DpAUIUQF.js","./assets/game-DpUN4h1n.js","./assets/game-Dq-Qoyj1.js","./assets/game-Dr8TqYGc.js","./assets/game-Drp7KsEf.js","./assets/game-DscOr77j.js","./assets/game-DsteDyhD.js","./assets/game-DuPtfLVc.js","./assets/game-DxPMMfTF.js","./assets/game-GhoaH0vG.js","./assets/game-GsYNgLn4.js","./assets/game-K1dLAt0r.js","./assets/game-KYiKIEBm.js","./assets/game-M3R5gcOK.js","./assets/game-SOVu53In.js","./assets/game-Te9THAa9.js","./assets/game-VwJy98sd.js","./assets/game-XaDVmZ4G.js","./assets/game-XfUuVQyY.js","./assets/game-_lp0xAeG.js","./assets/game-a6Ka8xE_.js","./assets/game-aM7w3fPo.js","./assets/game-cRvrO7sB.js","./assets/game-eByHoucB.js","./assets/game-fa-5SnSt.js","./assets/game-gKBq-NTK.js","./assets/game-gTnkxwD5.js","./assets/game-hMp2br2l.js","./assets/game-jboVXd5s.js","./assets/game-n_ONggo3.js","./assets/game-qzavO_B4.js","./assets/game-tGFFpgLH.js","./assets/game-tl6K0h9m.js","./assets/game-wF59qpah.js","./assets/game-xCusuq78.js","./assets/game-zygIwd4R.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-CVuWvl5q.js","./assets/hud-DEzVG6Zm.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-CWDOTOPO.js","./assets/reactGame-B6sloXe8.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-CZLPjDth.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-BdncHgd2.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-Drl4EEm8.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-BB-jXnlG.css"];
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
