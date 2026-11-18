'use strict';
// Missionen V2 (Teil 2): Kundenaufträge, Bilderquiz, Blitzrunden, Tagesaufträge (Simson). Alle Zahlen ca.-Richtwerte.
MISSIONS.push(
M2('sim-kunde-1', 'deutsch', 'kunde', 'Kundenauftrag: Der Mopedfahrer mit Eile', 'Höflich und klar mit Kunden reden, auf Zeit', 12, [
  W('Freundlich und genau', 'Im Kundengespräch zählen **drei Dinge**: freundlich grüßen („Guten Tag, was kann ich für Sie tun?“), das Problem **genau erfragen** und ehrlich sagen, was es kostet und wie lange es dauert. Mit „Sie“ und ganzen Sätzen klingst du wie ein Profi. Fachwörter erklärst du kurz.', 'Wer ehrlich sagt „das weiß ich noch nicht, ich prüfe es“, wirkt kompetenter als jemand, der rät.'),
  stp('k1', {type: 'kunde', title: 'Gespräch in der Werkstatt', av: '👨‍🦰', story: '**Herr Krause** kommt zur Tür herein. Seine Schwalbe steht draußen, sie ruckelt. Er hat es eilig und will heute noch zur Arbeit fahren.',
    end: 'Du hast höflich gesprochen, nachgefragt und ehrlich geplant. So bleiben Kunden treu.',
    lines: [
      {say: '„Moin. Meine Schwalbe ruckelt bei Vollgas. Wie lange dauert das? Ich hab’s eilig!“', sek: 20, ch: [{t: 'Guten Tag, Herr Krause. Ich sehe sie mir gleich an. Wann ruckelt sie genau?', good: 1, re: 'Freundlich und mit einer klaren Rückfrage. Genau so.'}, {t: 'Keine Ahnung, keine Zeit.', re: 'Das klingt unhöflich. Kunden wollen ernst genommen werden.'}, {t: 'Das ist bestimmt der Motor kaputt.', re: 'Zu früh geraten. Erst nachfragen und prüfen.'}]},
      {say: '„Nur wenn ich schnell fahre. Im Leerlauf ist alles gut.“', sek: 20, ch: [{t: 'Danke. Dann prüfe ich zuerst Zündkerze und Vergaser. Das dauert etwa eine halbe Stunde.', good: 1, re: 'Du nennst Schritte und eine ehrliche Zeit. Das schafft Vertrauen.'}, {t: 'Dauert ewig, kommen Sie morgen wieder.', re: 'Du gibst keinen Grund an. Das wirkt abweisend.'}, {t: 'Das mach ich in zwei Minuten.', re: 'Das ist unrealistisch. Versprich nur, was du halten kannst.'}]},
      {say: '„Und was kostet mich das ungefähr?“', ch: [{t: 'Eine neue Kerze kostet ca. 5 Euro, dazu kommt die Arbeitszeit. Ich sage Ihnen Bescheid, bevor ich mehr mache.', good: 1, re: 'Ehrlicher Kostenrahmen und Absprache vor weiteren Arbeiten.'}, {t: 'Das sehen wir dann schon.', re: 'Kunden wollen vorher wissen, womit sie rechnen müssen.'}, {t: 'Mindestens 500 Euro.', re: 'Das schreckt ab und ist ohne Prüfung nicht begründet.'}]}]}),
  stp('k1b', {type: 'quiz', q: 'Welche Anrede passt im Kundengespräch?', opts: ['Guten Tag, Herr Krause. Wie kann ich Ihnen helfen?', 'Hey, Alter, was willst du?', 'Na, was is los?', 'Sag schon.'], why: 'Mit „Sie“, Gruß und Namen sprichst du wie ein Profi.'}),
  GAP('Höflich formulieren', 'Könnten {Sie} mir bitte sagen, {wann} das Problem auftritt?', ['wer', 'du']),
  Q('Wie schreibt man den Satz richtig?', 'Ich rufe Sie an, sobald die Reparatur fertig ist.', ['Ich rufe sie an, sobald die Reparatur fertig ist.', 'Ich rufe Sie an sobald, die Reparatur fertig ist.', 'ich rufe Sie an, sobald die Reparatur fertig ist.'], 'Die höfliche Anrede „Sie“ schreibt man groß. Vor „sobald“ steht ein Komma.')
], {timed: 1}),
M2('sim-kunde-2', 'mathe', 'kunde', 'Kundenauftrag: Rechnung und Rabatt', 'Preise, Prozent und Umsatzsteuer', 14, [
  W('Rechnung schreiben', 'Eine Werkstattrechnung hat drei Teile: **Material** (Teile), **Arbeitszeit** (Stunden · Stundensatz) und die **Umsatzsteuer** (in Deutschland ca. 19 %, Stand: Spielwert). Brutto = Netto + Umsatzsteuer, also Brutto = Netto · 1,19.\n\nBeispiel: 50 € netto · 1,19 = 59,50 € brutto.', 'Rabatt von 10 % heißt: Du zahlst 90 %, also Preis · 0,9.'),
  stp('k2', {type: 'kunde', title: 'Frau Berger will wissen, was es kostet', av: '👩', story: '**Frau Berger** holt ihre S51 ab. Du hast eine neue Zündkerze (5 €), einen Satz Kerzenstecker (3 €) und 1 Stunde Arbeit (30 € pro Stunde) berechnet, alles netto.',
    end: 'Preise offen erklärt und nachgerechnet. So werden Rechnungen verständlich.',
    lines: [
      {say: '„Was kostet das alles zusammen? Ohne Steuer erst mal.“', sek: 25, ch: [{t: 'Netto: 5 + 3 + 30 = 38 Euro.', good: 1, re: 'Richtig: 5 + 3 + 30 = 38 €.'}, {t: 'Das sind 35 Euro.', re: 'Du hast die Teile nicht ganz addiert. 5 + 3 + 30 = 38.'}, {t: 'Das sind 53 Euro.', re: 'Zu viel. 5 + 3 + 30 sind 38.'}]},
      {say: '„Und mit der Umsatzsteuer, wie viel muss ich dann zahlen? Die sind 19 Prozent.“', sek: 30, ch: [{t: '38 mal 1,19, das sind ca. 45,22 Euro brutto.', good: 1, re: '38 · 1,19 = 45,22 €. Richtig.'}, {t: '38 plus 19, das sind 57 Euro.', re: '19 Prozent sind nicht 19 Euro. Rechne 38 · 0,19 = 7,22 und addiere.'}, {t: '38 mal 0,19, das sind ca. 7 Euro.', re: 'Das ist nur die Steuer. Dazu kommt der Nettopreis.'}]},
      {say: '„Ich bin Stammkundin. Gibt es 10 Prozent Rabatt auf den Gesamtpreis?“', ch: [{t: 'Ja, 10 Prozent auf 45,22 Euro, das sind ca. 40,70 Euro.', good: 1, re: '45,22 · 0,9 = 40,698, also ca. 40,70 €.'}, {t: 'Nein, Rabatt gibt es nie.', re: 'Das klingt hart. Ein Kulanzangebot ist Sache des Chefs, aber freundlich bleiben.'}, {t: 'Dann sind es 35,22 Euro.', re: '10 Prozent sind nicht 10 Euro, sondern ca. 4,52 €.'}]}]}),
  N('Brutto = Netto · 1,19. Wie viel Euro brutto sind 100 Euro netto?', 119, '100 · 1,19 = 119.', {unit: '€'}),
  N('Eine Rechnung ist 80 Euro. Wie viel Euro sind 10 Prozent Rabatt?', 8, '10 % von 80 sind 8 €.', {unit: '€'}),
  N('Eine Arbeitsstunde kostet 30 Euro netto. Der Auftrag dauert 1 h 30 min. Wie viel Euro Arbeitszeit?', 45, '1,5 · 30 = 45 €.', {unit: '€'})
], {timed: 1}),
M2('sim-bild-1', 'nawi', 'bild', 'Bilderquiz: Das Kerzenbild lesen', 'Wie sieht die Kerze aus, was heißt das?', 10, [
  W('Das Kerzenbild', 'Der Isolator der Zündkerze verrät, wie der Motor verbrennt: **rehbraun** bedeutet passende Mischung, **weiß** zu mager (zu heiß), **schwarz und trocken** zu fett (Ruß), **schwarz und nass** Öl oder Kraftstoff steht in der Kerze.', 'Ein Zweitaktmotor schmiert sich über Öl im Gemisch. Etwas Ruß und Öl ist normal, nur zu viel ist ein Zeichen.'),
  stp('b1', {type: 'bild', title: 'Kerzenbilder', text: 'Schau dir die Kerzen genau an.', items: [
    {svg: plugSvg('#b88a55'), q: 'Rehbraun. Was sagt das?', o: ['Passende Mischung', 'Viel zu mager', 'Kerze ist defekt', 'Der Tank ist leer'], why: 'Rehbraune Isolatoren sind das Ziel beim Tuner.'},
    {svg: plugSvg('#efefe6'), q: 'Die Kerze ist hell-weiß. Was sagt das?', o: ['Zu mager, zu heiß, größere Düse nötig', 'Zu fett', 'Alles perfekt', 'Zu viel Öl'], why: 'Weiß heißt zu wenig Kraftstoff, der Motor wird zu heiß.'},
    {svg: plugSvg('#262120', true), q: 'Die Kerze ist schwarz und nass. Was ist die wahrscheinlichste Ursache?', o: ['Abgesoffen: zu viel Gemisch, Kerze verrußt', 'Zu mager', 'Motor zu heiß', 'Zündung zu früh'], why: 'Nass und schwarz: zu fett oder Motor mehrmals ohne Zündung geklickt.'}]}),
  Q('Welche Farbe wünscht sich ein Tuner am Isolator der Kerze?', 'rehbraun', ['weiß', 'tiefschwarz', 'blau'], 'Rehbraun ist der Mittelweg zwischen zu fett und zu mager.'),
  Q('Eine weiße Kerze bedeutet:', 'Das Gemisch ist zu mager.', ['Das Gemisch ist zu fett.', 'Der Tank ist zu voll.', 'Die Kerze ist neu.'], 'Zu wenig Benzin: Der Motor wird heiß.')
]),
M2('sim-bild-2', 'englisch', 'bild', 'Bilderquiz: Motorteile auf Englisch', 'Wie heißt das Teil im Bild?', 10, [
  W('Engine parts', 'a **piston** = Kolben\nthe **cylinder** = Zylinder\nthe **spark plug** = Zündkerze\na **carburettor** (britisch) / **carburetor** (amerikanisch) = Vergaser\nthe **exhaust** = Auspuff\nthe **crankcase** = Kurbelgehäuse\n\nDie **crankshaft** ist die Kurbelwelle.', 'Im Zweitakter gibt es keine valves (Ventile). Der Kolben steuert den Gaswechsel.'),
  stp('b2', {type: 'bild', title: 'Which part is it?', text: 'Der gelbe Punkt zeigt auf ein Teil.', items: [
    {svg: MOTSVG, mk: [50, 8], q: 'What is this part called? (oberes Teil, durch das der Funke kommt)', o: ['spark plug', 'piston', 'exhaust', 'crankcase'], why: 'The spark plug ignites the mixture.'},
    {svg: MOTSVG, mk: [50, 25], q: 'Which word fits the finned part?', o: ['cylinder', 'tank', 'chain', 'saddle'], why: 'The cylinder has cooling fins.'},
    {svg: MOTSVG, mk: [86, 52], q: 'The gray pipe on the right is the …', o: ['exhaust', 'carburettor', 'crankshaft', 'spark plug'], why: 'The exhaust leads the hot gases away.'},
    {svg: MOTSVG, mk: [50, 80], q: 'The housing at the bottom is the …', o: ['crankcase', 'piston', 'fuel tank', 'headlight'], why: 'The crankshaft runs in the crankcase.'}]}),
  T('Wie heißt „Kolben“ auf Englisch?', ['piston'], 'a piston'),
  Q('Welche Frage stellst du dem Kollegen auf Englisch?', 'Can you pass me the wrench, please?', ['Can you passes me the wrench, please?', 'Can you pass me wrench please?', 'You pass me the wrench?'], 'Can you + Grundform des Verbs (pass).')
]),
M2('sim-blitz-1', 'mathe', 'blitz', 'Blitzrunde Mathe: Hubraum und Drehzahl', 'Kurze Rechnungen, nur als Spiel mit Zeit', 8, [
  W('Hubraum', 'Hubraum V = Fläche · Hub = π · (d : 2)² · h. Mit Bohrung d = 40 mm und Hub h = 39,5 mm: V ≈ 49,6 cm³ (das ist die S51 mit „50er“-Klasse). Drehzahl pro Sekunde = U/min : 60.', 'Ein größerer Kolben macht mehr Hubraum, aber auch mehr Hitze und Belastung.'),
  stp('bl1', {type: 'blitz', title: 'Blitzrunde: Rechnen wie ein Tuner', text: 'Fünf kurze Aufgaben. Tippe die richtige Antwort an.', sek: 90, items: [
    {q: '3000 U/min sind wie viele Umdrehungen pro Sekunde?', o: ['50', '30', '100', '300'], why: '3000 : 60 = 50'},
    {q: 'Wie viele cm³ sind 1 Liter?', o: ['1000', '100', '10', '10 000'], why: '1 l = 1 dm³ = 1000 cm³'},
    {q: 'Eine Bohrung von 40 mm ist wie viele Zentimeter?', o: ['4 cm', '40 cm', '0,4 cm', '400 cm'], why: '10 mm = 1 cm'},
    {q: '10 % von 150 Euro sind:', o: ['15 Euro', '1,50 Euro', '10 Euro', '50 Euro'], why: '150 : 10 = 15'},
    {q: 'Du fährst 60 km/h. Wie weit kommst du in 30 Minuten?', o: ['30 km', '60 km', '20 km', '120 km'], why: 'Eine halbe Stunde, halber Weg.'}], end: 'Kopfrechnen wird mit Üben schneller.'})
], {timed: 1}),
M2('sim-tag-a', 'mathe', 'blitz', 'Tagesauftrag: Rechnen', 'Kurze Rechnungen, jeden Tag ein Auftrag, dafür Taler', 5, [
  stp('ta', {type: 'blitz', title: 'Tagesauftrag Mathe', text: 'Löse die vier Aufgaben.', sek: 80, items: [
    {q: '2500 U/min : 60, auf eine ganze Zahl gerundet, sind etwa:', o: ['42 pro Sekunde', '25 pro Sekunde', '60 pro Sekunde', '4 pro Sekunde'], why: '2500 : 60 = 41,7'},
    {q: '25 % von 80 Euro:', o: ['20 Euro', '25 Euro', '2 Euro', '8 Euro'], why: 'Ein Viertel von 80'},
    {q: 'Ein Liter Gemisch kostet 2 Euro. Wie viel kosten 5 Liter?', o: ['10 Euro', '7 Euro', '20 Euro', '2,5 Euro'], why: '5 · 2 = 10'},
    {q: 'Die Zündkerze hat 0,6 mm Abstand. Wie viel sind 3 Kerzen zusammen, Abstand addiert?', o: ['1,8 mm', '0,18 mm', '18 mm', '3,6 mm'], why: '3 · 0,6 = 1,8'}], end: 'Der Tagesauftrag ist erledigt.'})
], {tag: 1}),
M2('sim-tag-b', 'nawi', 'blitz', 'Tagesauftrag: Technik', 'Vier Fragen aus der Werkstatt', 5, [
  stp('tb', {type: 'blitz', title: 'Tagesauftrag Technik', text: 'Vier Fragen aus Physik und Technik.', sek: 80, items: [
    {q: 'Was braucht ein Motor zum Zünden?', o: ['Funke', 'Wasser', 'Schnee', 'Gummi'], why: 'Kraftstoff, Luft, Zündfunke'},
    {q: 'Welche Einheit hat die Spannung der Batterie?', o: ['Volt', 'Liter', 'Meter', 'Kilogramm'], why: 'Volt (V)'},
    {q: 'Wozu dient der Luftfilter?', o: ['Er hält Staub aus dem Motor', 'Er kühlt das Öl', 'Er macht Licht', 'Er speichert Benzin'], why: 'Staub verschleißt Zylinder und Kolben.'},
    {q: 'Beim Bremsen entsteht Reibung zwischen Belag und …', o: ['Scheibe oder Trommel', 'Kerze', 'Tank', 'Vergaser'], why: 'Reibung wandelt Bewegungsenergie in Wärme.'}], end: 'Gute Antworten!'})
], {tag: 1}),
M2('sim-tag-c', 'englisch', 'blitz', 'Tagesauftrag: Englisch und Deutsch', 'Vokabeln und Wörter im Werkstattalltag', 5, [
  stp('tc', {type: 'blitz', title: 'Tagesauftrag Sprache', text: 'Vier Aufgaben zu Werkstattwörtern.', sek: 80, items: [
    {q: 'Wie heißt „Auspuff“ auf Englisch?', o: ['exhaust', 'engine', 'piston', 'wheel'], why: 'the exhaust'},
    {q: 'Was bedeutet „spanner“?', o: ['Schraubenschlüssel', 'Schere', 'Brille', 'Kolben'], why: 'spanner (britisch) = Schraubenschlüssel'},
    {q: 'Wie schreibt man das Wort richtig?', o: ['Zündkerze', 'Zündkerzze', 'Zünkerze', 'Zuendkertze'], why: 'Zünd + Kerze'},
    {q: 'Welcher Satz ist richtig?', o: ['Der Motor springt an, weil die Kerze neu ist.', 'Der Motor springt an, weil die Kerze ist neu.', 'Der Motor springt an, deshalb die Kerze neu ist.', 'Der Motor springt an weil, die Kerze neu ist.'], why: 'Nach weil steht das Verb am Ende.'}], end: 'Sprachprofi!'})
], {tag: 1})
);
