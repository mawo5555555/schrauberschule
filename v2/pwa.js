'use strict';
// App-Hülle: Service Worker, Update-Hinweis, "Was ist neu", Versionsanzeige, Zurück-Taste, Tastatur, Installieren-Knopf in der Kopfzeile.
(function () {
  const A = self.APP, LS = 'ss-pwa-v1', H = location.hash, shot = /shot=([\w-]+)/.exec(H), hs = shot && shot[1];
  const rd = () => { try { return JSON.parse(localStorage.getItem(LS)) || {} } catch (e) { return {} } };
  const wr = o => { try { localStorage.setItem(LS, JSON.stringify(o)) } catch (e) {} };
  const T = m => typeof toast === 'function' ? toast(m) : 0;
  const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ---- Version anzeigen (eine Quelle: version.js) ----
  const ver = () => { const e = document.querySelector('.gr em'); if (e) { e.textContent = 'v' + A.version; e.title = 'Was ist neu?'; e.setAttribute('role', 'button'); e.tabIndex = 0; e.onclick = () => news(true); e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') news(true) } } };
  document.title = A.name + ' v' + A.version;
  const _p = window.parents;
  if (typeof _p === 'function') window.parents = function () { return _p.apply(null, arguments).replace(/Lernwerkstatt, Version [\d.]+/, A.name + ' ' + A.version) };

  // ---- Hinweise (Banner) ----
  function banner(cls, html, onAct) {
    const old = document.querySelector('.ss-upd.' + cls); if (old) old.remove();
    const b = document.createElement('div'); b.className = 'ss-upd ' + cls; b.setAttribute('role', 'status'); b.innerHTML = html; document.body.appendChild(b);
    b.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a) { b.remove(); onAct(a) } }; return b;
  }

  // ---- Was ist neu ----
  function news(manual) {
    if (document.querySelector('.ss-news')) return;
    const w = document.createElement('div'); w.className = 'ss-bk ss-news'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Was ist neu');
    w.innerHTML = `<div class="ss-sh"><h3>🎉 Was ist neu?</h3><p class="ss-s">Schrauberschule Version ${A.version}</p><ul class="ss-new">${A.news.map(n => `<li>${n}</li>`).join('')}</ul><button class="ss-b" data-a="ok">Alles klar!</button></div>`;
    document.body.appendChild(w); const b = w.querySelector('button'); b.focus();
    const close = () => w.remove(); w.onclick = e => { if (e.target === w || (e.target.dataset && e.target.dataset.a)) close() }; w.onkeydown = e => { if (e.key === 'Escape') close() };
    const o = rd(); o.seen = A.version; wr(o);
  }
  window.SS_news = news;

  // ---- Service Worker + Update ----
  let reloading = false, asked = false;
  function offerUpdate(reg) {
    if (asked || !reg.waiting) return; asked = true;
    banner('upd', '<span>✨ Neue Version verfügbar</span><button class="go" data-a="u">Jetzt aktualisieren</button><button data-a="x" aria-label="Später">Später</button>', a => {
      if (a === 'u') { if (reg.waiting) reg.waiting.postMessage({type: 'SKIP_WAITING'}); else location.reload() } else asked = false; });
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !hs) {
    const had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!had && !rd().offlineSaid) { const o = rd(); o.offlineSaid = 1; wr(o); setTimeout(() => T('Jetzt auch ohne Internet nutzbar ✓'), 600); return } if (reloading) return; reloading = true; location.reload() });
    addEventListener('load', () => navigator.serviceWorker.register(new URL('sw.js', location.href).href).then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg);
      reg.addEventListener('updatefound', () => { const n = reg.installing; if (n) n.addEventListener('statechange', () => { if (n.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(reg) }) });
      const chk = () => reg.update().catch(() => {}); document.addEventListener('visibilitychange', () => { if (!document.hidden) chk() }); setInterval(chk, 36e5);
    }).catch(() => {}));
  }
  // Test-Hook für den Service Worker (nur mit ?swtest=1 über http): schreibt Status in den Titel
  if (/swtest=1/.test(location.search) && 'serviceWorker' in navigator) addEventListener('load', () => setTimeout(async () => { const k = await caches.keys(), r = await navigator.serviceWorker.getRegistration(); document.title = 'SW ' + JSON.stringify({ctrl: !!navigator.serviceWorker.controller, active: !!(r && r.active), scope: r && r.scope, caches: k, n: k.length ? (await (await caches.open(k.find(x => /core/.test(x)))).keys()).length : 0}) }, 5000));
  // Test-Hooks
  if (hs === 'p9test' || hs === 'migtest') addEventListener('load', () => setTimeout(() => { const x = document.createElement('script'); x.src = 'v2/p9-test.js'; document.body.appendChild(x) }, 1200));
  if (hs === 'update') addEventListener('load', () => setTimeout(() => banner('upd', '<span>✨ Neue Version verfügbar</span><button class="go" data-a="u">Jetzt aktualisieren</button><button data-a="x">Später</button>', () => {}), 700));
  if (hs === 'neu') addEventListener('load', () => setTimeout(() => news(true), 700));

  // ---- Start: Version, "Was ist neu" nach Update ----
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ver); else ver();
  addEventListener('load', () => { ver(); if (hs) return;
    const o = rd(), st = (() => { try { return JSON.parse(localStorage.getItem('wt-state-v1')) } catch (e) { return null } })(), used = st && ((st.points | 0) > 0 || (st.days || []).length);
    if (o.seen !== A.version) { if (used || o.seen) setTimeout(news, 2500); else { o.seen = A.version; wr(o) } } });

  // ---- Zurück-Taste = App-Zurück ----
  if (typeof window.render === 'function' && typeof view !== 'undefined') {
    let last = view, popping = false; const rr = window.render;
    try { history.replaceState({v: view}, '') } catch (e) {} document.body.dataset.v = view;
    window.render = function () { const r = rr.apply(this, arguments); document.body.dataset.v = view; if (!popping && view !== last) { try { history.pushState({v: view}, '') } catch (e) {} } last = view; return r };
    addEventListener('popstate', e => { const st = e.state; if (!st || st.ssModal || document.querySelector('.ss-bk,.inst-bk')) return; if (st.v && st.v !== view) { popping = true; try { if (typeof go === 'function') go(st.v); else { view = st.v; render() } } finally { popping = false; last = view } } });
  }

  // ---- Tastatur: Pfeile zwischen Tabs, Esc schließt Fenster, Enter/Leertaste auf Karten ----
  document.addEventListener('keydown', e => {
    if (e.target.matches && e.target.matches('input,textarea,select')) return;
    if (e.key === 'Escape') { const m = document.querySelector('.inst-bk,.ss-news,.ss-conf'); if (m) m.remove(); return }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && document.querySelector('#tab button') && !document.querySelector('.ss-bk,.inst-bk') && !(typeof view !== 'undefined' && view === 'run')) {
      const b = [...document.querySelectorAll('#tab button')]; const i = b.findIndex(x => x.classList.contains('on')); if (i < 0) return; const n = b[(i + (e.key === 'ArrowRight' ? 1 : b.length - 1)) % b.length]; if (document.activeElement && document.activeElement.closest && document.activeElement.closest('#app')) return; n.click(); setTimeout(() => { const nb = document.querySelector('#tab button.on'); if (nb) nb.focus() }, 50);
    }
  });
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[onclick]:not(button):not(a):not(input):not(textarea)') && e.target.getAttribute('role') !== 'presentation') { e.preventDefault(); e.target.click() } });
  // Tastaturfokus sichtbar machen; Karten/Chips mit onclick fokussierbar
  const mk = () => document.querySelectorAll('#app [onclick]:not(button):not(a):not(input):not(textarea):not([tabindex])').forEach(x => { x.tabIndex = 0; if (!x.getAttribute('role')) x.setAttribute('role', 'button') });
  new MutationObserver(() => { clearTimeout(mk.t); mk.t = setTimeout(mk, 80) }).observe(document.body, {childList: true, subtree: true}); mk();
  document.addEventListener('pointerdown', () => document.body.classList.remove('kbd')); document.addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.add('kbd') });
})();
