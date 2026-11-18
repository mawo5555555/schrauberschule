'use strict';
// Motor- und Bediengeräusche (Schrauberschule v3.0). Reine Synthese in Web Audio, keine fremden Audiodateien.
// Zweitakt-Einzylinder: eine Zündung je Umdrehung, Zündfrequenz = Drehzahl / 60 Hz (z. B. 6000 U/min = 100 Hz, Leerlauf 1300 U/min = ca. 22 Hz).
// Aufbau: Zündimpulse (kurze Knall-Samples, einzeln geplant: Jitter, Aussetzer) -> Auspuff-Resonanzen (parallele Bandpässe) -> leichte Sättigung -> Ausgang.
// Dazu Ansaugrauschen (lastabhängig), mechanisches Klappern, Rollen-Heulen, Lüfter. Alles folgt dem Ton-Schalter (FX.on / FX.out).
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / .8;

  // Klangprofile: Auspuffart (o Serie, s Sport, r Resonanz). f = Resonanzfrequenzen, q = Güten, g = Pegel, ring = Pegel des hellen "Ring" um 2,4 kHz
  const PROF = {
    // Stand Sound-Abgleich (Nacht 17.11.2026): Serie "o" nach Simson-Referenz (Freesound CC0) angehoben in Mitten/Höhen (vorher fehlten 4 bis 6 dB bei 0,4 bis 1,6 kHz und 2 bis 8 kHz); "s"/"r" nur im Abstand mitgezogen, nicht gegen echte Sport-Aufnahmen geprüft
    o: {f: [165, 370, 780, 1550], q: [2.2, 2.4, 2.6, 3], g: [1.2, 1.1, 1.1, .9], ring: .16, vol: .55, bright: 3400, noise: 1.1},
    s: {f: [180, 410, 880, 1760], q: [2.2, 2.8, 3.2, 3.8], g: [1.1, 1, .9, .65], ring: .22, vol: .72, bright: 4200, noise: .85},
    r: {f: [210, 470, 1000, 2000], q: [2.2, 3, 4, 5], g: [.9, .95, .9, .7], ring: .36, vol: .95, bright: 5200, noise: .95},
    // MTX-Stil Großhubraum-Aufbau (ca. 130 cm³, Resonanzauspuff, Showbau): tiefer Grundton, schärfer und lauter; nur für diese Stufe, die anderen Profile bleiben unverändert (Spielklang, nicht gemessen)
    m: {f: [135, 300, 650, 1500], q: [2.2, 3, 4.6, 6], g: [1.05, 1, .95, .85], ring: .52, vol: 1.0, bright: 6400, noise: .9}
  };

  function noiseBuf(c, sec) { const b = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate), d = b.getChannelData(0); let b0 = 0, b1 = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b0 = .98 * b0 + .02 * w; b1 = .6 * b1 + .4 * w; d[i] = w * .6 + b0 * 6 + b1 * .3 } return b }
  function loopSrc(c, buf) { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; return s }
  function curve(k) { const n = 1024, a = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; a[i] = Math.tanh(x * k) / Math.tanh(k) } return a }

  // Ein Zündknall: tiefer Schlag (fallende Sinus-Frequenz) + Knackrauschen, Dauer 60 ms. Größerer Zylinder = tiefer.
  function pulseBuf(c, ccm) {
    const sr = c.sampleRate, n = Math.floor(sr * .07), b = c.createBuffer(1, n, sr), d = b.getChannelData(0);
    const f1 = clamp(80 - (ccm - 50) * .8, 50, 90), f0 = f1 * 1.9, sharp = ccm > 100 ? 1 : 0; let ph = 0;   // sharp: nur MTX-Stil, schärferer Knall
    for (let i = 0; i < n; i++) {
      const t = i / sr, f = f1 + (f0 - f1) * Math.exp(-t / .006); ph += 2 * Math.PI * f / sr;
      const thump = Math.sin(ph) * Math.exp(-t / .009), crack = (Math.random() * 2 - 1) * Math.exp(-t / (sharp ? .0026 : .0032)) * (sharp ? 3.3 : 2.4), mid = (Math.random() * 2 - 1) * Math.exp(-t / .009) * 1.0;
      d[i] = (thump * .65 + crack + mid) * (t < .0008 ? t / .0008 : 1);
    }
    return b;
  }

  function Eng(c, dest, o) {
    o = o || {}; const P = PROF[o.kind] || PROF.o; this.c = c; this.o = o; this.P = P; this.kl = !!o.kl;
    const ccm = o.ccm || 50, big = Math.pow(50 / clamp(ccm, 40, ccm > 100 ? 140 : 110), .22);   // größerer Zylinder: Resonanzen tiefer
    this.pb = pulseBuf(c, ccm); this.nb = noiseBuf(c, 2);
    const out = this.out = c.createGain(); out.gain.value = 0; out.connect(dest);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -22; comp.ratio.value = 3.5; comp.attack.value = .004; comp.release.value = .12; comp.connect(out);
    const sh = c.createWaveShaper(); sh.curve = curve(1.6); sh.oversample = '2x'; sh.connect(comp);
    const lp = this.lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = P.bright * 2.3; lp.Q.value = .5; lp.connect(sh);
    const sum = c.createGain(); sum.gain.value = 1; sum.connect(lp);
    const bus = this.bus = c.createGain(); bus.gain.value = 1;
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 30; hp.Q.value = .6; bus.connect(hp);
    const dir = c.createGain(); dir.gain.value = 1.0; hp.connect(dir); dir.connect(sum);
    this.bp = P.f.map((f, i) => { const b = c.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f * big; b.Q.value = P.q[i]; const g = c.createGain(); g.gain.value = P.g[i] * (i < 2 ? 3.0 : 1.9); hp.connect(b); b.connect(g); g.connect(sum); return b });
    const ring = c.createBiquadFilter(); ring.type = 'bandpass'; ring.frequency.value = 2400 * big; ring.Q.value = 5; const rg = c.createGain(); rg.gain.value = P.ring * 2.2; hp.connect(ring); ring.connect(rg); rg.connect(sum); this.ringG = rg;
    // Ansaugen
    const ns = loopSrc(c, this.nb), nbp = c.createBiquadFilter(); nbp.type = 'bandpass'; nbp.frequency.value = 650; nbp.Q.value = .7; const ng = this.ng = c.createGain(); ng.gain.value = 0; ns.connect(nbp); nbp.connect(ng); ng.connect(sum); ns.start(0);
    // Mechanik (Kolben, Steuerung): heller, leise
    const ms = loopSrc(c, this.nb), mbp = c.createBiquadFilter(); mbp.type = 'bandpass'; mbp.frequency.value = 3100; mbp.Q.value = 1.1; const mg = this.mg = c.createGain(); mg.gain.value = 0; ms.connect(mbp); mbp.connect(mg); mg.connect(lp); ms.start(0);
    this.src = [ns, ms];
  }
  // Parameter zum Zeitpunkt t setzen (online weich, offline exakt)
  Eng.prototype.set = function (t, rpm, load, hard) {
    const P = this.P, ld = clamp(load, 0, 1), r = clamp(rpm / 8000, 0, 1.3), fn = hard ? 'setValueAtTime' : 'setTargetAtTime', k = hard ? undefined : .05;
    const set = (prm, v) => { if (hard) prm.setValueAtTime(v, t); else prm.setTargetAtTime(v, t, .05) };
    set(this.ng.gain, (.012 + .075 * ld * r * r + .02 * ld) * P.noise * 1.7);
    set(this.mg.gain, (.01 + .07 * r * (.4 + ld * .6)) * P.noise * 9);
    set(this.lp.frequency, P.bright * 2.3 * (.55 + .6 * ld) * (.8 + .3 * r));
  };
  // Einzelner Zündimpuls
  Eng.prototype.pulse = function (t, amp, rate) {
    const s = this.c.createBufferSource(); s.buffer = this.pb; s.playbackRate.value = (rate || 1) * rnd(.95, 1.06);
    const g = this.c.createGain(); g.gain.value = amp; s.connect(g); g.connect(this.bus); s.start(t);
  };
  Eng.prototype.on = function (t, vol) { this.out.gain.cancelScheduledValues(t); this.out.gain.setTargetAtTime(this.P.vol * (vol == null ? 1 : vol), t, .08) };
  Eng.prototype.off = function (t) { this.out.gain.cancelScheduledValues(t); this.out.gain.setTargetAtTime(0, t, .12) };

  // Zündfolge: nächster Abstand und Amplitude aus Drehzahl, Last, Gemisch ("fat" > 1.5 blubbert, "lean" rauer)
  function fireStep(st, rpm, load, mix) {
    const per = 60 / Math.max(500, rpm), idle = rpm < 2300 && load < .3;
    let jit = idle ? .07 : .012, amp = (.32 + .68 * Math.pow(clamp(load, 0, 1), .8)) * rnd(.86, 1.12);
    let skip = false;
    if (idle) { st.n = (st.n || 0) + 1; const pm = mix.fat > 1.5 ? .3 : .16; if (Math.random() < pm) skip = true; if (st.n % 7 === 0) amp *= .55 }   // Viertakten im Leerlauf: ab und zu fehlt eine Zündung
    else if (load > .6 && mix.lean) { jit = .03; amp *= rnd(.7, 1.3) }
    else if (load < .1) { amp *= .45; if (Math.random() < .25) skip = true }   // Schubbetrieb
    return {dt: per * (1 + gauss() * jit), amp: skip ? 0 : amp};
  }

  // ---------- Prüfstand-Ton (online) ----------
  function start(st, cx) {
    const F = window.FX; if (!F || !F.on()) return null; const c = F.A(); if (!c) return null;
    const dest = F.out(), kl = cx.kl, sim = st.sim;
    let kind = 'o'; try { if (!kl) kind = opt('aus', cx.pick.aus).kind; if (!kl && cx.pick.zyl === 'z130') kind = 'm' } catch (e) {}   // MTX-Stil: eigenes Klangprofil 'm'
    const mix = {fat: cx.p && cx.p.kerze === 'schwarz' ? 2 : 1, lean: cx.p && cx.p.kerze === 'weiß'};
    const master = c.createGain(); master.gain.value = 0; master.connect(dest); master.gain.setTargetAtTime(1, c.currentTime, .05);
    const nodes = [];
    const nbuf = noiseBuf(c, 2);
    const eng = kl ? null : new Eng(c, master, {kind, ccm: cx.ccm}); if (eng) { eng.on(c.currentTime); nodes.push(eng) }
    // Rollen-Heulen (Lager, Riffelung, Reifen) + Rumpeln
    const ro = c.createOscillator(), ro2 = c.createOscillator(), rbp = c.createBiquadFilter(), rg = c.createGain(), r2g = c.createGain();
    ro.type = 'sawtooth'; ro2.type = 'triangle'; rbp.type = 'bandpass'; rbp.frequency.value = 520; rbp.Q.value = .9; rg.gain.value = 0; r2g.gain.value = 0;
    ro.connect(rbp); ro2.connect(r2g); r2g.connect(rbp); rbp.connect(rg); rg.connect(master); ro.start(); ro2.start();
    const rum = loopSrc(c, nbuf), rlp = c.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 170; const rmg = c.createGain(); rmg.gain.value = 0; rum.connect(rlp); rlp.connect(rmg); rmg.connect(master); rum.start();
    // Lüfter: Rauschen + Blattfolge-Ton (5 Flügel x ca. 20 U/s = 100 Hz)
    const fs = loopSrc(c, nbuf), flp = c.createBiquadFilter(); flp.type = 'lowpass'; flp.frequency.value = 900; const fbp = c.createBiquadFilter(); fbp.type = 'bandpass'; fbp.frequency.value = 2300; fbp.Q.value = .5;
    const fg = c.createGain(), fg2 = c.createGain(); fg.gain.value = 0; fg2.gain.value = 0; fs.connect(flp); flp.connect(fg); fs.connect(fbp); fbp.connect(fg2); fg.connect(master); fg2.connect(master); fs.start();
    const fh = c.createOscillator(); fh.frequency.value = 96; const fhg = c.createGain(); fhg.gain.value = 0; fh.connect(fhg); fhg.connect(master); fh.start();
    // Klapprad: Kettenschnurren + Freilauf-Klicken
    const cs = kl ? loopSrc(c, nbuf) : null, cbp = kl ? c.createBiquadFilter() : null, cg = kl ? c.createGain() : null;
    if (kl) { cbp.type = 'bandpass'; cbp.frequency.value = 2900; cbp.Q.value = 1.3; cg.gain.value = 0; cs.connect(cbp); cbp.connect(cg); cg.connect(master); cs.start() }
    const clickBuf = (() => { const b = c.createBuffer(1, Math.floor(c.sampleRate * .012), c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * .0018)); return b })();
    const click = (t, g) => { const s = c.createBufferSource(); s.buffer = clickBuf; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = rnd(2400, 3600); f.Q.value = 2; const gg = c.createGain(); gg.gain.value = g; s.connect(f); f.connect(gg); gg.connect(master); s.start(t) };
    let next = c.currentTime + .05, fst = {}, lastPop = sim.popN || 0, stopped = false, lastFree = 0;
    const tm = setInterval(() => {
      if (stopped) return; const now = c.currentTime;
      const rpm = sim.rpm, load = sim.load, rps = sim.rpsW || 0, vn = clamp(rps * 2.4 / 22, 0, 1);
      if (eng) {
        eng.set(now, rpm, load);
        const horizon = now + .12;
        if (next < now) next = now + .005;
        while (next < horizon && rpm > 500) { const f = fireStep(fst, rpm, load, mix); if (f.amp > 0) eng.pulse(next, f.amp); next += f.dt }
        if ((sim.popN || 0) !== lastPop) { for (let k = (sim.popN || 0) - lastPop; k > 0; k--) { const t = now + rnd(.0, .25); eng.pulse(t, rnd(1.4, 2.4), .8); eng.pulse(t + .012, 1.1, .6) } lastPop = sim.popN || 0 }
        if (sim.shiftEv) { sim.shiftEv = false; const t = now + .02; click(t, .35); const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + .08); g.gain.setValueAtTime(.2, t); g.gain.exponentialRampToValueAtTime(.001, t + .1); o.connect(g); g.connect(master); o.start(t); o.stop(t + .12) }
      } else {
        const cad = sim.cad || 0; cg.gain.setTargetAtTime(.012 * clamp(cad / 100, 0, 1.3) * (sim.load > .1 ? 1 : .25), now, .08); cbp.frequency.setTargetAtTime(2400 + cad * 6, now, .1);
        if (sim.load < .1 && rps > .4) { const rate = rps * 18; while (lastFree < now + .12) { if (lastFree < now) lastFree = now; click(lastFree, .12 * clamp(rps / 5, .2, 1)); lastFree += 1 / rate * rnd(.85, 1.15) } }   // Freilauf-Klinken (18 Zähne)
      }
      ro.frequency.setTargetAtTime(32 + rps * 2.4 * 13, now, .05); ro2.frequency.setTargetAtTime(64 + rps * 2.4 * 26.5, now, .05);
      rg.gain.setTargetAtTime(.04 * vn, now, .1); r2g.gain.setTargetAtTime(.5, now, .1); rmg.gain.setTargetAtTime(.05 * vn * vn + .004, now, .1);
      fg.gain.setTargetAtTime(.034 * sim.fw, now, .15); fg2.gain.setTargetAtTime(.013 * sim.fw, now, .15); fhg.gain.setTargetAtTime(.008 * sim.fw, now, .15);
      if (sim.done || sim.ph === 5 && sim.tp > .8) { sim.fanOn = false }
    }, 25);
    return {stop() { stopped = true; clearInterval(tm); const now = c.currentTime; master.gain.setTargetAtTime(0, now, .25); if (eng) eng.off(now); setTimeout(() => { try { [ro, ro2, fh].forEach(o => o.stop()); [rum, fs, cs].forEach(s => s && s.stop()); if (eng) eng.src.forEach(s => s.stop()); master.disconnect() } catch (e) {} }, 1600) }};
  }

  // ---------- Offline-Rendern (für den Vergleich mit echten Aufnahmen) ----------
  // rpmFn(t) -> U/min, loadFn(t) -> 0..1. Rückgabe: Promise<Float32Array>
  function offline(sr, dur, rpmFn, loadFn, o) {
    const oc = new OfflineAudioContext(1, Math.floor(sr * dur), sr);
    const master = oc.createGain(); master.gain.value = 1; master.connect(oc.destination);
    const eng = new Eng(oc, master, o); eng.on(0);
    const mix = Object.assign({fat: 1, lean: false}, o && o.mix), fst = {};
    for (let t = 0; t < dur; t += .05) eng.set(t, rpmFn(t), loadFn(t), true);
    let t = .01; while (t < dur) { const rpm = rpmFn(t), f = fireStep(fst, rpm, loadFn(t), mix); if (f.amp > 0) eng.pulse(t, f.amp); t += f.dt }
    return oc.startRendering().then(b => b.getChannelData(0));
  }

  // ---------- Bediengeräusche (Simson-Anmutung, synthetisch) ----------
  const B = {
    nb: null,
    ctx() { const F = window.FX; if (!F || !F.on()) return null; const c = F.A(); if (!c) return null; return {c, out: F.out(), F} },
    n(c) { if (!this.nb || this.nb.sampleRate !== c.sampleRate) this.nb = noiseBuf(c, .6); return this.nb },
    burst(x, t, f, q, g, d, type) { const c = x.c, s = c.createBufferSource(); s.buffer = this.n(c); const fl = c.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q || 1.2; const gg = c.createGain(); gg.gain.setValueAtTime(g, t); gg.gain.exponentialRampToValueAtTime(.0006, t + d); s.connect(fl); fl.connect(gg); gg.connect(x.out); s.start(t, Math.random() * .3, d + .02) },
    thump(x, t, f0, f1, g, d) { const c = x.c, o = c.createOscillator(), gg = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d); gg.gain.setValueAtTime(g, t); gg.gain.exponentialRampToValueAtTime(.0006, t + d); o.connect(gg); gg.connect(x.out); o.start(t); o.stop(t + d + .02) },
    ping(x, t, f, g, d) { const c = x.c, o = c.createOscillator(), gg = c.createGain(); o.type = 'sine'; o.frequency.value = f; gg.gain.setValueAtTime(g, t); gg.gain.exponentialRampToValueAtTime(.0006, t + d); o.connect(gg); gg.connect(x.out); o.start(t); o.stop(t + d + .02) },
    // Blinkerschalter (Kippschalter am Lenker): kurzes "klick" mit Kunststoff-Anschlag und feinem Federklang
    tick() { const x = this.ctx(); if (!x) return; const t = x.c.currentTime; this.burst(x, t, 3300, 1.4, .13, .012); this.thump(x, t, 520, 260, .11, .03); this.burst(x, t + .011, 1500, 1.2, .06, .02); this.ping(x, t + .004, 5400, .012, .05) },
    // Gangschaltung: Schaltpedal, Metall auf Metall, "klack" mit dumpfem Nachschlag
    klack() { const x = this.ctx(); if (!x) return; const t = x.c.currentTime; this.burst(x, t, 1100, 1.1, .2, .03); this.thump(x, t, 190, 80, .22, .07); this.ping(x, t, 2300, .035, .09); this.burst(x, t + .045, 2700, 1.6, .07, .015); this.thump(x, t + .05, 120, 70, .08, .05) },
    // Zündschlüssel: Schloss dreht (Rasten, zwei Klicks), Schaltkontakt schnappt, Kontrollleuchte
    key() { const x = this.ctx(); if (!x) return; const t = x.c.currentTime; for (let i = 0; i < 3; i++) this.burst(x, t + i * .035, 2900 + i * 300, 1.8, .09, .01); this.thump(x, t + .13, 240, 140, .14, .05); this.burst(x, t + .13, 2000, 1.3, .12, .02); this.burst(x, t + .27, 3400, 1.5, .11, .012); this.thump(x, t + .27, 380, 200, .1, .04); this.ping(x, t + .275, 4700, .012, .08) },
    // Kickstarter: Tritt (Ratsche mit steigender Folge, dumpfer Kompressionsdruck), dann Zündung wird knapp angedeutet
    kick() { const x = this.ctx(); if (!x) return; const c = x.c, t = c.currentTime; let tt = t; for (let i = 0; i < 9; i++) { this.burst(x, tt, 2100 + i * 120, 1.7, .07 + i * .006, .014); this.thump(x, tt, 300, 180, .04, .02); tt += .042 - i * .0022 }
      this.thump(x, t + .02, 110, 50, .16, .32); this.burst(x, t + .06, 420, .8, .05, .3, 'lowpass');
      const e = new Eng(c, x.out, {kind: 'o', ccm: 50}); e.on(tt + .02, .8); e.set(tt, 1600, .5, true); let p = tt + .05; for (let i = 0; i < 4; i++) { e.pulse(p, rnd(.9, 1.4), 1); p += (.075 + i * .02) * rnd(.9, 1.15) } e.off(p + .1); setTimeout(() => e.src.forEach(s => { try { s.stop() } catch (er) {} }), 1500) },
    // 6-V-Hupe "Möp": Membranhupe, rauer Sägezahn, kurz mit leichtem Frequenzabfall
    horn() { const x = this.ctx(); if (!x) return; const c = x.c, t = c.currentTime, d = .22, g = c.createGain(), lp = c.createBiquadFilter(), o1 = c.createOscillator(), o2 = c.createOscillator(), am = c.createOscillator(), amg = c.createGain();
      o1.type = 'sawtooth'; o2.type = 'square'; o1.frequency.setValueAtTime(402, t); o1.frequency.linearRampToValueAtTime(372, t + d); o2.frequency.setValueAtTime(506, t); o2.frequency.linearRampToValueAtTime(468, t + d);
      am.frequency.value = 95; amg.gain.value = .3; am.connect(amg); lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = .8;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .02); g.gain.setValueAtTime(.16, t + d - .03); g.gain.linearRampToValueAtTime(0, t + d); amg.connect(g.gain);
      const mixg = c.createGain(); mixg.gain.value = .6; o1.connect(lp); o2.connect(mixg); mixg.connect(lp); lp.connect(g); g.connect(x.out); [o1, o2, am].forEach(o => { o.start(t); o.stop(t + d + .03) }); this.burst(x, t, 1300, 1, .05, .03) },
    // Blinkrelais: Bimetall-/Kondensatorrelais, abwechselnd "tack" (an) und "tick" (aus)
    relay(on) { const x = this.ctx(); if (!x) return; const t = x.c.currentTime; if (on) { this.burst(x, t, 1800, 1.3, .12, .014); this.thump(x, t, 380, 200, .1, .03) } else { this.burst(x, t, 3000, 1.5, .09, .011); this.thump(x, t, 520, 300, .05, .02) } }
  };

  window.PSTSND = {start, offline, Eng, fireStep, PROF, B};

  // ---------- Einhängen: Klick-Ton, Tab-Wechsel, Schlüssel, Kickstarter, Hupe, Blinkrelais ----------
  if (window.FX) {
    FX.tick = function () { B.tick() };
    FX.klack = function () { B.klack() }; FX.key = function () { B.key() }; FX.kick = function () { B.kick() }; FX.horn = function () { B.horn() };
  }
  const guard = f => { try { return f() } catch (e) {} };
  // Tab-Wechsel = Gangschaltung; Betreten der Werkstatt = Zündschlüssel (das Rolltor bringt seinen eigenen Ton mit)
  const TABS = ['home', 'w2', 'pr', 'missions', 'garage'];
  if (typeof window.go === 'function') {
    const g0 = window.go;
    window.go = function (v) { const o = view; const r = g0.apply(this, arguments); guard(() => { if (v !== o && TABS.includes(v) && TABS.includes(o)) { if (v === 'w2') FX.key(); else FX.klack() } }); return r };
  }
  // Mission starten = Kickstarter
  ['start', 'w2Mission', 'startMix'].forEach(n => { const f = window[n]; if (typeof f === 'function') window[n] = function () { guard(() => FX.kick()); return f.apply(this, arguments) } });
  // falsche Antwort: Hupe statt tiefem Piepton (app.js ruft tone(190, .22, 0, 'triangle', .1))
  const t0 = window.tone;
  if (typeof t0 === 'function') window.tone = function (f, d, at, type, g) { if (f === 190 && type === 'triangle') { guard(() => FX.horn()); return } return t0.apply(this, arguments) };
  // Zeitdruck: Blinkrelais tickt, solange der Zeitbalken (#tmri) sichtbar ist
  let rel = null, relOn = false;
  const relCheck = () => { const has = !!document.getElementById('tmri'); if (has && !rel) { relOn = false; rel = setInterval(() => { relOn = !relOn; guard(() => FX.on() && B.relay(relOn)) }, 340) } else if (!has && rel) { clearInterval(rel); rel = null } };
  const app = document.getElementById('app'); if (app) new MutationObserver(() => guard(relCheck)).observe(app, {childList: true, subtree: true});
  // erster Fingertipp der Sitzung = Zündschlüssel (App-Start; Browser erlauben Ton erst nach einer Geste)
  let first = false; document.addEventListener('pointerdown', () => { if (first) return; first = true; setTimeout(() => guard(() => FX.on() && FX.key()), 30) }, {once: true, capture: true});
})();
