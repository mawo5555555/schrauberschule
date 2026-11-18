# Bilder-Inventur Schrauberschule v2

Stand 2026-11-16. Quelle: statische Prüfung (grep) von `v2/index.html`, `v2/*.js`, `v2/*.css` und der über `<base href="../">` eingebundenen Root-Dateien (`content.js`, `app.js`, `c-*.js`, `garage.js` usw.). Abmessungen in Pixeln (Rasterbilder mit PIL gemessen, SVG per viewBox).

Kontaktbögen: `v2/shots/bilder-bogen-1.png` bis `bilder-bogen-5.png` (alle 73 Rasterbilder dieser Tabelle, 4 Spalten, 300 px breit).

Herkunft: `ki` = KI-Bild (v2/img/ki bzw. Dateiname mit ki), `foto` = echtes Foto (Wikimedia laut Bildnachweis oder eigenes Foto), `svg` = Zeichnung, `alt` = Datei aus der alten App (Root `img/`), `Icon` = App-Symbol.

## A. Von der App angezeigt

| Datei | Wo verwendet (Bildschirm / Funktion) | Herkunft | Abmessung (px) |
|---|---|---|---|
| `v2/img/ki/auspuff.jpg` | Mission-Karte Englisch (`mdtImg`, `MDT_IMG`, Hälfte je nach Mission-ID) | ki (v2) | 1254×1254 |
| `v2/img/ki/duo.jpg` | Werkstatt: Fahrzeugkarte und Werkstatt-Bild Simson Duo (`pic('duo')`), Studio-Bild (`carImg`) | ki (v2) | 941×1672 |
| `v2/img/ki/habicht.jpg` | Werkstatt: Fahrzeugkarte und Bild Simson Habicht (`pic`), Studio-Bild | ki (v2) | 1086×1448 |
| `v2/img/ki/hero.jpg` | Werkstatt-Startseite Titelbild (`pic('hero')`, werkstatt2.js), Mission-Karte Deutsch | ki (v2) | 1086×1448 |
| `v2/img/ki/pruefstand.jpg` | Mission-Karte Mathe und Technik (`MDT_IMG`) | ki (v2) | 1086×1448 |
| `v2/img/ki/s50.jpg` | Werkstatt: Fahrzeug Simson S50 (`pic`), Studio-Bild | ki (v2) | 1086×1448 |
| `v2/img/ki/s51.jpg` | Werkstatt: Fahrzeug Simson S51 (`pic`), Studio-Bild; Garage Simson S51 (g1, `GIMG`) | ki (v2) | 1086×1448 |
| `v2/img/ki/schwalbe.jpg` | Werkstatt: Fahrzeug Schwalbe (Schlüssel `schwalbe`), Garage Schwalbe (g6, `GIMG`), Mission-Karte Englisch | ki (v2) | 1086×1448 |
| `v2/img/ki/sr50.jpg` | Werkstatt: Fahrzeug Simson SR50 (`pic`), Studio-Bild; Garage SR50 (g9, `GIMG`) | ki (v2) | 1086×1448 |
| `v2/img/ki/star.jpg` | Werkstatt: Fahrzeug Simson Star (`pic`), Studio-Bild | ki (v2) | 941×1672 |
| `v2/img/ki/vergaser.jpg` | Mission-Karte Mathe (`MDT_IMG`) | ki (v2) | 1254×1254 |
| `v2/img/ki/werkstatt.jpg` | Mission-Karte Deutsch (`MDT_IMG`) | ki (v2) | 1086×1448 |
| `v2/img/ki/zuendung.jpg` | Mission-Karte Naturwissenschaften (`MDT_IMG`) | ki (v2) | 1254×1254 |
| `v2/img/ki/zylinder.jpg` | Mission-Karte Naturwissenschaften und Technik (`MDT_IMG`) | ki (v2) | 1254×1254 |
| `img/ki/traktor-anhaenger.jpg` | Garage Traktor mit Anhänger (g4): Fallback, weil `v2/img/ki/garage-traktor-anhaenger.jpg` fehlt | alt (ki, alte App) | 800×800 |
| `img/ki/unimog.jpg` | Garage Unimog (g7): Fallback, weil `v2/img/ki/garage-unimog.jpg` fehlt | alt (ki, alte App) | 800×800 |
| `img/ki/feldhaecksler.jpg` | Garage Feldhäcksler (g8): Fallback, weil `v2/img/ki/garage-feldhaecksler.jpg` fehlt | alt (ki, alte App) | 800×800 |
| `img/foto/rasen-front.jpg` | Garage Rasentraktor (g2): Fallback, weil `garage-rasentraktor.jpg` fehlt; Lernschritt "Von vorn" (`SVGS.rasenfront`) | foto (eigenes Foto) | 1000×1333 |
| `img/foto/rasen-motor.jpg` | Lernschritt "Motor und Deck" (`SVGS.rasenmotor`) | foto (eigenes Foto) | 1000×1333 |
| `img/foto/zt300-gelsdorf.jpg` | Garage Fortschritt ZT 300 (g3): Fallback, weil `garage-zt300.jpg` fehlt; Quizfrage Fahrzeug (c-technik) | foto (Wikimedia, CC0) | 960×952 |
| `img/foto/e512-seite.jpg` | Garage Mähdrescher E 512 (g5): Fallback, weil `garage-e512.jpg` fehlt; Quizfrage (c-technik) | foto (Wikimedia, CC BY-SA 4.0) | 960×720 |
| `img/foto/s51-calau.jpg` | Quizfrage "Welches Fahrzeug ist das?" Simson S51 (c-technik) | foto (Wikimedia, CC0) | 960×1280 |
| `img/foto/s51-b24.jpg` | Quizfrage Postmoped S51 (c-technik) | foto (Wikimedia, CC BY-SA 4.0) | 960×640 |
| `img/foto/schwalbe-kr51-2.jpg` | Quizfrage Schwalbe KR51/2 (c-technik) | foto (Wikimedia, gemeinfrei) | 960×684 |
| ~~`img/foto/honda-mtx200r.jpg`~~ | ENTFERNT (Paket 8): nach `img/foto/alt/` verschoben, Quizfrage in c-technik.js und Eintrag in content.js (CREDITS) entfernt | foto (Wikimedia, CC BY-SA 4.0) | 960×720 |
| `img/cover/hof-1.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/hof-2.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/hof-3.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/hof-4.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/ki-feldhaecksler.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof bzw. traktor) | alt (ki) | 720×378 |
| `img/cover/ki-traktor-anhaenger.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof bzw. traktor) | alt (ki) | 720×378 |
| `img/cover/ki-unimog.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema hof bzw. traktor) | alt (ki) | 720×378 |
| `img/cover/simson-1.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/simson-2.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/simson-3.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/simson-4.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/simson-ki-s51.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (ki) | 720×378 |
| `img/cover/simson-ki-schwalbe.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (ki) | 720×378 |
| `img/cover/simson-ki-sr50.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema simson) | alt (ki) | 720×378 |
| `img/cover/traktor-1.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema traktor) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/traktor-2.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema traktor) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/traktor-3.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema traktor) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/traktor-4.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema traktor) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/tuning-1.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema tuning) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/tuning-2.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema tuning) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/tuning-3.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema tuning) | alt (Foto-Ausschnitt) | 720×378 |
| `img/cover/tuning-4.jpg` | Titelbild Lektion (Wissen-Schritt, Quiz-Schritt) und Abschluss-Screen (`coverSrc`, Datei je nach Mission-ID-Hash aus `COVERS`, Thema tuning) | alt (Foto-Ausschnitt) | 720×378 |
| `img/m-deutsch-3.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-deutsch-7.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-englisch-7.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-englisch-10.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-englisch-11.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-1.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-2.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-3.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-4.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-6.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-7.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-mathe-8.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-2.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-6.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-8.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-9.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-10.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-12.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-13.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-nawi-16.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-technik-1.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-technik-3.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-technik-8.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `img/m-technik-10.jpg` | Titelbild der Mission (`MIMG_LIST` in content.js, `coverSrc` hat Vorrang vor `COVERS`); Lektion und Abschluss | alt (eigenes Titelbild) | 960×504 |
| `icon-180.png` | Apple-Touch-Icon (v2/index.html), Logo im Video-Export (studio.js) | Icon | 180×180 |
| `icon-512.png` | App-Icon im Manifest (v2/manifest.webmanifest) | Icon | 512×512 |
| `img/cover/sport-1.svg` | Titelbild Thema Sport (Sprech-Missionen, `COVERS.sport`) | svg (Zeichnung) | 720×378 (viewBox) |
| `img/cover/sport-2.svg` | Titelbild Thema Sport (`COVERS.sport`) | svg (Zeichnung) | 720×378 (viewBox) |
| `icon.svg` | Favicon (`<link rel="icon">` in v2/index.html) | svg (Icon) | 512×512 (viewBox) |

Summe: 73 Rasterbilder (14 ki in v2, 22 Titelbilder Cover, 24 Titelbilder m-*, 8 Fotos, 3 alte KI-Bilder für Garage, 2 Icons) plus 3 SVG-Dateien.

## B. Liegen herum, werden nicht (oder nie) angezeigt

| Datei | Status | Herkunft | Abmessung (px) |
|---|---|---|---|
| `v2/img/foto/habicht.jpg` | nicht angezeigt: PICMAP-Fallback, wird nie erreicht, weil `v2/img/ki/habicht.jpg` in manifest.js steht | foto | 1200×900 |
| `v2/img/foto/kr51.jpg` | nicht angezeigt: Fallback für Schwalbe, wird nie erreicht (ki-Bild vorhanden) | foto | 1200×900 |
| `v2/img/foto/s50.jpg` | nicht angezeigt: Fallback, nie erreicht | foto | 1200×900 |
| `v2/img/foto/s51.jpg` | nicht angezeigt: Fallback, nie erreicht | foto | 1200×956 |
| `v2/img/foto/sr50.jpg` | nicht angezeigt: Fallback, nie erreicht | foto | 900×675 |
| `v2/img/ki/klapprad.jpg` | nicht angezeigt: fehlt in manifest.js, daher zeichnet `pic('klapprad')` die SVG-Zeichnung (svgKlapp). Mit bilder-aktualisieren.sh neu erzeugen, dann erscheint das Foto | ki | 768×1024 |
| `img/ki/s51.jpg` | nicht angezeigt: nur Fallback für Garage g1, v2-Datei lädt vorher | alt (ki) | 800×800 |
| `img/ki/schwalbe.jpg` | nicht angezeigt: nur Fallback für Garage g6 | alt (ki) | 800×800 |
| `img/ki/sr50.jpg` | nicht angezeigt: nur Fallback für Garage g9 | alt (ki) | 800×800 |
| `img/foto/zt300-seite.jpg` | nicht angezeigt: nur im Bildnachweis (content.js) genannt, kein Bildaufruf | foto | 960×933 |

Nicht referenziert (Rohdaten, Entwürfe, Screenshots): `v2/img/ki/roh/` (19 Einträge inkl. `flux/`), `v2/img/ki/alt/` (16), `v2/entwurf/` (PNG-Entwürfe), `v2/alt/shots/` (10), `v2/shots/` (App-Screenshots, keine App-Bilder). `v2/img/teile/` ist leer, `teilBild()` liefert daher nie ein Bild. `v2/img/referenz/` wird nicht eingebunden.

## C. Auffälligkeiten

- **Garage:** Die sechs Dateien `v2/img/ki/garage-*.jpg` (Rasentraktor, ZT 300, Traktor mit Anhänger, E 512, Unimog, Feldhäcksler) fehlen. Angezeigt werden deshalb die alten Root-Bilder aus `content.js` (Fallback-Kette in garage2.js: neues Bild, dann `g.img`, dann Emoji).
- **Klapprad:** `v2/img/ki/klapprad.jpg` existiert, steht aber nicht in `v2/img/manifest.js`. Die App zeigt deshalb die SVG-Zeichnung. Nach dem Neuerzeugen des Manifests (`bilder-aktualisieren.sh`) würde das Foto erscheinen.
- **Foto-Fallback:** `pic()` in fx.js prüft `manifest.js` nur einmal beim Laden. Alle Schlüssel mit Foto-Eintrag liegen auch als ki-Bild vor, deshalb wird `v2/img/foto/` nie benutzt. Bei einem Ladefehler gibt es ebenfalls keinen Rückfall auf das Foto.
- **Missions-Titelbilder:** `missionen2.js` setzt `m.cov` nirgends. Die Titelbilder laufen deshalb immer über die alte `coverSrc`-Logik (`MIMG_LIST` und `COVERS`). Die Missionskarten selbst nutzen dagegen `mdtImg` mit `v2/img/ki`.
- **Pfade:** `v2/index.html` hat `<base href="../">`. Alle Pfade wie `v2/img/...` und `img/...` sind daher Root-relativ.
- Zwei Quellen für Bildinfos: `img/` (alt) und `v2/img/` (neu) enthalten gleiche Motive (z. B. `s51`, `sr50`, `schwalbe`) in unterschiedlicher Größe (800×800 alt, 1086×1448 neu). Die alten Root-Versionen werden nur im Fallback gezeigt.
