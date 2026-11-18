# Prüfstand-Recherche (Paket 7)

## Quellen (Web, Stand 16.11.2026)
- MAHA Betriebsanleitung Einrollen-Prüfstand BA053401: https://www.maha.de/support_documents/dokumente/Betriebsanleitungen/04%20Leistungsmesstechnik/BA053401-en.pdf?_locale=en (Absaugung, Gebläse-Position)
- Dynojet Model 250i: https://dynojet.co.uk/products/250i (Vorderrad-Klemme, Radstand-Verstellung, Kühlgebläse ca. 5200 CFM, Abgasabsaugung wegen CO)
- Hickleys MultiScan: https://www.hickleys.com/tools/multiscan.php (Vorderrad in zwei V-Aufnahmen, mit Spanngurten fixiert)
- ISO 6460:1981 / ISO 18580:2015 (Rollenprüfstand mit Bremse und Schwungmassen-Simulation, nur Kurzbeschreibung gelesen)
- Simson-Daten: cyclechaos.com (Schwalbe 50 cm³, 4 PS bei 6500/min, Verdichtung 9,5), akf-shop.de (Tuning: Sport/Resonanz, breiter Drehmomentverlauf). Katalogwerte widersprechen sich (2 kW bis ca. 2,9 kW).

## Abgeleitete Fakten für die Animation
- Hinterrad treibt die Rolle, Vorderrad wird gesichert (Keile, Spanngurte), Gebläse vor dem Fahrzeug, Abgasschlauch am Auspuff.
- Zweitakt-Abgas bläulich-weiß, teils abgesaugt, bei fettem Gemisch mehr.
- Messrechner zeigt Drehzahl, Leistung und Kurve live. Das frühere Glücksrad ist entfernt (`.roller{display:none}`).
- Klapprad: Muskel-Prüfstand, nur Kurbel und Pedale, Anzeige Kadenz, Muskelkraft, Widerstand, Tempo.

## Annahmen (nicht belegt)
Übersetzungen, Maße ("ca."), Farben und Leistungskurven sind frei gewählt; Gaußkurve wie die App-Kurve. Kein Foto/echte Messdaten.

## Klangvergleich (nur Analyse)
Referenzen: zwei Wikimedia-Commons-Aufnahmen (Garelli Bonanza 50 cm³, D-4-Fahrradmotor), nur im Scratchpad zur Analyse, nicht in der App. Lizenzangaben konnten wegen Rate-Limit der Commons-API nicht bestätigt werden, deshalb keine Weitergabe.
Befund: Grundton rpm/60 Hz dominiert, starke 2. und 4. Harmonische, breites Plateau 1,5 bis 5 kHz bei ca. -15 bis -20 dB.
Synthese per OfflineAudioContext gerendert, Terzband-Vergleich: RMS-Abweichung 8,6 / 6,3 / 10,3 dB (2190, 5730, 6630 U/min), vorher ca. 16 dB. Grafik: `shots/sound-vergleich.png` (rechts: Serie, Sport, Resonanz, 70 cm³ ändern das Spektrum). Rest: Harmonische bei hoher Drehzahl etwas zu schwach.

### Klangvergleich Simson (Nacht 17.11.2026, Schrauberschule v3.0 Sound 2)
- Referenzen: echte Simson-Aufnahmen gefunden: Freesound 378347 (Leerlauf-Datei) und 378349 (Motor-Datei), CC0, nur 128-kbit/s-Vorschauen, Modell/Auspuff/Mikrofon unbekannt. Commons hat in den Simson-Kategorien keine Audiodateien, archive.org und Shops nichts. Zusätzlich Garelli Bonanza (Commons, CC BY-SA 3.0) als Näherung. Liste mit Lizenz und URL: `~/Downloads/claude/chef/nacht/sound-ref/QUELLEN.md`. Vorschläge für bessere Aufnahmen: `.../sound-ref/VORSCHLAEGE.md`.
- Methode: OfflineAudioContext in headless Chrome (Skripte `~/Downloads/claude/chef/nacht/sound-tools/`: synth.py, compare.py, figure.py), je 5 Zufallsstartwerte gemittelt, Terzbänder 63 Hz bis 8 kHz, beide Spektren auf Gesamtenergie normiert (Absolutpegel nicht vergleichbar). Drehzahl = 60 x gemessene Periodizität (Annahme eine Zündung je Umdrehung, Oktav-Mehrdeutigkeit nicht ausgeschlossen).
- Zündfrequenz: Synthese trifft die Soll-Frequenz (57,7 / 69,3 / 78,3 / 91,7 / 113,3 Hz gegen gemessen 57,6 / 69,3 / 78,3 / 91,6 / 113,4 Hz per Autokorrelation).
- Befund Simson: Synthese hatte zu wenig Energie bei 0,4 bis 1,6 kHz (ca. -4 dB) und 2 bis 8 kHz (ca. -6 dB, bei 8 kHz bis -20 dB). Geändert: Profile o/s/r in pruefstand-ton.js (Mitten- und Höhenanteil, Rauschen, Ring angehoben; Sicherung `alt/pruefstand-ton.vor-sound2.js`). Pegel/Spitzen unverändert (RMS Ausgang gleich, Spitze bis 0,58 bei Serie 7000 U/min).
- RMS-Abweichung je Zustand (dB, vorher -> nachher): niedrig 3460 U/min Simson 9,7 -> 6,6; mittel 4160 Simson 9,8 -> 7,5; mittel2 4700 Simson 8,3 -> 6,2; hoch 5500 Garelli 6,0 -> 6,2; hoch2 6800 Garelli 7,9 -> 7,7. Mittel 8,3 -> 6,8 dB. Grafik: `shots/sound-vergleich-s51.png`.
- Nicht verglichen: Leerlauf bei 1300 U/min und Vollgas bei ca. 6500 U/min mit Simson (die Clips liegen nur bei ca. 3500 bis 4700 U/min bei Annahme 1 Zündung je Umdrehung); Serie gegen Sport (Auspuff der Aufnahmen unbekannt, Profile s und r nur im Abstand mitgezogen); Hüllkurve nur optisch (Zündabstand stimmt, Amplitudenmodulation der echten Aufnahme dichter/rauer); Bediengeräusche; Tomos-Dateien geladen aber nicht ausgewertet. Nach der Änderung liegt Garelli hoch über 5 kHz bis 13 dB zu hell. Terzbänder unter 400 Hz sind stark von der Harmonischenlage abhängig, die Abweichung dort bleibt groß. Gehörtest steht aus.

## Bediengeräusche
Blinkerschalter-Klick, Gang-Klack (Tabwechsel), Zündschlüssel, Kickstarter (Missionsstart), Hupe "Möp" (Fehler), Relais-Tick (Timer): rein synthetisch, FX.tick ersetzt, Ton-Schalter gilt. Keine vergleichbaren freien Simson-Aufnahmen gefunden, daher nur nach Beschreibung entworfen (nicht verglichen).
