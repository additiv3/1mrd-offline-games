/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-0a6e7cf';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-Br-rhSFR.js","./assets/BackupSheet-DXcOphD5.js","./assets/BonusSheet-jsTWfrqZ.js","./assets/ChallengesSheet-4bDPw-a8.js","./assets/PlayingCard-C6gkm72E.js","./assets/ShopSheet-YIXPZCUf.js","./assets/StatsSheet-BQNBsC0b.js","./assets/backend--Z_jb1xx.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-Jx7BULH3.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-0BViaHJq.js","./assets/game-2XPBrbUm.js","./assets/game-4T3XH1Ov.js","./assets/game-4ju9COkB.js","./assets/game-5OIwDHkb.js","./assets/game-8BcGrU_D.js","./assets/game-8ph-0eGc.js","./assets/game-9u-DQ5VC.js","./assets/game-A8jxeqds.js","./assets/game-AYa7CTtT.js","./assets/game-B7vrs1n0.js","./assets/game-BD4QJvZk.js","./assets/game-BHEnxsd-.js","./assets/game-BHGispHL.js","./assets/game-BI18Zl7B.js","./assets/game-BRhdR50G.js","./assets/game-BTXkK0ve.js","./assets/game-BUJhtzSI.js","./assets/game-BUQnNpkU.js","./assets/game-BXjkPrWv.js","./assets/game-BXniTCXE.js","./assets/game-BXqRSSa2.js","./assets/game-BXxUOWEE.js","./assets/game-BZdguO_i.js","./assets/game-BZfTTqXo.js","./assets/game-Bb9eyDsL.js","./assets/game-BeUI6SAo.js","./assets/game-BgmSdnKZ.js","./assets/game-Bk9Sm7ED.js","./assets/game-Bmo3I4YI.js","./assets/game-BnwVj9Jh.js","./assets/game-Bp-nEKyq.js","./assets/game-Br8Ah6Sl.js","./assets/game-BsIRoh2w.js","./assets/game-Btopf5Ex.js","./assets/game-BwAePvXe.js","./assets/game-Byv4dIGG.js","./assets/game-C2tU0Mss.js","./assets/game-C3D3unNG.js","./assets/game-C4lGNaz-.js","./assets/game-C5FLvN0z.js","./assets/game-CA4RopU-.js","./assets/game-CBA6dcCj.js","./assets/game-CBYxdbg9.js","./assets/game-CDbexIvm.js","./assets/game-CEXL1nMS.js","./assets/game-CFAE4QVp.js","./assets/game-CFbtdRCg.js","./assets/game-CHVrlXMi.js","./assets/game-CNfAsP6y.js","./assets/game-CP65dlkC.js","./assets/game-CTjXQJgn.js","./assets/game-CUPjM52I.js","./assets/game-CVSzYvFX.js","./assets/game-Caz76NEF.js","./assets/game-Cb4UnYBF.js","./assets/game-CfQ0dsDj.js","./assets/game-Cl6vijaQ.js","./assets/game-CmMI5aRy.js","./assets/game-CoI-zLNM.js","./assets/game-Cr5TfyAb.js","./assets/game-CsDv8pWZ.js","./assets/game-CwEduZHH.js","./assets/game-D02SyJTU.js","./assets/game-D0KeOtEG.js","./assets/game-D2SeJGRO.js","./assets/game-D4aGZNjY.js","./assets/game-D4orwmon.js","./assets/game-D5aprVLO.js","./assets/game-D6Bd3q1l.js","./assets/game-DFtK1oC9.js","./assets/game-DJQT8W-j.js","./assets/game-DKQpDtz3.js","./assets/game-DOCH6yoR.js","./assets/game-DRLFT4Mw.js","./assets/game-DWn6wndW.js","./assets/game-DZGA1uIS.js","./assets/game-Db0-84PC.js","./assets/game-DflwosPR.js","./assets/game-DgPAtlzH.js","./assets/game-DhgXz5ia.js","./assets/game-DhxLBOgN.js","./assets/game-DjWHiPnB.js","./assets/game-DjxzZErt.js","./assets/game-DpDlewXn.js","./assets/game-Dqadf1V4.js","./assets/game-DunmJvMm.js","./assets/game-DwuQB9Xh.js","./assets/game-Dz0O_kpk.js","./assets/game-E8dthgGC.js","./assets/game-Fu3v35tO.js","./assets/game-HpR-i2UP.js","./assets/game-IDWDuNbJ.js","./assets/game-KNIwRgo5.js","./assets/game-MhCSBF0E.js","./assets/game-Mw7tWUA6.js","./assets/game-NFzq17vN.js","./assets/game-OI0d06ou.js","./assets/game-Qbjj7tey.js","./assets/game-YTZycVKT.js","./assets/game-ZOCQSnbY.js","./assets/game-ZgrGgczf.js","./assets/game-f3oeE5W3.js","./assets/game-jkradyk0.js","./assets/game-rwKTOpM5.js","./assets/game-xvPQMvLS.js","./assets/game-yY1_m06x.js","./assets/gameSkins-BBxRnUsV.js","./assets/guards-BRQZjza9.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-CJZt82SD.js","./assets/reactGame-BvD_Jagc.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-CF1E_swI.js","./assets/turns-BmXgBlyH.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-M-iCO-MS.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-C1q0rJ9d.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-C9RC8DEQ.css"];
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
