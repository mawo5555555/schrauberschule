// Tuning für die Simsons (S51, SR50, Schwalbe): Teile mit Talern kaufen, selbst einbauen, Vergaser abstimmen, Prüfstand, Lackierung.
// Leistungswerte sind vereinfachte Beispielwerte fürs Spiel, keine Herstellerangaben.
if (S.coins === undefined) { S.coins = S.points; save() }
const PARTS = {
  zyl60: {slot: 'zyl', val: 60, icon: '🔩', name: '60er Zylinder-Kit', price: 120, info: 'Bohrung ca. 42 mm statt 38 mm: rund 60 cm³.'},
  zyl70: {slot: 'zyl', val: 70, icon: '🔩', name: '70er Zylinder-Kit', price: 220, info: 'Bohrung ca. 45 mm: rund 70 cm³. Braucht einen größeren Vergaser.'},
  verg19: {slot: 'verg', val: 19, icon: '🌀', name: '19er Vergaser', price: 90, info: 'Mehr Durchlass für Luft und Kraftstoff. Danach Düse abstimmen.'},
  aus: {slot: 'aus', val: 1, icon: '💨', name: 'Resonanzauspuff', price: 150, info: 'Mehr Leistung bei hoher Drehzahl, aber schmaleres Drehzahlband.'},
  luft: {slot: 'luft', val: 1, icon: '🌬️', name: 'Sportluftfilter', price: 40, info: 'Lässt mehr Luft durch. Etwas größere Düse nötig.'},
  zuend: {slot: 'zuend', val: 1, icon: '⚡', name: 'Elektronische Zündung', price: 110, info: 'Starker Funke, springt besser an, kein Unterbrecher mehr.'},
  ritp: {slot: 'rit', val: 1, icon: '⚙️', name: 'Ritzel +1 Zahn', price: 25, info: 'Mehr Endgeschwindigkeit, weniger Durchzug.'},
  ritm: {slot: 'rit', val: -1, icon: '⚙️', name: 'Ritzel −1 Zahn', price: 25, info: 'Mehr Durchzug, weniger Endgeschwindigkeit.'}
};
const ORIG = {zyl: 50, verg: 16, aus: 0, luft: 0, zuend: 0, rit: 0, duese: 70, hue: 0};
const COLORS = [[0, 'Original'], [195, 'Blau'], [95, 'Grün'], [320, 'Pink'], [255, 'Lila'], [150, 'Türkis']];
const tuneOf = st => { st.tune = Object.assign({}, ORIG, st.tune || {}); st.own = st.own || []; return st.tune };

function perf(t) {
  let ps = {50: 3.7, 60: 4.6, 70: 5.6}[t.zyl]; const note = [];
  if (t.verg === 19) ps *= t.zyl > 50 ? 1.08 : 1; else if (t.zyl === 70) { ps *= .88; note.push('Der 16er Vergaser ist für den 70er zu klein: Der Motor bekommt zu wenig Gemisch.') }
  if (t.aus) ps *= 1.15; if (t.luft) ps *= 1.03; if (t.zuend) ps *= 1.03;
  const ideal = Math.round((70 + (t.zyl - 50) * .9 + (t.verg === 19 ? 12 : 0) + (t.luft ? 4 : 0) + (t.aus ? 4 : 0)) / 2) * 2, d = t.duese - ideal;
  let kerze = 'rehbraun', lean = false;
  if (d < -4) { kerze = 'weiß'; lean = true; ps *= 1.02; note.push('Zu mager! Der Motor wird sehr heiß: Kolbenklemmer-Gefahr. Größere Hauptdüse einbauen.') }
  else if (d > 4) { kerze = 'schwarz'; ps *= Math.max(.7, 1 - (d - 4) * .025); note.push('Zu fett: Er qualmt, stottert und verliert Leistung. Kleinere Hauptdüse einbauen.') }
  const peak = 5500 + (t.aus ? 900 : 0) + (t.zyl - 50) * 15, width = t.aus ? 1500 : 2300, red = 7000 + (t.aus ? 800 : 0);
  const legal = t.zyl === 50 && !t.aus && t.verg === 16 && t.rit <= 0 && !t.luft;
  return {ps: Math.round(ps * 10) / 10, vmax: Math.round(60 * Math.sqrt(ps / 3.7) * (1 + t.rit * .06)), acc: ps / 3.7 / (1 + t.rit * .06), peak, width, red, ideal, d, kerze, lean, note, legal};
}
// Schaltspiel mit Tuning-Werten
function raceOf(v) {
  if (!v || v.kind !== '2t' || !G.id) return v.race; const p = perf(tuneOf(gst(G.id)));
  return {g: 4, vmax: p.vmax, idle: 1500, red: p.red, win: [p.peak - 200, Math.min(p.red - 150, p.peak + 800)], acc: p.acc, lean: p.lean};
}
const curve = (p, r) => p.ps * Math.exp(-Math.pow((r - p.peak) / p.width, 2));

VP.tune = (g, v, st) => {
  const t = tuneOf(st), p = perf(t), slots = {};
  Object.entries(PARTS).forEach(([k, x]) => (slots[x.slot] = slots[x.slot] || []).push(k));
  const row = k => partRow(k, st);
  return `<div class="row sp"><b>🏎️ Tuning-Werkstatt</b><span class="chip">🪙 ${S.coins} Taler</span></div>
  <div class="tstat"><div><b>${de(p.ps, 1)}</b><span>PS (ca.)</span></div><div><b>${p.vmax}</b><span>km/h</span></div><div><b>${t.zyl}</b><span>cm³</span></div><div><b>${p.legal ? '✅' : '⚠️'}</b><span>${p.legal ? 'Straße ok' : 'nur Privatgelände'}</span></div></div>
  ${p.legal ? '' : '<p class="m">⚠️ Mit diesen Teilen erlischt die Betriebserlaubnis. Auf die Straße darf sie nur mit Prüfung, Eintragung und passendem Führerschein. Im Spiel fährst du auf dem Prüfstand und der Rennstrecke.</p>'}
  <p class="m">Taler verdienst du mit Missionen, Werkstatt-Aufträgen und Experten-Quiz. Kaufen, dann baust du das Teil selbst ein.</p>
  ${Object.keys(slots).map(sl => slots[sl].map(row).join('')).join('')}
  <h2>Vergaser abstimmen</h2><p class="m">Die Hauptdüse bestimmt, wie viel Kraftstoff der Motor bekommt. Prüfe danach auf dem Prüfstand das Kerzenbild.</p>
  <div class="sld"><div class="row sp"><span>Hauptdüse</span><b id="dv">${t.duese}</b></div><input type="range" min="56" max="124" step="2" value="${t.duese}" oninput="$('#dv').textContent=this.value" onchange="tDuese(+this.value)"></div>
  <button class="btn" onclick="vPanel('dyno')">📈 Auf den Prüfstand</button>
  <h2>Lackierung</h2><div class="sw">${COLORS.map(c => `<button class="swc${t.hue === c[0] ? ' on' : ''}" style="--h:${c[0]}deg" onclick="tPaint(${c[0]})"><img src="${g.img}" alt=""><span>${c[1]}</span></button>`).join('')}</div><p class="m">Umlackieren kostet 30 Taler.</p>`;
};
VP.dyno = (g, v, st) => {
  const t = tuneOf(st), p = perf(t);
  return `<div class="row sp"><b>📈 Leistungsprüfstand</b><span class="m">Hauptdüse ${t.duese}</span></div><p class="m">Die Simson steht mit dem Hinterrad auf einer Rolle. Beim Lauf wird bei Vollgas die Leistung über der Drehzahl gemessen.</p>
  <svg viewBox="0 0 320 200" width="100%" id="dsvg">${dynoGrid()}${st.lastCurve ? `<polyline points="${st.lastCurve}" fill="none" stroke="#8e8e93" stroke-width="2" stroke-dasharray="4 3"/>` : ''}<polyline id="dl" points="" fill="none" stroke="var(--ac)" stroke-width="3" stroke-linejoin="round"/><circle id="dd" r="5" fill="#fff" cx="-10" cy="-10"/></svg>
  <div class="row sp"><span class="m">${st.lastCurve ? '- - - letzter Lauf' : ''}</span><b id="drpm">0 U/min</b></div><div id="dres"></div><button class="btn" id="dgo" onclick="dynoRun()">▶ Lauf starten</button><button class="btn alt" onclick="vPanel('tune')">Zurück zum Tuning</button>`;
};
const DX = r => 30 + (r - 2000) / 7000 * 280, DY = ps => 180 - ps / 9 * 165;
function dynoGrid() { let s = ''; for (let r = 2000; r <= 9000; r += 1000) s += `<line x1="${DX(r)}" y1="15" x2="${DX(r)}" y2="180" stroke="#2c2c2e"/><text x="${DX(r)}" y="195" fill="#8e8e93" font-size="9" text-anchor="middle">${r / 1000}</text>`;
  for (let ps = 0; ps <= 9; ps += 3) s += `<line x1="30" y1="${DY(ps)}" x2="310" y2="${DY(ps)}" stroke="#2c2c2e"/><text x="24" y="${DY(ps) + 3}" fill="#8e8e93" font-size="9" text-anchor="end">${ps}</text>`;
  return s + '<text x="310" y="10" fill="#8e8e93" font-size="9" text-anchor="end">PS über Drehzahl (1000 U/min)</text>' }
function dynoRun() {
  const v = VEH[G.id], st = gst(G.id), t = tuneOf(st), p = perf(t), pts = []; let r = 2000, best = 0, br = 0;
  $('#dgo').disabled = true; $('#dres').innerHTML = ''; if (!ENG) { ENG = engGraph(v); G.dyn = true }
  clearInterval(G.raf); G.raf = setInterval(() => {
    r += 70; const ps = curve(p, r); if (ps > best) { best = ps; br = r } pts.push(DX(r).toFixed(1) + ',' + DY(ps).toFixed(1));
    $('#dl').setAttribute('points', pts.join(' ')); $('#dd').setAttribute('cx', DX(r)); $('#dd').setAttribute('cy', DY(ps)); $('#drpm').textContent = Math.round(r / 10) * 10 + ' U/min'; engRpm(r, 1);
    if (r >= p.red) { clearInterval(G.raf); G.raf = 0; if (G.dyn && !G.on) { engKill(.8); G.dyn = false } else engRpm(v.race.idle, 0);
      st.lastCurve = pts.join(' '); save(); $('#dgo').disabled = false; $('#dgo').textContent = '▶ Nochmal messen';
      const col = {rehbraun: '#a0682e', 'weiß': '#e5e5ea', schwarz: '#111'}[p.kerze];
      $('#dres').innerHTML = `<div class="card" style="background:var(--card2)"><b style="font-size:20px">${de(best, 1)} PS bei ${Math.round(br / 100) * 100} U/min</b><p class="m">Endgeschwindigkeit ca. ${p.vmax} km/h · ${t.zyl} cm³</p>
        <div class="row" style="margin-top:8px"><span class="kz" style="background:${col}"></span><div><b>Kerzenbild: ${p.kerze}</b><div class="m">${p.kerze === 'rehbraun' ? 'Perfekt abgestimmt!' : p.kerze === 'weiß' ? 'zu mager' : 'zu fett'}</div></div></div>
        ${p.note.map(n => `<div class="fb ${p.kerze === 'rehbraun' ? '' : 'bad'}" style="margin:8px 0 0">${n}</div>`).join('')}</div>`;
      snd(p.kerze === 'rehbraun' ? 'ok' : 'bad'); }
  }, 30);
}
function tBuy(k) { const x = PARTS[k], st = gst(G.id); if (S.coins < x.price) return; S.coins -= x.price; st.own.push(k); save(); snd('ok');
  G.job = {k: 'part', slot: x.slot, steps: INSTALL[x.slot](x), i: 0, mist: 0, title: x.icon + ' Einbau: ' + x.name, after: () => { tuneOf(st)[x.slot] = x.val; save() }}; jStep() }
function tPut(k) { const x = PARTS[k], st = gst(G.id); tuneOf(st)[x.slot] = x.val; save(); tone(700, .08); vRe() }
function tOrig(sl) { const st = gst(G.id); tuneOf(st)[sl] = ORIG[sl]; save(); tone(400, .08); vRe() }
function tDuese(n) { const st = gst(G.id); tuneOf(st).duese = n; save() }
function tPaint(h) { const st = gst(G.id), t = tuneOf(st); if (t.hue === h) return; if (S.coins < 30) { toast('Dafür brauchst du 30 Taler.'); return }
  G.job = {k: 'paint', steps: [{t: 'mc', q: 'Bevor lackiert wird: Was machst du zuerst?', o: ['Abkleben, was keine Farbe bekommen soll, und anschleifen', 'Sofort drauflossprühen', 'Den Tank vollmachen', 'Die Reifen abbauen'], why: 'Auf angeschliffenem, sauberem Lack hält die neue Farbe.'},
    {t: 'hold', q: 'Halte gedrückt und sprühe in gleichmäßigen Bahnen. Lieber mehrere dünne Schichten als eine dicke.', ms: 3000, ico: '🎨', btn: 'Sprühen'}], i: 0, mist: 0, title: '🎨 Lackieren',
    after: () => { S.coins -= 30; tuneOf(st).hue = h; save(); if (window.ws3dPaint) ws3dPaint(h) }}; jStep() }
const INSTALL = {
  zyl: x => [{t: 'mc', q: 'Was muss vor dem Zylinderwechsel ab?', o: ['Auspuff, Vergaser und Zylinderkopf', 'nur der Tank', 'beide Räder', 'gar nichts'], why: ''},
    {t: 'turn', q: 'Löse die Zylinderkopfmuttern.', dir: -1, turns: 1.5, sw: 10},
    {t: 'mc', q: 'Auf dem neuen Kolben ist ein Pfeil. Wohin muss er zeigen?', o: ['zum Auslass (Auspuff)', 'zum Vergaser', 'nach oben', 'egal'], why: 'Nur so passen Kolbenringe und Kanäle richtig zusammen.'},
    {t: 'cross', q: 'Zylinderkopf aufsetzen. Die Muttern zieht man über Kreuz an, damit sich nichts verzieht. Tippe sie in der richtigen Reihenfolge an.'},
    {t: 'turn', q: `Jetzt mit dem Drehmomentschlüssel nachziehen (Beispielwert 18 Nm).`, dir: 1, turns: 1, sw: 10, tq: 18},
    {t: 'mc', q: `Der ${x.val}er ist drin. Wie fährt man ihn ein?`, o: ['erste paar hundert Kilometer ohne Vollgas, Drehzahl wechseln', 'sofort Vollgas', 'nur im Stand laufen lassen', 'gar nicht'], why: 'So passen sich Kolben und Zylinder in Ruhe aneinander an.'}],
  verg: () => [{t: 'turn', q: 'Löse die Schelle am Ansaugstutzen.', dir: -1, turns: 1, sw: 8},
    {t: 'hold', q: 'Alten Vergaser abziehen, Gas- und Chokezug umbauen, neuen aufstecken.', ms: 2200, ico: '🌀', btn: 'Umbauen'},
    {t: 'turn', q: 'Schelle wieder festziehen, nur handfest.', dir: 1, turns: 1, sw: 8, tq: false},
    {t: 'mc', q: 'Was musst du nach dem Vergaserwechsel unbedingt machen?', o: ['die Hauptdüse abstimmen und das Kerzenbild prüfen', 'nichts', 'die Reifen aufpumpen', 'die Kette kürzen'], why: 'Ein größerer Vergaser braucht meistens eine größere Hauptdüse.'}],
  aus: () => [{t: 'mc', q: 'Am Simson-Krümmer sitzt eine runde Überwurfmutter mit Kerben. Welches Werkzeug passt?', o: ['Hakenschlüssel', 'Schraubendreher', 'Rohrzange mit Gewalt', 'Hammer und Meißel'], why: 'Der Hakenschlüssel greift in die Kerben und rutscht nicht ab.'},
    {t: 'turn', q: 'Krümmermutter am Zylinder lösen.', dir: -1, turns: 2, sw: 'Haken'},
    {t: 'hold', q: 'Alten Auspuff abnehmen, neuen Resonanzauspuff mit neuer Dichtung ansetzen.', ms: 2200, ico: '💨', btn: 'Ansetzen'},
    {t: 'turn', q: 'Krümmermutter festziehen (Beispielwert 30 Nm).', dir: 1, turns: 2, sw: 'Haken', tq: 30},
    {t: 'mc', q: 'Was ändert ein Resonanzauspuff?', o: ['mehr Leistung oben herum, aber ein schmaleres Drehzahlband', 'weniger Lärm und mehr Kraft unten', 'gar nichts', 'der Tank wird größer'], why: 'Die Druckwelle im Auspuff schiebt Gemisch zurück in den Zylinder, aber nur in einem bestimmten Drehzahlbereich.'}],
  luft: () => [{t: 'turn', q: 'Deckel vom Luftfilterkasten lösen.', dir: -1, turns: 1, sw: 10},
    {t: 'hold', q: 'Sportluftfilter einsetzen.', ms: 1500, ico: '🌬️', btn: 'Einsetzen'},
    {t: 'mc', q: 'Der neue Filter lässt mehr Luft durch. Was muss man anpassen?', o: ['die Hauptdüse etwas größer', 'gar nichts', 'den Reifendruck', 'die Kettenspannung'], why: 'Mehr Luft braucht auch mehr Kraftstoff, sonst läuft er zu mager.'}],
  zuend: () => [{t: 'mc', q: 'Was machst du vor Arbeiten an der Zündung?', o: ['Zündung aus und Kerzenstecker ab', 'Motor laufen lassen', 'Tank voll machen', 'Licht anschalten'], why: ''},
    {t: 'turn', q: 'Polradmutter lösen.', dir: -1, turns: 1.5, sw: 17},
    {t: 'hold', q: 'Alte Grundplatte raus, neue Zündung einsetzen und Kabel anschließen.', ms: 2400, ico: '⚡', btn: 'Einbauen'},
    {t: 'turn', q: 'Polradmutter festziehen (Beispielwert 35 Nm).', dir: 1, turns: 1.5, sw: 17, tq: 35},
    {t: 'mc', q: 'Was stellt man nach dem Einbau ein?', o: ['den Zündzeitpunkt', 'den Reifendruck', 'den Spiegel', 'die Hupe'], why: 'Der Funke muss kurz vor dem oberen Totpunkt kommen.'}],
  rit: x => [{t: 'turn', q: 'Ritzelmutter lösen.', dir: -1, turns: 1, sw: 17},
    {t: 'hold', q: `Kette ab, Ritzel mit ${x.val > 0 ? 'einem Zahn mehr' : 'einem Zahn weniger'} aufstecken, Kette wieder drauf.`, ms: 2000, ico: '⚙️', btn: 'Tauschen'},
    {t: 'turn', q: 'Ritzelmutter festziehen (Beispielwert 30 Nm).', dir: 1, turns: 1, sw: 17, tq: 30},
    {t: 'mc', q: `${x.val > 0 ? 'Mehr' : 'Weniger'} Zähne am Ritzel vorne bedeuten …`, o: x.val > 0 ? ['mehr Endgeschwindigkeit, weniger Durchzug', 'mehr Durchzug, weniger Endgeschwindigkeit', 'mehr Hubraum', 'nichts'] : ['mehr Durchzug, weniger Endgeschwindigkeit', 'mehr Endgeschwindigkeit, weniger Durchzug', 'mehr Hubraum', 'nichts'], why: 'Die Übersetzung ändert sich: Zähne hinten durch Zähne vorne.'}]
};
// Muttern über Kreuz anziehen
JSTEP.cross = s => { G.cx = []; const P = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return `<div class="q" style="font-size:19px">${esc(s.q)}</div><div class="crs"><div class="crk"></div>${P.map((p, i) => `<button class="crn" id="cr${i}" style="left:${50 + p[0] * 32}%;top:${50 + p[1] * 32}%" onclick="crPick(${i})"></button>`).join('')}</div>` };
function crPick(i) { const c = G.cx, b = $('#cr' + i); if (c.includes(i)) return; const opp = k => (k + 2) % 4;
  const ok = c.length === 1 || c.length === 3 ? i === opp(c[c.length - 1]) : true;
  if (!ok) { G.job.mist++; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 450); jfb('bad', 'Nicht daneben! Über Kreuz heißt: als Nächstes die <b>gegenüberliegende</b> Mutter.'); snd('bad'); return }
  c.push(i); b.classList.add('ok'); b.textContent = c.length; tone(600 + c.length * 120, .08); jfb('', '');
  if (c.length === 4) { jfb('good', 'Sauber über Kreuz angezogen!'); snd('ok'); jNext(1000) } }

function partRow(k, st) { const t = tuneOf(st), x = PARTS[k], inst = t[x.slot] === x.val, own = st.own.includes(k);
  return `<div class="prow"><div class="dot" style="background:${inst ? '#30d15833' : 'var(--card2)'}">${x.icon}</div><div style="flex:1"><b>${x.name}</b><span class="m">${x.info}</span></div>
    ${inst ? `<button class="pbtn ok" onclick="tOrig('${x.slot}')">✓ drin<br><small>ausbauen</small></button>` : own ? `<button class="pbtn" onclick="tPut('${k}')">einbauen</button>` : `<button class="pbtn buy" ${S.coins < x.price ? 'disabled' : ''} onclick="tBuy('${k}')">${x.price} 🪙</button>`}</div>` }
