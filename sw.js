/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-77a7296';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-DNFtoiaO.js","./assets/BackupSheet-Dz_ZIvPf.js","./assets/BonusSheet-VZmT0I_S.js","./assets/ChallengesSheet-DoOSomsz.js","./assets/PlayingCard-ChnvdrYv.js","./assets/ShopSheet-Dg6FiN7c.js","./assets/StatsSheet-CfX1aEf3.js","./assets/backend-ChdZZY31.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-B5nWSGxA.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-7Ks_X2vO.js","./assets/game-7tk6NaU_.js","./assets/game-7wbS5vNx.js","./assets/game-8VyWG5Zp.js","./assets/game-BBSSclPX.js","./assets/game-BE1pUgtS.js","./assets/game-BEx5GTYI.js","./assets/game-BGQ4SL6f.js","./assets/game-BGrEpG6V.js","./assets/game-BLN9IK47.js","./assets/game-BMutm4o8.js","./assets/game-BOfYx5Ds.js","./assets/game-BQ8Q5vsg.js","./assets/game-BQv7DEvo.js","./assets/game-BU3waZ09.js","./assets/game-BUoMfLkc.js","./assets/game-BW8GMIqg.js","./assets/game-BZ5NEb0n.js","./assets/game-Bc9qbcrC.js","./assets/game-Bck_5MZZ.js","./assets/game-BdVS69Lt.js","./assets/game-BfWRb1lF.js","./assets/game-BhTdpHbe.js","./assets/game-BkOBZxLT.js","./assets/game-BmmyJ5U7.js","./assets/game-BoI48CF_.js","./assets/game-BtBZl_WR.js","./assets/game-Btn5go_P.js","./assets/game-Bu2V7klg.js","./assets/game-Bu6pSBt0.js","./assets/game-BuqYPR8A.js","./assets/game-Buzivijf.js","./assets/game-By7XJIJq.js","./assets/game-BzH46Kmy.js","./assets/game-C-BJaAkG.js","./assets/game-C-NCFRSR.js","./assets/game-C2-dQY3_.js","./assets/game-C6G7sVOP.js","./assets/game-C7UqimS3.js","./assets/game-C7vcUER5.js","./assets/game-C8Nkeuct.js","./assets/game-CDeeshO0.js","./assets/game-CIh0Jnze.js","./assets/game-CKr62Ow7.js","./assets/game-CL6cq1JM.js","./assets/game-CT0w-J-6.js","./assets/game-CVNJFisp.js","./assets/game-CX3_nzec.js","./assets/game-CanzirFi.js","./assets/game-Ch9Xf2CI.js","./assets/game-ChcGEoGi.js","./assets/game-ChxSIP3G.js","./assets/game-ClKvbTMz.js","./assets/game-ClsS2kJ-.js","./assets/game-Cm3VVagu.js","./assets/game-CqsZD7Ea.js","./assets/game-CtQbrTYu.js","./assets/game-Cw9irhYG.js","./assets/game-CwLSRSno.js","./assets/game-CxukXnsj.js","./assets/game-CzyLlG11.js","./assets/game-D49Y7328.js","./assets/game-D6AHbh3L.js","./assets/game-D6eRMjWe.js","./assets/game-D7qpC9Vs.js","./assets/game-D9BbzLOD.js","./assets/game-DBpuC1zz.js","./assets/game-DJu4vHL8.js","./assets/game-DKCr0tIx.js","./assets/game-DKwe7C8Z.js","./assets/game-DMbIL0c0.js","./assets/game-DNLHQCxl.js","./assets/game-DPOAovdR.js","./assets/game-DQ1MGVN5.js","./assets/game-DRzNe6H2.js","./assets/game-DUEKcBnk.js","./assets/game-DUgLNbq7.js","./assets/game-DVNg0Zck.js","./assets/game-DW_Dw0fA.js","./assets/game-DYQ-QCI4.js","./assets/game-DYtqTXOG.js","./assets/game-DaDIGTbN.js","./assets/game-Da_AfhQL.js","./assets/game-DcDNnYh5.js","./assets/game-De7c5CTq.js","./assets/game-De8TWqg3.js","./assets/game-Dj5URhxY.js","./assets/game-Dk581ogy.js","./assets/game-Dl3g1d9U.js","./assets/game-Dm5KxWZ4.js","./assets/game-DoGCGDLq.js","./assets/game-DrI43v3T.js","./assets/game-DxrVBwxF.js","./assets/game-KymjdIsJ.js","./assets/game-LjYdPAwa.js","./assets/game-Nv6lR_tJ.js","./assets/game-Za7fJr2H.js","./assets/game-axIwkUsp.js","./assets/game-b3JQtFb-.js","./assets/game-bU6QDVmN.js","./assets/game-bXfvNLG1.js","./assets/game-btn8CyqI.js","./assets/game-dfW8h11T.js","./assets/game-elnZEsU3.js","./assets/game-gj14Ag5I.js","./assets/game-iSHIId7X.js","./assets/game-isq-QQxw.js","./assets/game-lduZuOTN.js","./assets/game-p4jqIu5Y.js","./assets/game-qkMoX3gv.js","./assets/game-rrDd_1tL.js","./assets/game-rsPjE79s.js","./assets/game-sAtXyks_.js","./assets/game-tlK4aqpv.js","./assets/game-z0miEeaU.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-DSg6aKI0.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-Bk_4B4Wp.js","./assets/reactGame-kEfBlQ_4.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-DK7bHO-P.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-D5tl8Soz.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-CeIpui4q.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-BnMNhU3M.css"];
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
