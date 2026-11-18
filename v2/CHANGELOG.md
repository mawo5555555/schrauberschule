# Änderungsprotokoll Schrauberschule

Versionsnummer steht an EINER Stelle: `v2/version.js` (`APP.version`, `APP.schema`, `APP.news`).
Regel: 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
Neuer Spielstand-Aufbau → `APP.schema` um 1 erhöhen und in `v2/migrate.js` einen Schritt `MIGS[alt]` ergänzen.
Ablauf Update: version.js ändern → Service Worker bekommt neuen Cache-Namen → Nutzer sieht „Neue Version verfügbar – Jetzt aktualisieren“ → danach „Was ist neu?“ (Text aus `APP.news`).

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
