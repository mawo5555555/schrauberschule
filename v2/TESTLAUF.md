# TESTLAUF Schrauberschule v3.0 (16.11.2026)

Methode: Headless Chrome mit Testharness, der wie ein Kind durch die App geht (Antippen, Ziehen, Regler, richtig und falsch). Viewports 390x844 (Hochformat) und 844x390 (quer). Ergebnis nach allen Fixes: 0 Fehlschlaege, 0 JS-Fehler, 0 Chrome-Konsolenfehler.

## Abdeckung
- Neuer Spieler: Begruessung, 0 Punkte/0 Taler, Werkstatt S51 komplett (Auftrag, Zerlegen, Teile waehlen, Einbauen, Pruefstand, Abnahme), Punkte/Taler kommen an, Studio-Exporte (wall, card, cert, cmp, poster, sticker, PDF), Neuladen erhaelt Stand.
- Alle Missionen aller Typen (Fehlersuche, Ziehen, Regler, Kunde, Bild, Blitz u. a.) richtig und falsch gespielt, Wertung/Belohnung/localStorage geprueft.
- Freischaltung: 28 Teile, 5 Modelle, 8 Werkzeuge, Stufen und Budget jeweils bei n-1 gesperrt, bei n frei.
- Garage: je Fahrzeug eine Mission; alle 8 Modelle inkl. Klapprad in der Werkstatt komplett durchgespielt.
- Alle Tabs, Zurueck-Buttons, Eltern-Seite, Ton an/aus.
- Layout Hochformat ueberall, Querformat nur Zerlegen/Einbauen/Pruefstand.
- Leistungsmodell: alle Teile-Kombinationen x Duesen x Mopeds endlich und plausibel; zu jeder Kombination gibt es eine rehbraune Duese; Klapprad-Modell ebenso.
- Inhalt: Mathe-Loesungen nachgerechnet (Duesenflaeche, Prozent, MwSt, Flaechen, Bremsweg, Hubraum, 2^(1/3)), Simson-Daten gegen FAKTENCHECK.md.

## Gefunden und behoben (Backups in alt/)
1. Klapprad Phase 2 stuerzte ab ("M is not a function"): lokale Konstante M verdeckte Hilfsfunktion M(). Fix in klapprad.js (alt/klapprad.vor-test.js), umbenannt in MD.
2. "Fortschritt zuruecksetzen" liess Taler, Tagesauftrag-Serie und Werkstattdaten stehen. Fix: resetAll() in freischalten.js (alt/freischalten.vor-test.js).
3. Querformat: obere Kopfleiste auf Inhaltsbreite geschrumpft. Fix in theme.css (alt/theme.vor-test.css).
4. Inhalt: KR51/2 Produktionsbeginn 1975 statt 1980 (werkstatt2.js, alt/werkstatt2.vor-test.js; BAUSTAND.md angepasst).

## Offen
- Nicht getestet: echtes iPhone-Gefuehl, Ton/Haptik, echtes Touch-Ziehen.
- Klapprad-Zertifikat ohne Studio-Export (bekannt).
- Eltern-Ton-Checkbox aktualisiert das Label erst beim naechsten Render.
- Teilename "Ritzel 14 Zaehne" im Freischalt-Hinweis zwischen Moped und Klapprad mehrdeutig.
- Fuer g1, g6, g9 gibt es keine Fahrzeug-Missionen.
- Bilder sind SVG-Platzhalter; klapprad.jpg liegt vor, steht aber nicht im Manifest (Bildertausch morgen).
- Duo (Krankenfahrstuhl, drei Raeder) laut FAKTENCHECK weiter "unsicher".

## Screenshots (shots/)
test-01-start-hochformat.png, test-02-fehlersuche-hochformat.png, test-03-teile-gesperrt-hochformat.png, test-04-zerlegen-quer.png, test-05-pruefstand-quer.png, test-06-werkzeugwand-hochformat.png
