# Baustand V2.0 (Stand nach Querformat-Fix)

## Erledigt
- Querformat-Fix: Querlayout nur bei landscape + max-height 520 px und nur in Zerlegen, Einbauen, Prüfstand (Klasse body.land, gesetzt in render()). Sonst Hochformat-Spalte, max. 480 px, auf Desktop mittig; Kopfzeile und Navigation ebenfalls max. 480 px. Im Querformat ist die Navigation ausgeblendet, Abstände kompakt. Manifest: orientation portrait. "Handy drehen" nur in Zerlegen/Einbauen/Prüfstand und nicht auf Desktop.
- shot.sh erzeugt jetzt <name>.png (390x844), <name>-quer.png (844x390), <name>-desk.png (1280x800).

## Offen (Stand vor diesem Paket, Punkte 1, 2 und 6 sind jetzt erledigt, siehe unten)
1. Klapprad (8. Modell): Entwurf. Eintrag V2V.klapp und V2ORDER in werkstatt2.js (wegen der Bereinigung alter Spielstände dort, nicht in einer Extra-Datei). Neue Datei klapprad.js mit eigenen Teilen (Kettenblatt 38/44/50, Ritzel 14/16/18, Reifen schmal/original/breit, Licht Glühlampe/LED/Akku, Klingel/Hupe, Gepäck, Reflektoren/Wimpel, Motor-Bausatz Pedelec 250 W / Verbrenner mit Legalitätshinweis, Tacho), Leistungsmodell Muskel-Watt über Trittfrequenz mit Widerstand (Rollwiderstand, Luftwiderstand), echte Rechnung Trittfrequenz zu km/h (Radumfang 1,55 m), Reifendruck statt Hauptdüse, Verzweigungen in w2View, w2Select, w2Free, w2Run, w2Tap, w2Mission, w2Build, w2Dyno, w2Cert, w2Drive, car(), gauge-Skala, Studio-Texte (W statt PS), svgBike-Fallback für ki/klapprad.jpg.
2. Garage-Design in B-Blau mit ki/garage-<name>.jpg (Zuordnung in img/ki/PRUEFUNG.md), alte Bilder als Fallback.
3. Mindestens 10 neue interaktive Simson-Missionen (Fehlersuche, Drag-and-drop, Schieberegler, Zeitdruck, Story-Kunden, Tagesauftrag, Bilderquiz).
4. Garage-Fahrzeuge (Unimog, Traktor, Rasentraktor u. a.): je mindestens 3 interaktive Missionen, B-Blau.
5. (erledigt in Paket 5) Animationen: Tastendruck-Effekt mit navigator.vibrate, Rolltor/Schiebetor-Übergänge, Hebebühne, Werkzeug-Animationen, Münzen und Konfetti, Ladeanimation, prefers-reduced-motion, Ausgabe nach v2/shots/anim/.
6. v2/FAKTENCHECK.md lesen und als "falsch" markierte Stellen korrigieren (Datei lag beim letzten Blick nicht vor).


## Stand Paket Klapprad + Garage + Freischalten (16.11.)
Gesichert vor Änderung in v2/alt/: werkstatt2.vor-klapprad.js, fx.vor-klapprad.js, index.vor-klapprad.html, theme.vor-klapprad.css, c-v2.vor-fakten.js, studio.vor-fakten.js (plus v1-Kopien garage-v1/app-v1).

### 1. Klapprad (8. Modell, v2/klapprad.js)
- Mifa-Klappfahrrad (DDR, ab 1967 bis 1990, 20 Zoll, ca. 15 kg laut Museumsangabe zu einem Rad von 1973; Modelle 901/903/904). Quellen: Websuche (museum-digital, Übersichtsseiten). Nicht belegt, daher Spielwerte: Zähnezahl 44/16, Reifenbreite, Preise.
- Teile: Reifen (schmal/original/breit), Kettenblatt 38/44/50, Ritzel 14/16/18, Licht (Dynamo/LED-Akku/LED am Dynamo), Klingel/Hupe (Hupe als nicht straßenerlaubt markiert), Gepäck (Träger/Box), Reflektoren/Wimpel/Tacho, Hilfsmotor (Pedelec 250 W mit Abschaltung bei 25 km/h, Verbrenner 50 cm³ mit Legalitätshinweis Mofa/Betriebserlaubnis/ab 15 Jahren).
- Muskel-Prüfstand: Physik mit Rollwiderstand, Luftwiderstand, Kettenwirkungsgrad 0,96, Fahrer 60 kg, Dauerleistung 100 W mit Trittfrequenz-Kurve; Kurve Watt über km/h, Regler Trittfrequenz, Reifendruck statt Hauptdüse, Dynamo-Verlust schaltbar. Höchsttempo Serie ca. 20 km/h.
- Rechnung Trittfrequenz zu km/h: v = Trittfrequenz · (Kettenblatt : Ritzel) · Radumfang. Aufgaben zu Übersetzung, Hebel (Drehmoment, Kettenzugkraft aus Teilkreisradius), Dynamo und Strom (P = U · I, Wh, Verlust in Prozent), Prozent, Luftwiderstand ~ v³, Recht.
- Einhängen: nur ein Eintrag V2V.klapp, V2ORDER, KORIG und car()-Vorgabe in werkstatt2.js; alle Klapprad-Ansichten laufen über Hooks in klapprad.js (andere Modelle unverändert). Bild: ki/klapprad.jpg über die Manifest-Liste, Fallback ist die SVG-Zeichnung svgKlapp (in fx.js eingehängt). Fertige Klappräder stehen in W2.kb (nicht in der Moped-Galerie, weil Studio auf PS und cm³ ausgelegt ist: Studio für das Klapprad offen).
- Standalone-Missionen im Lernen-Tab für das Klapprad: offen.

### 2. Garage (v2/garage2.js, Regeln in theme.css)
- Rolltor-Kopf, 2-spaltige Karten mit Rahmen und Lichtkegel, gesperrte Fahrzeuge grau mit Punktebalken, Fahrzeugseite mit Rahmen. Bilder: v2/img/ki/garage-<name>.jpg (rasentraktor, zt300, traktor-anhaenger, e512, unimog, feldhaecksler), für S51/SR50/Schwalbe v2/img/ki/s51|sr50|schwalbe.jpg, sonst alte Bilder, sonst Emoji (onerror-Kette). Garage-Bilder kommen laut PRUEFUNG.md erst am 17.11.
- v2/img/manifest.js mit bilder-aktualisieren.sh neu erzeugt (enthält jetzt star, duo, habicht, s50, zuendung).

### 3. Freischalten durch Lernen (v2/freischalten.js, Pflicht-Regel)
- Vorher: Budget fest 450 €, keine Sperren bei Teilen und Modellen (nur Garage-Fahrzeuge per Punkte). Jetzt: Budget = 150 € + 10 € je absolvierter Mission (höchstens 600 €), BUDGET ist dafür `let`.
- Teile (Moped und Klapprad) sind gesperrt, bis Missionen in einem Fach geschafft sind (Tabelle LK), Anzeige z. B. „Noch 2 Mathe-Missionen bis 60er Alu-Zylinder“. Modelle: S50 4, Habicht 6, Star 8, Duo 10 Missionen insgesamt; Klapprad 2 Mathe plus 1 NaWi. Gesperrte Wahl wird beim Zeichnen auf Original zurückgesetzt, Klick zeigt Hinweis.
- Offen: Werkzeuge und Werkstatt-Stufen sind noch nicht gesperrt (Rang Azubi bis Werkstattmeister hängt an Aufträgen, nicht direkt an Lernen).

### 6. Faktencheck (aus FAKTENCHECK.md)
- Duo ohne „SR4-3“ (das ist der Sperber), Schwalbe KR51/2 ca. 1980–1986 (Reihe ab 1964), Klapprad-Steckbrief ohne 49,9 cm³, 60er Zylinder „ca. 61 cm³“ (70er ca. 70, 85er ca. 86), S51-Kettenrad 34 Zähne (Websuche: 15/34) in Teilen und Mathe-Mission mathe-w2, Steckbrief als „ca.“, Düsen als Schätzung. In c-technik.js bleibt die Übung „Kettenrad wird auf 32 Zähne gewechselt“, weil sie ausdrücklich einen Wechsel beschreibt.

### Tests
- v2/ctest.sh <shot> ... prüft die Konsole (leere Ausgabe = 0 Fehler); alle neuen Ansichten 0 Fehler. Neue Shot-Namen: klsel, klauftrag, kldis, klshop, klasm, kldyno, klcert, kltask, kltask5, klpr.

## Pakete 3, 3b, 4: Interaktive Missionen (Schrauberschule v3.0)
- Neue Dateien: missionen2.js (Engine: Schritttypen fehler, drag, regler, kunde, blitz, bild; Werkzeugwand TOOLS, Stufen STUFEN, Tagesauftrag mit Belohnung, Hub-Ansicht `go('hub')`), missionen2-daten.js (Simson: Fehlersuche x2, Ziehen x2, Regler x2), missionen2-daten2.js (Kunde x2, Bilderquiz x2, Blitzrunde, Tagesaufträge sim-tag-a/b/c), missionen2-fahrzeuge.js (je 3 Missionen für g2, g3, g4, g5, g7, g8 = 18), missionen2-shot.js (Screenshot-Hook).
- Screenshot-Namen: mhub, mhome, mveh_g3, mx_<missions-id mit _>_<Schritt> (z. B. mx_sim_fehler_1_1, mx_v_g7_2_1). Konsole: v2/ctest.sh, 0 Fehler bei den geprüften Namen.
- Freischalten nur durch Lernen: Werkzeuge und Werkstatt-Stufen (Azubi, Geselle 6, Tuner 14 + 1 Auftrag, Werkstattmeister 28 + 3 Aufträge) hängen an erledigten Missionen, sichtbarer Hinweistext im Hub und in der Mission; Fahrzeugmissionen an Garage-Punkte.
- 3b: Mission-des-Tages-Karte im neuen Stil (mdt), Klapprad-Einbau: Rad-Geisterkreise passen, Beschriftung "Reflektoren" läuft nicht mehr über.
- Backups: v2/alt/*.vor-missionen*, *.vor-feinschliff.*, werkstatt2.vor-mdtguard.js, index.vor-missionen-*.html.
- Offen: Ziehen mit echtem Touch nur per Pointer-Events geprüft (kein Gerät), Durchspielen aller Schritte (Erfolgspfad) noch nicht automatisiert; Zahlen sind ca.-Spielwerte; Bildquiz nutzt SVG statt Fotos.

## Paket 5: Animationen und Bedienfeeling (Schrauberschule v3.0, 16.11.)
- Neue Dateien: anim.css, anim.js (in index.html nach missionen2-shot.js bzw. nach theme.css eingebunden). Geändert: fx.js (der alte Klick-Ton für .btn ist jetzt in anim.js), shot.sh und ctest.sh (optionale Variable CHX). Backups in v2/alt/: index.vor-anim.html, fx.vor-anim.js, theme.vor-anim.css, shot.vor-anim.sh, ctest.vor-anim.sh.
- Buttons: Drück-Effekt (scale .955, nach unten, Innenschatten) per :active und Klasse .prs (für iOS), kurzer Klick-Ton (FX.tick, folgt dem Ton-Schalter), navigator.vibrate(8) wo vorhanden (iPhone-Safari kennt es nicht).
- Bildschirmwechsel: go() ist umhüllt. View Transitions API (startViewTransition), Richtung vorwärts/zurück nach Tab-Reihenfolge und Tiefe (Tab zu Unterseite = vorwärts). Fallback: Klasse pgf/pgb auf #app (transform/opacity). Tab-Leiste bleibt stehen (view-transition-name).
- Rolltor: beim Wechsel in die Werkstatt (go('w2') von woanders) fährt ein Rolltor mit Lamellen, Warnstreifen und Schriftzug hoch, 1,25 s, mit Rollgeräusch (Web Audio: Brummen, Lamellen-Ticks, Klack).
- Hebebühne: in Zerlegen und Einbauen wird die Szene (Motor und Teile) auf eine Hebebühne gesetzt (Plattform, Kolbenstange), fährt beim Betreten hoch (Hydraulik-Ton), bleibt beim Schrauben oben und fährt nach dem letzten Teil wieder runter. Umsetzung per MutationObserver auf #app (die Szene wird bei jedem Tippen neu gezeichnet), werkstatt2.js unverändert.
- Werkzeug: beim Aus-/Einbau dreht ein Schlüssel 🔧 über dem Teil (w2Tap umhüllt, nur wenn das Teil antippbar ist).
- Münzen: nach finish() fliegen bis zu 10 Taler-Münzen zu einem Zähler oben rechts (Pill mit hochzählender Zahl, Münzton). Zähler ist eine Einblendung, kein fester Taler-Zähler in der Kopfzeile (der existiert nur in Hub und Garage als Chip).
- Konfetti: bestehendes confetti() bei Mission geschafft; neu bei Abnahme (Zertifikat) und bei Freischalten (finish vergleicht gesperrte Teile/Modelle vorher/nachher, Hinweis "Neu freigeschaltet").
- Lade-Animation: drehendes Ritzel (UI.loader), hängt an render2() im Studio (erscheint erst, wenn die Bildberechnung länger als 200 ms dauert).
- prefers-reduced-motion: Rolltor, Übergänge, Werkzeug, Münzen-Flug, Hebebühnenfahrt (Endzustand sofort) aus; Buttons nur Helligkeit; Ritzel dreht langsam. HINWEIS: Dieser Mac hat "Bewegung reduzieren" an (headless Chrome meldet reduce). Für Animations-Screenshots: CHX=--force-prefers-no-reduced-motion ./v2/shot.sh animrolltor ...
- Screenshots (v2/shots/, Hochformat plus -quer/-desk): animrolltor, animbuehne, animkonfetti, animlader, animmuenzen (animmuenzen-direkt.png zeigt die fliegenden Münzen). Das sind Standbilder aus Test-Hooks (#shot=anim...), keine Videos. Zusätzlicher Hook animgo prüft go()-Ablauf (Rolltor erscheint, Ende auf Home).
- Tests: ctest.sh 0 Fehler bei home, sel, dis, asm, cert, mhub, garage, missions, animgo, animbuehne (mit Ton an erscheinen nur Chrome-Hinweise "AudioContext was not allowed to start" als INFO, weil headless keine Geste hat).
- Nicht geprüft: Gefühl und Flüssigkeit auf echtem iPhone (60 fps, Safari-View-Transitions erst ab iOS 18, sonst Fallback), echte Töne und Lautstärke, Haptik (vibrate gibt es auf iOS nicht), Konfetti bei Abnahme/Freischalten im echten Durchlauf, Studio-Ladeanimation im echten Export.

## Paket 6: Licht, Schatten, Metall (Schrauberschule v3.0, 16.11.)
- Nur Ergänzungen am Ende von anim.css und anim.js (Backups: alt/anim.vor-anim2.css, alt/anim.vor-anim2.js). Zwei kleine Änderungen im alten Teil von anim.js: Hebebühnen-SVG (Stahl-Verlauf, Glanzkante, Kolbenstange mit Ölglanz, Bodenschatten) und Funkel-Aufruf bei Münzen.
- Rolltor: gebürstetes Blech (Quer- und Längsstruktur, Glanzband), Lamellen mit Schattenkante, Schattenwurf unter dem Tor, 4 schräge Lichtstreifen von draußen und 16 Staubpartikel im Lichtkegel (Overlay .lf, nur opacity/transform), erscheint beim Wechsel nach Werkstatt.
- Deckenlicht (Overlay .amb, nur in der Werkstatt): zwei Neonröhren flackern 3-mal an, danach warmer Lichtkegel, Vignette, Boden-Glanzstreifen (Epoxid), Werkzeugwand-Silhouette (sehr dezent oben).
- Hebebühne: Bodenschatten als zwei Ellipsen (scharf blendet aus, weich/groß/heller blendet ein), Nachfedern per cubic-bezier mit Überschwingen (1,4 s), Ölglanz pulsiert.
- Teile: Kontaktschatten (drop-shadow) auf .bp, beim Einbauen fällt ein Schatten mit Aufprall (.imp); Schlüssel mit wanderndem Glanz.
- Münzen: konischer Metallverlauf, Prägering, Glanz, Schatten, drehende Prägung, Funkeln am Zähler (.spk).
- Buttons (.btn): Lichtreflex oben, weicher Schlagschatten; beim Drücken bleibt der kleine Innenschatten (alter Paket-5-Effekt).
- prefers-reduced-motion: Lichtstreifen, Staub, Aufprall, Glanzläufer und Funkeln aus; Neon, Kegel und Bühne stehen im Endzustand.
- Screenshots (CHX=--force-prefers-no-reduced-motion ./v2/shot.sh ...): anim2-rolltor, anim2-licht, anim2-buehne, anim2-muenzen (Standbilder aus Hooks #shot=anim2-...). ctest.sh: 0 Fehler bei diesen vier sowie home, w2.
- Nicht geprüft: Flüssigkeit auf echtem iPhone. Neonröhren am oberen Rand sind im Standbild kaum sichtbar (Kopfzeile). Name, Version und Fakten unverändert.

## Paket 7: Rolltor, Prüfstand, Motorklang
- Neu: pruefstand.js, pruefstand.css, pruefstand-ton.js; geändert: anim.js, anim.css, freischalten.js (resetAll löscht Flag ss_tor_gesehen), index.html. Sicherungen: alt/*.vor-pst.*.
- Rolltor nur beim ersten Werkstatt-Besuch, physikalisches Profil, Lamellen wickeln auf, Motor/Kette-Ton.
- Prüfstand: Seitenansicht-SVG für alle 8 Fahrzeuge, Rolle/Hinterrad synchron, Rauch, Gebläse, Messrechner; Glücksrad entfernt; Klapprad als Muskel-Prüfstand.
- Ton: Web-Audio-Synthese, Tuningteile ändern den Klang, Bediengeräusche; Details in PRUEFSTAND-RECHERCHE.md.
- Shots: pst-s51, pst-schwalbe, pst-klapprad, tor-neu, sound-vergleich. ctest.sh: 0 Fehler (pst-*, tor-neu, home, w2, mhub).
- Offen: Echtgerät-Test (iPhone), Gehörtest, Harmonische bei hoher Drehzahl, übrige 5 Fahrzeuge nur teilweise visuell geprüft, Bediengeräusche nicht gegen Aufnahmen verglichen.

## Paket 7 Nachbesserung
- Messrechner: ein Modell je Fahrzeug+Tuning (`modelOf` in pruefstand.js): P(r) mit Maximum exakt bei p.peak/p.ps, M = P·7023,6/r (PS = Nm·U/min/7023,6; 7121 gilt für HP, nicht PS). Live-Anzeige, Kurve und Ergebnis lesen nur dieses Modell; Live-Punkt liegt auf der Kurve, Spitzenwert wird exakt getroffen, Drehzahl ≤ Abregeldrehzahl (pk+1900, max. 10200), nach dem Lauf zeigt das Display "PS max"/"Nm max". Klapprad: Kurve ab Anrollen, Live ≤ Kurvenmaximum.
- Werte (werkstatt2.js): S51/SR50/KR51 ca. 3,0 PS (2,2 kW), Nenndrehzahl ca. 5500; S50 2,8; Habicht 2,6 (Spielwerte, ca.). Die Lernaufgaben in c-v2.js rechnen weiter mit "3,7 PS" als Beispielzahl (nicht geändert).
- Test: `./v2/pst-test.sh` (Hook #shot=pst-test) prüft 8 Modelle x 5 Tunings x 2 Düsen (+4 Klapprad-Varianten): Live-Max == Ergebnis == Kurven-Max == Modell, Drehmoment-Max-Drehzahl < Leistungs-Max-Drehzahl, Abregeldrehzahl. 14628 Prüfungen OK.
- Zeichnungen: neue Datei pruefstand-art.js (austauschbar per `PSTART.draw[id]`, Foto-Hinweis im Kopf): S51 mit Tank, Sitzbank, Seitendeckel, M541 mit Rippenzylinder, Auspuff mit Topf, Teleskopgabel, Schwinge, Federbeine, Lampe, Lenker, 16"-Räder mit dicken Reifen, Schutzbleche. S50/Star/Habicht als Varianten, Schwalbe/SR50 mit Rundumverkleidung, Klapprad 20" mit schlanken Rädern, Duo nur leicht überarbeitet. Alte Zeichner bleiben als Rückfall.
- Shot-Hook: Zustand wird nach 400 ms erneut gesetzt (andere Hooks setzten das Tuning zurück, Kurve zeigte vorher Serienmotor). Shots: shots/p7fix-<modell>.png und p7fix-<modell>-bike.png (Ausschnitt). Sicherungen: alt/*.vor-p7fix.*.
- Offen: Duo wirkt noch kastig; Roller-Karosserien vereinfacht; Maße nur nach Augenmaß (Radstand 1175 mm, Rad ca. 577 mm, Sitz ca. 780 mm); kein Echtgerätetest; Foto-Ersatz später.

## Sound 2 (17.11.2026)
- pruefstand-ton.js: Klangprofile o/s/r nach echter Simson-Aufnahme (Freesound CC0, Vorschau) nachgezogen, mehr Mitten/Höhen; Sicherung alt/pruefstand-ton.vor-sound2.js. Terz-RMS-Abweichung im Mittel 8,3 -> 6,8 dB, Zündfrequenz stimmt. Diagramm shots/sound-vergleich-s51.png, Quellen und Vorschläge in ~/Downloads/claude/chef/nacht/sound-ref/ (QUELLEN.md, VORSCHLAEGE.md). ctest pst-s51: 0 Fehler.
- Offen: Gehörtest, eigene S51-Aufnahme (Leerlauf, Vollgas, Serie/Sport), Garelli-Hoch zu hell über 5 kHz.

## Paket 9: App-Installation, Spielstand sichern, Darstellung, Versionen (17.11.2026) – Version 3.0.0
Sicherungen vor Änderung: alt/p9/ (index.html, manifest, install.*, theme.css, anim.js, app.js).
- **Version an einer Stelle:** `version.js` (`APP.version`, `APP.schema`, `APP.news`). Anzeige in Kopfzeile (`v3.0.0`, antippen = „Was ist neu“), Titel, Eltern-Seite, Service-Worker-Cache-Name. `CHANGELOG.md` beschreibt den Ablauf für neue Versionen.
- **Migration:** `migrate.js` läuft synchron vor app.js. Alter Stand (ohne Schema = 1) → Sicherungskopie `ss-backup-<Zeit>-v1-nach-v2` in localStorage (max. 5, älteste fällt weg) und in IndexedDB, dann Schritt `MIGS[1]`, Schema 2. Unlesbarer Stand oder Stand mit neuerem Schema wird nie angefasst.
- **Spielstand** (`spielstand.js`): localStorage + IndexedDB-Spiegel (jedes Speichern, 0,7 s verzögert), `storage.persist()`, Wiederherstellungs-Dialog wenn localStorage leer, aber Spiegel da; Datei `Schrauberschule-Spielstand-DATUM.json` (Teilen-Menü, sonst Download) mit Prüfsumme/Format/Schema; Laden mit Prüfung, Vorher/Nachher-Vergleich und automatischer Kopie; Code `SS1-…` (deflate + base64url + Prüfsumme, ohne Namen) und QR (lokale Bibliothek `lib/qrcode.js`, MIT, Lizenz in lib/LIZENZ.txt); QR enthält Link `…#ss=CODE`, beim Öffnen fragt die App nach; Kamera-Scan nur wo BarcodeDetector da ist; Erinnerung (dezent, Balken unten) bei neuem Meilenstein (150 Punkte, Fahrzeug, Album), höchstens alle 20 h und nur wenn 2 Tage nicht gesichert; iPhone-Hinweis im Sichern-Fenster. Eltern-Seite hat Karte „Spielstand sichern“.
- **PWA** (`pwa.js`, `sw.js`, `manifest.webmanifest`): Service Worker v2/sw.js, Cache `ss-core-<Version>` (App-Dateien), Bilder zur Laufzeit in `ss-img-v1`, Knopf „Bilder für Offline laden“. Neuer SW wartet; Banner „Neue Version verfügbar – Jetzt aktualisieren“ (kein Zwang), danach Neustart und „Was ist neu“. app.js registriert den alten Root-SW in v2 nicht mehr (`__SW_OFF`). Manifest: id, maskable Icons (v2/icons/), orientation any, display_override, Kategorien; screenshots leer (Pflicht ist es nicht).
- **Installation** (`install.js` erweitert): Android mit `beforeinstallprompt` → eigener Dialog „Schrauberschule als App installieren?“ (Ja → prompt()); ohne Ereignis weiter die animierte Anleitung; Desktop Chrome/Edge Pille mit Installieren; Safari macOS „Ablage → Zum Dock hinzufügen“; Knopf „App“ in Kopfzeile (wenn installierbar bzw. iOS/Safari). Hook `install-android-yes` zeigt den neuen Dialog.
- **Darstellung** (`p9.css`, letztes Stylesheet): Kopfzeile 50 px wegen 44-px-Tippflächen; ab 700 px breite Oberfläche (max 1180/1320 px) mit zweispaltigem `.lay`/`.hgrid` (Werkstatt, Prüfstand, Start), Hochkant-Tablet einspaltig; Garage 3–4 Spalten; 320-px-Anpassungen; Fokusrahmen (nur bei Tastatur), Hover nur mit Maus, hellerer Nebentext, prefers-contrast. `body[data-v]` zeigt aktuelle Ansicht. Zurück-Taste: render() wird umhüllt, Ansichtswechsel erzeugen History-Einträge, popstate ruft go(); Sichern-Fenster schließt mit Zurück. Tastatur: Pfeil links/rechts wechselt Tabs, Esc schließt Fenster, Enter/Leertaste auf anklickbaren Karten (tabindex wird per MutationObserver gesetzt).
- **Tests/Werkzeuge:** `p9shot.sh <hook> [BxH …]` + `p9montage.py` (Screenshots shots/p9-*.png, schmale Größen im iframe); `p9-test.sh` (Selbsttest Migration, Datei, Code, QR, IndexedDB; braucht p9-slow.py, dauert 1–2 Min.); Hooks: sichern, sichern-code, sichern-mehr, neu, update, erinnerung, migtest, p9test. ctest.sh 0 Fehler bei home w2 sel dis asm cert mhub garage missions animgo pst-s51 install-android install-ios install-desktop install-android-yes sichern-mehr sichern sichern-code neu update erinnerung migtest.
- **Offen / nicht geprüft:** echtes iPhone/iPad/Android (Teilen-Menü, Installieren, Safe-Areas real, Kamera-Scan, Share mit Datei), Zurück-Taste und Tastatur nur im Code, nicht im Browser durchgespielt; Service Worker nur auf localhost getestet (https-Veröffentlichung noch nicht); Update-Banner-Ablauf mit echter zweiter Version nicht durchlaufen (nur Banner-Optik); sehr große Spielstände passen evtl. nicht in den QR (dann Kurzfassung bzw. nur Code); Screenshots im Manifest fehlen; Hochkant-Tablet 1024x1366 Start einspaltig (gewollt, evtl. zweispaltig besser); Sicherungskopien im Speicher sind auf 5 begrenzt.

## Paket 8 – Zwischenstand (Fortsetzung 17.11., nach Abbruch der Hintergrund-Agenten)
Vorgefunden (Dateien vorhanden, noch zu verifizieren): Teil A (motivation.js/css, statistik.js GoatCounter aus, Honda-Referenzen raus: Dateien nach alt/), Teil C (pruefstand-video.js), Teil D (p8d.js, p8d-daten.js, p8d.css: MTX-Stil 130 cm³, Eloxal-Schrauben, flache Sitzbank), LACKFARBEN-RECHERCHE.md. Fehlend: Lackierkabine+Farbwahl (lack.js), Waschen-Animation (wasch.js). ctest home/w2/pst-s51/p8-motiv: 0 Fehler. Berichte der Teilagenten fehlen (abgebrochen).
- B1 Lackierkabine + Farbwahl fertig (lack.js/css, Hooks p8-lack-*, Bericht chef/nacht/p8/B1-lack.md). Offen: Studio/Video/Waschen-Anbindung, Bild-Umfärbung ungeprüft.
- B2 Waschen-Animation fertig (wasch.js/css, Hooks p8-wasch-*, Platzhalter aus Zeichnung+Canvas-Schmutz, Fotos img/wash/<id>-dreckig|sauber.jpg bevorzugt). Bericht chef/nacht/p8/B2-wasch.md.
- Paket 8 abgeschlossen (Bericht chef/nacht/paket8-BERICHT.md). Stichprobe ctest 0 Fehler, MTX/Elox/Sitz Shots geprüft.

## Bilder neu (Lauf 17.11., Gemini Pro in Chrome)
- Ablauf: gemini.google.com/app → Modell Pro → + → "Bild erstellen" → Seitenverhältnis 3:4 → Prompt (+ Referenz per file_upload) → Download "Originalgröße" (1792x2400) landet in ~/Downloads, Rohdatei nach img/ki/neu/.
- [x] klapprad (Gemini Pro, Referenz mifa-blau): fertig, installiert als img/ki/klapprad.jpg (alt: img/ki/alt/klapprad_vor-gemini-pro.jpg). Kleiner Mangel: linker Lenkergriff leicht ungewöhnlich, sonst originalgetreu.
- [x] sr50 (Gemini Pro, Ref foto/sr50.jpg): sehr originalgetreu (Rundverkleidung, Gussräder, Gepäckträger), installiert; alt: alt/sr50_vor-gemini-pro.jpg
- [x] garage-rasentraktor (Gemini Pro, Ref ../img/foto/rasen-front.jpg): Fahrzeug original, Halle; Mangel: Reifenschrift leicht verwaschen (Text-Artefakt), Halle heller als Stil. Installiert img/ki/garage-rasentraktor.jpg
- [x] garage-zt300 (Gemini Pro, Ref ../img/foto/zt300-seite.jpg, blau/weiß ZT 300 wie Foto): sehr gut, installiert img/ki/garage-zt300.jpg. Hinweis: Liste sagt rot/blau, Referenzfoto ist blau/weiß -> Foto gefolgt.
- [x] garage-e512 (Gemini Pro, Ref ../img/foto/e512-seite.jpg): sauber, originalnah (blau/weiß, gelbes Dach, Leiter, Schneidwerk), installiert img/ki/garage-e512.jpg
- [x] garage-traktor-anhaenger (Gemini Pro, nur Text): echter ZT 300 mit Kipp-Anhänger, installiert. Kleinere Mängel: Vorderfelgen rot statt weiß, Cabine etwas niedrig; tragbar.
- [x] garage-unimog (Gemini Pro, Text): grüner Unimog 406 mit Pritsche, installiert. Mängel: Frontscheinwerfer-Anordnung leicht untypisch, winziges Emblem auf Haube.
- [x] garage-feldhaecksler (Gemini Pro, Text): blau/weißer Häcksler mit Krümmer, installiert (E-281-typisch, nicht gegen Foto prüfbar, kein Referenzfoto).
- [x] zylinder (Gemini Pro, Text, 2. Versuch): realistischer Gusszylinder mit Flansch/Stehbolzen, installiert. OFFEN/ehrlich: Rippenzahl ca. 8-9 statt exakt 11 (KI zählt nicht zuverlässig); 1. Versuch (zylinder_g1) verworfen (7 Rippen, Spitze). alt: alt/zylinder_vor-gemini-pro.jpg
- [x] App-Icon Schrauberschule (Gemini Pro): oranger Schraubenschlüssel + weiße Simson-Silhouette auf Blau-Anthrazit, kein Tacho. icons/icon-512/192, apple-touch-180, maskable-512/192 neu (Sicherung icons/alt/). Ecken mit Hintergrundfarbe gefüllt, 2,5% Rand beschnitten.
- Priorität 1 komplett (9 Bilder + Icons). manifest.js per bilder-aktualisieren.sh neu erzeugt. Kontaktbogen shots/neu-bilder-bogen.png. OFFEN: Priorität 2 (cover/*, m-*.jpg x24, foto/*-Ersatz), Recherche Abschnitt 5; ChatGPT nicht genutzt. Weiterer Ablauf: siehe Ablauf-Zeile oben; Layout-Tipp: nach Texteingabe erst + (Position je nach Textlänge, per Screenshot prüfen), dann Bild erstellen, Seitenverhältnis, Senden.
- [x] m-mathe-2 (Gemini Pro, 16:9, Ref rasen-front): Rasentraktor in dunkler Werkstatt mit Messuhr, installiert img/m-mathe-2.jpg (1280px, alt in img/alt/). Hilfsskripte chef/nacht/grab.sh + install.sh. Ablauf pro Bild: navigate gemini.google.com/app, + (446,362), Bild erstellen (520,536), Seitenverhältnis (580,642)->16:9 (486,600), Text, Enter, Download-Icon oben rechts im Bild.

- [ ] zylinder.jpg NEU: ist kein S51-Zylinder (generisch, aus Text). Mit Referenzfoto echter S51-Zylinder (M531/541, waagerechte Rippen, getrennter Kopf) neu erzeugen.
- [x] m-mathe-6 (Gemini, blauer DDR-Kippanhänger mit Kisten/Strohballen in Halle) installiert
- [x] m-mathe-7 (Stoppuhr/Pokale/Schwalbe) installiert; m-nawi-6 (Brot) erzeugt, Download läuft
- [x] m-nawi-12 (Wetterstation, ZT300, Gewitterfenster) installiert. Download-Tipp: hover, wait 1 s, dann Klick auf Download-Icon (1069,91). m-mathe-7 und m-nawi-6 erzeugt, Chats: gemini.google.com/app/229ef49c90cc0a38 und /5fc4fb4c8c7881f3, Download steht aus
- [x] m-mathe-7, m-nawi-6 installiert. Voller Zyklus als ein Batch (navigate..download) funktioniert; Pause 1 s nach hover wichtig
- [x] m-nawi-13 installiert
- [x] m-deutsch-3 (Uhren/Schwalbe/Traktor) installiert. m-nawi-13 Download fehlgeschlagen, Chat gemini.google.com/app/dda841c02ef891d9 (erneut laden)
- [x] m-nawi-13 installiert (2. Versuch). Download schlägt manchmal fehl (Toast 'Fehler'), dann neu erzeugen
- [x] m-englisch-10 (ZT300 in Halle, Heft/Thermoskanne) installiert. Download braucht bis ~15 s, nicht doppelt klicken. 8 'besonders falsche' m-Bilder fertig; weiter: restliche 16 m-*, cover/*, foto/*
- [x] cover/hof-1 (Rasentraktor Front, Ref rasen-front, sehr originalgetreu) installiert; Folgebilder im selben Chat 8a15aec67a59b2db (Variante spart Re-Upload)
- [x] cover/hof-2 (Front-Nahaufnahme) installiert; tuning-3 (Motor offen) erzeugt
- [x] cover/tuning-4 (Mähdeck/Riemen) installiert; tuning-3 (Motor offen) Download offen -> Datei in Downloads prüfen
- KORREKTUR: cover/tuning-3 = Motor offen (installiert); tuning-4 vorerst Original, Mähdeck-Bild (Download verpasst) neu erzeugen
- [x] cover/hof-3 (E512 Seite, Werkhalle), hof-4 (E512 schräg) installiert; tuning-3 Motor; tuning-4 noch Original
- [x] cover/simson-1 (gelbe Schwalbe, Ref schwalbe-kr51-2, originalgetreu) installiert; simson-2 (Frontnahaufnahme) erzeugt. hof-4: Download verpasst, noch Original
- [x] cover/simson-2 (Schwalbe Front), simson-3 (S51 Nahaufnahme Motor, Ref s51) installiert. Chat-Revisit zeigt Bilder NICHT -> immer sofort downloaden. Offen: simson-4 (Schwalbe Seite, Download verpasst), hof-4 (Download verpasst), tuning-1/2 (Simson-Tuning statt MTX), tuning-4, traktor-1..4
- [x] cover/simson-3 (S51 Motor-Nahaufnahme) installiert. WICHTIG: Download kann >30 s dauern, erst weiter wenn Datei in ~/Downloads liegt (Bash-Poll), sonst Abbruch bei Navigation
- [x] cover/tuning-1 (S51 mit Sportauspuff, mit Sitzbank; 1. Versuch ohne Sitzbank verworfen) installiert
- [x] cover/tuning-2 (S51-Zylinder/Krümmer Nahaufnahme) installiert. Honda-Cover damit ersetzt.
- [x] cover/traktor-1 (blauer ZT300, Werkhalle) installiert
- [x] cover/traktor-2 (ZT300 Seite/Kabine) installiert
- [x] cover/traktor-3 (roter ZT300, Ref gelsdorf, ohne HDR) installiert
- [x] cover/traktor-4 (roter ZT300 Front, Kennzeichen entfernt/leer) installiert. traktor-3 hat noch lesbares Kennzeichen -> neu ohne
- [x] cover/traktor-3 ersetzt durch Version ohne Kennzeichen
- cover/hof-4 ersetzt (E512 Dreiviertel vorn rechts, Halle)
- cover/simson-4 ersetzt (Schwalbe Seitenansicht, Halle)
- cover/tuning-4 ersetzt (Rasentraktor mit Mähwerk, Halle). Alle 16 Cover fertig.
- Foto-Ersatz e512-seite, schwalbe-kr51-2, rasen-front (Originale in v2/img/referenz und img/foto/alt); Manifest neu; Bogen v2/shots/neu-bilder-bogen2.png; leerer Ordner sprachfoerderung/sprachfoerderung entfernt (rmdir).
- [ ] Chef-Prüfung Bogen2 (17.11.): neu mit Referenz: (a) grün/oranger Feldhäcksler-Cover ist kein E 281 (westlicher Stil), (b) grüner Traktor mit Anhänger kein DDR-Typ erkennbar, (c) grüne S51-Cover mit erfundenem großem "SIMSON"/"S51"-Tankschriftzug -> Originaltank-Dekor nach Foto. Rest ok.
- Referenz zylinder: img/referenz/zylinder/ (akf-shop Fotos; Zylinder 5 breite waagerechte Rippen, separater Kopf mit senkrechten Rippen). Nur Referenz.
- [x] zylinder (Gemini Pro MIT Referenz akf-shop, 5 waagerechte Rippen + separater Kopf) installiert v2/img/ki/zylinder.jpg 1024px; alt v2/img/ki/alt/zylinder_vor-referenz.jpg
- [x] m-mathe-3 (Kanister/Öl/Messbecher) installiert. Ablauf: navigate, wait 3, +, Bild erstellen, Seitenverh., 16:9, Textfeld (640,552), type, Return, 20 s warten, hover (740,350), Download (1070,294); Pfad img/m-*.jpg (sprachfoerderung/img)
- REGEL (Nutzer 17.11.): Alle Bilder 100 % originalgetreu (Zylinder, Motor, Details), immer mit Referenzfoto, Vergleich nebeneinander. Gilt auch für Teil 1/2 – bei Abweichung nachbessern.
- [x] m-nawi-2 (Lenker Kabelbaum Glühlampe) installiert
- [x] m-nawi-8 (Schnittmodell M531) installiert
- [x] m-nawi-10 (Polrad/Zündgrundplatte) installiert
- [x] m-nawi-16 (luftgekühlter Simson-Motor statt Wasserkühler) installiert
- [x] m-technik-3 (Kurbelwelle/Gradscheibe/Messuhr) installiert
- [x] m-technik-8 (Sportauspuff) installiert
- [x] m-technik-10 (Multimeter/Motor) installiert. Offen: mathe-1,4,8; nawi-9; technik-1; deutsch-7; englisch-7,11 (mit Referenz s51/zylinder)
- [x] m-englisch-11 (Ersatzteillager) installiert
- [x] m-mathe-1 (S51 grün 3/4 vorn, Ref ki/s51) installiert. Ref-Ablauf: nach Upload Textfeld (640,536); nach Generierung scroll down 5, hover (740,250), Download (1070,90)
- [x] m-mathe-4 (S51 Hinterrad/Kette) installiert
- [x] m-mathe-8 (3 Zylinder Größenvergleich, Ref Zylinder) installiert
- [x] m-nawi-9 (Kolben Brandspuren + Zylinder) installiert. Download-Icon-Position variiert (y 90 oder 176) -> vor Klick Screenshot
- !! Gemini-Bildlimit erreicht 13:46, Reset 17:58. Offen: m-technik-1, m-deutsch-7, m-englisch-7, foto/* (rasen-motor,s51-b24,s51-calau?,zt300-gelsdorf,zt300-seite) + 3 eigenständige Varianten (e512-seite,schwalbe-kr51-2,rasen-front). Versuche ChatGPT.
- Kontaktbogen v2/shots/neu-bilder-bogen3.png, Manifest neu. 13 m-* + zylinder fertig; Rest wartet auf Gemini-Limit (ChatGPT: Chrome-Berechtigung verweigert).
- Bericht chef/nacht/bilder3-BERICHT.md geschrieben (STATUS: OFFEN).
- Fortsetzung 13:50: Gemini-Limit noch aktiv bis 17:58, nichts erzeugt.
- Fortsetzung 13:55: Gemini-Limit weiterhin aktiv (Reset 17:58), nichts erzeugt. Offene Punkte unveraendert.

## Fortsetzung 13:48
Gemini-Limit weiterhin aktiv (Reset 17:58, per Screenshot bestätigt), ChatGPT nicht nutzbar. Nichts erzeugt; offene Punkte unverändert. Neustart nach 17:58 nötig.

## Teil 4 (17.11., 13:55 gestartet)
- [x] Gemini-Limit bis 17:58 bestätigt (Screenshot). Referenzen von Wikimedia Commons in v2/img/referenz/simson/ (12 Fotos, QUELLEN.md).
- [x] Alte Bilder aus App entfernt: img/ki/* (6) -> img/alt/ki-alt/, img/cover/ki-* + simson-ki-* -> img/cover/alt/; content.js GARAGE zeigt v2/img/ki/*, app.js COVERS ohne Alte, root sw.js bereinigt. Backups v2/alt/*.vor-bilder4.js
- Noch alt (brauchen Gemini): m-deutsch-7, m-englisch-7, m-technik-1, foto/{rasen-motor,s51-b24,s51-calau,zt300-gelsdorf,zt300-seite}, cover/sport-1/2.svg
- Fehlerhaft laut Prüfung (neu mit 2 Refs): cover/simson-3, cover/tuning-2 (Motor), cover/tuning-1, m-nawi-8 (Schnittmodell V-förmig), m-technik-10, m-nawi-16 (Motor), zylinder-Motive prüfen

## Paket 10 (17.11.)
- [x] 1a Simson-Werte: S51 3,7 / SR50 3,6 / KR51 3,6 / S50 3,4 PS in werkstatt2.js (Backup alt/werkstatt2.vor-p10.js), MTX-psBase-Faktor /3.7
- [x] 3 Waschen+Lackieren-Knopf im Werkstatt-Auftrag (jobTools in werkstatt2.js), Screenshot 390 geprüft
- [x] 4a Lack: weiße/silberne Fahrzeuge (SR50) per Helligkeitsmaske in lack.js (Backup alt/lack.vor-p10.js), Werkstatt-Hintergrundbilder (.pic) werden jetzt umgefärbt (vorher gar nicht); Boden ausgespart; Screenshot shots/p10-sr50-lack.png. Rest: graue Schattenflächen bleiben etwas grau
- [x] 2 Desktop >=1700px: main 1640px, Prüfstand zweispaltig (p9.css), Screenshot p9-pr-1920x1080 geprüft
- [x] 1b pst-test.sh 18072 Prüfungen OK, TUNING-DATEN.md ergänzt
- [x] 4b Studio/Karte/Wallpaper/Vorher-Nachher (carImg in studio.js, Backup alt/studio.vor-p10.js) + Video (LACK.farbe fehlte, jetzt da) färben um; Test-Hook p8-lack-p10studio, Screenshot geprüft
- [x] 5 Stichprobe Motivation/Video/MTX: ctest 0 Fehler (nur Autoplay-Hinweise), MOTTEST OK, WASCHTEST OK, pst-test 18072 OK, Screenshots shots/p10-teile-bogen.png geprüft. Paket 10 fertig; Bericht chef/nacht/paket10-BERICHT.md
- [x] cover/simson-3 (S51 Motor links, 3 Refs, Gemini Pro) + cover/tuning-2 (rechte Seite mit Simson-Oval wie Referenz) installiert; Alt in img/cover/alt/*_vor-bilder4.jpg. Skript chef/nacht/inst4.sh <ziel> <rohname>. Gemini: Modell Pro wählen, 16:9, Refs per file_upload (ref_117)
- [x] m-nawi-16 (M541 ausgebaut auf Werkbank, mit Refs) installiert
- [x] m-technik-10 (Motor+Multimeter, Variante von nawi-16, Hinweis: Komposition ähnlich) installiert
- [x] m-nawi-8 (Schnittmodell M541, ein Zylinder) installiert
- [x] m-technik-1 (Zylinder+Kolben+Pleuel+Schieblehre, 2 Zylinder-Refs) installiert (ersetzt altes 960px-Bild)
- [x] m-deutsch-7 (Zylinderkopf+Kerze+Kerzenschlüssel) installiert (ersetzt altes Bild)
- [x] m-englisch-7 (Werkstatt, S51 auf Hebebühne) installiert (ersetzt altes Bild)
- [x] cover/tuning-1 (S51 Seite, gebraucht, mit Refs) installiert. Offen: foto/* (4), sport-1/2, Bogen, ORIGINALTREUE final, manifest, Shots
- [x] foto/zt300-gelsdorf (neue KI-Variante, 2 Refs) installiert
- [x] foto/zt300-seite (blau, Feldweg, neue KI) installiert. Offen: rasen-motor, s51-b24, sport-1/2
- [x] foto/rasen-motor (Haube offen, neue KI) installiert
- [x] foto/s51-b24 (gelbes Postmoped ohne Person, Ref s51-post) installiert. Offen: sport-1/2, grep, manifest, Bogen, Shots, ORIGINALTREUE, Bericht
- [x] cover/sport-1.jpg (Boxenstopp Werkbank) neu; SVGs nach cover/alt
- [x] cover/sport-2.jpg (Vorderrad, Radmutterschlüssel) neu
- [x] Teil 4 Endstand, Bericht STATUS: OFFEN (Patina 4 Bilder)
- [x] Teil 4 Endstand, Bericht STATUS: OFFEN (Patina 4 Bilder)
- [x] Teil4-Fortsetzung: ki/s51 neu mit Patina (3 Refs) installiert (Backup img/ki/alt). Offen: schwalbe, sr50, rasentraktor, m-technik-10, IFA-Raute
- HINWEIS 17.11. 18:00: ChatGPT-Bildlimit wieder frei. Wenn Gemini blockiert, ChatGPT (chatgpt.com, eingeloggt) als zweite Quelle nutzen – gleiche Regeln (2 Referenzfotos hochladen, Originaltreue, Stil dunkle Werkstatt einheitlich).
- [x] ki/schwalbe neu mit Patina. Offen: sr50, rasentraktor, m-technik-10, IFA-Raute. Gemini: file_upload ref nach Navigation neu per find holen (Ref-IDs ändern sich)
- [x] ki/sr50 neu mit Patina (2 Versuche; Räder wirken noch halb-speichig/dreckig, Rest passt). Offen: rasentraktor, m-technik-10, IFA-Raute
- [x] garage-rasentraktor neu mit Patina. Offen: m-technik-10 vs nawi-16, IFA-Raute, Bogen/Shots/ORIGINALTREUE/Bericht
- [x] Teil4-Fortsetzung komplett: 4 Patina-Bilder neu, sw v20, Bogen shots/neu-bilder-bogen4b.png, ORIGINALTREUE ergänzt, Bericht geschrieben
- [ ] Teil5 gestartet: Befund tuning-2 OK (Oval-Logo rechts laut Ref s51-motor-rechts vorhanden), simson-3 links OK bis auf evtl. grosse simson-Tankschrift; Gemini Limit bis 22:08 -> ChatGPT
- [x] ki/sr50 neu via ChatGPT (Gemini Limit bis 22:08), 2 Refs, Backup ki/alt/sr50_vor-bilder5.jpg. Offen: m-deutsch-7, simson-3 Tankdekor, Bogen5, ORIGINALTREUE, sw, Bericht
- [x] m-deutsch-7 neu via ChatGPT (3 Refs; zeigt ganzen Motor, Kopf korrekt), Backup img/alt. Offen: simson-3 Tank, Bogen5, ORIGINALTREUE, sw, Bericht
- [x] cover/simson-3 neu via ChatGPT (Tank nur electronic-S51-Aufkleber + S-Emblem), sw wt-v21, v2/sw IMG v2. Offen: Bogen5, ORIGINALTREUE, Bericht
- [x] Bogen5, ORIGINALTREUE fertig. Nur Bericht offen
- [ ] Teil6 Lauf 19:00: Gemini Pro Limit bis 22:58, ChatGPT-Tab fuer Browser-Erweiterung gesperrt (Permission denied). KEIN Bild neu erzeugt. Offen: alle Punkte 1-4 + Nutzerhinweis. Befund: Referenzen s51-motor-links/rechts zeigen '4' + IFA-Raute links, Oval rechts als ECHT; Nutzer will sie entfernt -> Entscheidung noetig
- [ ] Teil6 Fortsetzung 19:10: Gemini Limit bis 22:58, ChatGPT Bildlimit bis 18:56 morgen. Nichts erzeugt. Neustart nach 22:58 mit Gemini Pro (Prompt-Vorlage im bilder6-BERICHT)
- [ ] Teil6 Fortsetzung 19:05: unveraendert blockiert (Gemini bis 22:58, ChatGPT bis morgen 18:56). Nichts erzeugt.
- [ ] Teil6 Fortsetzung 19:06: Uhrzeit unveraendert, Gemini-Limit (bis 22:58) / ChatGPT (bis morgen 18:56) laut Pruefung 19:03 weiter aktiv. Nichts erzeugt. Neustart nach 22:58.
- [ ] Teil6 Lauf 23:10: Gemini Pro frei, sr50 Versuch 1 laeuft; Ausgabe nach img/ki/neu/ (NICHT in App)
- [x] Teil6 sr50: img/ki/neu/sr50-v1.jpg (Versuch 1, passt zu sr50-bj93; HINWEIS sr50-ce.jpg ist blauer CE MIT Faltenbaelgen). Offen: Motorbilder 2-5. Gemini-Ablauf: Uploads&Tools->Bild erstellen, file_upload auf file-input, Prompt per click+type, Download im Editor-Icon oben rechts (dauert ~15s) -> ~/Downloads/Gemini_Generated*
- Teil6 nawi-16 V1 fehlgeschlagen (Entwurf kopiert), V2 ohne Entwurf. inst6.sh <name> legt neu/<name>.jpg an
- Teil6 nawi-16 V2 Kabel weiter falsch, V3 laeuft (danach ZWEIFEL). Direkt-Download im Chat: Icon rechts unten am Bild klicken
- [x] Teil6 m-nawi-16: img/ki/neu/m-nawi-16-v3.jpg (3. Versuch, Kabel ok: Zuendkabel hoch, Gaszug separat). Offen: technik-10, nawi-8, deutsch-7, s51, andere Motorbilder pruefen
- [x] Teil6 m-technik-10-v1 ok. Offen: nawi-8, deutsch-7, bogen/vergleich
- Teil6 nawi-8 V1 Deckel vermischt, V2 nur Ref links. Danach deutsch-7, Bogen
- Teil6 KORREKTUR: nawi-16-v3/technik-10-v1/nawi-8-v2 Kabel endet WEITER am Vergaser (Zoom). nawi-8 V3 = Bearbeitung von v2. Bei Erfolg Methode auf technik-10 anwenden
- [x] Teil6 m-nawi-8-v3 OK (Bearbeitungsmethode). Jetzt technik-10 V2 per Bearbeitung; nawi-16 hat schon 3 Versuche -> OFFEN/Empfehlung Bearbeitung
- [x] Teil6 m-technik-10-v2 OK. nawi-16 V4 (Bearbeitung v3) laeuft; danach deutsch-7, s51 pruefen, Bogen, Vergleich, ORIGINALTREUE, sw, Bericht
- Teil6 nawi-16 V4: ZWEIFEL (Kabel hinter Vergaser). Jetzt deutsch-7 V1
- [x] Teil6 m-deutsch-7-v1 OK (neu/). Offen: andere Motorbilder (simson-3, tuning-2, s51, technik-1) pruefen, Vergleichsbogen, ORIGINALTREUE, sw, Bericht
- Teil6: simson-3 Kabelfehler gefunden, Bearbeitung laeuft (neu/simson-3-v1). tuning-2 Deckel-Mischung + technik-1 Form = ZWEIFEL
- [x] Teil6 simson-3-v1 OK (Bearbeitung). Alle Bilder erzeugt; offen: Vergleichsbogen, neu-bilder-bogen6, ORIGINALTREUE, Bericht
- [x] Teil6 fertig: Bogen, ORIGINALTREUE, Bericht (STATUS: OFFEN wegen nawi-16 ZWEIFEL + Nutzerfreigabe). Nichts in App eingebaut.
- [x] Teil6 Fortsetzung 17.11.: nichts Offenes ausser Nutzerentscheidung, Bericht auf KOMPLETT

## Lizenzcheck (Nacht 18.11.2026, Auftrag lizenz)
- [x] Teil 1: Medien und Bibliotheken inventarisiert (v2 + Root-Dateien über `<base href="../">`), Quellen aus LIZENZ/BAUSTAND/BILDER-INVENTUR/QUELLEN/CREDITS abgeglichen. Keine Audio- und Schriftdateien vorhanden.
- [x] Teil 2: Referenzfotos `img/referenz/` geprüft: nicht in HTML/JS/CSS referenziert, nicht im sw-Cache vorgesehen. ABER: liegen im Ordner, den GitHub Pages veröffentlichen würde, sobald `v2/` committet wird.
- [x] Teil 3: Sichtprüfung 5 Bilder: `img/foto/s51-calau.jpg` zeigt eine Rechnung mit Name, Adressfragment und Fahrgestellnummer einer Privatperson, im Quiz benutzt (c-technik.js). Ergebnis in LIZENZ-CHECK.md.
- [x] Teil 4: Ergebnis LIZENZ-CHECK.md geschrieben, Bericht lizenz-BERICHT.md. Nichts gelöscht, nichts veröffentlicht, App-Code nicht geändert.

## Gesamt-Review v3.0.1 (18.11.2026, Opus, Auftrag appreview) – nur Analyse
- [ ] Teil 1 gestartet: Bestandsaufnahme Bilder/Code
- [x] Teil 1: Bestandsaufnahme + Sichtprüfung aller ~60 genutzten Fahrzeug-/Teilebilder (cover, foto, m-*, ki) gegen Referenzen; JS-Syntax ok (jsc), 16 Ansichten ohne Konsolenfehler
- [x] Teil 2: alle Bilder gesichtet (Befunde notiert); Code-Test: Screenshots 390/1280, Offline/sw geprüft
- [x] Teil 3: Inhalte/Fakten (Stichprobe aller Fächer, PS-Werte mit Websuche geprüft), Bedienung/Barrierefreiheit, Lizenzen
- [x] Teil 4: Analyse geschrieben → ~/Downloads/claude/chef/FABLE-ANALYSE.md; Bericht → chef/nacht/appreview-BERICHT.md. App unverändert.
- [x] A2 erledigt: c-technik.js Bild -> v2/img/ki/s51.jpg, CREDITS-Eintrag weg, Datei nach img/foto/alt/, Root-sw.js angepasst (wt-v22)
- [x] E1 erledigt: Zeitdruck Standard aus (S.zeitAn, alte Staende ok), Texte angepasst
- [x] B3, B4 erledigt (deutsch-5 Erklaerung, Tank->Reservekanister in mathe/nawi)
- [x] B1 (star/habicht 3,4, s50 3,6; duo unbelegt, Spielwert belassen), B2 (Anzeigetexte 49,8; Rechenaufgaben bleiben rechnerisch 49,9) erledigt. SR50-Baujahr ungeprueft belassen
- [x] C1, C2, ORIGINALTREUE-Korrektur tuning-1 erledigt

## Teil 7 (18.11. nachts)
- [ ] Teil7 gestartet: Plan tuning-1, tuning-2, m-technik-1, m-englisch-7, zt300-gelsdorf/-seite, s51-b24, sport-1/2, Patina-Liste. Ausgabe nur img/ki/neu/*-t7-v*.jpg + shots/vergleich-bogen7.jpg. Methode: Gemini Chrome, Bearbeitung bestehender Bilder
- [x] D2 erledigt: manifest.js IMGS_ROOT (cover/m-*/foto) + warm() + Skript
- [x] D3 (Version bei DOMContentLoaded), D4a (referenz ausgenommen, IMG-Cache v4) erledigt; D4b defer: s. Bericht
- [x] D5 Rasentraktor-Punkte auf aktuellen Bildern neu gemessen (Pruefung per Screenshot folgt)
- [x] E2, version 3.0.2, CHANGELOG. Offen: Tests
- [x] Tests: jsc-Syntax alle Dateien ok, Headless-Chrome Startseite (Version 3.0.2 sofort sichtbar), Spot-Overlays Rasentraktor per Screenshot geprueft
- [x] Fortsetzung appfix: D1/D4b bewusst zurückgestellt, Bericht KOMPLETT
- [x] Teil7 tuning-1: neu/tuning-1-t7-v1.jpg (Versuch 1, 4+IFA links, kein Oval, OK). Ablauf: gemini.google.com/app, +, Bild erstellen, find file-input, file_upload (scratchpad-Kopien), Download-Icon Hover oben rechts am Bild (2x klicken), inst6.sh <name>. Weiter: tuning-2
- [x] Teil7 tuning-2: neu/tuning-2-t7-v1.jpg (V1, nur Oval; vorher 1 Fehlstart ohne Bildmodus = Text, zaehlt nicht). Weiter: m-technik-1
- [x] Teil7 m-technik-1: neu/m-technik-1-t7-v1.jpg (V1 OK, 5 Rippen, Flansch). Weiter: m-englisch-7
- Teil7 m-englisch-7 V1 gesamt gut, aber linker Deckel SIMSON-Oval statt 4+IFA -> V2 Bearbeitung nur Deckel
- [x] Teil7 m-englisch-7: neu/m-englisch-7-t7-v2.jpg (V2 OK: 4+IFA links). Weiter: zt300-gelsdorf, zt300-seite, s51-b24, sport-1/2, Patina-Liste
- [x] Teil7 zt300-gelsdorf: neu/zt300-gelsdorf-t7-v1.jpg (V1, Rost/Schlamm, ohne Person). Weiter zt300-seite
- [x] Teil7 zt300-seite: neu/zt300-seite-t7-v1.jpg (V1 OK, Scheune, Rost; 1 Fehlstart ohne Bildmodus zaehlt nicht). Weiter s51-b24
- [x] Teil7 s51-b24: neu/s51-b24-t7-v1.jpg (V1 OK, Werkstatt/Patina, kein Mensch; Deckel IFA+4). Weiter sport-1/2 (Gemini-Seite noch /app, Tab 380786401), dann Patina-Liste, Bogen, Bericht
- [ ] UI-Vorschlag gestartet (18.11.): Analyse, Entwurf v2/entwurf/ui-varianten.html, Bericht chef/nacht/uivorschlag-BERICHT.md
- [x] Teil7 sport-1: neu/sport-1-t7-v1.jpg (V1 OK, S51 Startnr 7, Zielflagge, Stoppuhr, keine Person). Weiter sport-2
- [x] Teil7 sport-2: neu/sport-2-t7-v1.jpg (V1 OK, S51 auf Asphaltpiste, Zielflagge, Reifen, keine Person). Weiter: Patina-Liste, vergleich-bogen7, Bericht
- [x] Teil7 komplett: 9 Bilder, vergleich-bogen7.jpg, Patina-Liste, bilder7-BERICHT.md (STATUS: KOMPLETT). Nichts eingebaut.
- [x] UI-Vorschlag erledigt: v2/entwurf/ui-varianten.html, Bericht chef/nacht/uivorschlag-BERICHT.md. App unverändert.
- [x] M1 gestartet: install.css-Pille-Fix (Klecks deckte Karten ab), theme.css pointer-events, klicktest.py/.sh geschrieben (Backup alt/vor-m1/)
- [x] anim.js: Race startViewTransition-go (Ursache 'springt zurück'), Klicktest Gerüst fertig

## Teil 8 (18.11. nachts) – Ausgabe img/ki/neu/*-t8-v*.jpg + shots/vergleich-bogen8.jpg, NICHT eingebaut
- [x] Refs geladen: referenz/wassergekuehlt/kreidler-vanveen-wassergekuehlt-1/2.jpg (CC0, QUELLEN.md); Haendler-Zylinderfotos -> referenz/alt/zylinder-haendler/; neu simson/s51-motor-ifa21.jpg (CC BY-SA 4.0). Weiter: A1 m-nawi-16 via Gemini
- [x] A1 m-nawi-16 Versuch 1: neu/m-nawi-16-t8-v1.jpg (Gemini, Refs wk1+wk2). Pruefen. Weiter A6 zylinder
- [x] anim.js: startViewTransition aus (schluckte Taps 0,3 s = Ursache a+b). Klicktest fast grün
- [x] A6 zylinder Versuch 1: neu/zylinder-t8-v1.jpg (Refs ifa21+ueberholt; 1 Fehlstart ohne Bildmodus). Weiter A7 sr50
- [x] Teil8 komplett: m-nawi-16-t8-v1, zylinder-t8-v1, sr50-t8-v1, shots/vergleich-bogen8.jpg, Bericht chef/nacht/bilder8-BERICHT.md. Nichts eingebaut. Hinweis fuer Einbau: zylinder-t8 ist 1280x1280 (alt 1024x1024).
- [x] Testclip Prüfstand: Ref dyno-rolle.jpg (CC BY-SA 2.0) in img/referenz/pruefstand/. Weiter: Gemini Video (Chrome), max 3 Versuche -> img/clips/test-pruefstand-s51.mp4
- [x] version 3.1.0, sw ss-img-v5, CHANGELOG, favicon/touch-icon 404-Fix. Offen: Inventur, Screenshots, Bericht
- [x] Testclip Versuch 1 gestartet in Gemini (Video, 9:16, Refs s51.jpg+dyno-rolle.jpg), Chat https://gemini.google.com/app/77d42dff30454580 (Tab 380786416). Warten, dann mp4 laden
- [x] Versuch 1 Video geladen: img/clips/test-pruefstand-s51-v1.mp4, Bogen shots/testclip-pruefstand.jpg. Prüfen, Bericht
- [x] V1 geprüft: gut, aber Kennzeichen-Kauderwelsch, Funken, 10 s, Rauch baut auf (kein Loop). Versuch 2 läuft (selber Gemini-Chat, Prompt: kein Kennzeichen, kein Funken, konstanter Rauch)
- [x] Testclip fertig: img/clips/test-pruefstand-s51.mp4 (5s Loop), Bogen shots/testclip-pruefstand.jpg, Bericht chef/nacht/testclip-BERICHT.md. V2 scheiterte an Gemini-Videokontingent, Sora leer. Nichts eingebaut.
- [x] TUNING-1 FIX: v1 hat '4' schon korrekt auf Deckel; kein Gemini-Lauf noetig, v2 = Kopie von v1, shots/vergleich-tuning1.jpg, Bericht chef/nacht/tuning1fix-BERICHT.md
- [x] Inventur: shots/bilder-inventur-m1.jpg, BILDER-M1.md, Screenshots m1-*. Offen: Bericht
- [x] M1 Bericht geschrieben, KOMPLETT
- [x] DUO (19.11.): neu/duo-t9-v1.jpg (V1 OK), refs img/referenz/duo-*.jpg + DUO-FAKTEN.md, shots/vergleich-bogen-duo.jpg, Bericht chef/nacht/duo-BERICHT.md. Nichts eingebaut.
## Lack+Waschen foto (19.11.)
- [ ] gestartet: Plan Masken (Gemini) + dreckig-Bilder fuer s51,kr51,sr50,s50,habicht,star,duo,klapp; Ausgabe img/lack, img/wash, lack-foto.js, wasch-foto.js, entwurf/lackwasch-test.html
- Gemini-Test s51 dreckig: Bild wird neu komponiert (anderer Ausschnitt) -> Pixelgleichheit nicht erreichbar. Wechsel: lokale Segmentierung (rembg/u2net, Apache-2.0) + prozedurale Foto-Schmutzschicht per Python, garantiert deckungsgleich
- [x] Masken per Segmentierung+Farbschwelle (chef/tools/mask.py, seg.py, venv, u2net.onnx Apache-2.0) -> v2/img/lack/<id>-maske.png alle 8. Weiter: recolor + dreckig prozedural
- [x] wash-Paare (prozedural, deckungsgleich), vergleich-lack/wasch.jpg erzeugt (fx.py). Weiter: recolor-Prüfung, lack-foto.js, wasch-foto.js, Testseite, Bericht
- [x] Test + Bericht geschrieben (STATUS OFFEN: Kabine-Abkleben, Waschhalle-Foto, Duo-Maske)
- [x] Lack+Waschen Fortsetzung: Duo-Maske, abkleben.png + LackFoto.abkleben, wasch-foto Foto-Hintergrund, Bericht KOMPLETT
- [x] VIDEO1: Flow braucht Zustimmungsdialog (abgebrochen), Gemini-Video ausgegraut, Wan-Notizbuch entwurf/wan-colab.ipynb geschrieben, Bericht video1-BERICHT.md
- [x] VIDEO1 Fortsetzung: Flow-Dialog weiter offen, nichts erzeugt, wartet auf Nutzer-Klick
- 2026-11-18: Fortsetzung 3, Flow-Dialog weiter Blocker, nichts erzeugt
- Video1 Fortsetzung 4: Flow-Dialog weiter offen, Nutzer-Klick nötig
- [x] SEITENFIX Duo: duo-t9-v2.jpg = Spiegelung von v1 (Motor jetzt links am Fahrzeug). Weiter tuning-1 links via Gemini
- [ ] ZYLFIX (19.11.): Refs zylinder2/s50-motor.jpg + ifa-motor1.jpg geladen, BILD-SPEZ ergaenzt. Weiter: Gemini Versuch 1 -> img/ki/neu/zylinder-t10-v1.jpg
- [x] SEITENFIX S51 links: tuning-1-t7-v3-links.jpg (Gemini V2 von 2, 1024x572), Bogen shots/vergleich-seitenfix.jpg
- [x] ZYLFIX fertig: img/ki/neu/zylinder-t10-v1.jpg (V1 OK, 1280x1280), shots/vergleich-zylinder.jpg, Bericht chef/nacht/zylfix-BERICHT.md. Nichts eingebaut.
## lackwasch2 (18.11.)
- [ ] gestartet, Backups alt/vor-lackwasch2/ erledigt
- [x] lackwasch2 Masken neu: chef/tools/mask2.py (sr50 auf aktuelles ki/sr50.jpg 955x1280 neu - alte Maske war fuer alte Landscape-Version!, habicht inkl. Scheinwerferverkleidung ohne Tank/Deckel, duo Polygone). Weiter: recolor (k-Highlight-Cap) in lack-foto.js, Vergleichsbogen Lack, dann Waschen
- 18.11. video2: Flow-Upload stoppt bei Rechte-Dialog 'Ich stimme zu' (nicht zugestimmt). Bericht chef/nacht/video2-BERICHT.md
- 18.11. video2 Fortsetzung: Flow-Rechte-Dialog 'Ich stimme zu' weiter Blocker (Nutzer-Klick nötig), nichts erzeugt
- lack-foto.js recolor fertig (08:56), dirt2.py d2-Bilder in tools/work/. Weiter: d2 pruefen, nach img/wash kopieren, Bögen, Bericht
- [x] wash dreckig = dirt2 d2 kopiert (Backup alt/vor-lackwasch2/wash). Weiter: Bögen vergleich-lack-v2/wasch-v2, Test, Bericht
- [x] Masken sr50/duo nachgebessert (mask2.py: Reste-Schliessung), hl-Cap .30. Weiter: Bögen neu, Test, Bericht
- [x] lackwasch2 Bögen + Bericht fertig
- 18.11. video2: Flow-Clips erzeugt (2 von 3 Versuchen, je 15 Credits): img/clips/pruefstand-s51-v2.mp4 (=v2b, Rauch am Auspuffende), Bogen shots/clip-s51-v2.jpg. Nicht eingebaut. Bericht chef/nacht/video2-BERICHT.md
- 18.11. video2 Fortsetzung: Prüfstand-Startbild-Upload in Flow nicht möglich (kein Datei-Feld, Skript-Weg abgelehnt), nichts erzeugt, STATUS OFFEN
- 18.11. video2 Fortsetzung 2: nichts neu erzeugt (Startbild fehlt: SIMSON-Tank/Prüfstand), Bericht aktualisiert, STATUS OFFEN
- 18.11. video2 Fortsetzung 3: Blocker unverändert (kein Startbild, Flow-Tab nicht steuerbar), nichts erzeugt, STATUS OFFEN
- 18.11. Prüfstand-Clips eingebaut: pruefstand-clips.js (Vollbild-Overlay beim Lauf, Tippen schließt, aus bei 'Bewegung reduzieren'), index.html + sw.js CORE_FILES, Backup alt/vor-clips/. Clips (8 Stück, 1,5-3,8 MB) nicht vorgecacht, offline kein Clip. Getestet: Duo (show), Klapprad (echter Lauf).
