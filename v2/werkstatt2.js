// V2 Schrauberschule: Fahrzeug holen, zerlegen, Teile wählen, einbauen, Prüfstand, Probefahrt, Abnahme.
// Zu jedem Schritt gehört eine Lernaufgabe (Mathe, Deutsch, Englisch, NaWi). Werte sind gerundete Richtwerte.
'use strict';
const V2V = {
  s51:  {id:'s51',  name:'Simson S51',   sub:'Mokick 1980–1991', key:'s51', ps:3.4, vmax:60, ccm:'49,9', bh:'38 × 44', text:'Der meistgebaute DDR-Mokick: luftgekühlter Einzylinder-Zweitakter, 49,9 cm³, Rohrrahmen.'},
  sr50: {id:'sr50', name:'Simson SR50',  sub:'Kleinroller 1987–1991', key:'sr50', ps:3.7, vmax:60, ccm:'49,9', bh:'38 × 44', text:'Der Roller mit Verkleidung: gleiche Motortechnik wie die S51, aber enger zum Schrauben.'},
  kr51: {id:'kr51', name:'Schwalbe KR51/2', sub:'Kleinroller, KR51/2 ca. 1980–1986 (Schwalbe-Reihe ab 1964)', key:'schwalbe', ps:3.7, vmax:60, ccm:'49,9', bh:'38 × 44', text:'Der Klassiker mit rundem Heck. Gleiche Motorfamilie wie die S51 (ca. 3,7 PS), dafür viel Charakter.'},
  s50:  {id:'s50',  name:'Simson S50',   sub:'Mokick 1975–1980', key:'s50', ps:3.6, vmax:60, ccm:'49,6', bh:'40 × 39,5', text:'Der Vorgänger der S51 mit flacherer Optik. Gleiche Grundtechnik, fast die gleiche Leistung (ca. 3,6 PS).'},
  star: {id:'star', name:'Simson Star (SR4-2)', sub:'Moped 1964–1975', key:'star', ps:3.4, vmax:60, ccm:'49,6', bh:'40 × 39,5', text:'Das Moped mit Rohrrahmen und Teleskopgabel: Zweitakter ca. 50 cm³, 3 Gänge. Leistung und Tempo hier als Spielwerte (ca.; der Star war zeitweise auf 50 km/h gedrosselt).'},
  duo:  {id:'duo',  name:'Simson Duo', sub:'Krankenfahrstuhl, drei Räder (ca.)', key:'duo', ps:3.6, vmax:60, ccm:'49,6', bh:'40 × 39,5', text:'Das Dreirad (Krankenfahrstuhl) für Menschen mit Gehbehinderung: Zweitakter ca. 50 cm³, ca. 4 Gänge. Leistung und Tempo hier als Spielwerte (ca.).'},
  habicht: {id:'habicht', name:'Simson Habicht', sub:'Moped 1971–1975', key:'habicht', ps:3.4, vmax:60, ccm:'49,6', bh:'40 × 39,5', text:'Das Moped aus der Zeit vor der S50: einfache Technik, ideal zum Lernen.'},
  klapp: {id:'klapp', name:'Mifa Klapprad', sub:'DDR-Klappfahrrad, 20 Zoll, ohne Motor', key:'klapprad', ps:0.1, vmax:20, klapp:1, text:'Das DDR-Klappfahrrad aus Sangerhausen (gebaut ab 1967): 20-Zoll-Räder, zusammenklappbar, ohne Motor. Hier treibt dich dein eigener Muskel an, gemessen in Watt. Alle Werte sind gerundete Spielwerte.'}
};
const CAT = {
  zyl: {n:'Zylinder', en:'cylinder', opts:[
    {id:'z50', n:'Original-Zylinder 50 cm³', tag:'Original', bore:38, kind:'o', price:0,     info:'Grauguss, 38 × 44 mm, ca. 49,9 cm³, ca. 3,4 PS (2,5 kW), andere Datenblätter bis 4 PS, bei ca. 5500/min (Katalogwerte schwanken). Eintragung: serienmäßig.'},
    {id:'z60', n:'60er Alu-Zylinder (ca. 58–61 cm³)', tag:'Tuning', bore:41, kind:'a', price:119.9, info:'Alu-Tuningzylinder (Händler-Sets), 41 × 44 mm = ca. 58 cm³ (verkauft als „60 ccm“, je nach Hersteller 41 bis 42 mm). Hauptdüse größer (Händler: ca. 75–85 bei 16 mm, ca. 95–110 bei 19/20 mm). Mit 19er Vergaser und Sport-/Resonanzauspuff grob 5 bis 7 PS (Spanne, Schätzung). Eintragungspflichtig.'},
    {id:'z70', n:'70er Tuning-Zylinder (ca. 70 cm³)', tag:'Tuning', bore:45, kind:'a', price:169.9, info:'45 × 44 mm = ca. 70 cm³. Am S51 ein Umbau mit Motorarbeit (Forum). Grob 6 bis 9 PS (Spanne, Schätzung). Größerer Vergaser und Düse nötig. Eintragungspflichtig.'},
    {id:'z85', n:'85er Renn-Zylinder (ca. 83–86 cm³)', tag:'Rennsport', bore:49, kind:'r', price:229.9, info:'49 × 44 mm = ca. 83 cm³ (Händlerangabe „85 ccm“ mit 49 mm Bohrung, andere Hersteller bis 50 mm), Rennsport. Mit 24er Vergaser, Resonanzauspuff und Vape grob 9 bis 12 PS (Spanne, Schätzung); eingetragen als Leichtkraftrad ca. 15 PS (Einzelbericht). Nur mit großem Vergaser, großer Düse und Resonanzauspuff. Nur Privatgelände.'}]},
  verg: {n:'Vergaser', en:'carburettor', opts:[
    {id:'v16', n:'BVF 16N3-4 (16 mm)', tag:'Original', size:16, price:0,    info:'Serienvergaser, Hauptdüse ab Werk ca. 67–72 (BVF-Herstellerdokument).'},
    {id:'v19', n:'BVF 19N1-11 Race (19 mm)', tag:'Tuning', size:19, price:119.9,  info:'Mehr Luft für 60 bis 70 cm³, Hauptdüse ca. 95–105 bei 19/20 mm (Händlerangabe). Eintragungspflichtig.'},
    {id:'v24', n:'Rennvergaser 24 mm', tag:'Rennsport', size:24, price:129.9, info:'Für 70 bis 85 cm³, Hauptdüse ab ca. 110 (Schätzung), braucht Abstimmung.'}]},
  aus: {n:'Auspuff', en:'exhaust', opts:[
    {id:'ao', n:'Original-Auspuff', tag:'Original', kind:'o', price:0, info:'Leise, breites Drehzahlband. Serie.'},
    {id:'as', n:'Sport-Auspuff', tag:'Tuning', kind:'s', price:89.9, info:'Weniger Gegendruck, etwas mehr Leistung. Eintragung nötig, wenn ohne Gutachten.'},
    {id:'ar', n:'Resonanz-Auspuff 32 mm', tag:'Rennsport', kind:'r', price:179.9, info:'Verschiebt das Drehzahlband nach oben, schmal, laut. Schätzung der Werte. Nur Privatgelände.'}]},
  zuend: {n:'Zündung', en:'ignition', opts:[
    {id:'zo', n:'Unterbrecher-Zündung 6 V', tag:'Original', kind:'o', price:0, info:'Serie, mechanischer Kontakt, muss gewartet werden.'},
    {id:'ze', n:'Elektronische Zündung 6 V', tag:'Tuning', kind:'e', price:109.9, info:'Kontaktlos (CDI-Typ), wartungsarm, springt besser an.'},
    {id:'zv', n:'Vape-Zündung 12 V', tag:'Tuning', kind:'e', price:179.9, info:'12-V-Umrüstung mit Batterie und Regler, hell, zuverlässig. 6-V-Lampen und Hupe vorher tauschen!'}]},
  rit: {n:'Ritzel', en:'sprocket', opts:[
    {id:'r14', n:'Ritzel 14 Zähne', tag:'Tuning', z:14, price:12.5, info:'Übersetzung ca. 34 : 14 = 2,43. Mehr Durchzug, weniger Endgeschwindigkeit.'},
    {id:'r15', n:'Ritzel 15 Zähne', tag:'Original', z:15, price:0, info:'Serie meist 15 Zähne, Kettenrad meist 34 Zähne: 34 : 15 = 2,27 (ca., bitte am Fahrzeug nachzählen).'},
    {id:'r16', n:'Ritzel 16 Zähne', tag:'Tuning', z:16, price:12.5, info:'ca. 34 : 16 = 2,13. Mehr Endgeschwindigkeit, weniger Durchzug.'},
    {id:'r17', n:'Ritzel 17 Zähne', tag:'Tuning', z:17, price:12.5, info:'ca. 34 : 17 = 2,00. Sehr lang übersetzt: nur mit viel Leistung sinnvoll.'}]}
};
const SLOTS = ['zyl', 'verg', 'aus', 'zuend', 'rit'];
const ORIGP = {zyl:'z50', verg:'v16', aus:'ao', zuend:'zo', rit:'r15'};
let BUDGET = 450;   // wird in freischalten.js aus dem Lernfortschritt berechnet
const PHOTO_CREDITS = ['S51: „Simson S51 B2-4 from 1980 original condition II“, Max schwalbe, CC BY-SA 4.0, Wikimedia Commons', 'SR50: „Simson SR50 1 CE“, Marcin Księżyk, CC BY-SA 3.0, Wikimedia Commons', 'Schwalbe KR51/2: „Simson Schwalbe KR51.2 N 1983 original II“, Max schwalbe, CC BY-SA 4.0, Wikimedia Commons', 'S50: „Simson S 50 B von 1978“, Max schwalbe, CC BY-SA 4.0, Wikimedia Commons', 'Habicht: „Habicht SR4-4“, Martin Jorgel, gemeinfrei, Wikimedia Commons'];
const opt = (slot, id) => CAT[slot].opts.find(o => o.id === id) || CAT[slot].opts.find(o => o.id === ORIGP[slot]) || CAT[slot].opts[0];   // Rückfall: alte Spielstände ohne Optik-Teile
const eu = n => (+n).toFixed(2).replace('.', ',') + ' €';
const ccmOf = (bore, hub) => Math.PI / 4 * Math.pow(bore / 10, 2) * (hub || 44) / 10;   // Standard-Hub 44 mm; MTX-Stil: 57 x 51 mm = ca. 130 cm³

// Leistungsmodell (Spiel): Hubraum, Vergaser-Passung, Auspuff, Zündung. Leistung ~ v³ (Luftwiderstand) für die Endgeschwindigkeit.
function w2perf(veh, pick, jet) {
  const z = opt('zyl', pick.zyl), v = opt('verg', pick.verg), a = opt('aus', pick.aus), r = opt('rit', pick.rit), zn = opt('zuend', pick.zuend);
  const ccm = ccmOf(z.bore, z.hub), idealCarb = ccm < 52 ? 16 : ccm < 65 ? 19 : ccm < 100 ? 24 : 28;
  let ps = z.psBase ? z.psBase * veh.ps / 3.4 : veh.ps * Math.pow(ccm / 49.9, 1.7);   // z.psBase: MTX-Stil (Spielwert, Schätzung)
  const notes = [];
  const ci = [16, 19, 24, 28], dc = ci.indexOf(v.size) - ci.indexOf(idealCarb);
  if (dc < 0) { ps *= 1 + dc * .08; notes.push('Der Vergaser ist zu klein: Der Motor bekommt zu wenig Gemisch.') }
  else if (dc > 0) { ps *= .96; notes.push('Der Vergaser ist größer als nötig: Das Ansprechen wird schlechter.') }
  if (z.psBase && a.kind !== 'r') { ps *= .8; notes.push('Der Großhubraum-Zylinder braucht den Resonanzauspuff: Ohne ihn fehlt viel Leistung.') }
  ps *= {o:1, s:1.07, r:1.16}[a.kind]; if (zn.kind === 'e') ps *= 1.03;
  const JT = {z50:{16:70,19:80,24:92,28:100}, z60:{16:80,19:98,24:110,28:118}, z70:{16:88,19:104,24:116,28:122}, z85:{16:94,19:110,24:126,28:130}, z130:{16:100,19:112,24:124,28:130}};
  const ideal = 2 * Math.round((JT[pick.zyl][v.size] + {o:0, s:2, r:5}[a.kind]) / 2), d = jet - ideal;
  let kerze = 'rehbraun'; if (d < -4) { kerze = 'weiß'; notes.push('Kerze weiß: zu mager, der Motor wird zu heiß. Kolbenklemmer-Gefahr!') } else if (d > 4) { kerze = 'schwarz'; ps *= Math.max(.75, 1 - (d - 4) * .02); notes.push('Kerze schwarz: zu fett, der Motor verliert Leistung.') }
  const peak = z.peak ? z.peak + {o:-1500, s:-700, r:0}[a.kind] : 5500 + (ccm - 50) * 20 + {o:0, s:400, r:900}[a.kind], width = (z.wd || {o:2400, s:2100, r:1500})[a.kind];   // z.peak/z.wd: MTX-Stil, Leistungsmaximum bei ca. 8700/min
  const gear = r.z / 15, vmax = Math.round(veh.vmax * gear * Math.pow(ps / veh.ps, 1 / 3) * (z.vk || 1));
  const legal = pick.zyl === 'z50' && pick.verg === 'v16' && pick.aus === 'ao' && pick.zuend === 'zo' && pick.rit === 'r15';
  const temp = Math.round(150 + (Math.min(ccm, 90) - 50) * 1.8 + {o:0, s:6, r:18}[a.kind] + (d < 0 ? -d * 7 : -d * 1.5)), tune = ['zyl', 'verg', 'aus', 'rit'].filter(k => pick[k] !== ORIGP[k]).concat(pick.zuend !== 'zo' ? ['zuend'] : []);
  if (temp > 230 && d < -4) notes.push('Zu heiß (ca. ' + temp + ' °C am Zylinder): Kolbenfresser droht.');
  return {temp, tune, ps: Math.round(ps * 10) / 10, ccm, vmax, peak: Math.round(peak / 100) * 100, width, kerze, ideal, notes, legal, gear, acc: 1 / gear * ps / veh.ps};
}
const curveSvg = (p, base, anim = true) => {
  const W = 320, H = 170, L = 34, B = 24, PM = Math.max(10, Math.ceil(Math.max(p.ps, base.ps) / 5) * 5), xs = r => L + (r - 2000) / 8000 * (W - L - 8), ys = ps => H - B - ps / PM * (H - B - 10);
  const f = (pk, pe, w) => { let d = ''; for (let r = 2000; r <= 10000; r += 250) { const x = Math.exp(-Math.pow((r - pk) / w, 2)); const v = pe * (.18 + .82 * x) * (r < 3000 ? (r - 1500) / 1500 : 1); d += (d ? 'L' : 'M') + xs(r).toFixed(1) + ' ' + ys(Math.max(0, v)).toFixed(1) } return d };
  let g = ''; for (let i = 0; i <= PM - 1; i += PM / 5) g += `<line x1="${L}" x2="${W - 8}" y1="${ys(i)}" y2="${ys(i)}" stroke="#fff" opacity=".1"/><text x="${L - 6}" y="${ys(i) + 4}" fill="#9a9aa2" font-size="10" text-anchor="end">${Math.round(i)}</text>`;
  for (let r = 2000; r <= 10000; r += 2000) g += `<text x="${xs(r)}" y="${H - 8}" fill="#9a9aa2" font-size="10" text-anchor="middle">${r / 1000}k</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%"><rect width="${W}" height="${H}" rx="14" fill="#0e1014"/>${g}<text x="8" y="14" fill="#9a9aa2" font-size="10">PS (Leistung) über U/min (Drehzahl)</text>
  <path d="${f(base.peak, base.ps, base.width)}" stroke="#7d818a" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  <path class="${anim ? 'draw' : ''}" d="${f(p.peak, p.ps, p.width)}" stroke="var(--a)" stroke-width="3.5" fill="none" stroke-linecap="round" pathLength="1"/>
  <circle cx="${xs(p.peak)}" cy="${ys(p.ps)}" r="5" fill="var(--a)"/><text x="${xs(p.peak)}" y="${ys(p.ps) - 10}" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${String(p.ps).replace('.', ',')} PS</text></svg>`;
};

// ---- Zustand
const V2ORDER = ['s51', 'kr51', 'sr50', 's50', 'habicht', 'star', 'duo', 'klapp'];
const KORIG = {licht:'ld', hupe:'hk', gepaeck:'gt', reifen:'rm', kette:'k44', ritzel:'q16', zub:'zn', motor:'m0'};   // Klapprad: Serienzustand (siehe klapprad.js)
const W2 = S.w2 = Object.assign({veh: null, orders: 0, cars: {}, garage: [], album: [], players: [], player: '', sel: 's51'}, S.w2 || {});
// Alte Spielstände (z. B. mit „s70“ oder anderen entfernten Modellen) bereinigen, ohne Fehler
(function () {
  try {
    if (!V2V[W2.veh]) W2.veh = null; if (!V2V[W2.sel]) W2.sel = 's51';
    if (!W2.cars || typeof W2.cars !== 'object') W2.cars = {}; Object.keys(W2.cars).forEach(k => { if (!V2V[k] || !W2.cars[k] || !Array.isArray(W2.cars[k].took)) delete W2.cars[k] });
    ['garage', 'album', 'players'].forEach(k => { if (!Array.isArray(W2[k])) W2[k] = [] });
    W2.garage = W2.garage.filter(g => g && typeof g === 'object');
  } catch (e) { W2.veh = null; W2.cars = {} }
})();
const car = () => { const id = W2.veh; if (!id) return null; return W2.cars[id] = W2.cars[id] || {ph: 1, took: [], put: [], pick: Object.assign({}, id === 'klapp' ? KORIG : ORIGP), jet: id === 'klapp' ? 30 : 70, drove: false, cert: null} };
const veh = () => V2V[W2.veh];
const w2save = () => { S.w2 = W2; save() };
const PH = ['Auswahl', 'Auftrag', 'Zerlegen', 'Teile wählen', 'Einbauen', 'Prüfstand', 'Abnahme'];
const phBar = ph => `<div class="phbar">${PH.slice(1).map((n, i) => `<div class="${i + 1 < ph ? 'ok' : i + 1 === ph ? 'on' : ''}"><i>${i + 1 < ph ? '✓' : i + 1}</i><span>${n}</span></div>`).join('')}</div>`;

// ---- Teilebild (Foto aus v2/img/teile/<id>.png, sonst SVG)
const partArt = (slot, o) => (slot === 'schr' || slot === 'sitz') && window.P8D ? P8D.art(slot, o) : slot === 'zyl' ? ART.cyl(o.kind, o.bore) : slot === 'verg' ? ART.verg(o.size) : slot === 'aus' ? ART.aus(o.kind) : slot === 'zuend' ? ART.polrad(o.kind === 'e' ? 'e' : 'o') : ART.ritzel(o.z);
const partImg = (slot, o) => { const t = teilBild(o.id); return `<div class="pimg">${t ? `<img src="${t}" alt="">` : ''}${ART.svg(partArt(slot, o))}</div>` };
const SLOTPIC = {zyl: 'zylinder', verg: 'vergaser', aus: 'auspuff'};
// ---- Werkbank-Szene
const BP = [
  {id:'kerze', n:'Zündkerze', en:'spark plug', x:155, y:6, s:50, need:null, fact:'Die Zündkerze zündet das Gemisch. Ihr Kerzenbild verrät, ob die Düse passt.'},
  {id:'kopf', n:'Zylinderkopf', en:'cylinder head', x:141, y:52, s:78, need:'kerze', fact:'Der Kopf schließt den Brennraum oben ab und hat Kühlrippen.'},
  {id:'zyl', n:'Zylinder', en:'cylinder', x:134, y:118, s:92, need:'kopf', fact:'Im Zylinder läuft der Kolben. Die Bohrung bestimmt den Hubraum.'},
  {id:'kolben', n:'Kolben', en:'piston', x:148, y:206, s:64, need:'zyl', fact:'Der Kolben verdichtet das Gemisch und wird vom Zünddruck nach unten gedrückt.'},
  {id:'verg', n:'Vergaser', en:'carburettor', x:6, y:196, s:96, need:null, fact:'Der Vergaser mischt Luft und Benzin. Die Hauptdüse bestimmt, wie viel Benzin kommt.'},
  {id:'aus', n:'Auspuff', en:'exhaust', x:258, y:130, s:100, need:null, fact:'Der Auspuff leitet Abgas ab und nutzt Druckwellen.'},
  {id:'zuend', n:'Zündung (Polrad)', en:'ignition', x:14, y:292, s:82, need:null, fact:'Das Polrad erzeugt Strom und steuert den Zündzeitpunkt.'},
  {id:'rit', n:'Ritzel', en:'sprocket', x:268, y:300, s:76, need:null, fact:'Das Ritzel treibt die Kette. Mehr Zähne: mehr Endgeschwindigkeit.'}
];
// Foto-Teile: [x, y, Breite, Höhe] in Szene-Einheiten; Größenverhältnisse nach echten Maßen (Kerze M14 ca. 20x65 mm, Kopf ca. 80, Zylinder ca. 90, Kolben 40, Vergaser 55x80, Polrad ca. 100, Ritzel ca. 55 mm)
const MOTORFOTO = {kerze: [166, 10, 22, 60], kopf: [143, 62, 76, 80], zyl: [138, 132, 86, 96], kolben: [160, 226, 42, 47], verg: [24, 200, 56, 84], zuend: [6, 296, 92, 92], aus: [262, 150, 70, 110], rit: [276, 316, 56, 56]};
function partOf(id, c) {
  if (id === 'kerze') return ART.kerze(c.kerzeTone || 'rehbraun'); if (id === 'kopf') return ART.kopf(); if (id === 'kolben') return ART.kolben();
  const o = opt(id, c.pick[id]); return partArt(id, o);
}
function board(c, mode) {
  const present = id => mode === 'view' || (mode === 'dis' ? !c.took.includes(id) : c.put.includes(id));
  const canDis = p => !p.need || c.took.includes(p.need), canAsm = p => !p.need2 || c.put.includes(p.need2);
  const need2 = {kolben:null, zyl:'kolben', kopf:'zyl', kerze:'kopf'};
  let s = `<svg viewBox="0 0 360 420" width="100%" class="bsvg"><defs><pattern id="peg" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.4" fill="#000" opacity=".55"/></pattern><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31363f"/><stop offset="1" stop-color="#1b1e24"/></linearGradient><linearGradient id="bench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a2b"/><stop offset=".08" stop-color="#8b6338"/><stop offset="1" stop-color="#4b3220"/></linearGradient><radialGradient id="spot" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#ffe9b8" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
  <rect width="360" height="420" fill="url(#wall)"/><rect width="360" height="420" fill="url(#peg)" opacity=".6"/><rect y="388" width="360" height="32" fill="url(#bench)"/><rect y="386" width="360" height="4" fill="#2a1b10"/><ellipse cx="180" cy="190" rx="190" ry="210" fill="url(#spot)"/>`;
  // Kurbelgehäuse
  s += `<image href="v2/img/motor/gehaeuse.webp" x="118" y="262" width="124" height="130" preserveAspectRatio="xMidYMax meet"/>`;
  BP.forEach(p => {
    const on = present(p.id), nd = mode === 'dis' ? canDis(p) : (need2[p.id] ? c.put.includes(need2[p.id]) : true);
    if (on) s += `<g class="bp ${mode !== 'view' && nd ? 'go' : ''} ${mode === 'asm' && W2.last === p.id ? 'in' : ''}" data-id="${p.id}" onclick="w2Tap('${p.id}')">${MOTORFOTO[p.id] ? `<image href="v2/img/motor/${p.id}.webp" x="${MOTORFOTO[p.id][0]}" y="${MOTORFOTO[p.id][1]}" width="${MOTORFOTO[p.id][2]}" height="${MOTORFOTO[p.id][3]}" preserveAspectRatio="xMidYMid meet"/>` : `<svg x="${p.x}" y="${p.y}" width="${p.s}" height="${p.s}" viewBox="0 0 100 100" overflow="visible">${partOf(p.id, c)}</svg>`}</g>`;
    else if (mode === 'asm') s += `<g class="ghost ${nd ? 'go' : ''}" onclick="w2Tap('${p.id}')"><rect x="${p.x}" y="${p.y + p.s * .1}" width="${p.s}" height="${p.s * .8}" rx="10" fill="rgba(255,138,31,.07)" stroke="var(--a)" stroke-dasharray="5 4" opacity="${nd ? .9 : .3}"/><text x="${p.x + p.s / 2}" y="${p.y + p.s / 2 + 4}" fill="#ffb066" font-size="10" text-anchor="middle" opacity="${nd ? 1 : .4}">${p.n.split(' ')[0]}</text></g>`;
  });
  return s + '</svg>';
}
const tray = (c, mode) => {
  const ids = mode === 'dis' ? c.took : BP.map(p => p.id).filter(i => !c.put.includes(i));
  return `<div class="tray"><b>${mode === 'dis' ? 'Auf dem Werktisch' : 'Noch einzubauen'}</b><div>${ids.length ? ids.map(i => { const p = BP.find(x => x.id === i); return `<button class="chip2" ${mode === 'asm' ? `onclick="w2Tap('${i}')"` : ''}><span class="tm">${MOTORFOTO[i] ? `<img src="v2/img/motor/${i}.webp" alt="" style="width:100%;height:100%;object-fit:contain">` : ART.svg(partOf(i, c))}</span>${p.n}<small>${p.en}</small></button>` }).join('') : '<span class="m">noch nichts</span>'}</div></div>`;
};

const ps1 = x => String(x).replace('.', ',');
const carPic = (v, roller = true) => (v.key === 's51' && window.TuneFoto && view === 'w2' && W2.veh === 's51' && car() && car().ph === 3) ? TuneFoto.html(car().pick, W2.fade) : `<div class="car">${pic(v.key, '', v.name)}${roller ? '<div class="roller"></div>' : ''}</div>`;
const statBar = (l, val, pct, col) => `<div class="stat"><div><span>${l}</span><b>${val}</b></div><div class="bar"><i style="width:${Math.max(3, Math.min(100, pct))}%;${col ? `background:${col}!important;box-shadow:0 0 10px ${col}` : ''}"></i></div></div>`;
const videoBtn = (id = '') => `<button class="btn vid" id="${id}" onclick="videoShare()"><span class="vi">🎬</span> Video teilen<small>Dein Prüfstandslauf als Clip</small></button>`;

// ---- Hauptansicht
function w2View() {
  const c = car(), v = veh();
  if (!v) return w2Select();
  if (c.ph === 1) return w2Auftrag(c, v);
  if (c.ph === 2) return w2Dis(c, v);
  if (c.ph === 3) return w2Shop(c, v);
  if (c.ph === 4) return w2Asm(c, v);
  if (c.ph === 5) return w2Dyno(c, v);
  return w2Cert(c, v);
}
const w2Head = (t, c) => `<div class="nav"><button class="back" onclick="w2Home()" aria-label="Zurück">‹</button><b>${t}</b><span class="chip" style="margin-left:auto">🔧 ${W2.orders} Aufträge</span></div>${c ? phBar(c.ph) : ''}${c ? jobTools() : ''}`;
const jobTools = () => { const id = W2.veh; if (!id) return ''; return `<div class="lk-btn jobtools wzd"><button class="lk-ghost" onclick="window.LACK&&LACK.open('${id}')">🎨 Lackieren</button><button class="lk-ghost wz-btn" onclick="window.WASCH&&WASCH.open('${id}')">🧽 Waschen</button></div>` };
let rankW2 = () => W2.orders >= 6 ? 'Werkstattmeister' : W2.orders >= 3 ? 'Tuner' : W2.orders >= 1 ? 'Geselle' : 'Azubi';
function w2Home() { W2.veh = null; w2save(); go('w2') }
function w2Sel(id) { W2.sel = id; w2save(); const y = window.scrollY; $('#app').innerHTML = (view === 'pr' && typeof w2Pr === 'function') ? w2Pr() : w2View(); window.scrollTo(0, y) }
function w2Select() {
  const v = V2V[W2.sel] || V2V.s51, c = W2.cars[v.id], run2 = c && c.ph > 1;
  return `<div class="hud"><span class="pill">${rankW2()}</span><span class="pill">🔧 ${W2.orders} Aufträge</span><span class="pill" style="margin-left:auto">Budget ${BUDGET} €</span></div>
  <div class="mods">${V2ORDER.map(k => `<button class="${k === v.id ? 's' : ''}" onclick="w2Sel('${k}')">${V2V[k].name.replace('Simson ', '').replace(' (SR4-2)', '').replace('Schwalbe KR51/2', 'Schwalbe')}</button>`).join('')}</div>
  <div class="lay"><div class="la">${carPic(v)}</div><div class="lb2">
  <h1 style="margin-top:10px">${v.name}</h1><div class="m">${v.sub}</div><p class="m">${v.text}</p>
  ${statBar('Leistung (Serie)', 'ca. ' + ps1(v.ps) + ' PS', v.ps / 12 * 100)}${statBar('Höchstgeschwindigkeit', 'ca. ' + v.vmax + ' km/h', v.vmax)}
  <div class="m">${run2 ? 'Auftrag läuft: Schritt ' + Math.min(c.ph, 6) + ' von 6' : 'Neuer Auftrag'}</div>
  ${(v.id !== 's51' && !run2) ? '<div class="lkcard">🔧 Tuning für dieses Modell kommt später. Du kannst es schon lackieren, waschen und auf dem Prüfstand testen.</div><button class="btn" disabled>Tuning kommt später</button>' : `<button class="btn" onclick="w2Pick('${v.id}')">${run2 ? 'Auftrag fortsetzen' : 'Auftrag annehmen'}</button>`}</div></div>
  <p class="m">Zerlegen, Teile wählen, einbauen, Prüfstand, Abnahme. Zu jedem Schritt gibt es Aufgaben aus Mathe, Deutsch, Englisch und NaWi.</p>
  <h2>Deine Sachen</h2><div class="fgrid"><button class="fc" onclick="go('gal')"><i>Garage-Galerie</i><b>${W2.garage.length} Umbauten</b></button><button class="fc" onclick="go('alb')"><i>Kartenalbum</i><b>${W2.album.length} Karten</b></button><button class="fc" onclick="go('lbd')"><i>Familien-Bestenliste</i><b>${W2.players.length || 1} Spieler</b></button><button class="fc" onclick="startMix()"><i>Mix-Training</i><b>8 gemischte Aufgaben</b></button><button class="fc" onclick="go('hub')"><i>Missionen und Werkzeug</i><b>Fehlersuche, Kunden, Tagesauftrag</b></button></div>
  ${W2.garage.length ? `<h2>Fertige Aufbauten</h2>${W2.garage.slice(-3).reverse().map(g => `<div class="item"><div class="dot" style="background:rgba(var(--ar),.18)">🏁</div><div><b>${esc(g.name)}</b><span class="m">${g.ccm} cm³ · ${ps1(g.ps)} PS · ${g.vmax} km/h · ${g.date}</span></div></div>`).join('')}` : ''}
  <details class="card"><summary><b>Bildnachweis (Fotos)</b></summary><p class="m">${PHOTO_CREDITS.map(c => esc(c)).join('<br>')}</p></details>`;
}
function w2Pick(id) { W2.veh = id; W2.sel = id; car(); w2save(); go('w2') }

function w2Auftrag(c, v) {
  return w2Head('Auftrag', c) + `<div class="lay"><div class="la">${carPic(v, false)}</div><div class="lb2">
  <div class="card"><b>Auftragskarte</b><p>Kunde: Herr Krause. „Meine ${v.name} läuft gut, aber ich will mehr Leistung. Ich habe <b>${BUDGET} €</b> für Teile. Bitte baut sie so um, dass sie sauber läuft und der Motor nicht kaputtgeht.“</p>
  <p class="m">Dein Ziel: Mehr Leistung ohne Kolbenklemmer. Plane die Teile so, dass sie zusammenpassen: Zylinder, Vergaser, Auspuff, Zündung, Übersetzung.</p></div>
  <div class="card"><b>Steckbrief (Serie)</b><div class="spec">${v.klapp ? '' : `<div><span>Hubraum</span><b>ca. ${v.ccm} cm³</b></div><div><span>Bohrung × Hub</span><b>ca. ${v.bh} mm</b></div>`}<div><span>Leistung</span><b>ca. ${ps1(v.ps)} PS</b></div><div><span>Höchstgeschw.</span><b>ca. ${v.vmax} km/h</b></div></div><p class="m">Rund- und Richtwerte (ca.). Die Spielwerte im Prüfstand sind vereinfacht.</p></div>
  <button class="btn" onclick="w2Mission(1)">Auftrag annehmen (Aufgaben)</button></div></div>`;
}
function w2Dis(c, v) {
  const done = c.took.length === BP.length;
  return w2Head('Zerlegen', c) + `${rotHint()}<div class="lay"><div class="la"><div class="board">${board(c, 'dis')}</div></div><div class="lb2"><p class="m">Tippe die Teile in sinnvoller Reihenfolge an. Erst die Kerze, dann Kopf, Zylinder, Kolben. Die anderen Teile kannst du jederzeit abbauen. <b>Motor aus und kalt!</b></p>${tray(c, 'dis')}
  <button class="btn" ${done ? '' : 'disabled'} onclick="w2Mission(2)">${done ? 'Alles zerlegt: Aufgaben' : 'Noch ' + (BP.length - c.took.length) + ' Teile'}</button></div></div>`;
}
function w2Tap(id) {
  const c = car(), p = BP.find(x => x.id === id), mode = c.ph === 2 ? 'dis' : 'asm';
  const el = document.querySelector(`.bp[data-id="${id}"],.ghost[data-id="${id}"]`);
  if (mode === 'dis') {
    if (c.took.includes(id)) return;
    if (p.need && !c.took.includes(p.need)) { toast('Erst ' + BP.find(x => x.id === p.need).n + ' abbauen.'); return }
    c.took.push(id); FX.ratchet(); FX.burstAt(el, 14); if (el) el.classList.add('out'); toast(p.n + ' (' + p.en + '): ' + p.fact); w2save();
    setTimeout(() => { if (view === 'w2') $('#app').innerHTML = w2View() }, 480);
  } else {
    if (c.put.includes(id)) return; const need = {zyl: 'kolben', kopf: 'zyl', kerze: 'kopf'}[id];
    if (need && !c.put.includes(need)) { toast('Erst ' + BP.find(x => x.id === need).n + ' einbauen.'); return }
    c.put.push(id); W2.last = id; FX.clink(); FX.air(); toast(p.n + ' sitzt. Schrauben über Kreuz festziehen.'); w2save();
    $('#app').innerHTML = w2View(); const n = document.querySelector(`.bp[data-id="${id}"]`); FX.burstAt(n, 12); W2.last = null;
  }
}

function w2Shop(c, v) {
  const sp = SLOTS.reduce((a, s) => a + opt(s, c.pick[s]).price, 0), p = w2perf(v, c.pick, 70), over = sp > BUDGET + 1e-9;
  return w2Head('Teile wählen', c) + `<div class="lay"><div class="la">${carPic(v)}${statBar('Leistung', ps1(p.ps) + ' PS', p.ps / 12 * 100)}${statBar('Kosten', eu(sp) + ' / ' + BUDGET + ' €', sp / BUDGET * 100, over ? '#ff453a' : 'var(--g)')}</div><div class="lb2">
  <div class="card live"><div class="spec"><div><span>Hubraum</span><b>${ps1(p.ccm.toFixed(1))} cm³</b></div><div><span>Leistung (ca.)</span><b>${ps1(p.ps)} PS</b></div><div><span>Höchstgeschw. (ca.)</span><b>${p.vmax} km/h</b></div></div>
  ${p.notes.length ? `<p class="warn">${esc(p.notes[0])}</p>` : '<p class="m">Die Teile passen zusammen.</p>'}${!p.legal ? `<p class="m">⚠ Eintragungspflichtig: ${p.tune.map(k => CAT[k].n).join(', ')}. Ohne Prüfung und Eintragung erlischt die Betriebserlaubnis (Bußgeld, Versicherung). Ohne Eintragung nur auf Privatgelände oder Rennstrecke.</p>` : ''}<div class="m">${over ? 'Über dem Budget: Wähle günstigere Teile.' : 'Noch ' + eu(BUDGET - sp) + ' frei.'}</div></div>
  ${SLOTS.map(s => `<h2>${CAT[s].n} · ${CAT[s].en}</h2><div class="hscroll">${CAT[s].opts.map(o => `<button class="opt2 ${c.pick[s] === o.id ? 'sel' : ''}" onclick="w2Choose('${s}','${o.id}')"><span class="tag ${o.tag === 'Original' ? 'to' : o.tag === 'Tuning' || o.tag === 'Optik' ? 'tt' : 'tr'}">${o.tag}</span>${partImg(s, o)}<b>${o.n}</b><span class="pr">${o.price ? eu(o.price) : 'ist verbaut'}</span><span class="m">${o.info}</span></button>`).join('')}</div>`).join('')}
  <p class="m">Preise und Werte sind gerundete Beispiele zum Rechnen, keine Angebote.</p>
  <button class="btn" ${over ? 'disabled' : ''} onclick="w2Mission(3)">${over ? 'Budget überschritten' : 'Teile bestellen (Aufgaben)'}</button></div></div>`;
}
function w2Choose(slot, id) { const c = car(); c.pick[slot] = id; W2.fade = slot; w2save(); FX.clink(); const y = window.scrollY, hs = [...document.querySelectorAll('.hscroll')].map(h => h.scrollLeft); $('#app').innerHTML = w2View(); document.querySelectorAll('.hscroll').forEach((h, i) => h.scrollLeft = hs[i] || 0); window.scrollTo(0, y); W2.fade = null }

function w2Asm(c, v) {
  const done = c.put.length === BP.length;
  return w2Head('Einbauen', c) + `${rotHint()}<div class="lay"><div class="la"><div class="board">${board(c, 'asm')}</div></div><div class="lb2"><p class="m">Jetzt kommen die neuen Teile an die richtige Stelle. Reihenfolge von unten nach oben: Kolben, Zylinder, Kopf, Kerze. Tippe auf die gestrichelten Felder oder die Teile unten.</p>${tray(c, 'asm')}
  <button class="btn" ${done ? '' : 'disabled'} onclick="w2Mission(4)">${done ? 'Alles eingebaut: Aufgaben' : 'Noch ' + (BP.length - c.put.length) + ' Teile'}</button></div></div>`;
}

const dynoCard = (p, base, anim = true) => `<div class="crv">${curveSvg(p, base, anim)}<div class="spec"><div><span>Leistung</span><b>${ps1(p.ps)} PS</b></div><div><span>Plus zur Serie</span><b>${Math.round((p.ps / base.ps - 1) * 100)} %</b></div><div><span>Spitze bei</span><b>${p.peak} U/min</b></div><div><span>Höchstgeschw.</span><b>${p.vmax} km/h</b></div></div><p class="m">Grau gestrichelt: Serie. Farbig: dein Aufbau.</p></div><div class="dynor"><div class="roller"></div></div>`;
function w2Dyno(c, v) {
  const p = w2perf(v, c.pick, c.jet), base = w2perf(v, ORIGP, 70); c.kerzeTone = p.kerze;
  const good = p.kerze === 'rehbraun';
  return w2Head('Prüfstand', c) + `${rotHint()}<div class="lay dy"><div class="la">${dynoCard(p, base)}</div><div class="lb2"><div class="card"><b>Hauptdüse abstimmen</b><p class="m">Schau auf die Kerze: <b>weiß = zu mager</b> (heiß, gefährlich), <b>schwarz = zu fett</b>, <b>rehbraun = richtig</b>.</p>
  <div class="jet"><button onclick="w2Jet(-2)">−</button><div class="kz">${ART.svg(ART.kerze(p.kerze))}</div><div><span class="m" style="display:block">Hauptdüse</span><b style="font-size:30px">${c.jet}</b><div class="m">Kerze ${p.kerze} · ca. ${p.temp} °C</div></div><button onclick="w2Jet(2)">+</button></div>
  <p class="${good ? 'okm' : 'warn'}">${good ? 'Passt. Der Motor läuft sauber.' : esc(p.notes[p.notes.length - 1] || '')}</p>
  <button class="btn" onclick="w2Run()">Prüfstand starten</button></div>
  <div class="card center"><b>Probefahrt auf dem Prüfgelände</b>${gauge(c.drove ? p.vmax : 0, p.vmax)}<button class="btn alt" id="drv" ${good ? '' : 'disabled'} onclick="w2Drive()">${c.drove ? 'Nochmal fahren' : good ? 'Probefahrt starten' : 'Erst die Düse abstimmen'}</button></div>
  ${c.ran ? videoBtn() : ''}<button class="btn" id="nxd" ${good && c.drove ? '' : 'disabled'} onclick="w2Mission(5)">Abnahme (Aufgaben)</button></div></div>`;
}
// Prüfstand-Tab: freier Lauf mit dem gewählten Fahrzeug (auch ohne Auftrag)
function w2Free() {
  const v = V2V[W2.sel] || V2V.s51, cc = W2.cars[v.id], pick = cc ? cc.pick : ORIGP, jet = cc ? cc.jet : 70, p = w2perf(v, pick, jet), base = w2perf(v, ORIGP, 70);
  return `${rotHint()}<div class="hud"><span class="pill">Prüfstand</span><span class="pill" style="margin-left:auto">Hauptdüse ${jet}</span></div>
  <div class="mods">${V2ORDER.map(k => `<button class="${k === v.id ? 's' : ''}" onclick="w2Sel('${k}')">${V2V[k].name.replace('Simson ', '').replace(' (SR4-2)', '').replace('Schwalbe KR51/2', 'Schwalbe')}</button>`).join('')}</div>
  <div class="lay dy"><div class="la">${dynoCard(p, base, false)}</div><div class="lb2"><p class="m">${cc ? 'Mit den Teilen aus deinem laufenden Auftrag.' : 'Serienzustand. Starte einen Auftrag in der Werkstatt, um Teile zu wechseln.'} Die Prüfung gehört im Auftrag zu Schritt 5.</p>
  <button class="btn" onclick="w2Run()">Prüfstand starten</button>${W2.ranV ? videoBtn() : ''}${cc ? `<button class="btn alt" onclick="w2Pick('${v.id}')">Zum Auftrag</button>` : ''}</div></div>`;
}
function w2Run() {
  const c = car(), v = c ? veh() : (V2V[W2.sel] || V2V.s51), pick = c ? c.pick : (W2.cars[v.id] || {pick: ORIGP}).pick, jet = c ? c.jet : (W2.cars[v.id] || {jet: 70}).jet;
  const p = w2perf(v, pick, jet), base = w2perf(v, ORIGP, 70); FX.rev(3.4);
  const box = document.querySelector('.crv'); if (box) { const sv = box.querySelector('svg'); if (sv) sv.outerHTML = curveSvg(p, base, true) }
  const r = document.querySelector('.roller'); [0, 700, 1500, 2300].forEach(t => setTimeout(() => FX.burstAt(r, 8, t > 600 && t < 2000), t));
  if (c) { c.ran = true; w2save() } else W2.ranV = true;
  setTimeout(() => { if (!document.querySelector('.vid') && (view === 'w2' || view === 'pr')) { const b = document.createElement('div'); b.innerHTML = videoBtn(); const host = document.querySelector('.lb2'); if (host) host.insertBefore(b.firstChild, host.lastElementChild && host.lastElementChild.id === 'nxd' ? host.lastElementChild : null) } }, 600);
}
const gauge = (val, max) => { const a = -120 + 240 * Math.min(1, val / 100); return `<svg viewBox="0 0 200 120" width="260"><defs><linearGradient id="gGold" x1="0" x2="1"><stop offset="0" stop-color="#5fb8ff"/><stop offset="1" stop-color="#d9e2ec"/></linearGradient></defs><path d="M20 110 A80 80 0 1 1 180 110" stroke="#1a2a42" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 110 A80 80 0 1 1 180 110" stroke="url(#gGold)" stroke-width="12" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${Math.min(1, val / 100)} 1" id="gp"/><g id="gn" style="transform-origin:100px 100px;transform:rotate(${a}deg);transition:transform 1.8s cubic-bezier(.2,.8,.2,1)"><path d="M98 100 L100 34 L102 100Z" fill="#ff453a"/><circle cx="100" cy="100" r="7" fill="#ddd"/></g><text x="100" y="92" text-anchor="middle" fill="#fff" font-size="26" font-weight="800" id="gt2">${val || 0}</text><text x="100" y="118" text-anchor="middle" fill="#8aa0ba" font-size="11">km/h</text></svg>` };
function w2Jet(d) { const c = car(); c.jet = Math.max(56, Math.min(140, c.jet + d)); c.drove = false; w2save(); FX.clink(); const y = window.scrollY; $('#app').innerHTML = w2View(); window.scrollTo(0, y) }
function w2Drive() {
  const c = car(), v = veh(), p = w2perf(v, c.pick, c.jet); c.drove = true; c.ran = true; w2save(); ride('🛵💨'); FX.rev(3.6); const n = $('#gn'), t = $('#gt2'); if (!n) return;
  n.style.transform = `rotate(${-120 + 240 * Math.min(1, p.vmax / 100)}deg)`; const gp = $('#gp'); if (gp) gp.setAttribute('stroke-dasharray', Math.min(1, p.vmax / 100) + ' 1');
  const r = document.querySelector('.roller'); [0, 800, 1600].forEach(t2 => setTimeout(() => FX.burstAt(r, 8), t2));
  let k = 0; const iv = setInterval(() => { k += 3; if (t) t.textContent = Math.min(p.vmax, Math.round(k * p.vmax / 60)); if (k >= 60) { clearInterval(iv); const b = $('#drv'); if (b) b.textContent = 'Nochmal fahren'; const nx = $('#nxd'); if (nx) nx.disabled = false; if (!document.querySelector('.vid')) { const d = document.createElement('div'); d.innerHTML = videoBtn(); const nb = $('#nxd'); if (nb) nb.parentNode.insertBefore(d.firstChild, nb) } toast(p.vmax + ' km/h auf dem Prüfgelände.') } }, 60); timers.push(iv);
}
function w2Build(c, v) {
  const p = w2perf(v, c.pick, c.jet), base = w2perf(v, ORIGP, 70), l = SLOTS.map(s => opt(s, c.pick[s]));
  return {id: v.id, key: v.key, name: v.name, ccm: p.ccm.toFixed(0), ps: p.ps, vmax: p.vmax, base: {ps: base.ps, vmax: base.vmax}, kerze: p.kerze, peak: p.peak, width: p.width, parts: l.map(o => o.n), pick: Object.assign({}, c.pick), jet: c.jet, legal: p.legal, cost: Math.round(l.reduce((a, o) => a + o.price, 0) * 100) / 100, date: new Date().toLocaleDateString('de-DE'), player: W2.player || ''};
}
function w2Cert(c, v) {
  const p = w2perf(v, c.pick, c.jet), l = SLOTS.map(s => opt(s, c.pick[s]));
  return w2Head('Abnahme', c) + `<div class="lay"><div class="la"><div class="cert"><div class="cl">WERKSTATT-ABNAHME</div><h1>${v.name}</h1><div class="car" style="aspect-ratio:16/9">${pic(v.key, '', v.name)}</div>
  <div class="spec"><div><span>Hubraum</span><b>${ps1(p.ccm.toFixed(1))} cm³</b></div><div><span>Leistung</span><b>${ps1(p.ps)} PS</b></div><div><span>Höchstgeschw.</span><b>${p.vmax} km/h</b></div><div><span>Kerze</span><b>${p.kerze}</b></div></div>
  <p class="m">${l.map(o => o.n).join(' · ')}</p>${!p.legal ? '<p class="m">Hinweis: Dieser Aufbau ist nicht serienmäßig. Auf öffentlichen Straßen sind Prüfung, Eintragung und der passende Führerschein nötig. Gebaut für Gelände und Prüfstand.</p>' : ''}</div></div>
  <div class="lb2">${videoBtn('vmain')}<button class="btn" onclick="studioOpen('cur')">📸 Foto-Studio</button><button class="btn alt" onclick="w2Finish()">Auftrag abschließen und Neues holen</button></div></div>`;
}
function w2Finish() { const c = car(), v = veh(); if (!c.cert) { c.cert = 1; W2.orders++; const b = w2Build(c, v); b.at = Date.now(); W2.garage.push(b) } delete W2.cars[v.id]; W2.veh = null; w2save(); go('w2') }

// ---- Lernaufgaben je Phase (Mini-Missionen für die vorhandene Aufgaben-Engine)
function w2Mission(ph) {
  const c = car(), v = veh(); let m;
  if (ph === 1) m = {title:'Auftragsannahme', sub:'Kunde, Auftrag, Regeln', min:7, steps:[
    W('Neuer Auftrag in der Werkstatt', `Ein guter Mechaniker schreibt den Auftrag auf: **Fahrzeug**, **Kundenwunsch**, **Budget** und **Datum**. Dann nennt er einen Kostenvoranschlag.\n\nHeute: ${v.name}, Wunsch: mehr Leistung, Budget ${BUDGET} €.`, 'Wer sauber aufschreibt, vergisst nichts und vermeidet Streit.'),
    O('Auftragsannahme in der richtigen Reihenfolge', ['Kunden begrüßen', 'Wunsch aufschreiben', 'Fahrzeug prüfen', 'Kostenvoranschlag nennen', 'Auftrag unterschreiben lassen'], 'Bringe die Schritte in die richtige Reihenfolge.'),
    Q('Was gehört NICHT auf eine Auftragskarte?', 'Die Lieblingsfarbe des Mechanikers', ['Das Fahrzeug', 'Der Kundenwunsch', 'Das Budget'], 'Auf die Karte gehören sachliche Angaben.'),
    (BUDGET >= 169.9 ? N(`Das Budget ist ${BUDGET} €. Ein Zylinder-Kit kostet 169,90 €. Wie viel Euro bleiben?`, Math.round((BUDGET - 169.9) * 100) / 100, `${BUDGET} − 169,90 = ${(BUDGET - 169.9).toFixed(2).replace('.', ',')}.`, {unit:'€'}) : N(`Das Budget ist ${BUDGET} €. Ein Zylinder-Kit kostet 169,90 €. Wie viel Euro fehlen noch?`, Math.round((169.9 - BUDGET) * 100) / 100, `169,90 − ${BUDGET} = ${(169.9 - BUDGET).toFixed(2).replace('.', ',')}. Das Kit ist zu teuer, also erst sparen.`, {unit:'€'})),
    TF('Regeln in der Werkstatt', [['Der Motor muss beim Schrauben kalt und aus sein.', true, ''], ['Tuning ohne Eintragung ist im Straßenverkehr erlaubt.', false, 'Ohne Prüfung und Eintragung erlischt die Betriebserlaubnis.'], ['Man schraubt nie allein an gefährlichen Stellen.', true, 'Erwachsene helfen mit.']]),
    X('Sprich den Kunden an: Begrüße ihn, nenne sein Fahrzeug und fasse seinen Wunsch in drei Sätzen zusammen.', 'Tipp: „Guten Tag Herr Krause. Ich habe verstanden, Sie möchten …“', 45)]};
  if (ph === 2) m = {title:'Zerlegen wie ein Profi', sub:'Teilenamen, Reihenfolge, Zweitakt', min:8, steps:[
    M('Teile-Quiz Deutsch und Englisch', [['Zylinder', 'cylinder'], ['Kolben', 'piston'], ['Vergaser', 'carburettor'], ['Auspuff', 'exhaust'], ['Zündkerze', 'spark plug'], ['Ritzel', 'sprocket']], 'Ordne zu.'),
    O('Zylinder ausbauen (Anleitung)', ['Zündkerze lösen', 'Zylinderkopf abschrauben', 'Zylinder nach oben abziehen', 'Kolben abnehmen'], 'Schreibe die Anleitung in der richtigen Reihenfolge. Signalwörter: zuerst, dann, danach, zum Schluss.'),
    Q('Warum muss der Motor vor dem Zerlegen kalt sein?', 'Heiße Teile verbrennen die Haut und verziehen sich beim Lösen', ['Damit er leiser ist', 'Damit er mehr Öl bekommt', 'Das ist egal'], 'Wärmeausdehnung und Verbrennungsgefahr.'),
    Q('Wie viele Takte hat ein Arbeitsspiel beim Zweitakter?', 'Zwei', ['Eins', 'Vier', 'Sechs'], 'Verdichten/Ansaugen und Arbeiten/Ausstoßen.'),
    T('Wie heißt „Kolben“ auf Englisch?', ['piston'], 'Piston.', {}),
    T('Setze zusammen (ein Wort): Zylinder + Kopf + Dichtung = ?', ['Zylinderkopfdichtung'], 'Das letzte Wort bestimmt den Artikel: die Dichtung.', {})]};
  if (ph === 3) { const z = opt('zyl', c.pick.zyl), q = ccmOf(z.bore, z.hub), sp = SLOTS.reduce((a, s) => a + opt(s, c.pick[s]).price, 0), r = opt('rit', c.pick.rit), vg = opt('verg', c.pick.verg), p = w2perf(v, c.pick, 70);
    m = {title:'Teile planen und rechnen', sub:'Hubraum, Kosten, Übersetzung', min:12, pro:true, steps:[
    W('Hubraum berechnen', 'Der Hubraum ist das Volumen im Zylinder: **V = π · (d : 2)² · h**. Bohrung d und Hub h in **cm** einsetzen (10 mm = 1 cm). Ergebnis in cm³.\n\nBeispiel Serie: d = 3,8 cm, h = 4,4 cm gibt etwa 49,9 cm³.', 'Mit dem Taschenrechner geht es schneller. Runde am Ende.'),
    N(`Dein Zylinder: Bohrung ${z.bore} mm, Hub ${z.hub || 44} mm. Wie viele cm³ (auf ganze Zahl gerundet)?`, Math.round(q), `V = π · (${z.bore / 10} : 2)² · ${((z.hub || 44) / 10).toString().replace('.', ',')} ≈ ${q.toFixed(1).replace('.', ',')} cm³.`, {unit:'cm³', tol:1, hint:'Radius ist d : 2 = ' + (z.bore / 20) + ' cm.'}),
    N('Wie viel kosten deine gewählten Teile zusammen (in Euro)?', Math.round(sp * 100) / 100, 'Alle Preise der gewählten Teile addieren.', {unit:'€', tol:.01}),
    N(`Das Budget beträgt ${BUDGET} €. Wie viel bleibt übrig (in Euro)?`, Math.round((BUDGET - sp) * 100) / 100, `${BUDGET} − ${sp.toFixed(2).replace('.', ',')}.`, {unit:'€', tol:.01}),
    N(`Das Kettenrad hat ca. 34 Zähne, dein Ritzel ${r.z}. Übersetzung (2 Stellen)?`, Math.round(34 / r.z * 100) / 100, `34 : ${r.z} ≈ ${(34 / r.z).toFixed(2).replace('.', ',')}.`, {tol:.01}),
    Q(`Passt dein Vergaser (${vg.size} mm) zum Zylinder?`, p.notes.some(n => /Vergaser/.test(n)) ? 'Nein, der Vergaser passt nicht gut dazu' : 'Ja, er passt', p.notes.some(n => /Vergaser/.test(n)) ? ['Ja, er passt', 'Der Vergaser ist egal'] : ['Nein, zu klein', 'Der Vergaser ist egal'], 'Größerer Hubraum braucht mehr Luft und Benzin, aber ein zu großer Vergaser spricht schlechter an.'),
    Q('You are at the shop: „How much is the cylinder?“ means:', 'Was kostet der Zylinder?', ['Wie schwer ist der Zylinder?', 'Wo ist der Zylinder?', 'Ist der Zylinder neu?'], 'How much = wie viel.'),
    T('Schreibe das englische Wort für „Vergaser“ (britisch):', ['carburettor', 'carburetor'], 'Carburettor (britisch) oder carburetor (amerikanisch).', {})]} }
  if (ph === 4) m = {title:'Einbau und Montageanleitung', sub:'Reihenfolge, Drehmoment, Erklären', min:8, steps:[
    O('Einbau in der richtigen Reihenfolge', ['Kolben auf das Pleuel setzen', 'Zylinder aufschieben', 'Zylinderkopf aufsetzen', 'Zündkerze eindrehen'], 'Von unten nach oben.'),
    Q('Wie zieht man die Zylinderkopfmuttern an?', 'Über Kreuz und in Stufen', ['Eine nach der anderen so fest wie möglich', 'Gar nicht', 'Mit dem Hammer'], 'So verzieht sich der Kopf nicht und die Dichtung sitzt gleichmäßig.'),
    GAP('Montageanleitung', '{Zuerst} setzt du den Kolben auf. {Danach|Dann} schiebst du den Zylinder auf. {Zum Schluss} drehst du die Zündkerze ein.', ['Gestern', 'Niemals']),
    Q('Why must you tighten bolts „in a cross pattern“?', 'So the head sits evenly', ['So it looks nice', 'So it gets louder', 'To save oil'], 'Cross pattern = über Kreuz.'),
    Q('Was bewirkt ein größerer Hubraum?', 'Mehr Gemisch pro Arbeitsspiel und mehr Leistung', ['Weniger Benzinverbrauch immer', 'Weniger Wärme immer', 'Nichts'], 'Mehr Gemisch ergibt mehr Energie, aber auch mehr Wärme.'),
    X('Erkläre dem Kunden in vier Sätzen, was du eingebaut hast und warum. Benutze Signalwörter.', 'Tipp: „Zuerst habe ich … eingebaut, weil …“', 60)]};
  if (ph === 5) { const p = w2perf(v, c.pick, c.jet), b = w2perf(v, ORIGP, 70), pct = Math.round((p.ps / b.ps - 1) * 100);
    m = {title:'Prüfbericht und Abnahme', sub:'Diagramm lesen, Prozent, Verantwortung', min:10, steps:[
    W('Der Prüfbericht', `Dein Aufbau leistet **${String(p.ps).replace('.', ',')} PS** bei etwa **${p.peak} U/min**. Die Serie hat ${String(b.ps).replace('.', ',')} PS.\n\nDie Endgeschwindigkeit steigt nicht im gleichen Maß: Die Leistung muss gegen den Luftwiderstand ankommen und wächst mit der **dritten Potenz** der Geschwindigkeit. Doppelte Leistung bringt nur etwa 26 % mehr Tempo.`, 'Mehr Tempo ist teuer: Kraftstoff, Hitze, Verschleiß.'),
    N(`Wie viel Prozent mehr Leistung als die Serie (ganze Zahl)? Serie ${String(b.ps).replace('.', ',')} PS, Aufbau ${String(p.ps).replace('.', ',')} PS.`, pct, `(${String(p.ps).replace('.', ',')} − ${String(b.ps).replace('.', ',')}) : ${String(b.ps).replace('.', ',')} ≈ ${pct} %.`, {unit:'%', tol:1}),
    N('Bei welcher Drehzahl liegt die Leistungsspitze deiner Kurve (auf 100 gerundet)?', p.peak, 'Die Spitze der orangen Kurve im Diagramm.', {unit:'U/min', tol:100}),
    Q('Der Motor hat eine weiße Kerze. Was tust du?', 'Größere Hauptdüse einbauen', ['Kleinere Hauptdüse einbauen', 'Mehr Gas geben', 'Nichts'], 'Weiße Kerze = zu mager. Mehr Benzin kühlt und schützt vor dem Klemmer.'),
    Q('Wie viel mehr Tempo bringt etwa die doppelte Leistung?', 'Etwa ein Viertel mehr', ['Das Doppelte', 'Das Dreifache', 'Nichts'], 'Leistung ~ Tempo hoch 3, also Tempo ~ dritte Wurzel: 2^(1/3) ≈ 1,26.'),
    Q('Darfst du so auf der Straße fahren?', p.legal ? 'Ja, der Aufbau ist serienmäßig' : 'Nur mit Prüfung und Eintragung', p.legal ? ['Nein', 'Nur nachts'] : ['Ja, ohne Probleme', 'Nur bei Sonne'], 'Änderungen an Zylinder, Auspuff und Zündung müssen geprüft und eingetragen werden.'),
    X('Schreibe oder sprich deinen Prüfbericht: Was wurde eingebaut, was leistet der Motor jetzt, was sollte der Kunde beachten? Vier Sätze.', 'Tipp: Fachwörter wie Hubraum, Drehzahl, Düse, Betriebserlaubnis.', 60)]} }
  m.id = 'w2-' + v.id + '-' + ph; m.subject = 'technik'; m.theme = 'tuning'; m.w2 = ph;
  clearTimers(); run = {m, i: 0, ok: 0, tot: 0, help: 0, score: 0, steps: m.steps}; view = 'run'; setAccent('var(--a)'); render();
}

// ---- Mix-Training: bunt gemischte Fragen aus allen Fächern (Wiederholung und Neues)
function startMix() {
  clearTimers(); const pools = SUBJ_ORDER.map(k => shuffle(Object.keys(QIDX).filter(q => QIDX[q].m.subject === k && S.done[QIDX[q].m.id])));
  let ids = []; for (let i = 0; i < 4 && ids.length < 8; i++) pools.forEach(pl => { if (pl[i] && ids.length < 8) ids.push(pl[i]) });
  if (ids.length < 8) ids = ids.concat(shuffle(Object.keys(QIDX).filter(q => !ids.includes(q))).slice(0, 8 - ids.length));
  const steps = [{type:'wissen', title:'Mix-Training', text:'Aufgaben aus allen Fächern bunt gemischt. Wer abwechselt, lernt tiefer als wer nur ein Thema übt.'}, ...shuffle(ids).map(q => QIDX[q].s)];
  run = {m:{id:'box', theme:'tuning', title:'Mix-Training', steps}, i:0, ok:0, tot:0, help:0, score:0, steps}; view = 'run'; setAccent('#0a84ff'); render();
}

// ---- Einhängen in die vorhandene App
setAccent = function (c) { document.documentElement.style.setProperty('--sc', c) };
const TABS = [['home', 'Start'], ['w2', 'Werkstatt'], ['pr', 'Prüfstand'], ['missions', 'Lernen'], ['garage', 'Garage']];
const _render = render, _finish = finish;
const XTAB = {veh: 'garage', ws: 'garage', parents: 'garage', gal: 'w2', alb: 'w2', lbd: 'w2', studio: 'w2'};
render = function () {
  if (typeof ws3dStop === 'function' && view !== 'ws') ws3dStop();
  if (view === 'w2') { $('#app').innerHTML = w2View(); window.scrollTo(0, 0) }
  else if (view === 'pr') { $('#app').innerHTML = w2Pr(); window.scrollTo(0, 0) }
  else if (view === 'home') { $('#app').innerHTML = home2(plan()); window.scrollTo(0, 0); requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.rg').forEach(c => { c.style.strokeDasharray = c.dataset.v }))) }
  else if (window.V2X && V2X[view]) { $('#app').innerHTML = V2X[view](); window.scrollTo(0, 0) }
  else _render();
  const cur = XTAB[view] || view;
  document.body.classList.toggle('land', view === 'pr' || (view === 'w2' && !!W2.veh && !!W2.cars[W2.veh] && [2, 4, 5].includes(W2.cars[W2.veh].ph)));
  $('#tab').innerHTML = TABS.map(t => `<button class="${cur === t[0] ? 'on' : ''}" onclick="go('${t[0]}')">${t[1]}</button>`).join('');
  $('#tab').style.display = view === 'run' ? 'none' : 'flex';
  if (view === 'home') greet(); sndLabel();
};
function w2Pr() { const c = W2.veh && W2.cars[W2.veh]; return c && c.ph === 5 ? w2Dyno(c, veh()) : w2Free() }
finish = function () {
  const m = run && run.m, ph = m && m.w2; _finish();
  if (ph) { const c = W2.cars[W2.veh]; if (c && c.ph === ph) { c.ph = ph + 1; w2save() } view = 'w2'; const a = $('#app'), b = a.querySelector('.btn:last-of-type'); if (b) { b.textContent = ph >= 5 ? 'Weiter zur Abnahme' : 'Weiter in der Werkstatt'; b.setAttribute('onclick', "go('w2')") } }
};
function home2(p) {
  const m = p.main, sub = SUBJECTS[m.subject], t = theme(m.theme), st = streak(), done = doneToday(m.id), c = W2.veh && W2.cars[W2.veh], v = V2V[W2.veh];
  const g = [...GARAGE].reverse().find(x => S.points >= x.need), nxt = GARAGE.find(x => x.need > S.points);
  const bonusDone = doneToday(p.bonus.id), box = missCount(), due = dueMissions().length, rk = rankOf(S.points), nx = rk.next;
  const xp = nx ? Math.round(100 * (S.points - rk.cur.p) / (nx.p - rk.cur.p)) : 100;
  const hour = new Date().getHours(), hi = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';
  const left = `<div class="hud"><div class="av">${esc((S.name || W2.player || 'A').charAt(0).toUpperCase())}</div><div class="xp"><small onclick="egg('h1',5,()=>ride('🛵💨','Ring-ding-ding! Zweitakt-Alarm'))">${rk.cur.n} · Level ${rk.i + 1}${nx ? ' · noch ' + (nx.p - S.points) + ' Punkte' : ''}</small><div class="bar"><i style="width:${Math.max(4, xp)}%"></i></div></div><span class="pill" onclick="egg('fire',3,()=>toast('Heiß! Aber bitte keinen Kolbenklemmer bauen 😅'))">🔥 ${st}</span><span class="pill" onclick="egg('star',5,()=>ride('🚜🌾','Rasentraktor-Parade! Bahn frei.'))">${S.points} ⛭</span></div>
  <div class="hero">${pic('hero', '', 'Simson-Werkstatt')}<div class="in2"><h1>Simson <b>Tuning&shy;werkstatt</b></h1><button class="btn" onclick="go('w2')">${c ? 'Weiter schrauben: ' + v.name : 'Weiter schrauben'}</button></div></div>`;
  const right = `<h2>Mission des Tages</h2>
  ${typeof mdt === "function" ? mdt(m) : ""}
  ${typeof tagCard === "function" ? tagCard() : ""}
  <h2>Fächer</h2><div class="fgrid">${TAB_SUBJ.map(k => { const vv = SUBJECTS[k], l = byS(k), g2 = l.filter(x => (S.stars[x.id] || 0) >= 2).length, nm = pickFor(k);
    return `<button class="fc" onclick="S.subj='${k}';save();go('missions')"><i>${vv.name}</i><b>${esc(nm ? nm.title : vv.long)}</b><div class="bar"><i style="width:${Math.max(4, 100 * g2 / l.length)}%"></i></div></button>` }).join('')}</div>
  <h2>Mix-Training</h2><button class="item" onclick="startMix()"><div style="flex:1"><b>8 Aufgaben · +${40} XP</b><div class="bar" style="margin-top:8px"><i style="width:${Math.min(100, 8 + 12 * missCount() / 3)}%"></i></div></div></button>
  <h2>Noch mehr?</h2>
  <button class="item" onclick="start('${p.bonus.id}')"><div class="dot" style="background:${SUBJECTS[p.bonus.subject].color}33">${SUBJECTS[p.bonus.subject].emoji}</div><div style="flex:1"><b>Bonus: ${esc(p.bonus.title)}</b><span class="m">${SUBJECTS[p.bonus.subject].long} · ${p.bonus.min} Min.</span></div>${bonusDone ? '<span class="done">✓</span>' : ''}</button>
  <button class="item" onclick="start('${p.pro.id}')"><div class="dot" style="background:#ff453a33">🔩</div><div style="flex:1"><b>Profi-Challenge: ${esc(p.pro.title)}</b><span class="m">Motortechnik für Fortgeschrittene · ${p.pro.min} Min. · mit Taschenrechner</span></div>${doneToday(p.pro.id) ? '<span class="done">✓</span>' : ''}</button>
  ${box || due ? `<button class="item" onclick="startBox()"><div class="dot" style="background:#ff453a33">🏁</div><div style="flex:1"><b>Boxenstopp</b><span class="m">${box ? box + ' Aufgaben zum Wiederholen' : ''}${box && due ? ' · ' : ''}${due ? due + (due === 1 ? ' Mission' : ' Missionen') + ' zum Auffrischen' : ''}</span></div></button>` : ''}
  <h2>Heute</h2>${ringsHTML()}
  <h2>Das große Ziel</h2><button class="item" onclick="go('garage')"><div class="dot" style="background:#ff453a33">🏆</div><div style="flex:1"><b>${esc(PROJECT.name)}</b><span class="m">${projectDone() ? 'Geschafft! Urkunde in der Garage' : projectPct() + ' % der Etappen geschafft'}</span><div class="bar" style="margin-top:8px"><i style="width:${Math.max(3, projectPct())}%"></i></div></div></button>
  <h2>Deine Garage</h2><div class="card gcard" onclick="openVeh('${g.id}')"><div class="gimg">${gimg(g)}</div><div style="flex:1"><b>${esc(g.name)}</b>${nxt ? `<div class="m">Noch ${nxt.need - S.points} Punkte bis ${esc(nxt.name)}</div><div class="bar" style="margin-top:8px"><i style="width:${Math.max(4, 100 * (S.points - g.need) / (nxt.need - g.need))}%"></i></div>` : '<div class="m">Alles freigeschaltet!</div>'}</div></div>
  <p class="m center" style="margin-top:16px"><button class="chip" onclick="go('parents')">Eltern</button> <span class="chip">Schrauberschule</span></p>`;
  return `<div class="hgrid"><div class="la">${left}</div><div class="lb2">${right}</div></div>`;
}

// Test-Hook für Screenshots: v2/index.html#shot=dis usw. (nur Ansicht)
(function () {
  const m = /shot=(\w+)/.exec(location.hash); if (!m) return; const k = m[1];
  S.points = Math.max(S.points, 120); ROTX = true;
  if (k === 'home') { view = 'home'; return render() }
  if (k === 'sel') { W2.veh = null; view = 'w2'; return render() }
  if (k === 'pr') { view = 'pr'; return render() }
  if (k === 'mix') return startMix();
  if (['garage', 'missions', 'parents'].includes(k)) { view = k; return render() }
  if (['gal', 'alb', 'lbd'].includes(k)) { if (!W2.garage.length) W2.garage.push(demoBuild()); view = k; return render() }
  W2.veh = 's51'; const c = W2.cars.s51 = {ph: 1, took: [], put: [], pick: Object.assign({}, ORIGP), jet: 70, drove: false};
  const ph = {auftrag: 1, dis: 2, shop: 3, asm: 4, dyno: 5, cert: 6, task: 3}[k] || 1; c.ph = ph;
  if (k === 'dis') c.took = ['kerze', 'kopf', 'aus', 'verg'];
  if (ph >= 3) c.took = BP.map(p => p.id);
  if (ph >= 3 && k !== 'task') c.pick = {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r16'};
  if (k === 'asm') c.put = ['kolben', 'zyl', 'aus'];
  if (ph >= 5) { c.put = BP.map(p => p.id); c.jet = 80; c.drove = true; c.ran = true }
  if (k === 'task') { c.pick = {zyl: 'z70', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r16'}; view = 'w2'; return w2Mission(3) }
  view = 'w2'; render();
})();
if (!/shot=/.test(location.hash)) { view = 'home'; render() }
function demoBuild() { const v = V2V.s51, c = {pick: {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r16'}, jet: 80}; const b = w2Build(c, v); b.at = Date.now(); b.player = 'Demo'; return b }
