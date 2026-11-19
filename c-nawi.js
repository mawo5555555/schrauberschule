// Naturwissenschaften Klasse 5/6 (Rahmenlehrplan Berlin-Brandenburg, Teil C Naturwissenschaften): Kräfte und Maschinen, Strom, Luft, Stoffe, Tiere, Pflanzen, Mensch
MISSIONS.push(

{id:'nawi-1', subject:'nawi', theme:'traktor', topic:'Kräfte und Maschinen', title:'Hebel und Hydraulik', sub:'Wie Maschinen Kraft sparen', min:14,
 rlp:'Kräfte, Bewegungen, Maschinen: Hebel, schiefe Ebene, Kraft und Weg; Hydraulik als Zusatz',
 steps:[
  W('Kraft sparen mit Maschinen', 'Einfache Maschinen wie **Hebel**, **Rolle** und **schiefe Ebene** sparen Kraft. Dafür musst du einen **längeren Weg** zurücklegen. Man spart nie beides: Was du an Kraft sparst, zahlst du am Weg drauf.\n\nBeim Hebel gilt: Je **länger** der Kraftarm, desto **kleiner** die nötige Kraft.\n\nProfi-Regel: Kraft · Kraftarm = Last · Lastarm.',
    'Der Grieche Archimedes soll gesagt haben: „Gebt mir einen festen Punkt, und ich bewege die Erde.“'),
  P('Der Traktor', 'Tippe auf die Zahlen: Wo steckt Hydraulik, wo die Hebel (Unterlenker)?', 'traktor'),
  P('Finde die Teile', 'Tippe der Reihe nach die gefragten Teile an.', 'traktor', true),
  L('Hebel-Labor', 'Eine Last von 100 N hängt 0,2 m vom Drehpunkt entfernt. Verlängere den Kraftarm.',
    [{id:'a', label:'Kraftarm', min:0.2, max:2, step:0.1, val:0.4, unit:' m'}],
    v => { const F = 100 * 0.2 / v.a;
      return `<div class="center"><b style="font-size:26px">Kraft: ${de(F, 0)} N</b></div><div class="bar" style="margin:10px 0"><i style="width:${Math.min(100, F)}%"></i></div>
      <div class="m center">Rechnung: 100 N · 0,2 m ÷ ${de(v.a, 1)} m = ${de(F, 1)} N</div>`; }),
  Q('Welches Werkzeug ist ein Hebel?', 'Eine Brechstange', ['Ein Zollstock', 'Ein Thermometer', 'Eine Wasserwaage'], 'Mit einer Brechstange hebelst du Dinge mit wenig Kraft. Der Drehpunkt ist die Stelle, wo sie aufliegt.'),
  Q('Du willst die Radmutter am Traktor lösen. Was klappt leichter?', 'Mit einem längeren Schlüssel', ['Mit einem kürzeren Schlüssel', 'Möglichst schnell ziehen', 'Den Schlüssel wärmen'], 'Längerer Schlüssel = längerer Kraftarm = weniger Kraft nötig.'),
  Q('Je flacher eine Rampe zum Verladen, desto …', 'kleiner die nötige Kraft, aber länger der Weg', ['größer die nötige Kraft und kürzer der Weg', 'kürzer der Weg und trotzdem weniger Kraft', 'kleiner die Last und kürzer der Weg'], 'Die schiefe Ebene spart Kraft, kostet aber Weg.'),
  N('Profi-Aufgabe (Klasse 7): Hebel: Last 100 N, Lastarm 0,2 m, Kraftarm 1 m. Wie groß ist die Kraft?', 20, '100 N · 0,2 m = 20 Nm. 20 Nm ÷ 1 m = 20 N.', {unit:'N', hint:'Kraft · Kraftarm = Last · Lastarm.'}),
  N('Profi-Aufgabe (Klasse 8): Hydraulik am Traktor: In Flüssigkeiten wirkt Druck überall gleich. Kleiner Kolben 2 cm², großer Kolben 40 cm². Wie oft größer ist die Kraft am großen Kolben?', 20, '40 cm² ÷ 2 cm² = 20. Die Kraft ist 20-mal so groß.', {unit:'mal', hint:'Wie oft passt die kleine Fläche in die große?'}),
  X('Erkläre in eigenen Worten: Warum hilft ein langer Schraubenschlüssel beim Lösen einer festen Schraube?', 'Tipp: Denke an Kraftarm und Kraft. Erkläre in drei Sätzen.', 60)
]},

{id:'nawi-2', subject:'nawi', theme:'simson', topic:'Elektrischer Strom', title:'Stromkreis in der Simson', sub:'Wie Licht und Hupe funktionieren', min:14,
 rlp:'Elektrischer Strom: Stromkreis, Leiter und Nichtleiter, Reihen- und Parallelschaltung, Sicherheit',
 steps:[
  W('Der Stromkreis', 'Damit Strom fließt, muss der Stromkreis **geschlossen** sein: Stromquelle (Batterie), Leitungen, Verbraucher (Lampe) und ein Schalter.\n\n• **Leiter** (Metalle wie Kupfer, Eisen, Aluminium) leiten Strom.\n• **Nichtleiter** (Gummi, Kunststoff, Glas, trockenes Holz) leiten nicht. Darum sind Kabel mit Kunststoff ummantelt.\n\nGefährlich: Steckdosen, Freileitungen und Gewitter. Nie in eine Steckdose fassen!'),
  {type:'circuit'},
  Q('Die Lampe leuchtet nicht, obwohl eine Batterie angeschlossen ist. Was ist möglich?', 'Der Stromkreis ist offen, zum Beispiel durch einen Kabelbruch.', ['Strom fließt nur nachts, tagsüber nie, auch nicht mit Batterie.', 'Die Batterie ist zu groß, deshalb geht die Lampe nicht an.', 'Das Kabel ist zu bunt, und dann leitet es nicht mehr.'], 'Ist der Kreis irgendwo unterbrochen, fließt kein Strom.'),
  Q('Welches Material leitet Strom?', 'Kupfer', ['Gummi', 'Glas', 'Kunststoff'], 'Metalle wie Kupfer sind gute Leiter.'),
  Q('Warum haben Kabel eine Hülle aus Kunststoff?', 'Kunststoff leitet nicht und schützt vor Stromschlag und Kurzschluss.', ['Damit sie schöner aussehen und man die Farben besser unterscheiden kann.', 'Damit mehr Strom fließt und die Lampe heller leuchtet.', 'Damit sie leichter sind und weniger Platz brauchen.'], 'Kunststoff ist ein Nichtleiter.'),
  Q('Zwei Lampen sind hintereinander (Reihenschaltung). Du drehst eine heraus. Was passiert mit der anderen?', 'Sie geht auch aus.', ['Sie bleibt an.', 'Sie leuchtet heller.', 'Sie explodiert.'], 'In der Reihenschaltung gibt es nur einen Weg. Wird er unterbrochen, ist alles aus.'),
  Q('Zwei Lampen sind nebeneinander (Parallelschaltung). Du drehst eine heraus. Was passiert mit der anderen?', 'Sie bleibt an.', ['Sie geht auch aus.', 'Sie wird dunkler.', 'Sie blinkt.'], 'Jede Lampe hat ihren eigenen Weg. Darum sind Hausleitungen parallel geschaltet.'),
  Q('Was ist lebensgefährlich?', 'Mit einer Gabel in die Steckdose stochern', ['Eine Taschenlampe mit Batterie anschalten', 'Eine kleine Batterie in die Hand nehmen', 'Den Lichtschalter im Zimmer benutzen'], 'Steckdosen haben 230 Volt. Das kann tödlich sein.'),
  M('Bauteile', [['Batterie', 'liefert die Energie'], ['Schalter', 'öffnet und schließt den Kreis'], ['Lampe', 'macht Strom zu Licht'], ['Kabel', 'verbindet die Teile']], 'Welche Aufgabe hat welches Bauteil?')
]},

{id:'nawi-3', subject:'nawi', theme:'simson', topic:'Luft', title:'Warum läuft der Motor?', sub:'Luft, Feuer und Viertakt', min:14,
 rlp:'Luft: Zusammensetzung, Sauerstoff, Verbrennung (Brennstoff, Sauerstoff, Zündtemperatur); Technik: Motor',
 steps:[
  W('Luft und Feuer', 'Luft besteht aus etwa **78 % Stickstoff**, **21 % Sauerstoff** und einem kleinen Rest (unter anderem Kohlenstoffdioxid).\n\nEin Feuer oder ein Motor braucht drei Dinge: **Brennstoff** (Benzin), **Sauerstoff** (aus der Luft) und die **Zündtemperatur** (Zündfunke). Fehlt eines, geht das Feuer aus.\n\nIm Motor verbrennt das Benzin-Luft-Gemisch. Der Luftfilter hält Staub und Schmutz aus der Luft fern.',
    'Beim Viertaktmotor (Traktor, Auto) laufen vier Takte ab. Die Simson hat einen Zweitaktmotor und braucht dafür Gemisch (Benzin mit Öl) im Tank.'),
  Q('Wie viel Prozent der Luft sind Sauerstoff?', 'etwa 21 %', ['etwa 78 %', 'etwa 50 %', 'etwa 1 %'], 'Stickstoff hat 78 %, Sauerstoff 21 %.'),
  Q('Welcher Stoff macht den größten Teil der Luft aus?', 'Stickstoff', ['Sauerstoff', 'Wasserdampf', 'Kohlenstoffdioxid'], 'Fast vier Fünftel der Luft sind Stickstoff.'),
  Q('Was braucht eine Verbrennung?', 'Brennstoff, Sauerstoff und Zündtemperatur', ['Nur Brennstoff, mehr braucht es nicht', 'Wasser, Wind und etwas Kälte', 'Brennstoff, Stickstoff und Kälte'], 'Alle drei zusammen. Fehlt eins, erlischt das Feuer.'),
  Q('Eine Kerze brennt unter einem umgestülpten Glas und erlischt nach einer Weile. Warum?', 'Es ist nicht mehr genug Sauerstoff da.', ['Das Glas ist zu schwer für die Kerze.', 'Die Kerze hat Durst und braucht Wasser.', 'Stickstoff löscht das Feuer von allein.'], 'Die Flamme verbraucht den Sauerstoff im Glas. Probiere es mit einem Erwachsenen aus.'),
  Q('Wozu ist der Luftfilter an Traktor und Moped da?', 'Er hält Staub und Schmutz aus der Ansaugluft fern.', ['Er macht den Motor leiser und den Auspuff kleiner.', 'Er kühlt das Benzin im Tank, damit es nicht kocht.', 'Er filtert das Öl im Motor und reinigt es.'], 'Sonst würde Staub in den Motor gelangen und ihn beschädigen.'),
  Q('Warum muss in eine Simson Gemisch (Benzin und Öl) getankt werden?', 'Das Öl im Gemisch schmiert den Motor von innen.', ['Das Öl färbt das Benzin und macht es sauberer.', 'Damit der Tank voller aussieht und länger reicht.', 'Damit der Motor nach der Fahrt schneller kalt wird.'], 'Der Zweitaktmotor hat keine eigene Ölwanne. Darum kommt das Öl mit dem Benzin hinein.'),
  O('Die vier Takte des Viertaktmotors', ['Ansaugen', 'Verdichten', 'Arbeiten (Zünden)', 'Ausstoßen'], 'Tippe die Takte in der richtigen Reihenfolge an.'),
  X('Erkläre in eigenen Worten: Was braucht ein Motor, damit er läuft?', 'Tipp: Es sind drei Dinge. Nenne sie nacheinander.', 60)
]},

{id:'nawi-4', subject:'nawi', theme:'hof', topic:'Wasser und Stoffgemische', title:'Trennen und Sieben', sub:'Wie man Gemische trennt', min:14,
 rlp:'Wasser und Stoffgemische: Trennverfahren (Sieben, Filtrieren, Sedimentieren, Verdunsten, Magnet), Aggregatzustände',
 steps:[
  W('Gemische trennen', 'Ein **Gemisch** besteht aus mehreren Stoffen. Man trennt es mit Hilfe einer Eigenschaft:\n\n• **Sieben**: nach der Teilchengröße\n• **Filtrieren**: Flüssigkeit läuft durch, feste Teilchen bleiben im Filter\n• **Sedimentieren**: schwere Teilchen sinken ab\n• **Verdunsten**: Wasser geht in die Luft, Salz bleibt zurück\n• **Magnet**: zieht Eisen heraus\n\nWasser hat drei Zustände: Eis (fest), Wasser (flüssig), Wasserdampf (gasförmig).',
    'Auf dem Mähdrescher trennen Siebe und ein Gebläse die Körner von Spreu und Stroh.'),
  M('Welches Verfahren passt?', [['Sand und Kies', 'Sieben'], ['Schlammwasser', 'Filtrieren'], ['Salzwasser', 'Verdunsten'], ['Eisenspäne und Sand', 'Magnet']], 'Ordne jedem Gemisch das passende Trennverfahren zu.'),
  Q('Im Mähdrescher trennen Siebe und Gebläse Körner und Spreu. Welche Eigenschaften werden genutzt?', 'Größe und Gewicht der Teilchen', ['Farbe und Geschmack der Teilchen', 'Temperatur und Druck der Teilchen', 'Nur die Farbe der Körner und Halme'], 'Siebe sortieren nach Größe, das Gebläse bläst die leichte Spreu weg.'),
  Q('Was macht ein Ölfilter oder ein Kaffeefilter?', 'Flüssigkeit läuft durch, feste Teilchen bleiben hängen.', ['Er färbt die Flüssigkeit dunkler und macht sie dicker.', 'Er erhitzt die Flüssigkeit, damit sie besser fließt.', 'Er löst alle festen Teilchen in der Flüssigkeit auf.'], 'Das nennt man Filtrieren.'),
  Q('Bodenprobe: Du schüttelst Erde mit Wasser in einem Glas und lässt es stehen. Was liegt zuerst ganz unten?', 'Sand', ['Humus', 'Ton', 'Luft'], 'Die schwersten, gröbsten Teilchen sinken zuerst ab: der Sand.'),
  Q('Wie nennt man das Absetzen der schweren Teilchen?', 'Sedimentieren', ['Filtrieren', 'Verdunsten', 'Sieben'], 'Aus „Sediment“ = Bodensatz.'),
  Q('Was bleibt zurück, wenn Salzwasser verdunstet?', 'Salz', ['Sand', 'Zucker', 'Nichts'], 'Wasser geht in die Luft, Salz verdunstet nicht.'),
  N('Bei wie viel °C siedet Wasser (normaler Luftdruck)?', 100, 'Wasser siedet bei 100 °C und gefriert bei 0 °C.', {unit:'°C'}),
  Q('Warum platzen Wasserleitungen bei Frost, und warum braucht der Traktorkühler Frostschutz?', 'Wasser dehnt sich beim Gefrieren aus.', ['Wasser wird beim Gefrieren kleiner.', 'Wasser wird zu Salz.', 'Wasser wird schwerer.'], 'Eis braucht mehr Platz als Wasser und sprengt Rohre.')
]},

{id:'nawi-5', subject:'nawi', theme:'hof', topic:'Tiere', title:'Vom Wildtier zum Nutztier', sub:'Hoftiere genauer unter die Lupe', min:14,
 rlp:'Tiere in meiner Umgebung: Haus- und Nutztiere, Wirbeltierklassen, Angepasstheit',
 steps:[
  W('Wirbeltiere und Nutztiere', 'Alle **Wirbeltiere** haben eine Wirbelsäule. Es gibt fünf Klassen: Fische, Amphibien, Reptilien, Vögel, Säugetiere.\n\nNutztiere stammen von Wildtieren ab (**Domestikation**): Hund vom Wolf, Hausschwein vom Wildschwein, Hausrind vom Auerochsen.\n\nKühe sind **Wiederkäuer**: Sie würgen das Futter wieder hoch und kauen es noch einmal.',
    'Ein Huhn legt bis zu 300 Eier im Jahr. Das Ausbrüten dauert 21 Tage.'),
  M('Zu welcher Klasse gehört das Tier?', [['Forelle', 'Fisch'], ['Frosch', 'Amphibie'], ['Eidechse', 'Reptil'], ['Huhn', 'Vogel'], ['Kuh', 'Säugetier']], 'Ordne jedes Tier seiner Wirbeltierklasse zu.'),
  Q('Von welchem Wildtier stammt der Hund ab?', 'Wolf', ['Fuchs', 'Bär', 'Wildschwein'], 'Der Wolf ist die Stammform des Hundes.'),
  Q('Von welchem Tier stammt das Hausrind ab?', 'Auerochse', ['Elch', 'Hirsch', 'Wildschwein'], 'Der Auerochse (Ur) ist die Stammform und ausgestorben.'),
  Q('Warum nennt man Kühe Wiederkäuer?', 'Sie würgen das Gras wieder hoch und kauen es nochmal.', ['Sie kauen den ganzen Tag lang auf demselben Futter herum.', 'Sie fressen nur kaltes Futter und wärmen es im Magen auf.', 'Sie haben besonders viele Zähne und kauen deshalb lange.'], 'So können sie schwer verdauliches Gras gut verwerten.'),
  N('Wie viele Tage braucht ein Hühnerei zum Ausbrüten?', 21, 'Etwa drei Wochen: 21 Tage.', {unit:'Tage'}),
  Q('Welches dieser Tiere legt keine Eier?', 'Kuh', ['Huhn', 'Frosch', 'Forelle'], 'Die Kuh ist ein Säugetier und bringt lebende Junge zur Welt.'),
  Q('Womit atmen Fische?', 'Kiemen', ['Lungen', 'Haut', 'Flossen'], 'Kiemen nehmen Sauerstoff aus dem Wasser auf.'),
  N('Eine Kuh gibt am Tag etwa 25 Liter Milch. Wie viele Liter sind das in einer Woche?', 175, '7 · 25 = 175 Liter.', {unit:'Liter'})
]},

{id:'nawi-6', subject:'nawi', theme:'hof', topic:'Pflanzen', title:'Vom Korn zum Brot', sub:'Wie Pflanzen wachsen und genutzt werden', min:14,
 rlp:'Aus dem Leben der Pflanzen: Aufbau, Keimung, Fotosynthese (einfach), Nutzpflanzen und Verarbeitung',
 steps:[
  W('Pflanzen wachsen', 'Eine Blütenpflanze hat **Wurzel**, **Stängel**, **Blätter** und **Blüten**. Zum **Keimen** braucht ein Samen Wasser, Wärme und Luft (Sauerstoff).\n\nIn den grünen Blättern stellt die Pflanze mit Licht aus Wasser und Kohlenstoffdioxid Zucker her (**Fotosynthese**). Dabei entsteht Sauerstoff.',
    'In Brandenburg wächst auf vielen Feldern Roggen, weil er auch auf sandigem Boden gedeiht.'),
  O('Vom Korn zum Brot', ['Das Korn wird gesät', 'Das Getreide wächst und reift', 'Der Mähdrescher erntet', 'Die Mühle mahlt Mehl', 'Der Bäcker backt Brot'], 'Tippe die Schritte in der richtigen Reihenfolge an.'),
  Q('Was braucht ein Samen zum Keimen?', 'Wasser, Wärme und Luft', ['Nur Dünger und etwas Erde', 'Nur Licht und ganz viel Kälte', 'Salz, Sonne und viel Dünger'], 'Mit Wasser quillt der Samen, Wärme und Sauerstoff starten das Wachstum.'),
  Q('Welcher Pflanzenteil nimmt Wasser aus dem Boden auf?', 'Wurzel', ['Blatt', 'Blüte', 'Stängel'], 'Die Wurzel verankert die Pflanze und nimmt Wasser und Nährstoffe auf.'),
  Q('Wo stellt die Pflanze mit Licht Zucker her?', 'In den grünen Blättern', ['In der Wurzel unter der Erde', 'In der Blüte der Pflanze', 'Im Samen in der Frucht'], 'Die grünen Blätter enthalten Blattgrün, das Licht einfängt.'),
  Q('Welches Getreide wächst in Brandenburg besonders gut auf sandigem Boden?', 'Roggen', ['Reis', 'Zuckerrohr', 'Bananen'], 'Roggen ist genügsam und wächst auch auf sandigen Böden.'),
  M('Pflanzenteile und ihre Aufgabe', [['Wurzel', 'hält fest, nimmt Wasser auf'], ['Stängel', 'trägt, leitet Wasser'], ['Blatt', 'stellt Zucker her'], ['Blüte', 'bildet Samen und Früchte']], 'Welche Aufgabe hat welcher Teil?'),
  N('Aus Weizen entstehen rund drei Viertel des Gewichts als Mehl. Wie viel Mehl entsteht aus 40 kg Weizen?', 30, '40 kg ÷ 4 = 10 kg. 3 · 10 kg = 30 kg.', {unit:'kg', hint:'Drei Viertel von 40: erst durch 4 teilen.'})
]},

{id:'nawi-7', subject:'nawi', theme:'sport', topic:'Der Mensch', title:'Sport-Labor', sub:'Muskeln, Puls und Reaktion', min:15,
 rlp:'Der Mensch: Bewegungsapparat (Muskeln, Gelenke), Ernährung, Sinne und Reaktion',
 steps:[
  W('Bewegung und Energie', 'Dein Körper bewegt sich durch **Muskeln**, **Sehnen**, **Knochen** und **Gelenke**. Muskeln können sich nur **zusammenziehen**, also ziehen, nie drücken. Darum arbeiten sie als **Gegenspieler** (Beuger und Strecker).\n\nNährstoffe: **Kohlenhydrate** liefern schnell Energie, **Eiweiß** baut und repariert Muskeln, **Fette** speichern Energie.\n\nBei Anstrengung schlägt das Herz schneller, weil die Muskeln mehr Sauerstoff brauchen.',
    'Ein Erwachsener hat etwa 206 Knochen.'),
  {type:'reaction'},
  L('Puls-Rechner', 'Zähle deinen Puls 15 Sekunden lang am Handgelenk und stelle die Zahl ein.',
    [{id:'n', label:'Schläge in 15 s', min:10, max:50, step:1, val:20, unit:''}],
    v => { const p = v.n * 4; return `<div class="center"><b style="font-size:28px">${p} Schläge pro Minute</b><br><span class="m">${p < 60 ? 'Sehr ruhig (trainiert oder entspannt).' : p <= 100 ? 'In Ruhe ist das bei Kindern normal.' : 'Hoch: typisch nach Sport.'}</span></div>`; }),
  Q('Muskeln können nur …', 'ziehen', ['drücken', 'schieben', 'drehen'], 'Muskeln ziehen sich zusammen. Darum brauchst du für jede Richtung einen Gegenspieler.'),
  Q('Wie heißt das Muskelpaar Beuger und Strecker?', 'Gegenspieler', ['Zwillinge', 'Nachbarn', 'Partner'], 'Während der eine sich zusammenzieht, wird der andere gedehnt.'),
  M('Körper-Teile', [['Schulter', 'Kugelgelenk'], ['Knie', 'Scharniergelenk'], ['Sehne', 'verbindet Muskel und Knochen'], ['Gelenk', 'beweglicher Übergang zwischen Knochen']], 'Was gehört zusammen?'),
  Q('Welcher Nährstoff liefert schnell Energie für einen Sprint?', 'Kohlenhydrate', ['Vitamine', 'Ballaststoffe', 'Mineralstoffe'], 'Zum Beispiel Nudeln, Brot und Obst.'),
  Q('Warum steigt dein Puls beim Sport?', 'Muskeln brauchen mehr Sauerstoff, das Herz pumpt schneller.', ['Das Herz hat vom Sport Hunger und will mehr Zucker essen.', 'Der Körper wird beim Sport kälter, und das Herz heizt ihn auf.', 'Die Lunge wird kleiner, deshalb schlägt das Herz schneller.'], 'Das Blut bringt den Sauerstoff zu den Muskeln.'),
  N('Du zählst in 15 Sekunden 20 Herzschläge. Wie hoch ist dein Puls pro Minute?', 80, '20 · 4 = 80 Schläge pro Minute.', {unit:'Schläge/min', hint:'Eine Minute hat vier mal 15 Sekunden.'})
]}

);

// ---- Erweiterung: Zweitakt im Schnitt, Wärme, Magnetismus, Licht, Wetter, Boden, Simson- und Rasentraktor-Anatomie
MISSIONS.push(

{id:'nawi-8', subject:'nawi', theme:'tuning', topic:'Kräfte und Maschinen', title:'Zweitakt im Schnitt', sub:'Den Motor Schritt für Schritt drehen', min:16,
 rlp:'Maschinen und Energie: Aufbau und Funktion eines Motors; Luft und Verbrennung; Zusatz: Steuerzeiten',
 steps:[
  W('Der Zylinder im Schnitt', 'Im Zylinder bewegt sich der Kolben auf und ab. Die **Kurbelwelle** macht daraus eine Drehung. In der Wand sitzen Öffnungen: **Auslass** (Abgase hinaus), **Überströmer** (frisches Gemisch hinein) und **Einlass** (Gemisch vom Vergaser).\n\nDer Kolben ist gleichzeitig der Schieber: Er öffnet und schließt die Kanäle, je nachdem, wo er steht. Diese Zeitpunkte heißen **Steuerzeiten**. Beim Tuning ändert man sie, indem man Kanäle höher oder breiter macht. Das ist Präzisionsarbeit für Fachleute.',
    'Diese Zeichnung ist vereinfacht (Hub 44 mm, wie bei der S51). Echte Motoren haben mehr Kanäle und Dichtungen.', 'zyl'),
  P('Teile erkunden', 'Tippe auf die Zahlen, um die Teile kennenzulernen.', 'zyl'),
  L('Dreh die Kurbelwelle', '0° ist der Kolben ganz oben (oberer Totpunkt), 180° ganz unten. Verändere den Winkel und beobachte, welche Kanäle offen sind.',
    [{id:'w', label:'Kurbelwelle', min:0, max:360, step:5, val:120, unit:'°'}],
    v => { const z = zyl(v.w); return `<div style="max-width:330px;margin:0 auto">${z.svg}</div><div class="center m" style="color:var(--t);margin-top:8px"><b>${z.phase}</b><br><span class="m">Auslass: ${z.ex ? 'offen' : 'zu'} · Überströmer: ${z.tr ? 'offen' : 'zu'} · Einlass: ${z.inn ? 'offen' : 'zu'}</span></div>`; }),
  Q('Wo wird das frische Gemisch vorverdichtet?', 'Im Kurbelgehäuse unter dem Kolben', ['Im Auspuff hinten am Ende der Anlage', 'Im Tank oben auf dem Rahmen des Mopeds', 'Im Luftfilter vor dem Vergaser'], 'Beim Abwärtshub drückt der Kolben das Gemisch im Kurbelgehäuse zusammen, bis die Überströmer öffnen.'),
  Q('Was öffnet zuerst, wenn der Kolben nach unten fährt?', 'Der Auslass', ['Die Überströmer', 'Der Vergaser', 'Die Kerze'], 'Erst strömt das Abgas hinaus, dann kann das Frischgas nachströmen.'),
  Q('Wozu dienen die Überströmkanäle?', 'Sie führen Gemisch aus dem Kurbelgehäuse in den Zylinder.', ['Sie kühlen den Auspuff und das Kurbelgehäuse von außen.', 'Sie schmieren die Kette und die Kolbenringe mit Öl.', 'Sie halten die Kerze fest und dichten den Kopf ab.'], 'Das Frischgas schiebt die restlichen Abgase hinaus (Spülen).'),
  N('Wie viele Kolbenhübe braucht ein Zweitaktmotor für einen Arbeitsablauf?', 2, 'Einmal hinauf und einmal hinunter: 2 Hübe.', {unit:'Hübe'}),
  O('Der Ablauf bei einer Umdrehung', ['Die Kerze zündet, das Gas drückt den Kolben nach unten', 'Der Auslass öffnet, die Abgase strömen hinaus', 'Die Überströmer öffnen, frisches Gemisch spült nach', 'Der Kolben steigt, verdichtet oben und saugt unten neues Gemisch an'], 'Tippe die Schritte in der richtigen Reihenfolge an.'),
  P('Finde die Teile', 'Tippe der Reihe nach die gefragten Teile an.', 'zyl', true)
]},

{id:'nawi-9', subject:'nawi', theme:'tuning', topic:'Wärme', title:'Heiß, heißer, Kolbenklemmer', sub:'Wärme, Ausdehnung und Kühlung', min:14,
 rlp:'Temperatur und Teilchen: Wärme, Temperatur, Ausdehnung, Wärmeübertragung, Kühlung',
 steps:[
  W('Wärme und Ausdehnung', 'Bei der Verbrennung wird der Zylinder sehr heiß, deutlich über 100 °C. **Temperatur** misst man in °C. **Wärme** fließt immer vom Wärmeren zum Kälteren.\n\nWärmer werdende Stoffe **dehnen sich aus**, weil sich die Teilchen schneller bewegen. Deshalb hat ein Kolben im Zylinder etwas **Spiel**. Ist der Kolben zu eng, zu heiß oder schlecht geschmiert, kann er festklemmen: ein **Kolbenklemmer**.\n\nEin Zylinder mit **Kühlrippen** hat eine große Oberfläche. So kann die Luft viel Wärme abtransportieren (Luftkühlung).',
    'Ein heißer Motor braucht Zeit zum Abkühlen. Darum nach der Fahrt nicht gleich anfassen, und beim Einfahren eines neuen Kolbens besonders vorsichtig fahren.'),
  Q('Warum haben luftgekühlte Zylinder Kühlrippen?', 'Mehr Oberfläche gibt mehr Wärme an die Luft ab.', ['Damit sie leichter rosten und dadurch kühler bleiben.', 'Damit sie leiser laufen, weil Rippen den Schall schlucken.', 'Damit sie schöner aussehen und mehr Wärme speichern.'], 'Eine größere Oberfläche überträgt mehr Wärme an die Umgebung.'),
  Q('Was passiert mit einem Kolben, wenn er heiß wird?', 'Er dehnt sich aus.', ['Er schrumpft.', 'Er wird weicher wie Butter.', 'Er bleibt genau gleich groß.'], 'Die meisten Stoffe dehnen sich bei Wärme aus.'),
  Q('Warum braucht ein Kolben Spiel im Zylinder?', 'Er dehnt sich beim Erwärmen aus und würde sonst klemmen.', ['Damit er lauter klopft und der Motor mehr Leistung hat.', 'Damit Wasser hineinlaufen kann und den Kolben kühlt.', 'Damit er leichter wird und weniger Benzin braucht.'], 'Ohne Spiel würde der heiße Kolben im Zylinder festsitzen.'),
  Q('Was ist ein Kolbenklemmer?', 'Der Kolben bleibt durch Überhitzung oder Ölmangel im Zylinder stecken.', ['Ein Spezialwerkzeug, mit dem man den Zylinder beim Einbau festklemmt.', 'Ein Teil des Vergasers, der den Benzinzufluss festklemmt und stoppt.', 'Ein Verkehrszeichen, das vor engen Stellen auf der Straße warnt.'], 'Hitze, zu wenig Öl im Gemisch oder zu enges Spiel können die Ursache sein.'),
  Q('Warum ist das Gemisch bei der Simson wichtig für die Kühlung und Schmierung?', 'Das Gemisch schmiert und kühlt von innen, ein zu mageres macht den Motor heiß.', ['Es hat keinen Einfluss auf Kühlung und Schmierung, nur auf die Lautstärke.', 'Nur der Preis des Benzins ist wichtig, die Mischung spielt keine Rolle.', 'Nur der Tankdeckel sorgt für Kühlung, das Gemisch macht gar nichts.'], 'Zu wenig Benzin (mager) lässt den Motor heiß laufen, zu wenig Öl lässt ihn schlecht schmieren.'),
  N('Ein Zylinder hat 120 °C, die Luft 20 °C. Wie groß ist der Temperaturunterschied?', 100, '120 − 20 = 100 °C.', {unit:'°C'}),
  Q('Du sitzt auf dem Rasentraktor in der Sonne, und der Sitz wird heiß. Wie kommt die Wärme zu dir?', 'Durch Wärmestrahlung der Sonne', ['Durch Magnetismus aus dem Sitz', 'Durch Schall der Motorgeräusche', 'Durch aufgewirbelten Staub in der Luft'], 'Die Sonne überträgt Wärme durch Strahlung.')
]},

{id:'nawi-10', subject:'nawi', theme:'simson', topic:'Magnetismus', title:'Magnete im Schwungrad', sub:'Pole, Kompass und Magnetzündung', min:12,
 rlp:'Magnetismus: magnetische Wirkung, Pole, Magnetfeld, Kompass, Anwendungen',
 steps:[
  W('Magnete und Pole', 'Jeder Magnet hat zwei **Pole**: Nordpol und Südpol. **Gleichnamige Pole stoßen sich ab**, **ungleichnamige ziehen sich an**.\n\nMagnetisch sind Eisen, Nickel und Kobalt. Kupfer, Aluminium, Holz und Kunststoff sind nicht magnetisch.\n\nTeilst du einen Magneten, hat jedes Stück wieder zwei Pole. Ein **Kompass** ist ein drehbarer Magnet, der sich nach dem Magnetfeld der Erde ausrichtet.',
    'In der Zündanlage vieler Simson-Mopeds arbeiten Magnete am Schwungrad und Spulen zusammen und erzeugen den Strom für Zündung und Licht.'),
  Q('Was passiert, wenn man zwei Nordpole zusammenbringt?', 'Sie stoßen sich ab.', ['Sie ziehen sich an.', 'Sie verschmelzen.', 'Nichts.'], 'Gleichnamige Pole stoßen sich ab.'),
  Q('Welcher Stoff ist magnetisch?', 'Eisen', ['Kupfer', 'Aluminium', 'Holz'], 'Eisen, Nickel und Kobalt sind magnetisch.'),
  Q('Ein Magnet wird in der Mitte durchgebrochen. Was entsteht?', 'Zwei Magnete mit je zwei Polen', ['Ein Nordpol und ein Südpol getrennt', 'Zwei Stücke ohne Pole', 'Nichts mehr Magnetisches'], 'Auch kleine Stücke haben wieder Nord- und Südpol.'),
  Q('Wohin zeigt die Nadel eines Kompasses?', 'Ungefähr nach Norden, zum magnetischen Nordpol', ['Immer zur Sonne, egal zu welcher Tageszeit', 'Nach unten, weil die Erde schwer ist und anzieht', 'Zum nächsten Auto, das in der Nähe steht'], 'Die Nadel richtet sich nach dem Magnetfeld der Erde.'),
  Q('Warum sitzen Magnete im Schwungrad der Simson?', 'Sie erzeugen beim Drehen mit Spulen elektrischen Strom.', ['Damit das Rad schneller rostet und dadurch leiser läuft.', 'Damit sich Schrauben am Rad von selbst festziehen.', 'Damit der Tank beim Fahren voll bleibt und nicht leerläuft.'], 'Magnetfeld und Spule am drehenden Rad erzeugen Strom für Zündung und Licht.'),
  Q('Wie kannst du einen Eisennagel zeitweise magnetisch machen?', 'Mit einem Magneten mehrmals in eine Richtung streichen.', ['Mit kaltem Wasser abspülen und danach trocknen lassen.', 'Mit roter Farbe anmalen und gut trocknen lassen.', 'In kleine Stücke zerschneiden und wieder zusammenlegen.'], 'Dabei richten sich die kleinen Elementarmagnete im Eisen aus.'),
  M('Zuordnen', [['Kompass', 'zeigt die Himmelsrichtung'], ['Magnetschloss am Schrank', 'hält die Tür geschlossen'], ['Schwungradmagnet', 'hilft beim Erzeugen von Strom'], ['Magnetstreifen', 'speichert Daten']], 'Welche Anwendung passt zu welcher Aufgabe?')
]},

{id:'nawi-11', subject:'nawi', theme:'tuning', topic:'Licht und Schatten', title:'Licht, Schatten, Rückstrahler', sub:'Wie Scheinwerfer und Katzenaugen arbeiten', min:14,
 rlp:'Licht und Schatten: geradlinige Ausbreitung, Schatten, Reflexion, Spiegel, Anwendungen im Straßenverkehr',
 steps:[
  W('Licht geht geradeaus', 'Licht breitet sich **geradlinig** aus. Trifft es auf einen Gegenstand, entsteht dahinter ein **Schatten**. Je näher die Lichtquelle am Gegenstand ist, desto größer wird der Schatten.\n\nTrifft Licht auf einen Spiegel, wird es **reflektiert**. Der Winkel, mit dem es einfällt, ist gleich dem Winkel, mit dem es zurückgeworfen wird. Ein **Rückstrahler** (Katzenauge) wirft das Licht von Scheinwerfern zurück zur Quelle. So sieht man Fahrzeuge im Dunkeln.',
    'Ein Scheinwerfer hat hinter der Lampe einen Hohlspiegel (Reflektor). Er bündelt das Licht nach vorn.'),
  L('Schatten-Labor', 'Eine Lampe wirft den Schatten eines 10 cm hohen Gegenstands auf eine Wand in 200 cm Abstand. Verschiebe den Gegenstand.',
    [{id:'a', label:'Abstand Lampe–Gegenstand', min:40, max:180, step:10, val:100, unit:' cm'}],
    v => { const s = 10 * 200 / v.a, sy = Math.min(70, s * 3);
      return `<svg viewBox="0 0 340 90" width="100%"><circle cx="14" cy="45" r="9" fill="#ffd60a"/><line x1="14" y1="45" x2="330" y2="${45 - sy / 2}" stroke="#ffd60a" opacity=".4"/><line x1="14" y1="45" x2="330" y2="${45 + sy / 2}" stroke="#ffd60a" opacity=".4"/>
      <rect x="${14 + v.a * 1.5}" y="37" width="6" height="16" fill="${GREY}"/><rect x="330" y="${45 - sy / 2}" width="6" height="${sy}" fill="#636366"/></svg>
      <div class="center">Schattenhöhe: <b>${de(s, 1)} cm</b><br><span class="m">Je näher an der Lampe, desto größer der Schatten.</span></div>`; }),
  Q('Wie breitet sich Licht aus?', 'Geradlinig', ['In Kurven', 'Nur nach unten', 'Gar nicht'], 'Darum entstehen scharfe Schatten.'),
  Q('Du bringst einen Gegenstand näher an die Lampe. Was passiert mit dem Schatten?', 'Er wird größer.', ['Er wird kleiner.', 'Er verschwindet.', 'Er wird bunt.'], 'Das Licht wird stärker verdeckt.'),
  Q('Wozu dient ein Rückstrahler (Katzenauge) am Moped?', 'Er wirft Scheinwerferlicht zurück, damit man gesehen wird.', ['Er macht aus dem Fahrtwind Strom für das Rücklicht.', 'Er kühlt den Motor, indem er die Wärme zurückwirft.', 'Er sorgt für Schatten, damit der Fahrer nicht geblendet wird.'], 'Reflektiertes Licht macht das Fahrzeug im Dunkeln sichtbar.'),
  Q('Licht trifft unter 30° auf einen Spiegel. Unter welchem Winkel wird es zurückgeworfen?', '30°', ['60°', '90°', '0°'], 'Einfallswinkel = Reflexionswinkel.'),
  Q('Welche ist eine eigene Lichtquelle?', 'Die Sonne', ['Der Mond', 'Ein Spiegel', 'Eine Wand'], 'Der Mond wirft nur Sonnenlicht zurück.'),
  Q('Warum sollte man bei Dunkelheit helle Kleidung oder Reflektoren tragen?', 'Autofahrer sehen einen früher.', ['Man ist dann wärmer angezogen.', 'Man wird dadurch viel schneller.', 'Das Licht der Autos wird dunkler.'], 'Helle Stoffe und Reflektoren machen sichtbar.')
]},

{id:'nawi-12', subject:'nawi', theme:'hof', topic:'Wetter und Jahreszeiten', title:'Wetter auf dem Acker', sub:'Jahreszeiten und Wetter für Landwirte', min:14,
 rlp:'Jahreszeiten und Wetter: Erdachse, Sonnenstand, Wetterelemente, Wetterbeobachtung',
 steps:[
  W('Wetter und Jahreszeiten', 'Die Erde dreht sich einmal im Jahr um die Sonne. Ihre **Achse ist geneigt**. Darum steht die Sonne im Sommer höher und scheint länger, im Winter niedriger und kürzer. Daraus entstehen die **Jahreszeiten**.\n\n**Wetter** ist der Zustand der Luft an einem Ort zu einer Zeit: Temperatur, Wind, Niederschlag, Bewölkung. **Klima** ist das Wetter über viele Jahre.\n\nLandwirte planen danach: Aussaat im Frühling, Ernte von Getreide im Sommer, Mais im Herbst.',
    'Wer 1 mm Regen misst, hat 1 Liter Wasser pro Quadratmeter bekommen.'),
  Q('Warum gibt es Jahreszeiten?', 'Die Erdachse ist geneigt, und die Erde umkreist die Sonne.', ['Die Erde ist mal näher, mal weiter weg von der Sonne.', 'Die Sonne wird abwechselnd heißer und kälter.', 'Der Mond sorgt für Sommer und Winter.'], 'Die Neigung der Achse ändert den Sonnenstand im Jahreslauf.'),
  Q('Welches Messgerät misst die Temperatur?', 'Thermometer', ['Barometer', 'Hygrometer', 'Windfahne'], 'Das Barometer misst den Luftdruck.'),
  Q('Was misst ein Regenmesser?', 'Niederschlag in Millimetern', ['Windgeschwindigkeit in km/h', 'Temperatur in Grad Celsius', 'Luftdruck in Hektopascal'], '1 mm Niederschlag entspricht 1 Liter pro Quadratmeter.'),
  N('Es fallen 12 mm Regen. Wie viele Liter sind das auf 100 m²?', 1200, '12 mm sind 12 Liter pro m². Mal 100 m² ergibt 1 200 Liter.', {unit:'Liter', hint:'1 mm = 1 Liter pro m².'}),
  Q('Welche Jahreszeit passt zur Getreideernte?', 'Sommer', ['Winter', 'Frühling', 'Herbst nur im Dezember'], 'Getreide wird meist im Juli und August geerntet.'),
  Q('Was ist der Unterschied zwischen Wetter und Klima?', 'Wetter gilt kurz, Klima ist das Wetter über viele Jahre.', ['Beides ist dasselbe, es gibt nur zwei Wörter dafür.', 'Wetter ist nur der Regen, Klima ist nur die Sonne.', 'Klima ist nur der Wind, Wetter ist nur der Frost.'], 'Klima beschreibt typische Wetterwerte über lange Zeit.'),
  Q('Ein Landwirt sieht Dauerregen vor der Ernte. Warum ist das schwierig?', 'Das Getreide ist nass, der Mähdrescher arbeitet schlecht.', ['Der Mähdrescher fährt bei Regen dann viel schneller und sauberer.', 'Regen macht das Getreide süßer und das Mähen deshalb leichter.', 'Das Wetter ist vor der Ernte für Landwirte gar nicht wichtig.'], 'Nasses Getreide lässt sich schlecht ernten und lagern.')
]},

{id:'nawi-13', subject:'nawi', theme:'traktor', topic:'Boden', title:'Der Boden lebt', sub:'Sand, Ton, Humus und Regenwürmer', min:14,
 rlp:'Stoffe und Stoffeigenschaften, Pflanzen und Tiere: Bodenarten, Humus, Bodenlebewesen, Nutzung durch Landwirtschaft',
 steps:[
  W('Bodenarten und Leben im Boden', 'Boden besteht aus **Sand** (grob, wasserdurchlässig), **Schluff**, **Ton** (fein, hält Wasser) und **Humus** (dunkle, nährstoffreiche Schicht aus abgestorbenen Pflanzen). Viele Böden in Brandenburg sind sandig.\n\n**Regenwürmer** lockern den Boden, ziehen Pflanzenreste hinein und machen daraus Humus. Pflanzen brauchen **Nährstoffe** wie Stickstoff, Phosphor und Kalium. Landwirte düngen deshalb.\n\nWer jedes Jahr dieselbe Pflanze anbaut, laugt den Boden aus. Darum wechseln sie die Früchte (Fruchtfolge).',
    'In einem Teelöffel gesundem Boden leben mehr Lebewesen, als es Menschen auf der Erde gibt, vor allem winzige Bakterien.'),
  M('Boden-Eigenschaften', [['Sand', 'lässt Wasser schnell durch'], ['Ton', 'hält Wasser fest'], ['Humus', 'dunkel und nährstoffreich'], ['Regenwurm', 'lockert den Boden']], 'Ordne zu.'),
  Q('Welcher Boden speichert Wasser schlecht?', 'Sandboden', ['Tonboden', 'Humusreicher Boden', 'Lehmiger Boden'], 'Sand hat große Lücken, das Wasser sickert durch.'),
  Q('Woraus entsteht Humus?', 'Aus abgestorbenen Pflanzenteilen', ['Aus zerkleinertem Plastik und Folie', 'Aus gemahlenen Steinen und Sand', 'Aus geschmolzenem Metall und Schrott'], 'Bodenlebewesen zersetzen die Reste zu Humus.'),
  Q('Wie nützen Regenwürmer dem Boden?', 'Sie lockern und belüften ihn und mischen Pflanzenreste unter.', ['Sie fressen alle Pflanzen auf dem Feld auf und schaden dem Boden.', 'Sie verdichten den Boden, damit er fest und hart wird.', 'Sie ziehen Wasser aus dem Boden und trocknen ihn dadurch aus.'], 'Ihre Gänge lassen Luft und Wasser eindringen.'),
  Q('Welche drei Nährstoffe stehen für Pflanzen im Vordergrund?', 'Stickstoff, Phosphor und Kalium', ['Eisen, Kupfer und Zinn', 'Wasserstoff, Helium und Neon', 'Salz, Zucker und Öl'], 'Auf Düngersäcken steht oft N-P-K.'),
  Q('Warum wechseln Landwirte die Anbaufrüchte von Jahr zu Jahr?', 'Damit der Boden nicht einseitig ausgelaugt wird und Schädlinge abnehmen.', ['Damit der Traktor nicht rostet und die Reifen länger halten.', 'Damit das Feld im Sommer bunter aussieht und mehr Besucher kommen.', 'Es gibt keinen Grund, man macht es nur aus Gewohnheit und Spaß.'], 'Fruchtfolge schont den Boden.'),
  N('Ein Acker hat 2 ha. Auf jeden Hektar kommen 150 kg Dünger. Wie viele kg sind das insgesamt?', 300, '2 · 150 kg = 300 kg.', {unit:'kg'})
]},

{id:'nawi-14', subject:'nawi', theme:'tuning', topic:'Technik-Anatomie', title:'Simson-Anatomie', sub:'Alle wichtigen Teile finden und verstehen', min:14,
 rlp:'Maschinen und Energie: Aufbau von Fahrzeugen, Funktionsweise einzelner Bauteile, Sicherheit',
 steps:[
  W('Eine Simson von außen', 'Eine Simson S51 ist ein Mokick mit einem luftgekühlten Zweitaktmotor. Die wichtigsten Teile für Technik und Tuning: **Vergaser**, **Zylinder**, **Kerze**, **Auspuff**, **Kette**, **Tank**.\n\nDie Zeichnung ist ein vereinfachtes Schema, kein exakter Bauplan.',
    'Die S51 wurde in Suhl in Thüringen gebaut, die Schwalbe KR51 ebenfalls bei Simson. Beide Typen sind bei Ostmoped-Fans bis heute beliebt.', 'simson'),
  P('Teile erkunden', 'Tippe auf die Zahlen und lies, was jedes Teil macht.', 'simson'),
  P('Teile finden', 'Tippe der Reihe nach die gefragten Teile an.', 'simson', true),
  Q('Welches Teil mischt Luft und Benzin zu einem zündfähigen Gemisch?', 'Der Vergaser', ['Der Auspuff', 'Die Kette', 'Das Rücklicht'], 'Der Vergaser dosiert das Benzin in die angesaugte Luft.'),
  Q('Beim Tuning wird oft eine größere Hauptdüse im Vergaser eingebaut. Warum?', 'Damit mehr Benzin ins Gemisch kommt, wenn der Motor mehr Luft bekommt.', ['Damit der Tank schneller leer wird und man öfter tanken muss.', 'Damit die Zündkerze heller leuchtet und der Motor besser aussieht.', 'Damit der Auspuff leiser wird und die Abgase sauberer werden.'], 'Mehr Luft braucht mehr Kraftstoff, sonst wird das Gemisch zu mager.'),
  Q('Was kann bei einem zu mageren Gemisch (zu wenig Kraftstoff im Verhältnis zur Luft) passieren?', 'Der Motor wird zu heiß, und der Kolben kann klemmen.', ['Der Motor wird kälter und läuft deshalb viel ruhiger.', 'Der Motor braucht dann weniger Luft und weniger Benzin.', 'Nichts, ein mageres Gemisch ist für den Motor völlig egal.'], 'Mager heißt: zu wenig Kraftstoff, zu viel Luft. Dann gibt es weniger Kühlung und Schmierung.'),
  Q('Wozu dient der Auspuff-Endtopf auch?', 'Er dämpft den Lärm.', ['Er füllt den Tank.', 'Er kühlt die Reifen.', 'Er startet den Motor.'], 'Der Schalldämpfer reduziert die Lautstärke.'),
  Q('Warum ist die richtige Kettenspannung wichtig?', 'Zu lockere oder zu stramme Ketten verschleißen schneller und springen ab.', ['Sie macht den Tank größer, damit das Moped weiter fahren kann.', 'Sie spielt keine Rolle, weil jede Kette ewig hält und nie springt.', 'Sie verbessert nur die Farbe der Kette und sieht besser aus.'], 'Die Kette muss gepflegt und richtig gespannt sein.')
]},

{id:'nawi-15', subject:'nawi', theme:'traktor', topic:'Technik-Anatomie', title:'Rasentraktor-Check', sub:'Die Teile kennen und sicher mähen', min:12,
 rlp:'Maschinen und Energie: Aufbau von Maschinen, Sicherheit im Umgang mit Maschinen',
 steps:[
  W('Der Rasentraktor', 'Ein Rasentraktor hat unten ein **Mähdeck** mit rotierenden **Messern**. Das Gras wird abgeschnitten und in den **Fangkorb** geblasen. Ein **Sicherheitsschalter** unter dem Sitz stoppt das Messer, wenn man aufsteht.\n\nSicherheit: Nie mit dem Rasentraktor über Steine fahren, nie Kinder mitfahren lassen, nie an den Messern arbeiten, wenn der Motor läuft. Immer erst die Zündkerze abziehen oder den Zündschlüssel entfernen.', '', 'rasen'),
  P('Teile erkunden', 'Tippe auf die Zahlen und lies, was jedes Teil macht.', 'rasen'),
  P('Teile finden', 'Tippe der Reihe nach die gefragten Teile an.', 'rasen', true),
  Q('Was macht der Sicherheitsschalter unter dem Sitz?', 'Er stoppt das Messer, wenn der Fahrer aufsteht.', ['Er füllt den Tank auf, wenn der Fahrer absteigt.', 'Er schaltet das Radio ein, wenn der Fahrer sich setzt.', 'Er macht Licht an, wenn es draußen dunkel wird.'], 'So ist die Gefahr durch laufende Messer geringer.'),
  Q('Was musst du tun, bevor du an den Messern arbeitest?', 'Motor aus und Kerzenstecker abziehen oder Schlüssel ziehen', ['Gas geben, damit die Messer schön schnell laufen', 'Schneller fahren, damit das Messer sauberer schneidet', 'Mit der Hand ans Messer fassen, während der Motor noch läuft und dreht'], 'Nur so kann der Motor nicht versehentlich anspringen.'),
  Q('Warum soll das Messer scharf sein?', 'Scharfe Messer schneiden sauber, stumpfe reißen die Halme.', ['Damit es beim Mähen lauter ist und alle es hören.', 'Damit es im Dunkeln heller leuchtet und man es sieht.', 'Das ist völlig egal, ein Messer schneidet immer genauso gut.'], 'Saubere Schnittflächen heilen besser.'),
  N('Das Mähdeck schneidet 1,0 m breit, und du fährst 50 m weit. Wie viele m² Rasen mähst du?', 50, '1,0 m · 50 m = 50 m².', {unit:'m²'})
]}

);

// ---- Großes Ziel: MTX-Zylinder
MISSIONS.push(

{id:'nawi-16', subject:'nawi', theme:'tuning', topic:'Wärme', title:'Wassergekühlt: Der Kühlkreislauf', sub:'Wie Wasser den Motor kühlt', min:15,
 rlp:'Wärme und Temperatur: Wärmeübertragung, Strömung, Siedetemperatur, Kühlung; Wasser als Wärmespeicher',
 steps:[
  W('Wasser als Kühlmittel', 'Wasser kann viel Wärme aufnehmen und transportieren. Darum kühlen viele Motoren mit Wasser, zum Beispiel der Honda-MTX-Motor.\n\nEine **Wasserpumpe** schickt das Kühlmittel durch den **Wassermantel** um den Zylinder. Dort nimmt es Wärme auf. Das heiße Wasser fließt durch den oberen Schlauch zum **Kühler**. Im Kühler gibt es seine Wärme an die Luft ab. Das abgekühlte Wasser fließt durch den unteren Schlauch zurück zum Motor.\n\nEin **Thermostat** hält den Motor auf der richtigen Temperatur: Ist er noch kalt, bleibt der Weg zum Kühler zu.',
    'Im Kühlsystem steht Druck. Dadurch siedet das Wasser erst bei mehr als 100 °C. Darum nie den Kühlerdeckel bei heißem Motor öffnen: Verbrühungsgefahr.', 'kuehlung'),
  P('Teile erkunden', 'Tippe auf die Zahlen und lerne die Teile des Kühlkreislaufs kennen.', 'kuehlung'),
  P('Finde die Teile', 'Tippe der Reihe nach die gefragten Teile an.', 'kuehlung', true),
  Q('Wozu dient die Wasserpumpe?', 'Sie bewegt das Kühlmittel durch Motor und Kühler.', ['Sie füllt den Tank mit frischem Benzin nach.', 'Sie schmiert die Kette und das Ritzel mit Öl.', 'Sie zündet das Gemisch im Zylinder mit einem Funken.'], 'Ohne Pumpe würde das Wasser kaum zirkulieren.'),
  Q('Wo gibt das Kühlmittel seine Wärme ab?', 'Im Kühler an die Luft', ['Im Tank an das Benzin', 'In der Zündkerze an den Funken', 'Im Reifen an die Straße'], 'Der Kühler hat viele Rippen, damit die Luft viel Wärme mitnimmt.'),
  Q('Was macht das Thermostat?', 'Es hält die Temperatur, indem es den Weg zum Kühler öffnet oder schließt.', ['Es zeigt dem Fahrer auf dem Armaturenbrett die Uhrzeit an und stellt sie.', 'Es macht das Licht für den Fahrer an, sobald es draußen dunkel wird.', 'Es startet den Motor, sobald man den Schlüssel im Zündschloss dreht.'], 'Kalter Motor: Weg zum Kühler zu. Warmer Motor: Weg offen.'),
  Q('Warum braucht Kühlwasser im Winter Frostschutz?', 'Weil Wasser beim Gefrieren Platz braucht und Teile sprengen kann.', ['Weil Wasser im Winter süß wird und dann Tiere anlockt.', 'Weil Frostschutz den Motor im Winter schneller und kräftiger macht.', 'Es braucht keinen, denn Wasser gefriert im Motor niemals.'], 'Eis braucht mehr Platz als Wasser. Frostschutzmittel senkt die Gefriertemperatur.'),
  Q('Welcher Vorteil hat Wasserkühlung gegenüber Luftkühlung?', 'Der Motor wird gleichmäßiger gekühlt und bleibt bei Last stabiler.', ['Sie braucht gar keine Teile und ist deshalb viel einfacher gebaut.', 'Sie macht den Motor leichter, weil der Kühler Gewicht spart.', 'Sie ist immer billiger, weil Wasser im Kühler nichts kostet.'], 'Dafür braucht sie mehr Teile: Pumpe, Kühler, Schläuche.'),
  Q('Im Kühlsystem steht Druck. Bei welcher Temperatur siedet das Wasser dort?', 'Bei mehr als 100 °C', ['Bei weniger als 100 °C', 'Genau bei 0 °C', 'Es siedet nie'], 'Unter Druck siedet Wasser erst bei höheren Temperaturen. Das macht Dampfblasen unwahrscheinlicher.')
]}

);

// ---- Fotos vom echten Rasentraktor
MISSIONS.push(

{id:'nawi-17', subject:'nawi', theme:'traktor', topic:'Technik-Anatomie', title:'Mein Rasentraktor: Fotocheck', sub:'Der echte Rasentraktor, Teil für Teil', min:16,
 rlp:'Maschinen und Energie: Aufbau und Funktion von Maschinen, Kraftübertragung, Sicherheit im Umgang',
 steps:[
  W('Ein echter Rasentraktor', 'Das ist ein echter Rasentraktor mit Motor vorn, Sitz hinten und einem Mähdeck unter dem Fahrzeug. Er hat einen luftgekühlten Benzinmotor, Rasenreifen, einen Zündschlüssel und ein Lenkrad.\n\nIn dieser Mission schaust du dir Fotos an und lernst die Teile kennen. Die Namen sind nach dem Foto bestimmt. Wenn dir etwas anders vorkommt, frag einen Erwachsenen.', '', 'rasenfront'),
  P('Von vorn: Teile erkunden', 'Tippe auf die Zahlen und lies, was jedes Teil macht.', 'rasenfront'),
  P('Von vorn: Teile finden', 'Tippe der Reihe nach die gefragten Teile an.', 'rasenfront', true),
  P('Motor und Deck: Teile erkunden', 'Hier ist die Haube offen. Tippe auf die Zahlen und lerne die Teile kennen.', 'rasenmotor'),
  P('Motor und Deck: Teile finden', 'Tippe der Reihe nach die gefragten Teile an.', 'rasenmotor', true),
  Q('Wozu hat der Motor oben ein Gitter?', 'Dort saugt ein Lüfter Kühlluft an. Der Motor ist luftgekühlt.', ['Dort wird Benzin eingefüllt, und der Motor ist wassergekühlt.', 'Dort kommt das Messer heraus, damit man den Rasen mäht.', 'Es ist nur Dekoration, es hat keine Aufgabe am Motor.'], 'Ein Lüfterrad am Motor bläst Luft über die Kühlrippen.'),
  Q('Wie kommt die Kraft vom Motor zu den Messern unter dem Deck?', 'Über einen Keilriemen', ['Über eine Kette wie beim Fahrrad', 'Über Strom', 'Über Wasser'], 'Der Riemen läuft vom Motor auf die Riemenscheibe oben auf dem Deck.'),
  Q('Wozu haben Rasentraktoren breite Reifen mit flachem Profil?', 'Sie schonen den Rasen und geben genug Halt.', ['Damit sie lauter sind und man sie früher hört.', 'Damit sie schneller fahren und weniger Sprit brauchen.', 'Damit sie bei Regen nicht rosten und länger halten.'], 'Breite Reifen verteilen das Gewicht, und das Profil greift ohne tiefe Spuren.'),
  Q('Wozu hat die Fußplatte ein Riffelmuster?', 'Damit man nicht ausrutscht', ['Damit sie leichter ist', 'Damit sie schöner leuchtet', 'Damit Wasser besser verdunstet'], 'Riffelblech ist rutschfest.'),
  N('Das Messer dreht sich mit 3 000 Umdrehungen pro Minute. Wie viele Umdrehungen sind das pro Sekunde?', 50, '3 000 ÷ 60 = 50 Umdrehungen pro Sekunde.', {unit:'U/s'}),
  N('Beispiel: Das Deck mäht 0,92 m breit. Wie viele Bahnen brauchst du für 9,2 m Breite?', 10, '9,2 ÷ 0,92 = 10 Bahnen.', {unit:'Bahnen', hint:'Teile die Gesamtbreite durch die Bahnbreite.'}),
  X('Erkläre in eigenen Worten: Wie kommt die Kraft vom Motor bis zum Messer, und wozu ist der Sicherheitsschalter da?', 'Tipp: Motor, Riemen, Messer. Sprich in kleinen Schritten.', 60)
]}

);

// ---- Simson SR50
MISSIONS.push(

{id:'nawi-18', subject:'nawi', theme:'tuning', topic:'Technik-Anatomie', title:'Simson SR50: Verkleidung und Technik', sub:'Das Moped mit Trittbrett und offenen Federn', min:14,
 rlp:'Maschinen und Energie: Aufbau von Fahrzeugen, Federung und Kraftübertragung, Vergleich von Bauarten',
 steps:[
  W('Der SR50', 'Der SR50 ist ein Simson-Moped mit Verkleidung. Anders als die S51 hat er ein Trittbrett zum bequemen Einsteigen, ein Beinschild, das vor Wind schützt, einen Mittelständer, eine lange Sitzbank und eine Lenkerverkleidung mit rundem Scheinwerfer. Vorn liegen die Federn der Teleskopgabel offen.\n\nUnter der Verkleidung steckt ein luftgekühlter Zweitaktmotor mit etwa 50 cm³ und Kettenantrieb.',
    'Viele Händler bieten Zylinder-Sätze an, die für die S51, die Schwalbe KR51/2 und den SR50 passen. Das liegt an der gleichen Motorfamilie.', 'sr50'),
  P('Teile erkunden', 'Tippe auf die Zahlen und lies, was jedes Teil macht. Die Zeichnung ist nach Fotos entstanden, sie zeigt eine rote Variante.', 'sr50'),
  P('Teile finden', 'Tippe der Reihe nach die gefragten Teile an.', 'sr50', true),
  Q('Welche Besonderheit hat der SR50 gegenüber der S51?', 'Er hat ein Trittbrett, ein Beinschild und eine Verkleidung.', ['Er hat keinen Motor und wird nur mit den Pedalen gefahren, wie ein Fahrrad.', 'Er hat vier Räder und ein festes Dach wie ein Auto.', 'Er hat einen Dieselmotor statt eines Zweitakters.'], 'Der SR50 ist ein Moped mit Verkleidung, die S51 ist ein Mokick mit offenem Rahmen.'),
  Q('Wozu dient das Beinschild?', 'Es schützt die Beine vor Wind und Spritzwasser.', ['Es kühlt den Motor mit Fahrtwind und etwas Wasser.', 'Es macht Licht für die Beine bei Dunkelheit.', 'Es hält die Kette und das Ritzel zusammen.'], 'Das Beinschild verdeckt Beine und Teile des Rahmens.'),
  Q('Was sieht man an der Gabel des SR50 deutlich?', 'Die offenen Federn', ['Einen großen Ölfilter', 'Einen Kühler aus Alu', 'Ein großes Zahnrad'], 'Teleskopgabel mit freiliegenden Federn.'),
  Q('Wozu hat der SR50 einen Mittelständer?', 'Er steht fest, und das Hinterrad ist frei, zum Beispiel für die Kettenpflege.', ['Damit er schneller fährt, wenn man den Ständer beim Fahren ausgeklappt lässt.', 'Damit er lauter wird, weil der Ständer beim Fahren mitklappert.', 'Damit er beim Fahren mehr Benzin spart und leichter anspringt.'], 'Auf dem Mittelständer steht das Moped stabil.'),
  Q('Was haben S51, Schwalbe KR51/2 und SR50 gemeinsam?', 'Luftgekühlter Zweitakter mit etwa 50 cm³ (gleiche Motorfamilie)', ['Einen Dieselmotor mit Wasserkühlung und einem großen Kühler vorne', 'Einen Elektroantrieb mit Akku im Rahmen und Ladekabel', 'Allradantrieb und eine Federung wie bei einem Traktor'], 'Deshalb passen viele Tuning-Zylinder für alle drei.'),
  N('Beispiel: Der Reservekanister fasst 6 Liter, der Verbrauch beträgt 3 Liter auf 100 km. Wie weit kommst du mit einer Kanisterfüllung?', 200, '6 l ÷ 3 l je 100 km = 2 · 100 km = 200 km.', {unit:'km'}),
  X('Vergleiche in drei Sätzen: Was ist beim SR50 anders als bei der S51?', 'Tipp: Trittbrett, Beinschild, Mittelständer. Mach kleine Pausen.', 60)
]}

);
