/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-7d1be6d';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-BbdR_Ri7.js","./assets/BackupSheet-BytFPpBR.js","./assets/BonusSheet-CRMMQ6Tw.js","./assets/ChallengesSheet-CQXnTDZ9.js","./assets/PlayingCard-DJkh8Tjc.js","./assets/ShopSheet-DEiQNqKj.js","./assets/StatsSheet-Dm4ZfE07.js","./assets/backend-nk_Lsh-y.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-LG5kSfQa.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-0H0SXjQG.js","./assets/game-1HrsDkWt.js","./assets/game-2c_83y0q.js","./assets/game-2ilVjJiB.js","./assets/game-2mcL1gqD.js","./assets/game-7CamRnbY.js","./assets/game-8lmPWAPD.js","./assets/game-Ax75tIy4.js","./assets/game-B6EwvHIB.js","./assets/game-B8T7yypl.js","./assets/game-B8cS5I97.js","./assets/game-BBwVHLMB.js","./assets/game-BCReHSXS.js","./assets/game-BCvZYjcC.js","./assets/game-BFnc6XF9.js","./assets/game-BGFCuMP5.js","./assets/game-BGyf3MWI.js","./assets/game-BHV103fF.js","./assets/game-BJLoKWeq.js","./assets/game-BKsX1HDp.js","./assets/game-BNFIqcqv.js","./assets/game-BOlu8HFs.js","./assets/game-BQ1HRI1H.js","./assets/game-BQuwLtMN.js","./assets/game-BUOcV_Q2.js","./assets/game-BW82YM-t.js","./assets/game-BiuYsZ1c.js","./assets/game-BkIR7W2W.js","./assets/game-BkK3QNy7.js","./assets/game-BlCrWioD.js","./assets/game-BmSKM3TZ.js","./assets/game-BrIotJuR.js","./assets/game-BrNc0gqT.js","./assets/game-BtgT5wHT.js","./assets/game-BuT5UGrN.js","./assets/game-Byy89TwJ.js","./assets/game-BzjmLoRz.js","./assets/game-C-hcEgZw.js","./assets/game-C-lclF1j.js","./assets/game-C-u_lSgT.js","./assets/game-C2RQuoTq.js","./assets/game-C4ZZYlU9.js","./assets/game-C6FI0ozT.js","./assets/game-C6ysS9oj.js","./assets/game-CK5Z6JuE.js","./assets/game-COLxcM72.js","./assets/game-CTaIPKvz.js","./assets/game-CU3b47YA.js","./assets/game-CU_mjdNJ.js","./assets/game-CVGnMGPF.js","./assets/game-CeVIg7XZ.js","./assets/game-ChgYEQ01.js","./assets/game-CizfoUEb.js","./assets/game-CjRHDUn4.js","./assets/game-Ck0bXT1x.js","./assets/game-Clo0x6cB.js","./assets/game-CoBlGMmZ.js","./assets/game-CpOmu8oy.js","./assets/game-CqfzTVhD.js","./assets/game-D-0eURnA.js","./assets/game-D-fuKltB.js","./assets/game-D56iYaPX.js","./assets/game-D6JcziuT.js","./assets/game-D948tH8Y.js","./assets/game-DCtMAoia.js","./assets/game-DEOZrQZx.js","./assets/game-DGpIhjV-.js","./assets/game-DImZh_ZV.js","./assets/game-DIwTTVKC.js","./assets/game-DK-aQUh7.js","./assets/game-DKeam2hs.js","./assets/game-DO3mpint.js","./assets/game-DPRMCUum.js","./assets/game-DS3fV4tA.js","./assets/game-DUjv2G0k.js","./assets/game-DXITqQwM.js","./assets/game-DZKrtZ31.js","./assets/game-D_3A4Nng.js","./assets/game-DaKavzCY.js","./assets/game-DbPrnytY.js","./assets/game-Dcm4qE_9.js","./assets/game-DeODpIJJ.js","./assets/game-Dokg_GlC.js","./assets/game-Dpjx9ebM.js","./assets/game-Dptm_qOC.js","./assets/game-Du3rwDza.js","./assets/game-DurER12u.js","./assets/game-Duz338-5.js","./assets/game-DwQdcfJE.js","./assets/game-DycqgiY5.js","./assets/game-DzNYnXaQ.js","./assets/game-DzyB7toS.js","./assets/game-F4nXAyFz.js","./assets/game-FiaAjT21.js","./assets/game-ID2EzoL1.js","./assets/game-RQLqnQyL.js","./assets/game-VPPyPEv1.js","./assets/game-WS4zMrda.js","./assets/game-Yi1vnijI.js","./assets/game-ZBj1kcj0.js","./assets/game-bcuNmLeF.js","./assets/game-d9KzbzY2.js","./assets/game-h5vrakOt.js","./assets/game-i8rF_9vK.js","./assets/game-nipHJnyk.js","./assets/game-xMEn3mvs.js","./assets/game-zzwVqs-J.js","./assets/gameSkins-Bg38r4oh.js","./assets/guards-BRQZjza9.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-nijju1Yb.js","./assets/reactGame-dD_geVbL.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-D6vJfL2A.js","./assets/turns-eFLcAefa.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-BKQlSdlA.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-BreaYyJQ.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-LjeD3sWx.css"];
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
