'use strict';
// Missionen V2 (Teil 1): Simson. Fehlersuche, Ziehen, Regler. Alle Zahlen sind gerundete Richtwerte (ca.) für den Unterricht.
// Teil 2 (Kunden, Bilder, Tagesaufträge): missionen2-daten2.js, Teil 3 (Fahrzeuge): missionen2-fahrzeuge.js
const M2 = (id, subject, kind, title, sub, min, steps, o = {}) => ({id, subject, theme: o.veh ? (o.theme || 'traktor') : 'simson', topic: o.veh ? 'Fahrzeug-Praxis' : 'Werkstatt-Praxis', title, sub, min, steps, sim: true, kind, ...o});
const stp = (id, v, o = {}) => ({id, ...v, ...o});
// ---- kleine Zeichnungen
const plugSvg = (nose, wet) => `<svg viewBox="0 0 200 130"><rect width="200" height="130" fill="#0b1422"/><rect x="78" y="74" width="44" height="42" rx="3" fill="#b9964a"/>${[80, 87, 94, 101, 108].map(y => `<rect x="78" y="${y}" width="44" height="2" fill="#6a5320" opacity=".7"/>`).join('')}<path d="M88 74 L92 26 H108 L112 74Z" fill="${nose}"/><path d="M88 74 L92 26 H98 L96 74Z" fill="#fff" opacity=".18"/><rect x="97" y="20" width="6" height="14" fill="#c9cfd6"/><path d="M80 74 V60 H98" stroke="#8d939a" stroke-width="5" fill="none"/>${wet ? '<ellipse cx="100" cy="48" rx="10" ry="16" fill="#000" opacity=".35"/><circle cx="92" cy="66" r="3" fill="#c8a35a" opacity=".8"/><circle cx="108" cy="58" r="2.5" fill="#c8a35a" opacity=".8"/><circle cx="101" cy="82" r="3" fill="#c8a35a" opacity=".7"/>' : ''}</svg>`;
const plugMini = nose => `<svg viewBox="0 0 200 130"><rect x="78" y="74" width="44" height="42" rx="3" fill="#b9964a"/><path d="M88 74 L92 26 H108 L112 74Z" fill="${nose}"/><path d="M80 74 V60 H98" stroke="#8d939a" stroke-width="5" fill="none"/></svg>`;
const MOTSVG = `<svg viewBox="0 0 320 300"><rect width="320" height="300" fill="#0b1422"/>
<path d="M95 190 Q95 175 112 175 H208 Q225 175 225 190 V255 Q225 272 208 272 H112 Q95 272 95 255Z" fill="#5d6b80" stroke="#9db4cf" stroke-width="2"/><circle cx="160" cy="236" r="22" fill="#44506a" stroke="#9db4cf"/><circle cx="160" cy="236" r="6" fill="#9db4cf"/>
<rect x="122" y="100" width="76" height="78" fill="#7b8aa0" stroke="#9db4cf" stroke-width="2"/>${[108, 118, 128, 138, 148, 158, 168].map(y => `<rect x="114" y="${y}" width="92" height="4" rx="2" fill="#93a3b9"/>`).join('')}
<rect x="128" y="132" width="64" height="44" fill="#1a2a42"/><rect x="134" y="140" width="52" height="30" rx="3" fill="#c7d0db"/><rect x="134" y="146" width="52" height="3" fill="#7b8aa0"/><rect x="134" y="153" width="52" height="3" fill="#7b8aa0"/>
<rect x="116" y="56" width="88" height="46" rx="6" fill="#8fa0b6" stroke="#9db4cf" stroke-width="2"/>${[66, 76, 86].map(y => `<rect x="118" y="${y}" width="84" height="3" rx="1.5" fill="#6b7a90"/>`).join('')}
<rect x="153" y="30" width="14" height="28" fill="#d9e2ec"/><rect x="156" y="12" width="8" height="20" fill="#5fb8ff"/>
<rect x="40" y="146" width="84" height="34" rx="6" fill="#a58a4a" stroke="#d6bd7a"/><rect x="34" y="136" width="24" height="54" rx="6" fill="#3d4658" stroke="#9db4cf"/><rect x="62" y="154" width="50" height="6" fill="#d6bd7a"/>
<path d="M198 124 H252 Q284 124 284 156 V214" stroke="#6f7b8c" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M198 124 H252 Q284 124 284 156 V214" stroke="#9aa5b3" stroke-width="16" fill="none" stroke-linecap="round"/></svg>`;
const MOWSVG = `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#0b1422"/><rect y="176" width="320" height="24" fill="#1d3a24"/>
<rect x="18" y="82" width="100" height="48" rx="12" fill="#2f9e44" stroke="#9fe0ae" stroke-width="2"/>${[0, 1, 2].map(i => `<rect x="${32 + i * 8}" y="92" width="4" height="26" rx="2" fill="#1c6a2d"/>`).join('')}<rect x="112" y="98" width="130" height="34" rx="8" fill="#277a38" stroke="#9fe0ae"/>
<path d="M174 98 Q186 62 204 62 L242 62 L242 92 L206 92 Z" fill="#222c38" stroke="#9db4cf"/><path d="M136 100 L150 44" stroke="#9db4cf" stroke-width="5"/><ellipse cx="152" cy="40" rx="24" ry="8" fill="none" stroke="#d9e2ec" stroke-width="4"/>
<rect x="68" y="150" width="122" height="26" rx="6" fill="#6b7787" stroke="#9db4cf" stroke-width="2"/><rect x="170" y="154" width="36" height="14" fill="#44506a"/>
<circle cx="52" cy="158" r="22" fill="#111" stroke="#6b7787" stroke-width="3"/><circle cx="52" cy="158" r="8" fill="#6b7787"/><circle cx="222" cy="146" r="36" fill="#111" stroke="#6b7787" stroke-width="4"/><circle cx="222" cy="146" r="13" fill="#6b7787"/>
<rect x="256" y="72" width="58" height="52" rx="8" fill="#3a4a3a" stroke="#9fe0ae" stroke-width="2"/>${[84, 96, 108].map(y => `<line x1="258" y1="${y}" x2="312" y2="${y}" stroke="#9fe0ae" opacity=".5"/>`).join('')}</svg>`;
const rowsZ = (n, h, w = 320) => Array.from({length: n}, (_, i) => ({id: 's' + (i + 1), x: 0, y: i * h + 3, w, h: h - 6, n: 'Schritt ' + (i + 1)}));
const slotItems = (arr, en) => arr.map((l, i) => ({l, z: 's' + (i + 1), ...(en ? {en: en[i]} : {})}));

MISSIONS.push(
// ------------------------------------------------------------------ Fehlersuche 1
M2('sim-fehler-1', 'nawi', 'fehler', 'Springt nicht an: Der Funke fehlt', 'Kerze, Zündfunke, Benzinhahn, Vergaser der Reihe nach prüfen', 12, [
  W('Was ein Motor zum Laufen braucht', 'Damit ein Verbrennungsmotor läuft, müssen drei Dinge zusammenkommen: **Kraftstoff**, **Luft** (Sauerstoff) und ein **Zündfunke**. Fehlt eines davon, läuft er nicht. Das ist das Verbrennungsdreieck: Brennstoff, Sauerstoff, Zündenergie.\n\nEin Mechaniker prüft der Reihe nach, vom Einfachen zum Schwierigen. Heute springt eine S51 nach vielen Kicks nicht an.', 'Zusätzlich braucht ein Zweitakter Verdichtung im Zylinder. Ohne Kompression reicht auch ein guter Funke nicht.'),
  stp('f1', {type: 'fehler', title: 'Fehlersuche: S51 springt nicht an', av: '👩', story: '**Frau Berger:** „Gestern lief sie noch. Heute kommt beim Kicken nur ein Husten. Es tut sich nichts, auch nach 20 Kicks.“',
    tip: 'Denke ans Verbrennungsdreieck: Funke, Kraftstoff, Luft. Der Funke ist schnell geprüft.', order: ['funke', 'kerze', 'hahn'],
    checks: [
      {id: 'hahn', ic: '🛢️', n: 'Benzinhahn', ok: true, must: 1, res: 'Der Hahn steht auf „Auf“. Benzin kann fließen.'},
      {id: 'tank', ic: '⛽', n: 'Tank und Gemisch', ok: true, res: 'Der Tank ist halb voll mit Gemisch.'},
      {id: 'kerze', ic: '🔩', n: 'Zündkerze ansehen', ok: false, must: 1, svg: plugMini('#2a2320'), res: 'Die Kerze ist nass-schwarz und rußig. Ruß überbrückt die Elektroden.'},
      {id: 'funke', ic: '⚡', n: 'Zündfunke prüfen', ok: false, must: 1, res: 'Kerze im Stecker an den Zylinder (Masse) halten und kicken: nur ein **schwacher, gelber Funke**. Gesund wäre ein kräftiger blau-weißer. (Nur mit Erwachsenen: Zündanlage steht unter Hochspannung.)'},
      {id: 'verg', ic: '⚙️', n: 'Vergaser', ok: true, res: 'Benzin kommt an: Beim Tupfen läuft Gemisch aus der Schwimmerkammer.'},
      {id: 'luft', ic: '💨', n: 'Luftfilter', ok: true, res: 'Der Luftfilter ist sauber, Luft kommt durch.'},
      {id: 'komp', ic: '💪', n: 'Kompression fühlen', ok: true, res: 'Beim Kicken spürst du klaren Widerstand. Die Verdichtung ist in Ordnung.'}],
    causes: [{n: 'Die Zündkerze ist verrußt und gibt keinen kräftigen Funken', right: 1}, {n: 'Der Benzinhahn ist zu', why: 'Der Hahn steht auf „Auf“ und der Vergaser bekommt Gemisch.'}, {n: 'Der Vergaser ist verstopft', why: 'Es kommt Gemisch an. Der Vergaser ist in Ordnung.'}, {n: 'Der Kolben ist festgefressen', why: 'Beim Kicken spürst du Kompression. Ein Klemmer würde den Kickstarter blockieren.'}],
    fix: 'Kerze ausbauen, mit Drahtbürste reinigen oder gegen eine neue tauschen und den Elektrodenabstand auf etwa **0,6 mm** einstellen. Danach springt die Simson wieder an.'}),
  Q('Welche drei Dinge braucht ein Verbrennungsmotor, damit er läuft?', 'Kraftstoff, Luft und Zündfunke', ['Wasser, Öl und Licht', 'Gummi, Strom und Wasser', 'Nur Benzin'], 'Brennstoff, Sauerstoff und Zündenergie bilden das Verbrennungsdreieck.'),
  N('Ein Zweitakter zündet bei jeder Umdrehung einmal. Bei 3000 Umdrehungen pro Minute: Wie viele Zündfunken springen pro Sekunde?', 50, '3000 : 60 = 50 Umdrehungen pro Sekunde, also 50 Zündungen.', {unit: 'pro Sekunde', hint: 'Eine Minute hat 60 Sekunden.'}),
  Q('Wie groß ist der Elektrodenabstand einer Zündkerze etwa?', 'ca. 0,6 mm', ['ca. 6 mm', 'ca. 0,06 mm', 'ca. 2 cm'], 'Ungefähr ein halber Millimeter, so dick wie etwa sechs Blatt Papier.')
], {tool: null}),
// ------------------------------------------------------------------ Fehlersuche 2
M2('sim-fehler-2', 'deutsch', 'fehler', 'Springt nicht an: Kein Sprit', 'Ursache und Folge mit „weil“ und „deshalb“', 12, [
  W('Ursache und Folge', 'Wenn der Motor nicht läuft, fragt der Mechaniker: **Warum?** Die Antwort ist die **Ursache**. Das Ergebnis ist die **Folge**.\n\n„Die Schwalbe geht aus, **weil** zu wenig Benzin im Vergaser ankommt.“ (Nebensatz mit weil: das Verb steht am Ende.)\n„Zu wenig Benzin kommt an, **deshalb** geht sie aus.“ (Hauptsatz: das Verb steht an zweiter Stelle.)', 'Nach „weil“ steht das gebeugte Verb ganz am Satzende, nach „deshalb“ direkt dahinter.'),
  stp('f2', {type: 'fehler', title: 'Fehlersuche: Schwalbe geht aus', av: '👨', story: '**Herr Lehmann:** „Die Schwalbe springt an, hustet kurz und geht wieder aus. Mal läuft sie einen Moment, dann ist wieder Schluss.“',
    tip: 'Der Funke ist da. Also kommt wohl zu wenig Gemisch an. Suche auf dem Weg vom Tank zum Vergaser.', order: ['funke', 'kerze', 'sieb'],
    checks: [
      {id: 'funke', ic: '⚡', n: 'Zündfunke prüfen', ok: true, must: 1, res: 'Kräftiger blau-weißer Funke. Die Zündung ist in Ordnung.'},
      {id: 'kerze', ic: '🔩', n: 'Zündkerze ansehen', ok: false, must: 1, svg: plugMini('#e9e9e0'), res: 'Die Kerze ist **trocken und hell**. Sie bekommt kaum Gemisch.'},
      {id: 'tank', ic: '⛽', n: 'Tank', ok: true, res: 'Der Tank ist halb voll.'},
      {id: 'hahn', ic: '🛢️', n: 'Benzinhahn und Leitung', ok: false, res: 'Der Hahn steht auf „Auf“. Zieht man die Leitung am Vergaser ab, **tropft nur wenig** heraus.'},
      {id: 'verg', ic: '⚙️', n: 'Schwimmerkammer', ok: false, res: 'Die Schwimmerkammer ist fast **leer**. Es kommt zu wenig Benzin nach.'},
      {id: 'luft', ic: '💨', n: 'Luftfilter', ok: true, res: 'Sauber, Luft kommt durch.'},
      {id: 'sieb', ic: '🔍', n: 'Sieb im Benzinhahn', ok: false, must: 1, res: 'Das kleine Sieb im Benzinhahn ist mit Rost und Schmutz **zugesetzt**.'}],
    causes: [{n: 'Das Sieb im Benzinhahn ist verstopft, es kommt zu wenig Benzin im Vergaser an', right: 1}, {n: 'Der Zündfunke ist zu schwach', why: 'Der Funke ist kräftig blau-weiß.'}, {n: 'Die Kerze ist verrußt', why: 'Die Kerze ist trocken und hell, nicht rußig. Ruß hieße zu viel Gemisch.'}, {n: 'Die Verdichtung ist weg', why: 'Davon ist nichts zu merken, und die Kerze ist trocken. Das Problem liegt im Kraftstoffweg.'}],
    fix: 'Hahn abbauen, Sieb auswaschen und wieder einbauen. Benzin ist leicht entzündlich: nur draußen, ohne Funken und mit Erwachsenen. Danach fließt das Gemisch wieder.'}),
  GAP('Ursache und Folge', 'Das Sieb ist verstopft, {deshalb|darum} ist die Schwimmerkammer leer. Die Simson geht aus, {weil} zu wenig Benzin ankommt.', ['obwohl', 'damit']),
  Q('Welcher Satz ist richtig?', 'Der Motor geht aus, weil kein Benzin mehr ankommt.', ['Der Motor geht aus, weil kommt kein Benzin mehr an.', 'Der Motor geht aus, weil kein Benzin mehr kommt an.', 'Der Motor geht aus, deshalb kein Benzin mehr ankommt.'], 'Nach „weil“ steht das Verb am Ende des Nebensatzes.'),
  Q('Kerze trocken und hell, Schwimmerkammer leer. Was folgt daraus?', 'Es kommt zu wenig Gemisch an. Man sucht zwischen Tank und Vergaser.', ['Der Zündfunke fehlt.', 'Der Kolben ist zu groß.', 'Der Auspuff ist zu laut.'], 'Eine trockene Kerze bekommt kaum Kraftstoff. Der Fehler liegt im Kraftstoffweg.')
]),
// ------------------------------------------------------------------ Ziehen 1
M2('sim-ziehen-1', 'nawi', 'ziehen', 'Motor-Puzzle: Teile an die richtige Stelle', 'Zweitaktmotor: Teile ziehen, auch mit dem Finger', 10, [
  W('Die wichtigsten Teile des Zweitaktmotors', 'Von oben nach unten: **Zündkerze** (zündet das Gemisch), **Zylinderkopf** (schließt den Zylinder oben ab), **Zylinder** (Laufbahn für den Kolben, mit Kühlrippen), **Kolben** (wird vom heißen Gas nach unten gedrückt), **Kurbelgehäuse** (hier läuft die Kurbelwelle, das Gemisch wird vorverdichtet). Der **Vergaser** mischt Luft und Benzin, der **Auspuff** leitet das Abgas ab.', 'Beim Zweitakter gibt es keine Ventile: Der Kolben öffnet und schließt die Schlitze im Zylinder selbst.'),
  stp('d1', {type: 'drag', title: 'Motor-Puzzle', text: 'Schematische Zeichnung eines Simson-Motors von der Seite.', W: 320, H: 300, bg: MOTSVG,
    zones: [{id: 'kerze', x: 112, y: 2, w: 96, h: 52, n: '1'}, {id: 'kopf', x: 112, y: 58, w: 96, h: 42, n: '2'}, {id: 'zyl', x: 112, y: 103, w: 96, h: 32, n: '3'}, {id: 'kolben', x: 112, y: 138, w: 96, h: 36, n: '4'}, {id: 'verg', x: 6, y: 138, w: 100, h: 56, n: '5'}, {id: 'aus', x: 210, y: 100, w: 108, h: 60, n: '6'}, {id: 'kurbel', x: 96, y: 200, w: 128, h: 66, n: '7'}],
    items: [{l: 'Zündkerze', en: 'spark plug', z: 'kerze'}, {l: 'Zylinderkopf', en: 'cylinder head', z: 'kopf'}, {l: 'Zylinder', en: 'cylinder', z: 'zyl'}, {l: 'Kolben', en: 'piston', z: 'kolben'}, {l: 'Vergaser', en: 'carburettor', z: 'verg'}, {l: 'Auspuff', en: 'exhaust', z: 'aus'}, {l: 'Kurbelgehäuse', en: 'crankcase', z: 'kurbel'}],
    why: 'Du kennst jetzt Aufbau und Namen des Motors, auf Deutsch und Englisch.'}),
  Q('Wo wird beim Zweitakter das frische Gemisch vorverdichtet?', 'im Kurbelgehäuse', ['im Auspuff', 'in der Zündkerze', 'im Tank'], 'Der Kolben drückt beim Abwärtsgang das Gemisch im Kurbelgehäuse zusammen und schiebt es durch Überströmkanäle nach oben.'),
  Q('Wozu dienen die Kühlrippen am Zylinder?', 'Sie vergrößern die Oberfläche, damit mehr Wärme an die Luft abgegeben wird.', ['Sie machen den Motor leiser.', 'Sie halten das Öl im Motor.', 'Sie sehen nur schön aus.'], 'Mehr Fläche heißt mehr Wärme, die der Fahrtwind wegträgt (Luftkühlung).')
]),
// ------------------------------------------------------------------ Ziehen 2
M2('sim-ziehen-2', 'englisch', 'ziehen', 'Werkzeugwand: Tools auf Englisch', 'Werkzeug dem richtigen Auftrag zuordnen', 10, [
  W('Tools: Werkzeug auf Englisch', 'a **spanner** (britisch) oder **wrench** (amerikanisch) = Schraubenschlüssel\na **screwdriver** = Schraubendreher\n**pliers** = Zange (immer Mehrzahl)\na **torque wrench** = Drehmomentschlüssel\na **caliper** = Messschieber\na **multimeter** = Vielfachmessgerät\na **spark plug spanner** = Kerzenschlüssel\n**circlip pliers** = Sicherungsringzange\n\n„Pass me the spanner, please.“ = Reich mir bitte den Schraubenschlüssel.', 'Pliers und scissors (Schere) haben im Englischen immer die Mehrzahlform.'),
  stp('d2', {type: 'drag', title: 'Welches Werkzeug für welchen Job?', text: 'Jeder Job braucht genau ein Werkzeug.', W: 320, H: 396, bg: '',
    zones: [['Zündkerze herausdrehen', 'kerz'], ['Zylinderkopfmuttern mit festem Moment anziehen', 'dreh'], ['Bohrung des Zylinders genau messen', 'schieb'], ['Spannung der Batterie prüfen', 'multi'], ['Schlitzschraube am Vergaser drehen', 'sd'], ['Sicherungsring am Kolbenbolzen entfernen', 'zange']].map(([n, z], i) => ({id: z, x: 0, y: i * 66 + 3, w: 320, h: 60, n})),
    items: [{l: 'Kerzenschlüssel', en: 'spark plug spanner', z: 'kerz'}, {l: 'Drehmomentschlüssel', en: 'torque wrench', z: 'dreh'}, {l: 'Messschieber', en: 'caliper', z: 'schieb'}, {l: 'Multimeter', en: 'multimeter', z: 'multi'}, {l: 'Schraubendreher', en: 'screwdriver', z: 'sd'}, {l: 'Sicherungsringzange', en: 'circlip pliers', z: 'zange'}],
    why: 'Jetzt kennst du sechs Werkzeuge auf Deutsch und Englisch. In der Werkzeugwand (Missions-Hub) schaltest du weitere durch Lernen frei.'}),
  M('Auf Englisch', [['Schraubendreher', 'screwdriver'], ['Zange', 'pliers'], ['Messschieber', 'caliper'], ['Drehmomentschlüssel', 'torque wrench']], 'Ordne zu.'),
  T('Wie heißt „Schraubenschlüssel“ auf Englisch? (britisch oder amerikanisch)', ['spanner', 'wrench'], 'spanner (britisch) oder wrench (amerikanisch).'),
  Q('„Pass me the pliers, please.“ heißt:', 'Reich mir bitte die Zange.', ['Gib mir bitte den Hammer.', 'Hol mir bitte das Öl.', 'Schließ bitte die Tür.'], 'pass = reichen, pliers = Zange.')
]),
// ------------------------------------------------------------------ Regler 1: Hauptdüse
M2('sim-regler-1', 'mathe', 'regler', 'Die Hauptdüse im Schaufenster', 'Düsenfläche rechnen und live einstellen', 14, [
  W('Düse, Querschnitt, Kreisfläche', 'Die **Hauptdüse** ist eine kleine Bohrung im Vergaser. Sie bestimmt, wie viel Benzin zur Luft kommt. Die Nummer gibt oft den Durchmesser in Hundertstel Millimetern an (**80** ist ca. 0,80 mm, je nach Hersteller). Wie viel Benzin durchfließt, hängt von der **Fläche** ab: A = π · (d : 2)².\n\nBeispiel: d = 0,80 mm gibt A = π · 0,4² ≈ 0,50 mm².', 'Eine Düse mit 10 % größerem Durchmesser lässt etwa 21 % mehr durch, weil die Fläche mit dem Quadrat wächst.'),
  stp('r1', {type: 'regler', title: 'Hauptdüse abstimmen', text: 'Aufbau (Spielwert): 60er Zylinder, Sportauspuff, 19er Vergaser. Die passende Düse liegt bei etwa 85. Echte Tuner entscheiden nach dem Kerzenbild.', goal: 'Stelle die Hauptdüse so ein, dass die Kerze **rehbraun** aussieht und die Leistung hoch ist.', tip: 'Weiße Kerze: zu mager, größere Düse. Schwarze Kerze: zu fett, kleinere Düse.',
    sliders: [{id: 'j', l: 'Hauptdüse', min: 60, max: 110, step: 1, val: 68, u: ''}],
    live: v => { const j = v.j, d = j - 85, A = Math.PI * Math.pow(j / 200, 2), nose = d <= -4 ? '#efefe6' : d >= 4 ? '#262120' : '#b88a55', bild = d <= -4 ? 'weiß' : d >= 4 ? 'schwarz' : 'rehbraun';
      const pw = Math.round(100 * Math.max(.25, d < 0 ? 1 - Math.pow(d / 20, 2) : 1 - Math.pow(d / 30, 2))), hot = Math.max(5, Math.min(100, Math.round(50 - d * 2.2))), ok = Math.abs(d) <= 3;
      return {ok, msg: d < 0 ? `Die Kerze ist ${bild}: Das Gemisch ist zu mager. Eine <b>größere</b> Düse bringt mehr Benzin.` : `Die Kerze ist ${bild}: Das Gemisch ist zu fett. Eine <b>kleinere</b> Düse spart Benzin.`,
        html: `<div class="rbig"><div style="width:84px;flex:none">${plugMini(nose)}</div><div><b>Kerzenbild: ${bild}</b><br><span class="m">${ok ? 'So soll es aussehen.' : d < 0 ? 'Zu mager (zu wenig Benzin).' : 'Zu fett (zu viel Benzin).'}</span></div></div>
        <div class="rrow"><span>Düsenfläche</span><b>${de(A, 2)} mm²</b></div>
        <div class="rrow"><span>Leistung</span><b>${pw} %</b></div><div class="rbar ${pw >= 90 ? 'good' : ''}"><i style="width:${pw}%"></i></div>
        <div class="rrow"><span>Motortemperatur</span><b>${hot > 75 ? '⚠ Klemmgefahr!' : hot > 55 ? 'warm' : 'normal'}</b></div><div class="rbar ${hot > 75 ? 'bad' : ''}"><i style="width:${hot}%"></i></div>` } },
    why: 'Mit der Kerze liest du das Gemisch ab: rehbraun heißt passend. Zu mager ist gefährlich, weil der Motor zu heiß wird und klemmen kann.'}),
  N('Die Düse 80 hat d = 0,80 mm. Wie groß ist die Fläche in mm² (auf zwei Stellen gerundet)?', 0.5, 'A = π · 0,4² = 0,5027, gerundet 0,50 mm².', {unit: 'mm²', tol: .01, hint: 'Radius = d : 2 = 0,4 mm.'}),
  N('Die Düse 90 hat d = 0,90 mm. Wie groß ist die Fläche in mm² (zwei Stellen)?', 0.64, 'A = π · 0,45² = 0,6362, gerundet 0,64 mm².', {unit: 'mm²', tol: .01}),
  N('Um wie viel Prozent ist die Fläche der Düse 90 größer als die der Düse 80 (ganze Zahl)?', 27, '0,6362 : 0,5027 = 1,266. Das sind etwa 27 % mehr.', {unit: '%', tol: 1, hint: 'Teile die größere Fläche durch die kleinere.'}),
  Q('Die Kerze ist weiß. Was bedeutet das?', 'Das Gemisch ist zu mager. Eine größere Hauptdüse hilft.', ['Das Gemisch ist zu fett. Eine kleinere Düse hilft.', 'Alles ist perfekt.', 'Die Kerze ist kaputt.'], 'Weiß heißt heiße Verbrennung bei zu wenig Benzin.')
], {rlp: 'Größen und Messen: Kreisfläche; Prozentrechnung; Funktionale Zusammenhänge'}),
// ------------------------------------------------------------------ Regler 2: Zündzeitpunkt
M2('sim-regler-2', 'nawi', 'regler', 'Zündzeitpunkt einstellen', 'Warum der Funke vor dem oberen Totpunkt springt', 12, [
  W('Zündung vor dem oberen Totpunkt', 'Das Gemisch verbrennt nicht schlagartig, sondern in wenigen Tausendstelsekunden. Damit der höchste Druck kurz **nach** dem oberen Totpunkt (OT) entsteht, springt der Funke schon **vor OT**. Bei der Simson gibt man das als Kolbenweg an: **ca. 1,8 mm vor OT** (genauer Wert je Modell im Werkstatthandbuch).\n\nZu früh: Das Gemisch drückt gegen den noch aufwärts laufenden Kolben, der Motor klingelt und wird heiß. Zu spät: Der Druck kommt zu spät, die Leistung fehlt und der Auspuff wird zu heiß.', 'Den Kolbenweg misst man mit einer Messuhr. So sieht man, wie weit der Kolben noch vom oberen Totpunkt entfernt ist.'),
  stp('r2', {type: 'regler', title: 'Zündzeitpunkt live', text: 'Der Kolben steht kurz vor dem oberen Totpunkt (OT). Der gelbe Strich zeigt, wo der Funke springt.', goal: 'Stelle den Zündzeitpunkt auf ca. **1,8 mm vor OT** (1,6 bis 2,0 mm gilt als passend).', tip: 'Zu früh: klingelt und wird heiß. Zu spät: wenig Leistung und glühender Auspuff.',
    sliders: [{id: 'x', l: 'Zündzeitpunkt (mm vor OT)', min: 0, max: 4, step: .1, val: 3.4, u: ' mm'}],
    live: v => { const x = v.x, d = x - 1.8, ok = Math.abs(d) <= .2 + 1e-9, y = 34 + (x / 4) * 26, ang = Math.round(Math.acos(1 - x / 20) * 180 / Math.PI);
      const pw = Math.round(Math.max(20, 100 - Math.pow(d / 2.2, 2) * 80)), msg = d > .2 ? 'Zu früh: Der Motor klingelt (klopft) und wird heiß. Beim Kicken kann der Kickstarter zurückschlagen.' : d < -.2 ? 'Zu spät: Wenig Leistung, der Auspuff wird zu heiß.' : 'Passt: Der höchste Druck liegt kurz nach OT.';
      return {ok, msg, html: `<div class="rbig"><svg viewBox="0 0 120 100" width="96" height="80"><rect x="30" y="4" width="60" height="92" fill="#1a2a42" stroke="#9db4cf" stroke-width="2"/><rect x="34" y="${y + 12}" width="52" height="26" rx="3" fill="#c7d0db"/><rect x="34" y="${y + 18}" width="52" height="3" fill="#7b8aa0"/><line x1="26" y1="${y + 12}" x2="94" y2="${y + 12}" stroke="#ffd60a" stroke-width="2" stroke-dasharray="4 3"/><line x1="26" y1="34" x2="94" y2="34" stroke="#5fb8ff" stroke-width="2"/><text x="96" y="37" font-size="9" fill="#5fb8ff">OT</text></svg>
        <div><b>${msg}</b></div></div><div class="rrow"><span>Kurbelwinkel vor OT (vereinfacht, ca.)</span><b>ca. ${ang}°</b></div>
        <div class="rrow"><span>Leistung</span><b>${pw} %</b></div><div class="rbar ${pw >= 90 ? 'good' : ''}"><i style="width:${pw}%"></i></div>
        <div class="rrow"><span>${d > 0 ? 'Motor heiß, klingelt' : 'Auspuff heiß'}</span><b>${Math.abs(d) <= .2 ? 'normal' : Math.abs(d) < 1 ? 'erhöht' : '⚠ zu hoch'}</b></div>` } },
    why: 'Der Funke muss vor OT springen, damit der Druck dann entsteht, wenn der Kolben schon wieder nach unten läuft. Genau einstellen heißt: mehr Leistung ohne Klingeln.'}),
  N('Der Hub beträgt ca. 40 mm. Wie groß ist der Radius der Kurbel (halber Hub) in mm?', 20, 'Der Kolben legt pro Hub den doppelten Kurbelradius zurück: 40 : 2 = 20 mm.', {unit: 'mm'}),
  N('Ein Zweitakter zündet bei jeder Umdrehung. Bei 6000 U/min: Wie viele Zündungen pro Sekunde?', 100, '6000 : 60 = 100.', {unit: 'pro Sekunde'}),
  Q('Was passiert, wenn der Zündzeitpunkt viel zu früh liegt?', 'Der Motor klingelt und wird heiß.', ['Der Motor wird leiser und kühler.', 'Nichts, es ist egal.', 'Der Tank wird leer.'], 'Das Gemisch zündet zu früh und drückt gegen den aufwärts laufenden Kolben.')
], {tool: 'zuend'})
);
