'use strict';
// Garage im Design B-Blau (Karten, Rahmen, Licht). Bilder: v2/img/ki/garage-<name>.jpg, sonst v2/img/ki/<fahrzeug>.jpg, sonst das alte Bild, sonst Emoji.
const GIMG = {g1: 's51', g9: 'sr50', g6: 'schwalbe', g2: 'garage-rasentraktor', g3: 'garage-zt300', g4: 'garage-traktor-anhaenger', g5: 'garage-e512', g7: 'garage-unimog', g8: 'garage-feldhaecksler'};
const gSrc = g => 'v2/img/ki/' + GIMG[g.id] + '.jpg';
// Zuerst das neue Bild, bei Fehler das alte (g.img), bei Fehler das Emoji
const gPic = (g, cls = '') => `<img src="${gSrc(g)}" alt="${esc(g.name)}" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${g.img}'}else{this.outerHTML='<div class=em>${g.emoji}</div>'}">`;
function garage() {
  return `<div class="gdoor"><div><h1>Deine <b>Garage</b></h1><span class="chip">🪙 ${S.coins || 0}</span></div></div>
  <p class="m">Tippe auf ein Fahrzeug: starten, Gas geben, tanken, waschen und Experte werden. Mit Punkten aus den Missionen schaltest du neue Fahrzeuge frei.</p>
  <div class="gg">${GARAGE.map(g => { const lock = S.points < g.need, st = lock ? null : gst(g.id);
    return `<button class="gk ${lock ? 'lk' : ''}" onclick="openVeh('${g.id}')">${gPic(g)}${lock ? '<span class="pad">🔒</span>' : ''}<div class="gt"><b>${esc(g.name)}</b>${lock
      ? `<span class="m">noch ${g.need - S.points} Punkte</span><div class="bar"><i style="width:${Math.max(3, 100 * S.points / g.need)}%"></i></div>`
      : `<div class="gs"><span>🛣️ ${st.km} km</span><span>⛽ ${Math.round(st.fuel)} %</span>${st.best ? `<span>🏁 ${de(st.best, 1)} s</span>` : ''}${st.exp ? '<span>⭐ Experte</span>' : ''}${dueCount(VEH[g.id], st) ? '<span>🔧 Wartung</span>' : ''}</div>`}</div></button>`; }).join('')}</div>
  <h2>Das große Ziel</h2>` + projectView();
}
(function () {
  const ov = vehView; vehView = function () { let h = ov.apply(null, arguments); const g = GARAGE.find(x => x.id === G.id); if (g && GIMG[g.id]) h = h.replace(/<img id="vimg" src="[^"]*"/, `<img id="vimg" src="${gSrc(g)}"`).replace('onerror="this.remove()"', `onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${g.img}'}else{this.remove()}"`); return h };
})();
