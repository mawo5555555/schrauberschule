'use strict';
// Prüfstand-Video teilen (Schrauberschule v3.0, Paket 8 Teil C).
// Nimmt den ECHTEN Prüfstandslauf als 9:16-Video auf (720 x 1280, ca. 14 s, 30 Bilder/s, MP4 wenn der Browser es kann, sonst WebM):
// - Eine eigene, unsichtbare Prüfstand-Szene (PST.mount, gleiche Zeichnung, gleiche Simulation makeSim/modelOf wie die Live-Anzeige) läuft in Echtzeit.
// - Pro Bild wird die Szene (SVG) in ein Bild gewandelt (so oft wie der Browser schafft, ca. 15 bis 30 mal pro Sekunde, nie blockierend),
//   Qualm/Lüfterwind kommen aus der Canvas der Szene, Kurve/Zahlen/Ergebnis werden direkt in die Video-Canvas gezeichnet.
//   Die Zahlen stammen aus dem Text der unsichtbaren Szene (dieselbe Render-Funktion wie live), die Kurve aus sim.curve / sim.nm / modelOf.
// - Ton: der Motorsound (PSTSND.start) läuft über FX.out(); FX.rdest (MediaStreamDestination) sitzt im Master vor dem Lautsprecher-Gain,
//   also wird auch bei "Ton aus" aufgenommen (Lautsprecher bleibt dann stumm). Der Live-Ton wird nicht angefasst.
// - Teilen per navigator.share({files}), sonst Download. Abbruch jederzeit.
// Einhängen: ersetzt window.videoShare (Studio-Knopf und Prüfstand-Knopf "Video teilen"); der alte Clip bleibt als window.videoShareAlt.
// HOOK-PUNKT LACK: window.LACK.farbe(fahrzeugId) -> CSS-Farbstring (z. B. '#2f78c8'); wenn vorhanden, wird PST.VEH[id].col für die Video-Szene
//   (und nur beim Aufbau) damit überschrieben. Siehe lackFarbe() unten. Fehlt LACK, bleibt die Standardfarbe.
(function () {
  const W = 720, H = 1280, FPS = 30, DUR = 14, OUT0 = 12.3;
  const SY = 172;                               // Szene (720 x 400) steht ab y = 172
  const SF = '-apple-system,"SF Pro Display",system-ui,"Segoe UI",sans-serif', MONO = 'ui-monospace,Menlo,Consolas,monospace';
  const MIMES = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const de = (x, d) => (+x).toFixed(d == null ? 1 : d).replace('.', ',');
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const $ = id => document.getElementById(id);
  let V = null; window.__p8dbg = /dbg=1/.test(location.hash);                                 // laufende Aufnahme

  // ---------- Hook-Punkt Lack ----------
  function lackFarbe(id) { try { const f = window.LACK && typeof window.LACK.farbe === 'function' ? window.LACK.farbe(id) : null; return typeof f === 'string' && /^(#|rgb|hsl)/i.test(f) ? f : null } catch (e) { return null } }

  // ---------- Kontext aus einem Umbau (Studio) ----------
  function cxFromBuild(b) {
    try {
      const id = b.id, vv = V2V[id]; if (!vv || !PST.VEH[id] || !b.pick) return null;
      if (id === 'klapp') { const pick = b.pick, jet = b.jet || 30, p = kperf(pick, jet, false); return {id, kl: true, p, base: kBase(), pick, jet, ccm: 0} }
      const p = w2perf(vv, b.pick, b.jet || 70), base = w2perf(vv, ORIGP, 70); return {id, kl: false, p, base, pick: b.pick, jet: b.jet || 70, ccm: p.ccm, v: vv};
    } catch (e) { return null }
  }
  function tuneTitle(cx) {
    try {
      if (cx.kl) return 'Muskelkraft gegen Widerstand';
      const same = SLOTS.every(s => cx.pick[s] === ORIGP[s]); if (same) return 'Serienzustand';
      return 'Tuning: ' + SLOTS.map(s => opt(s, cx.pick[s]).n).join(' · ');
    } catch (e) { return '' }
  }

  // ---------- Szene vorbereiten (unsichtbar, in Echtzeit nutzbar oder vorspulbar) ----------
  function prepare(cx) {
    const la = document.createElement('div'); la.className = 'p8v-off'; document.body.appendChild(la);
    const o = PST.VEH[cx.id], oldCol = o.col, lc = lackFarbe(cx.id); if (lc) o.col = lc;
    let st = null; try { st = PST.mount(la, cx) } finally { o.col = oldCol }
    if (!st) { la.remove(); return null }
    const host = st.host, svg = host.querySelector('.pst-sc'), smk = host.querySelector('.pst-cn');
    const M = {cx, st, la, host, svg, smk, img: null, busy: false, ok: 0, fail: 0, url: null, sim: st.sim, mod: cx.kl ? null : PST.modelOf(cx.p), dead: false};
    // Raster: SVG der Szene -> Bild; neues Bild nur wenn das vorige fertig ist (kein Stau)
    M.pump = () => new Promise(res => {
      if (M.busy || M.dead) return res(false); M.busy = true;
      let s; try { s = new XMLSerializer().serializeToString(svg) } catch (e) { M.busy = false; M.fail++; return res(false) }
      s = s.replace(/<svg\b/, '<svg width="720" height="400"');
      const url = URL.createObjectURL(new Blob([s], {type: 'image/svg+xml;charset=utf-8'})), im = new Image();
      im.onload = () => { if (M.url) URL.revokeObjectURL(M.url); M.url = url; M.img = im; M.busy = false; M.ok++; res(true) };
      im.onerror = () => { URL.revokeObjectURL(url); M.busy = false; M.fail++; res(false) };
      im.src = url;
    });
    M.tick = dt => { let r = dt; while (r > 1e-6) { const d = Math.min(r, 1 / 30); st.tick(d); r -= d } };
    M.dispose = () => { M.dead = true; if (M.url) URL.revokeObjectURL(M.url); if (st.sound) { try { st.sound.stop() } catch (e) {} st.sound = null } la.remove() };
    M.layer = makeLayer(cx, M);
    return M;
  }

  // ---------- Diagramm-Geometrie (wie der Live-Messrechner, 320 x 190) ----------
  const CW = 320, CHH = 190, L = 34, B = 22, TT = 14;
  const CX0 = 40, CY0 = 632, SXc = 2.0, SYc = 1.62;
  function axes(cx) {
    const p = cx.p, base = cx.base, kl = cx.kl; let xmin, xmax, ymax, y2max;
    if (kl) { xmin = 0; xmax = 50; ymax = Math.max(300, Math.ceil(Math.max(p.need(50 / 3.6), p.avail(p.vmax / 3.6 || 1), base.pm(8) + 100) / 100) * 100); y2max = ymax }
    else { xmin = 2000; xmax = Math.max(9000, Math.ceil((p.peak + 2200) / 1000) * 1000); ymax = 2 * Math.ceil(Math.max(p.ps, base.ps) * 1.2 / 2); y2max = Math.max(6, Math.ceil(Math.max(...PST.modelOf(p).sweep().map(a => a[2])) * 1.25)) }
    const xs = v => L + (v - xmin) / (xmax - xmin) * (CW - L - 8), ys = v => CHH - B - clamp(v, 0, ymax) / ymax * (CHH - B - TT), ys2 = v => CHH - B - clamp(v, 0, y2max) / y2max * (CHH - B - TT);
    return {xmin, xmax, ymax, y2max, xs, ys, ys2};
  }
  const PX = u => CX0 + u * SXc, PY = v => CY0 + v * SYc;

  function txt(x, t, a, b, size, o) {
    o = o || {}; let s = size; x.font = (o.w || 700) + ' ' + s + 'px ' + (o.f || SF); x.textAlign = o.al || 'left'; x.textBaseline = o.bl || 'alphabetic';
    if (o.max) while (x.measureText(t).width > o.max && s > 10) { s -= 1; x.font = (o.w || 700) + ' ' + s + 'px ' + (o.f || SF) }
    x.fillStyle = o.c || '#eef3f8'; if (o.glow) { x.shadowColor = o.glow; x.shadowBlur = size * .5 } x.fillText(t, a, b); x.shadowBlur = 0;
  }
  function rrect(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath() }

  // ---------- Statische Schicht (einmal gezeichnet): Hintergrund, Kopf, Rahmen, Raster, Fuß ----------
  function makeLayer(cx, M) {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), A = axes(cx), kl = cx.kl;
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#142033'); g.addColorStop(.5, '#0a111b'); g.addColorStop(1, '#04070c'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#0d131c'; x.fillRect(0, SY, W, 400);
    const name = (V2V[cx.id] && V2V[cx.id].name) || cx.id, tt = tuneTitle(cx);
    txt(x, 'PRÜFSTAND', 36, 54, 22, {c: '#5fb8ff', w: 800, glow: '#5fb8ff'}); 
    txt(x, name, 36, 108, 54, {w: 900, max: W - 72});
    // Tuning-Titel in bis zu zwei Zeilen
    const words = tt.split(' · '); let l1 = '', l2 = ''; x.font = '600 24px ' + SF;
    words.forEach((w, i) => { const t = (l1 ? l1 + ' · ' : '') + w; if (!l2 && x.measureText(t).width < W - 72) l1 = t; else l2 = (l2 ? l2 + ' · ' : '') + w });
    txt(x, l1, 36, 138, 24, {w: 600, c: '#9fb4ce', max: W - 72}); if (l2) txt(x, l2, 36, 163, 21, {w: 600, c: '#9fb4ce', max: W - 72});
    const pl = (typeof W2 !== 'undefined' && W2.player) ? W2.player : ''; if (pl) txt(x, 'Fahrer: ' + pl, W - 36, 54, 22, {al: 'right', c: '#8aa0ba', w: 600, max: 300});
    // Monitor-Rahmen
    const pg = x.createLinearGradient(0, 592, 0, 960); pg.addColorStop(0, '#1b2028'); pg.addColorStop(1, '#0f1319'); rrect(x, 24, 590, 672, 372, 22); x.fillStyle = pg; x.fill(); x.strokeStyle = '#2c3542'; x.lineWidth = 2; x.stroke();
    txt(x, 'MESSRECHNER', 44, 618, 20, {f: MONO, c: '#8ea1b5', w: 700});
    x.fillStyle = '#06100c'; x.fillRect(CX0, CY0, CW * SXc, CHH * SYc); x.strokeStyle = '#05080a'; x.lineWidth = 3; x.strokeRect(CX0, CY0, CW * SXc, CHH * SYc);
    // Raster und Achsenbeschriftung
    for (let i = 0; i <= 4; i++) {
      const yy = CHH - B - i / 4 * (CHH - B - TT); x.strokeStyle = '#2f5a46'; x.lineWidth = 1; x.beginPath(); x.moveTo(PX(L), PY(yy)); x.lineTo(PX(CW - 8), PY(yy)); x.stroke();
      txt(x, kl ? String(Math.round(i * A.ymax / 4)) : de(i * A.ymax / 4, 1), PX(L) - 6, PY(yy) + 5, 17, {al: 'right', c: '#ffb03a', w: 600, f: MONO});
      if (!kl) txt(x, de(i * A.y2max / 4, 0), PX(CW - 2), PY(yy) + 5, 15, {al: 'right', c: 'rgba(79,209,255,.85)', w: 600, f: MONO});
    }
    const stp = kl ? 10 : 1000; for (let v = Math.ceil(A.xmin / stp) * stp; v <= A.xmax; v += stp) { x.strokeStyle = '#2f5a46'; x.lineWidth = .8; x.beginPath(); x.moveTo(PX(A.xs(v)), PY(TT)); x.lineTo(PX(A.xs(v)), PY(CHH - B)); x.stroke(); txt(x, kl ? String(v) : v / 1000 + 'k', PX(A.xs(v)), PY(CHH - 7), 17, {al: 'center', c: '#9fb8aa', w: 600, f: MONO}) }
    txt(x, kl ? 'Watt über km/h (orange: Muskel, rot: Widerstand)' : 'PS (orange) und Nm (blau) über U/min', PX(L + 2), PY(10) + 2, 16, {c: '#9fb8aa', w: 600, f: MONO, max: 560});
    // Serienkurve (gestrichelt)
    x.save(); x.setLineDash([8, 6]); x.strokeStyle = '#6b7a72'; x.lineWidth = 3; x.beginPath();
    if (kl) { for (let k = 0; k <= 60; k++) { const v = k * 50 / 60, X = PX(A.xs(v)), Y = PY(A.ys(cx.base.need(v / 3.6))); k ? x.lineTo(X, Y) : x.moveTo(X, Y) } }
    else { const bm = PST.modelOf(cx.base); for (let r = A.xmin; r <= A.xmax; r += 250) { const X = PX(A.xs(r)), Y = PY(A.ys(bm.P(r))); r > A.xmin ? x.lineTo(X, Y) : x.moveTo(X, Y) } }
    x.stroke(); x.restore();
    // Fuß
    txt(x, 'Schrauberschule', W / 2, 1262, 22, {al: 'center', c: '#6b819c', w: 800});
    txt(x, 'Spielwerte (ca.) · Simulation, kein echter Prüfstand', W / 2, 1244, 15, {al: 'center', c: '#56697f', w: 600});
    return {c, A};
  }

  // ---------- Bild zusammensetzen ----------
  function compose(x, M, tv, logo) {
    const s = M.sim, cx = M.cx, kl = cx.kl, A = M.layer.A, host = M.host, p = cx.p;
    x.drawImage(M.layer.c, 0, 0);
    // Szene
    if (M.img) x.drawImage(M.img, 0, SY, 720, 400);
    try { x.drawImage(M.smk, 0, SY, 720, 400) } catch (e) {}
    // Kurven
    const path = (pts, X, Y, col, w, glow) => { if (!pts.length) return; x.save(); x.beginPath(); pts.forEach((a, i) => { const px = PX(X(a[0])), py = PY(Y(a[1])); i ? x.lineTo(px, py) : x.moveTo(px, py) }); x.strokeStyle = col; x.lineWidth = w; x.lineJoin = 'round'; x.lineCap = 'round'; if (glow) { x.shadowColor = col; x.shadowBlur = 8 } x.stroke(); x.restore() };
    x.save(); x.beginPath(); x.rect(CX0, CY0, CW * SXc, CHH * SYc); x.clip();
    if (kl) { path(s.need, A.xs, A.ys, '#ff8a6b', 4); path(s.curve, A.xs, A.ys, '#ffb03a', 5, true) }
    else { path(s.nm, A.xs, A.ys2, '#4fd1ff', 4); path(s.curve, A.xs, A.ys, '#ffb03a', 5, true) }
    x.restore();
    const lp = s.curve[s.curve.length - 1];
    if (lp && (s.ph === 3 || kl && s.ph >= 1 && s.ph <= 3)) { const X = PX(A.xs(lp[0])), Y = PY(A.ys(lp[1])); x.strokeStyle = 'rgba(255,210,74,.8)'; x.lineWidth = 1.5; x.setLineDash([6, 6]); x.beginPath(); x.moveTo(X, PY(TT)); x.lineTo(X, PY(CHH - B)); x.stroke(); x.setLineDash([]); x.fillStyle = '#fff'; x.beginPath(); x.arc(X, Y, 8, 0, 7); x.fill() }
    // Spitze markieren (sobald die Spitzendrehzahl erreicht ist bzw. nach dem Messlauf)
    const fin = s.ph >= 4 && s.curve.length, rs = s.result();
    let pk = null; if (fin) pk = [rs.rpm, rs.ps]; else if (!kl && s.curve.length && s.rpm >= M.mod.pk - 1) pk = [M.mod.pk, M.mod.P(M.mod.pk)];
    if (pk) {
      const X = PX(A.xs(pk[0])), Y = PY(A.ys(pk[1])), pulse = 1 + .15 * Math.sin(tv * 7);
      x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.setLineDash([5, 5]); x.beginPath(); x.moveTo(X, Y); x.lineTo(X, PY(CHH - B)); x.stroke(); x.setLineDash([]);
      x.strokeStyle = '#ffd24a'; x.lineWidth = 4; x.beginPath(); x.arc(X, Y, 11 * pulse, 0, 7); x.stroke(); x.fillStyle = '#ffd24a'; x.beginPath(); x.arc(X, Y, 5, 0, 7); x.fill();
      const lab = 'Spitze ' + (kl ? Math.round(pk[1]) + ' W' : de(pk[1], 1) + ' PS'), right = X > PX(CW * .6);
      txt(x, lab, X + (right ? -16 : 16), Y - 14, 22, {al: right ? 'right' : 'left', c: '#ffd24a', w: 800, glow: 'rgba(255,210,74,.6)'});
    }
    // Zahlen (Text der unsichtbaren Szene = identisch zur Live-Anzeige)
    const tiles = [...host.querySelectorAll('.pst-ro > div')], tw = (672 - 4 * 8) / 5;
    tiles.forEach((d, i) => {
      const a = 24 + i * (tw + 8), b = 974; rrect(x, a, b, tw, 92, 10); x.fillStyle = '#071009'; x.fill(); x.strokeStyle = '#17261c'; x.lineWidth = 1.5; x.stroke();
      const lab = d.querySelector('small'), val = d.querySelector('b'), un = d.querySelector('i');
      txt(x, lab ? lab.textContent : '', a + tw / 2, b + 24, 15, {al: 'center', c: '#7d9a88', w: 600, f: MONO, max: tw - 8});
      txt(x, val ? val.textContent : '', a + tw / 2, b + 61, 34, {al: 'center', c: '#7dffb0', w: 700, f: MONO, max: tw - 8, glow: 'rgba(125,255,176,.45)'});
      txt(x, un ? un.textContent : '', a + tw / 2, b + 82, 14, {al: 'center', c: '#5f8070', w: 600, f: MONO});
    });
    // Phasenleiste
    const ph = [...host.querySelectorAll('.pst-st span')], pw = (672 - 4 * 6) / 5;
    ph.forEach((e, i) => { const a = 24 + i * (pw + 6), on = e.classList.contains('on'); rrect(x, a, 1076, pw, 30, 8); x.fillStyle = on ? '#12351f' : '#10151b'; x.fill(); txt(x, e.textContent, a + pw / 2, 1097, 15, {al: 'center', c: on ? '#7dffb0' : '#5d6b79', w: 700, f: MONO, max: pw - 6}) });
    // Ergebnis-Karte
    const k = fin ? clamp((s.tp > 0 || true) ? (V && V.t4 != null ? (tv - V.t4) / .5 : 1) : 1, 0, 1) : 0, pop = 1 + (1 - k) * .12;
    x.save(); x.translate(W / 2, 1168); x.scale(pop, pop); x.translate(-W / 2, -1168);
    rrect(x, 24, 1116, 672, 112, 18); x.fillStyle = fin ? 'rgba(18,53,31,.92)' : 'rgba(16,21,27,.9)'; x.fill(); x.strokeStyle = fin ? '#7dffb0' : '#2c3542'; x.lineWidth = 2; x.stroke();
    if (fin) {
      x.globalAlpha = .3 + .7 * k;
      if (kl) { txt(x, 'ERGEBNIS', 48, 1146, 18, {c: '#7dffb0', w: 800, f: MONO}); txt(x, Math.round(rs.ps) + ' W max', 48, 1204, 54, {w: 900, c: '#fff', glow: 'rgba(125,255,176,.6)'}); txt(x, 'bei ' + de(rs.rpm, 0) + ' km/h', W - 48, 1204, 28, {al: 'right', c: '#bfe9cf', w: 700}) }
      else {
        txt(x, 'ERGEBNIS', 48, 1146, 18, {c: '#7dffb0', w: 800, f: MONO}); txt(x, de(rs.ps, 1) + ' PS max', 48, 1204, 54, {w: 900, c: '#fff', glow: 'rgba(125,255,176,.6)'});
        txt(x, 'bei ' + Math.round(rs.rpm).toLocaleString('de-DE') + ' U/min', W - 48, 1170, 24, {al: 'right', c: '#bfe9cf', w: 700}); txt(x, de(rs.nm, 1) + ' Nm max', W - 48, 1210, 30, {al: 'right', c: '#8fdcff', w: 800});
      }
      x.globalAlpha = 1;
    } else txt(x, s.ph >= 2 ? 'Messlauf …' : 'Ergebnis nach dem Messlauf', W / 2, 1181, 26, {al: 'center', c: '#5d6b79', w: 700});
    x.restore();
    // Blitz bei Ergebnis
    if (fin && V && V.t4 != null) { const f = clamp(1 - (tv - V.t4) / .35, 0, 1); if (f > 0) { x.fillStyle = 'rgba(255,255,255,' + (.28 * f) + ')'; x.fillRect(0, SY, W, 400) } }
    // Einblenden am Anfang
    if (tv < .5) { x.fillStyle = 'rgba(4,7,12,' + (1 - tv / .5) + ')'; x.fillRect(0, 0, W, H) }
    // Abspann
    if (tv > OUT0) {
      const o = clamp((tv - OUT0) / .6, 0, 1); x.fillStyle = 'rgba(4,7,12,' + o + ')'; x.fillRect(0, 0, W, H); x.save(); x.globalAlpha = o;
      if (logo) { rrect(x, W / 2 - 80, 430, 160, 160, 36); x.save(); x.clip(); x.drawImage(logo, W / 2 - 80, 430, 160, 160); x.restore() }
      txt(x, 'Schrauberschule', W / 2, 680, 62, {al: 'center', w: 900, max: W - 80, glow: '#5fb8ff'}); txt(x, 'Lernen und Tunen', W / 2, 730, 30, {al: 'center', c: '#5fb8ff', w: 700});
      txt(x, (V2V[cx.id] ? V2V[cx.id].name : '') + (kl ? '' : ' · ' + de(rs.ps || p.ps, 1) + ' PS'), W / 2, 800, 28, {al: 'center', c: '#c8d6e8', w: 600, max: W - 80});
      x.restore();
    }
  }

  // ---------- Oberfläche ----------
  function css() {
    if ($('p8vcss')) return; const e = document.createElement('style'); e.id = 'p8vcss';
    e.textContent = '.p8v-off{position:fixed;left:-10000px;top:0;width:720px;pointer-events:none;visibility:hidden}.p8v-off .pst-cn{display:block!important}' +
      '#p8v{position:fixed;inset:0;z-index:95;background:rgba(3,6,12,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;color:#eef3f8;font-family:' + SF + ';overflow:auto}' +
      '#p8v canvas,#p8v video{max-height:58vh;max-width:88vw;border-radius:16px;border:1px solid var(--bd,#2c3542);background:#05080e}' +
      '#p8v .p8t{font-weight:800;font-size:17px;text-align:center}#p8v .p8n{max-width:340px;text-align:center;font-size:14px;line-height:1.4;color:#c0cee0}#p8v .p8w{max-width:340px;background:#1c2736;border:1px solid #3a4a62;border-radius:12px;padding:9px 12px;font-size:14px;line-height:1.4;color:#ffe7a8;text-align:center}' +
      '#p8v .p8b{display:flex;flex-direction:column;gap:8px;width:min(340px,90vw)}#p8v .p8b .btn{margin:0}#p8v .p8p{width:min(340px,86vw);height:10px;border-radius:6px;background:#1a2230;overflow:hidden}#p8v .p8p i{display:block;height:100%;width:0;background:linear-gradient(90deg,#5fb8ff,#7dffb0)}';
    document.head.appendChild(e);
  }
  const mk = (h) => { css(); const old = $('p8v'); if (old) old.remove(); const o = document.createElement('div'); o.id = 'p8v'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.innerHTML = h; document.body.appendChild(o); return o };
  const bt = (o, id, fn) => { const e = o.querySelector('#' + id); if (e) e.onclick = fn; return e };
  const toast2 = t => { try { toast(t) } catch (e) {} };
  const supported = () => !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream);
  const pickMime = pref => { if (pref) { const m = MIMES.filter(t => t.indexOf(pref) === 0).find(t => MediaRecorder.isTypeSupported(t)); if (m) return m } return MIMES.find(t => MediaRecorder.isTypeSupported(t)) || '' };
  const loadLogo = () => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = 'icon-180.png' });

  // Standbild des fertigen Laufs (Vorschau im Dialog)
  async function still(cx) {
    const M = prepare(cx); if (!M) return null;
    try {
      let t = 0; while (!(M.sim.ph >= 4 && M.sim.tp > 1.0) && t < 90) { M.tick(1 / 30); t += 1 / 30 }
      M.st.render(); await M.pump(); const c = document.createElement('canvas'); c.width = W; c.height = H; V = V || null;
      const saveV = V; V = {t4: -5}; try { compose(c.getContext('2d'), M, 11, null) } finally { V = saveV }
      return c;
    } finally { M.dispose() }
  }

  async function open(cx, opts) {
    opts = opts || {};
    if (V) return;
    if (!supported()) { toast2('Dieses Gerät kann kein Video aufnehmen. Das Foto-Studio macht Bilder.'); return }
    const PS = window.PST && PST.P; if (PS && PS.st) { toast2('Der Prüfstandslauf läuft noch. Warte, bis die Messung fertig ist, dann kannst du das Video aufnehmen.'); return }
    const soundOff = !(typeof S !== 'undefined' && S.sound !== false), name = (V2V[cx.id] && V2V[cx.id].name) || cx.id;
    const o = mk('<div class="p8t">Prüfstand-Video teilen</div><canvas id="p8pv" width="270" height="480" aria-label="Vorschau des Videos"></canvas>' +
      '<div class="p8n">Ein Clip (ca. ' + DUR + ' s, Hochformat) von deinem Lauf: ' + name + ' auf der Rolle, mit Kurve, Zahlen und Motorsound. Er wird nur auf deinem Gerät erstellt, nichts wird hochgeladen.</div>' +
      (soundOff ? '<div class="p8w">Ton ist aus. Das Video enthält trotzdem den Motorsound (dein Lautsprecher bleibt still).</div>' : '<div class="p8n">Das Video enthält den Motorsound.</div>') +
      '<div class="p8b"><button class="btn vid" id="p8go">' + (soundOff ? 'Mit Motorsound aufnehmen' : 'Aufnahme starten') + '</button>' + (soundOff ? '<button class="btn alt" id="p8mute">Ohne Ton aufnehmen</button>' : '') + '<button class="btn alt" id="p8x">Abbrechen</button></div>');
    bt(o, 'p8x', () => o.remove());
    const go = audio => () => record(cx, Object.assign({}, opts, {audio}));
    bt(o, 'p8go', go(true)); bt(o, 'p8mute', go(false));
    still(cx).then(c => { const pv = $('p8pv'); if (c && pv) pv.getContext('2d').drawImage(c, 0, 0, pv.width, pv.height) }).catch(e => { if (window.console) console.warn('p8v still', e) });
    if (opts.auto) go(opts.audio !== false)();
    return o;
  }

  async function record(cx, opts) {
    opts = opts || {}; if (V) return;
    const audio = opts.audio !== false, mime = pickMime(opts.mime), logo = await loadLogo();
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
    const M = prepare(cx); if (!M) { toast2('Die Prüfstand-Szene konnte nicht vorbereitet werden.'); const o0 = $('p8v'); if (o0) o0.remove(); return }
    const o = mk('<div class="p8t" id="p8st" role="status" aria-live="polite">Video wird aufgenommen …</div><div id="p8cv"></div><div class="p8p"><i id="p8bar"></i></div><div class="p8n" id="p8sub">Bitte warten und nichts antippen, das Video läuft in Echtzeit (ca. ' + DUR + ' s).</div><div class="p8b"><button class="btn alt" id="p8x">Abbrechen</button></div>');
    $('p8cv').appendChild(cv); if (/nodisp=1/.test(location.hash)) $('p8v').style.visibility = 'hidden';
    const T = {rec: null, stop: false, iv: 0, M, mdPatch: null, t4: null, frames: 0, chunks: [], t0: 0, spkWas: null};
    V = T;
    const mm = window.matchMedia; try { window.matchMedia = function (q) { const r = mm.apply(this, arguments); return /prefers-reduced-motion/.test(q) ? {matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false }} : r } } catch (e) {}   // Aufnahme zeigt Qualm auch bei "Bewegung reduzieren"
    const cleanup = () => { clearInterval(T.iv); try { window.matchMedia = mm } catch (e) {} try { if (T.rec && T.rec.state !== 'inactive') T.rec.stop() } catch (e) {} M.dispose(); if (typeof FX !== 'undefined') FX.force = false; if (V === T) V = null };
    const abort = () => { T.stop = true; cleanup(); const e = $('p8v'); if (e) e.remove() };
    bt(o, 'p8x', abort);
    let stream, rec, tracks = 0;
    try {
      // Ton starten (Motorsound -> FX.out() -> Lautsprecher-Gain + MediaStreamDestination)
      if (audio && typeof FX !== 'undefined' && window.PSTSND) { FX.force = true; FX.A(); FX.out(); try { M.st.sound = PSTSND.start(M.st, cx) } catch (e) { M.st.sound = null } }
      // Vorlauf: Leerlauf überspringen (0,9 s), Tempo so wählen, dass der Messlauf in ca. 9 s fertig ist
      M.tick(.9);
      const pre = PST.makeSim(cx); let tp = 0; for (let t = 0; t < .9; t += 1 / 60) pre.step(1 / 60); while (pre.ph < 4 && tp < 120) { pre.step(1 / 60); tp += 1 / 60 }
      T.f = clamp(tp / 9, 1, 2.5);
      M.st.render(); await M.pump();
      stream = cv.captureStream(FPS);
      if (audio && typeof FX !== 'undefined' && FX.rdest) FX.rdest.stream.getAudioTracks().forEach(t => { stream.addTrack(t); tracks++ });
      compose(x, M, 0, logo);
      rec = new MediaRecorder(stream, mime ? {mimeType: mime, videoBitsPerSecond: 3500000} : {}); T.rec = rec;
    } catch (e) { if (window.console) console.warn('p8v', e); abort(); toast2('Die Aufnahme ist auf diesem Gerät nicht möglich.'); if (opts.onError) opts.onError(e); return }
    rec.ondataavailable = e => { if (e.data && e.data.size) T.chunks.push(e.data) };
    const stopped = new Promise(res => { rec.onstop = res });
    rec.onerror = e => { if (window.console) console.warn('p8v rec', e) };
    rec.start(250);
    T.t0 = performance.now(); let last = T.t0, lastDraw = 0, msSum = 0, msSim = 0, msPump = 0;
    const bar = $('p8bar'), st = $('p8st');
    const step = () => {
      if (T.stop) return; const now = performance.now(), tv = (now - T.t0) / 1000;
      T.calls = (T.calls || 0) + 1; if (now - lastDraw < 1000 / FPS - 4) return; T.maxGap = Math.max(T.maxGap || 0, now - lastDraw); if (window.__p8dbg && now - lastDraw > 500) console.warn('GAP ' + Math.round(now - lastDraw) + ' at tv=' + tv.toFixed(2) + ' frames=' + T.frames); lastDraw = now;
      const dtr = Math.min(.25, (now - last) / 1000); last = now; const s = M.sim;
      const c1 = performance.now(); M.tick(dtr * T.f); M.st.render(); const c2 = performance.now(); M.pump(); msSim += c2 - c1; msPump += performance.now() - c2;
      if (s.ph >= 4 && T.t4 == null && s.curve.length) T.t4 = tv;
      const c0 = performance.now(); compose(x, M, tv, logo); msSum += performance.now() - c0; T.frames++;
      if (window.__p8dbg && performance.now() - now > 250) console.warn('SLOW frame tv=' + tv.toFixed(2) + ' total=' + Math.round(performance.now() - now) + ' sim=' + Math.round(c2 - c1) + ' compose=' + Math.round(performance.now() - c0));
      if (bar) bar.style.width = clamp(tv / DUR * 100, 0, 100) + '%'; if (st) st.textContent = 'Video wird aufgenommen … noch ' + Math.max(0, Math.ceil(DUR - tv)) + ' s';
      if (tv >= DUR) { clearInterval(T.iv); try { rec.stop() } catch (e) {} }
    };
    // compose liest V.t4 über das globale V: hier bindet es sich an T
    T.iv = setInterval(() => { try { step() } catch (e) { if (window.console) console.warn('p8v frame', e) } }, 1000 / FPS / 2);
    await stopped;
    if (T.stop) return;
    const info = {frames: T.frames, calls: T.calls, maxGap: Math.round(T.maxGap), ms: Math.round(msSum / Math.max(1, T.frames)), msSim: Math.round(msSim / Math.max(1, T.frames)), msPump: Math.round(msPump / Math.max(1, T.frames)), raster: M.ok, rasterFail: M.fail, f: +T.f.toFixed(2), audioTracks: tracks, dur: (performance.now() - T.t0) / 1000, mime: rec.mimeType || mime || ''};
    const type = (rec.mimeType || mime || 'video/webm').split(';')[0], blob = new Blob(T.chunks, {type}); cleanup();
    return finish(cx, blob, type, info, opts);
  }

  function finish(cx, blob, type, info, opts) {
    const ext = type.indexOf('mp4') >= 0 ? 'mp4' : 'webm', url = URL.createObjectURL(blob), nm = ((V2V[cx.id] && V2V[cx.id].name) || cx.id).toLowerCase().replace(/[^a-z0-9]+/g, '') + '-pruefstand.' + ext;
    const txtShare = 'Mein Prüfstandslauf in der Schrauberschule: ' + ((V2V[cx.id] && V2V[cx.id].name) || '') + (cx.kl ? '' : ', ' + de(cx.p.ps, 1) + ' PS (Spielwert)');
    const o = mk('<div class="p8t">Fertig: ' + ext.toUpperCase() + ', ' + (blob.size / 1e6).toFixed(1).replace('.', ',') + ' MB</div><video id="p8vid" src="' + url + '" controls playsinline loop autoplay muted></video><div class="p8n">Antippen für Ton. Teilen öffnet das Teilen-Menü deines Geräts, Speichern lädt die Datei herunter.</div><div class="p8b"><button class="btn vid" id="p8sh">Teilen</button><button class="btn alt" id="p8sv">Speichern</button><button class="btn alt" id="p8cl">Schließen</button></div>');
    const save = () => { if (typeof saveBlob === 'function') saveBlob(blob, nm); else { const a = document.createElement('a'); a.href = url; a.download = nm; document.body.appendChild(a); a.click(); a.remove() } toast2('Video gespeichert (Download).') };
    bt(o, 'p8sh', async () => { try { const f = new File([blob], nm, {type}); if (navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], text: txtShare, title: 'Schrauberschule'}); toast2('Geteilt.'); return } } catch (e) { if (e && e.name === 'AbortError') return } save() });
    bt(o, 'p8sv', save); bt(o, 'p8cl', () => { o.remove(); URL.revokeObjectURL(url) });
    window.__lastVideo = {type, size: blob.size};
    window.P8VIDEO.last = {blob, type, info, name: nm};
    if (opts && opts.onDone) opts.onDone(blob, type, info);
    return {blob, type, info};
  }

  // ---------- Einhängen ----------
  window.P8VIDEO = {open, record, still, prepare, cxFromBuild, last: null, DUR, W, H};
  const alt = window.videoShare; window.videoShareAlt = alt;
  window.videoShare = function () {
    try {
      let cx = null;
      if (typeof view !== 'undefined' && view === 'studio' && typeof ST !== 'undefined' && ST.b) cx = cxFromBuild(ST.b);
      else if (typeof view !== 'undefined' && (view === 'pr' || view === 'w2') && window.PST) cx = PST.ctxNow();
      if (cx && PST.VEH[cx.id]) return open(cx);
    } catch (e) { if (window.console) console.warn('p8v', e) }
    if (typeof alt === 'function') return alt.apply(this, arguments);
  };

  // ---------- Test-Hooks: #shot=p8-video[&port=N][&mime=webm][&mute=1] | #shot=p8-video-vorschau ----------
  const hm = /shot=p8-video(-vorschau)?/.exec(location.hash); if (!hm) return;
  const prev = !!hm[1], port = (/port=(\d+)/.exec(location.hash) || [])[1], mimeP = (/mime=(\w+)/.exec(location.hash) || [])[1], mute = /mute=1/.test(location.hash);
  const report = t => { const pre = document.createElement('pre'); pre.id = 'p8v-result'; pre.textContent = t; document.body.appendChild(pre); document.title = t.split('\n')[0] };
  setTimeout(() => {
    try { S.points = Math.max(S.points, 300); ROTX = true } catch (e) {}
    const id = (/veh=(\w+)/.exec(location.hash) || [])[1] || 's51';
    let tuned = {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r15'};
    if (id === 'klapp') W2.cars.klapp = {ph: 5, took: [], put: [], pick: {reifen: 'rb', kette: 'k50', ritzel: 'q16', licht: 'la', hupe: 'hg', zub: 'zt', gepaeck: 'gr', motor: 'm0'}, jet: 30, drove: false};
    else { const v = V2V[id], pp = w2perf(v, tuned, 70); W2.cars[id] = {ph: 5, took: [], put: [], pick: tuned, jet: pp.ideal + 10, drove: false} }
    const keep = JSON.parse(JSON.stringify(W2.cars[id])); W2.sel = id; view = 'pr'; render();
    setTimeout(() => {
      W2.cars[id] = JSON.parse(JSON.stringify(keep));
      const cx = PST.ctxNow(); if (!cx) { report('P8VIDEO FEHLER kein Kontext'); return }
      if (prev) { try { S.sound = false } catch (e) {} open(cx); return }
      report('P8VIDEO LAEUFT');
      record(cx, {mime: mimeP, audio: !mute, onDone: async (blob, type, info) => {
        const meta = {size: blob.size, type, audioTracks: info.audioTracks, dur: +info.dur.toFixed(2), frames: info.frames, calls: info.calls, maxGap: info.maxGap, msPerCompose: info.ms, msSim: info.msSim, msPump: info.msPump, raster: info.raster, rasterFail: info.rasterFail, f: info.f, mime: info.mime};
        let up = 'kein Upload';
        if (port) { try { const r = await fetch('http://127.0.0.1:' + port + '/up?name=p8-video-' + (mimeP || 'auto') + '.' + (type.indexOf('mp4') >= 0 ? 'mp4' : 'webm'), {method: 'POST', body: blob}); up = 'Upload ' + r.status; await fetch('http://127.0.0.1:' + port + '/meta', {method: 'POST', body: JSON.stringify(meta)}) } catch (e) { up = 'Upload Fehler ' + e.message } }
        report('P8VIDEO FERTIG ' + JSON.stringify(meta) + ' ' + up);
      }, onError: e => report('P8VIDEO FEHLER ' + e.message)}).catch(e => report('P8VIDEO FEHLER ' + e.message));
    }, 400);
  }, 250);
})();
