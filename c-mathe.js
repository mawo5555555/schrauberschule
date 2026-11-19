// Mathe Klasse 6 (Rahmenlehrplan Berlin-Brandenburg, Niveaustufe D): Brüche, Dezimalzahlen, Teilbarkeit, Größen, Flächen, Volumen, Winkel, Daten
MISSIONS.push(

{id:'mathe-1', subject:'mathe', theme:'simson', topic:'Brüche', title:'Tankanzeige', sub:'Brüche am Simson-Tank', min:12,
 rlp:'Zahlen: Brüche als Anteile, Kürzen und Erweitern, Brüche vergleichen, Bruchteile von Größen',
 steps:[
  W('Der Tank ist 3/4 voll', 'Die Tankanzeige deiner Simson hat 8 gleich große Felder. Sind 6 davon gefüllt, ist der Tank 6/8 voll.\n\nEin Bruch sagt: **wie viele Teile** (Zähler, oben) von **wie vielen gleichen Teilen** (Nenner, unten).\n\nKürzen = Zähler und Nenner durch dieselbe Zahl teilen. Erweitern = mit derselben Zahl malnehmen. Der Wert bleibt gleich.',
    'Brüche kannst du auch als Dezimalzahl und als Prozent schreiben: 1/2 = 0,5 = 50 %.'),
  L('Probier es aus', 'Verschiebe den Regler und beobachte Bruch, Dezimalzahl und Prozent.',
    [{id:'n', label:'gefüllte Felder', min:0, max:8, step:1, val:3, unit:''}],
    v => { let c = ''; for (let i = 0; i < 8; i++) c += `<rect x="${8 + i * 34}" y="10" width="30" height="46" rx="6" fill="${i < v.n ? '#ff8a1f' : 'rgba(255,255,255,.14)'}"/>`;
      const g = gcd(v.n, 8);
      return `<svg viewBox="0 0 284 66" width="100%">${c}</svg><div class="center"><b style="font-size:30px">${v.n}/8</b> = ${de(v.n / 8, 3)} = ${de(v.n * 12.5, 1)} %</div>
      <div class="m center">${v.n > 0 && g > 1 ? 'Gekürzt: ' + v.n / g + '/' + 8 / g : '&nbsp;'}</div>`; }),
  Q('Der Tank hat 8 gleiche Teile, 6 davon sind gefüllt. Welcher Bruch passt?', '6/8', ['8/6', '2/8', '6/14'], 'Zähler = gefüllte Teile (6), Nenner = alle Teile (8).'),
  Q('Kürze den Bruch 6/8 so weit wie möglich.', '3/4', ['2/3', '3/8', '6/4'], 'Zähler und Nenner durch 2 teilen: 6 ÷ 2 = 3 und 8 ÷ 2 = 4.'),
  Q('Welcher Bruch ist so groß wie 1/2?', '4/8', ['2/3', '3/8', '5/8'], '1/2 mit 4 erweitert ergibt 4/8.'),
  N('Der Reservekanister fasst 4 Liter und ist 3/4 voll. Wie viele Liter sind drin?', 3, '1/4 von 4 Litern ist 1 Liter. Also sind 3/4 genau 3 Liter.', {unit:'Liter', hint:'Teile 4 Liter in 4 gleiche Teile.'}),
  Q('Welcher Tank ist voller: 2/3 oder 3/5?', '2/3', ['3/5', 'beide gleich voll', 'das kann man nicht sagen'], 'Gleichnamig machen: 2/3 = 10/15 und 3/5 = 9/15. Also ist 2/3 mehr.'),
  N('Wie viele Minuten sind 3/4 Stunde?', 45, '1/4 Stunde sind 15 Minuten, also 3/4 Stunde sind 45 Minuten.', {unit:'Minuten'})
]},

{id:'mathe-2', subject:'mathe', theme:'traktor', topic:'Flächen', title:'Rasen mähen', sub:'Fläche und Umfang berechnen', min:12,
 rlp:'Größen: Flächeninhalt und Umfang, zusammengesetzte Flächen, Einheiten m², a, ha',
 steps:[
  W('Fläche und Umfang', 'Opas Rasen ist 12 m lang und 8 m breit.\n\n**Fläche** = Länge · Breite. Sie zeigt, wie viel Rasen zu mähen ist (in m²).\n**Umfang** = alle Seiten zusammen. Er zeigt, wie viel Zaun du brauchst (in m).\n\nGroße Felder misst man in Hektar: 1 ha = 100 m · 100 m = 10 000 m².',
    'Ein Fußballfeld ist etwa 0,7 ha groß. Auf ein Feld mit 10 ha passen also ungefähr 14 Fußballfelder.'),
  L('Rasen-Planer', 'Stelle Länge und Breite ein. Der Rasentraktor schafft etwa 2 500 m² pro Stunde.',
    [{id:'l', label:'Länge', min:2, max:20, step:1, val:12, unit:' m'}, {id:'b', label:'Breite', min:2, max:20, step:1, val:8, unit:' m'}],
    v => `<svg viewBox="0 0 220 130" width="100%"><rect x="10" y="10" width="${v.l * 10}" height="${v.b * 6}" rx="6" fill="#4cc35a"/></svg>
      <div class="center"><b>Fläche: ${v.l * v.b} m²</b><br><b>Umfang: ${2 * (v.l + v.b)} m</b><br><span class="m">Mähzeit: ca. ${de(v.l * v.b / 2500 * 60, 1)} Minuten</span></div>`),
  N('Wie groß ist die Rasenfläche (12 m lang, 8 m breit)?', 96, 'Länge mal Breite: 12 · 8 = 96 m².', {unit:'m²'}),
  N('Wie viel Zaun brauchst du rund um den Rasen (Umfang)?', 40, 'Zwei Längen und zwei Breiten: 12 + 8 + 12 + 8 = 40 m.', {unit:'m', hint:'Alle vier Seiten zusammenzählen.'}),
  N('Ein Garten hat die Form eines L: Ein Rechteck 10 m · 6 m und daneben ein Rechteck 4 m · 5 m. Wie groß ist er insgesamt?', 80, 'Teilflächen addieren: 10 · 6 = 60 m² und 4 · 5 = 20 m². Zusammen 80 m².', {unit:'m²', hint:'Rechne die beiden Rechtecke einzeln aus.'}),
  Q('Ein Feld ist 100 m lang und 100 m breit. Wie groß ist es?', '1 Hektar (1 ha)', ['1 Ar (1 a)', '1 Quadratkilometer', '1 Quadratmeter'], '100 · 100 = 10 000 m². Das ist genau 1 Hektar.'),
  N('Ein Acker ist 3 ha groß. Wie viele m² sind das?', 30000, '1 ha sind 10 000 m². Also sind 3 ha gleich 30 000 m².', {unit:'m²'}),
  Q('Du verdoppelst Länge und Breite eines Rechtecks. Was passiert mit der Fläche?', 'Sie wird viermal so groß.', ['Sie wird doppelt so groß.', 'Sie bleibt gleich.', 'Sie wird dreimal so groß.'], '2 · 2 = 4. Beim Verdoppeln beider Seiten passt die ursprüngliche Fläche viermal hinein.')
]},

{id:'mathe-3', subject:'mathe', theme:'simson', topic:'Dezimalzahlen', title:'Zweitakt-Gemisch', sub:'Dezimalzahlen und Verhältnisse', min:12,
 rlp:'Zahlen: Dezimalzahlen vergleichen, runden und rechnen; Größen: Liter und Milliliter; Verhältnisse',
 steps:[
  W('1:50 – das Mischungsverhältnis', 'Eine Simson hat einen Zweitaktmotor. Sie fährt mit einem Gemisch aus Benzin und Zweitaktöl, meist im Verhältnis **1:50**.\n\nDas heißt: Auf 50 Teile Benzin kommt 1 Teil Öl. Bei 1 Liter Benzin (= 1 000 ml) sind das 1 000 ml ÷ 50 = **20 ml Öl**.',
    'Die Simson S51 wurde ab 1980 im thüringischen Suhl gebaut.'),
  L('Gemisch-Rechner', 'Wie viel Öl gehört zu wie viel Benzin?',
    [{id:'b', label:'Benzin', min:1, max:10, step:1, val:5, unit:' l'}],
    v => `<div class="center"><b style="font-size:26px">${v.b} l Benzin + ${v.b * 20} ml Öl</b></div>
      <div class="bar" style="margin:12px 0"><i style="width:${Math.min(100, v.b * 10)}%"></i></div><div class="m center">Rechenweg: 1 000 ml ÷ 50 = 20 ml je Liter</div>`),
  N('Wie viel Öl (in ml) kommt bei 1:50 in 2 Liter Benzin?', 40, '2 · 20 ml = 40 ml.', {unit:'ml'}),
  N('Dein Kanister fasst 5 Liter Benzin. Wie viel Öl (in ml) brauchst du?', 100, '5 · 20 ml = 100 ml.', {unit:'ml'}),
  N('Du hast 60 ml Öl abgemessen. Für wie viele Liter Benzin reicht das (1:50)?', 3, '60 ml ÷ 20 ml je Liter = 3 Liter.', {unit:'Liter'}),
  Q('Welche Zahl ist die kleinste?', '0,07', ['0,7', '0,17', '0,71'], 'Vergleiche stellenweise: 0,07 hat null Zehntel, 0,17 hat 1 Zehntel, 0,7 und 0,71 haben 7 Zehntel. Die kleinste Zahl ist 0,07.'),
  N('Die Simson braucht 2,5 Liter auf 100 km. Wie viele Liter verbraucht sie auf 300 km?', 7.5, '3 · 2,5 l = 7,5 l.', {unit:'Liter', hint:'300 km sind 3 mal 100 km.'}),
  N('Du tankst 4 Liter für 1,85 € pro Liter. Wie viel musst du bezahlen?', 7.4, '4 · 1,85 € = 7,40 €.', {unit:'€', hint:'4 · 1,85 = 4 · 1 + 4 · 0,85.'}),
  N('Der Reservekanister fasst 4 Liter, die Simson verbraucht 2 Liter auf 100 km. Wie weit kommst du mit einer Kanisterfüllung?', 200, '4 Liter reichen für zweimal 100 km, also 200 km.', {unit:'km'})
]},

{id:'mathe-4', subject:'mathe', theme:'simson', topic:'Teilbarkeit', title:'Zahnräder', sub:'Teiler, Vielfache, Primzahlen', min:12,
 rlp:'Zahlen: Teilbarkeitsregeln, Primzahlen, gemeinsame Teiler und Vielfache',
 steps:[
  W('Zahnräder und Teilbarkeit', 'In einem Getriebe greifen Zahnräder ineinander. Wann stehen beide Markierungen wieder gleich? Genau dann, wenn die Zahl der gedrehten Zähne ein **gemeinsames Vielfaches** der Zahnzahlen ist.\n\nTeilbarkeit: durch 2 (letzte Ziffer gerade), durch 5 (Endung 0 oder 5), durch 3 (Quersumme durch 3 teilbar), durch 9 (Quersumme durch 9 teilbar).\n\nEine **Primzahl** hat genau zwei Teiler: 1 und sich selbst.',
    '2 ist die einzige gerade Primzahl.'),
  L('Zahnrad-Rechner', 'Zwei Zahnräder starten an der Markierung. Nach wie vielen Zähnen treffen sich die Markierungen wieder?',
    [{id:'a', label:'Rad A', min:6, max:24, step:1, val:12, unit:' Zähne'}, {id:'b', label:'Rad B', min:6, max:24, step:1, val:18, unit:' Zähne'}],
    v => { const k = lcm(v.a, v.b); return `<div class="center"><b style="font-size:26px">nach ${k} Zähnen</b><br>Rad A dreht sich ${k / v.a}×, Rad B ${k / v.b}×.<br><span class="m">kgV (kleinstes gemeinsames Vielfaches) = ${k} · ggT (größter gemeinsamer Teiler) = ${gcd(v.a, v.b)}</span></div>`; }),
  Q('Welche Zahl ist durch 3 teilbar?', '123', ['124', '125', '131'], 'Quersumme von 123 ist 1 + 2 + 3 = 6, und 6 ist durch 3 teilbar.'),
  Q('Welche Zahl ist eine Primzahl?', '13', ['21', '27', '33'], '13 hat nur die Teiler 1 und 13. Die anderen sind auch durch 3 teilbar.'),
  N('Wie viele Teiler hat die Zahl 12?', 6, 'Die Teiler sind 1, 2, 3, 4, 6 und 12.', {hint:'Probiere der Reihe nach: 1, 2, 3, 4 …'}),
  N('Zahnrad A hat 12 Zähne, Zahnrad B hat 18 Zähne. Nach wie vielen Zähnen stehen beide Markierungen wieder gleich?', 36, 'Vielfache von 12: 12, 24, 36. Vielfache von 18: 18, 36. Das erste gemeinsame ist 36.', {unit:'Zähne', hint:'Schreibe die Vielfachen von beiden Zahlen auf.'}),
  N('Wie oft hat sich Zahnrad A (12 Zähne) bis dahin gedreht?', 3, '36 ÷ 12 = 3 Umdrehungen.', {unit:'mal'}),
  Q('Welche Zahl ist durch 4 und durch 6 teilbar?', '36', ['18', '28', '30'], '36 = 4 · 9 und 36 = 6 · 6. Die anderen passen nur zu einer der beiden Zahlen.')
]},

{id:'mathe-5', subject:'mathe', theme:'sport', topic:'Winkel', title:'Winkel-Profi', sub:'Winkel messen und schätzen', min:12,
 rlp:'Größen und Raum und Form: Winkelgrößen im Gradmaß, Winkelarten, Winkel schätzen und berechnen',
 steps:[
  W('Winkel und Grad', 'Winkel misst man in Grad (°).\n\n• spitzer Winkel: kleiner als 90°\n• rechter Winkel: genau 90°\n• stumpfer Winkel: zwischen 90° und 180°\n• gestreckter Winkel: genau 180°\n• Vollwinkel: 360°\n\nZwei Winkel auf einer geraden Linie ergeben zusammen 180°.'),
  L('Winkel einstellen', 'Stelle verschiedene Winkel ein und schau, wie sie heißen.',
    [{id:'w', label:'Winkel', min:0, max:360, step:5, val:60, unit:'°'}],
    v => { const r = v.w * Math.PI / 180, x = 100 + 90 * Math.cos(r), y = 100 - 90 * Math.sin(r), ax = 100 + 44 * Math.cos(r), ay = 100 - 44 * Math.sin(r);
      const nm = v.w === 0 ? 'kein Winkel' : v.w < 90 ? 'spitzer Winkel' : v.w === 90 ? 'rechter Winkel' : v.w < 180 ? 'stumpfer Winkel' : v.w === 180 ? 'gestreckter Winkel' : v.w < 360 ? 'überstumpfer Winkel' : 'Vollwinkel';
      const arc = v.w >= 360 ? '<circle cx="100" cy="100" r="44" fill="none" stroke="#ffd60a" stroke-width="4"/>' : v.w > 0 ? `<path d="M144 100 A44 44 0 ${v.w > 180 ? 1 : 0} 0 ${ax} ${ay}" fill="none" stroke="#ffd60a" stroke-width="4"/>` : '';
      return `<svg viewBox="0 0 200 200" width="70%" style="display:block;margin:0 auto"><line x1="100" y1="100" x2="190" y2="100" stroke="#fff" stroke-width="3"/><line x1="100" y1="100" x2="${x}" y2="${y}" stroke="#fff" stroke-width="3"/>${arc}</svg>
      <div class="center"><b style="font-size:24px">${v.w}°</b><br>${nm}</div>`; }),
  Q('Die Ecke eines Fußballfeldes ist ein …', 'rechter Winkel', ['spitzer Winkel', 'stumpfer Winkel', 'gestreckter Winkel'], 'Die Ecke eines Spielfeldes misst genau 90°.'),
  Q('Welche Art Winkel ist 135°?', 'stumpfer Winkel', ['spitzer Winkel', 'rechter Winkel', 'gestreckter Winkel'], '135° liegt zwischen 90° und 180°.'),
  N('Du lenkst erst 45° nach links, dann noch einmal 45°. Wie groß ist der Winkel insgesamt?', 90, '45° + 45° = 90°.', {unit:'°'}),
  N('Auf einer geraden Linie liegt ein Winkel von 120°. Wie groß ist der Winkel daneben?', 60, 'Zusammen müssen es 180° sein: 180° − 120° = 60°.', {unit:'°'}),
  N('Wie viel Grad liegen zwischen den Zeigern einer Uhr bei 4 Uhr? (Der ganze Kreis hat 360°, 12 Stunden.)', 120, 'Ein Stundenschritt sind 30° (360° ÷ 12). 4 Schritte sind 4 · 30° = 120°.', {unit:'°', hint:'Ein Stundenschritt sind 30°.'}),
  Q('Wie groß ist der Winkel der Uhrzeiger um 6 Uhr?', '180° (gestreckt)', ['90° (rechter Winkel)', '60° (spitz)', '360° (Vollwinkel)'], 'Um 6 Uhr zeigen die Zeiger in entgegengesetzte Richtungen. Das ist eine Gerade, also 180°.')
]},

{id:'mathe-6', subject:'mathe', theme:'traktor', topic:'Volumen', title:'Anhänger beladen', sub:'Rauminhalt von Quadern', min:12,
 rlp:'Größen: Volumen von Quadern, Einheiten cm³, dm³, m³ und Liter, Umrechnen',
 steps:[
  W('Volumen = Platz im Anhänger', 'Das **Volumen** eines Quaders ist **Länge · Breite · Höhe**.\n\nDer Anhänger von Opas Traktor: 4 m lang, 2 m breit, 1 m hoch.\n\nUmrechnen: 1 m³ = 1 000 dm³. Und 1 dm³ ist genau 1 Liter.',
    'Ein Würfel mit 10 cm Kantenlänge fasst genau 1 Liter Wasser.'),
  L('Quader bauen', 'Verändere die Kanten (in dm) und sieh das Volumen in Liter.',
    [{id:'l', label:'Länge', min:1, max:10, step:1, val:4, unit:' dm'}, {id:'b', label:'Breite', min:1, max:10, step:1, val:3, unit:' dm'}, {id:'h', label:'Höhe', min:1, max:10, step:1, val:5, unit:' dm'}],
    v => { const V = v.l * v.b * v.h; return `<div class="center"><b style="font-size:24px">V = ${v.l} · ${v.b} · ${v.h} = ${V} dm³</b><br>= ${V} Liter = ${de(V / 1000, 3)} m³<br><span class="m">So viel wie ${de(V / 10, 1)} Eimer à 10 Liter.</span></div>`; }),
  N('Wie groß ist das Volumen des Anhängers (4 m · 2 m · 1 m)?', 8, '4 · 2 · 1 = 8 m³.', {unit:'m³'}),
  N('Eine Kiste ist 5 dm lang, 4 dm breit und 3 dm hoch. Wie viele Liter passen hinein?', 60, '5 · 4 · 3 = 60 dm³, und 1 dm³ ist 1 Liter. Also 60 Liter.', {unit:'Liter'}),
  Q('1 m³ ist gleich …', '1 000 dm³', ['10 dm³', '100 dm³', '10 000 dm³'], 'Ein m³ ist ein Würfel mit 10 dm · 10 dm · 10 dm = 1 000 dm³.'),
  N('Ein Wasserfass ist ein Würfel mit 1 m Kantenlänge. Wie viele Liter fasst es?', 1000, '1 m³ = 1 000 dm³ = 1 000 Liter.', {unit:'Liter'}),
  N('Der Anhänger fasst 8 m³. Wie viele 10-Liter-Eimer Wasser passen hinein?', 800, '8 m³ = 8 000 Liter. 8 000 ÷ 10 = 800 Eimer.', {unit:'Eimer'}),
  N('Wie viele volle Kisten mit je 60 Liter passen höchstens in 1 000 Liter?', 16, '1 000 ÷ 60 ist etwa 16,7. Es passen also nur 16 ganze Kisten.', {unit:'Kisten', hint:'Teile 1 000 durch 60 und runde ab.'})
]},

{id:'mathe-7', subject:'mathe', theme:'sport', topic:'Daten', title:'Sport-Statistik', sub:'Mittelwert und Spannweite', min:12,
 rlp:'Daten und Zufall: Daten sammeln und auswerten, Mittelwert, Spannweite, größter und kleinster Wert',
 steps:[
  W('Mittelwert und Spannweite', 'Beim Sport sammelst du Zahlen: Zeiten, Weiten, Tore.\n\n**Mittelwert** = Summe aller Werte ÷ Anzahl der Werte.\n**Spannweite** = größter Wert − kleinster Wert.\n\nBei Zeiten ist der **kleinste** Wert der beste, bei Weiten der **größte**.',
    'Im Sprint zählt ein Start als Fehlstart, wenn der Läufer schneller als 0,1 Sekunden nach dem Schuss losläuft.'),
  L('Sprint-Tabelle', 'Fünf Läufe über 60 m. Verändere die Zeiten und beobachte Mittelwert und Spannweite.',
    [1, 2, 3, 4, 5].map((k, i) => ({id:'t' + k, label:k + '. Lauf', min:8, max:13, step:0.1, val:[9.8, 10.2, 9.6, 10.0, 10.4][i], unit:' s'})),
    v => { const t = [v.t1, v.t2, v.t3, v.t4, v.t5], s = t.reduce((a, b) => a + b, 0), mn = Math.min(...t), mx = Math.max(...t);
      return `<div class="center">Mittelwert: <b>${de(s / 5, 2)} s</b><br>Beste Zeit: <b>${de(mn, 1)} s</b><br>Spannweite: <b>${de(mx - mn, 1)} s</b></div>`; }),
  N('60-m-Sprint, fünf Läufe: 9,8 s; 10,2 s; 9,6 s; 10,0 s; 10,4 s. Wie groß ist der Mittelwert?', 10, 'Summe: 9,8 + 10,2 + 9,6 + 10,0 + 10,4 = 50,0. Dann 50,0 ÷ 5 = 10,0.', {unit:'s', hint:'Erst alle Zeiten addieren, dann durch 5 teilen.'}),
  N('Wie groß ist die Spannweite dieser Zeiten?', 0.8, 'Größter Wert 10,4 s minus kleinster Wert 9,6 s = 0,8 s.', {unit:'s'}),
  Q('Welche Zeit ist die beste?', '9,6 s', ['10,4 s', '10,0 s', '10,2 s'], 'Beim Laufen gewinnt die kleinste Zeit.'),
  N('Weitsprung: 3,80 m; 4,10 m; 3,90 m; 4,20 m. Wie groß ist der Mittelwert?', 4, 'Summe 16,00 m, geteilt durch 4 = 4,00 m.', {unit:'m'}),
  N('Du springst noch einmal. Wie weit musst du springen, damit der Mittelwert aller 5 Sprünge 4,10 m beträgt?', 4.5, 'Für 4,10 m Mittelwert brauchst du 5 · 4,10 = 20,50 m insgesamt. Bisher sind es 16,00 m, also fehlen 4,50 m.', {unit:'m', hint:'Rechne rückwärts: Mittelwert mal Anzahl.'}),
  N('Tore in 5 Spielen: 2; 0; 3; 1; 4. Wie groß ist der Mittelwert?', 2, 'Summe 10 Tore, geteilt durch 5 Spiele = 2 Tore pro Spiel.', {unit:'Tore'})
]}

);

// ---- Erweiterung: Tuning- und Hof-Rechnen
MISSIONS.push(

{id:'mathe-8', subject:'mathe', theme:'tuning', topic:'Brüche und Dezimalzahlen', title:'Hubraum-Tuning', sub:'50, 60, 70, 85 cm³: Vergleichen und Umrechnen', min:12,
 rlp:'Zahlen: Brüche und Dezimalzahlen, Anteile bestimmen; Größen: Volumeneinheiten cm³, ml, l',
 steps:[
  W('Hubraum: Was bedeutet das?', 'Der **Hubraum** ist der Raum, den der Kolben bei einem Hub im Zylinder verdrängt. Man gibt ihn in cm³ an (oft „ccm“ gesprochen). Die Simson S51 hat etwa **50 cm³**. Tuning-Zylinder gibt es oft mit **60**, **70** oder **85 cm³**.\n\nUmrechnen: 1 cm³ = 1 ml, und 1 000 cm³ = 1 Liter.',
    'Viele Tuning-Teile für Simson kommen von Händlern wie AKF oder Tuning-Firmen wie Langtuning. Beim Original-S51 hat der Kolben einen Hub von rund 44 mm.'),
  L('Tuning-Rechner', 'Stelle einen größeren Zylinder ein und vergleiche ihn mit den 50 cm³ des Originals.',
    [{id:'h', label:'Hubraum', min:50, max:90, step:5, val:70, unit:' cm³'}],
    v => { const mehr = v.h - 50, g = gcd(mehr, 50);
      return `<div class="center"><b style="font-size:26px">${v.h} cm³</b><br>${mehr} cm³ mehr als das Original ${mehr ? '= ' + (mehr / g) + '/' + (50 / g) + ' mehr' : ''}<br>Faktor: ${de(v.h / 50, 2)}<br>in Litern: ${de(v.h / 1000, 3)} l</div>`; }),
  N('Ein 60er-Zylinder hat 60 cm³ statt 50 cm³. Wie viele cm³ mehr sind das?', 10, '60 − 50 = 10 cm³.', {unit:'cm³'}),
  Q('Welcher Bruchteil des Original-Hubraums sind diese 10 cm³ mehr (Original 50 cm³)?', '1/5', ['1/10', '1/2', '2/5'], '10/50 gekürzt durch 10 ergibt 1/5.'),
  Q('Ein 70er-Zylinder hat 20 cm³ mehr als das Original (50 cm³). Welcher Bruchteil ist das?', '2/5', ['1/5', '1/4', '3/5'], '20/50 gekürzt durch 10 ergibt 2/5.'),
  N('Ein 85er hat das Wievielfache des Hubraums von 50 cm³? (Dezimalzahl)', 1.7, '85 ÷ 50 = 1,7.', {hint:'85 geteilt durch 50.'}),
  N('Wie viel Liter sind 85 cm³?', 0.085, '85 cm³ ÷ 1 000 = 0,085 l.', {unit:'Liter', hint:'1 000 cm³ sind 1 Liter.'}),
  M('Hubraum in Litern', [['50 cm³', '0,05 l'], ['60 cm³', '0,06 l'], ['70 cm³', '0,07 l'], ['85 cm³', '0,085 l']], 'Ordne jedem Hubraum den Wert in Litern zu.'),
  Q('Mehr Hubraum heißt: Mehr Gemisch passt in den Zylinder. Was muss man deshalb beim Tuning meist mitdenken?', 'Einen passenden Vergaser und Auspuff', ['Eine dickere Antenne und ein Radio', 'Ein größeres Rücklicht und neue Spiegel', 'Nichts, es passt immer ohne Änderung'], 'Der Motor braucht mehr Gemisch und muss mehr Abgas loswerden. Sonst bringt der größere Zylinder wenig.')
]},

{id:'mathe-9', subject:'mathe', theme:'tuning', topic:'Rechnen mit Größen', title:'Übersetzung und Tempo', sub:'Ritzel, Kettenrad und Geschwindigkeit', min:14,
 rlp:'Zahlen und Größen: Division, Dezimalzahlen, Länge und Geschwindigkeit umrechnen (Zusatz: Geschwindigkeit)',
 steps:[
  W('Ritzel und Kettenrad', 'Die Kette verbindet das kleine **Ritzel** am Motor mit dem größeren **Kettenrad** am Hinterrad. Die **Übersetzung** ist: Zähne am Kettenrad ÷ Zähne am Ritzel.\n\nBeispiel: Ritzel 15 Zähne, Kettenrad 30 Zähne. Übersetzung 30 ÷ 15 = 2. Das Ritzel dreht sich 2-mal, während sich das Hinterrad 1-mal dreht.\n\nTuner sprechen von **kürzerer** Übersetzung (mehr Zug beim Beschleunigen) und **längerer** Übersetzung (höhere Endgeschwindigkeit).',
    'Die Teilung der Kette und die Zahnzahl müssen zusammenpassen. Sonst springt die Kette. Ändere nur gemeinsam mit einem Erwachsenen etwas am Antrieb.'),
  L('Übersetzungs-Rechner (Modell)', 'Das Ritzel dreht mit 1 200 Umdrehungen pro Minute. Das Hinterrad hat 1,8 m Umfang. (Vereinfachtes Modell ohne Getriebe.)',
    [{id:'a', label:'Ritzel', min:12, max:18, step:1, val:15, unit:' Zähne'}, {id:'b', label:'Kettenrad', min:28, max:40, step:1, val:30, unit:' Zähne'}],
    v => { const u = v.b / v.a, rad = 1200 / u, kmh = rad * 1.8 * 60 / 1000;
      return `<div class="center">Übersetzung: <b>${de(u, 2)}</b><br>Hinterrad: ${de(rad, 0)} U/min<br><b style="font-size:26px">${de(kmh, 1)} km/h</b><br><span class="m">Größeres Ritzel oder kleineres Kettenrad: längere Übersetzung, mehr Tempo, weniger Zug.</span></div>`; }),
  N('Ritzel 15 Zähne, Kettenrad 30 Zähne. Wie groß ist die Übersetzung?', 2, '30 ÷ 15 = 2.', {}),
  N('Das Kettenrad hat 30 Zähne. Wie viele Zähne laufen bei einer Radumdrehung über das Kettenrad?', 30, 'Bei einer ganzen Umdrehung läuft jeder Zahn einmal vorbei: 30 Zähne.', {unit:'Zähne'}),
  N('Das Hinterrad hat 1,8 m Umfang. Wie weit rollt es bei 100 Umdrehungen?', 180, '100 · 1,8 m = 180 m.', {unit:'m'}),
  N('Bei 600 Radumdrehungen pro Minute: Wie viele Meter legt das Moped in einer Minute zurück?', 1080, '600 · 1,8 m = 1 080 m.', {unit:'m'}),
  N('1 080 Meter pro Minute: Wie viele km/h sind das? (60 Minuten sind eine Stunde, 1 000 m sind 1 km)', 64.8, '1 080 m · 60 = 64 800 m pro Stunde = 64,8 km pro Stunde.', {unit:'km/h', hint:'Erst mal 60 (eine Stunde), dann durch 1 000 (Kilometer).'}),
  Q('Du nimmst ein größeres Ritzel (mehr Zähne) und lässt das Kettenrad gleich. Was ändert sich meist?', 'Die Übersetzung wird länger: mehr Endtempo, aber weniger Zug.', ['Das Moped wird schwerer, und der Motor braucht dadurch mehr Benzin.', 'Der Tank wird größer, und es passt mehr Gemisch hinein.', 'Der Motor braucht kein Öl mehr, weil die Kette alles schmiert.'], 'Weniger Umdrehungen am Hinterrad pro Motorumdrehung: höheres Tempo, weniger Kraft am Rad.')
]},

{id:'mathe-10', subject:'mathe', theme:'tuning', topic:'Rechnen mit Geld', title:'Teile-Warenkorb', sub:'Rechnen wie im Online-Shop', min:12,
 rlp:'Zahlen: Dezimalzahlen addieren, subtrahieren, multiplizieren und runden, Sachaufgaben mit Geld',
 steps:[
  W('Rechnen im Teile-Shop', 'Im Online-Shop addierst du Preise, multiplizierst Mengen und prüfst, ob das Geld reicht. Rechne mit Cent als Dezimalzahl (3,90 € = 3 Euro und 90 Cent).\n\nDie Preise in dieser Mission sind **Beispielpreise** und keine echten Angebote.',
    'Runden: Auf ganze Euro runden bedeutet: Bei 50 Cent oder mehr rundest du auf.'),
  L('Dein Warenkorb (Beispielpreise)', 'Stelle die Stückzahlen ein. Zylinder-Set 119,90 €, Kolbenringe 7,50 €, Zündkerze 3,90 €, Dichtungssatz 14,50 €.',
    [{id:'z', label:'Zylinder-Set', min:0, max:2, step:1, val:1, unit:' ×'}, {id:'r', label:'Kolbenringe', min:0, max:4, step:1, val:1, unit:' ×'}, {id:'k', label:'Zündkerze', min:0, max:4, step:1, val:2, unit:' ×'}, {id:'d', label:'Dichtungssatz', min:0, max:3, step:1, val:1, unit:' ×'}],
    v => { const sum = v.z * 119.9 + v.r * 7.5 + v.k * 3.9 + v.d * 14.5;
      return `<div class="center"><b style="font-size:26px">${eur(sum)}</b><br><span class="m">${sum >= 100 ? 'Ab 100 € ist der Versand kostenlos.' : 'Unter 100 € kommen 4,90 € Versand dazu.'}</span></div>`; }),
  N('Zylinder-Set (119,90 €) + Kolbenringe (7,50 €) + Zündkerze (3,90 €). Wie viel kostet alles zusammen?', 131.3, '119,90 + 7,50 + 3,90 = 131,30 €.', {unit:'€', hint:'Rechne zuerst 119,90 + 7,50.'}),
  N('Du hast 150 €. Wie viel bleibt nach diesem Einkauf (131,30 €) übrig?', 18.7, '150,00 − 131,30 = 18,70 €.', {unit:'€'}),
  N('Zwei Zündkerzen (je 3,90 €) und ein Dichtungssatz (14,50 €). Wie viel kostet das?', 22.3, '2 · 3,90 = 7,80. Dann 7,80 + 14,50 = 22,30 €.', {unit:'€'}),
  Q('Welche Rechnung passt zu „drei Zündkerzen zu je 3,90 €“?', '3 · 3,90 €', ['3 + 3,90 €', '3,90 € ÷ 3', '3,90 € − 3'], 'Gleiche Preise mehrfach: malnehmen.'),
  N('Du sparst 15 € pro Woche auf das Zylinder-Set (119,90 €). Wie viele volle Wochen musst du sparen?', 8, '7 Wochen sind 105 €, das reicht nicht. 8 Wochen sind 120 €.', {unit:'Wochen', hint:'Teile 119,90 durch 15 und runde auf.'}),
  N('Das Zylinder-Set ist 15 € günstiger im Angebot. Wie viel kostet es dann?', 104.9, '119,90 − 15,00 = 104,90 €.', {unit:'€'}),
  N('Runde 131,30 € auf ganze Euro.', 131, 'Die Zehntel-Stelle ist 3, also wird abgerundet: 131 €.', {unit:'€'})
]},

{id:'mathe-11', subject:'mathe', theme:'traktor', topic:'Bruchrechnen', title:'Mähen mit Brüchen', sub:'Brüche addieren, abziehen, Anteile berechnen', min:12,
 rlp:'Zahlen: Brüche addieren und subtrahieren, Bruchteile von Größen, gleichnamig machen',
 steps:[
  W('Rasen in Teilen', 'Du mähst einen Rasen in 12 gleich breiten Streifen. Jeder Streifen ist 1/12 des Rasens.\n\n**Brüche addieren:** Haben beide Brüche den gleichen Nenner, addierst du nur die Zähler: 3/12 + 4/12 = 7/12.\n**Gleichnamig machen:** 1/2 + 1/4 → 1/2 = 2/4, also 2/4 + 1/4 = 3/4.\n**Bruchteil von einer Größe:** 2/3 von 90 m² → 90 ÷ 3 · 2 = 60 m².'),
  L('Rasen-Streifen', 'Stelle ein, wie viele von 12 Streifen schon gemäht sind.',
    [{id:'n', label:'gemähte Streifen', min:0, max:12, step:1, val:5, unit:''}],
    v => { let c = ''; for (let i = 0; i < 12; i++) c += `<rect x="${6 + i * 23}" y="8" width="20" height="44" rx="4" fill="${i < v.n ? '#4cc35a' : '#a0a050'}"/>`;
      const g = gcd(v.n, 12);
      return `<svg viewBox="0 0 288 60" width="100%">${c}</svg><div class="center"><b style="font-size:26px">${v.n}/12</b>${v.n > 0 && g > 1 ? ' = ' + v.n / g + '/' + 12 / g : ''} = ${de(v.n / 12, 3)}<br><span class="m">Noch zu mähen: ${12 - v.n}/12</span></div>`; }),
  T('Morgens mähst du 1/2 des Rasens, nachmittags noch 1/4. Wie viel ist gemäht? (als Bruch, zum Beispiel 3/4)', ['3/4'], '1/2 = 2/4. Dann 2/4 + 1/4 = 3/4.', {hint:'Mache 1/2 zu Viertel.'}),
  T('Wie viel vom Rasen bleibt dann noch übrig? (als Bruch)', ['1/4'], '4/4 − 3/4 = 1/4.', {}),
  T('1/3 + 1/6 = ? (als Bruch, gekürzt)', ['1/2'], '1/3 = 2/6. Dann 2/6 + 1/6 = 3/6 = 1/2.', {hint:'Mache 1/3 zu Sechstel.'}),
  N('2/3 von 90 m² sind wie viele m²?', 60, '90 ÷ 3 = 30. 2 · 30 = 60 m².', {unit:'m²'}),
  N('Der Fangkorb wird bei jeder Bahn um 1/8 voller. Wie viele Bahnen, bis er ganz voll ist?', 8, '8 · 1/8 = 8/8 = 1 (ganz voll).', {unit:'Bahnen'}),
  T('Nach 5 Bahnen: Wie voll ist der Fangkorb? (als Bruch)', ['5/8'], '5 · 1/8 = 5/8.', {}),
  Q('Welcher Bruch ist größer: 3/4 oder 5/8?', '3/4', ['5/8', 'beide sind gleich groß', 'das kann man nicht sagen'], '3/4 = 6/8. Das ist mehr als 5/8.')
]}

);

// ---- Großes Ziel: MTX-Zylinder
MISSIONS.push(

{id:'mathe-12', subject:'mathe', theme:'tuning', topic:'Brüche und Dezimalzahlen', title:'MTX: Der große Sprung', sub:'Von 50 über 80 auf 125 cm³', min:14,
 rlp:'Zahlen: Brüche kürzen und vergleichen, Dezimalzahlen, Faktoren; Größen: Volumen, Liter; Zusatz: Rechnen mit großen Zahlen',
 steps:[
  W('Das große Ziel: MTX', 'Die Honda MTX gab es als 50er, 80er und 125er. In der Simson-Szene baut man MTX-Motoren auch in Simson-Rahmen ein. Für den 80er-Motor gibt es Zylinder-Sätze mit deutlich mehr Hubraum, bis etwa 120 bis 125 cm³. Das ist dein großes Ziel.\n\nDie Zahlen im Vergleich: Die Simson S51 hat etwa 50 cm³, der MTX-80-Motor 80 cm³, ein großer Tuning-Zylinder bis etwa 125 cm³.',
    'Angaben zu Zylindern und Motoren können sich ändern. Vor jedem Kauf im Fachhandel prüfen, was wirklich passt.'),
  L('Hubraum-Rechner', 'Stelle den Hubraum ein und vergleiche mit der Simson (50 cm³).',
    [{id:'h', label:'Hubraum', min:50, max:125, step:5, val:125, unit:' cm³'}],
    v => { const mehr = v.h - 50, g = gcd(mehr, 50);
      return `<div class="center"><b style="font-size:26px">${v.h} cm³</b><br>Faktor zur Simson: ${de(v.h / 50, 2)}<br>${mehr ? mehr + ' cm³ mehr, das ist ' + (mehr / g) + '/' + (50 / g) + ' mehr' : 'gleich'}<br>in Litern: ${de(v.h / 1000, 3)} l</div>`; }),
  N('Wie viele cm³ mehr hat ein 125er-Zylinder gegenüber der Simson mit 50 cm³?', 75, '125 − 50 = 75 cm³.', {unit:'cm³'}),
  N('Das Wievielfache von 50 cm³ sind 125 cm³? (Dezimalzahl)', 2.5, '125 ÷ 50 = 2,5. Der Hubraum ist 2,5-mal so groß.', {}),
  N('Der MTX-80-Motor hat 80 cm³, der große Zylinder 125 cm³. Wie viele cm³ ist der Unterschied?', 45, '125 − 80 = 45 cm³.', {unit:'cm³'}),
  Q('Welcher gekürzte Bruch beschreibt 45/80?', '9/16', ['5/8', '3/5', '9/8'], '45 und 80 lassen sich beide durch 5 teilen: 45 ÷ 5 = 9 und 80 ÷ 5 = 16.'),
  N('Wie viel Liter sind 125 cm³?', 0.125, '125 cm³ ÷ 1 000 = 0,125 l.', {unit:'Liter'}),
  N('Zum Nachdenken: Ein 125-cm³-Zweitakter fördert bei jeder Umdrehung (theoretisch) 125 cm³. Wie viele Liter bei 6 000 Umdrehungen pro Minute?', 750, '125 · 6 000 = 750 000 cm³. 750 000 cm³ = 750 Liter. In Wirklichkeit ist es weniger, aber so siehst du, wie viel Luft der Motor braucht.', {unit:'Liter', hint:'Erst malnehmen, dann durch 1 000 teilen.'})
]},

{id:'mathe-13', subject:'mathe', theme:'tuning', topic:'Rechnen mit Geld', title:'Sparplan für den Zylinder', sub:'Rechnen, planen, durchhalten', min:14,
 rlp:'Zahlen: Rechnen mit Dezimalzahlen und Geld, Division, Runden, Brüche als Anteil; Sachaufgaben',
 steps:[
  W('Ein Ziel braucht einen Plan', 'Ein großer Zylinder, der Umbau und die Teile kosten Geld. Mit einem Sparplan siehst du, wann du es schaffst. Die Preise hier sind **Beispiele**: Nimm 288 € als Zielbetrag. Eigene Verdienste wie Rasenmähen helfen dabei.\n\nImmer gilt: Kaufverträge gehen nur mit Zustimmung der Eltern, solange man minderjährig ist.'),
  L('Sparplan-Rechner', 'Ziel: 288 €. Stelle Taschengeld und Extra-Verdienst ein (ein Monat = 4 Wochen).',
    [{id:'w', label:'Sparen pro Woche', min:2, max:20, step:1, val:8, unit:' €'}, {id:'e', label:'Extra pro Monat (z. B. Rasen mähen)', min:0, max:60, step:5, val:20, unit:' €'}],
    v => { const wk = v.w + v.e / 4, weeks = Math.ceil(288 / wk);
      return `<div class="center"><b style="font-size:26px">${weeks} Wochen</b><br>das sind etwa ${de(weeks / 4, 1)} Monate<br><span class="m">${eur(wk)} pro Woche insgesamt</span></div>`; }),
  N('Du sparst jeden Monat 12 €. Wie viele Monate brauchst du für 288 €?', 24, '288 ÷ 12 = 24 Monate.', {unit:'Monate'}),
  N('Du hast schon 96 € gespart. Wie viel fehlt noch bis 288 €?', 192, '288 − 96 = 192 €.', {unit:'€'}),
  T('Welcher Bruchteil von 288 € sind 96 €? (gekürzt, als Bruch)', ['1/3'], '96/288 gekürzt durch 96 ergibt 1/3.', {hint:'96 mal 3 sind wie viel?'}),
  N('Du sparst 8 € pro Woche. Wie viele Wochen brauchst du für die fehlenden 192 €?', 24, '192 ÷ 8 = 24 Wochen.', {unit:'Wochen'}),
  N('Du bekommst 15 € fürs Rasenmähen. Wie viele Rasen musst du mähen, damit 192 € zusammenkommen? (aufrunden)', 13, '192 ÷ 15 = 12,8. Du brauchst also 13 Rasen.', {unit:'Rasen', hint:'Teile 192 durch 15 und runde auf.'}),
  Q('Wer muss einem Kauf eines teuren Teils zustimmen, solange du noch nicht volljährig bist?', 'Deine Eltern', ['Dein Nachbar', 'Dein Lehrer', 'Niemand'], 'Minderjährige brauchen für größere Käufe die Zustimmung der Eltern.')
]}

);
