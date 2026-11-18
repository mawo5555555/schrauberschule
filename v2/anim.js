'use strict';
// Paket 5: Animationen und Bedienfeeling. Nur transform/opacity. Respektiert prefers-reduced-motion.
(function () {
  const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e };
  const guard = f => { try { return f() } catch (e) { return undefined } };

  // ---------- Sounds (Web Audio über FX) ----------
  Object.assign(FX, {
    tick() { if (!this.on()) return; this.noise(.018, 2600, .10, 'bandpass'); this.tone(640, .045, .05, 'triangle') },
    coinSnd() { if (!this.on()) return; this.tone(1568, .12, .08, 'triangle'); setTimeout(() => this.tone(2093, .16, .06, 'triangle'), 60) },
    // Rolltor: Rohrmotor (Brummen mit Anlauf), Lamellen-Klacken im Takt des Aufwickelns, Kettenrasseln, Endanschlag mit Nachwippen. Alles auf der Audio-Zeitachse geplant, im Takt der Bildkurve (window.__TOR).
    gateSnd() {
      if (!this.on()) return; const c = this.A(); if (!c) return; const TOR = window.__TOR; if (!TOR) return;
      const t0 = c.currentTime + .18, out = this.out(), T = TOR.T;
      const vel = t => Math.max(0, (TOR.pos(t + .01) - TOR.pos(t - .01)) / .02);     // Geschwindigkeit relativ
      const vmax = 1 / (TOR.tv + (TOR.ta + TOR.tb) / 2);
      // Motor: zwei leicht verstimmte Sägezahn (Netzbrummen 50 Hz Obertöne) + Getriebe-Heulen, Tonhöhe und Pegel folgen der Geschwindigkeit
      const mix = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.4; mix.connect(lp); lp.connect(out); mix.gain.value = 0;
      const o1 = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator(); o1.type = 'sawtooth'; o2.type = 'sawtooth'; o3.type = 'triangle';
      const g3 = c.createGain(); g3.gain.value = .22; o1.connect(mix); o2.connect(mix); o3.connect(g3); g3.connect(mix);
      for (let t = 0; t <= T + .05; t += .02) { const v = vel(t) / vmax, tt = t0 + t; o1.frequency.setValueAtTime(52 + 9 * v, tt); o2.frequency.setValueAtTime(52.6 + 9.4 * v, tt); o3.frequency.setValueAtTime(310 + 170 * v, tt); lp.frequency.setValueAtTime(190 + 380 * v, tt); mix.gain.setValueAtTime(.012 + .05 * Math.min(1, v * 1.2), tt) }
      mix.gain.setTargetAtTime(0, t0 + T + .02, .06);
      [o1, o2, o3].forEach(o => { o.start(t0); o.stop(t0 + T + .6) });
      // Rauschbett (Rolle auf Welle)
      const nb = c.createBuffer(1, c.sampleRate * .5, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      const click = (tt, f, g, d, type) => { const s = c.createBufferSource(); s.buffer = nb; const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = 1.6; const gg = c.createGain(); gg.gain.setValueAtTime(g, tt); gg.gain.exponentialRampToValueAtTime(.0005, tt + d); s.connect(fl); fl.connect(gg); gg.connect(out); s.start(tt, Math.random() * .3, d + .02) };
      // Lamellen: je Lamelle ein "tack" (Tonhöhe leicht steigend, weil der Wickel dicker wird)
      const N = 30; for (let i = 1; i <= N; i++) { const t = TOR.inv(i / N * .98), tt = t0 + t, v = vel(t) / vmax; click(tt, 900 + 500 * Math.random() + i * 12, .05 + .08 * v, .028); const tn = c.createOscillator(), tg = c.createGain(); tn.type = 'square'; tn.frequency.value = 120 + i * 2.5; tg.gain.setValueAtTime(.018 * (.4 + v), tt); tg.gain.exponentialRampToValueAtTime(.0005, tt + .03); tn.connect(tg); tg.connect(out); tn.start(tt); tn.stop(tt + .04) }
      // Kettenrasseln: unregelmäßige metallische Klicks, Rate folgt der Geschwindigkeit
      for (let t = 0; t < T;) { const v = vel(t) / vmax; if (v > .04 && Math.random() < .85) click(t0 + t, 2600 + Math.random() * 2600, .035 + .06 * v * Math.random(), .012, 'bandpass'); t += 1 / (10 + 46 * v) * (.6 + Math.random() * .8) }
      // Endanschlag: dumpfer Schlag + Blech-Klang, dann Nachwippen (abnehmende Klacks)
      const te = t0 + T; click(te, 180, .5, .22, 'lowpass'); click(te, 1800, .2, .12); const th = c.createOscillator(), hg = c.createGain(); th.type = 'sine'; th.frequency.setValueAtTime(95, te); th.frequency.exponentialRampToValueAtTime(48, te + .25); hg.gain.setValueAtTime(.22, te); hg.gain.exponentialRampToValueAtTime(.001, te + .3); th.connect(hg); hg.connect(out); th.start(te); th.stop(te + .32);
      [.13, .27, .4, .52].forEach((d, k) => { click(te + d, 1400 + 300 * k, .14 / (k + 1), .05); click(te + d, 220, .2 / (k + 1), .08, 'lowpass') });
      for (let k = 0; k < 14; k++) click(te + .02 + k * .045 + Math.random() * .02, 3000 + Math.random() * 2500, .05 * Math.exp(-k * .22), .01);
    },
    hyd(up) {
      if (!this.on()) return; const c = this.A(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime;
      o.type = 'sawtooth'; o.frequency.setValueAtTime(up ? 62 : 84, t); o.frequency.linearRampToValueAtTime(up ? 88 : 56, t + 1.05); f.type = 'lowpass'; f.frequency.value = 260;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07, t + .12); g.gain.setValueAtTime(.07, t + .85); g.gain.linearRampToValueAtTime(0, t + 1.15);
      o.connect(f); f.connect(g); g.connect(this.out()); o.start(t); o.stop(t + 1.2);
      this.noise(.5, 700, .1, 'lowpass'); setTimeout(() => { this.noise(.18, 2500, .1, 'highpass'); this.tone(200, .12, .06, 'square') }, 1100);
    }
  });

  // ---------- Buttons: Drück-Effekt, Klick-Ton, Haptik ----------
  const PR = 'button,.item,.fc,.opt,.opt2,.vt,.chip2,.tfx,.gk,.mb,.back,.card[onclick]';
  const hit = e => { const t = e.target && e.target.closest ? e.target.closest(PR) : null; return t && !t.disabled && !t.classList.contains('lockd') ? t : null };
  let pr = null;
  const unpress = () => { if (pr) { pr.classList.remove('prs'); pr = null } };
  document.addEventListener('pointerdown', e => { const t = hit(e); if (!t) return; unpress(); pr = t; t.classList.add('prs'); guard(() => navigator.vibrate && navigator.vibrate(8)) }, true);
  ['pointerup', 'pointercancel', 'pointerleave', 'scroll'].forEach(n => document.addEventListener(n, () => setTimeout(unpress, 70), true));
  document.addEventListener('click', e => { const t = hit(e); if (!t || t.matches('.opt2,.mods span')) return; FX.tick() }, true);

  // ---------- Bildschirmwechsel ----------
  const ORDER = {home: 0, w2: 1, pr: 2, missions: 3, garage: 4};
  const depth = v => v in ORDER ? 0 : 1;
  function dirOf(a, b) { const da = depth(a), db = depth(b); if (da !== db) return db > da ? 'fwd' : 'back'; return (ORDER[b] != null && ORDER[a] != null) ? (ORDER[b] >= ORDER[a] ? 'fwd' : 'back') : 'fwd' }
  // ---------- Rolltor (bei jedem App-Start beim ersten Betreten der Werkstatt) ----------
  const TORKEY = 'ss_tor_gesehen';
  const torGesehen = () => { try { return sessionStorage.getItem(TORKEY) === '1' } catch (e) { return false } };
  const torMerken = () => { try { sessionStorage.setItem(TORKEY, '1') } catch (e) {} };
  // Physikalisches Profil: Anfahren (Rampe), Fahrt, Ausrollen am Endanschlag, Nachwippen. t in Sekunden ab Motorstart, Rückgabe 0..1 (offen) und Geschwindigkeit
  const TOR = {ta: .55, tv: 1.0, tb: .5, tw: .75};   // Anlauf, Fahrt, Bremsen, Wippen
  TOR.T = TOR.ta + TOR.tv + TOR.tb;
  TOR.pos = t => {   // Weg 0..1, Anlauf mit sanftem Ruck (smoothstep-Beschleunigung), Bremsen weich
    const v = 1 / (TOR.tv + (TOR.ta + TOR.tb) / 2);   // Endgeschwindigkeit (Weg 1 insgesamt)
    if (t <= 0) return 0; if (t >= TOR.T) return 1;
    if (t < TOR.ta) { const u = t / TOR.ta; return v * TOR.ta * (u * u * u * (2 - u) / 2) }
    const s1 = v * TOR.ta / 2;
    if (t < TOR.ta + TOR.tv) return s1 + v * (t - TOR.ta);
    const u = (t - TOR.ta - TOR.tv) / TOR.tb, s2 = s1 + v * TOR.tv;
    return s2 + v * TOR.tb * (u - (u * u * u - u * u * u * u / 2));
  };
  TOR.bounce = t => { const u = Math.max(0, t) ; return Math.exp(-u * 7.5) * Math.sin(u * 26) * 7 };   // Nachwippen in px (gedämpfte Schwingung)
  TOR.inv = p => { let a = 0, b = TOR.T; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (TOR.pos(m) < p) a = m; else b = m } return (a + b) / 2 };
  function torBauen(frozenT) {
    if (document.querySelector('.rt')) return null;
    const H = innerHeight, W = innerWidth, boxH = 58;
        const g = mk('div', 'rt', `<div class="rl"></div><div class="rbx"><div class="rop"><div class="rc"><div class="rs"></div></div><div class="rsh"></div></div><div class="rfr"></div></div><div class="rk"><i class="rwl"></i><i class="rr1"></i><i class="rr2"></i></div>`);
    document.body.appendChild(g);
    const rc = g.querySelector('.rc'), rk = g.querySelector('.rk'), rl = g.querySelector('.rl'), rsh = g.querySelector('.rsh'), r1 = g.querySelector('.rr1'), r2 = g.querySelector('.rr2');
    const travel = (rc.offsetHeight || H) + 8;
    const frame = t => {
      const p = TOR.pos(t), bn = t > TOR.T ? TOR.bounce(t - TOR.T) : 0, y = -travel * p + (t > TOR.T ? bn * .6 : 0);
      rc.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
      rk.style.transform = `translate3d(0,${(t > TOR.T ? -bn * .35 : 0).toFixed(2)}px,0)`;
      rl.style.opacity = Math.min(.95, Math.pow(p, .8) * 1.1).toFixed(3);
      rsh.style.opacity = (Math.min(1, p * 4) * (1 - p * .5)).toFixed(3);
      rsh.style.transform = `translate3d(0,${(y + travel - 8).toFixed(1)}px,0)`;
      const w = .35 + .65 * p; r1.style.transform = `scaleY(${w.toFixed(3)})`; r2.style.opacity = (p).toFixed(3);
      // Lichtstreifen wandern durch die Lamellen (Glanz), nur transform
      rc.style.setProperty('--sh', (p * 60).toFixed(1));
    };
    if (frozenT != null) { frame(frozenT); return g }
    const t0 = performance.now() + 180; let done = false;
    const step = now => {
      const t = (now - t0) / 1000;
      if (t >= 0) frame(Math.min(t, TOR.T + TOR.tw));
      if (t < TOR.T + TOR.tw) requestAnimationFrame(step);
      else if (!done) { done = true; frame(TOR.T + TOR.tw); g.classList.add('fade'); setTimeout(() => g.remove(), 1300) }
    };
    requestAnimationFrame(step); setTimeout(() => g.remove(), 9000);
    return g;
  }
  function gate() {
    if (document.querySelector('.rt')) return;
    torMerken(); window.__torNeu = true; const g = torBauen(); FX.gateSnd(); return g;
  }
  window.__torBauen = torBauen; window.__TOR = TOR;
  const _go = window.go;
  window.go = function (v) {
    const old = view, args = arguments;
    if (v === 'w2') { gate(); return _go.apply(null, args) }   // Rolltor bei JEDEM Tipp auf Werkstatt, auch bei reduzierter Bewegung
    if (RM() || old === v) return _go.apply(null, args);
    const d = dirOf(old, v), de = document.documentElement;
    // M1: Browser-Übergang (startViewTransition) abgeschaltet: er schluckt Taps ca. 0,3 s lang (Karten reagierten erst beim 2. Antippen). Es bleibt die Gleit-Animation unten.
    if (false && document.startViewTransition) {
      de.dataset.vt = d; de.classList.add('vtx'); const my = window.__navTok = (window.__navTok || 0) + 1;
      // M1: die Übergangs-Funktion läuft erst einen Frame später. Hat der Nutzer inzwischen etwas Neues angetippt (anderer go-Aufruf, Fahrzeug, Mission), gewinnt die neuere Aktion; sonst sprang die App zurück.
      try { const t = document.startViewTransition(() => { if (my !== window.__navTok || view !== old) return; _go.apply(null, args) }); t.finished.finally(() => de.classList.remove('vtx')); return } catch (e) { de.classList.remove('vtx') }
    }
    _go.apply(null, args); const a = document.getElementById('app'); if (a) { a.classList.remove('pgf', 'pgb'); void a.offsetWidth; a.classList.add(d === 'fwd' ? 'pgf' : 'pgb'); setTimeout(() => a.classList.remove('pgf', 'pgb'), 400) }
  };

  // ---------- Hebebühne ----------
  let liftKey = null, lastCert = null;
  function rig(sv) {
    sv.dataset.rig = 1;
    const mot = sv.querySelector('svg[x="98"]'); if (!mot) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'liftg');
    let n = mot; const arr = []; while (n) { arr.push(n); n = n.nextSibling } arr.forEach(x => g.appendChild(x));
    // Plattform und Kolbenstange (in der Gruppe), Standrohr fest
    g.insertAdjacentHTML('afterbegin', '<defs><linearGradient id="rodg" x1="0" x2="1"><stop offset="0" stop-color="#6d7889"/><stop offset=".28" stop-color="#f6f9fd"/><stop offset=".55" stop-color="#bcc6d3"/><stop offset="1" stop-color="#586271"/></linearGradient><linearGradient id="plg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93a8bf"/><stop offset=".4" stop-color="#59687a"/><stop offset="1" stop-color="#2c3541"/></linearGradient></defs><rect x="171" y="396" width="18" height="70" rx="4" fill="url(#rodg)" stroke="#6b7685"/><rect x="175" y="398" width="3" height="64" rx="1.5" fill="#fff" opacity=".55"/><ellipse class="oil" cx="182" cy="414" rx="4" ry="2.4" fill="#fff"/><rect x="60" y="392" width="240" height="9" rx="3" fill="url(#plg)" stroke="#2a323d"/><rect x="62" y="392.4" width="236" height="2" rx="1" fill="#eef5fc" opacity=".9"/><rect x="60" y="399" width="240" height="2" rx="1" fill="#000" opacity=".35"/><path d="M64 396h28M268 396h28" stroke="#f2b705" stroke-width="3" stroke-dasharray="6 5"/>');
    sv.appendChild(g);
    // Standrohr hinter die Gruppe legen
    g.insertAdjacentHTML('beforebegin', '<defs><radialGradient id="shg"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse class="shs" cx="180" cy="414" rx="84" ry="6" fill="url(#shg)"/><ellipse class="shl" cx="180" cy="414" rx="140" ry="13" fill="url(#shg)"/><rect x="166" y="408" width="28" height="14" rx="3" fill="#2f3845" stroke="#161b22"/>');
    const c = guard(() => car()), ph = c && c.ph, key = W2.veh + ':' + ph;
    const done = ph === 2 ? c.took.length === BP.length : c.put.length === BP.length;
    if (!done) {
      if (liftKey === key || RM()) { sv.classList.add('nt', 'up'); liftKey = key }
      else { liftKey = key; sv.classList.add('nt'); void sv.getBoundingClientRect(); setTimeout(() => { sv.classList.remove('nt'); void sv.getBoundingClientRect(); sv.classList.add('up'); FX.hyd(true) }, 200) }
    } else if (liftKey === key) {   // am Ende wieder runter
      sv.classList.add('nt', 'up'); liftKey = null;
      setTimeout(() => { sv.classList.remove('nt'); void sv.getBoundingClientRect(); sv.classList.remove('up'); FX.hyd(false) }, 450);
    }
  }
  function onDom() {
    if (view !== 'w2') { liftKey = null; lastCert = null; return }
    const c = guard(() => car());
    const sv = document.querySelector('.board svg.bsvg:not([data-rig])');
    if (sv && c && (c.ph === 2 || c.ph === 4)) guard(() => rig(sv)); else if (sv) sv.dataset.rig = 1;
    if (!(c && (c.ph === 2 || c.ph === 4))) liftKey = null;
    const ct = document.querySelector('.cert:not([data-cf])');
    if (ct) { ct.dataset.cf = 1; if (lastCert !== W2.veh) { lastCert = W2.veh; setTimeout(() => { confetti(); FX.tone(784, .3, .1); setTimeout(() => FX.tone(1047, .4, .1), 150) }, 300) } }
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => guard(onDom)).observe(app, {childList: true});

  // ---------- Werkzeug-Animation (Schlüssel dreht sich) ----------
  const _tap = window.w2Tap;
  if (_tap) window.w2Tap = function (id) {
    const el = document.querySelector(`.bp[data-id="${id}"],.ghost[data-id="${id}"]`);
    if (el && el.classList.contains('go') && !RM()) { const r = el.getBoundingClientRect(); const w = mk('i', 'wr', '🔧'); w.style.left = (r.left + r.width / 2) + 'px'; w.style.top = (r.top + r.height / 2) + 'px'; document.body.appendChild(w); setTimeout(() => w.remove(), 700) }
    return _tap.apply(null, arguments);
  };

  // ---------- Münzen zum Taler-Zähler ----------
  function coinFly(n, from) {
    const old = document.querySelector('.coinpill'); if (old) old.remove();
    const after = S.coins || 0, before = Math.max(0, after - n);
    const pill = mk('div', 'coinpill', '🪙 ' + (RM() ? after : before)); document.body.appendChild(pill);
    setTimeout(() => pill.remove(), RM() ? 2500 : 3000);
    if (RM()) return;
    const W = innerWidth, H = innerHeight, k = Math.min(10, Math.max(3, Math.round(n / 3)));
    const sx = from ? from.x : W / 2, sy = from ? from.y : H * .42;
    setTimeout(() => {
      const pr = pill.getBoundingClientRect(), tx = pr.left + pr.width / 2, ty = pr.top + pr.height / 2;
      for (let i = 0; i < k; i++) {
        const c = mk('i', 'coin'); c.style.left = sx + 'px'; c.style.top = sy + 'px';
        c.style.setProperty('--mx', (Math.random() * 120 - 60) + 'px'); c.style.setProperty('--my', (-40 - Math.random() * 60) + 'px');
        c.style.setProperty('--dx', (tx - sx) + 'px'); c.style.setProperty('--dy', (ty - sy) + 'px'); c.style.setProperty('--d', (i * .08) + 's');
        document.body.appendChild(c); setTimeout(() => c.remove(), 1100 + i * 80);
        setTimeout(() => { FX.coinSnd(); pill.classList.remove('hit'); void pill.offsetWidth; pill.classList.add('hit'); window.__spk&&window.__spk(pill); pill.textContent = '🪙 ' + Math.min(after, before + Math.ceil(n * (i + 1) / k)) }, 900 + i * 80);
      }
    }, 120);
  }
  // Freischalt-Erkennung
  const lockedSet = () => { const r = []; guard(() => { Object.keys(LK).forEach(i => { if (partLock(i)) r.push(i) }); Object.keys(MODLK).forEach(i => { if (modLock(i)) r.push('m:' + i) }) }); return r };
  const _fin = window.finish;
  window.finish = function () {
    const c0 = S.coins || 0, lk0 = lockedSet();
    const r = _fin.apply(this, arguments);
    const d = (S.coins || 0) - c0; if (d > 0) setTimeout(() => coinFly(d), 350);
    const nw = lk0.filter(i => !lockedSet().includes(i));
    if (nw.length) setTimeout(() => { confetti(); FX.coinSnd(); const nm = nw.slice(0, 2).map(i => i.startsWith('m:') ? V2V[i.slice(2)].name : partLabel(i)).join(', '); toast('🔓 Neu freigeschaltet: ' + nm + (nw.length > 2 ? ' und mehr' : '')) }, 900);
    return r;
  };

  // ---------- Ladeanimation: drehendes Ritzel ----------
  const GEAR = '<svg viewBox="0 0 64 64"><g fill="#b9c4d2" stroke="#3a4558" stroke-width="2"><circle cx="32" cy="32" r="18"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="27" y="4" width="10" height="12" rx="2" transform="rotate(${a} 32 32)"/>`).join('') + '</g><circle cx="32" cy="32" r="8" fill="#1a2230" stroke="#3a4558" stroke-width="2"/></svg>';
  window.UI = {
    loader(on, txt) {
      document.querySelectorAll('.ldr').forEach(e => e.remove());
      if (on) { document.body.appendChild(mk('div', 'ldr', '<div>' + GEAR + '<span>' + (txt || 'Wird gebaut …') + '</span></div>')) }
    }
  };
  const _r2 = window.render2;
  if (_r2) window.render2 = function () {
    let shown = false; const t = setTimeout(() => { shown = true; UI.loader(true, 'Bild wird gebaut …') }, 200);
    const done = () => { clearTimeout(t); if (shown) UI.loader(false) };
    const p = _r2.apply(this, arguments); Promise.resolve(p).then(done, done); return p;
  };

  // ---------- Screenshot-Hooks: #shot=animrolltor | animbuehne | animkonfetti | animlader | animmuenzen ----------
  const m = /shot=(anim\w+)/.exec(location.hash); if (!m) return;
  const k = m[1], frz = d => { document.body.classList.add('frz'); document.querySelectorAll(d).forEach(e => e.style.animationDelay = '-' + (e.dataset.fd || '0.7') + 's') };
  S.points = Math.max(S.points, 120); ROTX = true;
  setTimeout(() => {
    if (k === 'animrolltor') { view = 'w2'; W2.veh = null; render(); const g = mk('div', 'gate', '<b>WERKSTATT</b><u></u><s></s>'); g.style.animation = 'none'; g.style.transform = 'translateY(-46%)'; document.body.appendChild(g) }
    else if (k === 'animbuehne') { W2.veh = 's51'; const c = W2.cars.s51 = {ph: 2, took: ['kerze', 'kopf'], put: [], pick: Object.assign({}, ORIGP), jet: 70, drove: false}; view = 'w2'; render(); liftKey = null; setTimeout(() => { const sv = document.querySelector('svg.bsvg'); if (sv) { sv.classList.add('nt', 'up') } const r = document.querySelector('.bp[data-id="zyl"]'); if (r) { const b = r.getBoundingClientRect(); const w = mk('i', 'wr', '🔧'); w.style.left = (b.left + b.width / 2) + 'px'; w.style.top = (b.top + b.height / 2) + 'px'; w.style.animation = 'none'; w.style.transform = 'rotate(28deg) scale(1.15)'; document.body.appendChild(w) } }, 300) }
    else if (k === 'animkonfetti') { view = 'home'; render(); confetti(); const cb = document.querySelector('.confetti'); if (cb) { const cc = cb.cloneNode(true); cb.remove(); document.body.appendChild(cc) } document.querySelectorAll('.confetti i').forEach(e => { e.style.animation = 'none'; e.style.transform = 'translateY(' + Math.round(Math.random() * 90) + 'vh) rotate(' + Math.round(Math.random() * 360) + 'deg)' }) }
    else if (k === 'animgo') { view = 'home'; render(); go('w2'); setTimeout(() => { window.__g1 = !!document.querySelector('.gate'); go('missions') }, 600); setTimeout(() => { go('home') }, 2200); setTimeout(() => { document.title = 'g1=' + window.__g1 + ' view=' + view + ' app=' + document.getElementById('app').textContent.slice(0, 20) + ' vt=' + document.documentElement.className }, 3500) }
    else if (k === 'animlader') { view = 'home'; render(); UI.loader(true, 'Bild wird gebaut …') }
    else if (k === 'animmuenzen') { view = 'home'; render(); S.coins = (S.coins || 0) + 15; coinFly(15); setTimeout(() => { const pl = document.querySelector('.coinpill'); if (pl) { const cl = pl.cloneNode(true); cl.style.animation = 'none'; cl.style.opacity = 1; pl.remove(); document.body.appendChild(cl) } document.querySelectorAll('.coin').forEach((e0, i) => { const e = e0.cloneNode(true); e0.remove(); document.body.appendChild(e); const t = .25 + i * .07; e.style.animation = 'none'; e.style.opacity = 1; e.style.transform = 'translate(calc(var(--dx) * ' + t + ' + var(--mx) * ' + (1 - t) + '), calc(var(--dy) * ' + t + ' + var(--my) * ' + (1 - t) + '))' }) }, 400) }
  }, 150);
})();

// ===== Paket 6: Licht, Schatten, Metall (nur transform/opacity, CSS/SVG) =====
(function () {
  const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e };
  const guard = f => { try { return f() } catch (e) { return undefined } };
  const rnd = (a, b) => a + Math.random() * (b - a);

  // Funkel beim Ankommen der Münzen
  window.__spk = pill => { if (RM() || !pill || !pill.isConnected) return; const r = pill.getBoundingClientRect(); const e = mk('i', 'spk'); e.style.left = (r.left + 24) + 'px'; e.style.top = (r.top + r.height / 2) + 'px'; document.body.appendChild(e); setTimeout(() => e.remove(), 650) };

  // Rolltor: Lichtstreifen von draußen und Staub im Lichtkegel
  function lightfall(stat) {
    if (document.querySelector('.lf')) return;
    let h = ''; [[8, 15], [30, 9], [52, 18], [76, 10]].forEach(b => h += `<b class="bm" style="left:${b[0]}%;width:${b[1]}%"></b>`);
    for (let i = 0; i < 16; i++) h += `<i class="dust" style="left:${rnd(6, 92).toFixed(1)}%;top:${rnd(8, 70).toFixed(1)}%;--x:${rnd(-18, 18).toFixed(0)}px;--y:${rnd(-30, 20).toFixed(0)}px;--t:${rnd(3.5, 6).toFixed(1)}s;--d:${rnd(0, 2).toFixed(1)}s"></i>`;
    const e = mk('div', 'lf', h); document.body.appendChild(e); if (!stat) setTimeout(() => e.remove(), 3600); return e;
  }
  const _g = window.go;
  window.go = function (v) { const o = view; const r = _g.apply(this, arguments); const nt = window.__torNeu; window.__torNeu = false; if (v === 'w2' && o !== 'w2' && !RM() && nt) guard(lightfall); return r };

  // Deckenlicht, Vignette, Boden-Glanz, Werkzeugwand (nur in der Werkstatt)
  const TW = (() => { let t = ''; for (let i = 0; i < 3; i++) t += `<g transform="translate(${i * 130} 0)"><rect x="18" y="0" width="10" height="16" rx="4"/><rect x="21" y="16" width="4" height="26"/><path d="M62 0h12v28a10 10 0 1 1-12 0z"/><rect x="104" y="0" width="7" height="40" rx="2"/><rect x="92" y="2" width="32" height="11" rx="2"/></g>`; return `<svg class="tw" viewBox="0 0 390 44" preserveAspectRatio="xMidYMin slice">${t}</svg>` })();
  function amb() {
    if (view !== 'w2') { document.querySelectorAll('.amb').forEach(e => e.remove()); return }
    if (document.querySelector('.amb')) return;
    document.body.appendChild(mk('div', 'amb', TW + '<div class="vg"></div><div class="cone"></div><div class="fl"></div><div class="nb nb1"></div><div class="nb nb2"></div>'));
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => guard(amb)).observe(app, {childList: true});

  // Teile fallen: Kontaktschatten mit Aufprall
  const _t = window.w2Tap;
  if (_t) window.w2Tap = function (id) {
    const r = _t.apply(this, arguments);
    if (!RM()) guard(() => {
      const c = car(); if (c.ph !== 4) return;
      const n = document.querySelector(`.bp[data-id="${id}"].in`); if (!n) return;
      const b = n.getBBox(), sv = n.ownerSVGElement; if (!b.width) return;
      const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      e.setAttribute('class', 'imp'); e.setAttribute('cx', b.x + b.width / 2); e.setAttribute('cy', b.y + b.height - 2); e.setAttribute('rx', Math.max(8, b.width * .42)); e.setAttribute('ry', 3.5);
      n.parentNode.insertBefore(e, n); setTimeout(() => e.remove(), 1200);
    });
    return r;
  };

  // ---------- Screenshot-Hooks: #shot=anim2-rolltor | anim2-licht | anim2-buehne | anim2-muenzen ----------
  const mt = /shot=tor-neu/.exec(location.hash); if (mt) setTimeout(() => { view = 'w2'; W2.veh = null; render(); window.__torBauen(1.0); const l = lightfall(true); if (l) { l.style.animation = 'none'; l.style.opacity = .8; l.querySelectorAll('.bm').forEach(b => b.style.animation = 'none') } }, 150);
  const m = /shot=(anim2-\w+)/.exec(location.hash); if (!m) return;
  const k = m[1];
  const lock = () => { const c = {ph: 2, took: [], put: [], pick: Object.assign({}, ORIGP), jet: 70, drove: false}; W2.veh = 's51'; W2.cars.s51 = c; return c };
  setTimeout(() => {
    S.points = Math.max(S.points, 120); ROTX = true;
    if (k === 'anim2-rolltor') {
      view = 'w2'; W2.veh = null; render();
      const l = lightfall(true); l.style.opacity = .95; l.querySelectorAll('.bm').forEach(b => b.style.animation = 'none'); l.style.animation = 'none';
      const g = mk('div', 'gate', '<b>WERKSTATT</b><u></u><s></s>'); g.style.animation = 'none'; g.style.transform = 'translateY(-46%)'; document.body.appendChild(g);
    } else if (k === 'anim2-licht') {
      lock(); view = 'w2'; render(); setTimeout(() => { const sv = document.querySelector('svg.bsvg'); if (sv) sv.classList.add('nt', 'up') }, 300);
    } else if (k === 'anim2-buehne') {
      const c = lock(); c.ph = 4; c.took = BP.map(p => p.id); c.put = ['kolben']; view = 'w2'; render();
      setTimeout(() => {
        const sv = document.querySelector('svg.bsvg'); if (sv) sv.classList.add('nt', 'up');
        const z = document.querySelector('.bp[data-id="kolben"]'); if (z) { const b = z.getBBox(); const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); e.setAttribute('class', 'imp'); e.setAttribute('cx', b.x + b.width / 2); e.setAttribute('cy', b.y + b.height - 2); e.setAttribute('rx', Math.max(8, b.width * .42)); e.setAttribute('ry', 3.5); e.style.animation = 'none'; e.style.opacity = .7; z.parentNode.insertBefore(e, z) }
        const r = document.querySelector('.ghost[data-id="zyl"]') || document.querySelector('.ghost'); if (r) { const b = r.getBoundingClientRect(); const w = mk('i', 'wr', '🔧'); w.style.left = (b.left + b.width / 2) + 'px'; w.style.top = (b.top + b.height / 2) + 'px'; w.style.animation = 'none'; w.style.transform = 'rotate(28deg) scale(1.15)'; w.firstChild; document.body.appendChild(w) }
      }, 300);
    } else if (k === 'anim2-muenzen') {
      view = 'home'; render();
      const pill = mk('div', 'coinpill', '🪙 ' + ((S.coins || 0) + 12)); pill.style.animation = 'none'; document.body.appendChild(pill);
      const pr = pill.getBoundingClientRect(), tx = pr.left + pr.width / 2, ty = pr.top + pr.height / 2, sx = innerWidth / 2, sy = innerHeight * .42;
      for (let i = 0; i < 7; i++) { const t = (i + 1) / 8, c = mk('i', 'coin'); c.style.left = (sx + (tx - sx) * t + Math.sin(i * 2.1) * 40) + 'px'; c.style.top = (sy + (ty - sy) * t - Math.sin(t * Math.PI) * 90) + 'px'; c.style.animation = 'none'; c.style.opacity = 1; c.style.transform = 'scale(' + (1.15 - t * .5).toFixed(2) + ')'; document.body.appendChild(c) }
      const sp = mk('i', 'spk'); sp.style.left = (pr.left + 24) + 'px'; sp.style.top = ty + 'px'; sp.style.animation = 'none'; sp.style.opacity = 1; sp.style.transform = 'translate(-50%,-50%) scale(1.1)'; document.body.appendChild(sp);
    }
  }, 150);
})();
// Scheunentor: langsamer, Holz-Knarzen statt Rohrmotor
(function () {
  const T = window.__TOR; if (!T) return;
  T.ta = 1.1; T.tv = 2.6; T.tb = 1.0; T.tw = .8; T.T = T.ta + T.tv + T.tb;
  try { const i = new Image(); i.src = 'v2/img/anim/tor-blatt.jpg'; const j = new Image(); j.src = 'v2/img/anim/tor-rahmen.png' } catch (e) {}
  FX.gateSndHolz = function () {
    if (!this.on()) return; const c = this.A(); if (!c) return;
    const t0 = c.currentTime + .18, out = this.out(), D = T.T;
    const vel = t => Math.max(0, (T.pos(t + .01) - T.pos(t - .01)) / .02), vmax = 1 / (T.tv + (T.ta + T.tb) / 2);
    const nb = c.createBuffer(1, c.sampleRate * .6, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const hit = (tt, f, g, d, type) => { const s = c.createBufferSource(); s.buffer = nb; const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = 2; const gg = c.createGain(); gg.gain.setValueAtTime(g, tt); gg.gain.exponentialRampToValueAtTime(.0005, tt + d); s.connect(fl); fl.connect(gg); gg.connect(out); s.start(tt, Math.random() * .4, d + .02) };
    // Knarzen: Reibungston (Sägezahn mit unruhiger Tonhöhe) durch Resonanzfilter, mehrere Knarz-Phrasen
    const creak = (ts, len, base) => {
      const o = c.createOscillator(), bp = c.createBiquadFilter(), bp2 = c.createBiquadFilter(), g = c.createGain();
      o.type = 'sawtooth'; bp.type = 'bandpass'; bp.frequency.value = 650 + Math.random() * 400; bp.Q.value = 6; bp2.type = 'bandpass'; bp2.frequency.value = 1700 + Math.random() * 600; bp2.Q.value = 4;
      o.connect(bp); o.connect(bp2); bp.connect(g); bp2.connect(g); g.connect(out);
      for (let t = 0; t <= len; t += .015) { const k = t / len, j = Math.sin(t * 37) * .2 + (Math.random() - .5) * .35; o.frequency.setValueAtTime(Math.max(18, base * (1 + .5 * Math.sin(k * Math.PI)) * (1 + j)), ts + t); g.gain.setValueAtTime(.05 * Math.sin(k * Math.PI) * (.6 + Math.random() * .4), ts + t) }
      g.gain.setValueAtTime(0, ts + len + .01); o.start(ts); o.stop(ts + len + .05);
    };
    creak(t0 + .05, .55, 34); creak(t0 + T.ta + .1, .8, 26); creak(t0 + T.ta + T.tv * .6, .7, 40); creak(t0 + D - .55, .5, 22);
    // Holzlatten: dumpfes "tock" je Latte beim Aufrollen
    const N = 18; for (let i = 1; i <= N; i++) { const t = T.inv(i / N * .97), v = vel(t) / vmax; hit(t0 + t, 380 + Math.random() * 250, .08 + .1 * v, .06, 'bandpass'); hit(t0 + t, 140, .06 * v, .05, 'lowpass') }
    // Rauschen von Holz auf Holz
    for (let t = 0; t < D; t += .05) { const v = vel(t) / vmax; if (v > .05) hit(t0 + t, 900 + Math.random() * 900, .025 * v, .07) }
    // Endanschlag: dumpfer Holzschlag, Staub-Rieseln
    const te = t0 + D; hit(te, 120, .6, .3, 'lowpass'); hit(te, 520, .25, .15); [.16, .31].forEach((d, k) => hit(te + d, 300, .18 / (k + 1), .08));
    for (let k = 0; k < 10; k++) hit(te + .05 + k * .06, 4000 + Math.random() * 3000, .02 * Math.exp(-k * .25), .02, 'highpass');
  };
})();
// Animierter Hintergrund für alle Ansichten
(function () {
  if (document.querySelector('.bgfx')) return;
  const gear = (n, cls) => { let d = ''; const R = 50, r = 40, s = Math.PI * 2 / n; for (let i = 0; i < n; i++) { const a = i * s; const p = (rr, aa) => (60 + rr * Math.cos(aa)).toFixed(1) + ' ' + (60 + rr * Math.sin(aa)).toFixed(1); d += (i ? 'L' : 'M') + p(r, a) + 'L' + p(R, a + s * .15) + 'L' + p(R, a + s * .45) + 'L' + p(r, a + s * .6) } return `<svg class="${cls}" viewBox="0 0 120 120"><path d="${d}Z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="60" cy="60" r="14" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 5"/></svg>` };
  const b = document.createElement('div'); b.className = 'bgfx'; b.setAttribute('aria-hidden', 'true');
  let dust = ''; for (let i = 0; i < 14; i++) dust += `<i style="left:${(Math.random() * 100).toFixed(1)}%;animation-duration:${(14 + Math.random() * 16).toFixed(1)}s;animation-delay:-${(Math.random() * 25).toFixed(1)}s;transform:scale(${(.6 + Math.random()).toFixed(2)})"></i>`;
  b.innerHTML = '<div class="g1"></div><div class="g2"></div>' + gear(16, 'z1') + gear(10, 'z2') + gear(12, 'z3') + dust;
  document.body.insertBefore(b, document.body.firstChild);
})();
// ---------- Übergangs-Animationen im Stil des Rolltors: Prüfstand, Lernen, Garage, Tagesstart (S51) ----------
// Fotorealistische Bildebenen (v2/img/anim/), rAF-Bewegung nur mit transform/opacity, Sound über FX (nur bei FX.on()). Läuft bei jedem Tipp, blendet nach ca. 2,5 s aus, blockiert keine Taps.
(function () {
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e };
  const busy = () => !!document.querySelector('.rt:not(.fade),.an:not(.fade)');
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease3 = u => 1 - Math.pow(1 - clamp(u, 0, 1), 3), eio = u => { u = clamp(u, 0, 1); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2 };
  const IMG = {pr: 'pr-kabine.jpg', lern: 'lern-schublade.jpg', key: 'lern-schluessel.png', tor: 'garage-tor.jpg', innen: 'garage-innen.jpg', s51: 's51-quer.png'};
  try { Object.keys(IMG).forEach(k => { const i = new Image(); i.src = 'v2/img/anim/' + IMG[k] }) } catch (e) {}

  // Bühne bauen: Box im 9:16-Format wie beim Rolltor (.rbx), fixed über allem, pointer-events:none
  function stage(cls, inner, box) { const g = mk('div', 'an ' + cls, box === false ? inner : '<div class="abx">' + inner + '</div>'); document.body.appendChild(g); return g }
  // Zeitablauf: frame(t) mit t in Sekunden ab Start, danach Ausblenden (0,5 s) und Entfernen
  function run(g, dur, frame) {
    const t0 = performance.now() + 120; let done = false;
    const step = now => {
      if (!g.isConnected) return;
      const t = (now - t0) / 1000;
      if (t < dur) { if (t >= 0) frame(t); requestAnimationFrame(step) }
      else if (!done) { done = true; frame(dur); g.classList.add('fade'); setTimeout(() => { killVid(g); g.remove() }, 1300) }
    };
    requestAnimationFrame(step); setTimeout(() => { killVid(g); g.remove() }, 6500);
  }

  // ---------- Sound-Werkzeug (Web Audio über FX, wie gateSnd) ----------
  function sk() {
    const c = FX.A(); if (!c) return null; const out = FX.out(), t0 = c.currentTime + .15;
    const nb = c.createBuffer(1, c.sampleRate * .6, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const hit = (tt, f, g, d, type, q) => { const s = c.createBufferSource(); s.buffer = nb; const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q || 1.6; const gg = c.createGain(); gg.gain.setValueAtTime(g, tt); gg.gain.exponentialRampToValueAtTime(.0005, tt + d); s.connect(fl); fl.connect(gg); gg.connect(out); s.start(tt, Math.random() * .3, d + .02) };
    const tone = (tt, f0, f1, g, d, type) => { const o = c.createOscillator(), gg = c.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, tt); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), tt + d); gg.gain.setValueAtTime(g, tt); gg.gain.exponentialRampToValueAtTime(.0005, tt + d); o.connect(gg); gg.connect(out); o.start(tt); o.stop(tt + d + .02) };
    const loop = (f0, f1, g, tt, d, type, q) => { const s = c.createBufferSource(); s.buffer = nb; s.loop = true; const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.Q.value = q || 1; fl.frequency.setValueAtTime(f0, tt); fl.frequency.linearRampToValueAtTime(f1, tt + d); const gg = c.createGain(); gg.gain.setValueAtTime(0, tt); gg.gain.linearRampToValueAtTime(g, tt + d * .25); gg.gain.setValueAtTime(g, tt + d * .7); gg.gain.linearRampToValueAtTime(0, tt + d); s.connect(fl); fl.connect(gg); gg.connect(out); s.start(tt); s.stop(tt + d + .05) };
    return {c, out, t0, hit, tone, loop};
  }
  Object.assign(FX, {
    // Prüfstand: Schütz klackt, Relais tickt im Takt der Warnleuchte, Rolle dreht hoch (Motor + Lagerpfeifen + Abrollgeräusch)
    prSnd(K) {
      const k = K || 1;
      if (!this.on()) return; const s = sk(); if (!s) return; const {c, out, t0, hit, tone, loop} = s;
      hit(t0, 1800, .22, .04); hit(t0, 190, .3, .09, 'lowpass');
      [.12, .55, .98, 1.41].forEach(d => { d *= k; hit(t0 + d, 2600, .07, .014); tone(t0 + d, 900, 700, .02, .05, 'square') });
      const mix = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2; mix.connect(lp); lp.connect(out); mix.gain.value = 0;
      const o1 = c.createOscillator(), o2 = c.createOscillator(); o1.type = 'sawtooth'; o2.type = 'sawtooth';
      o1.frequency.setValueAtTime(34, t0 + .15*k); o1.frequency.exponentialRampToValueAtTime(250, t0 + 1.55*k); o2.frequency.setValueAtTime(34.7, t0 + .15*k); o2.frequency.exponentialRampToValueAtTime(254, t0 + 1.55*k);
      lp.frequency.setValueAtTime(160, t0 + .15*k); lp.frequency.exponentialRampToValueAtTime(1900, t0 + 1.55*k);
      mix.gain.setValueAtTime(.005, t0 + .15*k); mix.gain.linearRampToValueAtTime(.075, t0 + 1.4*k); mix.gain.setValueAtTime(.075, t0 + 1.7*k); mix.gain.setTargetAtTime(0, t0 + 1.85*k, .12);
      o1.connect(mix); o2.connect(mix); o1.start(t0); o2.start(t0); o1.stop(t0 + 2.4*k); o2.stop(t0 + 2.4*k);
      const w = c.createOscillator(), wg = c.createGain(); w.type = 'sine'; w.frequency.setValueAtTime(260, t0 + .2*k); w.frequency.exponentialRampToValueAtTime(2300, t0 + 1.55*k); wg.gain.setValueAtTime(0, t0 + .2*k); wg.gain.linearRampToValueAtTime(.022, t0 + 1.5*k); wg.gain.setTargetAtTime(0, t0 + 1.75*k, .12); w.connect(wg); wg.connect(out); w.start(t0 + .2*k); w.stop(t0 + 2.4*k);
      loop(500, 3200, .09, t0 + .2*k, 1.8*k, 'bandpass', .8);
      hit(t0 + 1.9*k, 160, .12, .25, 'lowpass');
    },
    // Lernen: Schublade rollt auf (Rollen-Rumpeln, Holz-Anschlag), dann Kreide kratzt, Schraubenschlüssel klackt aufs Heft
    lernSnd() {
      if (!this.on()) return; const s = sk(); if (!s) return; const {c, out, t0, hit, tone, loop} = s;
      loop(180, 520, .16, t0, 1.0, 'lowpass', .9);
      for (let i = 0; i < 22; i++) { const t = t0 + .03 + i * .042 * (1 + i * .012); hit(t, 260 + Math.random() * 120, .05 * (1 - i / 30), .03, 'bandpass', 2) }
      hit(t0 + 1.0, 150, .5, .22, 'lowpass'); hit(t0 + 1.0, 600, .2, .1); [.12, .22].forEach((d, k) => hit(t0 + 1.0 + d, 400, .12 / (k + 1), .06));
      // Kreide: kurze, schnell wiederholte hohe Rausch-Striche
      [[1.08, .22], [1.34, .2], [1.58, .24]].forEach(([a, len]) => { for (let k = 0; k < 9; k++) hit(t0 + a + k * len / 9, 3800 + Math.random() * 2600, .055 * Math.sin((k + .5) / 9 * Math.PI) + .015, .028, 'bandpass', 5) });
      // Schlüssel: Metall-Klack auf Papier
      const tk = t0 + 1.0; tone(tk + .02, 2300, 1900, .06, .18, 'triangle'); tone(tk + .02, 3700, 3400, .035, .12, 'sine'); hit(tk, 1800, .13, .05, 'highpass'); hit(tk + .02, 300, .1, .06, 'lowpass');
    },
    // Garage: Holz knarrt (Reibungston durch Resonanzfilter), zuerst Riegel klackt, am Ende Anschlag der Flügel
    garSnd(K) {
      const k = K || 1;
      if (!this.on()) return; const s = sk(); if (!s) return; const {c, out, t0, hit, tone} = s;
      // Riegel zurückschieben: Eisen-Klack, Nachklappern
      hit(t0 + .05*k, 2200, .2, .03); tone(t0 + .05*k, 1400, 900, .05, .05, 'square'); hit(t0 + .05*k, 180, .3, .09, 'lowpass');
      hit(t0 + .3*k, 1700, .25, .04); hit(t0 + .3*k, 140, .4, .15, 'lowpass'); tone(t0 + .31*k, 2600, 2300, .04, .2, 'triangle');
      const creak = (ts, len, base) => {
        const o = c.createOscillator(), bp = c.createBiquadFilter(), bp2 = c.createBiquadFilter(), g = c.createGain();
        o.type = 'sawtooth'; bp.type = 'bandpass'; bp.frequency.value = 600 + Math.random() * 400; bp.Q.value = 7; bp2.type = 'bandpass'; bp2.frequency.value = 1500 + Math.random() * 700; bp2.Q.value = 4;
        o.connect(bp); o.connect(bp2); bp.connect(g); bp2.connect(g); g.connect(out);
        for (let t = 0; t <= len; t += .015) { const k = t / len, j = Math.sin(t * 41) * .2 + (Math.random() - .5) * .35; o.frequency.setValueAtTime(Math.max(18, base * (1 + .55 * Math.sin(k * Math.PI)) * (1 + j)), ts + t); g.gain.setValueAtTime(.055 * Math.sin(k * Math.PI) * (.6 + Math.random() * .4), ts + t) }
        g.gain.setValueAtTime(0, ts + len + .01); o.start(ts); o.stop(ts + len + .05);
      };
      creak(t0 + .4*k, .6*k, 36); creak(t0 + .55*k, .75*k, 27); creak(t0 + 1.05*k, .55*k, 42); creak(t0 + 1.3*k, .4*k, 24);
      for (let t = .4*k; t < 1.5*k; t += .06*k) hit(t0 + t, 700 + Math.random() * 900, .02, .07);
      const te = t0 + 1.5*k; hit(te, 120, .5, .3, 'lowpass'); hit(te, 520, .2, .14); [.14, .27].forEach((d, k) => hit(te + d, 300, .15 / (k + 1), .08));
      for (let k = 0; k < 8; k++) hit(te + .05 + k * .06, 4000 + Math.random() * 3000, .018 * Math.exp(-k * .25), .02, 'highpass');
    },
    // Tagesstart: Zweitakter fährt vorbei (Knattern mit Doppler-Effekt), kurz
    s51Snd(K) {
      if (!this.on()) return; const s = sk(); if (!s) return; const {c, out, t0} = s;
      const D = 1.9 * (K || 1), o = c.createOscillator(), o2 = c.createOscillator(), mod = c.createGain(), bp = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'sawtooth'; o2.type = 'square'; bp.type = 'bandpass'; bp.Q.value = 1.3; bp.frequency.setValueAtTime(700, t0); bp.frequency.linearRampToValueAtTime(950, t0 + D * .5); bp.frequency.linearRampToValueAtTime(620, t0 + D);
      // Zweitakt-Knattern: Amplitude pulst mit der Zündfrequenz (ca. 38 Hz), Tonhöhe fällt wie beim Vorbeifahren (Doppler)
      for (let t = 0; t <= D; t += .02) { const u = t / D, f = 82 * (1.18 - .36 * eio(u)) * (1 + .03 * Math.sin(t * 9)); o.frequency.setValueAtTime(f, t0 + t); o2.frequency.setValueAtTime(f * 2.01, t0 + t); lfo.frequency.setValueAtTime(14 + 7 * (1.2 - eio(u)), t0 + t); g.gain.setValueAtTime(.001 + .11 * Math.exp(-Math.pow((u - .5) / .26, 2)), t0 + t) }
      mod.gain.value = .5; lfo.type = 'square'; lg.gain.value = .5; lfo.connect(lg); lg.connect(mod.gain);
      o.connect(mod); const g2 = c.createGain(); g2.gain.value = .35; o2.connect(g2); g2.connect(mod); mod.connect(bp); bp.connect(g); g.connect(out);
      [o, o2, lfo].forEach(x => { x.start(t0); x.stop(t0 + D + .1) });
    }
  });

  // Echtes KI-Video (Google Flow) als Ebene: muted, playsinline, Standbild bleibt Poster. Startet es nicht, läuft die bisherige Animation (vs.dead)
  const killVid = g => { try { g.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.removeAttribute('poster') }) } catch (e) {} };
  const PRE = {}, prefetch = n => PRE[n] || (PRE[n] = fetch('v2/img/anim/' + n + '.mp4').then(r => r.arrayBuffer()).catch(() => {}));   // eine Anfrage, danach liegt der Clip im Cache des Service Workers
  function video(box, name, poster) {
    const vs = {ok: false, dead: false};
    let v = null;
    const fail = () => { if (vs.dead || vs.ok) return; vs.dead = true; try { if (v) { v.pause(); v.removeAttribute('src'); v.removeAttribute('poster'); v.remove() } } catch (e) {} };
    try {
      v = document.createElement('video'); v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; v.className = 'vd';
      box.appendChild(v);
      v.addEventListener('error', fail);
      v.addEventListener('playing', () => { if (vs.dead) return; vs.ok = true; v.classList.add('on'); const st = box.parentNode; if (st) st.classList.add('vid') });
      // erst starten, wenn der Clip geladen/gecacht ist (höchstens 3 s warten), sonst läuft die Ersatz-Animation
      Promise.race([prefetch(name), new Promise(r => setTimeout(r, 3000))]).then(() => {
        if (vs.dead || !v.isConnected) return; v.src = 'v2/img/anim/' + name + '.mp4'; const p = v.play(); if (p && p.catch) p.catch(fail);
      });
      setTimeout(() => { if (!vs.ok) fail() }, 5500);
    } catch (e) { fail() }
    return vs;
  }

  setTimeout(() => { try { ['garage-tor', 'pruefstand-kabine', 'home-hof'].forEach(prefetch) } catch (e) {} }, 4500);

  // ---------- 1. Prüfstand: dunkle Kabine, Warnleuchte blinkt, Rolle dreht hoch, Drehzahlzeiger schnellt hoch ----------
  function prAnim() {
    const g = stage('ap', '<div class="pk"></div><div class="pro"><div class="prs"></div></div><div class="plp"></div><div class="pgd"></div><div class="pdl"><div class="pnd"></div></div>');
    const box = g.querySelector('.abx'), lamp = g.querySelector('.plp'), st = g.querySelector('.prs'), nd = g.querySelector('.pnd'), ro = g.querySelector('.pro');
    let ph = 0, last = 0; const K = 2.3, DUR = 4.6;   // länger (ca. 4,6 s): Video; die Ersatz-Animation läuft entsprechend gedehnt
    const vs = video(box, 'pruefstand-kabine', 'pr-kabine.jpg'); FX.prSnd(K);
    run(g, DUR, T => {
      if (!vs.dead) return; const t = T / K;
      const dt = Math.max(0, t - last); last = t;
      const b = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.3 - .6)), 2);   // rotierende Warnleuchte: kurzes Aufblitzen im Takt
      lamp.style.opacity = (.12 + .88 * b).toFixed(3);
      const sp = Math.pow(clamp((t - .25) / 1.3, 0, 1), 2) * (1 - .08 * Math.sin(t * 40));   // Drehzahl 0..1, läuft hoch und bleibt oben
      ph = (ph + sp * dt * 26 * 24) % 24; st.style.transform = `translate3d(0,${(-ph).toFixed(2)}px,0)`;
      ro.style.opacity = (.08 + .92 * Math.min(1, sp * 1.4)).toFixed(3);
      const u = clamp((t - .2) / 1.2, 0, 1), jit = t > 1.4 ? Math.sin(t * 61) * 1.6 : 0;   // Zeiger schnellt hoch und zittert am Anschlag
      nd.style.transform = `rotate(${(-130 + 245 * (1 - Math.pow(1 - u, 3)) + jit).toFixed(2)}deg)`;
      box.style.transform = `translate3d(calc(-50% + ${(Math.sin(t * 83) * sp * 1.2).toFixed(2)}px),${(Math.cos(t * 71) * sp * 1.2).toFixed(2)}px,0)`;
    });
  }

  // ---------- 2. Lernen: Holzschublade mit Schulheften rollt auf, ein Schraubenschlüssel legt sich aufs Heft ----------
  function lernAnim() {
    const g = stage('al', '<div class="lsh"></div><div class="lb"></div><div class="lw"><div class="lk"></div></div>');
    const box = g.querySelector('.abx'), dr = g.querySelector('.lb'), sh = g.querySelector('.lsh'), wr = g.querySelector('.lw'), key = g.querySelector('.lk');
    const DUR = 2.0; FX.lernSnd();
    run(g, DUR, t => {
      const u = clamp(t / 1.0, 0, 1), y = (1 - ease3(u)) * 100 + (u >= 1 ? 0 : Math.sin(t * 70) * .12 * (1 - u));   // Schublade rollt hoch, bremst weich, leichtes Rütteln
      const bump = t > 1.0 ? Math.exp(-(t - 1.0) * 9) * Math.sin((t - 1.0) * 34) * 3 : 0;   // Anschlag
      dr.style.transform = `translate3d(0,${y.toFixed(2)}%,0)`; dr.style.transform = `translate3d(0,calc(${y.toFixed(2)}% + ${bump.toFixed(2)}px),0)`;
      sh.style.opacity = (Math.min(1, u * 1.5) * .9).toFixed(3);
      const k = clamp((t - .95) / .45, 0, 1), fall = 1 - ease3(k);   // Schlüssel fällt von oben auf das Heft, federt kurz nach
      const kb = t > 1.4 ? Math.exp(-(t - 1.4) * 10) * Math.sin((t - 1.4) * 30) * 5 : 0;
      wr.style.opacity = Math.min(1, k * 3).toFixed(3);
      wr.style.transform = `translate3d(${(fall * 14).toFixed(2)}vw,${(-fall * 62 + kb).toFixed(2)}vh,0) rotate(${(-24 + fall * 52).toFixed(2)}deg) scale(${(1 + fall * .9).toFixed(3)})`;
      key.style.opacity = (1 - fall * .15).toFixed(3);
    });
  }

  // ---------- 3. Garage: altes Holz-Flügeltor schwingt auf, Licht fällt hinein, Staub tanzt im Lichtstrahl ----------
  function garAnim() {
    let dust = ''; const N = 16, P = []; for (let i = 0; i < N; i++) { const p = {x: 52 + Math.random() * 40, y: 30 + Math.random() * 45, s: .6 + Math.random() * 1.4, f: .6 + Math.random() * 1.2, a: Math.random() * 6.28}; P.push(p); dust += `<i style="left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%;width:${(3 * p.s).toFixed(1)}px;height:${(3 * p.s).toFixed(1)}px"></i>` }
    const g = stage('ag', '<div class="gi"></div><div class="gb"></div><div class="gd">' + dust + '</div><div class="gtl"><u></u></div><div class="gtr"><u></u></div><div class="gf"></div>');
    const gi = g.querySelector('.gi'), gb = g.querySelector('.gb'), L = g.querySelector('.gtl'), R = g.querySelector('.gtr'), gf = g.querySelector('.gf'), ds = [...g.querySelectorAll('.gd i')], Ls = L.firstChild, Rs = R.firstChild;
    const K = 2.4, DUR = 4.8, box = g.querySelector('.abx');
    const vs = video(box, 'garage-tor', 'garage-tor.jpg'); FX.garSnd(K);
    run(g, DUR, T => {
      if (!vs.dead) return; const t = T / K;
      const u = eio(clamp((t - .4) / 1.0, 0, 1)), a = 84 * u, wob = t < .4 ? Math.sin(t * 70) * (t > .3 ? 1.2 : 0) : 0;   // Riegel klackt, dann schwingen die Flügel auf
      const stop = t > 1.4 ? Math.exp(-(t - 1.4) * 9) * Math.sin((t - 1.4) * 30) * 1.6 : 0;
      L.style.transform = `rotateY(${(a + wob + stop).toFixed(2)}deg)`; R.style.transform = `rotateY(${(-a - wob - stop).toFixed(2)}deg)`;
      Ls.style.opacity = Rs.style.opacity = (u * .85).toFixed(3);
      gi.style.transform = `scale(${(1.1 - .1 * ease3(clamp((t - .3) / 1.4, 0, 1))).toFixed(4)})`;
      gb.style.opacity = clamp(u * 1.25, 0, 1).toFixed(3); gf.style.opacity = (Math.min(1, u * 1.3) * .55).toFixed(3);
      const dv = clamp((t - .7) / .6, 0, 1) * (t > 1.7 ? clamp(1 - (t - 1.7) / .25, 0, 1) : 1);
      ds.forEach((e, i) => { const p = P[i]; e.style.opacity = (dv * (.45 + .55 * Math.sin(t * 3 * p.f + p.a) ** 2)).toFixed(3); e.style.transform = `translate3d(${(Math.sin(t * p.f * 1.3 + p.a) * 14).toFixed(1)}px,${(-t * 9 * p.f + Math.cos(t * p.f * 2 + p.a) * 8).toFixed(1)}px,0)` });
    });
  }

  // ---------- 4. Tagesstart: S51 fährt einmal quer durchs Bild ----------
  function s51Anim() {
    const g = stage('as', '<div class="sq"><i class="ss"></i><div class="sb"></div></div><div class="sp"><i></i><i></i><i></i><i></i><i></i><i></i></div>', false);
    const q = g.querySelector('.sq'), sp = [...g.querySelectorAll('.sp i')], DUR = 2.0; FX.s51Snd();
    const W = () => innerWidth, bw = () => q.offsetWidth || W() * .6;
    run(g, DUR, t => {
      const u = t / DUR, x = W() * 1.04 - (W() + bw() * 2.1) * u;   // von rechts nach links (Fahrzeug blickt nach links)
      const bob = Math.sin(t * 38) * 1.6 * (1 - .4 * u), lean = -1.2 + Math.sin(t * 19) * .5;
      q.style.transform = `translate3d(${x.toFixed(1)}px,${bob.toFixed(2)}px,0) rotate(${lean.toFixed(2)}deg)`;
      sp.forEach((e, i) => { const tt = t - i * .1, k = clamp(tt / .9, 0, 1), px = W() * 1.04 - (W() + bw() * 2.1) * clamp(i * .1 / DUR + .0, 0, 1) - (W() + bw() * 2.1) * 0; const ex = (W() * 1.04 - (W() + bw() * 2.1) * clamp((t - i * .12) / DUR, 0, 1)) + bw() * .96; e.style.opacity = (k > 0 && k < 1 ? (1 - k) * .5 : 0).toFixed(3); e.style.transform = `translate3d(${(ex + k * 70).toFixed(1)}px,${(-k * 26 - i * 2).toFixed(1)}px,0) scale(${(.5 + k * 2.2).toFixed(2)})` });
    });
  }

  // ---------- 5. Start: „Hofeinfahrt“ (Video aus Flow: offenes Scheunentor im Morgenlicht, die S51 rollt nach vorn auf den Hof) ----------
  function homeAnim() {
    const g = stage('ah', '<div class="hk"></div>');
    const box = g.querySelector('.abx'), hk = g.querySelector('.hk'), DUR = 4.4;
    const vs = video(box, 'home-hof', 'home-hof.jpg'); FX.s51Snd(2.2);
    run(g, DUR, t => { if (vs.dead) hk.style.transform = `scale(${(1 + .09 * clamp(t / DUR, 0, 1)).toFixed(4)})` });   // Ersatz: Standbild mit langsamer Kamerafahrt
  }

  // ---------- Auslöser: bei jedem Tipp auf den Bereich (auch bei reduzierter Bewegung), nicht doppelt ----------
  const MAP = {pr: prAnim, missions: lernAnim, garage: garAnim, home: homeAnim};
  let touched = false; addEventListener('pointerdown', () => { touched = true }, true);   // Start-Animation nur nach echtem Tipp, nicht beim App-Start (dort läuft der Tagesstart)
  const _go2 = window.go;
  window.go = function (v) {
    try { const f = MAP[v]; if (f && !busy() && (v !== 'home' || touched)) f() } catch (e) {}
    return _go2.apply(null, arguments);
  };
  // Tagesstart: beim ersten App-Start des Tages
  const TAGKEY = 'ss_tagesstart';
  function tagHeute() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() }
  function tagesstart(n) {
    let seen = null; try { seen = localStorage.getItem(TAGKEY) } catch (e) {}
    const h = tagHeute(); if (seen === h) return;
    if (busy()) { if (n < 4) setTimeout(() => tagesstart(n + 1), 2800); return }
    try { localStorage.setItem(TAGKEY, h) } catch (e) {}
    try { s51Anim() } catch (e) {}
  }
  setTimeout(() => tagesstart(0), 900);
  window.__anim4 = {pr: prAnim, lern: lernAnim, gar: garAnim, s51: s51Anim};
})();

// Rolltor-Ton: echte Aufnahme (Wikimedia Commons, „Garage door opening“, ezwa / PDSounds, gemeinfrei), zugeschnitten auf ca. 5,5 s (Riegel klackt, Tor fährt, Anschlag). Nur bei FX.on(). Lässt sie sich nicht laden/abspielen, gilt der bisherige Synth-Ton.
(function () {
  if (!window.FX || !FX.gateSnd) return;
  const syn = FX.gateSnd, URL = 'v2/img/anim/rolltor.m4a'; let raw = null, buf = null, failed = false;
  try { fetch(URL).then(r => r.ok ? r.arrayBuffer() : Promise.reject()).then(b => { raw = b }).catch(() => { failed = true }) } catch (e) { failed = true }
  FX.gateSnd = function () {
    if (!this.on()) return; const c = this.A(); if (!c) return;
    const fb = () => { try { syn.call(this) } catch (e) {} };
    const play = b => { try { const s = c.createBufferSource(); s.buffer = b; const g = c.createGain(); g.gain.value = .9; s.connect(g); g.connect(this.out()); s.start(c.currentTime + .18) } catch (e) { fb() } };
    if (buf) return play(buf);
    if (failed || !raw) return fb();
    try { c.decodeAudioData(raw.slice(0)).then(b => { buf = b; play(b) }).catch(() => { failed = true; fb() }) } catch (e) { failed = true; fb() }
  };
})();
