'use strict';
// Tuning-Teile als Fotoebenen auf dem S51-Foto (nur S51). Ebenen: img/ki/tune/<name>.webp (RGBA), Position in <name>-box.txt, Basisbild 955x1280.
// Teile ohne Ebene (Original, Zündung, Ritzel) bleiben unsichtbar. Beim Wechsel blendet die geänderte Ebene weich ein.
window.TuneFoto = (function () {
  const W = 955, H = 1280, D = 'v2/img/ki/tune/';
  const BOX = {sitz: [95, 396], aus: [62, 680], zyl: [510, 545], verg: [455, 575], schr: [440, 690]};
  const MAP = {
    sitz: {sf1: 'sitz-glatt', sf2: 'sitz-laengs', sf3: 'sitz-raute2', sf4: 'sitz-braun', sf5: 'sitz-wabe', sf6: 'sitz-rot'},
    aus: {as: 'aus-as', ar: 'aus-ar'},
    zyl: {z60: 'zyl-60', z70: 'zyl-a', z85: 'zyl-85', z130: 'zyl-130'},
    verg: {v19: 'verg-a', v24: 'verg-24', v28: 'verg-28'},
    schr: {sk: 'schr-schwarz', sb: 'schr-blau', sh: 'schr-hellblau', sr: 'schr-rot', sv: 'schr-violett', sp: 'schr-pink'}
  };
  const ORDER = ['aus', 'zyl', 'verg', 'schr', 'sitz'];
  function layers(pick) { const out = []; ORDER.forEach(s => { const f = pick && MAP[s][pick[s]]; if (f) out.push({slot: s, id: pick[s], url: D + f + '.webp'}) }); return out }
  function html(pick, fade) {
    const imgs = layers(pick).map(l => {
      const b = BOX[l.slot]; return `<img class="tfl${fade === l.slot ? ' tfin' : ''}" data-slot="${l.slot}" src="${l.url}" alt="" style="left:${(b[0] / W * 100).toFixed(3)}%;top:${(b[1] / H * 100).toFixed(3)}%">`;
    }).join('');
    return `<div class="car tunecar"><div class="tf"><img class="tfb" src="v2/img/ki/s51.jpg" alt="Simson S51">${imgs}</div></div>`;
  }
  // Layer-Breite aus der natürlichen Größe: Prozent von W
  function fit(root) {
    (root || document).querySelectorAll('.tfl').forEach(i => { const go = () => { i.style.width = (i.naturalWidth / W * 100).toFixed(3) + '%' }; if (i.complete && i.naturalWidth) go(); else i.addEventListener('load', go) });
  }
  const st = document.createElement('style');
  st.textContent = '.tunecar{aspect-ratio:955/1280!important;max-width:min(100%,calc(70vh*955/1280));margin:0 auto;background:#0c1626}body.land .lay .tunecar{height:calc(100vh - var(--top) - 90px)!important;max-width:none;width:auto}.tf{position:absolute;inset:0}.tf img{position:absolute;display:block}.tfb{left:0;top:0;width:100%;height:100%;object-fit:cover}.tfl{height:auto}.tfin{animation:tfin .7s ease-out both}@keyframes tfin{from{opacity:0;filter:brightness(1.6)}to{opacity:1;filter:none}}';
  document.head.appendChild(st);
  new MutationObserver(() => fit(document.getElementById('app'))).observe(document.getElementById('app'), {childList: true, subtree: true});
  return {html, layers, fit, MAP, BOX};
})();
