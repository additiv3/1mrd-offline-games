/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-2e0063e';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-DuP8MAwx.js","./assets/BackupSheet-CH9EHFUa.js","./assets/BonusSheet-BeqQMg9i.js","./assets/ChallengesSheet-Cdpx2MWm.js","./assets/PlayingCard-DM-ffpHc.js","./assets/ShopSheet-BHTv4Xfs.js","./assets/StatsSheet-pPSviTk4.js","./assets/backend-DRR2akJu.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-D9shy1Ks.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-6A0cRi7s.js","./assets/game-7x6OKxU5.js","./assets/game-8eJca5GE.js","./assets/game-9xzfqJQI.js","./assets/game-B1R6BnWh.js","./assets/game-B5WuHpLu.js","./assets/game-B9Y7sMr-.js","./assets/game-BCgphHA2.js","./assets/game-BF1zeGpC.js","./assets/game-BGErcJ_W.js","./assets/game-BHP-X23g.js","./assets/game-BHcvksrx.js","./assets/game-BJbFc15h.js","./assets/game-BKZicajd.js","./assets/game-BNZS8SzH.js","./assets/game-BO6NElEd.js","./assets/game-BRxRGEm7.js","./assets/game-BTgfkaxB.js","./assets/game-BUNatctg.js","./assets/game-BV3eoOLT.js","./assets/game-BYtbQj55.js","./assets/game-BZd4PqxC.js","./assets/game-BZg9GXsu.js","./assets/game-B_DX3Pi6.js","./assets/game-BcB9Yats.js","./assets/game-BdWLIFf8.js","./assets/game-Bg6Plw2R.js","./assets/game-BgpyuzYT.js","./assets/game-BiNLQUCZ.js","./assets/game-Bj0Goqjd.js","./assets/game-BjBTIo2A.js","./assets/game-BjeMBqKZ.js","./assets/game-BnUxivTR.js","./assets/game-Bp_hbIq2.js","./assets/game-Bxh5YDHx.js","./assets/game-By9tp3v_.js","./assets/game-C0Avxami.js","./assets/game-C14wppdO.js","./assets/game-C5IBxJhw.js","./assets/game-C6gvGqnt.js","./assets/game-CA8uiKbT.js","./assets/game-CEut8uFe.js","./assets/game-CGv8pQAt.js","./assets/game-CHf-BbXZ.js","./assets/game-CP0o56vv.js","./assets/game-CQxCzUJJ.js","./assets/game-CRVDjCx5.js","./assets/game-CTSrNVBR.js","./assets/game-CXOeH6Xo.js","./assets/game-CY7bHwZB.js","./assets/game-C_2dBgpy.js","./assets/game-CamqAkCt.js","./assets/game-Cc6L0C_T.js","./assets/game-CgMltnTn.js","./assets/game-Ck0qHF3Z.js","./assets/game-CkmPponC.js","./assets/game-Cl-f0nU9.js","./assets/game-CmCRkEtf.js","./assets/game-CnCZJrjR.js","./assets/game-CrJ-cXg2.js","./assets/game-CxbaEe4G.js","./assets/game-CzneCf6h.js","./assets/game-Cztp1PlP.js","./assets/game-D3-U52Tk.js","./assets/game-D3ANplTd.js","./assets/game-D3rEUoSa.js","./assets/game-D5z_Pk5P.js","./assets/game-D8WR-I1G.js","./assets/game-D8tcPi8p.js","./assets/game-D9jRLYYO.js","./assets/game-DAkwdBBX.js","./assets/game-DE2ZdC-l.js","./assets/game-DEYz3Pyh.js","./assets/game-DHrw0PQh.js","./assets/game-DKrKHqD9.js","./assets/game-DMLSCaiD.js","./assets/game-DMSXSaGN.js","./assets/game-DMld-URz.js","./assets/game-DN0ehS-i.js","./assets/game-DNMZ0ZzK.js","./assets/game-DOeBdHP4.js","./assets/game-DXi5W3NV.js","./assets/game-DYNOBYbi.js","./assets/game-DeOxrPq1.js","./assets/game-DfWuQXyR.js","./assets/game-DhB8zbnL.js","./assets/game-DnxzTqdj.js","./assets/game-Dp4ApfXT.js","./assets/game-DpZHy8sX.js","./assets/game-DpxFzuqJ.js","./assets/game-Dr7OCh_H.js","./assets/game-Dsmo_6Ew.js","./assets/game-DuMWFFUr.js","./assets/game-DvjSTtIv.js","./assets/game-F3qaNXWX.js","./assets/game-FMTTgZZw.js","./assets/game-GUOMfBDj.js","./assets/game-GqnWzE5G.js","./assets/game-HPXfCgt1.js","./assets/game-Jcx1BjYE.js","./assets/game-M5tk0zE5.js","./assets/game-N2V99VWI.js","./assets/game-QDRCndTC.js","./assets/game-XZOszXXx.js","./assets/game-Y_cyQGa5.js","./assets/game-ZyiLV7_e.js","./assets/game-d2g7JDGV.js","./assets/game-djEkDMBL.js","./assets/game-g0T0cMg6.js","./assets/game-knUffZu1.js","./assets/game-nOQnz-Mt.js","./assets/game-qIiIpaER.js","./assets/game-qVuYO_X_.js","./assets/game-uvyAVQWu.js","./assets/game-vJtDymKW.js","./assets/game-zRnmzfLY.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-JvpY_Aoh.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-HmJ2kiZf.js","./assets/reactGame-Bngiho-Z.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-BQuJLd6Q.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-Ci3BKwMw.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-1YI2ijEb.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-sVs0YTDb.css"];
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
