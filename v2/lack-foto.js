'use strict';
// Lackieren auf echtem Foto. Basis img/ki/<datei> + Maske img/lack/<id>-maske.png (weiss = Lackteile).
// Umfärben nur in der Maske, Luminanz des Originals bleibt (Glanz, Schatten, Patina). Hintergrund bleibt unverändert.
window.LackFoto = (function () {
  const BASE = {s51: 'img/ki/s51.jpg', kr51: 'img/ki/schwalbe.jpg', sr50: 'img/ki/sr50.jpg', s50: 'img/ki/s50.jpg', habicht: 'img/ki/habicht.jpg', star: 'img/ki/star.jpg', duo: 'img/ki/neu/duo-t9-v1.jpg', klapp: 'img/ki/klapprad.jpg'};
  const cache = {};
  // Schwalbe: Patina/Rostflecken im Blech sollen nicht durchscheinen -> Helligkeit weichzeichnen und begrenzen
  const SMOOTH = {kr51: {blur: 3, lo: .82, hi: 1.1}};
  const load = src => cache[src] || (cache[src] = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = (window.LACKFOTO_PRE == null ? 'v2/' : window.LACKFOTO_PRE) + src }));
  async function prep(id) {
    const [im, mk] = await Promise.all([load(BASE[id]), load('img/lack/' + id + '-maske.png')]);
    const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(im, 0, 0);
    const base = x.getImageData(0, 0, w, h); x.clearRect(0, 0, w, h); x.drawImage(mk, 0, 0, w, h);
    const sm = SMOOTH[id]; let bl = null; if (sm) { const c2 = document.createElement('canvas'); c2.width = w; c2.height = h; const x2 = c2.getContext('2d', {willReadFrequently: true}); x2.filter = 'blur(' + sm.blur + 'px)'; x2.drawImage(im, 0, 0); bl = x2.getImageData(0, 0, w, h).data }
    const m = x.getImageData(0, 0, w, h).data, lum = new Float32Array(w * h), a = new Float32Array(w * h), cl = new Uint8Array(w * h), v0 = [], v1 = [];
    for (let i = 0; i < w * h; i++) {
      const d = base.data; lum[i] = bl ? .299 * bl[i * 4] + .587 * bl[i * 4 + 1] + .114 * bl[i * 4 + 2] : .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2]; a[i] = m[i * 4] / 255; cl[i] = m[i * 4 + 1] > 127 ? 1 : 0;
      if (a[i] > .5 && i % 7 === 0) (cl[i] ? v1 : v0).push(lum[i]);
    }
    const med = v => { v.sort((p, q) => p - q); return v.length ? v[v.length >> 1] : 0 };
    const all = v0.concat(v1), r0 = med(v0), r1 = med(v1), ref = med(all) || 128;
    // zwei Klassen (z.B. Duo: Blech + helle Scheinwerferblende) bekommen je eigenen Bezugswert, damit nichts weiss ausbrennt
    const two = v0.length > 200 && v1.length > 200;
    const refs = two ? [r0 || ref, r1 || ref] : [ref, ref];
    return {w, h, base, lum, a, cl, refs, sm};
  }
  const P = {};
  // draw(canvas, id, '#rrggbb', progress 0..1 optional: Sprühfortschritt von links nach rechts, Rest bleibt Original)
  async function draw(cv, id, hex, progress) {
    const p = P[id] || (P[id] = await prep(id)), {w, h, base, lum, a, cl, refs, sm} = p;
    cv.width = w; cv.height = h; const x = cv.getContext('2d'), out = x.createImageData(w, h), d = base.data, o = out.data;
    const t = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    const lim = progress == null ? w + 1 : progress * w;
    for (let i = 0; i < w * h; i++) {
      const j = i * 4, al = (i % w) < lim ? a[i] : 0;
      if (al === 0) { o[j] = d[j]; o[j + 1] = d[j + 1]; o[j + 2] = d[j + 2]; o[j + 3] = 255; continue }
      // Luminanz bleibt (Schatten dunkler, Glanz heller), Glanzlichter nur als hellere Variante des Farbtons (max. 30 % Aufhellung), kein Weiss, keine Original-Restfarbe
      let k = lum[i] / Math.max(1, refs[cl[i]]); if (sm) k = Math.max(sm.lo, Math.min(sm.hi, k)); const kb = Math.min(k, 1.2), hl = Math.max(0, Math.min(.30, (k - 1.2)));
      for (let c = 0; c < 3; c++) { const v = Math.min(255, t[c] * kb * (1 - hl) + 255 * hl); o[j + c] = d[j + c] * (1 - al) + v * al }
      o[j + 3] = 255;
    }
    x.putImageData(out, 0, 0);
  }
  // abkleben(canvas, id, anteil 0..1): Original-Foto + Abdeckpapier und Kreppband an der Lackkante (von links nach rechts aufgeklebt)
  async function abkleben(cv, id, frac) {
    const p = P[id] || (P[id] = await prep(id)), t = await load('img/lack/' + id + '-abkleben.png');
    cv.width = p.w; cv.height = p.h; const x = cv.getContext('2d'); x.putImageData(p.base, 0, 0);
    const f = frac == null ? 1 : frac; x.save(); x.beginPath(); x.rect(0, 0, p.w * f, p.h); x.clip(); x.drawImage(t, 0, 0, p.w, p.h); x.restore();
  }
  return {draw, abkleben, ids: Object.keys(BASE)};
})();
