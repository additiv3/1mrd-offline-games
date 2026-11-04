/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-a5a1fed';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-CbS4sd60.js","./assets/BackupSheet-9BOwsHil.js","./assets/BonusSheet-C9O_T2qT.js","./assets/ChallengesSheet-Cm0FOLmE.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-DAaxT87h.js","./assets/StatsSheet-4YPRhJie.js","./assets/backend-Cx-pujvm.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/firebaseBackend-BbD1tOJ_.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-2VfJkbU_.js","./assets/game-4TeoIThn.js","./assets/game-7aXIUS1U.js","./assets/game-94nJzooN.js","./assets/game-AOQJkL1T.js","./assets/game-B2bhnCqJ.js","./assets/game-B4w-iMtM.js","./assets/game-B5iBAGHQ.js","./assets/game-B6YsnEv8.js","./assets/game-BAMAJsPe.js","./assets/game-BB0ptqHd.js","./assets/game-BC9fatBX.js","./assets/game-BG9PcXfI.js","./assets/game-BIJ04Hm7.js","./assets/game-BJNxavFo.js","./assets/game-BKT9XRLC.js","./assets/game-BSAaJZpw.js","./assets/game-BSHlYFdM.js","./assets/game-BW5VX5c3.js","./assets/game-BYYZNkHT.js","./assets/game-BdW18MIV.js","./assets/game-Be0_whDk.js","./assets/game-Bh7iUvtV.js","./assets/game-BiAu-UN7.js","./assets/game-BjVJ-A_l.js","./assets/game-Bj_gRkok.js","./assets/game-BjdFUI3P.js","./assets/game-BpiCSw7u.js","./assets/game-BqwRqXKj.js","./assets/game-BvGugm4T.js","./assets/game-BxG98pfP.js","./assets/game-BzFPH5wf.js","./assets/game-BzHsHwf9.js","./assets/game-C2VLKfQO.js","./assets/game-C2ZKZkfV.js","./assets/game-C7hTxh57.js","./assets/game-C8IghwAc.js","./assets/game-C9nHfJ89.js","./assets/game-CCl3fisR.js","./assets/game-CFRgGmHk.js","./assets/game-CGZaxnw5.js","./assets/game-CJPXan8W.js","./assets/game-CN0FxQBx.js","./assets/game-CNuISi6-.js","./assets/game-COxDmLMs.js","./assets/game-CSX49nI6.js","./assets/game-CSrOy-dB.js","./assets/game-CVRXnH9p.js","./assets/game-CXru6kI4.js","./assets/game-CbllsIVk.js","./assets/game-CdYmgwyI.js","./assets/game-CeIw961G.js","./assets/game-ChmRo7SX.js","./assets/game-CijkVMD3.js","./assets/game-CjNyNvTV.js","./assets/game-Cl7jwWCF.js","./assets/game-CmFIMkUn.js","./assets/game-CoDYHbhO.js","./assets/game-CzBWU8m3.js","./assets/game-D36FHMAv.js","./assets/game-DAbuhzWh.js","./assets/game-DGP46aqu.js","./assets/game-DHrO0nSP.js","./assets/game-DKefVIJN.js","./assets/game-DMfHbuwu.js","./assets/game-DND0QfOG.js","./assets/game-DRSzjuiY.js","./assets/game-DWwqBJjk.js","./assets/game-Dc69MRJs.js","./assets/game-DfZ1iN5F.js","./assets/game-DgjOKBeN.js","./assets/game-DhhGSzfl.js","./assets/game-DhxmWaei.js","./assets/game-DieYLid6.js","./assets/game-Ds3PAjpm.js","./assets/game-DungjdDQ.js","./assets/game-DzmrYg00.js","./assets/game-HIwpSTuW.js","./assets/game-KAY5i49i.js","./assets/game-Kxn1nByA.js","./assets/game-NsC5PVTu.js","./assets/game-QAJ5eyJz.js","./assets/game-SHSfr7hn.js","./assets/game-UBjgK28z.js","./assets/game-WkJJkys6.js","./assets/game-YEoXZ-Cx.js","./assets/game-YVk-oOVR.js","./assets/game-YZnT0dcs.js","./assets/game-hGEbRDGe.js","./assets/game-qyyIZE6G.js","./assets/game-xlX0fj4y.js","./assets/game-zV9Ke7Yr.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/moveFeed-CO0cvspf.js","./assets/reactGame-DOMz5AwR.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/turns-D_PjAfDq.js","./assets/ui-mDyclXhn.js","./assets/useCoopGame-olds3FCv.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/useOnlineMatch-C76__W2O.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-vKg-rl_6.css"];
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
