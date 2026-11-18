// Neue Missionen V2 "Simson-Tuningwerkstatt": Mathe, Deutsch, Englisch, NaWi rund um echte Simson-Technik.
// Alle Werte sind gerundete Richtwerte für den Unterricht, keine Herstellerangaben.
MISSIONS.push(
{id:'mathe-w1', subject:'mathe', theme:'tuning', topic:'Dezimalzahlen', title:'Die Werkstattrechnung', sub:'Teilepreise addieren und Rest berechnen', min:10,
 rlp:'Zahlen: Rechnen mit Dezimalzahlen (Geld), Überschlag, Sachaufgaben',
 steps:[
  W('Rechnen mit Euro und Cent', 'In der Werkstatt gibt es für jedes Teil einen Preis. Beim **Addieren** schreibst du Komma unter Komma. Mit einem **Überschlag** (runden) prüfst du, ob das Ergebnis passen kann.\n\nBeispiel: 119,90 € + 69,50 € ist ungefähr 120 € + 70 € = 190 €. Genau: 189,40 €.', 'Gute Werkstätten nennen den Preis vorher: Das heißt Kostenvoranschlag.'),
  N('Zylinder-Kit 169,90 € und Ritzel 12,50 €. Wie viel zusammen (in Euro)?', 182.4, '169,90 + 12,50 = 182,40.', {unit:'€', hint:'Komma unter Komma rechnen.'}),
  Q('Überschlag: 4,95 € + 9,90 € + 19,95 €. Was passt am besten?', 'etwa 35 €', ['etwa 25 €', 'etwa 45 €', 'etwa 55 €'], '5 + 10 + 20 = 35.'),
  N('Der Kunde gibt 450 €. Zylinder 169,90 € und Vergaser 79,90 €. Wie viel Budget bleibt (in Euro)?', 200.2, '169,90 + 79,90 = 249,80. 450 − 249,80 = 200,20.', {unit:'€'}),
  N('Eine Zündkerze kostet 3,40 €. Wie viel kosten 4 Stück (in Euro)?', 13.6, '4 · 3,40 = 13,60.', {unit:'€'}),
  N('Die Werkstatt arbeitet 1,5 Stunden und verlangt 40 € pro Stunde. Wie viel kostet die Arbeit (in Euro)?', 60, '1,5 · 40 = 60.', {unit:'€'}),
  Q('Welcher Satz ist ein guter Kostenvoranschlag?', 'Teile 249,80 €, Arbeit 60,00 €, zusammen 309,80 €', ['Wird schon nicht so teuer.', 'Zylinder teuer, Rest billig.', 'Ungefähr viel.'], 'Ein Voranschlag nennt Einzelposten und die Summe.')
]},
{id:'mathe-w2', subject:'mathe', theme:'simson', topic:'Verhältnisse', title:'Übersetzung am Ritzel', sub:'Zähne zählen, teilen, vergleichen', min:11,
 rlp:'Zahlen: Division, Verhältnisse; Größen: Geschwindigkeit; Gleichungen und Tabellen',
 steps:[
  W('Ritzel und Kettenrad', 'Die Kette verbindet das kleine **Ritzel** am Motor mit dem großen **Kettenrad** am Hinterrad. Die Übersetzung ist Zähne Kettenrad : Zähne Ritzel.\n\nBeispiel (Serie ca.): 34 : 15 = 2,27. Das Ritzel dreht sich 2,27-mal, bis sich das Rad einmal dreht.', 'Mehr Zähne am Ritzel: höhere Endgeschwindigkeit, aber weniger Durchzug am Berg.'),
  N('Kettenrad 34 Zähne, Ritzel 15 Zähne. Übersetzung auf 2 Stellen gerundet?', 2.27, '34 : 15 = 2,2667 und gerundet 2,27.', {hint:'Teile 34 durch 15.'}),
  Q('Du baust ein Ritzel mit 16 statt 15 Zähnen ein. Was passiert?', 'Höhere Endgeschwindigkeit, weniger Durchzug', ['Niedrigere Endgeschwindigkeit, mehr Durchzug', 'Nichts', 'Der Motor wird größer'], 'Weniger Übersetzung: das Rad dreht sich bei gleicher Drehzahl schneller.'),
  N('Das Hinterrad hat 1,7 m Umfang. In 10 Umdrehungen: wie viele Meter?', 17, '10 · 1,7 = 17.', {unit:'m'}),
  M('Wer ist schneller, wenn alles andere gleich bleibt?', [['Ritzel 14 Zähne', 'mehr Durchzug'], ['Ritzel 15 Zähne', 'Original'], ['Ritzel 17 Zähne', 'mehr Endgeschwindigkeit']], 'Ordne zu.'),
  N('60 km/h mit Ritzel 15. Mit 16 Zähnen wird die Geschwindigkeit im Verhältnis 16:15 größer. Wie viel km/h ungefähr (ganze Zahl)?', 64, '60 · 16 : 15 = 64.', {unit:'km/h'})
]},
{id:'mathe-w3', subject:'mathe', theme:'tuning', topic:'Daten & Diagramme', title:'Prüfstand-Kurve lesen', sub:'Leistungsdiagramm und Prozent', min:10,
 rlp:'Daten: Diagramme lesen, Prozentrechnung, Vergleichen',
 steps:[
  W('Das Leistungsdiagramm', 'Auf dem Prüfstand wird die Motorleistung gemessen. Die waagerechte Achse zeigt die **Drehzahl**, die senkrechte die **Leistung in PS**. Die Spitze der Kurve ist die Maximalleistung.\n\nProzent: 3,7 PS auf 5,6 PS ist ein Plus von 1,9 PS. 1,9 : 3,7 ≈ 0,51, also rund 51 %.', 'Ein breites Drehzahlband fährt sich im Alltag angenehmer als eine hohe, schmale Spitze.'),
  Q('Die Kurve steigt bis 6500 U/min und fällt dann. Wo liegt die höchste Leistung?', 'bei 6500 U/min', ['bei 0 U/min', 'bei 9000 U/min', 'überall gleich'], 'Der höchste Punkt der Kurve zeigt die Maximalleistung.'),
  N('Original 3,7 PS, getunt 5,55 PS. Wie viel PS mehr?', 1.85, '5,55 − 3,7 = 1,85.', {unit:'PS'}),
  N('1,85 PS mehr bei 3,7 PS. Wie viel Prozent sind das?', 50, '1,85 : 3,7 = 0,5 = 50 %.', {unit:'%'}),
  Q('Welcher Motor ist im Alltag angenehmer?', 'Mittlere Leistung über ein breites Drehzahlband', ['Hohe Spitze nur bei 9000 U/min', 'Nur Leerlauf', 'Immer die größte Düse'], 'Wer ständig hohe Drehzahl braucht, muss oft schalten und der Motor ist anstrengend.'),
  TF('Blitzrunde Prüfstand', [['Die x-Achse zeigt hier die Drehzahl.', true, ''], ['Die Leistung wird in Litern gemessen.', false, 'Leistung wird in PS oder kW gemessen.'], ['1 PS sind etwa 0,74 kW.', true, ''], ['Mehr Leistung heißt immer mehr Durchzug.', false, 'Auch das Drehzahlband und das Drehmoment zählen.']])
]},
{id:'deutsch-w1', subject:'deutsch', theme:'simson', topic:'Vorgangsbeschreibung', title:'Anleitung wie vom Profi', sub:'Reihenfolge, Signalwörter, Präsens', min:12,
 rlp:'Schreiben: Vorgangsbeschreibung, Anleitung; Sprache: Satzbau, Signalwörter',
 steps:[
  W('So schreibt man eine Anleitung', 'Eine Anleitung sagt genau, **was zuerst** und **was danach** gemacht wird. Sie steht im **Präsens**, jeder Schritt ist ein kurzer Satz. Signalwörter: zuerst, dann, danach, anschließend, zum Schluss.\n\nBeispiel: „Zuerst löst du die Zündkerze. Dann hebst du den Zylinderkopf ab.“', 'Wichtig für Sicherheit: Immer zuerst den Motor ausschalten und abkühlen lassen.'),
  O('Zylinder ausbauen (Reihenfolge)', ['Zündkerze lösen', 'Zylinderkopf abschrauben', 'Zylinder nach oben abziehen', 'Kolben vom Pleuel nehmen'], 'Bringe die Arbeitsschritte in die richtige Reihenfolge.'),
  GAP('Signalwörter', '{Zuerst} stellst du den Motor aus. {Danach|Dann} lässt du ihn abkühlen. {Zum Schluss} prüfst du, ob alle Schrauben fest sind.', ['Gestern', 'Vielleicht']),
  Q('Welcher Satz passt in eine Anleitung?', 'Schraube die Zündkerze vorsichtig heraus.', ['Die Zündkerze war schön.', 'Hoffentlich geht alles gut.', 'Ich fand das Werkzeug toll.'], 'Anleitungen sind sachlich, genau und kurz.'),
  T('Schreibe ein Signalwort für den ersten Schritt einer Anleitung (ein Wort).', ['zuerst', 'erstens', 'als erstes', 'zunächst'], 'Zum Beispiel: zuerst, zunächst.', {}),
  X('Erkläre mündlich in 4 Sätzen: Wie wechselst du eine Zündkerze? Benutze Signalwörter.', 'Tipp: „Zuerst … danach … dann … zum Schluss …“', 60)
]},
{id:'deutsch-w2', subject:'deutsch', theme:'tuning', topic:'Brief', title:'Brief an den Teilehändler', sub:'Anfrage höflich und genau', min:10,
 rlp:'Schreiben: Briefe, Anrede, Adressat und Zweck',
 steps:[
  W('Ein sachlicher Brief', 'Ein Brief an einen Händler hat **Betreff**, **Anrede** (Sehr geehrte Damen und Herren), einen klaren Text und **Gruß** (Mit freundlichen Grüßen).\n\nNenne Fahrzeug, Teil und Frage genau. So kann der Händler schnell antworten.', 'Wer die Teilenummer und das Baujahr nennt, bekommt meist das richtige Teil.'),
  O('Reihenfolge im Brief', ['Betreff', 'Anrede', 'Text mit Frage', 'Gruß', 'Name'], 'Von oben nach unten.'),
  Q('Welche Anrede passt zu einem Händler, den du nicht kennst?', 'Sehr geehrte Damen und Herren,', ['Hi Leute,', 'Hallo Alter,', 'Liebe Mama,'], 'Fremden Erwachsenen schreibst du höflich.'),
  Q('Welcher Betreff ist am besten?', 'Anfrage: 70-ccm-Zylinder für Simson S51', ['Hilfe!!!', 'Teil', 'Frage'], 'Der Betreff nennt Thema und Fahrzeug.'),
  GAP('Höflich formulieren', 'Ich {möchte} einen Zylinder bestellen. Können Sie mir {bitte} den Preis nennen? Vielen {Dank} im Voraus.', ['Gib', 'Sofort']),
  T('Schreibe den Gruß am Briefende (zwei Wörter, mit Ausrufezeichen oder Komma egal): Mit freundlichen ...', ['grüßen', 'Grüßen'], 'Mit freundlichen Grüßen.', {})
]},
{id:'deutsch-w3', subject:'deutsch', theme:'simson', topic:'Wortbildung', title:'Fachwörter bauen', sub:'Zusammengesetzte Nomen und Großschreibung', min:9,
 rlp:'Sprache: Wortbildung, Nomen und Großschreibung',
 steps:[
  W('Lange Wörter, klare Regel', 'Im Deutschen setzt man Wörter zusammen. **Das letzte Wort bestimmt den Artikel**: der Zylinder + der Kopf = **der** Zylinderkopf. Nomen schreibt man groß.\n\nBeispiele: Zylinderkopfdichtung, Kurbelwellenlager, Vergaserdüse.', 'Mechaniker lieben solche Wörter, weil sie genau beschreiben.'),
  Q('Welcher Artikel passt: ___ Vergaserdüse?', 'die', ['der', 'das', 'den'], 'Das letzte Wort ist Düse: die Düse.'),
  Q('Welcher Artikel passt: ___ Auspuffkrümmer?', 'der', ['die', 'das', 'dem'], 'Das letzte Wort ist Krümmer: der Krümmer.'),
  M('Welches Wort wird daraus?', [['Zünd + Kerze', 'Zündkerze'], ['Kolben + Ring', 'Kolbenring'], ['Luft + Filter', 'Luftfilter'], ['Kurbel + Welle', 'Kurbelwelle']], 'Setze zusammen.'),
  TF('Groß oder klein?', [['Man schreibt Zylinderkopf groß.', true, 'Nomen werden großgeschrieben.'], ['Man schreibt „das schrauben“ immer klein.', false, '„Das Schrauben“ ist ein Nomen und wird großgeschrieben.']]),
  T('Setze zusammen: Hinterrad + Reifen = ?', ['Hinterradreifen'], 'Hinterradreifen: ein Wort.', {})
]},
{id:'englisch-w1', subject:'englisch', theme:'tuning', topic:'Wortschatz', title:'Parts and Tools', sub:'Teile und Werkzeug auf Englisch', min:10,
 rlp:'Wortschatz: Fahrzeuge, Technik; Kommunikative Kompetenz',
 steps:[
  W('English in the workshop', 'Viele Teile haben englische Namen, besonders in Katalogen und Videos.\n\ncylinder = Zylinder · piston = Kolben · carburettor = Vergaser · exhaust = Auspuff · spark plug = Zündkerze · crankshaft = Kurbelwelle · chain = Kette · sprocket = Ritzel.', 'Tuningteile werden oft aus dem Ausland bestellt. Dann hilft Englisch.'),
  M('Teile-Quiz', [['Zylinder', 'cylinder'], ['Kolben', 'piston'], ['Vergaser', 'carburettor'], ['Auspuff', 'exhaust'], ['Zündkerze', 'spark plug'], ['Kette', 'chain']], 'Ordne die englischen Wörter zu.'),
  T('Wie heißt „Kurbelwelle“ auf Englisch? (crank...)', ['crankshaft'], 'Crankshaft.', {}),
  Q('Which tool do you use for a spark plug?', 'a plug spanner', ['a hammer', 'a paintbrush', 'a ruler'], 'Spark plugs are removed with a plug spanner (US: wrench).'),
  Q('„Tighten the screw“ bedeutet:', 'Die Schraube festziehen', ['Die Schraube lösen', 'Die Schraube kaufen', 'Die Schraube malen'], 'Tighten = festziehen, loosen = lösen.'),
  T('Wie heißt „Werkzeug“ auf Englisch? (ein Wort, plural: ...)', ['tool', 'tools'], 'Tool, plural tools.', {})
]},
{id:'englisch-w2', subject:'englisch', theme:'tuning', topic:'Dialog', title:'At the Parts Shop', sub:'Preise erfragen und bestellen', min:10,
 rlp:'Sprechen und Schreiben: Einkaufsgespräch, Zahlen, Preise',
 steps:[
  W('Ask for a part', 'Nützliche Sätze:\n**Do you have a 70 cc cylinder for a Simson S51?**\n**How much is it?** – It is 169 euros.\n**I would like to order two spark plugs.**\n**Can I pay by card?**', 'Mit „Please“ und „Thank you“ klingt jeder Satz freundlicher.'),
  O('Gespräch ordnen', ['Hello, can I help you?', 'Do you have a 19 mm carburettor?', 'Yes, it is 79 euros.', 'I would like to take it, please.', 'Thank you. Goodbye!'], 'Bringe den Dialog in die richtige Reihenfolge.'),
  Q('„How much is it?“ bedeutet:', 'Was kostet das?', ['Wie alt ist es?', 'Wie groß ist es?', 'Wo ist es?'], 'How much = wie viel.'),
  T('Schreibe die Zahl als Wort: 79 (seventy-...)', ['seventy-nine', 'seventy nine'], 'Seventy-nine.', {}),
  Q('Wie bittest du höflich um eine Zündkerze?', 'I would like a spark plug, please.', ['Give spark plug now.', 'Spark plug!', 'Me spark plug.'], 'I would like … please ist höflich.'),
  X('Sprich laut auf Englisch: „Do you have a 19 mm carburettor? How much is it?“ Dann ein eigener Satz zum Bestellen.', 'Tipp: Langsam und deutlich sprechen. Fehler sind erlaubt.', 45)
]},
{id:'englisch-w3', subject:'englisch', theme:'simson', topic:'Imperativ', title:'Workshop Instructions', sub:'Anleitungen auf Englisch', min:9,
 rlp:'Grammatik: Imperativ, Reihenfolge-Wörter',
 steps:[
  W('Befehlsform', 'Auf Englisch benutzt man in Anleitungen die Grundform ohne „you“.\n**First, remove the spark plug. Then, loosen the cylinder head. Finally, tighten the nuts.**\nVerneinung: **Do not touch the hot engine!**', 'Warnschilder sind oft kurz: Danger! Hot surface!'),
  O('Steps in order', ['First, switch off the engine.', 'Then, let it cool down.', 'Next, remove the exhaust.', 'Finally, clean the parts.'], 'Ordne die Schritte.'),
  Q('„Do not touch the hot engine!“ heißt:', 'Berühre den heißen Motor nicht!', ['Berühre den Motor!', 'Der Motor ist neu.', 'Starte den Motor!'], 'Do not = nicht.'),
  GAP('Fill in', '{First}, remove the spark plug. {Then}, clean it. {Finally}, put it back.', ['Never', 'Because']),
  T('Wie heißt „abkühlen lassen“ im Satz „Let it cool ...“? (ein Wort)', ['down'], 'Let it cool down.', {})
]},
{id:'nawi-w1', subject:'nawi', theme:'simson', topic:'Zweitakt', title:'Zweitakt: zwei Takte, ein Knall', sub:'Takte, Gemisch und Spülung', min:12,
 rlp:'Physik/Chemie: Energie, Wärme, Verbrennung; Technik: Motoren',
 steps:[
  W('Der Zweitaktmotor', 'Beim Zweitakter gibt es zwei Takte pro Umdrehung: **1. Verdichten (oben) und gleichzeitig Ansaugen unten, 2. Arbeiten (Zünden, Kolben geht nach unten) und Ausstoßen**.\n\nDas Öl kommt mit im Benzin (Gemisch 1:50). Es schmiert Kolben und Lager.', 'Ein Viertakter braucht vier Takte, der Zweitakter nur zwei. Deshalb hat er bei gleichem Hubraum oft mehr Leistung, aber auch mehr Abgas.'),
  Q('Wie viele Kolbenhübe hat ein Arbeitsspiel beim Zweitakter?', '2', ['1', '4', '8'], 'Einmal hoch, einmal runter.'),
  Q('Wozu ist Öl im Benzin?', 'Es schmiert Kolben und Lager.', ['Es macht den Motor größer.', 'Es kühlt den Auspuff.', 'Es färbt den Rauch.'], 'Beim Zweitakter gibt es keinen eigenen Ölkreislauf.'),
  N('Mischung 1:50. Du tankst 5 Liter Benzin. Wie viele Milliliter Öl brauchst du?', 100, '5 Liter = 5000 ml. 5000 : 50 = 100 ml.', {unit:'ml'}),
  O('Der Weg des Gemischs', ['Vergaser', 'Kurbelgehäuse', 'Überströmkanal', 'Brennraum', 'Auspuff'], 'Tippe die Stationen in der richtigen Reihenfolge an.'),
  Q('Was ist „Spülen“?', 'Frisches Gemisch drückt Abgas aus dem Zylinder.', ['Reinigen mit Wasser', 'Tanken', 'Ölwechsel'], 'Beim Zweitakter geschieht das durch Überströmkanäle.')
]},
{id:'nawi-w2', subject:'nawi', theme:'tuning', topic:'Wärme', title:'Kühlrippen und Hitze', sub:'Wärmeleitung und Fläche', min:10,
 rlp:'Physik: Wärme, Wärmeleitung, Wärmeübertragung',
 steps:[
  W('Warum hat der Zylinder Rippen?', 'Im Motor entsteht Wärme. Sie muss weg, sonst klemmt der Kolben. Bei der Simson kühlt die Luft (Fahrtwind und Lüfter). Kühlrippen vergrößern die **Oberfläche**, so gibt der Zylinder mehr Wärme an die Luft ab.\n\nAluminium leitet Wärme besser als Gusseisen.', 'Tuning-Zylinder sind oft aus Aluminium mit besonders gutem Wärmeübergang.'),
  Q('Was bringen mehr Rippen?', 'Mehr Fläche, also bessere Kühlung', ['Mehr Gewicht, weniger Kühlung', 'Mehr Gemisch', 'Lauterer Motor'], 'Mehr Oberfläche gibt mehr Wärme ab.'),
  Q('Welches Material leitet Wärme besser?', 'Aluminium', ['Gusseisen', 'Gummi', 'Holz'], 'Metalle leiten gut, Aluminium sehr gut.'),
  M('Wärmeübertragung', [['Heißer Zylinder berührt kalte Rippe', 'Wärmeleitung'], ['Fahrtwind streicht über Rippen', 'Strömung'], ['Glühendes Metall strahlt', 'Wärmestrahlung']], 'Ordne zu.'),
  Q('Was passiert bei zu magerem Gemisch?', 'Der Motor wird zu heiß: Kolbenklemmer-Gefahr', ['Er wird kälter', 'Nichts', 'Er braucht weniger Luft'], 'Wenig Benzin kühlt weniger.'),
  TF('Blitzrunde Wärme', [['Metalle leiten Wärme gut.', true, ''], ['Rippen verkleinern die Oberfläche.', false, 'Sie vergrößern sie.'], ['Fahrtwind kühlt den Motor.', true, '']])
]},
{id:'nawi-w3', subject:'nawi', theme:'tuning', topic:'Schall', title:'Resonanz: Welle im Auspuff', sub:'Schwingungen und Druckwellen', min:10,
 rlp:'Physik: Schall, Schwingungen, Wellen',
 steps:[
  W('Der Resonanzauspuff', 'Beim Ausstoßen entsteht eine **Druckwelle** im Auspuff. Ein Resonanzauspuff hat Kegel und Bauch. Die Welle wird zurückgeworfen und **schiebt frisches Gemisch zurück** in den Brennraum, genau zur richtigen Zeit.\n\nDas klappt nur in einem engen Drehzahlbereich. Darum heißt das Tuning „Leistung bei hoher Drehzahl, aber schmales Band“.', 'Schall ist eine Welle aus Druck, die sich in Luft ausbreitet.'),
  Q('Was ist eine Druckwelle?', 'Abwechselnd hoher und niedriger Luftdruck', ['Ein Funke', 'Ein Zahnrad', 'Eine Kette'], 'Schall besteht aus Druckschwankungen.'),
  Q('Wann wirkt der Resonanzauspuff am besten?', 'In einem engen Drehzahlbereich', ['Immer gleich gut', 'Nur im Stand', 'Nur im Winter'], 'Die Welle muss zum richtigen Zeitpunkt zurückkommen.'),
  Q('Wozu dient der Schalldämpfer?', 'Er verringert den Lärm.', ['Er macht Gas.', 'Er kühlt die Kette.', 'Er speichert Benzin.'], 'Er bremst und streut die Schallwellen.'),
  Q('Warum ist ein offener Auspuff auf der Straße verboten?', 'Zu laut und nicht zugelassen', ['Zu schwer', 'Zu rund', 'Zu blau'], 'Lärm belastet Menschen und Tiere. Nur geprüfte Teile sind erlaubt.')
]},
{id:'nawi-w4', subject:'nawi', theme:'simson', topic:'Umwelt', title:'Abgas, Lärm, Regeln', sub:'Was Tuning auf der Straße bedeutet', min:9,
 rlp:'Biologie/Chemie: Umwelt, Verbrennung; Gesellschaft: Regeln',
 steps:[
  W('Fahren nur mit Erlaubnis', 'Eine Simson mit 50 cm³ darf mit Prüfziffer 45 km/h oder (DDR-Typ) bis 60 km/h fahren, abhängig von Zulassung und Führerschein. **Jede Änderung an Zylinder, Auspuff oder Zündung** kann die **Betriebserlaubnis** erlöschen lassen.\n\nTuning ist okay auf dem Gelände, Prüfstand und mit Prüfung. Auf der Straße zählt, was in den Papieren steht.', 'Die Regeln schützen dich, andere Verkehrsteilnehmer und die Umwelt.'),
  Q('Was ist die Betriebserlaubnis?', 'Die Erlaubnis, dass das Fahrzeug so im Verkehr fahren darf', ['Ein Werkzeugkasten', 'Eine Tankquittung', 'Ein Poster'], 'Sie steht in den Fahrzeugpapieren.'),
  Q('Was passiert, wenn du ohne Eintragung tunst und fährst?', 'Die Erlaubnis kann erlöschen, das ist gefährlich und teuer.', ['Nichts', 'Man bekommt einen Preis', 'Das Moped wird größer'], 'Auch der Versicherungsschutz kann entfallen.'),
  Q('Welches Abgas entsteht bei der Verbrennung unter anderem?', 'Kohlenstoffdioxid', ['Helium', 'Sauerstoff pur', 'Wasserstoff pur'], 'Benzin verbrennt mit Sauerstoff zu CO2 und Wasser.'),
  X('Argumentiere: Warum sind Regeln beim Tuning sinnvoll? Zwei Gründe.', 'Tipp: „Ich finde …, weil …“', 45)
]}
);
