/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-a52130d';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-WWvpHGh2.js","./assets/BackupSheet-kNy1bPwl.js","./assets/BonusSheet-BDWIKCPF.js","./assets/ChallengesSheet-CXhIywDn.js","./assets/PlayingCard-DM-ffpHc.js","./assets/ShopSheet-BsJaxxMI.js","./assets/StatsSheet-B8JnTGgq.js","./assets/backend-CsqKd-2c.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-xCFvZg1a.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--x6xOHDY.js","./assets/game-0vEdO3N_.js","./assets/game-27ac3fo7.js","./assets/game-2XJo-1IJ.js","./assets/game-99MDv1em.js","./assets/game-Aoni5ltX.js","./assets/game-B0KzVvP_.js","./assets/game-B38FtoHE.js","./assets/game-B5pJ4EIx.js","./assets/game-B69TTcka.js","./assets/game-BJD1Hgei.js","./assets/game-BKqXdfWV.js","./assets/game-BMAWdWvt.js","./assets/game-BMsKOkx8.js","./assets/game-BSTkknM3.js","./assets/game-BSiy1WaC.js","./assets/game-BW0moYeg.js","./assets/game-BZqjzApB.js","./assets/game-B_cgl3FO.js","./assets/game-B_lRqgaT.js","./assets/game-Bb5E5zVe.js","./assets/game-BbOvUVEJ.js","./assets/game-BdgxNa68.js","./assets/game-BenTNHBM.js","./assets/game-BfjQkQu7.js","./assets/game-BfmLIIlu.js","./assets/game-BhgyARKV.js","./assets/game-BiRiEFfF.js","./assets/game-Bj1Erhv2.js","./assets/game-BqstSNEr.js","./assets/game-C-U6MVtk.js","./assets/game-C2zZC5Mt.js","./assets/game-C3tMLr8Z.js","./assets/game-C4N0H2m-.js","./assets/game-C70u9zPI.js","./assets/game-C8U3s4lN.js","./assets/game-C8ezOpvp.js","./assets/game-C998mkUF.js","./assets/game-CBXaj4LE.js","./assets/game-CDA-h_1O.js","./assets/game-CFLvbm6O.js","./assets/game-CJ2YJmc7.js","./assets/game-CJWmKIhR.js","./assets/game-CKGGYz79.js","./assets/game-CKX_wKDU.js","./assets/game-CL9I8Xm5.js","./assets/game-CNo4S6TV.js","./assets/game-COqTH4Zo.js","./assets/game-CR-enWbf.js","./assets/game-CS_HWfV-.js","./assets/game-CVOnOvIK.js","./assets/game-CVQF30wZ.js","./assets/game-CWP0s4Ur.js","./assets/game-CXSZ-6B5.js","./assets/game-CZIzoE45.js","./assets/game-CbGDNi3q.js","./assets/game-CcqOANFV.js","./assets/game-CeCFLLVM.js","./assets/game-CefWeDw-.js","./assets/game-Ceqo03VI.js","./assets/game-CgVkmzl_.js","./assets/game-Cg_hbiSU.js","./assets/game-ChzFsBdq.js","./assets/game-ClcbwVcM.js","./assets/game-CnEJzUst.js","./assets/game-CpCLxRaE.js","./assets/game-CqS9O3Q5.js","./assets/game-CqYdQI7P.js","./assets/game-Cs0oCbrf.js","./assets/game-CsnCDgFY.js","./assets/game-D-1sMYqY.js","./assets/game-D1SWomwe.js","./assets/game-D3_tRqLT.js","./assets/game-D6RoP-a4.js","./assets/game-D6WHhSbB.js","./assets/game-D7h7j3qb.js","./assets/game-D9MZUMO6.js","./assets/game-DA2QZeoj.js","./assets/game-DC6hAtch.js","./assets/game-DCHIPvrc.js","./assets/game-DDl5TDOs.js","./assets/game-DE3JCHv9.js","./assets/game-DFNBN2At.js","./assets/game-DGU2ARcP.js","./assets/game-DGqKZbHF.js","./assets/game-DH8w1-F1.js","./assets/game-DHP2t26y.js","./assets/game-DMIuyd2n.js","./assets/game-DM_mw9kq.js","./assets/game-DMhMcvO8.js","./assets/game-DORI1YWu.js","./assets/game-DQNcnCO1.js","./assets/game-DRNj_S3L.js","./assets/game-DYZjN3-B.js","./assets/game-DZRQ1Ym4.js","./assets/game-DdiOUaNH.js","./assets/game-De53P8U1.js","./assets/game-Dn6f9uNV.js","./assets/game-DnJyqG5g.js","./assets/game-DnPbTOPg.js","./assets/game-Dr8eBxvs.js","./assets/game-DsN9IwYE.js","./assets/game-Du2f8uAP.js","./assets/game-DvBlwxtb.js","./assets/game-DvEK_eXt.js","./assets/game-Dvz4H-jb.js","./assets/game-Dxo7rPg_.js","./assets/game-EVb-W00E.js","./assets/game-Fg4zdhRo.js","./assets/game-N_S919Co.js","./assets/game-Q85QMLMx.js","./assets/game-VOm4g0jm.js","./assets/game-WK_SgKbT.js","./assets/game-ZBd831Bh.js","./assets/game-ZP37L8OS.js","./assets/game-ZoxeM1Wj.js","./assets/game-_TS7YKWv.js","./assets/game-a-A_JDrp.js","./assets/game-at648Nzb.js","./assets/game-bU6IUbbJ.js","./assets/game-by3bBAhG.js","./assets/game-fl8dOLfc.js","./assets/game-haC1yBqr.js","./assets/game-haWkEcUd.js","./assets/game-juaAHrAS.js","./assets/game-ofmIRXiz.js","./assets/game-qKjVP3bn.js","./assets/game-rGXSf2JC.js","./assets/game-t0j1R5gr.js","./assets/game-wbMqYSsU.js","./assets/game-zvwwa1sI.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-BUZ-q4fe.js","./assets/hud-DEzVG6Zm.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-Bsjold4g.js","./assets/reactGame-VCyd1Mp0.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-kefbMdC2.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-Dk9VNhx_.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-CRB1OuOZ.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-DUHURfxl.css"];
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
