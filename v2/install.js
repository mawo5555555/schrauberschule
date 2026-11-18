'use strict';
// Installationshinweis (Prototyp): Bottom-Sheet bzw. Desktop-Pille, Geräteerkennung per User-Agent.
// Test-Hooks: #shot=install-ios | install-ipad | install-ios-chrome | install-android | install-android-menu | install-samsung | install-firefox | install-desktop
// Testparameter: #sim=standalone (tut so, als läuft die App schon installiert), #sim=reset (Zähler löschen)
(function () {
  const LS = 'schrauber_install_v1', H = location.hash, UA = navigator.userAgent || '';
  const shotM = /shot=([\w-]+)/.exec(H), shot = shotM ? shotM[1] : null, hook0 = shot && /^install-/.test(shot) ? shot : null, fz = hook0 && /-s([123])$/.exec(hook0), hook = hook0 && hook0.replace(/-s[123]$/, '');
  const sim = /sim=(\w+)/.exec(H); if (sim && sim[1] === 'reset') try { localStorage.removeItem(LS) } catch (e) {}
  const rd = () => { try { return JSON.parse(localStorage.getItem(LS)) || {} } catch (e) { return {} } };
  const wr = o => { try { localStorage.setItem(LS, JSON.stringify(o)) } catch (e) {} };
  const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
  const standalone = () => (sim && sim[1] === 'standalone') || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  let deferred = null, freeze = fz ? +fz[1] - 1 : -1, fake = false, el = null, timer = null;

  // ---- Gerät erkennen ----
  function detect(forced) {
    if (forced) return {
      'install-ios': {os: 'ios', br: 'safari', pad: false}, 'install-ipad': {os: 'ios', br: 'safari', pad: true},
      'install-ios-chrome': {os: 'ios', br: 'chrome', pad: false}, 'install-android': {os: 'android', br: 'chrome'}, 'install-android-menu': {os: 'android', br: 'chrome'}, 'install-android-yes': {os: 'android', br: 'chrome'},
      'install-samsung': {os: 'android', br: 'samsung'}, 'install-firefox': {os: 'android', br: 'firefox'}, 'install-desktop': {os: 'desktop', br: 'chrome'}}[forced];
    const ipadOS = /Macintosh/.test(UA) && navigator.maxTouchPoints > 1;
    if (/iPhone|iPad|iPod/.test(UA) || ipadOS) {
      const br = /CriOS/.test(UA) ? 'chrome' : /FxiOS/.test(UA) ? 'firefox' : /EdgiOS/.test(UA) ? 'edge' : 'safari';
      return {os: 'ios', br, pad: /iPad/.test(UA) || ipadOS};
    }
    if (/Android/.test(UA)) {
      const br = /SamsungBrowser/.test(UA) ? 'samsung' : /Firefox/.test(UA) ? 'firefox' : /EdgA|OPR\/|OPT\//.test(UA) ? 'other' : 'chrome';
      return {os: 'android', br};
    }
    return {os: 'desktop', br: /Edg\//.test(UA) ? 'edge' : /Chrome\//.test(UA) ? 'chrome' : (/Safari\//.test(UA) && /Macintosh/.test(UA) && !/Firefox|OPR\//.test(UA)) ? 'safari' : 'other'};
  }

  // ---- eigene Symbole (24er Raster, currentColor) ----
  const IC = {
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v7A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 17.5 10H16"/><path d="M12 15V3.5M8.5 7 12 3.5 15.5 7"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5.5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18.5" r="2"/></svg>',
    bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="5"/><path d="m8.5 12.3 2.5 2.5 4.5-5"/></svg>',
    mon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/></svg>'
  };

  // ---- Texte je Variante ----
  function plan(d) {
    const T = (ic, h, s) => ({ic, h, s});
    if (d.os === 'ios') {
      const where = d.br === 'safari' ? (d.pad ? 'Tippe oben in der Leiste auf das <b>Teilen-Symbol</b> (Quadrat mit Pfeil nach oben).' : 'Tippe unten in der Mitte auf das <b>Teilen-Symbol</b> (Quadrat mit Pfeil nach oben).')
        : d.br === 'chrome' ? 'Tippe oben rechts neben der Adressleiste auf das <b>Teilen-Symbol</b> (Quadrat mit Pfeil nach oben).'
        : 'Tippe auf das <b>Teilen-Symbol</b> (Quadrat mit Pfeil nach oben) in der Adressleiste oder im Menü.';
      const pos = d.br === 'safari' ? (d.pad ? 'top' : 'bottom') : 'topright';
      return {title: 'App auf den Home-Bildschirm', sub: 'Dann öffnet sich die Schrauberschule wie eine echte App, ganz ohne Browser-Leiste.', pos, menu: 'sheet', home: true,
        steps: [T('share', where), T('plus', 'Scrolle im Menü etwas nach unten und tippe auf <b>„Zum Home-Bildschirm“</b>.', 'Taucht es nicht auf: ganz unten auf „Mehr“ oder „Aktionen bearbeiten“ schauen.'), T('ok', 'Tippe oben rechts auf <b>„Hinzufügen“</b>. Fertig!')]};
    }
    if (d.os === 'android') {
      if (d.br === 'samsung') return {title: 'App zum Startbildschirm', sub: 'Dann liegt die Schrauberschule als App-Symbol bei deinen Apps.', pos: 'bottomright', menu: 'dropdown', icon: 'bars',
        steps: [T('bars', 'Tippe unten rechts auf das <b>Menü ☰</b> (drei Striche).'), T('plus', 'Tippe auf <b>„Zum Startbildschirm hinzufügen“</b> bzw. <b>„Seite hinzufügen zu“</b> und dann auf Startbildschirm.', 'Je nach Version steht es etwas anders da.'), T('ok', 'Bestätige mit <b>„Hinzufügen“</b>. Fertig!')]};
      if (d.br === 'firefox') return {title: 'App installieren', sub: 'Dann liegt die Schrauberschule als App-Symbol bei deinen Apps.', pos: 'topright', menu: 'dropdown', icon: 'dots',
        steps: [T('dots', 'Tippe oben rechts auf das <b>Menü ⋮</b> (drei Punkte).'), T('plus', 'Tippe auf <b>„Installieren“</b>.', 'Alternativ „Zum Startbildschirm hinzufügen“.'), T('ok', 'Bestätige mit <b>„Hinzufügen“</b>. Fertig!')]};
      return {title: 'App installieren', sub: 'Dann liegt die Schrauberschule als App-Symbol bei deinen Apps und öffnet sich ohne Browser-Leiste.', pos: 'topright', menu: 'dropdown', icon: 'dots', button: true,
        steps: [T('dots', 'Tippe oben rechts auf das <b>Menü ⋮</b> (drei Punkte).'), T('plus', 'Tippe auf <b>„App installieren“</b> bzw. <b>„Zum Startbildschirm hinzufügen“</b>.'), T('ok', 'Bestätige mit <b>„Installieren“</b>. Fertig!')]};
    }
    return {title: 'App installieren', desktop: true};
  }

  // ---- animierte Bühne (nachgezeichnetes Handy, 3 Szenen) ----
  function stage(p) {
    const ic = k => IC[k].replace('<svg ', '<svg x="0" y="0" ').replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="22" height="22"');
    const bar = {bottom: [66, 134, 88, 14, 110, 141], bottomright: [66, 134, 88, 14, 148, 141], top: [66, 18, 88, 14, 110, 25], topright: [66, 18, 88, 14, 148, 25]}[p.pos];
    const [bx, by, bw, bh, cx, cy] = bar, icon = p.icon || 'share';
    const inner = k => `<g transform="translate(${cx - 8},${cy - 8}) scale(.67)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#5fb8ff">${IC[k].replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</g>`.replace('<g ', '<g ');
    const s1 = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="7" fill="#1a2a42"/><circle class="inst-pulse" cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#5fb8ff" stroke-width="2"/>${inner(icon)}`;
    const rows = (x, y, w, hl) => [0, 1, 2, 3].map(i => `<rect x="${x}" y="${y + i * 17}" width="${w}" height="12" rx="4" fill="${i === hl ? '#1f6fe0' : '#1a2a42'}"/>${i === hl ? `<g transform="translate(${x + 3},${y + i * 17 + 1}) scale(.42)" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="color:#fff">${IC.plus.replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</g><rect x="${x + 17}" y="${y + i * 17 + 4}" width="${w - 28}" height="4" rx="2" fill="#fff" opacity=".85"/>` : `<rect x="${x + 8}" y="${y + i * 17 + 4}" width="${w - 28}" height="4" rx="2" fill="#2f4767"/>`}`).join('');
    const s2 = p.menu === 'sheet' ? `<g class="inst-rise"><rect x="62" y="60" width="96" height="94" rx="10" fill="#101c2f" stroke="#2f4767"/>${rows(68, 70, 84, 2)}</g>`
      : `<g class="inst-rise"><rect x="${p.pos === 'bottomright' ? 92 : 94}" y="${p.pos === 'bottomright' ? 64 : 34}" width="64" height="${p.pos === 'bottomright' ? 66 : 70}" rx="8" fill="#101c2f" stroke="#2f4767"/>${rows(98, p.pos === 'bottomright' ? 70 : 40, 52, 1)}</g>`;
    const apps = [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${72 + (i % 3) * 25}" y="${34 + Math.floor(i / 3) * 28}" width="19" height="19" rx="5" fill="${i === 5 ? 'none' : '#1a2a42'}"/>`).join('');
    const s3 = `${apps}<g class="inst-pop"><rect x="122" y="90" width="19" height="19" rx="5" fill="#1f6fe0"/><text x="131.5" y="104" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="12" fill="#fff">S</text></g>`;
    return `<svg class="inst-stage s1" viewBox="0 0 220 160" aria-hidden="true"><rect x="55" y="4" width="110" height="152" rx="16" fill="#070b12" stroke="#5fb8ff" stroke-opacity=".7" stroke-width="2"/><rect x="62" y="12" width="96" height="136" rx="9" fill="#0c1626"/><g class="sc sc1">${s1}</g><g class="sc sc2"><g opacity=".55">${s1.replace(/class="inst-pulse"/, '')}</g>${s2}</g><g class="sc sc3">${s3}</g></svg>`;
  }

  // ---- Anzeige ----
  function close() { clearInterval(timer); if (el) { el.remove(); el = null } }
  function later() { const o = rd(); o.laterAt = o.starts || 0; wr(o); close() }
  function never() { const o = rd(); o.hide = 1; wr(o); close() }
  async function doInstall() {
    if (deferred) { const e = deferred; deferred = null; try { e.prompt(); const r = await e.userChoice; if (r && r.outcome === 'accepted') { const o = rd(); o.installed = 1; wr(o) } } catch (x) {} close() }
  }
  function show(d, manual) {
    close(); const p = plan(d), anim = !reduced(), canBtn = !!deferred || (fake && d.os !== 'ios');
    if (p.desktop) {
      const can = !!deferred || fake;
      el = document.createElement('div'); el.className = 'inst-pill'; el.setAttribute('role', 'dialog');
      el.innerHTML = `${IC.mon}<span>${can ? 'Schrauberschule als App installieren?' : (d.br === 'chrome' || d.br === 'edge') ? 'Als App installieren: Tippe in der Adressleiste rechts auf das Installieren-Symbol.' : d.br === 'safari' ? 'Als App installieren: Menü „Ablage“ → „Zum Dock hinzufügen“.' : 'Als App installieren: Dein Browser bietet das im Menü an (Seite als App sichern).'}</span>${can ? '<button class="go" data-a="i">Installieren</button>' : ''}<button class="x" data-a="l" aria-label="Später">${manual ? 'Zu' : 'Später'}</button>`;
      document.body.appendChild(el);
      el.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'i') doInstall(); else if (a === 'l') (manual ? close : later)() };
      return;
    }
    if (d.os === 'android' && deferred && !manual) { // Ein-Tipp-Installation mit eigener Bestätigung
      el = document.createElement('div'); el.className = 'inst-bk'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.innerHTML = `<div class="inst-sh"><div class="inst-hd"></div><h3>Schrauberschule als App installieren?</h3><p class="inst-sub">Dann liegt sie als App-Symbol bei deinen Apps, startet ohne Browser-Leiste und funktioniert auch ohne Internet.</p><div class="inst-row"><button class="inst-b alt" data-a="l">Später</button><button class="inst-b" data-a="i">Ja, installieren</button></div><button class="inst-nm" data-a="n">Nicht mehr zeigen</button></div>`;
      document.body.appendChild(el); el.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'i') doInstall(); else if (a === 'l') later(); else if (a === 'n') never(); else if (e.target === el) later() };
      el.onkeydown = e => { if (e.key === 'Escape') later() }; const yes = el.querySelector('[data-a=i]'); if (yes) yes.focus(); return;
    }
    el = document.createElement('div'); el.className = 'inst-bk' + (anim ? ' inst-anim' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="inst-sh"><div class="inst-hd"></div><h3>${p.title}</h3><p class="inst-sub">${p.sub}</p>
      ${canBtn && d.os === 'android' ? '<button class="inst-b" data-a="i">App installieren</button>' : ''}
      ${anim ? stage(p) : ''}<ol class="inst-steps">${p.steps.map((s, i) => `<li class="${i === 0 ? 'on' : ''}">${IC[s.ic]}<div>${s.h}${s.s ? `<small>${s.s}</small>` : ''}</div></li>`).join('')}</ol>
      <div class="inst-row"><button class="inst-b alt" data-a="l">${manual ? 'Schließen' : 'Später'}</button></div>${manual ? '' : '<button class="inst-nm" data-a="n">Nicht mehr zeigen</button>'}</div>`;
    document.body.appendChild(el);
    el.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'i') doInstall(); else if (a === 'l') (manual ? close : later)(); else if (a === 'n') never(); else if (e.target === el) (manual ? close : later)() };
    if (anim) { const st = el.querySelector('.inst-stage'), li = [...el.querySelectorAll('.inst-steps li')]; let n = Math.max(0, freeze);
      st.setAttribute('class', 'inst-stage s' + (n + 1)); li.forEach((x, i) => x.classList.toggle('on', i === n));
      if (freeze < 0) timer = setInterval(() => { n = (n + 1) % 3; st.setAttribute('class', 'inst-stage s' + (n + 1)); li.forEach((x, i) => x.classList.toggle('on', i === n)) }, 2800) }
  }

  // ---- Start ----
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (el && !hook) { const d = detect(); show(d, el.dataset.manual) } });
  function hdrBtn() { // dauerhafter Installieren-Knopf in der Kopfzeile (nur wenn nicht installiert)
    const g = document.querySelector('.gr'); if (!g || standalone() || shot) return; let b = g.querySelector('.inst-hb');
    const d = detect(), can = deferred || (d.os === 'desktop' && d.br === 'safari') || d.os === 'ios'; if (!can) { if (b) b.remove(); return }
    if (!b) { b = document.createElement('button'); b.className = 'inst-hb'; b.type = 'button'; b.innerHTML = IC.mon + '<span>App</span>'; b.setAttribute('aria-label', 'Als App installieren'); b.onclick = () => deferred ? show(detect(), true) || (el && (el.dataset.manual = '1')) : window.installHint(); g.insertBefore(b, g.querySelector('#snd')) }
  }
  window.addEventListener('beforeinstallprompt', () => setTimeout(hdrBtn, 50)); window.addEventListener('load', () => setTimeout(hdrBtn, 1200));
  window.addEventListener('appinstalled', () => { const o = rd(); o.installed = 1; wr(o); deferred = null; close() });

  window.installHint = function () { // manuell, z. B. aus der Eltern-Seite
    if (standalone()) return typeof toast === 'function' ? toast('Du nutzt die App schon. Alles gut!') : 0;
    const d = detect(); show(d, true); if (el) el.dataset.manual = '1';
  };

  // Starts zählen pro Sitzung (Seitenaufruf-Session)
  const o = rd(); try { if (!sessionStorage.getItem('inst_s')) { sessionStorage.setItem('inst_s', '1'); o.starts = (o.starts || 0) + 1; wr(o) } } catch (e) {}

  function auto() {
    if (hook) { if (hook === 'install-android-yes') deferred = {prompt() {}, userChoice: Promise.resolve({outcome: 'dismissed'})}; const d = detect(hook); fake = hook !== 'install-android-menu' && hook !== 'install-ios' && hook !== 'install-ipad' && hook !== 'install-ios-chrome' && hook !== 'install-samsung' && hook !== 'install-firefox'; show(d, false); return }
    if (shot) return;                       // Shot-Modus ohne Hook: nie anzeigen
    if (standalone()) return;
    const s = rd(); if (s.hide || s.installed) return;
    if (s.laterAt !== undefined && (s.starts || 0) - s.laterAt < 3) return;
    const d = detect(); if (d.os === 'desktop' && d.br === 'other') return;
    if (d.os === 'desktop' && d.br === 'safari' && (s.starts || 0) < 2) return;
    show(d, false);
  }
  const go = () => setTimeout(auto, hook ? 400 : 1800);
  document.readyState === 'complete' ? go() : window.addEventListener('load', go);

  // Eltern-Seite: Karte "App installieren"
  const pp = window.parents;
  if (typeof pp === 'function') window.parents = function () {
    const h = pp.apply(null, arguments), card = '<div class="card"><div class="row sp"><b>App installieren / Zum Home-Bildschirm</b></div><p class="m">Zeigt Schritt für Schritt, wie die Schrauberschule als App auf dein Gerät kommt.</p><button class="btn alt" onclick="installHint()">Anleitung zeigen</button></div>';
    const i = h.indexOf('<div class="card"><b>Version</b>'); return i < 0 ? h + card : h.slice(0, i) + card + h.slice(i);
  };
})();
