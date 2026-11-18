# LIZENZ-CHECK Schrauberschule v2

Stand: 18.11.2026 (Nachtlauf). Geprüft: Projektordner `v2/` plus die Root-Dateien, die die App über `<base href="../">` lädt (`content.js`, `app.js`, `c-*.js`, `garage.js`, `tuning.js`, `werkstatt.js`, `ws3d.js`, `img/`, `icon*`).

**Methode:** Bilddateien per Pfadsuche und Prüfsumme gegen den ausgelieferten Code abgeglichen (`index.html`, `*.js`, `*.css`, `v2/img/manifest.js`, `sw.js`). Quellen und Lizenzen aus `lib/LIZENZ.txt`, `img/referenz/QUELLEN.md`, `BILDQUELLEN.md`, `BILDER-INVENTUR.md`, `BAUSTAND.md`, `ORIGINALTREUE.md`, `img/ki/PRUEFUNG.md`, den Bildnachweisen in `content.js` (CREDITS) und `v2/werkstatt2.js` (PHOTO_CREDITS), dazu Kommentare im Code. Sichtprüfung von 6 Bildern.

**Nicht geprüft:** Die Wikimedia-Commons-Seiten wurden nicht online abgerufen. Lizenzen sind so übernommen, wie sie in den Projektnotizen stehen. Die Nutzungsbedingungen der KI-Dienste (Gemini, ChatGPT, FLUX) habe ich nicht geprüft. Die Bilder tragen keine Metadaten (EXIF/C2PA), die den Erzeuger nennen würden. Deshalb stammen alle Erzeugerangaben aus den Notizen.

Legende: ✓ belegt und passend · ⚠ Angabe fehlt oder ist unklar · ✗ Handlungsbedarf

---

## 1. Sofort prüfen (vor jeder Veröffentlichung)

1. **✗ Personenbezogene Daten im Quiz:** `img/foto/s51-calau.jpg` zeigt eine Rechnung von 1990 mit dem handschriftlichen Namen einer Privatperson, einem Adressfragment und einer Fahrgestellnummer. Das Bild wird in der Quizfrage „Welches Fahrzeug ist das?“ (`c-technik.js`, Simson S51) verwendet. Die CC0-Angabe deckt das Foto ab, nicht die abgebildeten Personendaten. Die App richtet sich an Kinder. **Empfehlung:** Quizfrage und Bildnachweis-Eintrag entfernen oder durch ein Foto ohne Dokument ersetzen. Die Datei nach `alt/` verschieben, nicht löschen. Entscheidung: Nutzer.
2. **✗ Referenzordner würde mitveröffentlicht:** `v2/img/referenz/` (19 Dateien) ist nicht im Code referenziert und nicht im Service Worker vorgesehen. Die Git-Remote ist `github.com/mawo5555555/lernwerkstatt`, die Seite läuft über GitHub Pages. `v2/` ist noch nicht committet. Sobald der Ordner committet wird, sind `img/referenz/`, `img/ki/neu/`, `img/ki/roh/`, `img/ki/alt/`, `alt/`, `shots/` und `entwurf/` öffentlich abrufbar. **Empfehlung:** vor dem ersten Commit per `.gitignore` ausschließen oder außerhalb des Repos ablegen. Nichts davon wurde verändert.
3. **✗ Zylinder-Referenz:** Das KI-Bild `img/ki/zylinder.jpg` ist laut `BAUSTAND.md` mit einem Händlerfoto (akf-shop.de) als Vorlage erzeugt. Die Notiz `img/referenz/zylinder/HINWEIS.txt` sagt „nur Referenz, nicht veröffentlichen“. Die Rechte an dem Händlerfoto sind ungeklärt. **Empfehlung:** Rechte klären oder das Bild ohne diese Vorlage neu erzeugen. Entscheidung: Nutzer.

---

## 2. Bilder in der App (ausgeliefert und genutzt)

### 2a. Wikimedia-Fotos mit Bildnachweis

| Datei | Verwendung | Quelle (laut Nachweis) | Lizenz | Status |
|---|---|---|---|---|
| `v2/img/foto/s51.jpg` | Werkstatt-Fallback S51 | Commons „Simson S51 B2-4 from 1980 original condition II“, Max schwalbe | CC BY-SA 4.0 | ✓ Nachweis in PHOTO_CREDITS. Commons-Link und Änderungshinweis (verkleinert) fehlen. |
| `v2/img/foto/sr50.jpg` | Werkstatt-Fallback SR50 | Commons „Simson SR50 1 CE“, Marcin Księżyk | CC BY-SA 3.0 | ✓ wie oben |
| `v2/img/foto/kr51.jpg` | Fallback Schwalbe | Commons „Simson Schwalbe KR51.2 N 1983 original II“, Max schwalbe | CC BY-SA 4.0 | ✓ wie oben |
| `v2/img/foto/s50.jpg` | Fallback S50 | Commons „Simson S 50 B von 1978“, Max schwalbe | CC BY-SA 4.0 | ✓ wie oben |
| `v2/img/foto/habicht.jpg` | Fallback Habicht | Commons „Habicht SR4-4“, Martin Jorgel | „gemeinfrei“ (Angabe) | ⚠ Gemeinfreiheit bei Fotos ist nicht selbstverständlich. Commons-Seite prüfen. |
| `img/foto/s51-b24.jpg` | Quiz (Postmoped) | „DDR Postmoped Simson S51 B2-4“, Historiker BRD DDR (content.js CREDITS) | CC BY-SA 4.0 | ⚠ Nachweis vorhanden. Sichtprüfung: wirkt nicht wie ein klassisches Foto, Schrift auf dem Tank und an der Tasche ist lesbar, Logo „Deutsche Post“ sichtbar (Marke). Herkunft nicht bestätigt. |
| `img/foto/s51-calau.jpg` (18.11.2026: aus Quiz und CREDITS entfernt, Datei nach img/foto/alt/) | Quiz „Welches Fahrzeug ist das?“ | „Simson S51 (Calau, Mobile Welt des Ostens)“, Stefan Kühn | CC0 1.0 | ✗ Personendaten im Bild, siehe Abschnitt 1. BILDQUELLEN.md sagt „in V2 nicht genutzt“. Das ist falsch, die Datei wird in `c-technik.js` verwendet. |
| `img/foto/schwalbe-kr51-2.jpg` | Quiz Schwalbe | „Simson Schwalbe KR51/2“, Metal-star | gemeinfrei (Angabe) | ⚠ wie habicht.jpg |
| `img/foto/zt300-gelsdorf.jpg` | Garage-Fallback ZT 300, Quiz | „Fortschritt ZT 300, Gelsdorf 2011“, Slick | CC0 1.0 | ✓ Nachweis in content.js |
| `img/foto/zt300-seite.jpg` | nur Nachweis, Vorlage für `garage-zt300.jpg` | „Fortschritt ZT 300, Seitenansicht“, Fiver, der Hellseher | CC BY-SA 4.0 | ✓ Nachweis. Vorlage für KI-Bild, siehe 2c. |
| `img/foto/e512-seite.jpg` | Garage-Fallback E 512, Quiz | „Mähdrescher Fortschritt E 512 …“, Fiver, der Hellseher | CC BY-SA 4.0 | ✓ Nachweis in content.js |
| `img/foto/rasen-front.jpg`, `img/foto/rasen-motor.jpg` | Lernschritt, Vorlage für `garage-rasentraktor.jpg` | „eigenes Foto“ laut BILDER-INVENTUR | Nutzer | ⚠ Nicht gesichtet. Rechte liegen laut Angabe beim Nutzer. |

### 2b. Titelbilder und Missionsbilder (ohne belegte Quelle)

| Datei | Verwendung | Erzeuger / Quelle | Lizenz | Status |
|---|---|---|---|---|
| `img/cover/hof-1..4.jpg` (4) | Titelbild Lektion, Thema Hof | Inventur: „alt (Foto-Ausschnitt)“ – Stand 18.11.2026: inzwischen KI-Bilder, keine Quelle | unbekannt | ⚠ Quelle fehlt. Sichtprüfung hof-1: keine Personen. |
| `img/cover/simson-1, -2, -4.jpg` | Titelbild Thema Simson | Inventur: „alt (Foto-Ausschnitt)“ – Stand 18.11.2026: inzwischen KI-Bilder | unbekannt | ⚠ Quelle fehlt. Sichtprüfung: keine Personen. BILDER-NEU-LISTE („Person + Wiese“) ist veraltet. |
| `img/cover/simson-3.jpg` | Titelbild Simson | Gemini Pro (17.11.) mit Wikimedia-Referenzen, danach ChatGPT-Neufassung (BAUSTAND) | KI, Referenzen CC BY-SA | ⚠ Erzeuger laut Notiz ChatGPT. Ableitung von CC-BY-SA-Referenzen offen (siehe 4). |
| `img/cover/traktor-1..4.jpg` (4) | Titelbild Thema Traktor | Inventur: „alt (Foto-Ausschnitt)“ – Stand 18.11.2026: inzwischen KI-Bilder | unbekannt | ⚠ Quelle fehlt. |
| `img/cover/tuning-1, -3, -4.jpg` | Titelbild Thema Tuning | Inventur: „alt (Foto-Ausschnitt)“ – Stand 18.11.2026: inzwischen KI-Bilder | unbekannt | ⚠ Quelle fehlt. |
| `img/cover/tuning-2.jpg` | Titelbild Tuning | Gemini Pro (17.11.), Referenz S51-Motor (Wikimedia) | KI, Referenzen CC BY-SA | ⚠ wie simson-3 |
| `img/cover/sport-1.jpg`, `sport-2.jpg` | Titelbild Sport | nicht in git, keine Quelle | unbekannt | ⚠ Quelle fehlt. Notiz sagt „noch alt (brauchen Gemini)“ für die SVG-Fassungen. |
| `img/m-*.jpg` (24 Dateien, Missionsbilder) | Missionskarten und Titelbild | Inventur: „alt (eigenes Titelbild)“ | unbekannt | ⚠ Belegt laut Protokoll: m-mathe-2 und m-mathe-6 (Gemini Pro), m-nawi-12 (Gemini Pro), m-deutsch-7 (ChatGPT). Vermutet Gemini: m-englisch-10, m-mathe-1, m-deutsch-3. Übrige 17 Dateien: keine Angabe. |

### 2c. KI-Bilder `v2/img/ki/` (21 Dateien in `img/manifest.js` eingetragen)

Erzeuger laut Notizen. Die Notizen sind nicht immer eindeutig, siehe Spalte „Hinweis“.

| Datei | Verwendung | Erzeuger (laut Notiz) | Referenzfotos | Status / Hinweis |
|---|---|---|---|---|
| `auspuff.jpg` | Mission Englisch | ChatGPT (16.11., PRUEFUNG.md) | keine | ✓ Erzeuger. KI-Ausgabe, Dienst-AGB offen. |
| `hero.jpg` | Startseite, Mission Deutsch | ChatGPT (16.11.) | keine | ✓ wie oben |
| `habicht.jpg` | Werkstatt, Studio | ChatGPT (16.11.) | foto/habicht.jpg | ✓ Erzeuger. Referenz-Lizenz wie 2a. |
| `pruefstand.jpg` | Mission Mathe/Technik | ChatGPT (16.11.) | keine | ✓ wie oben |
| `s50.jpg` | Werkstatt, Studio | ChatGPT (16.11.) | foto/s50.jpg (CC BY-SA 4.0) | ⚠ CC-BY-SA-Referenz, siehe 4. |
| `s51.jpg` | Werkstatt, Garage g1 | ChatGPT (16.11.); spätere Neufassung „mit Patina“ (17.11.), Dienst nicht eindeutig | Wikimedia-S51-Fotos (CC BY-SA) | ⚠ Erzeuger der aktuellen Datei nicht eindeutig. BILDQUELLEN.md nennt „KI-Bild des Nutzers“, das widerspricht PRUEFUNG.md. |
| `schwalbe.jpg` | Werkstatt, Garage g6 | ChatGPT (16.11., V2 mit Referenz), Neufassung „mit Patina“ (17.11.) | Schwalbe-Fotos CC BY-SA | ⚠ wie s51 |
| `sr50.jpg` | Werkstatt, Garage g9 | ChatGPT (17.11., Neufassung; frühere Fassung Gemini Pro) | sr50-bj93, sr50-ce (CC BY-SA 4.0 bzw. 3.0) | ⚠ CC-BY-SA-Referenz, siehe 4. |
| `vergaser.jpg` | Mission Mathe | ChatGPT (16.11.) | keine | ✓ Erzeuger |
| `werkstatt.jpg` | Mission Deutsch | ChatGPT (16.11.) | keine | ✓ Erzeuger |
| `zuendung.jpg` | Mission Naturwissenschaften | ChatGPT (16.11.) | keine | ✓ Erzeuger |
| `zylinder.jpg` | Mission NaWi/Technik | Gemini Pro (17.11., mit Händler-Referenz) | Händlerfoto akf-shop.de | ✗ siehe Abschnitt 1, Punkt 3 |
| `star.jpg` | Werkstatt | **unbekannt** | keine | ⚠ Byte-identisch mit `alt/star.jpg` (16.11. 18:48). Vermutlich nie ersetzt. PRUEFUNG.md nennt einen FLUX-Versuch, der nicht installiert wurde. |
| `duo.jpg` | Werkstatt, Studio | **unbekannt** | keine | ⚠ Byte-identisch mit `alt/duo.jpg` (16.11. 18:48). Wie star.jpg. |
| `klapprad.jpg` | Werkstatt | Gemini Pro (17.11., BAUSTAND) | `img/referenz/klapprad/mifa-blau.jpg` (vom Nutzer geliefert, Urheber unbekannt) | ⚠ Referenz-Rechte klären. PRUEFUNG.md (FLUX) ist überholt. |
| `garage-rasentraktor.jpg` | Garage g2 | Gemini Pro (17.11.) | `img/foto/rasen-front.jpg` (Nutzer) | ✓ Erzeuger |
| `garage-zt300.jpg` | Garage g3 | Gemini Pro (17.11.) | `img/foto/zt300-seite.jpg` (CC BY-SA 4.0) | ⚠ CC-BY-SA-Referenz, siehe 4. |
| `garage-traktor-anhaenger.jpg` | Garage g4 | Gemini Pro (17.11., nur Text) | keine | ✓ Erzeuger |
| `garage-e512.jpg` | Garage g5 | Gemini Pro (17.11.) | `img/foto/e512-seite.jpg` (CC BY-SA 4.0) | ⚠ CC-BY-SA-Referenz, siehe 4. |
| `garage-unimog.jpg` | Garage g7 | Gemini Pro (17.11., nur Text) | keine | ✓ Erzeuger. Unimog ist eine Marke (nominativ). |
| `garage-feldhaecksler.jpg` | Garage g8 | Gemini Pro (17.11., nur Text) | keine | ✓ Erzeuger |

### 2d. Icons und Zeichnungen

| Datei | Verwendung | Erzeuger | Lizenz | Status |
|---|---|---|---|---|
| `v2/icons/icon-192, icon-512, apple-touch-180, maskable-512.png` | App-Symbol | Gemini Pro (17.11., BAUSTAND) | KI-Ausgabe | ✓ Erzeuger. `maskable-192.png` ist nicht referenziert. |
| `icon.svg`, `icon-180.png`, `icon-512.png` (Root) | Favicon, Fallback | **unbekannt** (13.11., alt) | unbekannt | ⚠ Quelle fehlt. Ob sie noch geladen werden, prüfen (`icon.svg` ist im Head verlinkt). |
| SVG-Zeichnungen im Code (`art.js`, `pruefstand-art.js`, `anim.js`, `c-grafik.js` u. a.) | Teile, Fahrzeugzeichnungen | eigene Zeichnungen (BILDQUELLEN.md) | eigener Code | ✓ kein Fremdmaterial |

---

## 3. Schriften, Audio, Bibliotheken

- **Schriften:** ✓ Keine Schriftdateien, keine `@font-face`-Regeln, keine Google-Fonts-Links. Es gilt der Systemschriften-Stack (`-apple-system`, `system-ui`, `Segoe UI`, `ui-monospace`).
- **Audio:** ✓ Keine Audiodateien. Töne werden per Web Audio synthetisiert (`v2/pruefstand-ton.js`: Rauschen, Filter, Waveshaper). Die Freesound-Aufnahmen (CC0, IDs 378347/378349) und Garelli Bonanza (CC BY-SA 3.0) dienen nur zum Abgleich der Klangwerte und sind nicht eingebaut. Die Notiz sagt „nach Simson-Referenz“, das sind Zahlenwerte, keine Samples. Falls später Samples eingebaut werden, Lizenz erneut prüfen.
- **Bibliothek `v2/lib/qrcode.js`:** qrcode-generator von Kazuhiko Arase, **MIT-Lizenz**, Copyright 2009. Lizenz ist vorhanden (`lib/LIZENZ.txt`), aber ⚠ MIT verlangt, dass Copyright-Hinweis **und** Lizenztext in jeder Kopie stehen. Der Dateikopf enthält den Copyright-Hinweis und einen Link auf die Lizenz, aber nicht den Volltext. `lib/LIZENZ.txt` ist eine Zeile. **Empfehlung:** MIT-Volltext ergänzen. Die Version 1.4.4 steht nur in der Notiz, nicht im Code.
- **Weitere Drittbibliotheken / CDNs:** ✓ keine gefunden. Die `https://`-Treffer sind Kommentare, SVG-Namensräume und der Statistik-Endpunkt.
- **Statistik (`v2/statistik.js`):** Enthält goatcounter-Endpunkte, ist aber per `APP_STAT_ENABLED=false` abgeschaltet. Kein Lizenzthema. Falls aktiviert, wären Datenschutzfragen zu klären.
- **Eigener Code:** Im Repo gibt es keine LICENSE-Datei. Lizenzwahl ist Entscheidung des Nutzers.

---

## 4. Referenzfotos `v2/img/referenz/` (19 Dateien)

| Bereich | Dateien | Lizenz laut QUELLEN.md / HINWEIS | Im Code referenziert? |
|---|---|---|---|
| `simson/` (12) | S51, S50, SR50, Schwalbe, Motor- und Post-Fotos | CC BY-SA 3.0/4.0, eine „Public domain“ (s50-b2, nicht online geprüft) | ✓ nein |
| `zylinder/` (2) | s51-zylinder-oben, s51-zylinder-set | akf-shop.de, Händlerfoto, „nur Vergleich“ | ✓ nein, ✗ Rechte offen |
| `klapprad/` (2) | mifa-blau, mifa-gruen | vom Nutzer geliefert | ✓ nein |
| Root (3) | e512-seite, rasen-front, schwalbe-kr51-2 | Kopien der App-Bilder aus `img/foto/` | ✓ nein (die App lädt die Root-Pfade) |

- **Im Code:** ✓ Keine Referenz auf `img/referenz` in `index.html`, `*.js`, `*.css`, `sw.js`. Die Trefferliste für „referenz“ im ausgelieferten Code ist leer.
- **Service Worker:** ✓ Der Cache speichert nur Bilder, die tatsächlich geladen werden. Ausgenommen sind `/v2/shots`, `/v2/alt` und `/v2/entwurf`. `img/referenz` ist nicht ausgenommen. Solange nichts darauf verweist, wird nichts gecacht. **Empfehlung:** zur Sicherheit `/img/referenz/` mit ausnehmen.
- **Veröffentlichung:** ✗ siehe Abschnitt 1, Punkt 2.
- **Lizenz:** CC BY-SA-Fotos dürften nicht ohne Namensnennung und Weitergabe unter gleicher Lizenz veröffentlicht werden. Die Notiz „KI-Bilder daraus sind eigene Neuschöpfungen“ ist keine belegte Rechtsaussage.

---

## 5. Personen und Kinderschutz

- ✗ `img/foto/s51-calau.jpg`: Personendaten einer Privatperson im Bild (siehe Abschnitt 1).
- ✓ Sichtprüfung von 6 Bildern (`s51-calau`, `s51-b24`, `cover/simson-1`, `simson-2`, `simson-4`, `hof-1`): keine Kinder und keine erkennbaren Personen außer dem Dokument oben. Die Notiz BILDER-NEU-LISTE („simson-1..4: Person + Wiese“) ist veraltet.
- ⚠ Nicht gesichtet: Die übrigen rund 80 Bilder der App. Eine vollständige Sichtprüfung wäre der nächste Schritt.

---

## 6. Marken im Bild oder Text

- ⚠ `img/foto/s51-b24.jpg`: Logo „Deutsche Post“ sichtbar. Ob das für eine Lernapp unproblematisch ist, sollte der Nutzer entscheiden.
- ⚠ IFA-Raute: Laut BAUSTAND offener Punkt. Ob sie in KI-Bildern vorkommt, ist nicht geprüft.
- ✓ Marken im Quiztext (Simson, Honda MTX, Unimog) stehen nominativ. Die Quizoption „Honda MTX“ steht noch in `c-technik.js`, obwohl das Foto entfernt wurde.

---

## 7. Konflikte und veraltete Angaben in den Projektnotizen

1. **BILDQUELLEN.md:** s51-calau „in V2 nicht genutzt“ stimmt nicht (`c-technik.js` verwendet es). Zum Bild `img/ki/s51.jpg` steht „KI-Bild des Nutzers“, PRUEFUNG.md nennt ChatGPT.
2. **BILDER-INVENTUR.md (16.11.):** veraltet. `klapprad.jpg` steht laut `manifest.js` drin, die Garagen-Bilder existieren. Die Liste „nicht angezeigt“ stimmt nicht mehr.
3. **PRUEFUNG.md:** Zeile „Weiter nur mit HF-Konto (nicht erlaubt)“, später „FLUX-Lauf mit HF-Konto“. Unklar, ob ein Hugging-Face-Konto neu angelegt wurde. Der Nachtlauf-Regel nach darf kein Konto neu angelegt werden. **Bitte prüfen.**
4. **PRUEFUNG.md** nennt klapprad als FLUX (16.11.). BAUSTAND nennt Gemini Pro (17.11.). Die spätere Angabe gilt.
5. **star.jpg, duo.jpg:** byte-identisch mit den „vorher“-Kopien vom 16.11. Die Notizen beschreiben einen Ersatz, der nicht passiert ist.
6. **Bildnachweise:** Zwei Listen (content.js CREDITS mit 6 Einträgen, werkstatt2.js PHOTO_CREDITS mit 5 Einträgen). Beide zeigen keinen Commons-Link und keinen Änderungshinweis.
7. **Metadaten:** Alle geprüften Bilder sind neu kodiert und ohne EXIF oder C2PA. Erzeugerangaben lassen sich daher nur aus den Notizen übernehmen.

---

## 8. Empfehlungen (priorisiert, nichts davon umgesetzt)

1. **Sofort:** `s51-calau.jpg` aus Quiz und Nachweis entfernen oder ersetzen. Datei nach `alt/` verschieben. (ERLEDIGT 18.11.2026)
2. **Vor dem ersten Commit / GitHub Pages:** `v2/img/referenz/`, `v2/img/ki/neu/`, `v2/img/ki/roh/`, `v2/img/ki/alt/`, `alt/`, `shots/`, `entwurf/` und die Root-Ordner `img/alt`, `img/cover/alt`, `img/foto/alt` per `.gitignore` ausschließen oder außerhalb ablegen. Zusätzlich `/img/referenz/` in `sw.js` ausnehmen. (Nutzer)
3. **Bildnachweis vervollständigen:** Für die CC BY-SA-Fotos Commons-Link, Lizenz-Link und Hinweis „verkleinert/zugeschnitten“ ergänzen. Beide Listen zusammenführen.
4. **Quellen nachtragen:** Für `cover/*`, `m-*.jpg`, `sport-*.jpg` und die Root-Icons Erzeuger oder Quelle eintragen. Bei KI: Erzeuger nennen.
5. **Referenzrechte klären:** Zylinder (Händlerfoto) und KI-Bilder mit CC BY-SA-Referenzen (s50, s51, sr50, schwalbe, garage-zt300, garage-e512, cover/simson-3, cover/tuning-2). Ob eine KI-Ausgabe aus CC-BY-SA-Vorlagen urheberrechtlich frei ist, ist eine Rechtsfrage. Ich empfehle eine Auskunft, bevor die Bilder veröffentlicht werden.
6. **MIT-Volltext** in `lib/LIZENZ.txt` ergänzen (qrcode.js).
7. **Dienst-AGB prüfen:** Gemini, ChatGPT, FLUX (Hugging Face Space; Modelllizenz auf der Modellseite prüfen). Nicht online geprüft.
8. **Dokumentation pflegen:** BILDQUELLEN.md, BILDER-INVENTUR.md und BILDER-NEU-LISTE.md aktualisieren. Diese Datei als zentrale Liste nutzen.
9. **Eigener Code:** LICENSE-Entscheidung treffen.

---

## 9. Grenzen dieser Prüfung

- Keine Online-Prüfung der Commons-Seiten, der KI-Dienste oder der Modelllizenzen.
- Sichtprüfung von 6 Bildern, nicht von allen.
- Rechte am Nutzerfoto `rasen-front.jpg` und an `mifa-blau.jpg` nicht geprüft.
- Keine Änderungen an App-Code, keine Löschungen, keine Uploads, nichts committet.


## Nachtrag 18.11.2026 (Auftrag appfix)
- s51-calau entfernt (Quiz nutzt jetzt v2/img/ki/s51.jpg). CREDITS: s51-b24, schwalbe-kr51-2, zt300-gelsdorf, zt300-seite, e512-seite sind KI-Bilder nach Vorlage (CC BY-SA bzw. CC0) und so benannt. **Offen bleibt die Frage, ob KI-Bilder nach CC-BY-SA-Vorlage als Ableitung gelten (Namensnennung/Weitergabe unter gleicher Lizenz).** Vor Veröffentlichung klären.
- Titelbilder cover/hof, traktor, tuning-1/3/4, simson-1/2/4 in der Tabelle oben: inzwischen KI-Bilder.
- 18.11. (Teil 8): img/ki/zylinder.jpg-Ersatz neu/zylinder-t8-v1.jpg entstand OHNE Haendlerfoto (nur Wikimedia CC BY-SA 4.0: s51-motor-ifa21 / s51-motor-ueberholt). Haendlerfotos liegen in referenz/alt/zylinder-haendler/. Punkt 3 erledigt sobald das neue Bild eingebaut ist.
