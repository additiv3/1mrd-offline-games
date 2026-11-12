/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-99563a4';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-54cJVQd0.js","./assets/BackupSheet-xdMTK6y5.js","./assets/BonusSheet-6Aw3oamb.js","./assets/ChallengesSheet-BOGq1ZmK.js","./assets/PlayingCard-CLzB3IHa.js","./assets/ShopSheet-BH4T6ARA.js","./assets/StatsSheet-DnddLjRf.js","./assets/backend-CVuQha5j.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-Bsy8MTYJ.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--J_xXlcg.js","./assets/game-0DhKallE.js","./assets/game-4odtHGQI.js","./assets/game-6-iQR04i.js","./assets/game-6h9qxC4t.js","./assets/game-B1D-nZPQ.js","./assets/game-B2ObQOlf.js","./assets/game-B2QUhnpw.js","./assets/game-B3QZXkmI.js","./assets/game-B3_d0vWU.js","./assets/game-B4grMZQx.js","./assets/game-B5yp5SP6.js","./assets/game-BEVBISzI.js","./assets/game-BHW1bTmD.js","./assets/game-BJFGo6Wo.js","./assets/game-BKBLV6E7.js","./assets/game-BLAz2Sgr.js","./assets/game-BM6DJdHP.js","./assets/game-BNur1p2C.js","./assets/game-BQAkvXyI.js","./assets/game-BWhLeJ1K.js","./assets/game-B_9u0mnu.js","./assets/game-BbKksehM.js","./assets/game-BfwB0v25.js","./assets/game-Bg03_FXv.js","./assets/game-BiCbrHmO.js","./assets/game-Bjq2wlni.js","./assets/game-Born_eMw.js","./assets/game-Bqz3Ie1q.js","./assets/game-BsZq3-bq.js","./assets/game-BtXLou-C.js","./assets/game-BvzyZKgh.js","./assets/game-C2YSbk80.js","./assets/game-C2qgJz1Z.js","./assets/game-C3_fZezd.js","./assets/game-C4YeO86A.js","./assets/game-C5u8Mnoq.js","./assets/game-C8uu44w5.js","./assets/game-CBfDG6eW.js","./assets/game-CD7FjSeC.js","./assets/game-CDD9a_hc.js","./assets/game-CEDulW1H.js","./assets/game-CGApEAZ6.js","./assets/game-CGJbdF28.js","./assets/game-CGcI4S9n.js","./assets/game-CLnCIn2N.js","./assets/game-CRxxoY6W.js","./assets/game-CZ34E6_0.js","./assets/game-C_JpgzUP.js","./assets/game-C_j0yjcT.js","./assets/game-Cdfs0OHp.js","./assets/game-Cem3Jaqu.js","./assets/game-CfptnzRJ.js","./assets/game-Ch1EQkw6.js","./assets/game-Cjm1f4-O.js","./assets/game-CjrxOeF9.js","./assets/game-ClMBFR_5.js","./assets/game-CnZ1y4nK.js","./assets/game-CqMLUztb.js","./assets/game-Crv_XEOl.js","./assets/game-CskL5GPB.js","./assets/game-CvIOBlLD.js","./assets/game-Cvwo1h9Y.js","./assets/game-CwoM6o5I.js","./assets/game-D-EPJdXH.js","./assets/game-D22NW456.js","./assets/game-D6mv5fNT.js","./assets/game-DAIMzNwy.js","./assets/game-DGrDa-Iy.js","./assets/game-DHwr-e-e.js","./assets/game-DN2bYfHS.js","./assets/game-DT4DpD40.js","./assets/game-DWRWeqek.js","./assets/game-DXQijhRe.js","./assets/game-DXlTw5JP.js","./assets/game-DeAmxZZO.js","./assets/game-DgYvQ-Jr.js","./assets/game-DjT4oQ5z.js","./assets/game-Dkc3gw0e.js","./assets/game-Dlm7v41X.js","./assets/game-Dm6hzByv.js","./assets/game-Do7BxC0D.js","./assets/game-Dud3dGPN.js","./assets/game-DzFfjhsu.js","./assets/game-DzSjeBQe.js","./assets/game-E-w8KICc.js","./assets/game-K8yESKiZ.js","./assets/game-R555mzMz.js","./assets/game-R5ushAON.js","./assets/game-U0rkeezB.js","./assets/game-XADF0z_I.js","./assets/game-Y_a1Y4q4.js","./assets/game-_axIqrKm.js","./assets/game-b50t4Pdu.js","./assets/game-h1P85b6X.js","./assets/game-iDoEVsZw.js","./assets/game-je8snjlI.js","./assets/game-jfsCa4kp.js","./assets/game-ky-g2Q0w.js","./assets/game-ncxQr6uk.js","./assets/game-pTVoJ7iX.js","./assets/game-q1NmsD5u.js","./assets/game-tkKoPR5X.js","./assets/game-u7K_fiPp.js","./assets/game-valt01xO.js","./assets/game-xsdJ8XGU.js","./assets/game-zMmTdSsc.js","./assets/gameSkins-BBxRnUsV.js","./assets/guards-BRQZjza9.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-DOq4MEUQ.js","./assets/reactGame-CW_smM-C.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-C33aV_tT.js","./assets/turns-COQCo-L-.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-Dw9mk_e2.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-bp7yTUAd.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-C9RC8DEQ.css"];
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
