# KONZEPT V2.0: Simson-Tuningwerkstatt

Zielgruppe: 11 Jahre, Handy hochkant, Schulstoff Klasse 6 Brandenburg. Nur Genre und Spielidee der „Simson Tuningwerkstatt 3D“ sind Vorbild, Name, Grafik, Texte und Layout sind eigen.

## Spielablauf (Werkstatt-Tab)
1. **Fahrzeug holen:** Simson S51, SR50 oder Schwalbe KR51/2 (Foto, Steckbrief, Serienwerte).
2. **Auftrag:** Kunde mit Wunsch und Budget 450 €. Aufgaben: Auftrag aufnehmen, sprechen, Regeln.
3. **Zerlegen:** Werkbank-Szene, Teile antippen in sinnvoller Reihenfolge (Kerze, Kopf, Zylinder, Kolben). Jedes Teil zeigt deutschen und englischen Namen plus Fakt.
4. **Teile wählen:** Zylinder 50/60/70/85, Vergaser 16/19/24, Auspuff, Zündung, Ritzel 14 bis 17, mit Preis, Budgetbalken und Live-Leistung. Aufgaben: Hubraum berechnen (V = π·(d:2)²·h), Kosten, Übersetzung, englisches Einkaufsgespräch.
5. **Einbauen:** neue Teile an die gestrichelten Plätze, Reihenfolge von unten nach oben. Aufgaben: Anleitung, Drehmoment über Kreuz, Erklären.
6. **Prüfstand und Probefahrt:** Hauptdüse per Kerzenbild abstimmen (weiß/rehbraun/schwarz), Leistungskurve gegen Serie, Tachoanimation. Aufgaben: Diagramm lesen, Prozent, Leistung ~ Tempo³, Prüfbericht.
7. **Abnahme:** Zertifikat, Eintrag unter „Fertige Aufbauten“, Rang Azubi, Geselle, Tuner, Werkstattmeister.
Zusätzlich: **Mix-Training** (8 gemischte Aufgaben aus allen Fächern) auf Startseite und im Werkstatt-Tab.

## Inhaltsplan
Alle 49 bisherigen Missionen und die Profi-Werkstatt bleiben. Neu: 13 Missionen (Mathe: Werkstattrechnung, Übersetzung, Prüfstand-Kurve; Deutsch: Anleitung, Händlerbrief, Fachwörter; Englisch: Parts and Tools, At the Parts Shop, Workshop Instructions; NaWi: Zweitakt, Kühlrippen, Resonanz, Abgas und Regeln) plus 5 dynamische Lernrunden je Auftrag, die sich nach den gewählten Teilen richten. Wiederholung läuft über das vorhandene Boxenstopp-System (Abstände 1/3/7/21 Tage) und das neue Mix-Training. Fortschritt gilt gemeinsam mit V1 (gleicher Speicher).

## Optik
Dunkle Werkstatt mit Metall-Verläufen und orangem Glühen, große Fotokarten, runde Karten, Daumenzonen unten. Teile sind selbst gezeichnete SVGs mit Metallverlauf, Kühlrippen, Chrom, Messing. Fotos: freie Wikimedia-Bilder und eigene KI-Bilder aus V1 (BILDQUELLEN.md). Eigene Foto-Teile (ChatGPT) werden automatisch benutzt, sobald `v2/img/teile/<Teile-ID>.png` liegt (BILD-PROMPTS.md).

## Was erfolgreiche Apps zeigen (Recherche, Zahlen ungefähr, Tracker-Schätzungen)
- Car Mechanic Simulator 21: ca. 4,4 bis 4,5 Sterne, mehrere Mio. Downloads. Trägt: Aufträge, Teile freischalten, Werkstatt ausbauen.
- Car Mechanic Simulator Racing: ca. 3 Mio. Installs, ca. 4,7 Sterne. Tuning als Kern.
- My Little Work Garage (Kinder): ca. 54 Tsd. Installs, 4,3 Sterne. Kleine Nische, echte Garagenidee.
- Simson Tuningwerkstatt 3D (nur Steam): ca. 97 % positiv bei ca. 440 Bewertungen. Kritik: Bugs, wenig Inhalt für den Preis.
- Anton: ca. 17 Tsd. Downloads (unsicher), Münzen als Belohnung, wirkt beim Wiederholen. Kritik: Mikrotransaktionen.
- Duolingo: Streaks bilden Gewohnheit, aber Eltern berichten Druck. Daraus: Streak ja, ohne Strafdruck.
- Lehre: Kurze Runden, sichtbarer Fortschritt (Schrittleiste, Zertifikat), Auftragsschleife, Freischalten und Sammeln. Nicht belegt: Mitbestimmung, hier fachlich trotzdem gewollt (Teilewahl).
- Zahlen schwanken bis Faktor 5 bis 7, nur Größenordnung nutzen. Konzepte übernommen, nichts kopiert.

## Vorschläge (nicht umgesetzt; S50, S70, Habicht sind inzwischen dabei)
1. Mehr Modelle: S50, S70 Enduro, KR50, Habicht, Star, Duo (Fotos zuerst prüfen).
2. Fotos der Teile per ChatGPT (Prompts bereit), danach 3D-Drehansicht mit three.js.
3. Lackieren und Aufkleber, Fahrzeug-Fotoalbum, Wochen-Auftrag mit Sonderwunsch.
4. Fehlersuche als Rätsel (springt nicht an: Kerze, Vergaser, Zündung).
5. Teile-Sammelalbum mit Original- und Tuningnummern, mit Papa zusammen ausfüllbar.
6. Echte Prüfstandsmessung vergleichen (Vater misst, Sohn trägt Werte ein).
Grenzen: Leistungs- und Preiswerte sind gerundete Spielwerte. Straßenbetrieb nur mit Prüfung und Eintragung, das steht in der App.

## Stand V2.0 (Umbau auf Entwurf B, Farbe „blau“)
Simson-Blau mit Chrom, Schrauber-Begrüßung, Ton-Schalter (Web-Audio), Funken/Rauch/Prüfstandsrolle, Teile fliegen beim Aus- und Einbau, Querformat für Start, Werkstatt, Prüfstand, Foto-Studio. Modelle: S51, Schwalbe, SR50, S50, Habicht, Star, Duo (kein S70, alte Spielstände werden bereinigt). Bilder: `v2/img/ki/<name>.jpg`, sonst `v2/img/foto/`, sonst SVG. Nach neuen Bildern `v2/bilder-aktualisieren.sh` ausführen (schreibt `img/manifest.js`). Realistische Tuningdaten und Quellen: `TUNING-DATEN.md` (Schätzungen sind markiert).
Foto-Studio nach der Abnahme: Hintergrundbild 1170×2532, Sammelkarte mit Album, Zertifikat (PNG/PDF), Vorher-Nachher, Sticker 512×512 transparent, Poster A4 mit Explosionszeichnung (PNG/PDF), Video teilen (9:16, MP4 oder WebM), Garage-Galerie, Familien-Bestenliste (lokal). Alles lokal per Canvas, Teilen über Web-Share, sonst Download.

## Weitere Ideen (Vorschläge, nicht umgesetzt)
1. Fehlersuche als Rätsel: Die Simson springt nicht an, Kerze, Vergaser, Zündung der Reihe nach prüfen (Lernen: Ursache und Wirkung).
2. Lackieren und Aufkleber: eigene Farbe und Nummernschild-Schriftzug, erscheint auf Studio-Bild, Karte und Sticker.
3. Wochen-Auftrag mit Sonderwunsch (z. B. „leise und sparsam“ oder „maximale Spitze“), Wertung in der Familien-Bestenliste.
4. Echte Prüfstandsmessung vergleichen: Vater misst, Sohn trägt die Werte ein, die App zeigt Abweichung zum Spielwert.
5. Teile-Sammelalbum mit Original- und Tuningnummern, zusammen mit Papa auszufüllen; später 3D-Drehansicht der Teile.

## Pflicht-Regel (Nutzer, 16.11.)
Tuning-Erfolge und Tuning-Teile sind an den Lernfortschritt gekoppelt: Teile, Werkzeuge, Modelle und Werkstatt-Stufen werden nur durch absolvierte Lernfelder (Missionen, Sterne, richtige Antworten) freigeschaltet bzw. bezahlt. Bessere Lernleistung = bessere Teile / mehr Budget. Kein Freischalten ohne Lernen.
