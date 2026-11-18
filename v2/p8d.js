'use strict';
// Paket 8 Teil D (Schrauberschule v3.0): MTX-Stil Großhubraum-Aufbau (Showbau), Eloxal-Schrauben, flache Sitzbank.
// Lädt NACH werkstatt2.js und freischalten.js. Ergänzt CAT/SLOTS/ORIGP, die Freischaltung steht in freischalten.js (MTXREQ, LKM).
// Alle Werte sind Spielwerte ("ca."), Quellen und Grenzen: MTX120-RECHERCHE.md, RECHERCHE-REALISMUS.md (Alltag/Optik).
// Rechnung MTX-Stil: V = (5,7 cm : 2)² · π · 5,1 cm = ca. 130,1 cm³. 30 PS : 1,36 = ca. 22 kW. Vmax ca. 120 km/h (Schätzung).
(function () {
  const MTXW = 'Nicht straßenzugelassen – Rennstrecke/Showbau, nur im Spiel. Echte Umbauten brauchen Fachwerkstatt und Abnahme.';
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (h, t, a) => '#' + hex(h).map((c, i) => Math.round(c + (t[i] - c) * a).toString(16).padStart(2, '0')).join('');
  const lighter = (h, a) => mix(h, [255, 255, 255], a), darker = (h, a) => mix(h, [0, 0, 0], a);

  // ---------- Eloxal-Schrauben (reine Optik, kein PS) ----------
  const SCOL = [
    {id: 'ss', n: 'Silber (original)', c: null},
    {id: 'sk', n: 'Schwarz', c: '#2a2d33'},
    {id: 'sb', n: 'Blau', c: '#1f6fe0'},
    {id: 'sh', n: 'Hellblau', c: '#4cc3ff'},
    {id: 'sr', n: 'Rot', c: '#e0262b'},
    {id: 'sv', n: 'Violett', c: '#8a3fe0'},
    {id: 'sp', n: 'Pink', c: '#ff4fa6'}
  ];
  const SC = {}; SCOL.forEach(s => SC[s.id] = s);
  CAT.schr = {n: 'Eloxal-Schrauben', en: 'anodised screws', opts: SCOL.map(s => ({
    id: s.id, n: s.c ? 'Alu-Schrauben ' + s.n + ' (eloxiert)' : 'Schrauben ' + s.n, tag: s.c ? 'Optik' : 'Original', price: s.c ? 15 : 0, col: s.c,
    info: s.c ? 'Nur Optik, kein PS: Schraubensatz für Motordeckel und Zylinder aus eloxiertem Alu, ca. 15 € (Spielwert nahe Händlerpreis). Vorsicht (Schätzung): Alu ist weicher als Stahl, nur mit ca. 3 Nm anziehen (Richtwert), an tragenden Teilen sind Stahlschrauben besser.' : 'Serie: verzinkte Stahlschrauben, silbern.'}))};
  // ---------- Sitzbank (kein PS-Effekt) ----------
  const SH = {sb0: 34, sf1: 13, sf2: 14, sf3: 14, sf4: 14, sf5: 14, sf6: 14};   // Polsterhöhe in Zeichnungseinheiten (nur Optik)
  CAT.sitz = {n: 'Sitzbank', en: 'seat', opts: [
    {id: 'sb0', n: 'Sitzbank Serie', tag: 'Original', price: 0, k: 1, info: 'Serien-Sitzbank mit dicker Polsterung. Bequem, aber höher.'},
    {id: 'sf1', n: 'Sitzbank flach, schwarz glatt', tag: 'Optik', price: 69.9, k: .38, info: 'Flache Tuning-Sitzbank, ca. 6 cm dick, mit Haken vorn und Gummipuffern hinten. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten (Beifahrer).'},
    {id: 'sf2', n: 'Sitzbank flach, längs gesteppt', tag: 'Optik', price: 79.9, k: .38, info: 'Flache Sitzbank mit Längsnähten. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten.'},
    {id: 'sf3', n: 'Sitzbank flach, Raute schwarz', tag: 'Optik', price: 84.9, k: .38, info: 'Flache Sitzbank mit Rautensteppung. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten.'},
    {id: 'sf4', n: 'Sitzbank flach, Raute braun', tag: 'Optik', price: 84.9, k: .38, info: 'Flache Sitzbank in braunem Kunstleder mit Raute. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten.'},
    {id: 'sf5', n: 'Sitzbank flach, Wabe schwarz/blau', tag: 'Optik', price: 89.9, k: .38, info: 'Flache Sitzbank mit Wabenmuster und blauer Naht. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten.'},
    {id: 'sf6', n: 'Sitzbank flach, Raute schwarz/rot', tag: 'Optik', price: 89.9, k: .38, info: 'Flache Sitzbank mit Raute und roter Naht. Nur Optik, kein PS. Preis geschätzt (Spielwert). Sitzplätze laut Papieren beachten.'}]};
  // ---------- MTX-Stil Großhubraum-Aufbau (höchste Tuning-Stufe) ----------
  CAT.zyl.opts.push({id: 'z130', n: 'MTX-Stil Großhubraum-Aufbau (ca. 130 cm³, Showbau)', tag: 'Showbau', bore: 57, hub: 51, kind: 'r', price: 179.9, psBase: 25.85, peak: 8700, wd: {o: 2700, s: 2300, r: 1800}, vk: .93,
    info: 'Bohrung 57 × Hub 51 mm = ca. 130 cm³ (Rechnung: 2,85² · π · 5,1). Spielwerte (Schätzung): ca. 30 PS (ca. 22 kW) bei ca. 8700/min, Vmax ca. 120 km/h. Braucht Rennvergaser 28 mm und Resonanzauspuff. ' + MTXW});
  CAT.verg.opts.push({id: 'v28', n: 'Rennvergaser 28 mm (Großhubraum)', tag: 'Showbau', size: 28, price: 89.9,
    info: 'Für ca. 100 bis 130 cm³, Hauptdüse ab ca. 125 (Schätzung). Sehr genaue Abstimmung nötig. ' + MTXW});
  SLOTS.push('schr', 'sitz'); ORIGP.schr = 'ss'; ORIGP.sitz = 'sb0';
  Object.keys(W2.cars || {}).forEach(k => { const c = W2.cars[k]; if (k !== 'klapp' && c && c.pick) { if (c.pick.sitz === 'sb1') c.pick.sitz = 'sf1'; if (c.pick.sitz === 'sb2') c.pick.sitz = 'sf2'; c.pick.schr = c.pick.schr || 'ss'; c.pick.sitz = c.pick.sitz || 'sb0' } });

  // ---------- Verläufe für die Schraubenköpfe (auch in die Prüfstand-Szene eingefügt, damit Video/Export die Farben mitnimmt) ----------
  const defsInner = () => SCOL.filter(s => s.c).map(s => `<radialGradient id="p8sc-${s.id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${lighter(s.c, .65)}"/><stop offset=".45" stop-color="${s.c}"/><stop offset="1" stop-color="${darker(s.c, .5)}"/></radialGradient>`).join('')
    + '<linearGradient id="p8seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a606b"/><stop offset=".35" stop-color="#2a2e35"/><stop offset="1" stop-color="#14161a"/></linearGradient>';
  const defsSvg = () => defsInner();
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + defsInner() + '</defs></svg>');

  function curPick() {
    try { if (view === 'pr') { const c = W2.cars[W2.sel]; return c && c.pick } if (W2.veh && W2.cars[W2.veh]) return W2.cars[W2.veh].pick } catch (e) {}
    return null;
  }
  const fillOf = (id, silver) => (id && SC[id] && SC[id].c) ? 'url(#p8sc-' + id + ')' : silver;
  const screwFill = () => { const p = curPick(); return fillOf(p && p.schr, 'url(#gChrome)') };
  const screwId = pick => (pick && pick.schr && SC[pick.schr]) ? pick.schr : 'ss';
  const seatK = pick => { const o = pick && pick.sitz && CAT.sitz.opts.find(x => x.id === pick.sitz); return o ? o.k : 1 };
  // Schraubenkopf mit Innensechskant für die Prüfstand-Zeichnung
  const screwEl = (x, y, r, pick) => { const id = screwId(pick), f = fillOf(id, 'url(#pst-ch)'); return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="#0b0f15" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="${(r * .36).toFixed(2)}" fill="#0b0f15" opacity=".6"/><circle cx="${(x - r * .3).toFixed(2)}" cy="${(y - r * .32).toFixed(2)}" r="${(r * .2).toFixed(2)}" fill="#fff" opacity="${id === 'ss' ? .5 : .7}"/>` };

  // ---------- Teilebilder ----------
  function schrArt(o) {
    const f = fillOf(o.id, 'url(#gChrome)'), head = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="#0007" stroke-width="1"/><polygon points="${[0, 1, 2, 3, 4, 5].map(i => (x + r * .5 * Math.cos(i * Math.PI / 3)).toFixed(1) + ',' + (y + r * .5 * Math.sin(i * Math.PI / 3)).toFixed(1)).join(' ')}" fill="#0b0f15" opacity=".75"/><path d="M${x - r * .7} ${y - r * .25} A${r * .78} ${r * .78} 0 0 1 ${x + r * .1} ${y - r * .76}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>`;
    let th = ''; for (let i = 0; i < 7; i++) th += `<line x1="62" x2="80" y1="${44 + i * 4}" y2="${42 + i * 4}" stroke="#0007" stroke-width="1"/>`;
    return `<g filter="url(#fSh)">${head(34, 38, 22)}${head(26, 76, 12)}${head(52, 80, 9)}<rect x="62" y="30" width="18" height="10" rx="2.5" fill="${f}" stroke="#0007"/><rect x="66" y="40" width="10" height="32" fill="url(#gChrome)"/>${th}</g>`;
  }
  function seatArt(o, w = 100, y0 = 66) {
    const h = SH[o.id] || 34, top = y0 - h, ref = y0 - SH.sb0;
    return `<g filter="url(#fSh)"><path d="M8 ${y0 + 1} C10 ${y0 - h * .92} 24 ${top} 42 ${top} L72 ${top + h * .2} C86 ${top + h * .32} 92 ${y0 - h * .35} 92 ${y0 + 1}Z" fill="url(#p8seat)" stroke="#000" stroke-width="1.2"/><path d="M14 ${y0 - h * .55} C20 ${top + 2} 32 ${top + 1} 44 ${top + 1.5}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>${o.id === 'sb2' ? `<path d="M16 ${y0 - 4} L84 ${y0 - 4}" stroke="${'#ff8a1f'}" stroke-width="1" stroke-dasharray="3 2.5" opacity=".8"/>` : ''}<rect x="4" y="${y0}" width="92" height="7" rx="2.5" fill="#8a95a1" stroke="#2b323b"/></g>${o.id !== 'sb0' ? `<line x1="4" x2="96" y1="${ref}" y2="${ref}" stroke="#ff8a1f" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/><text x="50" y="${ref - 3}" fill="#ffb066" font-size="8" text-anchor="middle">Serie</text>` : ''}`;
  }
  const art = (slot, o) => slot === 'schr' ? schrArt(o) : seatArt(o);

  // ---------- Zusätze im Teile-Shop, Prüfstand und bei der Abnahme ----------
  const REQL = {alle: 'Missionen insgesamt', mathe: 'Mathe-Missionen (85er Zylinder, Stufe 4)', nawi: 'NaWi-Missionen (Resonanzauspuff)', englisch: 'Englisch-Missionen (Vape-Zündung)'};
  const mtxState = () => { const rows = MTXREQ.map(([k, n]) => ({k, n, have: Math.min(n, doneIn(k))})), tot = rows.reduce((a, r) => a + r.n, 0), got = rows.reduce((a, r) => a + r.have, 0); return {rows, pct: Math.round(100 * got / tot), open: rows.every(r => r.have >= r.n)} };
  function progHtml() {
    const s = mtxState();
    return `<div class="card p8prog"><b>MTX-Stil: höchste Stufe (Showbau)</b>
    <div class="bar" style="margin:8px 0 6px"><i style="width:${Math.max(3, s.pct)}%"></i></div>
    <div class="m">${s.open ? '🔓 Freigeschaltet: Zylinder und Rennvergaser 28 mm stehen unten in ihren Reihen ganz rechts.' : '🔒 Fortschritt ' + s.pct + ' %. Freischaltung nur durch Lernen, alle Stufen davor zuerst:'}</div>
    <ul class="p8req">${s.rows.map(r => `<li class="${r.have >= r.n ? 'ok' : ''}"><span>${r.have >= r.n ? '✓' : '○'} ${REQL[r.k]}</span><b>${r.have} / ${r.n}</b></li>`).join('')}</ul>
    <button class="btn alt p8lern" onclick="start('p8-mtx-1')">Lernstoff: Hubraum nachrechnen</button>
    <p class="p8warn">${MTXW}</p></div>`;
  }
  function prevHtml(pick) {
    const sch = SC[screwId(pick)], sit = CAT.sitz.opts.find(x => x.id === (pick && pick.sitz)) || CAT.sitz.opts[0];
    return `<div class="card p8prev"><b>Vorschau Optik</b><svg viewBox="0 0 220 104" width="100%" role="img" aria-label="Vorschau Schrauben und Sitzbank"><svg x="0" y="0" width="104" height="104" viewBox="0 0 100 100">${ART.motor()}</svg><svg x="112" y="0" width="104" height="104" viewBox="0 0 100 100">${seatArt(sit)}</svg></svg>
    <div class="m">Schrauben: ${esc(sch.n)} · Sitzbank: ${esc(sit.n)}. Nur Optik, kein PS-Effekt.</div></div>`;
  }
  const ELOX = `<details class="card p8elox"><summary><b>Wie funktioniert Eloxieren?</b></summary><p class="m">Eloxieren heißt: Aluminium wird in einem Säurebad unter Strom oxidiert. An der Oberfläche wächst dabei aus dem Alu selbst eine harte <b>Oxidschicht</b> (Aluminiumoxid) mit winzigen Poren. In diese Poren kommt Farbstoff, danach werden sie verschlossen. Die Farbe sitzt also <b>in</b> der Schicht und ist kein Lack. Eloxal schützt vor Korrosion, macht aber Alu nicht stärker. <b>Vorsicht (Schätzung):</b> Alu-Schrauben sind weicher und weniger fest als Stahl, an tragenden Teilen sind Stahlschrauben besser.</p><button class="btn alt" onclick="start('p8-elox')">Lernstoff: Eloxieren</button></details>`;
  const banner = (cls) => `<p class="p8warn ${cls || ''}">⚠ ${MTXW}</p>`;

  function decorate() {
    try {
      const c = view === 'w2' ? (W2.veh && W2.cars[W2.veh]) : view === 'pr' ? W2.cars[W2.sel] : null;
      if (!c || !c.pick) return;
      const app = document.getElementById('app'), mtx = c.pick.zyl === 'z130';
      if (view === 'w2' && c.ph === 3 && !app.querySelector('.p8prog')) {   // Teile-Shop
        const live = app.querySelector('.card.live'); if (!live) return;
        live.insertAdjacentHTML('afterend', progHtml());
        const la = app.querySelector('.lay .la'); if (la && !la.querySelector('.p8prev')) la.insertAdjacentHTML('beforeend', prevHtml(c.pick));
        [...app.querySelectorAll('h2')].forEach(h => { if (/^Eloxal/.test(h.textContent) && h.nextElementSibling) h.nextElementSibling.insertAdjacentHTML('afterend', ELOX) });
        if (mtx) live.insertAdjacentHTML('beforeend', banner());
        return;
      }
      if (mtx && !app.querySelector('.p8warn')) {
        if (view === 'pr' || (view === 'w2' && c.ph === 5)) { const h = app.querySelector('.lb2'); if (h) h.insertAdjacentHTML('afterbegin', banner('p8top')) }
        else if (view === 'w2' && c.ph === 6) { const ce = app.querySelector('.cert'); if (ce) ce.insertAdjacentHTML('beforeend', banner()) }
      }
    } catch (e) { if (window.console) console.warn('p8d', e) }
  }
  const appEl = document.getElementById('app');
  if (appEl) new MutationObserver(decorate).observe(appEl, {childList: true});

  window.P8D = {art, screwFill, screwEl, screwId, seatK, defsSvg, SCOL, MTXW, decorate, mtxState};
  if (typeof view !== 'undefined' && (view === 'w2' || view === 'pr')) render();

  // ---------- Test-Hooks: #shot=p8-mtx-shop | p8-mtx-open | p8-mtx-pst | p8-schrauben | p8-schrauben-shop | p8-sitz | p8-sitz-shop ----------
  const hm = /shot=(p8-(?!lack|wasch)[\w-]+)/.exec(location.hash); if (!hm) return;
  const k = hm[1], T5 = {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r16', schr: 'ss', sitz: 'sb0'};
  const setup = () => {
    S.points = Math.max(S.points, 300); try { ROTX = true } catch (e) {}
    const all = k === 'p8-mtx-open' || k === 'p8-mtx-pst' || k === 'p8-schrauben' || k === 'p8-sitz';
    S.done = {}; const ms = MISSIONS.filter(m => !m.speech);
    if (all || /shop$/.test(k) && k !== 'p8-mtx-shop') ms.forEach(m => { S.done[m.id] = 1 });
    else { ['mathe', 'nawi', 'englisch', 'deutsch'].forEach((sj, i) => ms.filter(m => m.subject === sj).slice(0, [4, 3, 1, 4][i]).forEach(m => { S.done[m.id] = 1 })) }
    let pick = Object.assign({}, T5), ph = 3, id = 's51', v = 'w2';
    if (k === 'p8-mtx-open' || k === 'p8-mtx-pst') pick = {zyl: 'z130', verg: 'v28', aus: 'ar', zuend: 'ze', rit: 'r15', schr: k === 'p8-mtx-pst' ? 'sr' : 'sb', sitz: 'sf1'};
    if (k === 'p8-mtx-pst') { ph = 5; v = 'pr' }
    if (k === 'p8-schrauben') { pick = Object.assign({}, T5, {schr: 'sb', sitz: 'sf2'}); ph = 2 }
    if (k === 'p8-schrauben-shop') pick = Object.assign({}, T5, {schr: 'sp'});
    if (k === 'p8-sitz') { pick = Object.assign({}, T5, {sitz: 'sf1', schr: 'sh'}); ph = 5; v = 'pr' }
    if (k === 'p8-sitz-shop') pick = Object.assign({}, T5, {sitz: 'sf1'});
    W2.veh = v === 'pr' ? null : id; W2.sel = id;
    const c = W2.cars[id] = {ph, took: ph === 2 ? [] : BP.map(p => p.id), put: ph >= 5 ? BP.map(p => p.id) : [], pick, jet: 80, drove: ph >= 5, ran: ph >= 5};
    if (ph === 5) c.jet = w2perf(V2V[id], pick, 70).ideal;
    return {c, v, id};
  };
  const show = () => {
    const st = setup(), keep = JSON.parse(JSON.stringify(st.c));
    view = st.v; render();
    setTimeout(() => {
      W2.cars[st.id] = JSON.parse(JSON.stringify(keep)); W2.veh = st.v === 'pr' ? null : st.id; W2.sel = st.id; view = st.v;
      if (/^p8-(mtx-shop|mtx-open|schrauben-shop|sitz-shop)$/.test(k)) { W2.veh = st.id; render(); const pr = document.querySelector('.p8prog'), hs = document.querySelectorAll('.hscroll');
        if (k === 'p8-mtx-shop' || k === 'p8-mtx-open') { hs[0] && (hs[0].scrollLeft = 99999); hs[1] && (hs[1].scrollLeft = 99999); pr && pr.scrollIntoView(); window.scrollBy(0, -8) }
        if (k === 'p8-schrauben-shop') { const h = [...document.querySelectorAll('h2')].find(x => /^Eloxal/.test(x.textContent)); h && h.scrollIntoView(); window.scrollBy(0, -8) }
        if (k === 'p8-sitz-shop') { const h = [...document.querySelectorAll('h2')].find(x => /^Sitzbank/.test(x.textContent)); h && h.scrollIntoView(); window.scrollBy(0, -8) } return }
      if (st.v === 'pr') { render(); setTimeout(() => { W2.cars[st.id] = JSON.parse(JSON.stringify(keep)); const old = document.querySelector('.pst'); if (old) old.remove(); PST.shotAt(k === 'p8-sitz' ? 1.2 : 13.5) }, 150); return }
      render();
    }, 450);
  };
  setTimeout(show, 200);
})();
