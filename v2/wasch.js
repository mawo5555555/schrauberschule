'use strict';
// Paket 8 Teil B2: Waschen (Vollbild-Animation in 5 Phasen). Neue Dateien: wasch.js, wasch.css, img/wash/README.md.
// Bildpaar: bevorzugt v2/img/wash/<id>-dreckig.jpg + <id>-sauber.jpg (beide nötig, gleiche Perspektive).
// Sonst Platzhalter: Fahrzeug-Zeichnung (PSTART.draw[id], Lackfarbe aus PST.VEH[id].col) + prozedural erzeugte Schmutzschicht (Canvas).
// Spielstand: S.wash[fahrzeugId] = 'JJJJ-MM-TT' (Belohnung nur 1x je Fahrzeug und Tag).
(function () {
  const SC = 215, W = 800;
  const VEH = () => (window.PST && PST.VEH) || {};
  const NAMES = {s51: 'Simson S51', kr51: 'Schwalbe KR51/2', sr50: 'Simson SR50', s50: 'Simson S50', habicht: 'Simson Habicht', star: 'Simson Star', duo: 'Simson Duo', klapp: 'Mifa Klapprad'};
  const rm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false } };
  const sndOn = () => { try { return typeof FX !== 'undefined' && FX.on() } catch (e) { return false } };
  const wsh = () => (S.wash = S.wash || {});
  const doneToday = id => wsh()[id] === (typeof today === 'function' ? today() : '');
  const PH = [
    {n: 'Einschäumen', ic: '🫧', t: 'Wische mit dem Finger über das Fahrzeug: Schaum baut sich auf. Alle Zonen einschäumen!', key: 'foam', unit: 'eingeschäumt'},
    {n: 'Schrubben', ic: '🧽', t: 'Schrubbe mit dem Schwamm hin und her. Der Dreck löst sich erst nach mehreren Zügen. Am Motor erst Entfetter nehmen!', key: 'dirt', unit: 'sauber'},
    {n: 'Abspülen', ic: '🚿', t: 'Spüle mit dem Wasserstrahl den Schaum ab. Wische über das Fahrzeug.', key: 'rinse', unit: 'abgespült'},
    {n: 'Trockenreiben', ic: '🧻', t: 'Reibe mit dem Lappen die Wassertropfen und Wasserflecken weg.', key: 'dry', unit: 'trocken'},
    {n: 'Polieren', ic: '✨', t: 'Poliere mit dem Tuch über Lack und Chrom. Ein Glanzreflex wandert mit.', key: 'pol', unit: 'poliert'}
  ];
  const QUIZ = [
    {q: 'Wo darf man einen Motor mit Entfetter abspritzen?', o: ['Auf dem Hof, das Wasser läuft in den Gully', 'Nur auf einem Waschplatz mit Ölabscheider', 'Am Bach, da fließt es gleich weg'], a: 1, e: 'Öl und Entfetter dürfen nicht ins Grundwasser oder in den Gully. Ein Ölabscheider hält das Öl zurück. Deshalb: Motorwäsche nur mit Entfetter auf einem Waschplatz mit Ölabscheider.'},
    {q: 'Gartenschlauch: ca. 200 Liter. Eimer und Schwamm: ca. 20 Liter (Spielwerte). Wie viel Prozent Wasser spart der Eimer?', o: ['ca. 10 %', 'ca. 90 %', 'ca. 180 %'], a: 1, e: '20 von 200 Litern sind 10 %. Du sparst also 100 % - 10 % = ca. 90 % Wasser.'}
  ];
  const rngOf = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
  const hashOf = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h };

  // ---------- Zonen (Fahrzeug-Koordinaten: Hinterachse (0,0), Fahrzeug fährt nach links) ----------
  function zonesOf(id) {
    const V = VEH()[id], R = V.R, wb = V.wb * SC, z = [];
    const bike = id === 'klapp';
    z.push({k: 'felgen', n: 'Felgen', ic: '🛞', sh: [{c: [0, 0, R * .98]}, {c: [-wb, 0, R * .98]}], mud: 1});
    if (!bike) z.push({k: 'motor', n: 'Motor', ic: '⚙️', sh: [{r: [-wb * .66, -R * .95, wb * .46, R * 1.25]}], oil: 1});
    else z.push({k: 'motor', n: 'Kette', ic: '⛓️', sh: [{r: [-wb * .1, -R * .35, wb * .1 + R * .6, R * .7]}], oil: 1});
    if (!bike) z.push({k: 'auspuff', n: 'Auspuff', ic: '💨', sh: [{r: [-wb * .7, R * .3, wb * .66, R * .72]}], rust: 1});
    z.push({k: 'tank', n: bike ? 'Rahmen' : 'Tank', ic: '⛽', sh: [{r: [-wb * .8, -R * 2.05, wb * .62, R * 1.0]}], dust: 1});
    z.push({k: 'kotfluegel', n: bike ? 'Schutzblech' : 'Kotflügel', ic: '🛵', sh: [{r: [-R * 1.0, -R * 1.5, R * 2.0, R * .62]}, {r: [-wb - R * 1.0, -R * 1.5, R * 2.0, R * .62]}], mud: 1});
    return z;
  }

  let ov = null, ST = null, raf = 0, last = 0;
  const cv = {};            // Canvases: cc sauber, dc dreckig, sc Schlieren, fc Schaum, pc Tropfen, gc Glanz, xc Effekte
  const cx = {};
  let CW = W, CH = 540, vb = null, solid = null, GX = 64, GY = 40;
  const cellOf = (x, y) => (Math.min(GY - 1, Math.max(0, y * GY / CH | 0))) * GX + Math.min(GX - 1, Math.max(0, x * GX / CW | 0));

  // ---------- Bilder: Foto-Paar bevorzugt, sonst Platzhalter ----------
  const defsSvg = () => '<defs>' + ((window.PSTART && PSTART.defs) ? PSTART.defs() : '') + '</defs>';
  function drawVeh(id) {
    const V = VEH()[id], A = window.PSTART; if (!V || !A || !A.draw || !A.draw[id]) return '';
    const o = Object.assign({ccm: 60, pick: A.cur || null}, V); o.wb = V.wb * SC;
    try { return A.draw[id](o) } catch (e) { console.error(e); return '' }
  }
  function loadImg(src) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src }) }
  async function loadPair(id) {
    // Fotos (austauschbar): v2/img/wash/<id>-dreckig.jpg und -sauber.jpg, beide nötig
    const [d, s] = await Promise.all([loadImg('v2/img/wash/' + id + '-dreckig.jpg'), loadImg('v2/img/wash/' + id + '-sauber.jpg')]);
    if (d && s) return {photo: 1, d, s};
    return {photo: 0};
  }
  function svgImage(id) {
    const V = VEH()[id], wb = V.wb * SC, R = V.R;
    const g = drawVeh(id), host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-9999px;top:0;width:800px;height:600px;visibility:hidden';
    host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-wb - R - 90} ${-R * 3.4} ${wb + 2 * R + 190} ${R * 4.6}" width="800" height="600">${defsSvg()}<g id="wzg">${g}</g></svg>`;
    document.body.appendChild(host);
    let bb = {x: -wb - R, y: -R * 2.6, width: wb + 2 * R, height: R * 3.7}; try { const b = host.querySelector('#wzg').getBBox(); if (b.width > 50 && b.height > 50) bb = b } catch (e) {}
    host.remove();
    // Schmale Zeichnung nicht unnötig klein: Rand 6 %, Seitenverhältnis begrenzen
    let w = bb.width * 1.12, h = bb.height * 1.14; const asp = Math.max(1.25, Math.min(2, w / h)); if (w / h < asp) w = h * asp; else h = w / asp;
    vb = [bb.x + bb.width / 2 - w / 2, bb.y + bb.height / 2 - h / 2 + h * .01, w, h];
    CH = Math.round(CW * h / w);
    const shadow = `<ellipse cx="${vb[0] + vb[2] / 2}" cy="${R + 5}" rx="${vb[2] * .4}" ry="6" fill="#000" opacity=".35"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${CW}" height="${CH}">${defsSvg()}${shadow}${g}</svg>`;
    return loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  }
  const toPx = (vx, vy) => [(vx - vb[0]) / vb[2] * CW, (vy - vb[1]) / vb[3] * CH];
  const sc = () => CW / vb[2];

  // Zonen in Pixel
  const PHZ = {felgen: [{c: [.2, .72, .15]}, {c: [.8, .72, .15]}], motor: [{r: [.36, .45, .24, .3]}], auspuff: [{r: [.55, .62, .38, .2]}], tank: [{r: [.3, .2, .3, .2]}], kotfluegel: [{r: [.08, .42, .26, .12]}, {r: [.66, .42, .26, .12]}]};
  function zoneShapes(z) {
    if (ST && ST.photo) return (PHZ[z.k] || []).map(s => s.c ? {c: [s.c[0] * CW, s.c[1] * CH, s.c[2] * CW]} : {r: [s.r[0] * CW, s.r[1] * CH, s.r[2] * CW, s.r[3] * CH]});
    return z.sh.map(s => s.c ? (() => { const p = toPx(s.c[0], s.c[1]); return {c: [p[0], p[1], s.c[2] * sc()]} })() : (() => { const p = toPx(s.r[0], s.r[1]); return {r: [p[0], p[1], s.r[2] * sc(), s.r[3] * sc()]} })());
  }
  const inShape = (s, x, y) => s.c ? Math.hypot(x - s.c[0], y - s.c[1]) <= s.c[2] : (x >= s.r[0] && x <= s.r[0] + s.r[2] && y >= s.r[1] && y <= s.r[1] + s.r[3]);
  const randIn = (s, rn) => s.c ? (() => { const a = rn() * 6.283, r = Math.sqrt(rn()) * s.c[2]; return [s.c[0] + Math.cos(a) * r, s.c[1] + Math.sin(a) * r] })() : [s.r[0] + rn() * s.r[2], s.r[1] + rn() * s.r[3]];
  const boxOf = s => s.c ? [s.c[0] - s.c[2], s.c[1] - s.c[2], s.c[2] * 2, s.c[2] * 2] : s.r;

  // ---------- Platzhalter: Schmutzschicht prozedural ----------
  function paintDirt(ctx, id, Z) {
    const rn = rngOf(hashOf(id) + 11), t = document.createElement('canvas'); t.width = CW; t.height = CH; const c = t.getContext('2d');
    const spots = (shapes, n, col, rmin, rmax, a0, a1) => { for (let i = 0; i < n; i++) { const s = shapes[rn() * shapes.length | 0], p = randIn(s, rn), r = rmin + rn() * (rmax - rmin); c.fillStyle = `rgba(${col[0] + (rn() * 24 | 0)},${col[1] + (rn() * 18 | 0)},${col[2] + (rn() * 12 | 0)},${a0 + rn() * (a1 - a0)})`; c.beginPath(); c.ellipse(p[0], p[1], r, r * (.6 + rn() * .5), rn() * 3, 0, 6.283); c.fill() } };
    // Staub über alles, unten stärker
    const gr = c.createLinearGradient(0, 0, 0, CH); gr.addColorStop(0, 'rgba(176,156,120,.20)'); gr.addColorStop(.6, 'rgba(166,142,104,.34)'); gr.addColorStop(1, 'rgba(120,96,66,.55)'); c.fillStyle = gr; c.fillRect(0, 0, CW, CH);
    spots([{r: [0, 0, CW, CH]}], 900, [160, 140, 105], 1, 4, .08, .22);
    Z.forEach(z => { const sh = zoneShapes(z);
      if (z.mud) { spots(sh, 420, [68, 48, 30], 1, 5, .55, .92); spots(sh, 26, [74, 54, 34], 8, 20, .7, .9);
        sh.forEach(s => { const b = boxOf(s); for (let i = 0; i < 14; i++) { const x = b[0] + rn() * b[2], y = b[1] + b[3] * (.3 + rn() * .6); c.strokeStyle = `rgba(72,52,34,${.3 + rn() * .4})`; c.lineWidth = 1 + rn() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rn() - .5) * 6, y + 14 + rn() * 40); c.stroke() } }) }
      if (z.oil) { sh.forEach(s => { const b = boxOf(s), g = c.createRadialGradient(b[0] + b[2] / 2, b[1] + b[3] / 2, 4, b[0] + b[2] / 2, b[1] + b[3] / 2, Math.max(b[2], b[3]) * .62); g.addColorStop(0, 'rgba(18,12,6,.86)'); g.addColorStop(.7, 'rgba(30,20,10,.68)'); g.addColorStop(1, 'rgba(40,28,14,.15)'); c.fillStyle = g; c.fillRect(b[0], b[1], b[2], b[3]) });
        spots(sh, 40, [14, 10, 5], 4, 16, .45, .8); spots(sh, 16, [90, 70, 120], 1, 3, .18, .3);
        sh.forEach(s => { const b = boxOf(s); for (let i = 0; i < 9; i++) { const x = b[0] + rn() * b[2], y = b[1] + b[3] * (.4 + rn() * .5); c.strokeStyle = 'rgba(14,9,4,.6)'; c.lineWidth = 2 + rn() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 14 + rn() * 34); c.stroke() } }) }
      if (z.rust) { spots(sh, 90, [134, 72, 30], 2, 8, .55, .9); spots(sh, 30, [30, 22, 14], 3, 12, .5, .8); }
      if (z.dust) { spots(sh, 160, [150, 130, 96], 2, 7, .15, .3); spots(sh, 40, [30, 26, 20], .8, 2.2, .5, .85); spots(sh, 6, [100, 78, 52], 6, 14, .4, .6) }
    });
    // nur auf dem Fahrzeug (Alpha der sauberen Zeichnung)
    c.globalCompositeOperation = 'destination-in'; c.drawImage(cv.cc, 0, 0);
    ctx.drawImage(cv.cc, 0, 0); ctx.drawImage(t, 0, 0);
  }

  // ---------- Aufbau ----------
  const mk = (cls) => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; c.className = cls; return c };
  async function setup(id) {
    const pair = await loadPair(id);
    let img = null; if (!pair.photo) img = await svgImage(id); else { CH = Math.round(CW * pair.s.naturalHeight / pair.s.naturalWidth); vb = [0, 0, CW, CH] }
    ST.Z.forEach(z => { z.px = zoneShapes(z); z.fin = {}; z.v = 0 });
    ['cc', 'dc', 'sc', 'fc', 'pc', 'gc', 'xc'].forEach(k => { cv[k] = mk('wz-c wz-' + k); cx[k] = cv[k].getContext('2d') });
    if (pair.photo) { cx.cc.drawImage(pair.s, 0, 0, CW, CH); cx.dc.drawImage(pair.d, 0, 0, CW, CH) }
    else { if (img) cx.cc.drawImage(img, 0, 0, CW, CH); paintDirt(cx.dc, id, ST.Z) }
    ST.photo = pair.photo;
    // Fahrzeugmaske (für Tropfen/Glanz)
    try { const d = cx.cc.getImageData(0, 0, CW, CH).data; solid = new Uint8Array(CW * CH); for (let i = 0; i < solid.length; i++) solid[i] = d[i * 4 + 3] > 40 ? 1 : 0 } catch (e) { solid = null }
    // Zellraster je Zone
    GY = 40; GX = Math.round(GY * CW / CH);
    ST.cell = new Int8Array(GX * GY).fill(-1);
    for (let gy = 0; gy < GY; gy++) for (let gx = 0; gx < GX; gx++) { const x = (gx + .5) * CW / GX, y = (gy + .5) * CH / GY; for (let zi = 0; zi < ST.Z.length; zi++) { if (ST.Z[zi].px.some(s => inShape(s, x, y))) { ST.cell[gy * GX + gx] = zi; break } } }
    ST.A = {foam: new Float32Array(GX * GY), dirt: new Float32Array(GX * GY).fill(1), rinse: new Float32Array(GX * GY).fill(1), dry: new Float32Array(GX * GY).fill(1), pol: new Float32Array(GX * GY), deg: new Float32Array(GX * GY)};
  }
  const isSolid = (x, y) => !solid || x < 0 || y < 0 || x >= CW || y >= CH || solid[(y | 0) * CW + (x | 0)] === 1;

  // Fortschritt je Zone (0..1)
  function prog(zi, ph) {
    const k = PH[ph].key, a = ST.A[k === 'rinse' ? 'rinse' : k === 'dry' ? 'dry' : k === 'dirt' ? 'dirt' : k === 'foam' ? 'foam' : 'pol']; let n = 0, s = 0;
    for (let i = 0; i < ST.cell.length; i++) if (ST.cell[i] === zi) { n++; s += (k === 'foam' || k === 'pol') ? a[i] : 1 - a[i] }
    return n ? s / n : 1;
  }
  const THR = [.82, .85, .86, .85, .8];

  // ---------- Pinsel ----------
  function hitCells(x, y, r, fn) { const gx0 = Math.max(0, (x - r) * GX / CW | 0), gx1 = Math.min(GX - 1, (x + r) * GX / CW | 0), gy0 = Math.max(0, (y - r) * GY / CH | 0), gy1 = Math.min(GY - 1, (y + r) * GY / CH | 0);
    for (let gy = gy0; gy <= gy1; gy++) for (let gx = gx0; gx <= gx1; gx++) { const d = Math.hypot((gx + .5) * CW / GX - x, (gy + .5) * CH / GY - y); if (d <= r) fn(gy * GX + gx, 1 - d / r) } }
  const soft = (ctx, x, y, r, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.55, `rgba(0,0,0,${a * .85})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2) };
  const bubbles = [];
  function foamAt(x, y, r, tint) {
    const c = cx.fc, rn = Math.random;
    c.save(); c.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 7; i++) { const a = rn() * 6.283, d = Math.sqrt(rn()) * r, bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d, br = 5 + rn() * 11;
      const g = c.createRadialGradient(bx - br * .3, by - br * .3, br * .1, bx, by, br);
      if (tint) { g.addColorStop(0, 'rgba(235,255,215,.98)'); g.addColorStop(.7, 'rgba(176,226,150,.92)'); g.addColorStop(1, 'rgba(120,190,110,.85)') } else { g.addColorStop(0, 'rgba(255,255,255,.99)'); g.addColorStop(.7, 'rgba(232,240,248,.95)'); g.addColorStop(1, 'rgba(190,206,222,.9)') }
      c.fillStyle = g; c.beginPath(); c.arc(bx, by, br, 0, 6.283); c.fill(); c.strokeStyle = 'rgba(150,170,190,.5)'; c.lineWidth = .8; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(bx - br * .35, by - br * .38, br * .22, 0, 6.283); c.fill();
      if (bubbles.length < 160 && br > 9) bubbles.push({x: bx, y: by, r: br, t: 30 + rn() * 260}) }
    c.restore();
  }
  function drip(x, y) { if (rm() || ST.drips.length > 70) return; ST.drips.push({x: x + (Math.random() - .5) * 14, y, v: .5 + Math.random() * .9, len: 0, max: 24 + Math.random() * 70, w: 1.5 + Math.random() * 2.5, col: ST.ph === 1 ? '110,84,56' : '150,170,190'}) }
  function droplets(x, y, r, n) { const c = cx.pc; for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; if (!isSolid(px, py)) continue; const br = 1.2 + Math.random() * 3.4;
      const g = c.createRadialGradient(px - br * .3, py - br * .35, 0, px, py, br); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.45, 'rgba(190,220,245,.35)'); g.addColorStop(1, 'rgba(70,100,130,.5)'); c.fillStyle = g; c.beginPath(); c.ellipse(px, py, br, br * 1.15, 0, 0, 6.283); c.fill() } }
  const hint = t => { const h = ov && ov.querySelector('.wz-hint'); if (h) { h.textContent = t; h.classList.add('on'); clearTimeout(hint.t); hint.t = setTimeout(() => h.classList.remove('on'), 2600) } };

  function stroke(x, y, dx, dy, quiet) {
    const p = ST.ph, R = [34, 30, 40, 34, 36][p], ph = ST.A;
    if (p === 0) { foamAt(x, y, R, ST.tool === 'deg'); hitCells(x, y, R, (i, f) => { if (ST.cell[i] >= 0) ph.foam[i] = Math.min(1, ph.foam[i] + .34 * f + .04) }); snd('foam', quiet) }
    else if (p === 1) {
      if (ST.tool === 'deg') { let onM = false; hitCells(x, y, R, (i, f) => { if (ST.cell[i] >= 0 && ST.Z[ST.cell[i]].oil) { onM = true; ph.deg[i] = Math.min(1, ph.deg[i] + .4 * f + .05) } });
        if (onM) { foamAt(x, y, R * .7, true); snd('foam', quiet) } else if (!quiet) hint('Entfetter wirkt am Motor.'); return }
      let oilBlock = false;
      hitCells(x, y, R, (i, f) => { const zi = ST.cell[i], z = zi >= 0 ? ST.Z[zi] : null; let k = .1 * (.35 + f); if (z && z.oil && ph.deg[i] < .5) { k *= .1; oilBlock = true }
        ph.dirt[i] *= 1 - Math.min(.9, k) });
      soft2(cx.dc, x, y, R, oilBlock ? .014 : .1);
      // Schaum färbt sich bräunlich, Schmutzwasser läuft nach unten
      const fc = cx.fc; fc.save(); fc.globalCompositeOperation = 'source-atop'; fc.fillStyle = 'rgba(120,92,60,.12)'; fc.beginPath(); fc.arc(x, y, R * .8, 0, 6.283); fc.fill(); fc.restore();
      if (Math.random() < .55) drip(x, y + R * .5);
      if (oilBlock && !quiet) hint('Das Öl schmiert nur. Nimm den Entfetter! (Knopf unten)');
      snd('scrub', quiet);
    } else if (p === 2) {
      soft2(cx.fc, x, y, R, .3);
      hitCells(x, y, R, (i, f) => { ph.rinse[i] *= 1 - .26 * (.4 + f) });
      cx.sc.save(); cx.sc.globalCompositeOperation = 'destination-out'; soft(cx.sc, x, y, R, .25); cx.sc.restore();
      if (!rm() && !quiet) { for (let i = 0; i < 3; i++) ST.sp.push({x: x + (Math.random() - .5) * 20, y: y + (Math.random() - .5) * 10, vx: (Math.random() - .5) * 2.2, vy: -1 - Math.random() * 2, l: 16 + Math.random() * 12}); if (Math.random() < .4) drip(x, y) }
      droplets(x, y, R * .8, 2); snd('water', quiet);
    } else if (p === 3) {
      cx.pc.save(); cx.pc.globalCompositeOperation = 'destination-out'; soft(cx.pc, x, y, R, .3); cx.pc.restore();
      hitCells(x, y, R, (i, f) => { ph.dry[i] *= 1 - .24 * (.4 + f) });
      cx.fc.save(); cx.fc.globalCompositeOperation = 'destination-out'; soft(cx.fc, x, y, R, .3); cx.fc.restore();
      snd('rub', quiet);
    } else if (p === 4) {
      hitCells(x, y, R, (i, f) => { if (ST.cell[i] >= 0) ph.pol[i] = Math.min(1, ph.pol[i] + .22 * f + .03) });
      ST.glint = x; if (!quiet && !rm()) for (let i = 0; i < 2; i++) if (isSolid(x, y) && Math.random() < .4) ST.sp.push({star: 1, x: x + (Math.random() - .5) * R * 2, y: y + (Math.random() - .5) * R, l: 18});
      snd('squeak', quiet, dx);
    }
  }
  function soft2(ctx, x, y, r, a) { ctx.save(); ctx.globalCompositeOperation = 'destination-out'; soft(ctx, x, y, r, a); ctx.restore() }

  // ---------- Töne (Web Audio über FX, folgt dem Ton-Schalter) ----------
  const tt = {};
  function snd(k, quiet, dx) {
    if (quiet || !sndOn()) return; const t = performance.now(); if (t - (tt[k] || 0) < (k === 'water' ? 55 : 80)) return; tt[k] = t;
    try {
      if (k === 'scrub') { FX.noise(.08, 1500 + Math.random() * 800, .14, 'bandpass'); if (Math.random() < .3) FX.noise(.03, 400, .1, 'lowpass') }
      else if (k === 'water') { FX.noise(.1, 3800, .1, 'highpass'); FX.noise(.1, 900, .07, 'lowpass') }
      else if (k === 'foam') { FX.noise(.05, 4500, .05, 'highpass'); if (Math.random() < .25) FX.noise(.015, 6000, .04, 'highpass') }
      else if (k === 'rub') { FX.noise(.09, 2100, .11, 'bandpass') }
      else if (k === 'squeak') { const c = FX.A(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), f0 = 1500 + Math.random() * 500; o.type = 'sine'; o.frequency.setValueAtTime(f0, c.currentTime); o.frequency.linearRampToValueAtTime(f0 + 500 + Math.random() * 400, c.currentTime + .12); g.gain.setValueAtTime(.0001, c.currentTime); g.gain.linearRampToValueAtTime(.05, c.currentTime + .03); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + .13); o.connect(g); g.connect(FX.out()); o.start(); o.stop(c.currentTime + .14); FX.noise(.07, 3000, .04, 'bandpass') }
      else if (k === 'pop') FX.noise(.012, 5500, .05, 'highpass');
      else if (k === 'ding') { FX.tone(1320, .4, .1); setTimeout(() => FX.tone(1760, .5, .08), 110) }
    } catch (e) {}
  }

  // ---------- Hauptschleife ----------
  function loop(ts) {
    raf = ov ? requestAnimationFrame(loop) : 0; if (!ov || !ST) return; const dt = Math.min(50, ts - last); last = ts;
    // Auto-Strich
    if (ST.auto) { for (let n = 0; n < 6 && ST.auto; n++) autoStep(false) }
    // Blasen platzen
    const fc = cx.fc, xc = cx.xc; xc.clearRect(0, 0, CW, CH);
    if (!rm() && ST.ph <= 1) for (let n = 0; n < 2 && bubbles.length; n++) { const i = Math.random() * bubbles.length | 0, b = bubbles[i]; if (--b.t < 0) { bubbles.splice(i, 1); fc.save(); fc.globalCompositeOperation = 'destination-out'; fc.fillStyle = 'rgba(0,0,0,.55)'; fc.beginPath(); fc.arc(b.x, b.y, b.r * .5, 0, 6.283); fc.fill(); fc.restore(); ST.sp.push({ring: 1, x: b.x, y: b.y, r: b.r, l: 10}); if (Math.random() < .3) snd('pop') } }
    // Schlieren
    const s = cx.sc; for (let i = ST.drips.length - 1; i >= 0; i--) { const d = ST.drips[i]; const v = d.v * (dt / 16); d.len += v; s.strokeStyle = `rgba(${d.col},.22)`; s.lineWidth = d.w; s.lineCap = 'round'; s.beginPath(); s.moveTo(d.x, d.y + d.len - v); s.lineTo(d.x + Math.sin(d.len * .1) * .4, d.y + d.len); s.stroke(); if (d.len > d.max || !isSolid(d.x, d.y + d.len)) { s.fillStyle = `rgba(${d.col},.3)`; s.beginPath(); s.arc(d.x, d.y + d.len, d.w * .9, 0, 6.283); s.fill(); ST.drips.splice(i, 1) } }
    if (ST.ph >= 1 && !rm()) { s.save(); s.globalCompositeOperation = 'destination-out'; s.fillStyle = 'rgba(0,0,0,.004)'; s.fillRect(0, 0, CW, CH); s.restore() }
    // Spritzer/Sterne/Ringe
    for (let i = ST.sp.length - 1; i >= 0; i--) { const p = ST.sp[i]; p.l -= dt / 16; if (p.l <= 0) { ST.sp.splice(i, 1); continue }
      if (p.ring) { xc.strokeStyle = `rgba(255,255,255,${p.l / 14})`; xc.lineWidth = 1.2; xc.beginPath(); xc.arc(p.x, p.y, p.r * (1.2 - p.l / 14 * .4), 0, 6.283); xc.stroke() }
      else if (p.star) { const a = p.l / 18; xc.fillStyle = `rgba(255,255,255,${a})`; xc.save(); xc.translate(p.x, p.y); xc.rotate(.8); const r = 3 + 9 * a; xc.beginPath(); xc.moveTo(0, -r); xc.lineTo(r * .22, -r * .22); xc.lineTo(r, 0); xc.lineTo(r * .22, r * .22); xc.lineTo(0, r); xc.lineTo(-r * .22, r * .22); xc.lineTo(-r, 0); xc.lineTo(-r * .22, -r * .22); xc.closePath(); xc.fill(); xc.restore() }
      else { p.x += p.vx * (dt / 16); p.y += p.vy * (dt / 16); p.vy += .12 * (dt / 16); xc.fillStyle = `rgba(200,230,255,${Math.min(1, p.l / 14) * .8})`; xc.beginPath(); xc.arc(p.x, p.y, 1.8, 0, 6.283); xc.fill() } }
    // Wasserstrahl / Schwamm / Lappen-Cursor
    if (ST.cur) cursor(xc);
    // Glanzreflex (Phase 5 und Ende)
    drawGlint();
    checkProgress();
  }
  function cursor(c) {
    const p = ST.cur, r = [34, 30, 40, 34, 36][ST.ph]; c.save(); c.translate(p.x, p.y);
    if (ST.ph === 2) { c.strokeStyle = 'rgba(190,225,255,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(r * 1.8, -r * 2.8); c.lineTo(0, 0); c.stroke(); c.fillStyle = 'rgba(200,230,255,.5)'; c.beginPath(); c.arc(0, 0, r * .6, 0, 6.283); c.fill() }
    else { c.strokeStyle = ST.ph === 0 ? 'rgba(255,255,255,.6)' : ST.ph === 1 ? (ST.tool === 'deg' ? 'rgba(160,230,120,.8)' : 'rgba(240,200,80,.8)') : 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.arc(0, 0, r * .8, 0, 6.283); c.stroke() }
    c.restore();
  }
  function drawGlint() {
    const g = cx.gc; g.clearRect(0, 0, CW, CH); if (ST.glint == null) return;
    const x = ST.glint, w = CW * .18; g.save(); g.drawImage(cv.cc, 0, 0); g.globalCompositeOperation = 'source-in';
    const gr = g.createLinearGradient(x - w, 0, x + w, CH * .5); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.62)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, CW, CH); g.restore();
  }

  // ---------- Fortschritt und Phasen ----------
  let lastShown = 0;
  function checkProgress() {
    if (!ST || ST.done) return; const p = ST.ph; let all = true;
    ST.Z.forEach((z, i) => { const v = prog(i, p); z.v = v; if (v >= THR[p]) { if (!z.fin[p]) { z.fin[p] = 1; finishZone(i, p) } } else all = false });
    const t = performance.now(); if (t - lastShown > 120) { lastShown = t; bars() }
    if (all && !ST.next) { ST.next = 1; const done = ST.ph; bars(); if (sndOn()) snd('ding'); setTimeout(() => { if (ST && ST.ph === done && !ST.done) nextPhase() }, rm() ? 300 : 1000) }
  }
  function finishZone(i, p) {
    const z = ST.Z[i], k = PH[p].key, a = ST.A[k === 'rinse' ? 'rinse' : k === 'dry' ? 'dry' : k === 'dirt' ? 'dirt' : k === 'foam' ? 'foam' : 'pol'];
    for (let j = 0; j < ST.cell.length; j++) if (ST.cell[j] === i) a[j] = (k === 'foam' || k === 'pol') ? 1 : 0;
    const eraseZone = (ctx, al) => z.px.forEach(s => { const b = boxOf(s); ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = `rgba(0,0,0,${al})`; ctx.fillRect(b[0] - 6, b[1] - 6, b[2] + 12, b[3] + 12); ctx.restore() });
    const rep = (ctx, n) => { let m = 0; const f = () => { eraseZone(ctx, .35); if (++m < n) (rm() ? f() : setTimeout(f, 60)) }; f() };
    if (p === 1) rep(cx.dc, 6); if (p === 2) rep(cx.fc, 5); if (p === 3) { rep(cx.pc, 5); } if (p === 1 && ST.Z.every((q, j) => j === i || q.fin[1])) { rep(cx.dc, 3) }
  }
  function bars() {
    if (!ov) return; const p = ST.ph, b = ov.querySelector('.wz-zones'); if (!b) return;
    b.innerHTML = ST.Z.map(z => { const v = Math.round(Math.min(1, (z.v || 0) / THR[p]) * 100); return `<div class="wz-z${v >= 100 ? ' ok' : ''}"><span>${z.ic} ${esc(z.n)}</span><i><u style="width:${v}%"></u></i><em>${v >= 100 ? '✓' : v + ' %'}</em></div>` }).join('');
    const all = ST.Z.reduce((s, z) => s + Math.min(1, (z.v || 0) / THR[p]), 0) / ST.Z.length, tot = ov.querySelector('.wz-tot'); if (tot) tot.style.width = ((p + all) / 5 * 100) + '%';
    ov.querySelectorAll('.wz-oz').forEach(e => e.classList.toggle('hid', (ST.Z[+e.dataset.z].v || 0) >= THR[p]));
  }
  function nextPhase() {
    if (ST.ph >= 4) return finish(); ST.ph++; ST.next = 0; ST.tool = 'sp'; ST.auto = null; if (ST.ph === 1) { ST.tool = 'sp' } uiPhase();
  }
  function uiPhase() {
    const p = ST.ph, e = ov.querySelector('.wz-ph'); ov.dataset.ph = p;
    e.innerHTML = PH.map((x, i) => `<b class="${i === p ? 'on' : i < p ? 'ok' : ''}">${i < p ? '✓' : x.ic}<small>${x.n}</small></b>`).join('');
    ov.querySelector('.wz-txt').innerHTML = `<b>${p + 1}. ${PH[p].n}</b> ${PH[p].t}`;
    ov.querySelector('.wz-tools').style.display = p === 1 ? 'flex' : 'none'; toolUi();
    // Ebenen je Phase
    const fo = p === 0 ? 1 : p === 1 ? .55 : p === 2 ? 1 : 0; cv.fc.style.opacity = p >= 3 ? 0 : fo;
    cv.pc.style.opacity = p >= 3 ? 1 : 1; ov.querySelector('.wz-stage').classList.toggle('wet', p >= 3 && p < 5);
    ST.glint = p === 4 ? ST.glint : null;
    if (p === 2) cv.dc.style.opacity = 1;
    ST.Z.forEach(z => { z.v = 0 });
    if (p === 3) wetDrops(); if (p === 4) { cx.pc.clearRect(0, 0, CW, CH) }
    bars();
  }
  // nasser Glanz, Tropfen und Wasserflecken nach dem Abspülen
  function wetDrops() {
    const rn = Math.random; cx.pc.clearRect(0, 0, CW, CH);
    ST.Z.forEach(z => z.px.forEach(s => { const n = Math.round((s.c ? s.c[2] * s.c[2] * 3.14 : s.r[2] * s.r[3]) / 380); for (let i = 0; i < n; i++) { const q = randIn(s, rn); droplets(q[0], q[1], 1, 1) } }));
    // Wasserflecken (weißliche Ringe)
    const c = cx.pc; ST.Z.forEach(z => z.px.forEach(s => { const n = Math.round((s.c ? s.c[2] * s.c[2] * 3.14 : s.r[2] * s.r[3]) / 2600); for (let i = 0; i < n; i++) { const q = randIn(s, rn); if (!isSolid(q[0], q[1])) continue; const r = 3 + rn() * 7; c.strokeStyle = 'rgba(236,240,244,.55)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(q[0], q[1], r, r * .8, 0, 0, 6.283); c.stroke(); c.fillStyle = 'rgba(236,240,244,.18)'; c.fill() } }));
  }
  function toolUi() { ov.querySelectorAll('.wz-tl button').forEach(b => b.classList.toggle('on', b.dataset.t === ST.tool)) }

  // ---------- Auto-Strich (Knopf "Auto") und Demo für Hooks ----------
  function autoPath(p) {
    const pts = []; const r = [34, 30, 40, 34, 36][p];
    const order = ST.Z.map((z, i) => i);
    if (p === 1) { const mi = ST.Z.findIndex(z => z.oil); if (mi > 0) { order.splice(mi, 1); order.unshift(mi) } }
    order.forEach(zi => { const z = ST.Z[zi]; z.px.forEach(s => { const b = boxOf(s), step = r * .9; let dir = 1; for (let rep = 0; rep < (p === 1 || p === 3 ? 6 : p === 2 ? 2 : p === 4 ? 2 : 1); rep++) for (let y = b[1] + step * .5; y < b[1] + b[3]; y += step) { const row = []; for (let x = b[0] + step * .3; x < b[0] + b[2]; x += step * .4) row.push([x, y]); if (dir < 0) row.reverse(); dir = -dir; row.forEach(q => { if (inShape(s, q[0], q[1]) || s.c) pts.push({x: q[0], y: q[1], zi}) }) } }) });
    return pts;
  }
  function autoStart() {
    if (!ST || ST.auto || ST.done) return; const p = ST.ph; let pts = autoPath(p);
    if (p === 1) { // erst Entfetter am Motor
      const mi = ST.Z.findIndex(z => z.oil), deg = []; if (mi >= 0) ST.Z[mi].px.forEach(s => { const b = boxOf(s); for (let k = 0; k < 4; k++) for (let y = b[1] + 20; y < b[1] + b[3]; y += 26) for (let x = b[0] + 10; x < b[0] + b[2]; x += 22) deg.push({x, y, zi: mi, deg: 1}) });
      pts = deg.concat(pts) }
    ST.auto = {pts, i: 0, ph: p};
  }
  function autoStep(quiet) {
    const a = ST.auto; if (!a) return; if (ST.ph !== a.ph || a.i >= a.pts.length) { ST.auto = null; return }
    const q = a.pts[a.i++], pv = a.pts[a.i - 2] || q; if (ST.Z[q.zi] && ST.Z[q.zi].fin[a.ph]) return;
    const keep = ST.tool; ST.tool = q.deg ? 'deg' : 'sp'; ST.cur = rm() ? null : {x: q.x, y: q.y}; stroke(q.x, q.y, q.x - pv.x, q.y - pv.y, quiet); ST.tool = keep;
    if (a.i >= a.pts.length) { ST.auto = null; ST.cur = null }
  }
  // Zustand sofort herstellen: Phase p bis Anteil f (0..1 der Zonen), für Hooks und "Überspringen"
  function demo(p, f) {
    while (ST.ph < p) { completePhase(ST.ph); ST.ph++; ST.next = 0; uiPhase() }
    const pts = autoPath(p); ST.tool = 'sp'; if (p === 1) { const mi = ST.Z.findIndex(z => z.oil); if (mi >= 0) ST.Z[mi].px.forEach(s => { const b = boxOf(s); for (let k = 0; k < 3; k++) for (let y = b[1] + 20; y < b[1] + b[3]; y += 26) for (let x = b[0] + 10; x < b[0] + b[2]; x += 22) { ST.tool = 'deg'; stroke(x, y, 1, 0, true) } }); ST.tool = 'sp' }
    const n = Math.round(pts.length * f); for (let i = 0; i < n; i++) { const q = pts[i]; stroke(q.x, q.y, 1, 0, true) }
    ST.Z.forEach((z, i) => { z.v = prog(i, p) }); bars();
  }
  function completePhase(p) {
    const a = ST.A, k = PH[p].key;
    for (let j = 0; j < ST.cell.length; j++) if (ST.cell[j] >= 0) { if (k === 'foam') a.foam[j] = 1; if (k === 'dirt') { a.dirt[j] = 0; a.deg[j] = 1 } if (k === 'rinse') a.rinse[j] = 0; if (k === 'dry') a.dry[j] = 0; if (k === 'pol') a.pol[j] = 1 }
    if (k === 'foam') { const f = cx.fc; for (let i = 0; i < 9; i++) ST.Z.forEach(z => z.px.forEach(s => { const b = boxOf(s); for (let m = 0; m < 6; m++) { const q = randIn(s, Math.random); foamAt(q[0], q[1], 26, false) } })) }
    if (k === 'dirt') { cx.dc.clearRect(0, 0, CW, CH) }
    if (k === 'rinse') { cx.fc.clearRect(0, 0, CW, CH); cx.sc.clearRect(0, 0, CW, CH) }
    if (k === 'dry') { cx.pc.clearRect(0, 0, CW, CH) }
    ST.Z.forEach(z => { z.fin[p] = 1 });
  }

  // ---------- Abschluss: Quiz und Belohnung ----------
  function finish() {
    ST.done = 1; ST.ph = 5; if (!rm()) ST.glint = null; cv.dc.style.opacity = 0; ov.dataset.ph = 5; ov.querySelector('.wz-stage').classList.remove('wet');
    ov.querySelector('.wz-ph').innerHTML = PH.map(x => `<b class="ok">✓<small>${x.n}</small></b>`).join(''); const tot = ov.querySelector('.wz-tot'); if (tot) tot.style.width = '100%';
    ST.Z.forEach(z => z.v = 1); bars(); sweep();
    ov.querySelector('.wz-ctl').style.display = 'none'; ov.querySelector('.wz-tools').style.display = 'none'; ov.querySelector('.wz-txt').innerHTML = '<b>Blitzblank!</b> ' + esc(NAMES[ST.id] || '') + ' glänzt wieder.';
    ST.q = 0; ST.right = 0; setTimeout(quiz, rm() ? 100 : 1500);
  }
  function sweep() { if (rm()) { ST.glint = CW * .55; drawGlint(); return } let x = -CW * .2; const f = () => { if (!ov) return; x += CW * .018; ST.glint = x; if (x < CW * 1.2) requestAnimationFrame(f); else ST.glint = null }; f(); if (sndOn()) snd('squeak') }
  function quiz() {
    if (!ov) return; const Q = QUIZ[ST.q], b = ov.querySelector('.wz-quiz'); b.style.display = 'block';
    b.innerHTML = `<div class="wz-qh">🧠 Frage ${ST.q + 1} von ${QUIZ.length}</div><p>${esc(Q.q)}</p>` + Q.o.map((o, i) => `<button onclick="WASCH.ans(${i})">${esc(o)}</button>`).join('');
  }
  function ans(i) {
    const Q = QUIZ[ST.q], b = ov.querySelector('.wz-quiz'); if (b.dataset.lock) return; b.dataset.lock = 1; const ok = i === Q.a; if (ok) ST.right++;
    b.querySelectorAll('button').forEach((e, j) => { e.disabled = true; if (j === Q.a) e.classList.add('ok'); else if (j === i) e.classList.add('no') });
    b.insertAdjacentHTML('beforeend', `<div class="wz-ex">${ok ? '✅ Richtig! ' : '❌ Nicht ganz. '}${esc(Q.e)}</div><button class="wz-go" onclick="WASCH.nextQ()">${ST.q + 1 < QUIZ.length ? 'Nächste Frage ›' : 'Belohnung abholen ›'}</button>`);
  }
  function nextQ() { const b = ov.querySelector('.wz-quiz'); delete b.dataset.lock; if (++ST.q < QUIZ.length) quiz(); else reward() }
  function reward() {
    const b = ov.querySelector('.wz-quiz'), id = ST.id; let msg;
    if (doneToday(id)) msg = `<div class="wz-rw">Heute hast du die ${esc(NAMES[id])} schon gewaschen. Die Taler-Belohnung gibt es pro Fahrzeug nur einmal am Tag. Morgen wieder!</div>`;
    else { const coins = 10 + 5 * ST.right, pts = 5; wsh()[id] = typeof today === 'function' ? today() : ''; S.coins = (S.coins || 0) + coins; S.points = (S.points || 0) + pts; try { save() } catch (e) {}
      msg = `<div class="wz-rw">🪙 <b>+${coins} Taler</b> und <b>+${pts} Punkte</b><br><small>10 Taler fürs Waschen, 5 je richtige Antwort (${ST.right} von ${QUIZ.length}). Einmal pro Fahrzeug und Tag.</small></div>`; if (sndOn()) { try { FX.clink() } catch (e) {} } }
    b.innerHTML = `<div class="wz-qh">✨ Fertig!</div>${msg}<div class="wz-row"><button class="wz-go" onclick="WASCH.close()">Fertig</button><button class="wz-gh" onclick="WASCH.open('${id}')">Nochmal waschen</button></div>`;
  }

  // ---------- Overlay ----------
  async function open(id) {
    if (!VEH()[id] || !window.PSTART) return; close();
    ov = document.createElement('div'); ov.className = 'wz-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Waschen');
    const Z = zonesOf(id);
    ST = {id, ph: 0, tool: 'sp', Z, drips: [], sp: [], cur: null, next: 0, done: 0, auto: null, glint: null};
    ov.innerHTML = `<div class="wz-in"><div class="wz-top"><button class="wz-x" onclick="WASCH.close()" aria-label="Schließen">‹</button><b>🧽 Waschen · ${esc(NAMES[id] || id)}</b><button class="wz-x" id="wz-snd" onclick="WASCH.snd()" aria-label="Ton an oder aus">${sndOn() ? '🔊' : '🔇'}</button></div>
      <div class="wz-bar"><i class="wz-tot"></i></div><div class="wz-ph"></div>
      <div class="wz-main"><div class="wz-stage" role="img" aria-label="Fahrzeug zum Waschen. Mit Finger oder Maus darüberwischen."><div class="wz-bg"></div><div class="wz-load">Lade …</div></div>
      <div class="wz-side"><p class="wz-txt"></p><div class="wz-hint"></div>
        <div class="wz-tools"><div class="wz-tl"><button data-t="sp" onclick="WASCH.tool('sp')">🧽 Schwamm</button><button data-t="deg" onclick="WASCH.tool('deg')">🧴 Entfetter (Motor)</button></div></div>
        <div class="wz-zones"></div>
        <div class="wz-ctl"><button class="wz-gh" onclick="WASCH.auto()">▶ Auto</button><button class="wz-gh" onclick="WASCH.skip()">Überspringen ›</button></div>
        <div class="wz-quiz" style="display:none"></div></div></div></div>`;
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    await setup(id); if (!ov) return;
    const stg = ov.querySelector('.wz-stage'); stg.querySelector('.wz-load').remove(); stg.style.aspectRatio = CW + '/' + CH;
    ['cc', 'dc', 'sc', 'fc', 'pc', 'gc', 'xc'].forEach(k => stg.appendChild(cv[k]));
    stg.insertAdjacentHTML('beforeend', '<div class="wz-sheen"></div>' + ST.Z.map((z, i) => z.px.map(s => { const b = boxOf(s); return `<div class="wz-oz" data-z="${i}" style="left:${b[0] / CW * 100}%;top:${b[1] / CH * 100}%;width:${b[2] / CW * 100}%;height:${b[3] / CH * 100}%"><span>${z.ic}</span></div>` }).join('')).join(''));
    cv.xc.style.touchAction = 'none'; pointers(stg);
    bubbles.length = 0; uiPhase();
    last = performance.now(); if (!raf) raf = requestAnimationFrame(loop);
    stg.dataset.ready = 1;
    return ov;
  }
  function pointers(stg) {
    let down = false, lx = 0, ly = 0;
    const pos = e => { const r = cv.xc.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * CW, (e.clientY - r.top) / r.height * CH] };
    cv.xc.addEventListener('pointerdown', e => { if (!ST || ST.done) return; down = true; ST.auto = null; try { cv.xc.setPointerCapture(e.pointerId) } catch (x) {} const p = pos(e); lx = p[0]; ly = p[1]; ST.cur = {x: lx, y: ly}; stroke(lx, ly, 0, 0); e.preventDefault() });
    cv.xc.addEventListener('pointermove', e => { if (!ST) return; const p = pos(e); ST.cur = rm() ? null : {x: p[0], y: p[1]}; if (!down || ST.done) return;
      const d = Math.hypot(p[0] - lx, p[1] - ly), step = 14, n = Math.max(1, Math.ceil(d / step)); for (let i = 1; i <= n; i++) stroke(lx + (p[0] - lx) * i / n, ly + (p[1] - ly) * i / n, p[0] - lx, p[1] - ly); lx = p[0]; ly = p[1]; e.preventDefault() });
    const up = () => { down = false; if (ST && !ST.auto) ST.cur = null };
    cv.xc.addEventListener('pointerup', up); cv.xc.addEventListener('pointercancel', up); cv.xc.addEventListener('pointerleave', () => { if (!down && ST) ST.cur = null });
  }
  function close() { if (ov) { ov.remove(); ov = null } ST = null; bubbles.length = 0; document.documentElement.style.overflow = ''; if (raf) { cancelAnimationFrame(raf); raf = 0 } }

  window.WASCH = {open, close, ans, nextQ, DATA: {PH, QUIZ},
    tool(t) { if (ST) { ST.tool = t; toolUi() } },
    auto() { autoStart() },
    skip() { if (!ST || ST.done) return; const p = ST.ph; ST.auto = null; completePhase(p); ST.next = 1; bars(); setTimeout(() => { if (ST && !ST.done && ST.ph === p) nextPhase() }, 150) },
    snd() { S.sound = !(S.sound !== false); try { save() } catch (e) {} const b = document.getElementById('wz-snd'); if (b) b.textContent = sndOn() ? '🔊' : '🔇'; try { if (typeof sndLabel === 'function') sndLabel() } catch (e) {} },
    _demo: (p, f) => ST && demo(p, f), _st: () => ST};

  // ---------- Einstieg: Knopf "Waschen" neben "Lackieren" ----------
  function addButtons() {
    document.querySelectorAll('#app .lk-btn:not(.wzd)').forEach(b => { const g = b.querySelector('.lk-ghost'), m = g && /LACK\.open\('(\w+)'\)/.exec(g.getAttribute('onclick') || ''); b.classList.add('wzd'); if (!m || !VEH()[m[1]]) return;
      const w = document.createElement('button'); w.className = 'lk-ghost wz-btn'; w.textContent = '🧽 Waschen'; w.setAttribute('onclick', `WASCH.open('${m[1]}')`); g.after(w) });
  }
  let busy = 0; new MutationObserver(() => { if (busy) return; busy = 1; setTimeout(() => { busy = 0; try { addButtons() } catch (e) { console.error(e) } }, 90) }).observe(document.body, {childList: true, subtree: true});
  setTimeout(addButtons, 400);

  // ---------- Test-Hooks: #shot=p8-wasch-dreckig | -schaum | -schrubben | -spuelen | -sauber ----------
  const hk = /shot=(p8-wasch[\w-]*)/.exec(location.hash); if (!hk) return; const k = hk[1];
  setTimeout(async () => {
    try { if (window.LACK) { S.lack = S.lack || {}; S.lack.s51 = {k: 'o', n: 'Billardgrün', hex: '#2f6b45'}; LACK.applyAll() } } catch (e) {}
    if (k === 'p8-wasch-knopf') { const r = {}; for (const v of ['w2', 'pr', 'veh']) { try { view = v; if (v === 'veh') openVeh('g1'); else render() } catch (e) { r[v] = 'err ' + e.message; continue } await new Promise(q => setTimeout(q, 400)); r[v] = document.querySelectorAll('#app .lk-btn').length + '/' + document.querySelectorAll('#app .wz-btn').length } document.title = JSON.stringify(r); console.log('KNOPF ' + document.title); return }
    await open('s51'); if (!ST) return;
    if (k === 'p8-wasch-test') { // Selbsttest: alle Phasen per Auto-Strich, Quiz, Belohnung einmal pro Tag
      const c0 = S.coins || 0; delete wsh().s51; let err = [];
      for (let p = 0; p < 5; p++) { if (ST.ph !== p) err.push('Phase ' + p + ' erwartet, ist ' + ST.ph); autoStart(); let n = 0; while (ST.auto && n++ < 20000) autoStep(true); checkProgress(); if (p === 1 && ST.Z.some(z => (z.v || 0) < THR[1])) err.push('Schrubben unvollständig ' + ST.Z.map(z => z.v.toFixed(2))); ST.next = 1; if (ST.ph === p) { ST.next = 0; nextPhase() } }
      if (!ST.done) err.push('nicht fertig'); ans(1); nextQ(); ans(1); nextQ();
      if (!doneToday('s51')) err.push('Belohnung fehlt'); if ((S.coins || 0) - c0 !== 20) err.push('Taler ' + ((S.coins || 0) - c0));
      const c1 = S.coins; ST.q = 0; ST.right = 2; reward(); if (S.coins !== c1) err.push('zweite Belohnung am selben Tag');
      document.title = err.length ? 'FEHLER ' + err.join('; ') : 'WASCHTEST OK'; if (err.length) console.error('WASCHTEST ' + err.join('; ')); else console.log('WASCHTEST OK'); return }
    if (k === 'p8-wasch-schaum') demo(0, 1);
    else if (k === 'p8-wasch-schrubben') { demo(1, .5); ST.drips.length = 0; const g = cx.sc; g.fillStyle = 'rgba(110,84,56,.22)'; ST.Z.forEach(z => z.px.forEach(s => { const b = boxOf(s); for (let i = 0; i < 6; i++) { const x = b[0] + Math.random() * b[2], y = b[1] + b[3] * .4 + Math.random() * 10; g.strokeStyle = 'rgba(110,84,56,.3)'; g.lineWidth = 2 + Math.random() * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 20 + Math.random() * 50); g.stroke() } })) }
    else if (k === 'p8-wasch-spuelen') { demo(2, .5); const xc = cx.xc; for (let i = 0; i < 40; i++) droplets(CW * (.15 + Math.random() * .7), CH * (.3 + Math.random() * .5), 30, 2) }
    else if (k === 'p8-wasch-sauber') { demo(4, 1); ST.glint = CW * .42; drawGlint(); ST.next = 1; ST.done = 1; ov.querySelector('.wz-tot').style.width = '100%'; ov.querySelector('.wz-ctl').style.display = 'none'; ov.querySelector('.wz-txt').innerHTML = '<b>Blitzblank!</b> ' + esc(NAMES.s51) + ' glänzt wieder.'; cv.dc.style.opacity = 0; ST.q = 0; ST.right = 1; quiz() }
    ST.next = 1;
  }, 1000);
})();
