'use strict';
// V2 Klapprad (8. Modell): Mifa-Klappfahrrad der DDR, ohne Motor, mit Spaß-Umbauten. Prüfstand = Muskel-Prüfstand in Watt.
// Alle Werte sind gerundete Spielwerte aus echter Physik (Rollwiderstand, Luftwiderstand, Übersetzung). Quellen und Grenzen: BAUSTAND.md.
// Fakten: Mifa (Mitteldeutsche Fahrradwerke, Sangerhausen) baute das Klapprad ab 1967 bis 1990 in den Modellen 901/903/904, 20-Zoll-Räder,
// Museumsangabe zu einem Rad von 1973: etwa 15 kg. Zähnezahlen, Reifenbreite und Preise im Spiel sind Spielwerte (am echten Rad nachzählen).
const KCAT = {
  licht: {n:'Licht', en:'light', opts:[
    {id:'ld', n:'Seitenläufer-Dynamo + Glühlampe 6 V, 3 W', tag:'Original', price:0, drag:6, kg:.4, legal:true, info:'Der Dynamo läuft am Reifen. Scheinwerfer 2,4 W plus Rücklicht 0,6 W = 3 W. Er bremst: etwa 6 W Verlust beim Treten.'},
    {id:'la', n:'LED-Akkuleuchten (Prüfzeichen K)', tag:'Tuning', price:24.9, drag:0, kg:.3, legal:true, info:'Hell, kein Dynamo-Widerstand. Seit 2017 erlaubt, wenn die Leuchten ein K-Prüfzeichen tragen. Akku laden nicht vergessen.'},
    {id:'lb', n:'LED-Lampen am Dynamo (6 V)', tag:'Tuning', price:14.9, drag:4, kg:.4, legal:true, info:'LEDs brauchen weniger Strom als Glühlampen, der Dynamo bremst nur noch ca. 4 W. Der Dynamo bleibt.'}]},
  hupe: {n:'Klingel und Hupe', en:'bell and horn', opts:[
    {id:'hk', n:'Fahrradklingel (Glocke)', tag:'Original', price:0, kg:.1, legal:true, info:'Vorschrift: eine helltönende Glocke. Mehr braucht ein Fahrrad nicht.'},
    {id:'hg', n:'Klingel + Gummiball-Hupe', tag:'Spaß', price:7.9, kg:.2, legal:false, info:'Lustig, aber auf der Straße nicht erlaubt: Andere Schallzeichen als eine Klingel sind am Fahrrad unzulässig.'},
    {id:'hx', n:'Klingel + elektrisches Signalhorn', tag:'Spaß', price:12.9, kg:.3, legal:false, info:'Laut wie ein Mofa, am Fahrrad aber nicht erlaubt. Nur auf dem Hof oder im Spielgelände.'}]},
  gepaeck: {n:'Gepäck', en:'luggage', opts:[
    {id:'gt', n:'Ohne Gepäck (Serie)', tag:'Original', price:0, kg:0, cda:0, legal:true, info:'Das Rad bleibt leicht und windschnittig.'},
    {id:'gr', n:'Gepäckträger', tag:'Tuning', price:14.9, kg:1, cda:.01, legal:true, info:'Üblich bis ca. 10 kg Last, Rückstrahler und Rücklicht dürfen nicht verdeckt werden.'},
    {id:'gb', n:'Gepäckbox hinten', tag:'Spaß', price:29.9, kg:2.5, cda:.04, legal:true, info:'Mehr Platz, aber mehr Gewicht (2,5 kg) und mehr Luftwiderstand.'}]},
  reifen: {n:'Reifen', en:'tyres', opts:[
    {id:'rs', n:'Schmal 20 × 1,25 Zoll', tag:'Tuning', price:19.9, crr:.007, circ:1.45, pmax:60, kg:-.4, legal:true, info:'Rollt leicht, braucht hohen Druck (bis ca. 6 bar). Umfang ca. 1,45 m. Bei schmalen Reifen mit Felge und Bremsen prüfen, ob sie passen.'},
    {id:'rm', n:'Original 20 × 1,75 Zoll', tag:'Original', price:0, crr:.009, circ:1.5, pmax:40, kg:0, legal:true, info:'Der übliche Reifen für 20-Zoll-Klappräder (47-406). Umfang ca. 1,50 m, Druck bis ca. 4 bar (steht auf dem Reifen).'},
    {id:'rb', n:'Breitreifen 20 × 2,125 Zoll', tag:'Spaß', price:29.9, crr:.012, circ:1.55, pmax:30, kg:.5, legal:true, info:'Weich und bequem, sieht wuchtig aus, rollt auf Asphalt aber schwerer. Umfang ca. 1,55 m, Druck bis ca. 3 bar. Muss in den Rahmen und in die Gabel passen.'}]},
  kette: {n:'Kettenblatt (vorn)', en:'chainring', opts:[
    {id:'k38', n:'Kettenblatt 38 Zähne', tag:'Tuning', z:38, price:16.9, legal:true, info:'Kleineres Kettenblatt: leichter zu treten, weniger Endtempo.'},
    {id:'k44', n:'Kettenblatt 44 Zähne', tag:'Original', z:44, price:0, legal:true, info:'Spielwert für das Serienrad (bitte am echten Rad nachzählen).'},
    {id:'k50', n:'Kettenblatt 50 Zähne', tag:'Tuning', z:50, price:21.9, legal:true, info:'Großes Kettenblatt: mehr Tempo, aber schwer anzutreten.'}]},
  ritzel: {n:'Ritzel (hinten)', en:'sprocket', opts:[
    {id:'q14', n:'Ritzel 14 Zähne', tag:'Tuning', z:14, price:8.9, legal:true, info:'Kleines Ritzel: lange Übersetzung, schnell, aber schwer am Berg.'},
    {id:'q16', n:'Ritzel 16 Zähne', tag:'Original', z:16, price:0, legal:true, info:'Spielwert für das Serienrad (bitte am echten Rad nachzählen).'},
    {id:'q18', n:'Ritzel 18 Zähne', tag:'Tuning', z:18, price:8.9, legal:true, info:'Großes Ritzel: kurze Übersetzung, leichtes Anfahren, am Berg stark.'}]},
  zub: {n:'Reflektoren, Wimpel, Tacho', en:'reflectors, pennant, speedometer', opts:[
    {id:'zn', n:'Nur Reflektoren (Serie)', tag:'Original', price:0, kg:0, cda:0, legal:true, info:'Vorn weiß, hinten rot und Pedalstrahler sind Pflicht. Dazu Speichenreflektoren oder reflektierende Reifenstreifen.'},
    {id:'zs', n:'Speichenreflektoren + Wimpel', tag:'Spaß', price:5.9, kg:.1, cda:.01, legal:true, info:'Speichenreflektoren sieht man von der Seite besser. Der Wimpel sieht lustig aus und macht etwas mehr Luftwiderstand.'},
    {id:'zt', n:'Speichenreflektoren, Wimpel + Tacho', tag:'Spaß', price:17.9, kg:.2, cda:.01, legal:true, tacho:true, info:'Der Tacho zählt die Radumdrehungen. Er braucht den Radumfang (Reifen!) und rechnet daraus km/h.'}]},
  motor: {n:'Hilfsmotor', en:'auxiliary engine', opts:[
    {id:'m0', n:'Ohne Motor (Serie)', tag:'Original', price:0, kg:0, legal:true, info:'Nur Muskelkraft. Das Klapprad ist ein Fahrrad.'},
    {id:'mp', n:'Pedelec-Nachrüstsatz 250 W', tag:'Motor', price:229.9, kg:4.5, pm:250, legal:true, info:'Nabenmotor mit Akku, hilft nur beim Treten und bis 25 km/h (dann schaltet er ab). Mit passendem Satz bleibt es ein Fahrrad. Spielwert für den Preis.'},
    {id:'mv', n:'Verbrenner-Hilfsmotor 50 cm³ (Bausatz)', tag:'Motor', price:169.9, kg:9, pm:1100, legal:false, info:'ca. 1,5 PS. Auf der Straße gilt ein Fahrrad mit Hilfsmotor als Mofa: Betriebserlaubnis, Versicherungskennzeichen und Mofa-Prüfbescheinigung (ab 15 Jahren) sind nötig, und höchstens 25 km/h. Bausätze ohne Betriebserlaubnis sind nur auf Privatgelände erlaubt.'}]}
};
const KSLOTS = ['reifen', 'kette', 'ritzel', 'licht', 'hupe', 'zub', 'gepaeck', 'motor'];
const kopt = (s, id) => KCAT[s].opts.find(o => o.id === id);
const KRIDER = 60, KBIKE = 14.5, KPMAX = 100, KETA = .96, KRHO = 1.2, KG = 9.81;   // Fahrer 60 kg, Rad ca. 14,5 kg (Museum: ca. 15 kg), Muskeldauerleistung ca. 100 W
const kpitch = 12.7;                                                                    // Kettenteilung 1/2 Zoll = 12,7 mm
const kRadius = z => kpitch / (2 * Math.sin(Math.PI / z));                              // Teilkreisradius in mm
const kGear = pick => kopt('kette', pick.kette).z / kopt('ritzel', pick.ritzel).z;
const kPr = c => KPMAX * Math.max(0, 1 - Math.pow((c - 70) / 60, 2));                    // Muskelleistung in Watt bei Trittfrequenz c (U/min), Maximum bei ca. 70
const kDruck = (pick, jet) => { const r = kopt('reifen', pick.reifen), bar = jet / 10, lo = r.pmax / 10 * .75; return bar > r.pmax / 10 + .05 ? 'zu hart' : bar >= lo - .05 ? 'richtig' : 'zu weich' };
function kperf(pick, jet, lamp) {
  const r = kopt('reifen', pick.reifen), L = kopt('licht', pick.licht), z = kopt('zub', pick.zub), gp = kopt('gepaeck', pick.gepaeck), hu = kopt('hupe', pick.hupe), mo = kopt('motor', pick.motor), ki = kopt('kette', pick.kette), ri = kopt('ritzel', pick.ritzel);
  const kg = KRIDER + KBIKE + SLOTSUM('kg', pick), cda = .55 + gp.cda + z.cda, state = kDruck(pick, jet), bar = jet / 10, popt = r.pmax / 10 * .75;
  const crr = r.crr * (bar >= popt ? 1 : 1 + .8 * (popt - bar) / popt), i = ki.z / ri.z, circ = r.circ, drag = lamp ? L.drag : 0;
  const need = v => (crr * kg * KG * v + .5 * KRHO * cda * v * v * v + drag) / KETA;                // v in m/s, Watt am Pedal bzw. Motor
  const pm = v => mo.pm ? (mo.id === 'mp' ? mo.pm * Math.max(0, Math.min(1, (25 - v * 3.6) / 5)) : mo.pm) : 0;
  const cad = v => v / (i * circ) * 60, vOf = c => c / 60 * i * circ;
  const avail = v => kPr(cad(v)) + pm(v);
  let vmax = 0; for (let v = .1; v < 30; v += .02) { if (avail(v) >= need(v) * KETA) vmax = v; else if (vmax > 0) break }
  const v10 = 10 / 3.6, slope = Math.max(0, (avail(v10) * KETA - (crr * kg * KG * v10 + .5 * KRHO * cda * v10 ** 3 + drag)) / (kg * KG * v10));
  const notes = [];
  if (state === 'zu weich') notes.push('Reifendruck zu niedrig: Der Reifen walkt, das Rad rollt schwerer (mehr Watt).');
  if (state === 'zu hart') notes.push('Reifendruck über dem Maximum auf dem Reifen: Platzgefahr!');
  const tune = KSLOTS.filter(s => pick[s] !== KORIG[s]);
  const illegal = KSLOTS.filter(s => kopt(s, pick[s]).legal === false);
  if (illegal.length) notes.push('Nicht auf der Straße erlaubt: ' + illegal.map(s => kopt(s, pick[s]).n).join(', ') + '.');
  return {kg, cda, crr, i, circ, vmax: vmax * 3.6, cadMax: cad(vmax), watt: KPMAX + (mo.pm || 0), state, notes, tune, illegal, legal: !illegal.length, need, avail, pm, cad, vOf, slope: slope * 100, v60: vOf(60) * 3.6, tacho: z.tacho, drag};
}
function SLOTSUM(k, pick) { return KSLOTS.reduce((a, s) => a + (kopt(s, pick[s])[k] || 0), 0) }

// ---- Zeichnung (Fallback für ki/klapprad.jpg)
function svgKlapp(label) {
  const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#0a1220" stroke-width="9"/><circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#d9e2ec" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r - 10}" fill="none" stroke="#2f4767" stroke-width="1.5" stroke-dasharray="2 4"/><circle cx="${x}" cy="${y}" r="5" fill="#5fb8ff"/>`;
  return `<svg viewBox="0 0 440 240" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="fbk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16304f"/><stop offset="1" stop-color="#070b12"/></linearGradient></defs><rect width="440" height="240" fill="url(#fbk)"/><ellipse cx="220" cy="214" rx="170" ry="8" fill="#000" opacity=".4"/>
  ${wheel(118, 160, 50)}${wheel(322, 160, 50)}<path d="M118 160 L215 168 L290 86 M215 168 L170 70" stroke="#1f6fe0" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="222" cy="108" r="6" fill="#d9e2ec"/>
  <path d="M290 86 L322 160" stroke="#d9e2ec" stroke-width="6" fill="none"/><path d="M276 70 L296 70 M286 70 L290 86" stroke="#d9e2ec" stroke-width="5" stroke-linecap="round"/><path d="M155 66 Q172 60 190 66" stroke="#0a1220" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="215" cy="168" r="17" fill="none" stroke="#d9e2ec" stroke-width="3"/><circle cx="118" cy="160" r="8" fill="none" stroke="#d9e2ec" stroke-width="3"/><path d="M215 151 L118 152 M215 185 L118 168" stroke="#8aa0ba" stroke-width="1.5"/><path d="M215 168 L240 190 M215 168 L190 146" stroke="#8aa0ba" stroke-width="4" stroke-linecap="round"/>
  <text x="220" y="30" text-anchor="middle" fill="#8aa0ba" font-size="16" font-family="system-ui" font-weight="700">${label || ''}</text></svg>`;
}

// ---- Teile-Symbole für die Auswahlkarten
function kIcon(slot, o) {
  const s = {reifen: `<circle cx="50" cy="50" r="${o.id === 'rs' ? 30 : o.id === 'rm' ? 30 : 30}" fill="none" stroke="#0a1220" stroke-width="${o.id === 'rs' ? 5 : o.id === 'rm' ? 9 : 14}"/><circle cx="50" cy="50" r="${o.id === 'rs' ? 25 : o.id === 'rm' ? 23 : 21}" fill="none" stroke="#8aa0ba" stroke-width="1.5"/><circle cx="50" cy="50" r="4" fill="#5fb8ff"/>`,
    kette: gearSvg(50, 50, o.z ? o.z : 44, 14 + (o.z || 44) / 3.3), ritzel: gearSvg(50, 50, o.z || 16, 8 + (o.z || 16) / 3),
    licht: o.id === 'la' ? '<rect x="22" y="36" width="44" height="26" rx="8" fill="#d9e2ec"/><circle cx="70" cy="49" r="12" fill="#fff6b0"/><rect x="30" y="64" width="20" height="8" rx="3" fill="#5fb8ff"/>' : '<circle cx="42" cy="48" r="20" fill="#d9e2ec"/><circle cx="42" cy="48" r="13" fill="' + (o.id === 'lb' ? '#fffbd0' : '#ffd24a') + '"/><rect x="64" y="52" width="20" height="14" rx="5" fill="#8aa0ba"/>',
    hupe: o.id === 'hk' ? '<path d="M24 62 A26 26 0 0 1 76 62Z" fill="#d9e2ec"/><rect x="46" y="30" width="8" height="8" fill="#8aa0ba"/>' : '<path d="M22 56 L58 40 L58 72Z" fill="#d9e2ec"/><circle cx="66" cy="56" r="10" fill="#ff8a1f"/>',
    gepaeck: o.id === 'gt' ? '<path d="M24 74 L76 26 M24 26 L76 74" stroke="#5a6b82" stroke-width="5"/>' : o.id === 'gr' ? '<path d="M20 40 L80 40 M28 40 L28 72 M72 40 L72 72 M20 40 L20 30" stroke="#d9e2ec" stroke-width="5" fill="none"/>' : '<rect x="20" y="28" width="60" height="44" rx="6" fill="#1f6fe0" stroke="#d9e2ec" stroke-width="3"/><rect x="34" y="40" width="32" height="6" rx="3" fill="#d9e2ec"/>',
    zub: '<circle cx="50" cy="56" r="20" fill="none" stroke="#2f4767" stroke-width="2"/>' + (o.id !== 'zn' ? '<path d="M50 56 L50 14 L74 22 L50 30" fill="#ff8a1f" stroke="#fff" stroke-width="2"/>' : '') + '<rect x="40" y="42" width="8" height="14" rx="2" fill="#ff453a"/><rect x="56" y="62" width="8" height="14" rx="2" fill="#ff453a"/>' + (o.tacho ? '<circle cx="20" cy="30" r="12" fill="#101c2f" stroke="#5fb8ff" stroke-width="2"/><text x="20" y="34" font-size="10" fill="#5fb8ff" text-anchor="middle">km/h</text>' : ''),
    motor: o.id === 'm0' ? '<path d="M24 74 L76 26 M24 26 L76 74" stroke="#5a6b82" stroke-width="5"/>' : o.id === 'mp' ? '<circle cx="50" cy="50" r="26" fill="#1a2a42" stroke="#5fb8ff" stroke-width="4"/><path d="M52 30 L40 54 L50 54 L46 70 L62 44 L52 44Z" fill="#ffd24a"/>' : '<rect x="24" y="38" width="46" height="34" rx="6" fill="#8aa0ba"/><rect x="30" y="26" width="18" height="12" fill="#5a6b82"/><circle cx="78" cy="55" r="10" fill="#0a1220" stroke="#d9e2ec" stroke-width="3"/>'}[slot];
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">${s}</svg>`;
}
function gearSvg(cx, cy, z, r) { const n = Math.min(24, z), t = []; for (let k = 0; k < n; k++) { const a = k / n * 2 * Math.PI; t.push(`<line x1="${(cx + (r - 1) * Math.cos(a)).toFixed(1)}" y1="${(cy + (r - 1) * Math.sin(a)).toFixed(1)}" x2="${(cx + (r + 4) * Math.cos(a)).toFixed(1)}" y2="${(cy + (r + 4) * Math.sin(a)).toFixed(1)}" stroke="#d9e2ec" stroke-width="3" stroke-linecap="round"/>`) } return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#26364f" stroke="#d9e2ec" stroke-width="2"/>${t.join('')}<circle cx="${cx}" cy="${cy}" r="${Math.max(4, r / 3)}" fill="#0c1626" stroke="#8aa0ba" stroke-width="2"/>` }

// ---- Werkbank-Szene (Fahrrad zerlegen/einbauen)
const KBP = [
  {id:'reifen', n:'Rad mit Reifen', en:'wheel and tyre', box:[228, 118, 104, 104], lab:'Rad', fact:'Der Reifenumfang bestimmt, wie weit das Rad bei einer Umdrehung rollt: 20 × 1,75 Zoll sind etwa 1,50 m.'},
  {id:'ritzel', n:'Ritzel', en:'sprocket', box:[52, 146, 56, 56], need:'reifen', fact:'Das Ritzel sitzt auf der Hinterradnabe. Mehr Zähne bedeuten leichteres Anfahren, weniger Tempo.'},
  {id:'kette', n:'Kettenblatt', en:'chainring', box:[140, 146, 62, 62], need:'ritzel', fact:'Das Kettenblatt sitzt an der Kurbel. Kettenblatt geteilt durch Ritzel ergibt die Übersetzung.'},
  {id:'licht', n:'Licht (Dynamo)', en:'light', box:[286, 70, 56, 38], fact:'Der Seitenläufer-Dynamo wird vom Reifen angetrieben und liefert 6 V und 3 W.'},
  {id:'hupe', n:'Klingel', en:'bell', box:[206, 30, 56, 34], fact:'Pflicht am Fahrrad: eine helltönende Klingel.'},
  {id:'zub', n:'Reflektoren und Zubehör', en:'reflectors', box:[8, 50, 76, 52], lab:'Reflektoren', fact:'Reflektoren machen dich im Dunkeln sichtbar. Strahler fürs Rad (Speichen) gehören dazu.'},
  {id:'gepaeck', n:'Gepäck', en:'luggage', box:[14, 106, 66, 28], opt:1, fact:'Gepäck am Heck erhöht Gewicht und Luftwiderstand.'},
  {id:'motor', n:'Hilfsmotor', en:'auxiliary engine', box:[250, 146, 56, 54], opt:1, need:'reifen', fact:'Ein Nabenmotor sitzt in der Radnabe und wird aus einem Akku gespeist.'}
];
const kList = (c, mode) => KBP.filter(p => mode === 'dis' ? !p.opt : !(p.opt && c.pick[p.id] === KORIG[p.id]));
function kPartSvg(id, c) {
  const o = kopt(id, c.pick[id]); const b = KBP.find(p => p.id === id).box, x = b[0], y = b[1], w = b[2], h = b[3];
  if (id === 'reifen') { const t = o.id === 'rs' ? 5 : o.id === 'rm' ? 9 : 14; return `<circle cx="80" cy="170" r="52" fill="none" stroke="#0a1220" stroke-width="${t}"/><circle cx="280" cy="170" r="52" fill="none" stroke="#0a1220" stroke-width="${t}"/><circle cx="80" cy="170" r="47" fill="none" stroke="#d9e2ec" stroke-width="2"/><circle cx="280" cy="170" r="47" fill="none" stroke="#d9e2ec" stroke-width="2"/>` }
  if (id === 'ritzel') return gearSvg(80, 170, o.z, 7 + o.z / 3.2);
  if (id === 'kette') return gearSvg(170, 176, o.z, 10 + o.z * .26);
  if (id === 'licht') return `<circle cx="318" cy="92" r="${o.id === 'la' ? 12 : 14}" fill="#d9e2ec"/><circle cx="324" cy="92" r="9" fill="${o.id === 'ld' ? '#ffd24a' : '#fffbd0'}"/>${o.id === 'la' ? '' : '<rect x="272" y="150" width="16" height="12" rx="4" fill="#8aa0ba" stroke="#d9e2ec"/>'}`;
  if (id === 'hupe') return `<path d="M222 58 A18 18 0 0 1 258 58Z" fill="#d9e2ec" stroke="#8aa0ba"/>${o.id === 'hk' ? '' : '<path d="M244 66 L270 52 L270 80Z" fill="#ff8a1f"/><circle cx="238" cy="72" r="6" fill="#ff453a"/>'}`;
  if (id === 'zub') return `<rect x="62" y="124" width="6" height="12" rx="2" fill="#ff453a"/><rect x="92" y="196" width="6" height="12" rx="2" fill="#ff453a"/>${o.id !== 'zn' ? '<path d="M30 100 L30 54 L62 64 L30 74" fill="#ff8a1f" stroke="#fff" stroke-width="2"/>' : ''}${o.tacho ? '<circle cx="270" cy="64" r="12" fill="#101c2f" stroke="#5fb8ff" stroke-width="2"/><text x="270" y="68" font-size="9" fill="#5fb8ff" text-anchor="middle">km/h</text>' : ''}`;
  if (id === 'gepaeck') return o.id === 'gr' ? '<path d="M14 112 L84 112 M20 112 L20 150 M80 112 L80 138" stroke="#d9e2ec" stroke-width="5" fill="none"/>' : '<rect x="10" y="94" width="72" height="44" rx="6" fill="#1f6fe0" stroke="#d9e2ec" stroke-width="3"/><rect x="26" y="108" width="40" height="6" rx="3" fill="#d9e2ec"/>';
  if (id === 'motor') return o.id === 'mp' ? '<circle cx="280" cy="170" r="22" fill="#1a2a42" stroke="#5fb8ff" stroke-width="4"/><path d="M282 154 L272 174 L280 174 L277 188 L291 166 L283 166Z" fill="#ffd24a"/>' : '<rect x="214" y="132" width="52" height="34" rx="6" fill="#8aa0ba" stroke="#d9e2ec"/><rect x="222" y="120" width="18" height="12" fill="#5a6b82"/><circle cx="276" cy="150" r="10" fill="#0a1220" stroke="#d9e2ec" stroke-width="3"/>';
  return '';
}
// ---- Foto-Szene (DDR-Mifa-Klapprad, Teile als Fotos). KFOTO = false schaltet auf die alte Zeichnung zurück.
const KFOTO = false;
const KIMG = id => 'v2/img/klapp/' + id + '.webp';
const KPF = {reifen:'rad', ritzel:'ritzel', kette:'kurbel', licht:'licht', hupe:'klingel', zub:'reflektor', gepaeck:'gepaeck', motor:'nabe'};
// Maßstab: Radstand ca. 1 m = 179 Einheiten; Rad 20 Zoll = 89 Einheiten. Hinterachse (108,183), Vorderachse (287,184), Tretlager (176,184).
const KBOXF = {reifen:[63,139,268,91], ritzel:[97,172,22,22], kette:[156,164,54,40], licht:[264,110,28,34], hupe:[216,48,26,20], zub:[56,148,24,22], gepaeck:[72,124,72,58], motor:[270,168,34,34]};
const kHit = id => { const b = KBOXF[id]; return `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" fill="transparent"/>` };
const kImg = (f, x, y, w, extra = '') => `<image href="${KIMG(f)}" x="${x}" y="${y}" width="${w}" ${extra}/>`;
function kPartF(id, c, c2) {
  const o = kopt(id, c.pick[id]), has = x => c2.present(x);
  if (id === 'reifen') { const k = o.id === 'rs' ? .97 : o.id === 'rb' ? 1.04 : 1, w = 89 * k;
    return [108, 287].map((cx, i) => kImg('rad', cx - w / 2, (i ? 184.5 : 183) - w / 2, w)).join('') }
  if (id === 'ritzel') return kImg('ritzel', 99, 174, 18 + (o.z - 16) * .9);
  if (id === 'kette') { const w = 50 * (o.z / 44) ** .7; return kImg('kurbel', 176 - w * .297, 184 - w * .3, w) }
  if (id === 'licht') return kImg('licht', 266, 112, 24) + (o.id === 'la' ? '<rect x="262" y="132" width="5" height="9" rx="2" fill="#5fb8ff"/>' : '');
  if (id === 'hupe') return kImg('klingel', 222, 50, 16) + (o.id === 'hg' ? '<circle cx="246" cy="58" r="6" fill="#ff8a1f" stroke="#fff" stroke-width=".8"/><path d="M251 58 L258 54 L258 63Z" fill="#ff8a1f"/>' : o.id === 'hx' ? '<rect x="243" y="53" width="16" height="10" rx="2" fill="#1c2230" stroke="#8aa0ba" stroke-width=".8"/><path d="M259 55 L266 51 L266 65 L259 61Z" fill="#8aa0ba"/>' : '');
  if (id === 'zub') { let g = (c.pick.gepaeck === 'gr' && (c2.mode === 'view' || has('gepaeck'))) ? '' : kImg('reflektor', 60, 150, 15);
    if (o.id !== 'zn' && has('reifen')) g += `<g transform="rotate(45 130 161)">${kImg('sp1', 122, 157, 16)}</g><g transform="rotate(-40 268 200)">${kImg('sp2', 260, 196, 16)}</g>`;
    if (o.id !== 'zn') g += '<path d="M69 148 L69 96" stroke="#d9e2ec" stroke-width="1.2"/><path d="M69 96 L69 82 L90 88 L69 94" fill="#ff8a1f" stroke="#fff" stroke-width=".8"/>';
    if (o.tacho) g += '<circle cx="232" cy="64" r="6" fill="#101c2f" stroke="#5fb8ff" stroke-width="1.2"/><text x="232" y="66" font-size="4.5" fill="#5fb8ff" text-anchor="middle">km/h</text>';
    return g }
  if (id === 'gepaeck') return o.id === 'gb' ? '<rect x="76" y="94" width="62" height="36" rx="5" fill="#1f6fe0" stroke="#d9e2ec" stroke-width="1.5"/><rect x="92" y="104" width="30" height="4" rx="2" fill="#d9e2ec"/>' : `<g transform="translate(143 0) scale(-1 1)">${kImg('gepaeck', 73, 126, 70)}</g>`.replace('translate(143 0)', 'translate(216 0)');
  if (id === 'motor') return o.id === 'mp' ? kImg('nabe', 280, 177, 14) + kImg('akku', 134, 88, 17) : '<rect x="190" y="150" width="34" height="22" rx="4" fill="#8aa0ba" stroke="#d9e2ec"/><rect x="196" y="142" width="12" height="8" fill="#5a6b82"/><circle cx="230" cy="161" r="7" fill="#0a1220" stroke="#d9e2ec" stroke-width="1.5"/>';
  return '';
}
function kBoardF(c, mode) {
  const lst = kList(c, mode), has = id => lst.some(p => p.id === id), present = id => mode === 'view' || (mode === 'dis' ? !c.took.includes(id) : c.put.includes(id));
  const canDis = p => !p.need || c.took.includes(p.need), canAsm = p => ({reifen:'ritzel', ritzel:'kette', motor:'reifen'}[p.id]) ? c.put.includes({reifen:'ritzel', ritzel:'kette', motor:'reifen'}[p.id]) : true;
  const c2 = {present, mode};
  const part = p => { if (!has(p.id)) return ''; const on = present(p.id), nd = mode === 'dis' ? canDis(p) : canAsm(p), b = KBOXF[p.id];
    if (on) return `<g class="bp ${mode !== 'view' && nd ? 'go' : ''} ${mode === 'asm' && W2.last === p.id ? 'in' : ''}" data-id="${p.id}" onclick="w2Tap('${p.id}')">${kHit(p.id)}${kPartF(p.id, c, c2)}</g>`;
    if (mode !== 'asm') return '';
    const lab = p.lab || p.n.split(' ')[0], rw = p.id === 'reifen', fs = rw ? 8 : Math.min(7, (b[2] - 4) / (lab.length * .58)).toFixed(1);
    return `<g class="ghost ${nd ? 'go' : ''}" data-id="${p.id}" onclick="w2Tap('${p.id}')">${rw ? [108, 287].map((cx, i) => `<circle cx="${cx}" cy="${i ? 184.5 : 183}" r="44" fill="rgba(95,184,255,${i ? .08 : .05})" stroke="var(--a)" stroke-dasharray="5 4" opacity="${nd ? .9 : .3}"/>`).join('') : `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="5" stroke-dasharray="4 3" opacity="${nd ? .9 : .3}"/>`}<text x="${rw ? 287 : b[0] + b[2] / 2}" y="${rw ? 188 : b[1] + b[3] / 2 + 3}" font-size="${fs}" text-anchor="middle" opacity="${nd ? 1 : .5}">${lab}</text></g>` };
  let s = `<svg viewBox="0 0 360 260" width="100%" class="bsvg"><defs><linearGradient id="kwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b525f"/><stop offset="1" stop-color="#2a2e36"/></linearGradient><linearGradient id="kbench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a2b"/><stop offset="1" stop-color="#4b3220"/></linearGradient></defs>
  <rect width="360" height="260" fill="url(#kwall)"/><rect y="232" width="360" height="28" fill="url(#kbench)"/><rect y="230" width="360" height="3" fill="#2a1b10"/><ellipse cx="195" cy="231" rx="135" ry="3.5" fill="#000" opacity=".4"/>`;
  s += part(KBP[0]);
  s += `<image href="${KIMG('rahmen')}" x="70" y="34" width="220" style="pointer-events:none"/>`;
  if (present('ritzel') && present('kette') && has('ritzel') && has('kette')) s += '<path d="M176 167.5 L108 174.5 M176 200.5 L108 192.5" stroke="#3b3f46" stroke-width="1.6" stroke-dasharray="2 1.2" fill="none"/>';
  KBP.slice(1).forEach(p => { s += part(p) });
  return s + '</svg>';
}
function kBoard(c, mode) {
  if (KFOTO) return kBoardF(c, mode);
  const lst = kList(c, mode), has = id => lst.some(p => p.id === id), present = id => mode === 'view' || (mode === 'dis' ? !c.took.includes(id) : c.put.includes(id));
  const canDis = p => !p.need || c.took.includes(p.need), canAsm = p => ({reifen:'ritzel', ritzel:'kette', motor:'reifen'}[p.id]) ? c.put.includes({reifen:'ritzel', ritzel:'kette', motor:'reifen'}[p.id]) : true;
  let s = `<svg viewBox="0 0 360 260" width="100%" class="bsvg"><defs><linearGradient id="kwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31363f"/><stop offset="1" stop-color="#1b1e24"/></linearGradient><linearGradient id="kbench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a2b"/><stop offset="1" stop-color="#4b3220"/></linearGradient></defs>
  <rect width="360" height="260" fill="url(#kwall)"/><rect y="232" width="360" height="28" fill="url(#kbench)"/><rect y="230" width="360" height="3" fill="#2a1b10"/>
  <path d="M80 170 L172 176 L262 84 M172 176 L152 70" stroke="#1f6fe0" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="214" cy="118" r="6" fill="#d9e2ec"/><path d="M262 84 L280 170" stroke="#d9e2ec" stroke-width="6" fill="none"/><path d="M248 66 L270 66 M258 66 L262 84" stroke="#d9e2ec" stroke-width="5" stroke-linecap="round"/><path d="M136 66 Q154 58 174 66" stroke="#0a1220" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M172 176 L196 198 M172 176 L150 156" stroke="#8aa0ba" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="170" r="5" fill="#5fb8ff"/><circle cx="280" cy="170" r="5" fill="#5fb8ff"/>`;
  if (!present('ritzel') || !present('kette')) { /* Kette hängt lose */ } else s += '<path d="M170 154 L80 160 M170 198 L80 180" stroke="#8aa0ba" stroke-width="1.6" stroke-dasharray="3 2"/>';
  KBP.forEach(p => {
    if (!has(p.id)) return; const on = present(p.id), nd = mode === 'dis' ? canDis(p) : canAsm(p), b = p.box;
    if (on) s += `<g class="bp ${mode !== 'view' && nd ? 'go' : ''} ${mode === 'asm' && W2.last === p.id ? 'in' : ''}" data-id="${p.id}" onclick="w2Tap('${p.id}')">${kPartSvg(p.id, c)}</g>`;
    else if (mode === 'asm') { const lab = p.lab || p.n.split(' ')[0], fs = Math.min(10, (b[2] - 10) / (lab.length * .58)).toFixed(1), rw = p.id === 'reifen';
      s += `<g class="ghost ${nd ? 'go' : ''}" data-id="${p.id}" onclick="w2Tap('${p.id}')">${rw ? `<circle cx="80" cy="170" r="52" fill="rgba(95,184,255,.05)" stroke="var(--a)" stroke-dasharray="5 4" opacity="${nd ? .5 : .25}"/><circle cx="280" cy="170" r="52" fill="rgba(95,184,255,.08)" stroke="var(--a)" stroke-dasharray="5 4" opacity="${nd ? .9 : .3}"/>` : `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="10" stroke-dasharray="5 4" opacity="${nd ? .9 : .3}"/>`}<text x="${rw ? 280 : b[0] + b[2] / 2}" y="${rw ? 148 : b[1] + b[3] / 2 + 4}" font-size="${fs}" text-anchor="middle" opacity="${nd ? 1 : .4}">${lab}</text></g>` }
  });
  return s + '</svg>';
}
const kVb = p => ({reifen:'20 110 120 120', motor:'230 120 100 100', licht:'260 70 90 100', hupe:'206 26 70 50', zub:'10 40 100 180', gepaeck:'4 86 92 70', ritzel:'50 140 60 60', kette:'135 140 70 70'}[p.id]);
const kTray = (c, mode) => { const ids = mode === 'dis' ? c.took : kList(c, 'asm').map(p => p.id).filter(i => !c.put.includes(i));
  return `<div class="tray"><b>${mode === 'dis' ? 'Auf dem Werktisch' : 'Noch einzubauen'}</b><div>${ids.length ? ids.map(i => { const p = KBP.find(x => x.id === i); return `<button class="chip2" ${mode === 'asm' ? `onclick="w2Tap('${i}')"` : ''}><span class="tm">${KFOTO ? `<img src="${KIMG(KPF[i])}" width="36" height="30" style="object-fit:contain" alt="">` : `<svg viewBox="${kVb(p)}" width="36" height="30" preserveAspectRatio="xMidYMid meet">${kPartSvg(i, c)}</svg>`}</span>${p.n}<small>${p.en}</small></button>` }).join('') : '<span class="m">noch nichts</span>'}</div></div>` };

// ---- Prüfstandskurve: Widerstand gegen Muskel (Watt über km/h)
function kCurve(p, base, anim = true, cur) {
  const W = 320, H = 190, L = 38, B = 24, T = 20, vm = 50, top = Math.max(300, Math.ceil(Math.max(p.need(vm / 3.6), p.avail(p.vmax / 3.6 || 1), (base.pm(8) + 100)) / 100) * 100), xs = v => L + v / vm * (W - L - 8), ys = w => H - B - Math.min(w, top) / top * (H - B - T);
  let g = ''; const st = top / 4; for (let i = 0; i <= 4; i++) g += `<line x1="${L}" x2="${W - 8}" y1="${ys(i * st)}" y2="${ys(i * st)}" stroke="#fff" opacity=".1"/><text x="${L - 6}" y="${ys(i * st) + 4}" fill="#9a9aa2" font-size="10" text-anchor="end">${Math.round(i * st)}</text>`;
  for (let v = 0; v <= vm; v += 10) g += `<text x="${xs(v)}" y="${H - 8}" fill="#9a9aa2" font-size="10" text-anchor="middle">${v}</text>`;
  const line = (f, n) => { let d = ''; for (let k = 0; k <= n; k++) { const v = k * vm / n; d += (k ? 'L' : 'M') + xs(v).toFixed(1) + ' ' + ys(f(v / 3.6)).toFixed(1) } return d };
  const mark = cur != null ? `<line x1="${xs(cur)}" x2="${xs(cur)}" y1="${T}" y2="${H - B}" stroke="#ffd24a" stroke-width="1.5" stroke-dasharray="3 3"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" id="kcv"><rect width="${W}" height="${H}" rx="14" fill="#0e1014"/>${g}<text x="8" y="14" fill="#9a9aa2" font-size="10">Watt über km/h: Widerstand und Muskelkraft</text>
  <path d="${line(base.need, 60)}" stroke="#7d818a" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
  <path d="${line(v => p.need(v) * KETA, 60)}" stroke="#ff8a6b" stroke-width="3" fill="none"/>
  <path class="${anim ? 'draw' : ''}" d="${line(p.avail, 80)}" stroke="var(--a)" stroke-width="3.5" fill="none" stroke-linecap="round" pathLength="1"/>${mark}
  ${p.vmax ? `<circle cx="${xs(p.vmax)}" cy="${ys(p.avail(p.vmax / 3.6))}" r="5" fill="#fff"/><text x="${Math.min(xs(p.vmax), W - 40)}" y="${ys(p.avail(p.vmax / 3.6)) - 10}" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${String(Math.round(p.vmax * 10) / 10).replace('.', ',')} km/h</text>` : ''}</svg>`;
}
const kde = (x, d = 1) => (+x).toFixed(d).replace('.', ',');
function kReadout(c, cad) { const P = window.KCUR; if (!P) return; const p = P.p, v = p.vOf(cad), w = p.need(v) * KETA / KETA, av = p.avail(v), ok = av >= p.need(v) * KETA - .01;
  const set = (id, t) => { const e = document.getElementById(id); if (e) e.innerHTML = t };
  set('kc', cad + ' U/min'); set('kv', kde(v * 3.6) + ' km/h'); set('kn', Math.round(p.need(v) * KETA) + ' W'); set('ka', Math.round(av) + ' W');
  set('kok', ok ? 'Das schaffst du: deine Muskeln liefern genug Watt.' : 'Zu viel Widerstand für diese Trittfrequenz: Du kannst das Tempo nicht halten.');
  const b = document.getElementById('kok'); if (b) b.className = ok ? 'okm' : 'warn';
  const cv = document.getElementById('kcv'); if (cv) { P.curCad = cad; const box = cv.parentNode; box.innerHTML = kCurve(p, P.base, false, v * 3.6) } }
const kCard = (p, base, cur, extra = '') => { window.KCUR = {p, base, curCad: cur}; const cad = cur, v = p.vOf(cad);
  return `<div class="crv">${kCurve(p, base, true, v * 3.6)}</div><div class="spec"><div><span>Muskel + Motor</span><b>${Math.round(p.watt)} W</b></div><div><span>Übersetzung</span><b>${kde(p.i, 2)}</b></div><div><span>Spitze</span><b>${kde(p.vmax)} km/h</b></div><div><span>Bei 60 U/min</span><b>${kde(p.v60)} km/h</b></div></div>
  <div class="card" style="margin-top:8px"><b>Muskel-Prüfstand</b><p class="m">Stell die Trittfrequenz ein. Die Kurve zeigt: <b style="color:#ff8a6b">rot</b> den Widerstand (Rollen + Luft), <b style="color:var(--a)">blau</b> deine Muskelkraft. Grau gestrichelt: Serie.</p>
  <input type="range" min="30" max="130" value="${cad}" style="width:100%" oninput="kReadout(null,+this.value)"><div class="spec"><div><span>Trittfrequenz</span><b id="kc">${cad} U/min</b></div><div><span>Tempo</span><b id="kv">${kde(v * 3.6)} km/h</b></div><div><span>Widerstand</span><b id="kn">${Math.round(p.need(v) * KETA)} W</b></div><div><span>Deine Kraft</span><b id="ka">${Math.round(p.avail(v))} W</b></div></div><p class="${p.avail(v) >= p.need(v) * KETA - .01 ? 'okm' : 'warn'}" id="kok">${p.avail(v) >= p.need(v) * KETA - .01 ? 'Das schaffst du: deine Muskeln liefern genug Watt.' : 'Zu viel Widerstand für diese Trittfrequenz: Du kannst das Tempo nicht halten.'}</p>${extra}</div>`;
};
function kGauge(val) { const a = -120 + 240 * Math.min(1, val / 50); return `<svg viewBox="0 0 200 120" width="260"><path d="M20 110 A80 80 0 1 1 180 110" stroke="#1a2a42" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 110 A80 80 0 1 1 180 110" stroke="url(#gGold)" stroke-width="12" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${Math.min(1, val / 50)} 1" id="gp"/><defs><linearGradient id="gGold" x1="0" x2="1"><stop offset="0" stop-color="#5fb8ff"/><stop offset="1" stop-color="#d9e2ec"/></linearGradient></defs><g id="gn" style="transform-origin:100px 100px;transform:rotate(${a}deg);transition:transform 1.8s cubic-bezier(.2,.8,.2,1)"><path d="M98 100 L100 34 L102 100Z" fill="#ff453a"/><circle cx="100" cy="100" r="7" fill="#ddd"/></g><text x="100" y="92" text-anchor="middle" fill="#fff" font-size="26" font-weight="800" id="gt2">${kde(val)}</text><text x="100" y="118" text-anchor="middle" fill="#8aa0ba" font-size="11">km/h (Skala bis 50)</text></svg>` }

// ---- Ansichten (statt der Motor-Ansichten, nur für das Klapprad)
const isK = () => W2.veh === 'klapp';
const kV = () => V2V.klapp;
const kBase = () => kperf(KORIG, 30, false);
const kCost = pick => Math.round(KSLOTS.reduce((a, s) => a + kopt(s, pick[s]).price, 0) * 100) / 100;
function kSelect() {
  const v = kV(), c = W2.cars.klapp, run2 = c && c.ph > 1, b = kBase();
  return `<div class="hud"><span class="pill">${rankW2()}</span><span class="pill">🔧 ${W2.orders} Aufträge</span><span class="pill" style="margin-left:auto">Budget ${BUDGET} €</span></div>
  <div class="mods">${V2ORDER.map(k => `<button class="${k === v.id ? 's' : ''}" onclick="w2Sel('${k}')">${V2V[k].name.replace('Simson ', '').replace(' (SR4-2)', '').replace('Schwalbe KR51/2', 'Schwalbe').replace('Mifa ', '')}</button>`).join('')}</div>
  <div class="lay"><div class="la">${carPic(v, false)}</div><div class="lb2"><h1 style="margin-top:10px">${v.name}</h1><div class="m">${v.sub}</div><p class="m">${v.text}</p>
  ${statBar('Muskelkraft (Dauer)', 'ca. ' + KPMAX + ' W', KPMAX / 3)}${statBar('Tempo bei Serie', 'ca. ' + kde(b.vmax, 0) + ' km/h', b.vmax * 2)}
  <div class="spec"><div><span>Räder</span><b>20 Zoll</b></div><div><span>Gewicht</span><b>ca. 15 kg</b></div><div><span>Gebaut</span><b>1967–1990</b></div><div><span>Antrieb</span><b>Muskeln</b></div></div>
  <div class="m">${run2 ? 'Auftrag läuft: Schritt ' + Math.min(c.ph, 6) + ' von 6' : 'Neuer Auftrag'}</div>${run2 ? `<button class="btn" onclick="w2Pick('klapp')">Auftrag fortsetzen</button>` : '<div class="lkcard">🔧 Tuning für das Klapprad kommt später. Lackieren, Waschen und Prüfstand gehen schon.</div><button class="btn" disabled>Tuning kommt später</button>'}</div></div>
  <p class="m">Abbauen, Teile wählen, einbauen, Muskel-Prüfstand, Abnahme. Aufgaben zu Übersetzung, Hebel, Dynamo und Strom. Hersteller: Mifa (Mitteldeutsche Fahrradwerke), Sangerhausen. Modelle 901, 903 und 904. Zähnezahlen, Preise und Watt sind Spielwerte.</p>
  <h2>Deine Sachen</h2><div class="fgrid"><button class="fc" onclick="go('gal')"><i>Garage-Galerie</i><b>${W2.garage.length} Umbauten</b></button><button class="fc" onclick="go('alb')"><i>Kartenalbum</i><b>${W2.album.length} Karten</b></button><button class="fc" onclick="go('lbd')"><i>Familien-Bestenliste</i><b>${W2.players.length || 1} Spieler</b></button><button class="fc" onclick="startMix()"><i>Mix-Training</i><b>8 gemischte Aufgaben</b></button><button class="fc" onclick="go('hub')"><i>Missionen und Werkzeug</i><b>Fehlersuche, Kunden, Tagesauftrag</b></button></div>
  ${(W2.kb || []).length ? `<h2>Fertige Klappräder</h2>${W2.kb.slice(-3).reverse().map(g => `<div class="item"><div class="dot" style="background:rgba(var(--ar),.18)">🚲</div><div><b>${esc(g.name)}</b><span class="m">${kde(g.vmax)} km/h · ${Math.round(g.watt)} W · ${g.date}</span></div></div>`).join('')}` : ''}`;
}
function kAuftrag(c, v) {
  const b = kBase();
  return w2Head('Auftrag', c) + `<div class="lay"><div class="la">${carPic(v, false)}</div><div class="lb2">
  <div class="card"><b>Auftragskarte</b><p>Kunde: Herr Krause. „Das Mifa-Klapprad stand lange im Keller. Ich möchte es aufmöbeln: besser sehen, mehr Spaß, vielleicht schneller. Ich habe <b>${BUDGET} €</b> für Teile. Es soll aber fahrtüchtig und verkehrssicher bleiben.“</p>
  <p class="m">Dein Ziel: Spaßige Umbauten, die zusammenpassen und die Straßenregeln beachten. Nicht alles, was Spaß macht, ist auf der Straße erlaubt.</p></div>
  <div class="card"><b>Steckbrief (Serie, gerundet)</b><div class="spec"><div><span>Reifen</span><b>20 Zoll</b></div><div><span>Gewicht</span><b>ca. 15 kg</b></div><div><span>Übersetzung (Spiel)</span><b>${kde(b.i, 2)}</b></div><div><span>Tempo bei 60 U/min</span><b>${kde(b.v60)} km/h</b></div></div><p class="m">Zähnezahlen sind Spielwerte. Echte Räder bitte nachzählen.</p></div>
  <button class="btn" onclick="w2Mission(1)">Auftrag annehmen (Aufgaben)</button></div></div>`;
}
function kDis(c, v) {
  const n = kList(c, 'dis').length, done = c.took.length === n;
  return w2Head('Abbauen', c) + `${rotHint()}<div class="lay"><div class="la"><div class="board">${kBoard(c, 'dis')}</div></div><div class="lb2"><p class="m">Tippe die Teile an. Erst das Rad, dann Ritzel (sitzt auf der Hinterradnabe), dann Kettenblatt. Licht, Klingel und Reflektoren kannst du jederzeit abbauen. <b>Rad sicher aufbocken!</b></p>${kTray(c, 'dis')}
  <button class="btn" ${done ? '' : 'disabled'} onclick="w2Mission(2)">${done ? 'Alles abgebaut: Aufgaben' : 'Noch ' + (n - c.took.length) + ' Teile'}</button></div></div>`;
}
function kAsm(c, v) {
  const n = kList(c, 'asm').length, done = c.put.length === n;
  return w2Head('Einbauen', c) + `${rotHint()}<div class="lay"><div class="la"><div class="board">${kBoard(c, 'asm')}</div></div><div class="lb2"><p class="m">Jetzt kommen die neuen Teile an die richtige Stelle. Reihenfolge: Kettenblatt, Ritzel, Rad mit Reifen (dann die Kette auflegen). Danach Licht, Klingel, Zubehör. Tippe auf die gestrichelten Felder oder die Teile unten.</p>${kTray(c, 'asm')}
  <button class="btn" ${done ? '' : 'disabled'} onclick="w2Mission(4)">${done ? 'Alles eingebaut: Aufgaben' : 'Noch ' + (n - c.put.length) + ' Teile'}</button></div></div>`;
}
function kTap(id) {
  const c = car(), p = KBP.find(x => x.id === id), mode = c.ph === 2 ? 'dis' : 'asm', el = document.querySelector(`.bp[data-id="${id}"],.ghost[data-id="${id}"]`);
  if (mode === 'dis') {
    if (c.took.includes(id)) return; if (p.need && !c.took.includes(p.need)) { toast('Erst ' + KBP.find(x => x.id === p.need).n + ' abbauen.'); return }
    c.took.push(id); FX.ratchet(); FX.burstAt(el, 14); if (el) el.classList.add('out'); toast(p.n + ' (' + p.en + '): ' + p.fact); w2save();
    setTimeout(() => { if (view === 'w2') $('#app').innerHTML = w2View() }, 480);
  } else {
    if (c.put.includes(id)) return; const need = {ritzel:'kette', reifen:'ritzel', motor:'reifen'}[id];
    if (need && !c.put.includes(need)) { toast('Erst ' + KBP.find(x => x.id === need).n + ' einbauen.'); return }
    c.put.push(id); W2.last = id; FX.clink(); FX.air(); toast(p.n + ' sitzt. Schrauben mit dem richtigen Anzugsmoment festziehen.'); w2save();
    $('#app').innerHTML = w2View(); const n = document.querySelector(`.bp[data-id="${id}"]`); FX.burstAt(n, 12); W2.last = null;
  }
}
const kTag = t => t === 'Original' ? 'to' : t === 'Motor' ? 'tr' : 'tt';
function kShop(c, v) {
  const sp = kCost(c.pick), p = kperf(c.pick, c.jet, false), b = kBase(), over = sp > BUDGET + 1e-9;
  return w2Head('Teile wählen', c) + `<div class="lay"><div class="la">${carPic(v, false)}${statBar('Tempo (Spitze)', kde(p.vmax) + ' km/h', p.vmax * 2)}${statBar('Kosten', eu(sp) + ' / ' + BUDGET + ' €', sp / BUDGET * 100, over ? '#ff453a' : 'var(--g)')}</div><div class="lb2">
  <div class="card live"><div class="spec"><div><span>Übersetzung</span><b>${kde(p.i, 2)}</b></div><div><span>Bei 60 U/min</span><b>${kde(p.v60)} km/h</b></div><div><span>Gewicht Fahrer + Rad</span><b>${kde(p.kg)} kg</b></div></div>
  ${p.notes.length ? `<p class="warn">${esc(p.notes[0])}</p>` : '<p class="m">Die Teile passen zusammen.</p>'}${!p.legal ? `<p class="m">⚠ Nicht für die Straße: ${p.illegal.map(k => KCAT[k].n).join(', ')}. Dafür gelten besondere Regeln (Klingel statt Hupe, Hilfsmotor = Mofa mit Betriebserlaubnis). Sonst nur auf Privatgelände.</p>` : ''}<div class="m">${over ? 'Über dem Budget: Wähle günstigere Teile.' : 'Noch ' + eu(BUDGET - sp) + ' frei.'}</div></div>
  ${KSLOTS.map(s => `<h2>${KCAT[s].n} · ${KCAT[s].en}</h2><div class="hscroll">${KCAT[s].opts.map(o => `<button class="opt2 ${c.pick[s] === o.id ? 'sel' : ''}" onclick="w2Choose('${s}','${o.id}')"><span class="tag ${kTag(o.tag)}">${o.tag}${o.legal === false ? ' · nicht Straße' : ''}</span><div class="pimg">${kIcon(s, o)}</div><b>${o.n}</b><span class="pr">${o.price ? eu(o.price) : 'ist verbaut'}</span><span class="m">${o.info}</span></button>`).join('')}</div>`).join('')}
  <p class="m">Preise und Werte sind gerundete Beispiele zum Rechnen, keine Angebote.</p>
  <button class="btn" ${over ? 'disabled' : ''} onclick="w2Mission(3)">${over ? 'Budget überschritten' : 'Teile bestellen (Aufgaben)'}</button></div></div>`;
}
function kDyno(c, v) {
  const p = kperf(c.pick, c.jet, !!c.lamp), b = kBase(), good = p.state === 'richtig', L = kopt('licht', c.pick.licht), r = kopt('reifen', c.pick.reifen);
  const lampB = L.drag ? `<button class="btn alt" onclick="kLamp()">${c.lamp ? 'Licht ausschalten' : 'Dynamo-Licht einschalten'}<small style="display:block;font-weight:500;text-transform:none">Der Dynamo bremst: ca. ${L.drag} W Verlust</small></button>` : '';
  return w2Head('Muskel-Prüfstand', c) + `${rotHint()}<div class="lay dy"><div class="la">${kCard(p, b, 70)}</div><div class="lb2"><div class="card"><b>Reifendruck einstellen</b><p class="m">Zu weich: Der Reifen walkt, das Rad rollt schwer. Im grünen Bereich (75 % bis 100 % des Maximums) rollt es am besten. Über dem Maximum: Platzgefahr.</p>
  <div class="jet"><button onclick="kJet(-2)">−</button><div class="kz" style="width:64px;height:64px">${kIcon('reifen', r)}</div><div><span class="m" style="display:block">Reifendruck</span><b style="font-size:30px">${kde(c.jet / 10)} bar</b><div class="m">${p.state} · max. ${kde(r.pmax / 10)} bar</div></div><button onclick="kJet(2)">+</button></div>
  <p class="${good ? 'okm' : 'warn'}">${good ? 'Passt. Das Rad rollt gut.' : esc(p.notes[0] || '')}</p>${lampB}
  <button class="btn" onclick="kRun()">Prüfstand starten</button></div>
  <div class="card center"><b>Probefahrt auf dem Prüfgelände</b>${kGauge(c.drove ? p.vmax : 0)}<button class="btn alt" id="drv" ${good ? '' : 'disabled'} onclick="kDrive()">${c.drove ? 'Nochmal fahren' : good ? 'Probefahrt starten' : 'Erst den Reifendruck einstellen'}</button></div>
  <button class="btn" id="nxd" ${good && c.drove ? '' : 'disabled'} onclick="w2Mission(5)">Abnahme (Aufgaben)</button></div></div>`;
}
function kFree() {
  const v = kV(), cc = W2.cars.klapp, pick = cc ? cc.pick : KORIG, jet = cc ? cc.jet : 30, p = kperf(pick, jet, false), b = kBase();
  return `${rotHint()}<div class="hud"><span class="pill">Muskel-Prüfstand</span><span class="pill" style="margin-left:auto">Reifendruck ${kde(jet / 10)} bar</span></div>
  <div class="mods">${V2ORDER.map(k => `<button class="${k === v.id ? 's' : ''}" onclick="w2Sel('${k}')">${V2V[k].name.replace('Simson ', '').replace(' (SR4-2)', '').replace('Schwalbe KR51/2', 'Schwalbe').replace('Mifa ', '')}</button>`).join('')}</div>
  <div class="lay dy"><div class="la">${kCard(p, b, 70)}</div><div class="lb2"><p class="m">${cc ? 'Mit den Teilen aus deinem laufenden Auftrag.' : 'Serienzustand.'} Beim Klapprad misst der Prüfstand deine Muskelkraft in Watt. Die Prüfung im Auftrag ist Schritt 5.</p><button class="btn" onclick="kRun()">Prüfstand starten</button>${cc ? `<button class="btn alt" onclick="w2Pick('klapp')">Zum Auftrag</button>` : ''}</div></div>`;
}
function kLamp() { const c = car(); c.lamp = !c.lamp; c.drove = false; w2save(); const y = scrollY; $('#app').innerHTML = w2View(); scrollTo(0, y) }
function kJet(d) { const c = car(); c.jet = Math.max(10, Math.min(70, c.jet + d)); c.drove = false; w2save(); FX.clink(); const y = scrollY; $('#app').innerHTML = w2View(); scrollTo(0, y) }
function kRun() { const c = car(); if (c) { c.ran = true; w2save() } FX.rev(2.6); const cv = document.querySelector('.crv'); if (cv && window.KCUR) cv.innerHTML = kCurve(KCUR.p, KCUR.base, true, KCUR.p.vOf(70) * 3.6); toast('Messung läuft: Kurve zeigt Widerstand und Muskelkraft.') }
function kDrive() {
  const c = car(), p = kperf(c.pick, c.jet, !!c.lamp); c.drove = true; c.ran = true; w2save(); ride('🚲💨'); FX.rev(2.6); const n = $('#gn'), t = $('#gt2'); if (!n) return;
  n.style.transform = `rotate(${-120 + 240 * Math.min(1, p.vmax / 50)}deg)`; const gp = $('#gp'); if (gp) gp.setAttribute('stroke-dasharray', Math.min(1, p.vmax / 50) + ' 1');
  let k = 0; const iv = setInterval(() => { k += 3; if (t) t.textContent = kde(Math.min(p.vmax, k * p.vmax / 60)); if (k >= 60) { clearInterval(iv); const b = $('#drv'); if (b) b.textContent = 'Nochmal fahren'; const nx = $('#nxd'); if (nx) nx.disabled = false; toast(kde(p.vmax) + ' km/h auf dem Prüfgelände.') } }, 60); timers.push(iv);
}
function kBuild(c, v) { const p = kperf(c.pick, c.jet, false); return {id: 'klapp', key: 'klapprad', name: v.name, vmax: Math.round(p.vmax * 10) / 10, watt: p.watt, i: Math.round(p.i * 100) / 100, parts: KSLOTS.map(s => kopt(s, c.pick[s]).n), pick: Object.assign({}, c.pick), jet: c.jet, legal: p.legal, cost: kCost(c.pick), date: new Date().toLocaleDateString('de-DE'), player: W2.player || ''} }
function kCert(c, v) {
  const p = kperf(c.pick, c.jet, false), l = KSLOTS.map(s => kopt(s, c.pick[s]));
  return w2Head('Abnahme', c) + `<div class="lay"><div class="la"><div class="cert"><div class="cl">WERKSTATT-ABNAHME</div><h1>${v.name}</h1><div class="car" style="aspect-ratio:16/9">${pic(v.key, '', v.name)}</div>
  <div class="spec"><div><span>Übersetzung</span><b>${kde(p.i, 2)}</b></div><div><span>Muskel + Motor</span><b>${Math.round(p.watt)} W</b></div><div><span>Höchstgeschw.</span><b>${kde(p.vmax)} km/h</b></div><div><span>Reifendruck</span><b>${kde(c.jet / 10)} bar</b></div></div>
  <p class="m">${l.map(o => o.n).join(' · ')}</p>${!p.legal ? '<p class="m">Hinweis: Dieser Aufbau enthält Teile, die im Straßenverkehr nicht erlaubt sind (' + p.illegal.map(k => kopt(k, c.pick[k]).n).join(', ') + '). Nur für Privatgelände. Auf der Straße: Fahrrad mit Klingel, Licht und Reflektoren; Hilfsmotor nur als geprüftes Pedelec oder Mofa mit Betriebserlaubnis.</p>' : '<p class="m">Dieser Aufbau ist verkehrssicher: Klingel, Licht und Reflektoren sind vorhanden.</p>'}</div></div>
  <div class="lb2"><button class="btn alt" onclick="w2Finish()">Auftrag abschließen und Neues holen</button></div></div>`;
}
function kFinish() { const c = car(), v = veh(); if (!c.cert) { c.cert = 1; W2.orders++; W2.kb = (W2.kb || []).concat([kBuild(c, v)]) } delete W2.cars[v.id]; W2.veh = null; w2save(); go('w2') }

// ---- Lernaufgaben
function kMission(ph) {
  const c = car(), v = veh(), p = kperf(c.pick, c.jet, false), ki = kopt('kette', c.pick.kette), ri = kopt('ritzel', c.pick.ritzel), re = kopt('reifen', c.pick.reifen), sp = kCost(c.pick); let m;
  const rk = Math.round(kRadius(ki.z) * 10) / 10, F = 300, r = .16, MD = F * r, FK = MD / (rk / 1000), i2 = Math.round(p.i * 100) / 100, sfx = x => String(x).replace('.', ',');
  if (ph === 1) m = {title:'Auftragsannahme Klapprad', sub:'Kunde, Auftrag, Regeln', min:7, steps:[
    W('Neuer Auftrag in der Werkstatt', `Ein guter Mechaniker schreibt den Auftrag auf: **Fahrzeug**, **Kundenwunsch**, **Budget** und **Datum**.\n\nHeute: ${v.name}, Wunsch: Spaß-Umbauten, Budget ${BUDGET} €.`, 'Das Mifa-Klapprad wurde von 1967 bis 1990 in Sangerhausen gebaut.'),
    O('Auftragsannahme in der richtigen Reihenfolge', ['Kunden begrüßen', 'Wunsch aufschreiben', 'Fahrrad prüfen', 'Kostenvoranschlag nennen', 'Auftrag unterschreiben lassen'], 'Bringe die Schritte in die richtige Reihenfolge.'),
    (BUDGET >= 229.9 ? N(`Das Budget ist ${BUDGET} €. Ein Pedelec-Satz kostet 229,90 €. Wie viel Euro bleiben?`, Math.round((BUDGET - 229.9) * 100) / 100, `${BUDGET} − 229,90 = ${sfx((BUDGET - 229.9).toFixed(2))}.`, {unit:'€'}) : N(`Das Budget ist ${BUDGET} €. Ein Pedelec-Satz kostet 229,90 €. Wie viel Euro fehlen noch?`, Math.round((229.9 - BUDGET) * 100) / 100, `229,90 − ${BUDGET} = ${sfx((229.9 - BUDGET).toFixed(2))}.`, {unit:'€'})),
    TF('Regeln am Fahrrad', [['Ein Fahrrad braucht eine helltönende Klingel.', true, 'Das ist Vorschrift.'], ['Eine Gummiball-Hupe darf anstelle der Klingel fahren.', false, 'Andere Schallzeichen als eine Klingel sind am Fahrrad unzulässig.'], ['Beim Schrauben stellt man das Rad sicher auf einen Montageständer oder legt es sicher ab.', true, '']]),
    X('Sprich den Kunden an: Begrüße ihn, nenne sein Fahrrad und fasse seinen Wunsch in drei Sätzen zusammen.', 'Tipp: „Guten Tag Herr Krause. Ich habe verstanden, Sie möchten …“', 45)]};
  if (ph === 2) m = {title:'Fahrrad zerlegen wie ein Profi', sub:'Teilenamen, Reihenfolge, Hebel', min:8, steps:[
    M('Teile-Quiz Deutsch und Englisch', [['Kettenblatt', 'chainring'], ['Ritzel', 'sprocket'], ['Kette', 'chain'], ['Speiche', 'spoke'], ['Klingel', 'bell'], ['Reflektor', 'reflector']], 'Ordne zu.'),
    O('Hinterrad ausbauen (Anleitung)', ['Fahrrad sicher aufbocken', 'Kette vom Ritzel nehmen', 'Achsmuttern lösen', 'Rad nach hinten herausziehen'], 'Schreibe die Anleitung in der richtigen Reihenfolge. Signalwörter: zuerst, dann, danach, zum Schluss.'),
    Q('Warum sitzt die Kurbel wie ein langer Hebel?', 'Ein langer Hebel macht mehr Drehmoment aus derselben Kraft', ['Damit das Rad schwerer wird', 'Damit die Kette lauter ist', 'Das ist nur Zierde'], 'Drehmoment M = Kraft · Hebelarm.'),
    N('Du trittst mit 300 N auf ein Pedal. Die Kurbel ist 16 cm (0,16 m) lang. Welches Drehmoment entsteht (in Nm)?', MD, `M = F · r = 300 N · 0,16 m = ${sfx(MD)} Nm.`, {unit:'Nm', tol:.5}),
    T('Wie heißt „Kette“ auf Englisch?', ['chain'], 'Chain.', {}),
    T('Setze zusammen (ein Wort): Speichen + Reflektor = ?', ['Speichenreflektor'], 'Das letzte Wort bestimmt den Artikel: der Reflektor.', {})]};
  if (ph === 3) m = {title:'Teile planen und rechnen', sub:'Übersetzung, Hebel, Dynamo und Strom', min:14, pro:true, steps:[
    W('Übersetzung', `Die **Übersetzung** i = Zähne Kettenblatt : Zähne Ritzel. Bei ${ki.z} : ${ri.z} ist i = ${sfx(i2.toFixed(2))}. Bei einer Kurbelumdrehung dreht sich das Hinterrad i-mal. Der Weg pro Kurbelumdrehung ist **i · Radumfang**. Mit dem Umfang ${sfx(re.circ)} m: ${sfx((p.i * re.circ).toFixed(2))} m.\n\nTempo: **v = Trittfrequenz · Weg pro Umdrehung**. Bei 60 Umdrehungen pro Minute sind das ${sfx(p.v60.toFixed(1))} km/h.`, 'Ein größeres Kettenblatt oder ein kleineres Ritzel: mehr Tempo, schwerer zu treten.'),
    N(`Dein Kettenblatt hat ${ki.z} Zähne, dein Ritzel ${ri.z}. Wie groß ist die Übersetzung (2 Stellen)?`, i2, `${ki.z} : ${ri.z} ≈ ${sfx(i2.toFixed(2))}.`, {tol:.01}),
    N(`Wie viel Meter rollt dein Rad bei einer Kurbelumdrehung? (Übersetzung mal Umfang ${sfx(re.circ)} m, auf 1 Stelle gerundet)`, Math.round(p.i * re.circ * 10) / 10, `${sfx(i2.toFixed(2))} · ${sfx(re.circ)} ≈ ${sfx((p.i * re.circ).toFixed(1))} m.`, {unit:'m', tol:.1}),
    N(`Du trittst 60-mal pro Minute. Wie viele km/h sind das (auf 1 Stelle)? Tipp: Meter pro Minute mal 60 durch 1000.`, Math.round(p.v60 * 10) / 10, `60 · ${sfx((p.i * re.circ).toFixed(2))} m = ${sfx((60 * p.i * re.circ).toFixed(0))} m pro Minute. Mal 60 durch 1000 ergibt ${sfx(p.v60.toFixed(1))} km/h.`, {unit:'km/h', tol:.2}),
    N(`Hebel: Das Kettenblatt (${ki.z} Zähne, Kettenteilung 12,7 mm) hat einen Teilkreisradius von ${sfx(rk)} mm. Dein Drehmoment an der Kurbel ist ${sfx(MD)} Nm. Wie groß ist die Kettenzugkraft in Newton (ganze Zahl)? F = M : r, r in Metern.`, Math.round(FK), `r = ${sfx(rk)} mm = ${sfx(rk / 1000)} m. F = ${sfx(MD)} : ${sfx(rk / 1000)} ≈ ${Math.round(FK)} N.`, {unit:'N', tol:6, hint:'Millimeter durch 1000 teilen.'}),
    N('Dynamo und Strom: Der Dynamo liefert 6 V bei 0,5 A. Wie viel Watt sind das (P = U · I)?', 3, '6 V · 0,5 A = 3 W. Scheinwerfer 2,4 W plus Rücklicht 0,6 W = 3 W.', {unit:'W', tol:.05}),
    N('Das Licht brennt 2 Stunden mit 3 W. Wie viele Wattstunden (Wh) sind das?', 6, '3 W · 2 h = 6 Wh.', {unit:'Wh', tol:.05}),
    N('Der Dynamo bremst beim Treten mit etwa 6 W. Du leistest 100 W. Wie viel Prozent deiner Kraft gehen dafür drauf?', 6, '6 : 100 = 6 %.', {unit:'%', tol:.5}),
    N(`Wie viel kosten deine gewählten Teile zusammen (in Euro)? Das Budget beträgt ${BUDGET} €.`, sp, 'Alle Preise der gewählten Teile addieren.', {unit:'€', tol:.01}),
    Q('Warum hat ein Fahrrad einen Dynamo oder Akku und kein Kabel zur Steckdose?', 'Es braucht eine eigene Stromquelle, die mitfährt', ['Weil Strom im Reifen entsteht', 'Weil das Licht nur Gas braucht', 'Das ist nicht nötig'], 'Der Dynamo wandelt Bewegungsenergie in elektrische Energie um.'),
    Q('You are at the shop: „How much is the chainring?“ means:', 'Was kostet das Kettenblatt?', ['Wie schwer ist das Kettenblatt?', 'Wo ist das Kettenblatt?', 'Ist das Kettenblatt neu?'], 'How much = wie viel.')]};
  if (ph === 4) m = {title:'Einbau und Montageanleitung', sub:'Reihenfolge, Drehmoment, Erklären', min:8, steps:[
    O('Einbau in der richtigen Reihenfolge', ['Kettenblatt an der Kurbel befestigen', 'Ritzel auf die Nabe setzen', 'Rad mit Reifen einsetzen', 'Kette auflegen und spannen'], 'Von der Kurbel nach hinten.'),
    Q('Was ist wichtig beim Festziehen der Radmuttern?', 'Abwechselnd und mit dem richtigen Anzugsmoment', ['So fest wie möglich mit einem Hammer', 'Gar nicht', 'Nur eine von beiden'], 'Ein gleichmäßiger Sitz schützt Achse und Rahmen.'),
    GAP('Montageanleitung', '{Zuerst} befestigst du das Kettenblatt. {Danach|Dann} setzt du das Ritzel auf. {Zum Schluss} legst du die Kette auf.', ['Gestern', 'Niemals']),
    Q('Why do you check the chain tension?', 'A loose chain can jump off', ['So it looks nice', 'So it gets louder', 'To save oil'], 'Chain tension = Kettenspannung.'),
    Q('Was bewirkt ein größeres Ritzel hinten?', 'Leichteres Anfahren, aber weniger Endtempo', ['Mehr Endtempo ohne Nachteile', 'Das Rad wird leichter', 'Nichts'], 'Kleinere Übersetzung: mehr Kraft am Hinterrad, weniger Tempo.'),
    X('Erkläre dem Kunden in vier Sätzen, was du eingebaut hast und warum. Benutze Signalwörter.', 'Tipp: „Zuerst habe ich … eingebaut, weil …“', 60)]};
  if (ph === 5) { const b = kBase(), pct = Math.round((p.vmax / b.vmax - 1) * 100);
    m = {title:'Prüfbericht und Abnahme', sub:'Diagramm lesen, Prozent, Verantwortung', min:10, steps:[
    W('Der Muskel-Prüfstand', `Dein Rad schafft **${sfx(p.vmax.toFixed(1))} km/h**. Die Serie schafft ${sfx(b.vmax.toFixed(1))} km/h.\n\nDer Prüfstand vergleicht zwei Dinge: Der **Widerstand** wächst mit dem Tempo (Rollwiderstand ungefähr proportional zum Tempo, Luftwiderstand mit der **dritten Potenz**). Deine **Muskelkraft** beträgt etwa ${KPMAX} W und sinkt, wenn du zu schnell oder zu langsam trittst. Wo sich die Kurven treffen, ist deine Höchstgeschwindigkeit.`, 'Doppeltes Tempo braucht bei Luftwiderstand achtmal so viel Leistung.'),
    N(`Wie viel Prozent schneller als die Serie ist dein Rad (ganze Zahl)? Serie ${sfx(b.vmax.toFixed(1))} km/h, deins ${sfx(p.vmax.toFixed(1))} km/h.`, pct, `(${sfx(p.vmax.toFixed(1))} − ${sfx(b.vmax.toFixed(1))}) : ${sfx(b.vmax.toFixed(1))} ≈ ${pct} %.`, {unit:'%', tol:1}),
    Q('Wenn du doppelt so schnell fährst, wie viel mehr Leistung brauchst du gegen den Luftwiderstand?', 'Etwa das Achtfache', ['Das Doppelte', 'Das Vierfache', 'Gar nichts'], 'Luftwiderstandsleistung ~ Tempo hoch 3, also 2³ = 8.'),
    Q('Der Reifen ist zu weich. Was passiert?', 'Er walkt, das Rad rollt schwerer', ['Das Rad wird leichter', 'Das Rad fährt schneller', 'Nichts'], 'Mehr Rollwiderstand bedeutet mehr Watt für dasselbe Tempo.'),
    Q('Darfst du so auf der Straße fahren?', p.legal ? 'Ja, Klingel, Licht und Reflektoren sind in Ordnung' : 'Nein, nicht mit allen Teilen', p.legal ? ['Nein, nie', 'Nur nachts'] : ['Ja, ohne Probleme', 'Nur bei Sonne'], 'Auf der Straße gelten: Klingel statt Hupe, Licht, Reflektoren; Hilfsmotor nur als geprüftes Pedelec oder Mofa mit Betriebserlaubnis.'),
    Q('Ab welchem Alter gilt die Mofa-Prüfbescheinigung für ein Mofa?', 'ab 15 Jahren', ['ab 9 Jahren', 'ab 12 Jahren', 'ab 21 Jahren'], 'Für ein Mofa mit höchstens 25 km/h reicht die Prüfbescheinigung, ab 15 Jahren.'),
    X('Schreibe oder sprich deinen Prüfbericht: Was wurde umgebaut, wie schnell ist das Rad, was sollte der Kunde beachten? Vier Sätze.', 'Tipp: Fachwörter wie Übersetzung, Widerstand, Watt, Klingel.', 60)]} }
  m.id = 'w2-' + v.id + '-' + ph; m.subject = 'technik'; m.theme = 'tuning'; m.w2 = ph;
  clearTimers(); run = {m, i: 0, ok: 0, tot: 0, help: 0, score: 0, steps: m.steps}; view = 'run'; setAccent('var(--a)'); render();
}

// ---- Einhängen: Klapprad nutzt eigene Ansichten, alle anderen Modelle laufen unverändert
(function () {
  const hook = (name, kf) => { const o = window[name]; window[name] = function () { return (W2.veh === 'klapp' || (name === 'w2Select' || name === 'w2Free') && W2.sel === 'klapp' && !W2.veh || name === 'w2Free' && W2.sel === 'klapp') ? kf.apply(null, arguments) : o.apply(null, arguments) } };
  hook('w2Select', kSelect); hook('w2Free', kFree);
  ['w2Auftrag:kAuftrag', 'w2Dis:kDis', 'w2Shop:kShop', 'w2Asm:kAsm', 'w2Dyno:kDyno', 'w2Cert:kCert', 'w2Mission:kMission', 'w2Tap:kTap', 'w2Finish:kFinish', 'w2Build:kBuild2'].forEach(s => { const [n, k] = s.split(':'), o = window[n]; window[n] = function () { return W2.veh === 'klapp' && window[k] ? window[k].apply(null, arguments) : o.apply(null, arguments) } });
  const oRun = window.w2Run; window.w2Run = function () { return (W2.veh ? W2.veh === 'klapp' : W2.sel === 'klapp') ? kRun() : oRun.apply(null, arguments) };
})();
const kBuild2 = (c, v) => kBuild(c, v);
function kShotHook() { const m = /shot=(kl\w*)/.exec(location.hash); if (!m) return; const k = m[1]; S.points = Math.max(S.points, 120);
  if (k === 'klsel') { W2.veh = null; W2.sel = 'klapp'; view = 'w2'; return render() }
  if (k === 'klpr') { W2.veh = null; W2.sel = 'klapp'; view = 'pr'; return render() }
  W2.veh = 'klapp'; const c = W2.cars.klapp = {ph: 1, took: [], put: [], pick: Object.assign({}, KORIG), jet: 30, drove: false};
  const seed = (k2, n) => MISSIONS.filter(m => m.subject === k2 && !m.speech).slice(0, n).forEach(m => { S.done[m.id] = 1 }); if (k !== 'klauftrag' && k !== 'kldis') { seed('mathe', 4); seed('nawi', 8); seed('deutsch', 3); seed('englisch', 3) }
  const ph = {klauftrag: 1, kldis: 2, klshop: 3, klasm: 4, kldyno: 5, klcert: 6, kltask: 3, kltask5: 5}[k] || 1; c.ph = ph; const all = kList(c, 'dis').map(p => p.id);
  if (k === 'kldis') c.took = ['licht', 'hupe', 'reifen'];
  if (ph >= 3) c.took = all;
  if (ph >= 3) { c.pick = {reifen: 'rb', kette: 'k50', ritzel: 'q16', licht: 'la', hupe: 'hg', zub: 'zt', gepaeck: 'gr', motor: 'm0'}; if (k === 'kldyno' || k === 'klcert' || k === 'kltask5') c.pick.reifen = 'rm' }
  if (k === 'klasm') c.put = ['kette', 'ritzel', 'licht'];
  if (ph >= 5) { c.put = kList(c, 'asm').map(p => p.id); c.jet = 30; c.drove = true; c.ran = true }
  if (k === 'kltask') { view = 'w2'; return kMission(3) } if (k === 'kltask5') { view = 'w2'; return kMission(5) }
  view = 'w2'; render(); }
kShotHook();
