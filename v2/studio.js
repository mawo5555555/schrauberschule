'use strict';
// V2 Foto-Studio: Hintergrundbild, Sammelkarte, Zertifikat, Vorher-Nachher, Sticker, Poster (Explosionszeichnung), Video, Album, Galerie, Familien-Bestenliste.
// Alles lokal im Browser per Canvas erzeugt, nichts wird hochgeladen. Teilen über navigator.share (Dateien), sonst Download.
window.V2X = window.V2X || {};
let ST = {b: null, i: -1};
const SF = '"SF Pro Display",system-ui,-apple-system,"Segoe UI",sans-serif';
const short = b => b.name.replace('Simson ', '').replace(' (SR4-2)', '').replace('Schwalbe KR51/2', 'Schwalbe');
const fm = x => String(Math.round(x * 10) / 10).replace('.', ',');
const shareText = b => `Schau, meine ${short(b)} schafft ${b.vmax} km/h und ${fm(b.ps)} PS!`;
const cvBlob = (cv, type = 'image/png', q) => new Promise(r => cv.toBlob(r, type, q));
function mkCv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c }
function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath() }
function txt(x, t, a, b, size, o = {}) { x.font = `${o.w || 700} ${size}px ${SF}`; x.fillStyle = o.c || '#eef3f8'; x.textAlign = o.al || 'left'; x.textBaseline = o.bl || 'alphabetic'; let s = size; if (o.max) while (x.measureText(t).width > o.max && s > 10) { s -= 2; x.font = `${o.w || 700} ${s}px ${SF}` } if (o.glow) { x.shadowColor = o.glow; x.shadowBlur = size * .4 } x.fillText(t, a, b); x.shadowBlur = 0 }
const COL = () => { const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim(); return {a: g('--a') || '#5fb8ff', b: g('--b') || '#d9e2ec', c: g('--c') || '#1f6fe0', bg: g('--bg') || '#070b12', glow: g('--glow') || '#16304f', k1: g('--k1') || '#14233a'} };
function bg(x, W, H, C) { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.glow); g.addColorStop(.55, C.bg); g.addColorStop(1, '#03060c'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(255,255,255,.04)'; x.lineWidth = 2; for (let i = 0; i < W; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke() } }
async function carImg(b) { const i = await picLoad(b.key); if (i) { try { return (window.LACK && LACK.tintFor) ? LACK.tintFor(b.key, i) : i } catch (e) { return i } } return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgBike(b.key, short(b)).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="880" height="480" ')) }) }
function cvCover(x, im, a, b, w, h, r = 0) { x.save(); if (r) { rr(x, a, b, w, h, r); x.clip() } if (im) { const s = Math.max(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s; x.drawImage(im, a + (w - dw) / 2, b + (h - dh) / 2, dw, dh) } else { x.fillStyle = '#10243f'; x.fillRect(a, b, w, h) } x.restore() }
const partsLine = b => (b.parts || []).join(' · ');
function chip(x, t, a, b, C, size = 30) { x.font = `800 ${size}px ${SF}`; const w = x.measureText(t).width + size * 1.2, h = size * 1.7; rr(x, a, b, w, h, h / 2); x.fillStyle = 'rgba(7,11,18,.78)'; x.fill(); x.strokeStyle = C.a; x.lineWidth = 2; x.stroke(); txt(x, t, a + w / 2, b + h / 2, size, {al: 'center', bl: 'middle', c: C.a}); return w }
function statRow(x, label, val, pct, a, b, w, C, size = 30) { txt(x, label, a, b, size * .8, {c: '#8aa0ba', w: 600}); txt(x, val, a + w, b, size, {al: 'right', c: '#fff', w: 800}); rr(x, a, b + size * .35, w, size * .3, size * .15); x.fillStyle = '#1a2a42'; x.fill(); const g = x.createLinearGradient(a, 0, a + w, 0); g.addColorStop(0, C.a); g.addColorStop(1, C.c); rr(x, a, b + size * .35, Math.max(size * .3, w * Math.min(1, pct)), size * .3, size * .15); x.fillStyle = g; x.fill() }

// ---- Studio-Bild (Vorschau) und Hintergrundbild
async function sceneDraw(cv, b, wall) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, C = COL(), im = await carImg(b); bg(x, W, H, C);
  const pad = W * .06, top = wall ? H * .22 : H * .05, ch = wall ? H * .30 : H * .46;
  x.save(); x.shadowColor = C.a; x.shadowBlur = 40; rr(x, pad, top, W - 2 * pad, ch, W * .04); x.fillStyle = '#0c1626'; x.fill(); x.restore(); cvCover(x, im, pad, top, W - 2 * pad, ch, W * .04);
  x.strokeStyle = C.a; x.lineWidth = 3; rr(x, pad, top, W - 2 * pad, ch, W * .04); x.stroke();
  let y = top + ch + W * .11, u = W / 720;
  txt(x, 'MEINE SIMSON', pad, y - 62 * u, 26 * u, {c: C.a, w: 700}); txt(x, short(b), pad, y + 20 * u, 92 * u, {w: 900, max: W - 2 * pad, glow: C.a});
  y += 70 * u; let cx = pad; cx += chip(x, fm(b.ps) + ' PS', cx, y, C, 34 * u) + 16 * u; cx += chip(x, b.vmax + ' km/h', cx, y, C, 34 * u) + 16 * u; chip(x, b.ccm + ' cm³', cx, y, C, 34 * u);
  y += 110 * u; statRow(x, 'Leistung (Serie ' + fm(b.base.ps) + ' PS)', '+' + Math.round((b.ps / b.base.ps - 1) * 100) + ' %', b.ps / 12, pad, y, W - 2 * pad, C, 34 * u);
  y += 76 * u; statRow(x, 'Höchstgeschwindigkeit', b.vmax + ' km/h', b.vmax / 100, pad, y, W - 2 * pad, C, 34 * u);
  y += 90 * u; txt(x, 'TEILE', pad, y, 24 * u, {c: C.a}); (b.parts || []).forEach((p, k) => txt(x, '• ' + p, pad, y + 44 * u * (k + 1), 30 * u, {c: '#eef3f8', w: 600, max: W - 2 * pad}));
  txt(x, 'Schrauberschule v3.0' + (b.player ? ' · ' + b.player : ''), W / 2, H - (wall ? H * .1 : 28 * u), 24 * u, {al: 'center', c: '#6b819c', w: 600});
}
// ---- Sammelkarte (Quartett)
async function cardDraw(cv, b) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, C = COL(), im = await carImg(b), u = W / 750; bg(x, W, H, C);
  rr(x, 14 * u, 14 * u, W - 28 * u, H - 28 * u, 36 * u); x.strokeStyle = C.b; x.lineWidth = 6 * u; x.stroke(); rr(x, 26 * u, 26 * u, W - 52 * u, H - 52 * u, 28 * u); x.strokeStyle = C.a; x.lineWidth = 2 * u; x.stroke();
  txt(x, short(b), 50 * u, 98 * u, 62 * u, {w: 900, max: W - 220 * u}); txt(x, 'TUNING-KARTE', 50 * u, 134 * u, 22 * u, {c: C.a}); const no = 'Nr. ' + String(1 + ((b.at || 0) % 90)).padStart(2, '0'); txt(x, no, W - 50 * u, 98 * u, 34 * u, {al: 'right', c: C.b});
  cvCover(x, im, 50 * u, 160 * u, W - 100 * u, 360 * u, 22 * u); x.strokeStyle = C.a; x.lineWidth = 3 * u; rr(x, 50 * u, 160 * u, W - 100 * u, 360 * u, 22 * u); x.stroke();
  const rows = [['Leistung', fm(b.ps) + ' PS', b.ps / 12], ['Höchstgeschw.', b.vmax + ' km/h', b.vmax / 100], ['Hubraum', b.ccm + ' cm³', b.ccm / 90], ['Drehzahl-Spitze', (b.peak || 6000) + ' U/min', (b.peak || 6000) / 10000], ['Kosten (günstig = gut)', (b.cost || 0).toFixed(0) + ' €', 1 - (b.cost || 0) / 450]];
  rows.forEach((r, k) => statRow(x, r[0], r[1], r[2], 56 * u, 592 * u + k * 78 * u, W - 112 * u, C, 34 * u));
  txt(x, (b.parts || []).slice(0, 3).join(' · '), W / 2, H - 62 * u, 21 * u, {al: 'center', c: '#8aa0ba', w: 600, max: W - 100 * u}); txt(x, 'Schrauberschule v3.0' + (b.player ? ' · ' + b.player : ''), W / 2, H - 38 * u, 18 * u, {al: 'center', c: '#6b819c'});
}
// ---- Zertifikat (A4, 150 dpi)
async function certDraw(cv, b) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, u = W / 1240, im = await carImg(b);
  x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, W, H); x.strokeStyle = '#1f3f73'; x.lineWidth = 14 * u; x.strokeRect(50 * u, 50 * u, W - 100 * u, H - 100 * u); x.lineWidth = 3 * u; x.strokeRect(78 * u, 78 * u, W - 156 * u, H - 156 * u);
  txt(x, 'WERKSTATT-ABNAHME', W / 2, 230 * u, 40 * u, {al: 'center', c: '#1f6fe0', w: 800}); txt(x, 'ZERTIFIKAT', W / 2, 330 * u, 120 * u, {al: 'center', c: '#14233a', w: 900});
  txt(x, 'Hiermit wird bestätigt, dass' + (b.player ? ' ' + b.player : '') + ' den folgenden Umbau fertiggestellt hat:', W / 2, 410 * u, 30 * u, {al: 'center', c: '#3b4a60', w: 500, max: W - 200 * u});
  txt(x, short(b), W / 2, 520 * u, 100 * u, {al: 'center', c: '#1f6fe0', w: 900, max: W - 200 * u}); cvCover(x, im, 170 * u, 560 * u, W - 340 * u, 480 * u, 24 * u); x.strokeStyle = '#1f3f73'; x.lineWidth = 4 * u; rr(x, 170 * u, 560 * u, W - 340 * u, 480 * u, 24 * u); x.stroke();
  [['Leistung', fm(b.ps) + ' PS'], ['Höchstgeschw.', b.vmax + ' km/h'], ['Hubraum', b.ccm + ' cm³'], ['Kerzenbild', b.kerze || 'rehbraun']].forEach((r, k) => { const cx = 170 * u + k * ((W - 340 * u) / 4) + (W - 340 * u) / 8; txt(x, r[1], cx, 1130 * u, 44 * u, {al: 'center', c: '#14233a', w: 800}); txt(x, r[0], cx, 1170 * u, 26 * u, {al: 'center', c: '#6b7a90', w: 600}) });
  txt(x, 'Verbaute Teile', W / 2, 1270 * u, 30 * u, {al: 'center', c: '#1f6fe0', w: 800}); (b.parts || []).forEach((p, k) => txt(x, p, W / 2, 1320 * u + k * 44 * u, 32 * u, {al: 'center', c: '#14233a', w: 500, max: W - 240 * u}));
  if (!b.legal) txt(x, 'Hinweis: Nicht serienmäßig. Auf der Straße nur nach Prüfung und Eintragung, sonst nur Privatgelände.', W / 2, 1600 * u, 24 * u, {al: 'center', c: '#8a3b2b', w: 500, max: W - 240 * u});
  x.strokeStyle = '#14233a'; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(190 * u, 1670 * u); x.lineTo(520 * u, 1670 * u); x.moveTo(W - 520 * u, 1670 * u); x.lineTo(W - 190 * u, 1670 * u); x.stroke();
  txt(x, 'Datum: ' + (b.date || ''), 190 * u, 1705 * u, 24 * u, {c: '#3b4a60'}); txt(x, 'Werkstattmeister', W - 190 * u, 1705 * u, 24 * u, {al: 'right', c: '#3b4a60'});
}
// ---- Vorher-Nachher
async function baCmpDraw(cv, b) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, C = COL(), im = await carImg(b), u = W / 1080; bg(x, W, H, C);
  txt(x, 'VORHER · NACHHER', W / 2, 110 * u, 56 * u, {al: 'center', c: C.a, w: 900}); txt(x, short(b), W / 2, 180 * u, 44 * u, {al: 'center', w: 700, max: W - 100 * u});
  const bw = (W - 3 * 40 * u) / 2, top = 230 * u, bh = 620 * u;
  [0, 1].forEach(k => { const a = 40 * u + k * (bw + 40 * u); cvCover(x, im, a, top, bw, bh, 28 * u); if (!k) { x.fillStyle = 'rgba(40,46,56,.72)'; rr(x, a, top, bw, bh, 28 * u); x.fill() } x.strokeStyle = k ? C.a : '#6b819c'; x.lineWidth = 4 * u; rr(x, a, top, bw, bh, 28 * u); x.stroke(); txt(x, k ? 'GETUNT' : 'SERIE', a + bw / 2, top + 70 * u, 50 * u, {al: 'center', w: 900, c: k ? C.a : '#c0cad8', glow: k ? C.a : 0}); txt(x, k ? fm(b.ps) + ' PS' : fm(b.base.ps) + ' PS', a + bw / 2, top + bh - 90 * u, 64 * u, {al: 'center', w: 900}); txt(x, (k ? b.vmax : b.base.vmax) + ' km/h', a + bw / 2, top + bh - 34 * u, 40 * u, {al: 'center', c: '#d9e2ec'}) });
  let y = top + bh + 110 * u; statRow(x, 'Leistung', '+' + Math.round((b.ps / b.base.ps - 1) * 100) + ' %', b.ps / 12, 60 * u, y, W - 120 * u, C, 44 * u); y += 100 * u; statRow(x, 'Höchstgeschwindigkeit', (b.vmax - b.base.vmax >= 0 ? '+' : '') + (b.vmax - b.base.vmax) + ' km/h', b.vmax / 100, 60 * u, y, W - 120 * u, C, 44 * u);
  txt(x, partsLine(b), W / 2, H - 70 * u, 26 * u, {al: 'center', c: '#8aa0ba', max: W - 100 * u}); txt(x, 'Schrauberschule v3.0', W / 2, H - 30 * u, 22 * u, {al: 'center', c: '#6b819c'});
}
// ---- Sticker 512x512 mit transparentem Hintergrund
async function stickerDraw(cv, b) {
  const x = cv.getContext('2d'), W = 512, C = COL(), im = await carImg(b); x.clearRect(0, 0, W, W);
  x.save(); x.beginPath(); x.arc(256, 236, 214, 0, 7); x.closePath(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 14; x.fillStyle = '#fff'; x.fill(); x.restore();
  x.save(); x.beginPath(); x.arc(256, 236, 204, 0, 7); x.clip(); cvCover(x, im, 52, 32, 408, 408); x.restore(); x.beginPath(); x.arc(256, 236, 204, 0, 7); x.lineWidth = 8; x.strokeStyle = C.c; x.stroke();
  x.save(); x.translate(256, 410); x.rotate(-.05); rr(x, -200, -50, 400, 100, 30); x.fillStyle = C.c; x.fill(); x.lineWidth = 6; x.strokeStyle = '#fff'; x.stroke(); txt(x, b.vmax + ' km/h', 0, 12, 62, {al: 'center', c: '#fff', w: 900, bl: 'middle'}); x.restore();
  txt(x, short(b), 256, 66, 44, {al: 'center', c: '#fff', w: 900, max: 360, glow: '#000'});
}
// ---- Poster A4: Explosionszeichnung
function artImgOf(inner) { const d = document.querySelector('svg[aria-hidden] defs'); const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400"><defs>${d ? d.innerHTML : ''}</defs>${inner}</svg>`; return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) }) }
async function posterDraw(cv, b) {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, u = W / 1240, C = COL(); bg(x, W, H, C);
  txt(x, 'EXPLOSIONSZEICHNUNG', W / 2, 130 * u, 70 * u, {al: 'center', c: C.a, w: 900, glow: C.a}); txt(x, 'Motor der ' + short(b) + ' · ' + fm(b.ps) + ' PS · ' + b.vmax + ' km/h' + (b.player ? ' · ' + b.player : ''), W / 2, 190 * u, 34 * u, {al: 'center', w: 600, max: W - 120 * u});
  const pk = b.pick || {}, o = (s) => (typeof opt === 'function' && pk[s]) ? opt(s, pk[s]) : null;
  const items = [
    ['kerze', 'Zündkerze', ART.kerze('rehbraun'), 620, 300, 150, 'spark plug'], ['kopf', 'Zylinderkopf', ART.kopf(), 620, 470, 250, 'cylinder head'],
    ['zyl', o('zyl') ? o('zyl').n : 'Zylinder', o('zyl') ? ART.cyl(o('zyl').kind, o('zyl').bore) : ART.cyl(), 620, 740, 280, 'cylinder'], ['kolben', 'Kolben', ART.kolben(), 620, 1010, 200, 'piston'], ['motor', 'Kurbelgehäuse', ART.motor(), 620, 1330, 380, 'crankcase'],
    ['verg', o('verg') ? o('verg').n : 'Vergaser', o('verg') ? ART.verg(o('verg').size) : ART.verg(), 190, 1020, 240, 'carburettor'], ['aus', o('aus') ? o('aus').n : 'Auspuff', o('aus') ? ART.aus(o('aus').kind) : ART.aus(), 1050, 1300, 250, 'exhaust'],
    ['zuend', o('zuend') ? o('zuend').n : 'Zündung', o('zuend') ? ART.polrad(o('zuend').kind === 'e' ? 'e' : 'o') : ART.polrad(), 190, 1340, 230, 'ignition'], ['rit', o('rit') ? o('rit').n : 'Ritzel', o('rit') ? ART.ritzel(o('rit').z) : ART.ritzel(15), 1050, 1010, 190, 'sprocket']];
  x.setLineDash([10 * u, 10 * u]); x.strokeStyle = C.a; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(620 * u, 250 * u); x.lineTo(620 * u, 1520 * u); x.stroke(); [['verg', 620, 1190], ['zuend', 620, 1340], ['aus', 620, 1330], ['rit', 620, 1010]].forEach(() => 0);
  for (const [id, , , px, py] of items) { if (['verg', 'zuend'].includes(id)) { x.beginPath(); x.moveTo(px * u, py * u); x.lineTo(620 * u, py * u); x.stroke() } if (['aus', 'rit'].includes(id)) { x.beginPath(); x.moveTo(px * u, py * u); x.lineTo(620 * u, py * u); x.stroke() } }
  x.setLineDash([]);
  for (const [id, name, inner, px, py, s, en] of items) { const im = await artImgOf(inner); if (im) x.drawImage(im, (px - s / 2) * u, (py - s / 2) * u, s * u, s * u); const left = px < 620; const lx = px + (left ? -s / 2 - 10 : s / 2 + 10); txt(x, name, (px < 400 ? 50 : px > 900 ? W / u - 50 : (px + s / 2 + 20)) * u, (py - 6) * u, 30 * u, {w: 800, al: px > 900 ? 'right' : 'left', max: 340 * u}); txt(x, en, (px < 400 ? 50 : px > 900 ? W / u - 50 : (px + s / 2 + 20)) * u, (py + 32) * u, 24 * u, {c: C.a, w: 600, al: px > 900 ? 'right' : 'left'}) }
  txt(x, 'Hauptdüse ' + (b.jet || '') + ' · Kerzenbild ' + (b.kerze || 'rehbraun') + ' · Hubraum ' + b.ccm + ' cm³', W / 2, H - 90 * u, 30 * u, {al: 'center', c: '#d9e2ec', w: 600}); txt(x, 'Schrauberschule v3.0', W / 2, H - 45 * u, 24 * u, {al: 'center', c: '#6b819c'});
}
// ---- PDF aus einem JPEG (A4)
function pdfOfJpeg(bytes, w, h) {
  const enc = new TextEncoder(), parts = [], offs = []; let off = 0; const push = d => { const u8 = typeof d === 'string' ? enc.encode(d) : d; parts.push(u8); off += u8.length };
  push('%PDF-1.4\n'); const o = (n, s) => { offs[n] = off; push(`${n} 0 obj\n${s}\nendobj\n`) };
  o(1, '<< /Type /Catalog /Pages 2 0 R >>'); o(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'); o(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  offs[4] = off; push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`); push(bytes); push('\nendstream\nendobj\n');
  const c = 'q 595 0 0 842 0 0 cm /Im0 Do Q'; o(5, `<< /Length ${c.length} >>\nstream\n${c}\nendstream`);
  const xr = off; push('xref\n0 6\n0000000000 65535 f \n'); for (let i = 1; i <= 5; i++) push(String(offs[i]).padStart(10, '0') + ' 00000 n \n'); push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);
  return new Blob(parts, {type: 'application/pdf'});
}
async function pdfOf(cv) { const jb = await cvBlob(cv, 'image/jpeg', .92); return pdfOfJpeg(new Uint8Array(await jb.arrayBuffer()), cv.width, cv.height) }
// ---- Teilen oder Speichern
function saveBlob(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href) }, 4000) }
async function shareOrSave(blob, name, text, forceSave) {
  const f = new File([blob], name, {type: blob.type});
  if (!forceSave) try { if (navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], text, title: 'Schrauberschule'}); return 'share' } } catch (e) { if (e && e.name === 'AbortError') return 'abort' }
  saveBlob(blob, name); return 'save';
}
const SIZES = {wall: [1170, 2532], card: [750, 1050], cert: [1240, 1754], cmp: [1080, 1350], poster: [1240, 1754], sticker: [512, 512], scene: [720, 900]};
const DRAW = {wall: (c, b) => sceneDraw(c, b, true), scene: (c, b) => sceneDraw(c, b, false), card: cardDraw, cert: certDraw, cmp: baCmpDraw, poster: posterDraw, sticker: stickerDraw};
async function render2(kind, b) { const [w, h] = SIZES[kind], cv = mkCv(w, h); await DRAW[kind](cv, b); return cv }
const NAMES = {wall: 'hintergrund', card: 'sammelkarte', cert: 'zertifikat', cmp: 'vorher-nachher', poster: 'poster', sticker: 'sticker'};
async function studioDo(kind, mode) {
  const b = ST.b; if (!b) return; const nm = 'simson-' + short(b).toLowerCase().replace(/\W+/g, '') + '-' + NAMES[kind];
  toast('Bild wird erstellt …'); const cv = await render2(kind, b); let blob, file;
  if (mode === 'pdf') { blob = await pdfOf(cv); file = nm + '.pdf' } else { blob = await cvBlob(cv); file = nm + '.png' }
  if (kind === 'card') studioKeep();
  const forceSave = mode === 'save' || mode === 'pdf';
  const r = await shareOrSave(blob, file, shareText(b), forceSave); if (r === 'save') toast(kind === 'wall' ? 'Gespeichert. In Fotos öffnen, dann Teilen, Als Hintergrundbild.' : 'Gespeichert (Download).'); else if (r === 'share') toast('Geteilt.')
}
function studioKeep() { const b = ST.b; if (!b || W2.album.some(a => a.at && a.at === b.at && a.id === b.id)) return; b.at = b.at || Date.now(); W2.album.push(Object.assign({}, b)); W2.album = W2.album.slice(-40); w2save(); toast('Karte liegt jetzt im Album.') }
async function studioOpen(i) {
  let b; if (i === 'cur') { const c = car(), v = veh(); b = w2Build(c, v); b.at = b.at || 0 } else b = W2.garage[i];
  if (!b) return; ST = {b, i}; view = 'studio'; render(); drawStudio();
}
async function drawStudio() { const cv = document.getElementById('stc'); if (!cv || !ST.b) return; await sceneDraw(cv, ST.b, false) }
V2X.studio = () => { const b = ST.b; if (!b) return '<p class="m">Noch kein Umbau gewählt.</p>'; return `<div class="nav"><button class="back" onclick="go('w2')" aria-label="Zurück">‹</button><b>Foto-Studio</b></div>
  <div class="lay"><div class="la"><canvas id="stc" width="720" height="900" style="width:100%;border-radius:16px;border:1px solid var(--bd)"></canvas></div><div class="lb2">
  <p class="m">Deine ${esc(short(b))} als Bild. Alles wird nur auf deinem Gerät erstellt.</p>
  <button class="btn vid" onclick="videoShare()"><span class="vi">🎬</span> Video teilen<small>Prüfstandslauf als Clip, 9:16</small></button>
  <button class="btn" onclick="studioDo('wall')">📱 Als Hintergrundbild</button><p class="m" style="margin-top:-4px">So geht’s: Bild in Fotos öffnen, Teilen-Symbol, „Als Hintergrundbild verwenden“. (Android: Galerie, Mehr, Als Hintergrund.)</p>
  <button class="btn alt" onclick="studioDo('card')">🃏 Sammelkarte erstellen</button>
  <div class="fgrid"><button class="fc" onclick="studioDo('cert')"><i>Zertifikat</i><b>Als Bild teilen</b></button><button class="fc" onclick="studioDo('cert','pdf')"><i>Zertifikat drucken</i><b>Als PDF (A4)</b></button><button class="fc" onclick="studioDo('cmp')"><i>Vorher · Nachher</i><b>Serie gegen getunt</b></button><button class="fc" onclick="studioDo('sticker')"><i>Sticker</i><b>PNG 512 × 512</b></button><button class="fc" onclick="studioDo('poster')"><i>Poster A4</i><b>Explosionszeichnung</b></button><button class="fc" onclick="studioDo('scene')"><i>Teilen</i><b>„${esc(shareText(b)).slice(0, 26)}…“</b></button></div>
  <button class="btn alt" onclick="studioDo('poster','pdf')">Poster als PDF drucken</button></div></div>` };
// ---- Galerie, Album, Bestenliste
function thumb(kind, b) { const id = 't' + Math.random().toString(36).slice(2, 8); setTimeout(async () => { const el = document.getElementById(id); if (!el) return; const cv = await render2(kind, b); el.src = cv.toDataURL('image/jpeg', .7) }, 30); return `<img id="${id}" alt="${esc(short(b))}" style="aspect-ratio:${SIZES[kind][0]}/${SIZES[kind][1]};background:#0c1626">` }
V2X.gal = () => `<div class="nav"><button class="back" onclick="go('w2')" aria-label="Zurück">‹</button><b>Garage-Galerie</b></div>${!W2.garage.length ? '<p class="m">Noch keine Umbauten. Schließe einen Auftrag mit der Abnahme ab, dann erscheint dein Umbau hier.</p>' : `<div class="albgrid">${W2.garage.map((b, i) => `<button class="item" style="display:block;padding:8px" onclick="studioOpen(${i})">${thumb('scene', b)}<b>${esc(b.name)}</b><span class="m">${fm(b.ps)} PS · ${b.vmax} km/h${b.player ? ' · ' + esc(b.player) : ''}</span></button>`).join('')}</div>`}
  ${W2.garage.length ? '<h2>Vorher · Nachher</h2><div class="albgrid">' + W2.garage.slice(-4).reverse().map(b => `<div>${thumb('cmp', b)}</div>`).join('') + '</div>' : ''}`;
V2X.alb = () => `<div class="nav"><button class="back" onclick="go('w2')" aria-label="Zurück">‹</button><b>Kartenalbum</b></div>${!W2.album.length ? '<p class="m">Noch keine Karten. Im Foto-Studio auf „Sammelkarte erstellen“ tippen, dann landet sie hier.</p>' : `<div class="albgrid">${W2.album.map((b, i) => `<button class="item" style="display:block;padding:6px" onclick="albShow(${i})">${thumb('card', b)}</button>`).join('')}</div>`}`;
async function albShow(i) { const b = W2.album[i]; if (!b) return; ST = {b, i: -1}; await studioDo('card', 'share') }
function plStats() { const names = new Set(W2.players); W2.garage.forEach(g => names.add(g.player || 'Gast')); if (!names.size) names.add('Gast'); return [...names].map(n => { const l = W2.garage.filter(g => (g.player || 'Gast') === n); return {n, cnt: l.length, ps: Math.max(0, ...l.map(g => g.ps)), v: Math.max(0, ...l.map(g => g.vmax)), cards: W2.album.filter(a => (a.player || 'Gast') === n).length} }).sort((a, b) => b.v - a.v || b.ps - a.ps) }
V2X.lbd = () => `<div class="nav"><button class="back" onclick="go('w2')" aria-label="Zurück">‹</button><b>Familien-Bestenliste</b></div><p class="m">Nur auf diesem Gerät, ohne Server. Wer baut die schnellste Simson? Spieler wählen, dann Aufträge abschließen.</p>
  <div class="card"><b>Spieler</b><div class="mods" style="margin-top:8px">${W2.players.map(n => `<button class="${W2.player === n ? 's' : ''}" onclick="plSet('${esc(n).replace(/'/g, '')}')">${esc(n)}</button>`).join('') || '<span class="m">noch keiner</span>'}</div><div class="row" style="margin-top:8px"><input class="in" id="pln" maxlength="14" placeholder="Name eingeben" style="margin:0"><button class="btn" style="width:auto;margin:0" onclick="plAdd()">Neu</button></div></div>
  <h2>Rangliste (Höchstgeschwindigkeit)</h2>${plStats().map((p, k) => `<div class="lb"><span class="pill">${k + 1}</span><b>${esc(p.n)}</b><span class="m">${p.cnt} Umbauten · ${p.v} km/h · ${fm(p.ps)} PS · ${p.cards} Karten</span></div>`).join('')}`;
function plAdd() { const e = document.getElementById('pln'), n = e && e.value.trim().slice(0, 14); if (!n) return; if (!W2.players.includes(n)) W2.players.push(n); W2.player = n; w2save(); render() }
function plSet(n) { W2.player = n; w2save(); render() }

// ---- Video: 9:16-Clip per Canvas und MediaRecorder, Ton aus dem Web-Audio-Stream
function videoBuild() {
  if (view === 'studio' && ST.b) return ST.b;
  const c = W2.veh && W2.cars[W2.veh]; if (c && c.ph >= 5) return w2Build(c, veh());
  const v = V2V[W2.sel] || V2V.s51, cc = W2.cars[v.id]; if (cc) return w2Build(cc, v);
  if (W2.garage.length && view !== 'pr') return W2.garage[W2.garage.length - 1];
  return w2Build({pick: ORIGP, jet: 70}, v);
}
const VIDMIME = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
let VID = null;
function vidClose() { if (VID) { VID.stop = true; clearInterval(VID.iv); try { VID.rec && VID.rec.state !== 'inactive' && VID.rec.stop() } catch (e) {} } FX.force = false; FX.off(); const o = document.getElementById('vidov'); if (o) o.remove(); VID = null }
function curveAt(b, r) { const x = Math.exp(-Math.pow((r - b.peak) / b.width, 2)); return b.ps * (.18 + .82 * x) * (r < 3000 ? Math.max(0, (r - 1500) / 1500) : 1) }
async function videoShare() {
  if (VID) return; const b = videoBuild(); if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { toast('Dieser Browser kann kein Video aufnehmen. Nutze das Foto-Studio für Bilder.'); return }
  const mime = VIDMIME.find(m => MediaRecorder.isTypeSupported(m)) || ''; const im = await carImg(b), logo = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = 'icon-180.png' });
  const W = 540, H = 960, T = 14, cv = mkCv(W, H), x = cv.getContext('2d'), C = COL();
  const ov = document.createElement('div'); ov.id = 'vidov'; ov.style.cssText = 'position:fixed;inset:0;z-index:90;background:rgba(3,6,12,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px'; cv.style.cssText = 'max-height:68vh;max-width:90vw;border-radius:16px;border:1px solid var(--bd)';
  ov.innerHTML = '<b id="vst" style="color:#fff">Aufnahme läuft … 14 s</b>'; ov.insertBefore(cv, ov.firstChild); const bt = document.createElement('button'); bt.className = 'btn alt'; bt.style.maxWidth = '320px'; bt.textContent = 'Abbrechen'; bt.onclick = vidClose; ov.appendChild(bt); document.body.appendChild(ov);
  FX.force = true; FX.A(); FX.out(); const stream = cv.captureStream(30); FX.rdest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const chunks = []; let rec; try { rec = new MediaRecorder(stream, mime ? {mimeType: mime, videoBitsPerSecond: 3500000} : {}) } catch (e) { vidClose(); toast('Aufnahme nicht möglich.'); return }
  VID = {rec, stop: false}; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data) };
  const parts = []; let t0 = performance.now(), ang = 0, last = t0; FX.rev(9);
  const ramp = t => t < 1.5 ? 0 : t < 7 ? (t - 1.5) / 5.5 : t < 9 ? 1 : Math.max(0, 1 - (t - 9) / 2);
  const done = new Promise(res => { rec.onstop = res });
  rec.start(250);
  const frame = now => {
    if (!VID || VID.stop) return; const t = (now - t0) / 1000, dt = (now - last) / 1000; last = now; const u = W / 540, r = ramp(t), rpm = 1500 + (b.peak + 800 - 1500) * Math.min(1, r * 1.1);
    bg(x, W, H, C); const intro = Math.min(1, t / .8);
    txt(x, 'PRÜFSTAND', W / 2, 90 * u, 44 * u, {al: 'center', c: C.a, w: 900, glow: C.a}); txt(x, short(b), W / 2, 140 * u, 34 * u, {al: 'center', w: 800, max: W - 60 * u});
    x.save(); x.globalAlpha = intro; const sh = r > .05 ? Math.sin(t * 60) * r * 2 : 0; cvCover(x, im, 30 * u + sh, 170 * u, W - 60 * u, 300 * u, 22 * u); x.restore(); x.strokeStyle = C.a; x.lineWidth = 2; rr(x, 30 * u, 170 * u, W - 60 * u, 300 * u, 22 * u); x.stroke();
    ang += dt * (2 + r * 60); const cx = W / 2, cy = 560 * u, R = 70 * u; x.save(); x.translate(cx, cy); x.rotate(ang); for (let i = 0; i < 12; i++) { x.rotate(Math.PI / 6); x.fillStyle = i % 2 ? '#aab4c2' : '#3a4558'; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, 0, Math.PI / 6); x.fill() } x.restore(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.lineWidth = 6; x.strokeStyle = '#1a2230'; x.stroke();
    if (r > .1 && Math.random() < r) for (let i = 0; i < 3; i++) parts.push({x: cx + (Math.random() < .5 ? -R : R), y: cy + R * .6, vx: (Math.random() - .5) * 260, vy: -Math.random() * 220, l: .6});
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.l -= dt; if (p.l <= 0) { parts.splice(i, 1); continue } p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; x.fillStyle = `rgba(255,${160 + Math.random() * 80 | 0},40,${p.l / .6})`; x.fillRect(p.x, p.y, 4, 4) }
    txt(x, Math.round(rpm) + ' U/min', W / 2, 690 * u, 26 * u, {al: 'center', c: '#8aa0ba', w: 600}); txt(x, fm(curveAt(b, rpm)) + ' PS', W / 2, 760 * u, 62 * u, {al: 'center', w: 900, glow: C.a});
    const gx = 40 * u, gy = 800 * u, gw = W - 80 * u, gh = 120 * u; x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1; x.strokeRect(gx, gy, gw, gh); x.beginPath(); x.lineWidth = 4; x.strokeStyle = C.a; x.shadowColor = C.a; x.shadowBlur = 8; let first = true; for (let rr2 = 2000; rr2 <= Math.min(10000, rpm); rr2 += 100) { const px = gx + (rr2 - 2000) / 8000 * gw, py = gy + gh - curveAt(b, rr2) / 10 * gh; if (first) { x.moveTo(px, py); first = false } else x.lineTo(px, py) } x.stroke(); x.shadowBlur = 0;
    if (t > 9 && t < 12.3) { const k = Math.min(1, (t - 9) / .5), s = 1 + (1 - k) * .6 + Math.sin(t * 6) * .02; x.fillStyle = 'rgba(3,8,16,' + .62 * k + ')'; x.fillRect(0, 0, W, H); x.save(); x.translate(W / 2, 520 * u); x.scale(s, s); x.globalAlpha = k; txt(x, b.vmax + '', 0, 60 * u, 200 * u, {al: 'center', w: 900, glow: C.a}); txt(x, 'km/h', 0, 120 * u, 50 * u, {al: 'center', c: C.a, w: 800}); txt(x, fm(b.ps) + ' PS · ' + short(b), 0, 190 * u, 34 * u, {al: 'center', w: 700}); x.restore() }
    if (t > 12) { const k = Math.min(1, (t - 12) / .6); x.fillStyle = 'rgba(3,8,16,' + k + ')'; x.fillRect(0, 0, W, H); x.save(); x.globalAlpha = k; if (logo) { rr(x, W / 2 - 70 * u, 340 * u, 140 * u, 140 * u, 30 * u); x.save(); x.clip(); x.drawImage(logo, W / 2 - 70 * u, 340 * u, 140 * u, 140 * u); x.restore() } txt(x, 'Schrauberschule', W / 2, 560 * u, 38 * u, {al: 'center', w: 900, max: W - 60 * u}); txt(x, 'v3.0 · Lernen und Tunen', W / 2, 600 * u, 24 * u, {al: 'center', c: C.a}); x.restore() }
    const st = document.getElementById('vst'); if (st) st.textContent = 'Aufnahme läuft … ' + Math.max(0, Math.ceil(T - t)) + ' s';
    if (t >= T) { clearInterval(VID.iv); try { rec.stop() } catch (e) {} }
  };
  VID.iv = setInterval(() => { try { frame(performance.now()) } catch (e) { console.warn(e) } }, 33);
  await done; FX.force = false; FX.off(); if (!VID || VID.stop) { return } VID = null;
  const type = (mime.split(';')[0]) || 'video/webm', blob = new Blob(chunks, {type}), ext = type.includes('mp4') ? 'mp4' : 'webm', url = URL.createObjectURL(blob), name = 'simson-' + short(b).toLowerCase().replace(/\W+/g, '') + '.' + ext;
  ov.innerHTML = `<video src="${url}" controls playsinline loop autoplay muted style="max-height:62vh;max-width:90vw;border-radius:16px;border:1px solid var(--bd)"></video><b style="color:#fff">Fertig: ${ext.toUpperCase()}, ${(blob.size / 1e6).toFixed(1)} MB</b><div style="display:flex;gap:8px;width:min(360px,90vw)"><button class="btn vid" id="vsh" style="margin:0">Teilen</button><button class="btn alt" id="vsv" style="margin:0">Speichern</button></div><button class="btn alt" id="vcl" style="max-width:320px">Schließen</button>`;
  document.getElementById('vsh').onclick = async () => { const r = await shareOrSave(blob, name, shareText(b)); if (r === 'save') toast('Video gespeichert (Download).') };
  document.getElementById('vsv').onclick = () => { saveBlob(blob, name); toast('Video gespeichert (Download).') }; document.getElementById('vcl').onclick = () => { ov.remove(); URL.revokeObjectURL(url) };
  window.__lastVideo = {type, size: blob.size};
}
