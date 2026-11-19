'use strict';
// Fehlererkennung (3.5.9): merkt sich JavaScript-Fehler und fehlende Dateien NUR auf dem Gerät (Elternseite: "Letzte Fehler").
// Gesendet wird, wenn die anonyme Statistik an ist, nur ein grober Name wie fehler/3.5.9/skript/anim-js (kein Text, kein Spielstand, keine Namen).
(function () {
  const KEY = 'ss-fehler', VKEY = 'ss-fehler-ver', MAX = 20, t0 = Date.now();
  const ver = () => (self.APP && APP.version) || '?';
  const rd = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch (e) { return [] } };
  const wr = a => { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-MAX))) } catch (e) {} };
  const file = u => String(u || '').split('?')[0].split('#')[0].split('/').pop() || 'x';
  let session = 0, shown = false, recent = false;
  try { const old = localStorage.getItem(VKEY); if (old && old !== ver()) recent = true; localStorage.setItem(VKEY, ver()) } catch (e) {}
  function log(kind, msg, src) {
    try {
      const f = file(src), a = rd(), last = a[a.length - 1];
      if (last && last.k === kind && last.f === f && last.m === String(msg).slice(0, 160) && Date.now() - last.t < 60000) return;
      a.push({t: Date.now(), v: ver(), k: kind, f, m: String(msg).slice(0, 160), w: (typeof view !== 'undefined' ? view : '?')}); wr(a); session++;
      if (window.STAT && STAT.ev) STAT.ev('fehler/' + ver() + '/' + kind + '/' + f.replace(/\./g, '-'));
      if (!shown && session >= 2 && (recent || Date.now() - t0 < 120000)) { shown = true; hilfe() }
    } catch (e) {}
  }
  addEventListener('error', e => {
    if (e.target && e.target !== window && e.target.tagName) { const t = e.target.tagName.toLowerCase(); if (/^(img|video|audio|script|link|source)$/.test(t)) log('datei-' + t, 'nicht ladbar', e.target.currentSrc || e.target.src || e.target.href) }
    else log('skript', e.message || 'Fehler', e.filename);
  }, true);
  addEventListener('unhandledrejection', e => { const r = e.reason; log('versprechen', (r && (r.message || r)) || 'abgelehnt', r && r.stack && (/(\S+\.js)/.exec(r.stack) || [])[1]) });
  async function reset() {
    try { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())) } catch (e) {}
    try { const ks = await caches.keys(); await Promise.all(ks.filter(k => /^ss-/.test(k)).map(k => caches.delete(k))) } catch (e) {}
    location.reload();
  }
  function hilfe() {
    if (document.getElementById('fe-hilfe') || !document.body) return;
    const d = document.createElement('div'); d.id = 'fe-hilfe';
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(90px + env(safe-area-inset-bottom));z-index:90;background:#2c2c30;color:#fff;border:1px solid #ff8a1f;border-radius:16px;padding:12px 14px;font:600 14px system-ui;box-shadow:0 8px 30px rgba(0,0,0,.5)';
    d.innerHTML = '<div>Da hakt etwas nach dem Update. Neu laden hilft meistens.</div><div style="display:flex;gap:8px;margin-top:10px"><button id="fe-r" style="min-height:44px;flex:1;border:0;border-radius:12px;background:#ff8a1f;color:#000;font:700 14px system-ui">Neu laden</button><button id="fe-x" style="min-height:44px;border:1px solid #666;border-radius:12px;background:none;color:#fff;padding:0 14px;font:600 14px system-ui">Später</button></div>';
    document.body.appendChild(d);
    d.querySelector('#fe-r').onclick = reset; d.querySelector('#fe-x').onclick = () => d.remove();
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const txt = () => rd().map(x => new Date(x.t).toLocaleString('de-DE') + ' · v' + x.v + ' · ' + x.w + ' · ' + x.k + ' · ' + x.f + ' · ' + x.m).join('\n');
  function card() {
    const a = rd().slice(-5).reverse();
    return `<div class="card" id="fehlercard"><b>Letzte Fehler</b><p class="m">${a.length ? 'Nur auf diesem Gerät gespeichert. Bei Problemen die Liste kopieren und mitschicken.' : 'Keine Fehler aufgetreten.'}</p>${a.length ? '<ul class="m" style="padding-left:18px">' + a.map(x => `<li>${esc(new Date(x.t).toLocaleDateString('de-DE'))} · v${esc(x.v)} · ${esc(x.k)} · ${esc(x.f)}</li>`).join('') + '</ul>' : ''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${a.length ? '<button class="btn" style="min-height:44px" onclick="FEHLER.kopieren()">Liste kopieren</button><button class="btn" style="min-height:44px" onclick="FEHLER.leeren()">Löschen</button>' : ''}<button class="btn" style="min-height:44px" onclick="FEHLER.reset()">Speicher leeren und neu laden</button></div></div>`;
  }
  window.FEHLER = {log, reset, list: rd,
    kopieren() { const t = txt(); try { navigator.clipboard.writeText(t).then(() => typeof toast === 'function' && toast('Kopiert')) } catch (e) { prompt('Fehlerliste', t) } },
    leeren() { wr([]); if (typeof render === 'function') render() }};
  const pp = window.parents;
  if (typeof pp === 'function') window.parents = function () { const h = pp.apply(null, arguments), i = h.indexOf('<div class="card" id="statcard">'); return i < 0 ? h + card() : h.slice(0, i) + card() + h.slice(i) };
})();
