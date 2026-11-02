/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-8ac0fa9';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-B53iH8yl.js","./assets/BackupSheet-CJPErB94.js","./assets/BonusSheet-DZD1qfP9.js","./assets/ChallengesSheet-DH0RlKzs.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-DTCmWuLk.js","./assets/StatsSheet-Be0noT50.js","./assets/backend-HkXHoeTe.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/daily-Cq7x1oTw.js","./assets/firebaseBackend-B1ZxadHo.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-2t2mTBv9.js","./assets/game-3njZxysW.js","./assets/game-3ofJgQfE.js","./assets/game-4U-aHPzB.js","./assets/game-4mQhgmg4.js","./assets/game-5A1wqS99.js","./assets/game-5ENjr5qb.js","./assets/game-5cuGiV7v.js","./assets/game-5t3yt9gk.js","./assets/game-6p89emrl.js","./assets/game-7gSyqk3J.js","./assets/game-8DsMozP4.js","./assets/game-B1SRLMHa.js","./assets/game-B5RBoFsk.js","./assets/game-B984vUGm.js","./assets/game-BAHEQYl9.js","./assets/game-BDwFX9tP.js","./assets/game-BEDzhaAJ.js","./assets/game-BI_7t7Fr.js","./assets/game-BK5uQ5yq.js","./assets/game-BLyLeqnl.js","./assets/game-BP0IqMq-.js","./assets/game-BP4hcPNi.js","./assets/game-BW5pcX1n.js","./assets/game-BbHAm6ek.js","./assets/game-BoLO3CZ0.js","./assets/game-BuHHFm74.js","./assets/game-BuuZhQmI.js","./assets/game-ByZfebwJ.js","./assets/game-C-g30YmN.js","./assets/game-C-jV2pzc.js","./assets/game-C3ow0NP7.js","./assets/game-C79Xa5Kp.js","./assets/game-CH6kBPT_.js","./assets/game-CIDloAco.js","./assets/game-CMMDxhQg.js","./assets/game-CRpmtZc9.js","./assets/game-CUUN8Igb.js","./assets/game-CWtmVW-_.js","./assets/game-CXeX2D7B.js","./assets/game-CYQ2RO_r.js","./assets/game-Cnq11trv.js","./assets/game-CqKrh8zR.js","./assets/game-CrtQ6ToO.js","./assets/game-CtFr0vbH.js","./assets/game-Cxm0TNoy.js","./assets/game-D0ITqIRj.js","./assets/game-DF4Mfft5.js","./assets/game-DFd7R29A.js","./assets/game-DG4gqRYA.js","./assets/game-DMC6V7rK.js","./assets/game-DMZFdfGe.js","./assets/game-DULBZ01Q.js","./assets/game-DV_iIqJO.js","./assets/game-DWGv5JSh.js","./assets/game-DWmxdxIJ.js","./assets/game-DXy9Z0IY.js","./assets/game-DZHAvgYa.js","./assets/game-Daja4Z09.js","./assets/game-Dar-L1Ro.js","./assets/game-DbN1YPTv.js","./assets/game-DdpFBuCG.js","./assets/game-Di1HpQTR.js","./assets/game-DjO7UQYX.js","./assets/game-Dl--rIrg.js","./assets/game-Dnh0YlZJ.js","./assets/game-DoyNenHX.js","./assets/game-DqOVpKyb.js","./assets/game-DrL6i-hg.js","./assets/game-Dslt96Im.js","./assets/game-DvCO5Ixr.js","./assets/game-Dwrfxcty.js","./assets/game-F4jgn2CY.js","./assets/game-KvPpx97I.js","./assets/game-KyREpk9l.js","./assets/game-LG9mZC9p.js","./assets/game-MTCOGYh-.js","./assets/game-N8eMQ3O8.js","./assets/game-NOFAA1oD.js","./assets/game-Or43Ykpu.js","./assets/game-SFkO12Gl.js","./assets/game-UzEJym9B.js","./assets/game-XLR-uWbt.js","./assets/game-_ktDG_9X.js","./assets/game-aJlJ0Zzx.js","./assets/game-aufv0p0o.js","./assets/game-l1IOKzbk.js","./assets/game-lh3roZTe.js","./assets/game-lkeJpwso.js","./assets/game-meDAlr3i.js","./assets/game-rfuBNyAS.js","./assets/game-xoTJXCDq.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-BXUkMzxU.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-BS_tSgF8.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-u2cuTIT1.css"];
const PREFIX = 'mrd-offline-games-';   // additiv3.github.io teilt sich den Cache mit anderen Apps → nur eigene löschen

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => Promise.all(PRECACHE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Netz zuerst (höchstens 4 s warten, dann Speicher): eine neue Version ist sofort da,
   im Funkloch startet die App trotzdem aus dem Speicher. */
function networkFirst(req) {
  return new Promise((resolve) => {
    let done = false;
    const fromCache = () => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'));
    const timer = setTimeout(() => {
      fromCache().then((hit) => { if (hit && !done) { done = true; resolve(hit); } });
    }, 4000);
    // Neue Anfrage nur aus der URL: Seitenaufrufe (mode 'navigate') lassen sich in älterem Safari nicht mit Optionen kopieren
    fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
      clearTimeout(timer);
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
      if (!done) { done = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      fromCache().then((hit) => { if (!done) { done = true; resolve(hit || Response.error()); } });
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
  e.respondWith(networkFirst(req));
});
