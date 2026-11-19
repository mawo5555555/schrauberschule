# Änderungsprotokoll Schrauberschule

Versionsnummer steht an EINER Stelle: `v2/version.js` (`APP.version`, `APP.schema`, `APP.news`).
Regel: 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
Neuer Spielstand-Aufbau → `APP.schema` um 1 erhöhen und in `v2/migrate.js` einen Schritt `MIGS[alt]` ergänzen.
Ablauf Update: version.js ändern → Service Worker bekommt neuen Cache-Namen → Nutzer sieht „Neue Version verfügbar – Jetzt aktualisieren“ → danach „Was ist neu?“ (Text aus `APP.news`).

## 3.5.9
- Fehlererkennung (fehler.js): letzte Fehler auf der Elternseite, Neu-laden-Hilfe nach Updates, grober Fehlerzähler in der Statistik.
- Vorab-Test v2/vorabtest.py vor dem Hochladen.

## 3.5.8
- Tippflächen mindestens 44 px (Lack-Chips, Schalter, Quelle-Links).
- Meldungen (Toast) liegen unter der Kopfzeile.
- Ersatzfarben für Geräte ohne color-mix (vor iOS 16.2).
- Lackieren: kein Aufblitzen der Zeichnung beim Modellwechsel.

## 3.5.7
- Videos werden nur im WLAN vorab geladen, bei Datensparmodus/Mobilfunk nur Standbild.
- Service Worker prüft geänderte Bilder/Videos selbst, liefert bei Netzfehler sauberen Fehler.
- Offline-Text: ca. 80 MB. 61 MB Altlasten (alte Clips, Roh-/Alt-Bilder) aus der Auslieferung entfernt.
- Tagesstart: S51 fährt vorwärts (links nach rechts).

## 3.5.6
- Rolltor nur beim Tipp auf den Werkstatt-Reiter, nicht bei internen Schritten.
- Inhalt: ZT 300, Verbrennung, Mathe 0,17, Komma vor dass, AM/60 km/h, S50 3,6 PS, Elternseite 126 Missionen, Technik-Quiz Antwortlängen angeglichen.

## 3.5.5 (2026-11-18)
- Tipp auf den Bildschirm beendet laufende Übergangs-Animation (0,35 s Ausblenden, Ton und Video stoppen, Tipp wird nicht weitergegeben).

## 3.5.4 (2026-11-18)
- Start-Ton: echte Aufnahme Tomos Colibri 50 cm³ (Work With Sounds / Technisches Museum Slowenien, CC BY 4.0), Credit auf der Elternseite.

## 3.5.3 (2026-11-18)
- Weiches Einblenden aller Übergänge (0,55 s). Rolltor-Aufnahme gefiltert (Lowpass 3 kHz, Notch 2420 Hz). Start-Ton: echter Simson-Leerlauf folgt.

## 3.5.2 (2026-11-18)
- Start-Übergang „Hofeinfahrt“ (Flow-Video), Garage-Video mit Werkstatt und Simsons, Rolltor-Sound als echte Aufnahme (Wikimedia Commons, Public Domain).

## 3.5.1 (2026-11-18)
- Prüfstand-Übergang als Flow-Video (4,6 s), sanftes Ausblenden aller Übergänge (1,1 s). Garage-Übergang vorübergehend aus (neues Video mit Werkstatt folgt).

## 3.5.0 (2026-11-18)
- Übergangs-Animationen für Prüfstand, Lernen, Garage und Tagesstart (Flow-Bilder, WebAudio-Sound). Prüfstand-Start-Knopf oben. Service Worker lädt nicht gespeicherte Videos komplett (Klapprad-Start).

## 3.4.6 (2026-11-18)
- Rolltor: feste Höhe statt aspect-ratio, JPG/PNG statt WebP, keine CSS-Sperre bei reduzierter Bewegung. Klapprad-Video neuer Dateiname (Cache).

## 3.4.5 (2026-11-18)
- Werkstatt-Rolltor bei jedem Tipp, auch bei reduzierter Bewegung. Klapprad: normales Prüfstandsvideo ohne Effekte.

## 3.4.4 (2026-11-18)
- Klapprad: Start-Knopf im Prüfstand-Reiter. Prüfstand: alle Modelle ohne Sperr-Markierung startbar.

## 3.4.3 (2026-11-18)
- Rasentraktor: KI-Prüfstandsvideo (Flow, 10 s) wie bei den Mopeds, inline mit Poster; Ersatz-Sound nur ohne Clip.

## 3.4.2 (2026-11-18)
- Rasentraktor im Prüfstand: fotorealistisches Werkstattfoto (Flow) statt freigestelltem Foto.

## 3.4.1 (2026-11-18)
- Limits wieder aktiv (test:false). Rasentraktor im Prüfstand (Foto, ohne Gurte, echter Sound CC BY 4.0 WWS/Tekniska museet).
- Werkstatt/Prüfstand plausibel (BERICHT-werkstatt-pruefstand.md), Klassenstufe (BERICHT-klassenstufe.md), fix-ui.js (Neustart, Toast, alte Werkstatt).

## 3.4.0 (2026-11-18)
- TESTVERSION (`APP.test`): alles frei, Garage need=0. Vor echtem Einsatz auf false.
- Offline-Paket (94 Dateien inkl. Prüfstand-Clips), SW liefert mp4 mit Range (206) aus dem Cache.
- Ritzel 14 (r14) und Klapprad-Schmalreifen (rs) ohne Sperre.
- PS/Hubraum vereinheitlicht (BERICHT-ps-werte.md), 144 Quizfragen umformuliert (BERICHT-quiz.md).
- Animierter Hintergrund, Lack zeigt Original, Tablet-Urkunde, Tippflächen 44 px, updateViaCache none.
- Nutzungsstatistik (GoatCounter, anonym, Standard an, Eltern-Schalter): Ansichten + Ereignisse.

## 3.3.4 (2026-11-18)
- Prüfstand: KI-Clip inline statt Overlay über Comic-Szene, Standbild-Poster, kein doppelter Synth-Ton.

## 3.3.3 (2026-11-18)
- Neues Rolltor (Foto, DDR-Werkstatt, nachtblau, Simson-Silhouette), Blech-Rolltor-Ton.

## 3.3.2 (2026-11-18)
- Scheunentor: Rahmen, Schwelle und Boden bleiben stehen, nur das Torblatt fährt hoch.

## 3.3.1 (2026-11-18)
- Rolltor ersetzt durch Holz-Scheunentor (Foto, "Schrauber Scheune Sonnenberg"), langsamer, Knarz-Ton, bei jedem App-Start.

## 3.3.0 (2026-11-18)
- Prüfstand-Ton repariert (window.FX).
- Lackieren ohne Kabinen-Animation, direkter Farbwechsel.
- Prüfstand-Tab: Fahrzeugwechsel rendert Prüfstand statt Werkstatt-Auswahl.
- Werkbank mit Foto-Teilen, Waschen mit Hochdruckreiniger, neue Lern-Fotos.
- Fußzeile ohne alte Versionsnummer.

## 3.2.0 (18.11.2026, Tuning-Fotos S51)
- Tuning nur S51: Teile erscheinen als Fotoebenen (v2/img/ki/tune/, Code v2/tune-foto.js) im Teile-Shop: Sitzbank, Auspuff (Sport/Resonanz), Zylinder (60/70/85/130), Vergaser (19/24/28), Alu-Schrauben (schwarz, blau, hellblau, rot, violett, pink). Zündung und Ritzel bleiben unsichtbar. Geänderte Ebene blendet weich ein.
- Sechs flache Sitzbänke (sf1–sf6) ersetzen sb1/sb2; alte Spielstände werden umgestellt (sb1→sf1, sb2→sf2).
- Werte: S51 Serie 3,4 PS (vorher 3,7), Leistungsmodell (Hubraum-Exponent 1,7), 60er 41 mm, 85er 49 mm, Texte mit Spannen; Belege in chef/nacht/tuning-werte-BERICHT.md (außerhalb des Repos). Mathe-Aufgaben und Garage-Angabe auf 3,4 PS.
- Bild-Cache ss-img-v10, tune-foto.js im Core. Offen für ein Update: Schrauben realistischer (größere Nahaufnahme).

## 3.1.0 (18.11.2026, M1 Grundgerüst)
- Antippen: Browser-Seitenübergang abgeschaltet (schluckte Taps ca. 0,3 s und konnte nach dem Antippen zurückspringen); ganze Karten sind Knöpfe (Kinder-Elemente fangen keine Taps ab).
- Installationshinweis war durch ein CSS-Problem ein großer runder Klecks über den Garagenkarten; jetzt flache Leiste.
- favicon.ico und apple-touch-icon.png im App-Stamm ergänzt (Browser fragen sie automatisch an, vorher 404).
- Neu: Klicktest (v2/klicktest.sh, klicktest.py). Cache-Namen: ss-core-3.1.0, ss-img-v5.

## 3.0.2 (18.11.2026)
- Datenschutz: Quizbild mit Rechnung einer Privatperson entfernt (Datei nach img/foto/alt/), Quiz nutzt ein KI-Bild.
- Zeitdruck ist jetzt standardmäßig aus (Blitzrunde, Tagesauftrag, Kundendialog) und nur nach Einschalten aktiv; „Los, erzähl!“ heißt „Erzähl, wenn du magst“.
- Fakten: PS-Werte Star 3,4 / Habicht 3,4 / S50 3,6; Hubraum S51 in Texten 49,8 cm³; Tank-Aufgaben als „Reservekanister“; Erklärung das/dass korrigiert (Probe „welches“).
- Bildnachweis: KI-Bilder nach Vorlage entsprechend benannt; LIZENZ-CHECK und ORIGINALTREUE aktualisiert.
- Offline-Paket lädt jetzt auch Titel-, Missions- und Fotobilder; Service Worker schließt img/referenz vom Cache aus (Bild-Cache v4).
- Versionsanzeige erscheint sofort; Tipp-Punkte am Rasentraktor neu auf die aktuellen Bilder gesetzt.

## 3.0.0 (17.11.2026)
- Installieren als App: eigener Dialog (Android/Chrome/Edge/Samsung), animierte Anleitung (iPhone/iPad), Knopf in der Kopfzeile, Safari am Mac: Ablage → Zum Dock hinzufügen.
- Offline: Service Worker mit versioniertem Cache, Update-Hinweis ohne Zwang.
- Spielstand sicher: doppelt gespeichert (localStorage + IndexedDB), dauerhafter Speicher angefragt, Sichern als Datei (`Schrauberschule-Spielstand-DATUM.json`) mit Prüfsumme, Laden mit Prüfung, Übertrag per Code und QR (lokal erzeugt), Erinnerung nach Meilensteinen, Hinweis für iPhone-Browser.
- Spielstand-Schema 2 mit automatischer Migration alter Stände (vorher Sicherungskopie).
- Darstellung: zweispaltige Layouts ab 700 px, breite Oberfläche auf Desktop, Safe-Areas, Zurück-Taste, Tastaturbedienung, Fokusrahmen, Tippflächen ab 44 px.
- Manifest vollständig (id, maskable Icons, orientation any).

## Paket 10 (17.11.2026)
- Serienleistung: S51 3,7 / SR50 3,6 / KR51/2 3,6 / S50 3,4 PS. Waschen+Lackieren im Werkstatt-Auftrag. Desktop ab 1700 px breiter, Prüfstand zweispaltig. Weiße/silberne Fahrzeuge umfärbbar, Werkstattbilder, Studio, Karte, Wallpaper, Video färben mit.
