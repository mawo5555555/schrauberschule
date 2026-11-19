'use strict';
// Service Worker Schrauberschule. Cache-Name hängt an version.js: neue Version = neuer Cache, alter wird erst beim Aktivieren entfernt.
// Kein skipWaiting von allein: die Seite fragt "Jetzt aktualisieren?" und schickt dann SKIP_WAITING (kein Zwang, kein Datenverlust).
importScripts('version.js');
const V = self.APP.version, CORE = 'ss-core-' + V, IMG = 'ss-img-v11';
const R = '../'; // App-Wurzel (index.html hat <base href="../">)
const CORE_FILES = ['v2/index.html', 'v2/version.js', 'v2/migrate.js', 'v2/pwa.js', 'v2/spielstand.js', 'v2/lib/qrcode.js', 'v2/manifest.webmanifest', 'v2/theme.css', 'v2/anim.css', 'v2/pruefstand.css', 'v2/install.css', 'v2/p9.css', 'v2/p8d.css', 'v2/lack.css', 'v2/lack.js', 'v2/lack-foto.js', 'v2/wasch.css', 'v2/wasch.js', 'v2/wasch-hd.js', 'v2/motivation.css',
  'v2/img/manifest.js', 'content.js', 'c-grafik.js', 'c-mathe.js', 'c-deutsch.js', 'c-englisch.js', 'c-nawi.js', 'c-technik.js', 'c-sprechen.js', 'c-extra.js', 'v2/c-v2.js', 'app.js', 'garage.js', 'tuning.js', 'werkstatt.js', 'ws3d.js',
  'v2/fx.js', 'v2/art.js', 'v2/werkstatt2.js', 'v2/studio.js', 'v2/garage2.js', 'v2/klapprad.js', 'v2/freischalten.js', 'v2/p8d.js', 'v2/tune-foto.js', 'v2/missionen2.js', 'v2/missionen2-daten.js', 'v2/missionen2-daten2.js', 'v2/missionen2-fahrzeuge.js', 'v2/p8d-daten.js', 'v2/missionen2-shot.js',
  'v2/anim.js', 'v2/pruefstand-art.js', 'v2/pruefstand.js', 'v2/pruefstand-ton.js', 'v2/pruefstand-video.js', 'v2/pruefstand-clips.js', 'v2/fix-ui.js', 'v2/install.js', 'v2/statistik.js', 'v2/motivation.js', 'v2/icons/icon-192.png', 'v2/icons/icon-512.png', 'v2/icons/maskable-512.png', 'v2/icons/apple-touch-180.png', 'icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CORE).then(c => Promise.all(CORE_FILES.map(f => c.add(new Request(new URL(R + f, self.location).href, {cache: 'reload'})).catch(() => {}))))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => (x.indexOf('ss-core-') === 0 && x !== CORE) || (x.indexOf('ss-img-') === 0 && x !== IMG)).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  else if (d.type === 'VERSION' && e.source) e.source.postMessage({type: 'VERSION', version: V});
  else if (d.type === 'WARM' && Array.isArray(d.urls)) e.waitUntil(caches.open(IMG).then(async c => { let n = 0; for (const u of d.urls) { try { if (!(await c.match(u))) await c.add(u); n++; if (e.source && n % 5 === 0) e.source.postMessage({type: 'WARM', n, of: d.urls.length}) } catch (x) {} } if (e.source) e.source.postMessage({type: 'WARM', n, of: d.urls.length, done: true}) }));
});
// Videos aus dem Offline-Paket: Safari fragt Teilstücke (Range) an, daher 206 aus dem Cache bauen
async function part(res, rg) { const b = await res.blob(), m = /bytes=(\d*)-(\d*)/.exec(rg) || [], s = +m[1] || 0, e = m[2] ? Math.min(+m[2], b.size - 1) : b.size - 1;
  return new Response(b.slice(s, e + 1), {status: 206, headers: {'Content-Type': 'video/mp4', 'Content-Range': `bytes ${s}-${e}/${b.size}`, 'Content-Length': String(e - s + 1), 'Accept-Ranges': 'bytes'}}) }
// Geänderte Dateien mit gleichem Namen: einmal pro Start im Hintergrund prüfen (ETag/Länge) und bei Abweichung neu laden
const CHK = new Set();
function reval(u, hit) {
  if (CHK.has(u.href) || /\/v2\/(shots|alt|entwurf|referenz)\//.test(u.pathname) || !/\.(jpg|jpeg|png|webp|gif|svg|mp3|ogg|wav|m4a|mp4)$/i.test(u.pathname)) return; CHK.add(u.href);
  setTimeout(async () => { try {
    const h = await fetch(u.href, {method: 'HEAD', cache: 'no-cache'}); if (!h.ok) return;
    const e1 = h.headers.get('etag'), e0 = hit.headers.get('etag'), l1 = h.headers.get('content-length'), l0 = hit.headers.get('content-length');
    if ((e1 && e0 && e1 === e0) || (!e1 && l1 && l0 && l1 === l0)) return;
    const full = await fetch(u.href, {cache: 'reload'}); if (full && full.ok) { const c = await caches.open(IMG); await c.put(u.href, full) }
  } catch (x) {} }, 3000);
}
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== self.location.origin) return;
  const isImg = /\.(jpg|jpeg|png|webp|gif|svg|mp3|ogg|wav)$/i.test(u.pathname) && !/\/v2\/icons\//.test(u.pathname);
  e.respondWith((async () => {
    const hit = await caches.match(r, {ignoreSearch: true});
    if (hit) { reval(u, hit); const rg = r.headers.get('range'); if (rg && /\.mp4$/i.test(u.pathname)) return part(hit, rg); return hit }
    // Video noch nicht im Speicher: ganze Datei ohne Range laden, speichern und das angefragte Stück liefern
    if (/\.mp4$/i.test(u.pathname)) {
      try { const full = await fetch(u.href, {cache: 'no-store'}); if (full && full.ok) { const c = await caches.open(IMG); await c.put(u.href, full.clone()); const rg = r.headers.get('range'); return rg ? part(full, rg) : full } } catch (err) {}
      return fetch(u.href).catch(() => new Response('', {status: 504}));
    }
    try {
      const res = await fetch(r);
      if (res && res.ok && isImg && !/\/v2\/(shots|alt|entwurf|referenz)\//.test(u.pathname)) { const c = await caches.open(IMG); c.put(r, res.clone()) }
      return res;
    } catch (err) { if (r.mode === 'navigate') { const f = await caches.match(new URL(R + 'v2/index.html', self.location).href); if (f) return f } return new Response('', {status: 504}) }
  })());
});
