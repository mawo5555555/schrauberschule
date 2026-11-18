// Profi-Werkstatt: Motortechnik über den Schulstoff hinaus (für Fortgeschrittene, mit Taschenrechner)
const exAng = d => { let lo = 0, hi = 180; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2, a = m * Math.PI / 180, dm = 22 * (1 - Math.cos(a)) + 62 - Math.sqrt(3844 - 484 * Math.sin(a) ** 2); dm < d ? lo = m : hi = m } return hi };
const PRO = {subject:'technik', theme:'tuning', pro:true};
MISSIONS.push(

{...PRO, id:'technik-1', topic:'Hubraum und Verdichtung', title:'Hubraum aus Bohrung und Hub', sub:'Die Formel hinter 50, 60, 70 und 125 cm³', min:18,
 rlp:'Über den Schulstoff hinaus (Klasse 7/8): Kreisfläche und Zylindervolumen, Umstellen von Formeln, Rechnen mit dem Taschenrechner',
 steps:[
  W('Die Formel für den Hubraum', 'Der Hubraum eines Zylinders ist das Volumen eines Zylinders (Rohr): **Kolbenfläche mal Hub**.\n\n**V = π/4 · d² · h**\n\nd ist die **Bohrung** (Durchmesser), h der **Hub**. Rechne in **cm**: 38 mm = 3,8 cm.\n\nBeispiel Simson (38 mm Bohrung, 44 mm Hub): Fläche = π/4 · 3,8² = 11,34 cm². Hubraum = 11,34 · 4,4 = **49,9 cm³**. Das sind die „50 ccm“.\n\nNutze den Taschenrechner (Knopf 🖩 in der Aufgabe).',
    'Der Hubraum wächst mit dem **Quadrat** der Bohrung. Eine doppelt so große Bohrung ergibt den vierfachen Hubraum.'),
  L('Hubraum-Rechner', 'Stelle Bohrung und Hub ein und sieh den Hubraum.',
    [{id:'d', label:'Bohrung', min:36, max:58, step:1, val:38, unit:' mm'}, {id:'h', label:'Hub', min:40, max:60, step:1, val:44, unit:' mm'}],
    v => { const A = Math.PI / 4 * (v.d / 10) ** 2, V = A * v.h / 10; return `<div class="center"><b style="font-size:26px">${de(V, 1)} cm³</b><br>Kolbenfläche: ${de(A, 2)} cm²<br><span class="m">Rechnung: π/4 · ${de(v.d / 10, 1)}² · ${de(v.h / 10, 1)}</span></div>`; }),
  N('Wie groß ist die Kolbenfläche bei 38 mm Bohrung? (in cm², 2 Nachkommastellen)', 11.34, 'π/4 · 3,8² = 0,7854 · 14,44 = 11,34 cm².', {tol:.05, unit:'cm²', hint:'Rechne in cm: 3,8 cm.'}),
  N('Hubraum bei 38 mm Bohrung und 44 mm Hub (in cm³)?', 49.9, '11,34 cm² · 4,4 cm = 49,9 cm³.', {tol:.2, unit:'cm³'}),
  N('Ein „60er“ hat 41 mm Bohrung bei 44 mm Hub. Wie viel Hubraum ergibt das? (cm³)', 58.1, 'π/4 · 4,1² · 4,4 = 13,20 · 4,4 = 58,1 cm³. Händler nennen das „60 ccm“. Mit etwas längerem Hub kommt man auf 60.', {tol:.3, unit:'cm³'}),
  N('Bohrung 45 mm, Hub 44 mm. Welchen Hubraum hat der Zylinder? (cm³)', 70, 'π/4 · 4,5² · 4,4 = 15,90 · 4,4 = 70,0 cm³. Das ist ein „70er“.', {tol:.3, unit:'cm³'}),
  Q('Die Bohrung wird 1,2-mal so groß, der Hub bleibt gleich. Der Hubraum wird …', 'etwa 1,44-mal so groß', ['1,2-mal so groß', '2,4-mal so groß', 'doppelt so groß'], 'Die Bohrung geht quadratisch ein: 1,2² = 1,44.'),
  N('Ein 125er hat 50 mm Hub. Welche Bohrung braucht er? (mm, ganze Zahl). Tipp: d = Wurzel aus (4 · V ÷ (π · h)), mit V = 125 cm³ und h = 5 cm.', 56, 'd = √(4 · 125 ÷ (π · 5)) = √31,83 = 5,64 cm = 56,4 mm.', {tol:.5, unit:'mm', hint:'Nutze die Wurzeltaste im Rechner.'})
]},

{...PRO, id:'technik-2', topic:'Hubraum und Verdichtung', title:'Verdichtung und Zylinderkopf', sub:'Brennraum, Quetschspalt, Klopfen', min:18,
 rlp:'Über den Schulstoff hinaus: Verhältnisrechnung, Formeln umstellen; Technik: Verdichtungsverhältnis, Quetschspalt, Klopfen',
 steps:[
  W('Das Verdichtungsverhältnis', 'Beim Verdichten wird das Gemisch auf einen kleinen Raum gepresst. Das **Verdichtungsverhältnis** ε sagt, wie stark:\n\n**ε = (Hubraum + Brennraum) ÷ Brennraum**\n\nDer **Brennraum** (Verdichtungsraum) ist das, was bei Kolben im oberen Totpunkt im Zylinderkopf übrig bleibt.\n\nBeispiel: Hubraum 50 cm³, Brennraum 6,25 cm³: ε = (50 + 6,25) ÷ 6,25 = **9**, also 9:1.\n\nDie **Quetschkante** am Kopf und am Kolben presst die Gase kurz vor der Zündung nach innen. Das verwirbelt das Gemisch und verbrennt es besser.',
    'Eine zu hohe Verdichtung kann **klopfen**: Das Gemisch entzündet sich von allein und zu früh. Das ist hart für Kolben und Lager.'),
  L('Verdichtungs-Rechner', 'Verändere Hubraum und Brennraum.',
    [{id:'v', label:'Hubraum', min:50, max:125, step:5, val:50, unit:' cm³'}, {id:'c', label:'Brennraum', min:4, max:16, step:.25, val:6.25, unit:' cm³'}],
    v => { const e = (v.v + v.c) / v.c; return `<div class="center"><b style="font-size:26px">ε = ${de(e, 1)} : 1</b><br><span class="m">${e > 13 ? 'Sehr hoch: Klopfgefahr, hochwertiger Kraftstoff nötig' : e > 10 ? 'Hoch: Tuning-Bereich' : 'Üblich für Serienmotoren'}</span></div>`; }),
  N('Hubraum 50 cm³, Brennraum 6,25 cm³. Wie groß ist das Verdichtungsverhältnis (ε)?', 9, '(50 + 6,25) ÷ 6,25 = 56,25 ÷ 6,25 = 9.', {tol:.05, hint:'Erst addieren, dann teilen.'}),
  N('Du willst ε = 10 bei 50 cm³ Hubraum. Wie groß muss der Brennraum sein? (cm³)', 5.56, 'ε = (Vh + Vc) ÷ Vc → Vc = Vh ÷ (ε − 1) = 50 ÷ 9 = 5,56 cm³.', {tol:.05, unit:'cm³', hint:'Stelle die Formel nach Vc um: Vc = Vh ÷ (ε − 1).'}),
  Q('Du fräst den Zylinderkopf ab, der Brennraum wird kleiner. Was passiert mit ε?', 'ε wird größer', ['ε wird kleiner', 'ε bleibt gleich', 'ε wird negativ'], 'Brennraum im Nenner kleiner → Ergebnis größer.'),
  Q('Was nennt man „Klopfen“?', 'Das Gemisch entzündet sich unkontrolliert und zu früh von allein.', ['Das Anklopfen an die Tür', 'Das Ticken der Kette', 'Das Geräusch der Bremse'], 'Klopfen kann Kolben und Lager zerstören.'),
  Q('Wie bestimmt man den Brennraum praktisch?', 'Man füllt ihn mit Flüssigkeit aus einer Messspritze (Auslitern).', ['Man wiegt den Kopf', 'Man schätzt ihn nach Gefühl', 'Man misst die Außentemperatur'], 'So misst man das Volumen genau.'),
  Q('Was bewirkt die Quetschkante?', 'Sie verwirbelt das Gemisch kurz vor der Zündung.', ['Sie kühlt das Öl', 'Sie schmiert den Kolben', 'Sie hält die Kerze'], 'Verwirbeltes Gemisch verbrennt schneller und vollständiger.')
]},

{...PRO, id:'technik-3', topic:'Steuerzeiten', title:'Steuerzeiten und Gradscheibe', sub:'Wann öffnet der Auslass? Messen und rechnen', min:20,
 rlp:'Über den Schulstoff hinaus: Winkel und Zeit, Proportionen, Zusammenhang Kurbelwinkel und Kolbenweg',
 steps:[
  W('Steuerzeiten', 'Der Kolben öffnet und schließt die Kanäle. Wann das geschieht, gibt man als **Kurbelwellenwinkel** an. Dabei ist 0° der obere Totpunkt (OT), 180° der untere Totpunkt (UT).\n\nBeispiel: Der **Auslass** öffnet bei 100° nach OT und schließt wieder bei 260° (das ist symmetrisch). Die **Steuerzeit** ist die Zeit, in der er offen ist: 360° − 2 · 100° = **160°**.\n\nTuner feilen den Auslass **höher**. Dann öffnet er früher (kleinerer Winkel), die Steuerzeit wird länger. Das bringt oben mehr Leistung, aber unten weniger Drehmoment.\n\nMessen kann man das mit einer **Gradscheibe** an der Kurbelwelle und einer **Messuhr** zum Finden des OT.',
    'Die Zeichnung ist ein vereinfachtes Modell mit Hub 44 mm, Kurbelradius 22 mm und Pleuel 62 mm. Echte Motoren haben eigene Werte.'),
  L('Auslass höher feilen', 'Stelle ein, wie weit die Oberkante des Auslasses unter dem Kolbenboden liegt, wenn der Kolben im OT steht. Der Kolben ist im Moment des Öffnens gezeichnet.',
    [{id:'x', label:'Abstand Kolbenboden bis Auslass-Oberkante (bei OT)', min:22, max:34, step:1, val:30, unit:' mm'}],
    v => { const a = exAng(v.x), z = zyl(a + 4, {exTop: 134 + v.x, still: true});
      return `<div style="max-width:300px;margin:0 auto">${z.svg}</div><div class="center"><b style="font-size:22px">Auslass öffnet bei ${de(a, 0)}° nach OT</b><br>Steuerzeit: ${de(360 - 2 * a, 0)}°<br><span class="m">Kleiner Abstand: Auslass öffnet früher, Steuerzeit länger.</span></div>`; }),
  N('Der Auslass öffnet bei 95° nach OT. Wie lang ist die Auslass-Steuerzeit? (in Grad)', 170, '360° − 2 · 95° = 170°.', {unit:'°'}),
  N('Bei 6 000 U/min dauert eine Umdrehung 10 ms. Wie lange bleibt der Auslass bei 170° Steuerzeit offen? (ms)', 4.72, '170 ÷ 360 · 10 ms = 4,72 ms.', {tol:.05, unit:'ms', hint:'Anteil an einer Umdrehung: 170 ÷ 360.'}),
  Q('Du feilst den Auslass höher. Was passiert meist?', 'Er öffnet früher, die Steuerzeit wird länger, oben gibt es mehr Leistung.', ['Er öffnet später, der Motor wird leiser.', 'Nichts verändert sich.', 'Der Motor braucht dann kein Öl mehr.'], 'Frühes Öffnen lässt die Abgase eher entweichen. Das passt zu hohen Drehzahlen.'),
  Q('Welchen Nachteil hat eine sehr lange Steuerzeit?', 'Unten herum geht Drehmoment verloren, der Motor wird zickiger.', ['Der Tank wird kleiner.', 'Das Moped wird schwerer.', 'Das Licht flackert.'], 'Bei niedrigen Drehzahlen strömt Frischgas teilweise mit hinaus.'),
  Q('Wozu braucht man eine Messuhr beim Messen der Steuerzeiten?', 'Um den oberen Totpunkt genau zu finden.', ['Um das Öl zu messen.', 'Um die Kette zu spannen.', 'Um den Reifendruck zu prüfen.'], 'Von OT aus liest man den Winkel an der Gradscheibe ab.'),
  Q('Warum öffnet der Auslass vor den Überströmern?', 'Erst sollen die Abgase abströmen, dann kann das Frischgas nachströmen.', ['Das ist Zufall.', 'Damit es lauter wird.', 'Damit die Kerze heller leuchtet.'], 'So entsteht eine saubere Spülung.')
]},

{...PRO, id:'technik-4', topic:'Leistung', title:'Leistung, Drehmoment und PS', sub:'Wie viel Kilowatt kommen aus dem Motor?', min:18,
 rlp:'Über den Schulstoff hinaus: Formeln anwenden, Einheiten umrechnen; Physik: Drehmoment, Leistung, Energie',
 steps:[
  W('Von Newtonmeter zu Kilowatt', 'Das **Drehmoment** M (in Nm) sagt, wie stark der Motor dreht. Die **Leistung** P (in kW) ist Drehmoment mal Drehzahl.\n\n**P (kW) = M (Nm) · n (U/min) ÷ 9 549**\n\n1 kW = 1,36 PS (genauer: 1 PS = 0,7355 kW).\n\nBeispiel: 4 Nm bei 8 000 U/min: 4 · 8 000 ÷ 9 549 = **3,35 kW**.\n\nDie Zahlen hier sind **Beispielwerte** und keine Herstellerangaben.',
    'Bei gleichem Drehmoment bringt mehr Drehzahl mehr Leistung. Darum drehen Tuning-Motoren höher.'),
  L('Leistungs-Rechner', 'Stelle Drehmoment und Drehzahl ein.',
    [{id:'m', label:'Drehmoment', min:1, max:15, step:.5, val:4, unit:' Nm'}, {id:'n', label:'Drehzahl', min:2000, max:10000, step:500, val:8000, unit:' U/min'}],
    v => { const P = v.m * v.n / 9549; return `<div class="center"><b style="font-size:26px">${de(P, 2)} kW</b><br>= ${de(P * 1.36, 1)} PS</div>`; }),
  N('4 Nm bei 8 000 U/min. Wie viel Leistung ist das? (kW, 2 Nachkommastellen)', 3.35, '4 · 8 000 ÷ 9 549 = 32 000 ÷ 9 549 = 3,35 kW.', {tol:.03, unit:'kW'}),
  N('Ein Motor hat 4,4 kW. Wie viel PS sind das? (1 kW = 1,36 PS)', 5.98, '4,4 · 1,36 = 5,98 PS.', {tol:.1, unit:'PS'}),
  N('Ein Motor leistet 6,2 kW bei 8 500 U/min. Welches Drehmoment liegt an? (Nm, 1 Nachkommastelle)', 7, 'M = P · 9 549 ÷ n = 6,2 · 9 549 ÷ 8 500 = 6,97 Nm.', {tol:.1, unit:'Nm', hint:'Stelle die Formel nach M um.'}),
  Q('Bei gleichem Drehmoment wird die Drehzahl verdoppelt. Was passiert mit der Leistung?', 'Sie verdoppelt sich ebenfalls.', ['Sie halbiert sich.', 'Sie bleibt gleich.', 'Sie wird viermal so groß.'], 'P ist proportional zu n.'),
  Q('Was bedeutet „breites Leistungsband“?', 'Der Motor liefert über einen großen Drehzahlbereich gute Leistung.', ['Der Motor hat ein breites Kabel.', 'Der Tank ist groß.', 'Der Auspuff ist dick.'], 'Das macht ein Moped alltagstauglich.'),
  Q('Welche Einheit hat das Drehmoment?', 'Newtonmeter (Nm)', ['Kilowatt (kW)', 'Liter (l)', 'Kilometer (km)'], 'Kraft mal Hebelarm: Newton mal Meter.')
]},

{...PRO, id:'technik-5', topic:'Kurbeltrieb', title:'Kolbengeschwindigkeit und Kurbeltrieb', sub:'Wie schnell läuft der Kolben im Zylinder?', min:16,
 rlp:'Über den Schulstoff hinaus: Geschwindigkeit, Einheiten, Verhältnisse; Technik: Kurbelradius, Pleuelverhältnis',
 steps:[
  W('Der Kolben in Bewegung', 'Bei jeder Umdrehung macht der Kolben einen Weg hinauf und hinunter, also zwei Hübe. Die **mittlere Kolbengeschwindigkeit** ist:\n\n**c = 2 · s · n ÷ 60** (in m/s)\n\ns ist der Hub in Metern (44 mm = 0,044 m), n die Drehzahl.\n\nBeispiel: 6 000 U/min: 2 · 0,044 · 6 000 ÷ 60 = **8,8 m/s**.\n\nDer **Kurbelradius** r ist der halbe Hub (22 mm). Das **Pleuelverhältnis** l ÷ r vergleicht Pleuellänge und Kurbelradius.',
    'Rennmotoren erreichen mittlere Kolbengeschwindigkeiten von über 20 m/s. Das ist die Grenze, die Material und Schmierung aushalten.'),
  N('Hub 44 mm, Drehzahl 9 000 U/min. Wie groß ist die mittlere Kolbengeschwindigkeit? (m/s)', 13.2, '2 · 0,044 · 9 000 ÷ 60 = 13,2 m/s.', {tol:.1, unit:'m/s'}),
  N('Wie groß ist der Kurbelradius bei 44 mm Hub? (mm)', 22, 'Hub ÷ 2 = 22 mm.', {unit:'mm'}),
  N('Pleuel 62 mm, Kurbelradius 22 mm. Wie groß ist das Pleuelverhältnis? (l ÷ r, 2 Nachkommastellen)', 2.82, '62 ÷ 22 = 2,82.', {tol:.03}),
  N('Mit 50 mm Hub und 9 000 U/min: Wie groß ist die mittlere Kolbengeschwindigkeit? (m/s)', 15, '2 · 0,05 · 9 000 ÷ 60 = 15 m/s.', {tol:.1, unit:'m/s'}),
  Q('Was passiert mit dem Verschleiß, wenn die Drehzahl höher wird?', 'Er steigt stark an.', ['Er sinkt.', 'Er bleibt gleich.', 'Er verschwindet.'], 'Höhere Geschwindigkeit bedeutet mehr Reibung und größere Kräfte.'),
  Q('Wo ist die Beschleunigung des Kolbens am größten?', 'Im oberen und unteren Totpunkt, wo er die Richtung wechselt.', ['In der Mitte des Hubs', 'Nur beim Anlassen', 'Nirgends'], 'Dort kehrt sich die Bewegung um.'),
  Q('Was ist die Aufgabe des Pleuels?', 'Es verbindet Kolben und Kurbelwelle.', ['Es zündet das Gemisch.', 'Es kühlt den Zylinder.', 'Es spannt die Kette.'], 'Es überträgt die Kraft vom Kolben auf die Kurbelwelle.')
]},

{...PRO, id:'technik-6', topic:'Antrieb', title:'Gesamtübersetzung und Tempo', sub:'Primär, Getriebe, Kette: Wie schnell fährst du?', min:20,
 rlp:'Über den Schulstoff hinaus: Rechnen mit Übersetzungsverhältnissen, Geschwindigkeit und Einheiten umrechnen',
 steps:[
  W('Von der Kurbelwelle zum Rad', 'Zwischen Motor und Hinterrad liegen drei Stufen:\n\n1. **Primärantrieb** (Kurbelwelle auf Kupplung): i_P\n2. **Getriebe** im jeweiligen Gang: i_G\n3. **Kette**: i_K = Zähne Kettenrad ÷ Zähne Ritzel\n\n**Gesamtübersetzung:** i = i_P · i_G · i_K\n\nDie Raddrehzahl ist n_Rad = n_Motor ÷ i. Die Geschwindigkeit:\n\n**v (km/h) = n_Rad · Radumfang (m) · 60 ÷ 1 000**\n\nAlle Zahlen sind **Beispielwerte**, keine Originalwerte.',
    'Bei einer Änderung, die die Höchstgeschwindigkeit verändert, muss der Tacho passen und die Betriebserlaubnis in Ordnung bleiben.'),
  L('Tempo-Rechner (Beispiel)', 'Radumfang 1,7 m.',
    [{id:'p', label:'Primär', min:2, max:4, step:.1, val:3, unit:''}, {id:'g', label:'Getriebe', min:.9, max:3.6, step:.1, val:1.5, unit:''}, {id:'z', label:'Ritzel-Zähne', min:13, max:17, step:1, val:15, unit:''}, {id:'k', label:'Kettenrad-Zähne', min:28, max:36, step:1, val:30, unit:''}, {id:'n', label:'Motordrehzahl', min:3000, max:9000, step:500, val:6000, unit:' U/min'}],
    v => { const i = v.p * v.g * (v.k / v.z), rad = v.n / i, kmh = rad * 1.7 * 60 / 1000; return `<div class="center">Gesamtübersetzung: <b>${de(i, 2)}</b><br>Hinterrad: ${de(rad, 0)} U/min<br><b style="font-size:26px">${de(kmh, 1)} km/h</b></div>`; }),
  N('Primär 3, Getriebe 1,5, Kette 15/30. Wie groß ist die Gesamtübersetzung?', 9, '3 · 1,5 · (30 ÷ 15) = 3 · 1,5 · 2 = 9.', {tol:.05}),
  N('Bei 6 000 U/min Motordrehzahl und i = 9: Wie viele km/h bei 1,7 m Radumfang? (1 Nachkommastelle)', 68, 'n_Rad = 6 000 ÷ 9 = 666,7. v = 666,7 · 1,7 · 60 ÷ 1 000 = 68,0 km/h.', {tol:.2, unit:'km/h'}),
  N('Das Kettenrad wird auf 32 Zähne gewechselt (Ritzel 15). Wie groß wird die Gesamtübersetzung? (2 Nachkommastellen)', 9.6, 'i_K = 32 ÷ 15 = 2,133. i = 3 · 1,5 · 2,133 = 9,6.', {tol:.03}),
  N('Mit i = 9,6 und 6 000 U/min: Wie viele km/h? (1 Nachkommastelle)', 63.8, 'n_Rad = 625. v = 625 · 1,7 · 0,06 = 63,75 ≈ 63,8 km/h.', {tol:.2, unit:'km/h'}),
  Q('Ein größeres Kettenrad bei gleichem Ritzel macht die Übersetzung …', 'kürzer: weniger Endtempo, mehr Zug', ['länger: mehr Endtempo', 'gleich', 'unwirksam'], 'Mehr Übersetzung drückt die Drehzahl am Rad herunter. Das Moped zieht besser, ist aber nicht so schnell.'),
  Q('Warum sollte man nach Änderungen am Antrieb den Tacho prüfen?', 'Weil die Anzeige dann nicht mehr stimmen kann und die Papiere passen müssen.', ['Weil der Tacho dann leuchtet.', 'Weil der Tacho sonst rostet.', 'Das ist völlig egal.'], 'Der Tacho muss die tatsächliche Geschwindigkeit anzeigen.')
]},

{...PRO, id:'technik-7', topic:'Gemisch', title:'Vergaser und Kerzenbild', sub:'Fett oder mager? Das Gemisch richtig lesen', min:18,
 rlp:'Über den Schulstoff hinaus: Verhältnisse, Gemisch, Verbrennung; Technik: Vergaserabstimmung und Fehlerdiagnose',
 steps:[
  W('Das Gemisch abstimmen', 'Das **Luft-Kraftstoff-Verhältnis** bestimmt, ob die Verbrennung gut funktioniert. Für Benzin liegt das ideale Verhältnis bei etwa **14,7 kg Luft auf 1 kg Benzin** (λ = 1).\n\n• **mager** = zu viel Luft: heiß, Gefahr eines Kolbenklemmers\n• **fett** = zu viel Kraftstoff: kühl, aber Ruß und schlechte Leistung\n\nIm Vergaser regeln mehrere Teile das Gemisch:\n• **Leerlaufdüse** (Leerlauf)\n• **Nadel und Nadeldüse** (Teillast)\n• **Hauptdüse** (Volllast)\n\nZweitaktmotoren laufen bei Volllast oft etwas fetter, damit das Gemisch mitkühlt. Beim Tuning muss man das neu abstimmen.',
    'Das **Kerzenbild** hilft beim Beurteilen: Man fährt kurz unter Volllast, schaltet aus und liest die Farbe der Elektrode.'),
  M('Kerzenbild lesen', [['hell, weißlich-grau', 'Gemisch zu mager'], ['rehbraun', 'passt gut'], ['schwarz, rußig', 'Gemisch zu fett']], 'Welche Farbe passt zu welchem Gemisch?'),
  Q('Welche Düse arbeitet vor allem bei Volllast?', 'Die Hauptdüse', ['Die Leerlaufdüse', 'Die Tankdüse', 'Die Hupendüse'], 'Bei Vollgas fließt der meiste Kraftstoff über die Hauptdüse.'),
  Q('Du baust einen größeren Zylinder ein, der Vergaser bleibt gleich. Was droht?', 'Ein mageres Gemisch und damit Überhitzung', ['Ein zu kaltes Gemisch', 'Ein größerer Tank', 'Nichts'], 'Der Motor braucht mehr Luft und mehr Kraftstoff. Sonst wird das Gemisch mager.'),
  Q('Wie ändert sich das Gemisch, wenn die Luft kälter und dichter wird?', 'Es wird magerer, weil mehr Sauerstoff in den Zylinder kommt.', ['Es wird fetter.', 'Es bleibt immer gleich.', 'Es verdampft nicht mehr.'], 'Kalte Luft ist dichter. Der Vergaser gibt nicht automatisch mehr Kraftstoff dazu.'),
  Q('Was ist „Nebenluft“?', 'Luft, die durch undichte Stellen am Ansaugweg in den Motor gelangt.', ['Luft im Reifen', 'Die Luft im Tank', 'Der Wind beim Fahren'], 'Sie macht das Gemisch mager und kann den Motor beschädigen.'),
  N('Wie viel kg Benzin braucht man etwa für 14,7 kg Luft bei λ = 1?', 1, 'Das ideale Verhältnis ist 14,7 : 1.', {unit:'kg'}),
  N('Bei einem Gemisch 14,7 : 1 strömen 29,4 kg Luft durch den Motor. Wie viel Benzin gehört dazu? (kg)', 2, '29,4 ÷ 14,7 = 2 kg.', {tol:.01, unit:'kg'}),
  Q('Das Kerzenbild ist weiß und trocken. Was ist sinnvoll?', 'Sofort aufhören, nicht mehr hoch drehen und die Abstimmung prüfen.', ['Mehr Gas geben', 'Einfach weiterfahren', 'Weniger Öl tanken'], 'Weißes Bild bedeutet meist mager. Das kann den Kolben ruinieren.')
]},

{...PRO, id:'technik-8', topic:'Auspuff', title:'Der Resonanzauspuff', sub:'Wie Schallwellen Leistung machen', min:20,
 rlp:'Über den Schulstoff hinaus: Schall und Wellen, Zeit und Weg, Rechnen mit Geschwindigkeit; Technik: Resonanzauspuff',
 steps:[
  W('Wellen im Auspuff', 'Beim Öffnen des Auslasses läuft eine **Druckwelle** durch den Auspuff. Sie wird an Querschnittsänderungen zurückgeworfen und kommt wieder am Zylinder an.\n\n• **Krümmer**: leitet das Abgas weg.\n• **Diffusor**: der Auspuff wird weiter. Er erzeugt eine **Unterdruckwelle**, die Abgase aus dem Zylinder saugt.\n• **Gegenkonus**: der Auspuff wird wieder enger. Er wirft eine **Druckwelle** zurück, die das Frischgas in den Zylinder zurückdrückt.\n• **Endrohr**: dämpft den Rest.\n\nDas funktioniert nur bei einer bestimmten Drehzahl (Resonanz). Die Länge des Auspuffs ist darauf abgestimmt. Die Schallgeschwindigkeit im heißen Abgas liegt grob bei **500 m/s** (Faustwert).',
    'Resonanzauspuffe machen den Motor in einem schmalen Drehzahlbereich besonders stark, darunter und darüber sinkt die Leistung.'),
  M('Teile des Resonanzauspuffs', [['Krümmer', 'führt das Abgas weg'], ['Diffusor', 'saugt Abgas aus dem Zylinder'], ['Gegenkonus', 'schickt Frischgas zurück'], ['Endrohr', 'dämpft den Schall']], 'Welche Aufgabe hat welcher Teil?'),
  N('Bei 8 000 U/min: Wie lange dauert eine Umdrehung? (ms, 1 Nachkommastelle)', 7.5, '60 000 ms ÷ 8 000 = 7,5 ms.', {tol:.05, unit:'ms'}),
  N('Der Auslass ist 160° offen. Wie viele ms sind das bei 8 000 U/min? (2 Nachkommastellen)', 3.33, '160 ÷ 360 · 7,5 ms = 3,33 ms.', {tol:.03, unit:'ms'}),
  N('Eine Welle läuft mit 500 m/s. Wie weit kommt sie in 3 ms? (m)', 1.5, '500 m/s · 0,003 s = 1,5 m.', {tol:.01, unit:'m'}),
  N('Die Welle läuft hin und zurück in 3 ms (1,5 m). Wie lang ist dann etwa der Weg bis zum Reflektor? (m)', 0.75, 'Hin und zurück sind zwei Strecken: 1,5 m ÷ 2 = 0,75 m.', {tol:.01, unit:'m'}),
  Q('Warum klingt ein Resonanzauspuff meist nur in einem Drehzahlbereich „gut“?', 'Er ist auf eine bestimmte Wellenlaufzeit und damit Drehzahl abgestimmt.', ['Er ist zu heiß.', 'Er ist zu schwer.', 'Er ist zu glänzend.'], 'Außerhalb der abgestimmten Drehzahl treffen die Wellen zur falschen Zeit ein.'),
  Q('Was macht der Diffusor?', 'Er erzeugt eine Unterdruckwelle, die den Zylinder leerzieht.', ['Er füllt den Tank.', 'Er kühlt die Kette.', 'Er dämpft den Reifen.'], 'Der erweiternde Querschnitt lässt die Welle als Unterdruck zurückkommen.')
]},

{...PRO, id:'technik-9', topic:'Zündung', title:'Zündzeitpunkt und Vorzündung', sub:'Millimeter vor OT in Grad umrechnen', min:18,
 rlp:'Über den Schulstoff hinaus: Winkel, Zeit, Umrechnen zwischen Weg und Winkel; Technik: Zündzeitpunkt',
 steps:[
  W('Wann zündet die Kerze?', 'Die Zündung muss **vor** dem oberen Totpunkt erfolgen, weil das Gemisch Zeit zum Verbrennen braucht. Die **Vorzündung** wird in **mm vor OT** (Messuhr am Kolben) oder in **Grad** angegeben.\n\n• **Zu früh**: das Gemisch klopft, Kolbenklemmer und Lagerschäden drohen.\n• **Zu spät**: Leistung geht verloren, der Motor und der Auspuff werden heiß.\n\nMit unserem Modell (Hub 44 mm, Pleuel 62 mm) entsprechen etwa **1,8 mm vor OT** rund **20°** Kurbelwinkel.\n\nEinstellen kann man mit einer Messuhr oder einer Stroboskop-Zündlampe.',
    'Beim Zünden bleibt dem Gemisch nur ein paar Tausendstel Sekunden zum Verbrennen. Darum ist der Zeitpunkt so wichtig.'),
  L('Vorzündung einstellen', 'Stelle ein, wie viele Millimeter vor OT die Kerze zündet. Der Kolben ist im Moment der Zündung gezeichnet.',
    [{id:'z', label:'Zündung', min:.5, max:3.5, step:.1, val:1.8, unit:' mm vor OT'}],
    v => { const a = exAng(v.z), z = zyl(360 - a, {still: true});
      return `<div style="max-width:300px;margin:0 auto">${z.svg}</div><div class="center"><b style="font-size:22px">${de(a, 0)}° vor OT</b><br><span class="m">${v.z < 1.2 ? 'Eher spät: wenig Klopfen, aber Leistungsverlust' : v.z > 2.6 ? 'Sehr früh: Klopfgefahr, Motor in Gefahr' : 'Im üblichen Bereich'}</span></div>`; }),
  N('Wie viel Grad vor OT entsprechen 1,8 mm im Modell? (ganze Zahl)', 20, 'Mit Hub 44 mm, Pleuel 62 mm ergibt 1,8 mm etwa 20°.', {tol:1, unit:'°'}),
  N('Bei 6 000 U/min dauert eine Umdrehung 10 ms. Wie lange dauern 20° Kurbelwinkel? (ms, 3 Nachkommastellen)', 0.556, '20 ÷ 360 · 10 ms = 0,556 ms.', {tol:.005, unit:'ms'}),
  Q('Die Zündung steht zu früh. Was kann passieren?', 'Klopfen und Kolbenklemmer', ['Der Tank läuft leer', 'Die Kette springt ab', 'Der Reifen platzt'], 'Das Gemisch verbrennt gegen den aufsteigenden Kolben und erzeugt Spitzen in Druck und Hitze.'),
  Q('Die Zündung steht zu spät. Was merkst du?', 'Weniger Leistung, der Motor wird heiß, der Auspuff kann glühen.', ['Der Motor ist leiser und kühler', 'Der Tank wird voller', 'Das Licht geht an'], 'Die Verbrennung läuft noch, wenn der Auslass schon offen ist.'),
  Q('Womit stellt man die Vorzündung genau ein?', 'Mit einer Messuhr am Kolben oder einer Stroboskop-Zündlampe', ['Mit dem Zollstock', 'Mit der Wasserwaage', 'Mit dem Thermometer'], 'So findet man den Zündzeitpunkt genau.')
]},

{...PRO, id:'technik-10', topic:'Fehlersuche', title:'Fehlersuche: Der Motor springt nicht an', sub:'Wie ein Profi systematisch vorgeht', min:16,
 rlp:'Über den Schulstoff hinaus: logisches Schlussfolgern, Ursache und Wirkung; Technik: Fehlerdiagnose',
 steps:[
  W('Das Dreieck der Verbrennung', 'Ein Motor läuft nur, wenn drei Dinge zusammenkommen:\n\n1. **Kraftstoff-Luft-Gemisch** (Vergaser, Tank, Hahn, Filter)\n2. **Zündfunke** (Kerze, Kabel, Zündspule, Zündung)\n3. **Verdichtung** (Kolben, Ringe, Dichtungen)\n\nEin Profi prüft diese drei Dinge **der Reihe nach** und nicht wild durcheinander. So findet er den Fehler schnell.',
    'Sicherheit: Beim Prüfen des Zündfunkens nie die Kerze oder das Kabel in der Hand halten. Verwende dafür eine Zange mit Isolierung oder lass einen Erwachsenen helfen.'),
  O('Eine sinnvolle Prüfreihenfolge', ['Ist Kraftstoff im Tank und der Hahn offen?', 'Ist die Kerze trocken und kommt ein Zündfunke?', 'Läuft Kraftstoff in den Vergaser (Schwimmerkammer)?', 'Ist genug Verdichtung da (lässt sich der Kolben anschieben)?'], 'Tippe die Prüfschritte in einer sinnvollen Reihenfolge an. Es gibt nur eine richtige Reihenfolge.'),
  M('Symptom und Ursache', [['Kerze ist nass vom Kicken (abgesoffen)', 'Kerze trocknen, mit Gas kicken'], ['Kein Funke trotz neuer Kerze', 'Zündspule oder Zündkabel prüfen'], ['Motor läuft nur mit Choke', 'Nebenluft oder zu magere Leerlaufeinstellung'], ['Kolben lässt sich kaum bewegen', 'Kolbenklemmer, Motor nicht weiter drehen']], 'Welche Ursache passt wahrscheinlich?'),
  Q('Die Kerze ist nach vielen Kickversuchen nass. Was bedeutet das meist?', 'Der Motor ist abgesoffen: zu viel Kraftstoff im Brennraum.', ['Der Tank ist leer', 'Der Kolben fehlt', 'Das Licht ist an'], 'Nasse Kerze: trocknen, Gas auf und kicken.'),
  Q('Wie erkennst du fehlende Verdichtung?', 'Der Kolben lässt sich leicht durchdrehen und es fehlt der Widerstand.', ['Der Tank ist zu voll', 'Die Reifen sind hart', 'Die Spiegel sind locker'], 'Verdichtung baut Widerstand auf. Ohne ihn läuft der Motor nicht.'),
  Q('Warum prüft ein Profi zuerst die einfachen Dinge (Kraftstoff, Funke)?', 'Weil die meisten Fehler dort liegen und das Prüfen schnell geht.', ['Weil es Spaß macht.', 'Weil es teuer ist.', 'Weil er keine Werkzeuge hat.'], 'Erst einfach, dann aufwendig.'),
  Q('Der Motor läuft im Leerlauf unruhig und nimmt schlecht Gas an. Was ist eine Ursache?', 'Nebenluft am Ansaugstutzen', ['Zu viel Reifendruck', 'Ein zu heller Scheinwerfer', 'Ein neuer Sitz'], 'Nebenluft macht das Gemisch mager und unruhig.')
]},

{...PRO, id:'technik-11', topic:'Fahrzeugkunde', title:'Fahrzeug-Detektiv', sub:'Erkenne Simson, Schwalbe, ZT 300 und Co. auf Fotos', min:12,
 rlp:'Über den Schulstoff hinaus: Beobachten, Vergleichen, Merkmale erkennen (Fahrzeugkunde)',
 steps:[
  W('Welches Fahrzeug ist das?', 'Auf den Fotos siehst du Fahrzeuge, die in der DDR und im Osten gebaut wurden. Achte auf Form, Tank, Sitz, Lampen und Motor.\n\nDie Bilder sind Fotos und KI-Bilder nach Vorlagen von Wikimedia Commons. Die Nachweise stehen im Elternbereich unter „Bildnachweis“.'),
  Q('Welches Fahrzeug ist das?', 'Simson S51', ['Simson Schwalbe KR51/2', 'Simson SR50', 'Honda MTX'], 'Die S51 ist ein Mokick mit offenem Rahmen und Tank zwischen den Knien.', 'v2/img/ki/s51.jpg'),
  Q('Welche Simson ist das? (Postmoped)', 'Simson S51', ['Fortschritt ZT 300', 'Honda MTX 200 R', 'Mähdrescher E 512'], 'Auch hier eine S51, hier in der gelben Postlackierung.', 'img/foto/s51-b24.jpg'),
  Q('Welches Fahrzeug ist das?', 'Simson Schwalbe KR51/2', ['Simson S51', 'Simson SR50', 'Honda MTX'], 'Die Schwalbe hat eine runde, geschlossene Verkleidung und Beinschilde.', 'img/foto/schwalbe-kr51-2.jpg'),
  Q('Welches Fahrzeug ist das?', 'Fortschritt ZT 300 (Traktor)', ['Simson S51', 'Mähdrescher E 512', 'Rasentraktor'], 'Der ZT 300 ist ein DDR-Traktor mit Kabine.', 'img/foto/zt300-gelsdorf.jpg'),
  Q('Welches Fahrzeug ist das?', 'Fortschritt E 512 (Mähdrescher)', ['Fortschritt ZT 300', 'Simson Schwalbe', 'Honda MTX'], 'Der E 512 ist ein Mähdrescher mit Schneidwerk und Abtankrohr.', 'img/foto/e512-seite.jpg')
]}

);
