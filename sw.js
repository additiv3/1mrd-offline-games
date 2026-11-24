/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-d43ba4c';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CQdsem3o.js","./assets/BackupSheet-psu40WQ3.js","./assets/BonusSheet-CSmpBSYB.js","./assets/ChallengesSheet-oFWIWaaz.js","./assets/PlayingCard-DM-ffpHc.js","./assets/ShopSheet-gbUAJNCp.js","./assets/StatsSheet-CwlMujU-.js","./assets/backend-BHTLbB28.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-UfYmuIwi.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--jhSNxRu.js","./assets/game-0Z7w5zV_.js","./assets/game-0hcMt0S6.js","./assets/game-19z4e5PE.js","./assets/game-304usk1Q.js","./assets/game-8eWSSquP.js","./assets/game-93Nmvoyo.js","./assets/game-AZKPfO73.js","./assets/game-AjRqMnaF.js","./assets/game-B0ebbUA0.js","./assets/game-B224S1lA.js","./assets/game-B75kSQdT.js","./assets/game-B7gvGJK1.js","./assets/game-B8WLIZYk.js","./assets/game-B9TSToez.js","./assets/game-BAupTGa_.js","./assets/game-BBqNVW2t.js","./assets/game-BEEhUebB.js","./assets/game-BFxFO5Sy.js","./assets/game-BHLDBe98.js","./assets/game-BIkYk1Ek.js","./assets/game-BKZzyIA4.js","./assets/game-BLWZjruL.js","./assets/game-BMGhF23v.js","./assets/game-BOkCsp6v.js","./assets/game-BPi4ArXH.js","./assets/game-BPnpI7ok.js","./assets/game-BReRosGK.js","./assets/game-BRjqGZwO.js","./assets/game-BSdBPJHD.js","./assets/game-BTIndsJR.js","./assets/game-BTJ2ra4_.js","./assets/game-BVXw4wu3.js","./assets/game-BVic_sPs.js","./assets/game-BdBhsUFF.js","./assets/game-Bi-Cft5d.js","./assets/game-Bk5b3FFH.js","./assets/game-BlwfwiGs.js","./assets/game-BoS3tDx-.js","./assets/game-BqHU4kDG.js","./assets/game-BvjOhBSi.js","./assets/game-BwN2mB6j.js","./assets/game-Bxw29UW5.js","./assets/game-BxwdU_j_.js","./assets/game-ByWbqonU.js","./assets/game-C3R60RT-.js","./assets/game-C3es0Tlt.js","./assets/game-C3hAgkJM.js","./assets/game-C4SxcGzd.js","./assets/game-CC6yyVnP.js","./assets/game-CCEKJ2PW.js","./assets/game-CEdnOifs.js","./assets/game-CG4doVzW.js","./assets/game-CK8sMe1k.js","./assets/game-CMQvFOG0.js","./assets/game-CQmAarjT.js","./assets/game-CSOitpBG.js","./assets/game-CUEokjG1.js","./assets/game-CWXDUeyL.js","./assets/game-CfL-5CRR.js","./assets/game-Cg-L-PWt.js","./assets/game-Cga9x2eM.js","./assets/game-CkRiUq3h.js","./assets/game-Cmea395C.js","./assets/game-CqWx8pk_.js","./assets/game-CrsQX7Ti.js","./assets/game-CtBc4u5A.js","./assets/game-Cvu6oxRt.js","./assets/game-CxQfJfmS.js","./assets/game-Czd39djx.js","./assets/game-D-w7wuHg.js","./assets/game-D0N330eg.js","./assets/game-D4-3M3f1.js","./assets/game-D4dbWTv3.js","./assets/game-D7C-myjz.js","./assets/game-DCXJalPi.js","./assets/game-DF7pGhvR.js","./assets/game-DMq_KTAN.js","./assets/game-DP_i-bEE.js","./assets/game-DQcH1u6a.js","./assets/game-DUpzBMFV.js","./assets/game-DVq_BFwp.js","./assets/game-DWVdEtHA.js","./assets/game-DXdJPjmO.js","./assets/game-DYE0iy2y.js","./assets/game-D_Hs3cLy.js","./assets/game-Dajau9rc.js","./assets/game-DbJTTyDA.js","./assets/game-DdrXQhZ8.js","./assets/game-DeoaV5ib.js","./assets/game-DgzirUft.js","./assets/game-DjpW0CD4.js","./assets/game-Dl_wPGAa.js","./assets/game-DpNFntZa.js","./assets/game-DpZChQ0f.js","./assets/game-DqvqNj_k.js","./assets/game-Dryp1BQA.js","./assets/game-DscwXP8i.js","./assets/game-DuebzKtk.js","./assets/game-DvyWE3lj.js","./assets/game-Dvy_ZbWe.js","./assets/game-Dxxtte9P.js","./assets/game-DxxyGshH.js","./assets/game-F6Zb-77z.js","./assets/game-HhVhKkPz.js","./assets/game-J1xtbwOU.js","./assets/game-LewmlAD-.js","./assets/game-QRTB7V2r.js","./assets/game-QgqzwWbk.js","./assets/game-RQbsg_7Y.js","./assets/game-RWnWd66J.js","./assets/game-S9YZTd2w.js","./assets/game-SZRMBuBn.js","./assets/game-WVpbb07Q.js","./assets/game-WaDCYeG5.js","./assets/game-_LmYkP_N.js","./assets/game-amUZAP-Q.js","./assets/game-bMOlji5h.js","./assets/game-dXSZn3cC.js","./assets/game-eIHtCSZW.js","./assets/game-i0UW8YWQ.js","./assets/game-i3i8T48g.js","./assets/game-ij1w4WcF.js","./assets/game-lAuHftHA.js","./assets/game-sa91sHXt.js","./assets/game-yY7YhKGr.js","./assets/game-zCR_ep7k.js","./assets/game-zj10sba9.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-CyTZREqs.js","./assets/hud-DEzVG6Zm.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-Chum7Mgr.js","./assets/reactGame-BihDXmjd.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-C47STPEo.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-GSALlXpm.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-D8zEnfhS.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-BB-jXnlG.css"];
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
