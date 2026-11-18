'use strict';
// Entwurf (nicht eingebaut): Waschen auf Foto-Paar img/wash/<id>-dreckig.jpg / -sauber.jpg (deckungsgleich).
// Reibt man mit Finger/Maus, wird die dreckige Schicht per Radierer entfernt und das saubere Foto erscheint.
// Die Live-App (wasch.js) nutzt dieselben Paare bereits automatisch.
window.WaschFoto = (function () {
  const load = s => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = s });
  async function mount(host, id) {
    const [d, s] = await Promise.all([load('img/wash/' + id + '-dreckig.jpg'), load('img/wash/' + id + '-sauber.jpg')]);
    host.innerHTML = ''; host.style.position = 'relative'; host.style.background = '#0b121c url(img/ki/werkstatt.jpg) center/cover'; // Foto statt CSS-Verlauf (.wz-bg), nur sichtbar bis Bild geladen
    const mk = (z) => { const c = document.createElement('canvas'); c.width = s.naturalWidth; c.height = s.naturalHeight; c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none'; c.style.zIndex = z; host.appendChild(c); return c };
    const cs = mk(1), cd = mk(2); cs.getContext('2d').drawImage(s, 0, 0);
    const x = cd.getContext('2d'); x.drawImage(d, 0, 0); host.style.aspectRatio = s.naturalWidth + '/' + s.naturalHeight;
    let down = false; const R = s.naturalWidth * .045;
    const pt = e => { const r = cd.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * cd.width, (e.clientY - r.top) / r.height * cd.height] };
    const wipe = e => { if (!down) return; const [px, py] = pt(e); x.globalCompositeOperation = 'destination-out'; const g = x.createRadialGradient(px, py, R * .3, px, py, R); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(px, py, R, 0, 7); x.fill() };
    cd.addEventListener('pointerdown', e => { down = true; cd.setPointerCapture(e.pointerId); wipe(e) }); cd.addEventListener('pointermove', wipe);
    addEventListener('pointerup', () => down = false);
    return {clean() { x.clearRect(0, 0, cd.width, cd.height) }, reset() { x.globalCompositeOperation = 'source-over'; x.drawImage(d, 0, 0) }};
  }
  return {mount};
})();
