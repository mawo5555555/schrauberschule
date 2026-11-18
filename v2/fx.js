'use strict';
// V2 FX: Bilder (KI -> Foto -> SVG), Web-Audio-Sounds, Funken/Rauch, Schrauber-Begrüßung, Querformat-Hinweis.
const IM = window.IMGS || {ki: [], foto: [], teile: []};
const PICMAP = {s51: 's51', sr50: 'sr50', schwalbe: 'kr51', s50: 's50', habicht: 'habicht', hero: 's51', werkstatt: 's51'};
function svgBike(name, label) {
  if (name === 'klapprad' && window.svgKlapp) return svgKlapp(label);
  const three = name === 'duo', roller = name === 'sr50' || name === 'schwalbe';
  const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0a1220" stroke="#d9e2ec" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r - 12}" fill="none" stroke="#2f4767" stroke-width="2" stroke-dasharray="3 5"/><circle cx="${x}" cy="${y}" r="6" fill="#5fb8ff"/>`;
  const body = roller
    ? `<path d="M120 150 Q150 80 215 82 L300 90 Q330 100 318 150 L250 168 L150 170Z" fill="#1f6fe0" stroke="#5fb8ff" stroke-width="3"/><path d="M262 90 L292 40 L308 44" stroke="#d9e2ec" stroke-width="6" fill="none"/>`
    : `<path d="M130 120 L200 72 L270 80 L300 110 L230 140Z" fill="#1f6fe0" stroke="#5fb8ff" stroke-width="3"/><path d="M110 98 Q150 84 205 90 L200 100 Q150 98 112 112Z" fill="#d9e2ec"/><path d="M255 70 L290 36 L312 40 M290 40 L318 112" stroke="#d9e2ec" stroke-width="6" fill="none"/><rect x="190" y="124" width="46" height="30" rx="6" fill="#8aa0ba"/>`;
  return `<svg viewBox="0 0 440 240" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="fb${name}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16304f"/><stop offset="1" stop-color="#070b12"/></linearGradient></defs><rect width="440" height="240" fill="url(#fb${name})"/><ellipse cx="220" cy="214" rx="170" ry="9" fill="#000" opacity=".4"/>${body}${wheel(110, 168, 40)}${wheel(330, 168, 40)}${three ? wheel(250, 176, 32) : ''}<text x="220" y="30" text-anchor="middle" fill="#8aa0ba" font-size="16" font-family="system-ui" font-weight="700">${label || ''}</text></svg>`;
}
// Bild: zuerst v2/img/ki/<name>.jpg, sonst v2/img/foto/<datei>.jpg, sonst SVG-Zeichnung
function picUrl(name) {
  if (IM.ki.includes(name)) return {url: 'v2/img/ki/' + name + '.jpg', src: 'ki'};
  const f = PICMAP[name]; if (f && IM.foto.includes(f)) return {url: 'v2/img/foto/' + f + '.jpg', src: 'foto'};
  return {src: 'svg'};
}
function pic(name, cls = '', label = '') {
  const p = picUrl(name);
  if (p.url) return `<div class="pic ${cls}" data-src="${p.src}" style="background-image:url(${p.url})" role="img" aria-label="${label}"></div>`;
  return `<div class="pic svg ${cls}" data-src="svg" role="img" aria-label="${label}">${svgBike(name, label)}<span class="nb">Bild folgt</span></div>`;
}
const teilBild = id => IM.teile.includes(id) ? 'v2/img/teile/' + id + '.jpg' : null;
// Bild als Canvas-Quelle laden (nur wenn vorhanden)
function picLoad(name) { return new Promise(res => { const p = picUrl(name); if (!p.url) return res(null); const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = p.url }) }

const FX = {
  ctx: null, idle: null, m: null, spk: null, rdest: null, force: false,
  // Ausgang: Master -> Lautsprecher (nur bei „Ton an“) und -> Aufnahme-Stream (für Video)
  out() { const c = this.A(); if (!this.m) { this.m = c.createGain(); this.spk = c.createGain(); this.m.connect(this.spk); this.spk.connect(c.destination); this.rdest = c.createMediaStreamDestination(); this.m.connect(this.rdest) } this.spk.gain.value = S.sound !== false ? 1 : 0; return this.m },
  A() { try { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx } catch (e) { return null } },
  on() { return this.force || S.sound !== false },
  noise(d, f, g, type) { const c = this.A(); if (!c) return; const b = c.createBuffer(1, Math.max(1, c.sampleRate * d), c.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; const gg = c.createGain(); gg.gain.setValueAtTime(g, c.currentTime); gg.gain.exponentialRampToValueAtTime(.001, c.currentTime + d); s.connect(fl); fl.connect(gg); gg.connect(this.out()); s.start() },
  tone(f, d, g, t) { const c = this.A(); if (!c) return; const o = c.createOscillator(), gg = c.createGain(); o.type = t || 'sine'; o.frequency.value = f; gg.gain.setValueAtTime(g, c.currentTime); gg.gain.exponentialRampToValueAtTime(.001, c.currentTime + d); o.connect(gg); gg.connect(this.out()); o.start(); o.stop(c.currentTime + d) },
  ratchet() { if (!this.on()) return; for (let i = 0; i < 6; i++) setTimeout(() => { this.noise(.03, 3000, .25, 'highpass'); this.tone(1800, .03, .08, 'square') }, i * 55) },
  air() { if (!this.on()) return; for (let i = 0; i < 14; i++) setTimeout(() => this.noise(.04, 900, .35), i * 30) },
  clink() { if (!this.on()) return; this.tone(2400, .5, .15); this.tone(3700, .35, .08); this.noise(.05, 5000, .15, 'highpass') },
  start() {
    if (!this.on() || this.idle) return; const c = this.A(); if (!c) return;
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 38; const g = c.createGain(); g.gain.value = 0;
    const l = c.createOscillator(); l.frequency.value = 14; const lg = c.createGain(); lg.gain.value = .12; l.connect(lg); lg.connect(g.gain);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 320; o.connect(f); f.connect(g); g.connect(this.out());
    g.gain.setTargetAtTime(.12, c.currentTime, .3); o.start(); l.start(); this.idle = {o, g, l}
  },
  rev(sec = 3.4) {
    this.rollerRun(sec); if (!this.on()) return; this.start(); const c = this.A(); if (!c || !this.idle) return; const t = c.currentTime, {o, l} = this.idle;
    o.frequency.cancelScheduledValues(t); l.frequency.cancelScheduledValues(t);
    o.frequency.setValueAtTime(38, t); o.frequency.exponentialRampToValueAtTime(190, t + sec * .47); l.frequency.setValueAtTime(14, t); l.frequency.exponentialRampToValueAtTime(75, t + sec * .47);
    o.frequency.exponentialRampToValueAtTime(38, t + sec); l.frequency.exponentialRampToValueAtTime(14, t + sec); setTimeout(() => this.off(), sec * 1000 + 300)
  },
  off() { if (this.idle) { const i = this.idle; this.idle = null; try { i.g.gain.setTargetAtTime(0, this.ctx.currentTime, .1); setTimeout(() => { try { i.o.stop(); i.l.stop() } catch (e) {} }, 500) } catch (e) {} } },
  rollerRun(sec) { const r = document.querySelectorAll('.roller'); r.forEach(e => e.classList.add('run')); clearTimeout(this._rt); this._rt = setTimeout(() => document.querySelectorAll('.roller').forEach(e => e.classList.remove('run')), sec * 1000) },
  // Funken und Rauch an einer Stelle (Bildschirmkoordinaten)
  burst(x, y, n = 10, smoke = false) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < n; i++) { const e = document.createElement('i'); e.className = 'fx' + (smoke ? ' smk' : ''); e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.setProperty('--dx', (Math.random() * 90 - 45) + 'px'); e.style.setProperty('--dy', (Math.random() * -60 + 10) + 'px'); document.body.appendChild(e); setTimeout(() => e.remove(), 1500) }
  },
  burstAt(el, n, smoke) { if (!el) return; const r = el.getBoundingClientRect(); this.burst(r.left + r.width / 2, r.top + r.height / 2, n, smoke) }
};

// Ton-Schalter und Begrüßung
const GREET = ['Hallo Schrauber!', 'Moin Mechaniker!', 'Werkstatt offen!', 'Ran an den Schlüssel!', 'Zweitakter warten!', 'Öl auf die Hände!', 'Kerze raus, Kopf rein!', 'Heute wird getunt!', 'Schlüssel 10 bitte!', 'Gemisch 1:50, los!'];
function greet() { const n = S.name ? ', ' + S.name : ''; const g = GREET[Math.floor(Math.random() * GREET.length)]; const e = document.getElementById('gt'); if (e) e.textContent = g.replace(/!$/, n + '!') }
function sndLabel() { const b = document.getElementById('snd'); if (b) { b.textContent = S.sound !== false ? 'Ton an' : 'Ton aus'; b.setAttribute('aria-pressed', S.sound !== false) } }
function sndToggle() { S.sound = !(S.sound !== false); save(); sndLabel(); if (S.sound) { FX.A(); FX.clink() } else FX.off() }
document.addEventListener('click', e => {
  const t = e.target.closest('.opt2,.vt,.mods span,.fc,.btn,.item'); if (!t || !FX.on()) return;
  if (t.matches('.opt2,.mods span')) FX.clink(); /* Klick-Ton der Buttons: anim.js (FX.tick) */
}, true);
// Querformat-Hinweis
let ROTX = false; try { ROTX = sessionStorage.getItem('rotx') === '1' } catch (e) {}
const rotHint = () => ROTX ? '' : `<div class="hint" id="rot"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 18h.01"/></svg>Handy drehen für bessere Ansicht<button onclick="rotClose()" aria-label="Hinweis schließen">×</button></div>`;
function rotClose() { ROTX = true; try { sessionStorage.setItem('rotx', '1') } catch (e) {} document.querySelectorAll('.hint').forEach(h => h.remove()) }
(function () { const q = (location.search.match(/farbe=(\w+)/) || [])[1]; if (q) document.documentElement.dataset.farbe = q })();
