/* 1 Milliarden Offline Games – Service Worker: offline spielbar, online immer die neueste Version.
   Vorlage: das Plugin "mrd-pwa" in vite.config.ts setzt Cache-Name und Vorab-Liste ein und schreibt dist/sw.js. */
const CACHE = 'mrd-offline-games-7d47cc8';
const PRECACHE = ["./","./index.html","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512-maskable.png","./icons/icon-512.png","./assets/index-GrPWeoRH.js","./assets/BackupSheet-DoQTS6a3.js","./assets/BonusSheet-BXQzeBzL.js","./assets/ChallengesSheet-C7L-M3EX.js","./assets/PlayingCard-Bxc6al6o.js","./assets/ShopSheet-Xz0lBlvK.js","./assets/StatsSheet-B_6ZExkj.js","./assets/backend-DFlDvE91.js","./assets/ballLooks-DEw97Tl-.js","./assets/canvasGame-BXOl5J8L.js","./assets/canvasMenu-FN3EhjM2.js","./assets/cosmetics-C58BSvNV.js","./assets/daily-Cq7x1oTw.js","./assets/firebaseBackend-Birzsi46.js","./assets/fitWorld-kOZbmpb_.js","./assets/game-4DCbYN3E.js","./assets/game-5wI8uXz0.js","./assets/game-7XQUWrbl.js","./assets/game-820vj-fK.js","./assets/game-B-_fb5W3.js","./assets/game-B09eOPi3.js","./assets/game-B2WRA9gl.js","./assets/game-BHK8oVZq.js","./assets/game-BIxUjQqM.js","./assets/game-BKO8nfnc.js","./assets/game-BNnaEyHl.js","./assets/game-BO42MStE.js","./assets/game-BPAhaO-N.js","./assets/game-BRnPrTio.js","./assets/game-BTl1TOb_.js","./assets/game-BYRdp7eN.js","./assets/game-BmldlfN2.js","./assets/game-BnGy4LS2.js","./assets/game-BoQxNAb-.js","./assets/game-BoZAQ1X_.js","./assets/game-BpWDq7mi.js","./assets/game-Bpdiz8IZ.js","./assets/game-Bpmfjsyg.js","./assets/game-Bw0Aflrg.js","./assets/game-Bw3cifc7.js","./assets/game-BxIiMXbM.js","./assets/game-C11lBxNy.js","./assets/game-C1LYluBW.js","./assets/game-C1mzsLWP.js","./assets/game-C2M1kOvM.js","./assets/game-C2lILTpc.js","./assets/game-CA1mPO0T.js","./assets/game-CAoqw_GD.js","./assets/game-CE2Eu4yI.js","./assets/game-CEAXgBTz.js","./assets/game-CEBnQo0k.js","./assets/game-CKr05Ed6.js","./assets/game-CMys3B8J.js","./assets/game-COWPTKc4.js","./assets/game-COXoDiMJ.js","./assets/game-CPM8buUz.js","./assets/game-CQaSLzn0.js","./assets/game-CR13Egjy.js","./assets/game-CR8htfK9.js","./assets/game-CT2ZTXEn.js","./assets/game-CTptv8wZ.js","./assets/game-CU0ojmX9.js","./assets/game-Cg3M-tkg.js","./assets/game-CgUmj60e.js","./assets/game-Cj5BTVaM.js","./assets/game-CufZZ0jb.js","./assets/game-CvkC76Cy.js","./assets/game-CxlBjGky.js","./assets/game-D-ATedLz.js","./assets/game-D1u7xfxU.js","./assets/game-D2oUCoXf.js","./assets/game-DEfonN8q.js","./assets/game-DK9ZlKsP.js","./assets/game-DMpYMLqN.js","./assets/game-DUtRYp4n.js","./assets/game-DVpMOtI1.js","./assets/game-DW3DHycK.js","./assets/game-DX0HV6mq.js","./assets/game-DY3MHVRd.js","./assets/game-Db83b7FQ.js","./assets/game-Dcxj29ck.js","./assets/game-DehUq1LL.js","./assets/game-DgGDNknL.js","./assets/game-Dlivif6n.js","./assets/game-DnExHBRG.js","./assets/game-Dq4QBFCB.js","./assets/game-Dq87p3vk.js","./assets/game-DqV6mfq1.js","./assets/game-DsA3M2Gv.js","./assets/game-DtiJFaR9.js","./assets/game-DwROTRC8.js","./assets/game-DwdOdZyq.js","./assets/game-KN9H9CX9.js","./assets/game-LDnTg0vU.js","./assets/game-P4gI93Pk.js","./assets/game-Pitq7ILa.js","./assets/game-WUbJt7As.js","./assets/game-cn72GbuA.js","./assets/game-dRCmasD3.js","./assets/game-grxSB8pM.js","./assets/game-n4kquEK4.js","./assets/game-niQ0hre-.js","./assets/game-q2d_Xw7i.js","./assets/game-q3VxWl5f.js","./assets/game-uCo1MmGC.js","./assets/game-z3RD7bJF.js","./assets/game-zglhczrA.js","./assets/gameSkins-DDcmI3Pi.js","./assets/guards-BRQZjza9.js","./assets/hud-CY0Q272s.js","./assets/jsx-runtime-DLNB9Qsn.js","./assets/reactGame-klLESpbe.js","./assets/rng-CF0hxTOu.js","./assets/search-PBNH6H8g.js","./assets/spin-Cnqpf_xI.js","./assets/swapDuel-B9_GYR4y.js","./assets/terms-BAm1yrkd.js","./assets/ui-23phuBVH.js","./assets/useCountdown-48T6VYL6.js","./assets/useElementSize-0Ho7WBKh.js","./assets/useHints-C6cZiAct.js","./assets/game-DPoCpSei.css","./assets/game-PqoHXDw_.css","./assets/index-Di-v_QAr.css"];
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
