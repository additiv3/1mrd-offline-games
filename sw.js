/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-ea9cb3c';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-C3mg3N7I.js","./assets/BackupSheet-gnbo0x_l.js","./assets/BonusSheet-BcsDXNdi.js","./assets/ChallengesSheet-DcO6__lD.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-CCvYEpUN.js","./assets/StatsSheet-Bf7yIqaM.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-0RwOEd0A.js","./assets/game-7KFpBbNP.js","./assets/game-8uqkuOMp.js","./assets/game-93unPqdx.js","./assets/game-AyYuvk95.js","./assets/game-B0go3fUz.js","./assets/game-B4BIZ_qf.js","./assets/game-B4zlmaLp.js","./assets/game-B9RWDIE4.js","./assets/game-BApfLg-2.js","./assets/game-BCz6a8VK.js","./assets/game-BD85L3qw.js","./assets/game-BDsAim0A.js","./assets/game-BEGJWxGz.js","./assets/game-BG0aun8U.js","./assets/game-BHGcxhpO.js","./assets/game-BI6kxqB4.js","./assets/game-BK04d0pu.js","./assets/game-BKrZIK_e.js","./assets/game-BPO9jdje.js","./assets/game-BQ_ZWnZL.js","./assets/game-BRU9L8GC.js","./assets/game-BScS6DMt.js","./assets/game-BcLulW6_.js","./assets/game-BhCxjqL2.js","./assets/game-BinVLi3D.js","./assets/game-BlikcPB7.js","./assets/game-BoCLKWp1.js","./assets/game-BsISb03N.js","./assets/game-Bw9NCSKx.js","./assets/game-BzPvECMZ.js","./assets/game-C-k0FQWx.js","./assets/game-C9HV1mtl.js","./assets/game-C9MCv46I.js","./assets/game-CDBi1zM5.js","./assets/game-CGZyJ84V.js","./assets/game-CIlxkLOp.js","./assets/game-CJRU-Fzq.js","./assets/game-CK5g1r86.js","./assets/game-CKaK7KQd.js","./assets/game-CKfCSUex.js","./assets/game-CO-IUjPk.js","./assets/game-CPn29jWm.js","./assets/game-CRIHAKdk.js","./assets/game-CV-PLP9b.js","./assets/game-CYKE8Fq9.js","./assets/game-CYzM5XKH.js","./assets/game-C_sjKXpL.js","./assets/game-CbEfqO4n.js","./assets/game-ClZNlPKf.js","./assets/game-CpRgi8uY.js","./assets/game-CqR1mATG.js","./assets/game-Cx9aUmny.js","./assets/game-D7c6OC_N.js","./assets/game-D9MYxGmU.js","./assets/game-DAgUXsHV.js","./assets/game-DDtV_065.js","./assets/game-DHvZqUtN.js","./assets/game-DNHwJ0c9.js","./assets/game-DYz3QWZQ.js","./assets/game-DesF6sW5.js","./assets/game-Dg-TVdUI.js","./assets/game-DlGTN529.js","./assets/game-DsCfHNaW.js","./assets/game-DvFPCk_1.js","./assets/game-DxgCp3tR.js","./assets/game-Jm6N2OGX.js","./assets/game-Mutue6CE.js","./assets/game-ONO0xCFg.js","./assets/game-P47GxKH5.js","./assets/game-PyrOgaji.js","./assets/game-W2FBR1wd.js","./assets/game-XO2UdO0n.js","./assets/game-YDUCSrNK.js","./assets/game-baHFW4Nm.js","./assets/game-gvr7hHl3.js","./assets/game-kV62ffwD.js","./assets/game-p_VsnJLI.js","./assets/game-xR5X-jf8.js","./assets/game-zvIxqVhB.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-3MlPlzK2.js","./assets/rng-CF0hxTOu.js","./assets/search-CgP9J8U2.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-Bu5Yq0fF.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-DKUMQA37.css"];
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
