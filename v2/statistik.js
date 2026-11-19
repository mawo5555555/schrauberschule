'use strict';
// Anonyme Besucherzahlen (GoatCounter), STANDARD: AN (Eltern können sie auf der Elternseite ausschalten). Siehe v2/STATISTIK.md
// Aktiv nur, wenn ALLES zutrifft:
//   1. window.APP_STAT_ENABLED === true   (Schalter des Entwicklers, steht in index.html, Standard false)
//   2. window.APP_STAT_ENDPOINT ist ein gültiger https-Endpunkt auf /count (Standard leer)
//   3. Eltern haben den Schalter nicht ausgeschaltet (Standard an)
//   4. Do-Not-Track / Global Privacy Control ist NICHT gesetzt
//   5. Seite läuft über http(s) und nicht auf localhost
// Gesendet wird nur: grober Ansichtsname (z. B. "/start", "/werkstatt"). Kein Cookie, keine ID, kein Titel, keine Referrer-Adresse,
// keine Bildschirmgröße, kein Spielstand, keine Namen, keine Mission-Namen. Solange nicht aktiv, wird nichts geladen und nichts gesendet.
(function () {
  const OPT = 'ss-stat-optin';   // Geräte-Einstellung der Eltern (bewusst nicht im Spielstand)
  const cfg = () => ({on: window.APP_STAT_ENABLED === true, ep: String(window.APP_STAT_ENDPOINT || '')});
  const epOk = ep => /^https:\/\/[a-z0-9.-]+\/count$/i.test(ep);
  const dnt = () => { const n = navigator; return n.doNotTrack === '1' || n.doNotTrack === 'yes' || window.doNotTrack === '1' || n.msDoNotTrack === '1' || n.globalPrivacyControl === true };
  // Standard AN (anonym, ohne Cookie/Kennung, DSGVO-arm); Eltern können es ausschalten
  const optin = () => { try { return localStorage.getItem(OPT) !== '0' } catch (e) { return false } };
  const setOpt = v => { try { localStorage.setItem(OPT, v ? '1' : '0') } catch (e) {} };
  const localHost = () => !/^https?:$/.test(location.protocol) || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname);
  let locT = null;   // nur für den Selbsttest
  const blocked = () => locT !== null ? locT : (localHost() || /shot=/.test(location.hash));
  const active = () => { const c = cfg(); return c.on && epOk(c.ep) && optin() && !dnt() && !blocked() };
  // grobe Namen, alles andere zählt als "/andere"
  const NAMES = {home: 'start', missions: 'lernen', garage: 'garage', ws: 'garage', veh: 'garage', parents: 'eltern', w2: 'werkstatt', hub: 'missionen', run: 'mission'};
  let last = '', sent = [], send = (url, opts) => fetch(url, opts);
  function count(v) {
    if (!active()) return;
    const p = '/' + (NAMES[v] || 'andere'); if (p === last) return; last = p;
    const url = cfg().ep + '?p=' + encodeURIComponent(p) + '&t=&r=&rnd=' + Math.random().toString(36).slice(2, 8);
    sent.push(url);
    try { send(url, {method: 'GET', mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true, cache: 'no-store'}).catch(() => {}) } catch (e) {}
  }
  // Ereignisse (Missionen, Bewertungen, Prüfstand, Lack, Waschen): nur grobe Namen, nie Spielername oder Spielstand
  const evSeen = {};
  function ev(name) {
    if (!active()) return; const k = String(name).replace(/[^a-z0-9\/_-]/gi, '').slice(0, 60); const now = Date.now(); if (evSeen[k] && now - evSeen[k] < 5000) return; evSeen[k] = now;
    const url = cfg().ep + '?p=' + encodeURIComponent(k) + '&e=true&t=&r=&rnd=' + Math.random().toString(36).slice(2, 8); sent.push(url);
    try { send(url, {method: 'GET', mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true, cache: 'no-store'}).catch(() => {}) } catch (e) {}
  }
  const wrap = (k, fn) => { const o = window[k]; if (typeof o === 'function') window[k] = function () { try { fn.apply(null, arguments) } catch (e) {} return o.apply(this, arguments) } };
  setTimeout(() => {
    wrap('start', id => { const m = (typeof MISSIONS !== 'undefined' ? MISSIONS : []).find(x => x.id === id); ev('mission-start/' + (m ? m.subject : 'x') + '/' + id) });
    wrap('finish', () => { const R = typeof run !== 'undefined' && run, m = R && R.m; if (m) ev('mission-fertig/' + (m.subject || 'box') + '/' + m.id); if (R && R.score) ev('bewertung/' + run.score + '-sterne') });
    wrap('w2Run', () => ev('pruefstand/' + ((window.W2 && W2.veh) || 'x'))); wrap('kRun', () => ev('pruefstand/klapprad'));
    if (window.LACK && LACK.open) { const o = LACK.open; LACK.open = function () { ev('lackieren'); return o.apply(this, arguments) } }
    if (window.WASCH && WASCH.open) { const o = WASCH.open; WASCH.open = function () { ev('waschen'); return o.apply(this, arguments) } }
    ev('version/' + ((self.APP && APP.version) || '?') + (window.matchMedia && matchMedia('(display-mode: standalone)').matches ? '/installiert' : '/browser'));
  }, 800);
  // Ansicht beobachten (nur wenn aktiv wird überhaupt gezählt; sonst kehrt count() sofort zurück)
  if (typeof render === 'function') { const r = render; render = function () { const x = r.apply(this, arguments); try { count(view) } catch (e) {} return x } }
  // Eltern-Seite: Hinweis immer, Schalter erst bei konfiguriertem Endpunkt
  function card() {
    const c = cfg(), conf = epOk(c.ep), on = c.on && conf && optin() && !dnt();
    const state = on ? 'an' : 'aus';
    const why = !conf ? 'Diese App sendet derzeit nichts an irgendeinen Server.' : !c.on ? 'Die Zählung ist vom Entwickler noch nicht freigegeben, es wird nichts gesendet.' : dnt() ? 'Dein Browser hat „Do Not Track“ eingestellt. Darum wird nichts gesendet.' : '';
    return `<div class="card" id="statcard"><div class="row sp"><b>Anonyme Nutzungsstatistik: ${state}</b>${conf && c.on ? `<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" ${optin() ? 'checked' : ''} ${dnt() ? 'disabled' : ''} onchange="STAT.set(this.checked)"> ${optin() ? 'an' : 'aus'}</label>` : ''}</div>
    <p class="m">${why ? why + ' ' : ''}Ein datensparsamer Zähler (GoatCounter) zählt, welche Bereiche geöffnet und welche Missionen begonnen, geschafft und mit wie vielen Sternen bewertet werden. So kann der Entwickler die App verbessern. Es gibt kein Cookie, keine Kennung, keinen Namen und keinen Spielstand. Du kannst es jederzeit wieder ausschalten.</p></div>`;
  }
  const pp = window.parents;
  if (typeof pp === 'function') window.parents = function () {
    const h = pp.apply(null, arguments), i = h.indexOf('<div class="card"><b>Version</b>'); return i < 0 ? h + card() : h.slice(0, i) + card() + h.slice(i);
  };
  window.STAT = {
    ev,
    set(v) { setOpt(!!v); if (typeof render === 'function' && view === 'parents') render() },
    active, state: () => ({enabled: cfg().on, endpoint: !!epOk(cfg().ep), optin: optin(), dnt: dnt(), local: blocked(), active: active(), sent: sent.length}),
    // Selbsttest (nur Hook #shot=p8-stat-test): prüft Standard = nichts gesendet, und mit allen Freigaben + Stub-Netz genau eine grobe Anfrage
    _test() {
      const res = [], ok = (n, c) => res.push((c ? 'OK ' : 'FEHLER ') + n);
      const save = {on: window.APP_STAT_ENABLED, ep: window.APP_STAT_ENDPOINT, send, last, sent: sent.slice()}, calls = [];
      send = (u, o) => { calls.push([u, o]); return Promise.resolve() };
      window.APP_STAT_ENABLED = undefined; window.APP_STAT_ENDPOINT = ''; last = ''; count('home'); ok('Standard: keine Anfrage', calls.length === 0);
      window.APP_STAT_ENABLED = true; window.APP_STAT_ENDPOINT = 'https://test.goatcounter.com/count'; setOpt(true); last = ''; count('home'); ok('freigegeben, aber file/localhost: keine Anfrage', calls.length === 0); setOpt(true);
      locT = false; last = ''; count('home'); ok('alle Freigaben + Stub: genau 1 Anfrage', calls.length === 1); const u = calls[0] && calls[0][0] || ''; ok('Anfrage nur grober Pfad, ohne Titel/Referrer', /\?p=%2Fstart&t=&r=&rnd=\w+$/.test(u) && calls[0][1].credentials === 'omit' && calls[0][1].referrerPolicy === 'no-referrer');
      last = ''; setOpt(false); count('home'); ok('Eltern-Schalter aus: keine weitere Anfrage', calls.length === 1); locT = null;
      ok('Endpunkt-Prüfung gut', epOk('https://abc.goatcounter.com/count') && !epOk('http://abc.goatcounter.com/count') && !epOk('https://abc.goatcounter.com/x') && !epOk(''));
      setOpt(false); window.APP_STAT_ENABLED = save.on; window.APP_STAT_ENDPOINT = save.ep; send = save.send; last = save.last; sent = save.sent;
      return res;
    }
  };
  if (/shot=p8-stat-test/.test(location.hash)) setTimeout(() => { const r = STAT._test(); document.title = r.join(' | '); const d = document.createElement('pre'); d.id = 'p8stat'; d.textContent = r.join('\n'); document.body.appendChild(d); console.log('STATTEST ' + r.join(' | ')) }, 300);
})();
