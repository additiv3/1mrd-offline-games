/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-b61a20a';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CXdjgO9y.js","./assets/BackupSheet-DImbr4In.js","./assets/BonusSheet-DwPjxkuS.js","./assets/ChallengesSheet-BRYVc07O.js","./assets/PlayingCard-DM-ffpHc.js","./assets/ShopSheet-D88J43Rn.js","./assets/StatsSheet-DopP4Aep.js","./assets/backend-CVJUrzJC.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-B59z6Phw.js","./assets/firebaseBackend-43VbyuUl.js","./assets/fitWorld-kOZbmpb_.js","./assets/game--C1eQ6iG.js","./assets/game--pb51po1.js","./assets/game-00Cqfgxg.js","./assets/game-0Mo7bXQ3.js","./assets/game-0pws9RAQ.js","./assets/game-3TYuCljM.js","./assets/game-4C2BgpMD.js","./assets/game-5dM_5d_-.js","./assets/game-78qw2pTT.js","./assets/game-A-TtbZGl.js","./assets/game-AannFMnK.js","./assets/game-B2kNN-ST.js","./assets/game-B4v33R_r.js","./assets/game-B8etuuN8.js","./assets/game-BJARL04O.js","./assets/game-BJk5mZ4U.js","./assets/game-BLlGD3La.js","./assets/game-BNJqWqe-.js","./assets/game-BNMBSYg3.js","./assets/game-BSQ7t_1s.js","./assets/game-BTm_Yp84.js","./assets/game-BUV7Pian.js","./assets/game-BVaVTTZd.js","./assets/game-BXnssYnq.js","./assets/game-BXp5ZCWo.js","./assets/game-B_EaT-qb.js","./assets/game-BcoC5put.js","./assets/game-Bdo22l18.js","./assets/game-Bg_dXTDU.js","./assets/game-BjDuevlN.js","./assets/game-Bl-NqSud.js","./assets/game-BmIOhoSL.js","./assets/game-BnO6ej9S.js","./assets/game-BpiV5mQX.js","./assets/game-BqSufgib.js","./assets/game-Bwp4_oFy.js","./assets/game-BzRN0psz.js","./assets/game-C-al_rZz.js","./assets/game-C0q5sObh.js","./assets/game-C2CvOIAE.js","./assets/game-C33bclaM.js","./assets/game-C4WxY0ZF.js","./assets/game-C5QolyYa.js","./assets/game-C7NE7dhT.js","./assets/game-C8lAEsWc.js","./assets/game-CAEAelst.js","./assets/game-CBq0ex1Z.js","./assets/game-CGIEY5oy.js","./assets/game-CGPohTPk.js","./assets/game-CHZW_6bQ.js","./assets/game-CIMpbz4o.js","./assets/game-CIszbdTB.js","./assets/game-COExpBIa.js","./assets/game-CPseLvPP.js","./assets/game-CQN_Q0wB.js","./assets/game-CSZ8vcnK.js","./assets/game-CT7uUkGl.js","./assets/game-CVB1YcH_.js","./assets/game-CXnkJh8f.js","./assets/game-CdkUMGlj.js","./assets/game-CffsEKvf.js","./assets/game-Cfx-fya2.js","./assets/game-CiAA4Qg2.js","./assets/game-CiBWZlI-.js","./assets/game-CieBo3tE.js","./assets/game-CjCJ9le9.js","./assets/game-Ck0e8HWS.js","./assets/game-CkH02Wss.js","./assets/game-Com_wkrV.js","./assets/game-Cpp5kF1i.js","./assets/game-CrDQSLw3.js","./assets/game-CrKOnIgp.js","./assets/game-CsHqCWJ8.js","./assets/game-CtXDX0EM.js","./assets/game-CyohTOar.js","./assets/game-D2xxOM5Z.js","./assets/game-D3ac6eCe.js","./assets/game-D7VM3k4G.js","./assets/game-DA1Xv1FM.js","./assets/game-DF1CbGlP.js","./assets/game-DGTUWPCT.js","./assets/game-DJqR19PL.js","./assets/game-DMdtGg-c.js","./assets/game-DP1Y63Z4.js","./assets/game-DQpcPAyU.js","./assets/game-DRLUckJM.js","./assets/game-DS0Df3aP.js","./assets/game-DTDZGpth.js","./assets/game-DUs3vRIY.js","./assets/game-DW4Z0Cnn.js","./assets/game-DajHt7tD.js","./assets/game-DcXzjxYC.js","./assets/game-Dd9MdZJt.js","./assets/game-DdO9BlZn.js","./assets/game-DiTtlAs3.js","./assets/game-DjHvetRm.js","./assets/game-DjoOz610.js","./assets/game-DmzrIIg0.js","./assets/game-DnTEW5t2.js","./assets/game-DothI6e7.js","./assets/game-DtkKdjNl.js","./assets/game-DtxSBJPo.js","./assets/game-Due801XY.js","./assets/game-DxLmkRZ8.js","./assets/game-DxUqO5Oa.js","./assets/game-KUTaGVHV.js","./assets/game-O7TzIYcs.js","./assets/game-SgpGsBgi.js","./assets/game-SjbnIt3U.js","./assets/game-Thy_K8Ly.js","./assets/game-VtxhLe3j.js","./assets/game-YSyh6CxC.js","./assets/game-Ykri4Umu.js","./assets/game-b1iihz5f.js","./assets/game-bmZ_I-k7.js","./assets/game-dexRUFNo.js","./assets/game-g-Jb_HQD.js","./assets/game-i76hXj_L.js","./assets/game-lgc2fSj8.js","./assets/game-oUsiPeke.js","./assets/game-uQkx8I6R.js","./assets/game-v-TEcQp6.js","./assets/gameSkins-fV2j5iU0.js","./assets/guards-BRQZjza9.js","./assets/guides-DUWxMKQx.js","./assets/hud-Dj9g6txC.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-D8dOwsZp.js","./assets/reactGame-O3cs5r8H.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/soundSets-BbBkuu-T.js","./assets/spin-Cnqpf_xI.js","./assets/storage-FhXF3ulx.js","./assets/swapDuel-B9_GYR4y.js","./assets/turns-BF8snXOT.js","./assets/ui-CsLMe9JX.js","./assets/useCoopGame-C073bwVG.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-Dqdj_0tz.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-Bw1Mjap1.css"];
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
