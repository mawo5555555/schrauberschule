# Bild-Prompts für ChatGPT (oder ein anderes Bildmodell)

Ziel: hochwertige, detailgetreue Bilder im gleichen Stil, damit die App einheitlich aussieht. Die App sucht die Bilder automatisch. Fehlt eine Datei, zeigt die App stattdessen ein Symbol.

## Gemeinsamer Stil (jedem Prompt voranstellen)

> Fotorealistisches Studio-Rendering, Dreiviertel-Ansicht von vorn links, mittig, Fahrzeug vollständig sichtbar, sehr detailreich (Schweißnähte, Schrauben, Chrom, Lack, Reifenprofil), weiches Studiolicht mit dezentem Randlicht in Orange, dunkler Anthrazit-Verlauf als Hintergrund (fast schwarz), leichte Bodenspiegelung, kein Text, keine Logos, keine Personen, quadratisch 1:1, 1024 × 1024.

## Garage (Dateien `img/garage1.png` bis `img/garage8.png`)

1. **Simson S51** (garage1): „Eine DDR-Simson S51 Mokick in Orange mit schwarzem Sitz, Rundscheinwerfer, Rohrrahmen, Speichenräder, luftgekühlter Zweitaktmotor mit schrägem Zylinder und Kühlrippen, chromfarbener Auspuff mit Endtopf auf der rechten Seite.“
2. **Rasentraktor** (garage2): „Ein roter Rasentraktor mit Fahrersitz, Lenkrad, Mähdeck unter dem Fahrzeug, Fangkorb hinten, grobe Hinterreifen, saubere frisch gemähte Streifen im Hintergrund angedeutet.“
3. **Kleiner Traktor** (garage3): „Ein kleiner grüner Kompakttraktor mit offener Fahrerkabine, großen Hinterrädern mit Stollenprofil, Hubarmen am Heck, vorn Frontgewicht.“
4. **Traktor mit Anhänger** (garage4): „Ein grüner Traktor mit Kabine zieht einen Kippanhänger, beladen mit Getreide, Staub und goldenes Licht angedeutet.“
5. **Mähdrescher** (garage5): „Ein großer Mähdrescher mit breitem Schneidwerk (Haspel), Kabine, Körnertank, im Stil eines DDR-Mähdreschers.“
6. **Simson Schwalbe** (garage6): „Eine Simson Schwalbe KR51 in Cremeweiß mit rundem Heck, Beinschilden, runden Rückspiegeln, Chromdetails.“
7. **Unimog** (garage7): „Ein Unimog Geräteträger mit hoher Bodenfreiheit, Portalachsen, robuster Kabine, mit Zusatzgerät am Heck.“
8. **Feldhäcksler** (garage8): „Ein Feldhäcksler für Mais mit großem Maisgebiss vorn und langem Auswurfkrümmer, orange-grüne Lackierung, Staub im Gegenlicht.“

## Tuning-Variante (zusätzliche Bilder, optional, `img/tuning1.png` bis `img/tuning4.png`)

- „Eine Simson S51 im Tuning-Aufbau auf einer Werkbank: Tuning-Zylinder mit bearbeiteten Kühlrippen und Zylinderkopf, Rennvergaser, Resonanzauspuff, sauber verlegte Kabel, Werkstatt-Atmosphäre, realistische Details.“
- „Nahaufnahme eines Simson-Motors mit 70-ccm-Zylinder-Set, Kolben und Pleuel daneben auf einem Werkstatttuch.“
- „Technische Explosionsdarstellung eines Zweitaktmotors im Stil einer Betriebsanleitung, beschriftete Teile (Zylinder, Kolben, Pleuel, Kurbelwelle) im Fotostil.“
- „Eine Reihe von Tuning-Zylindern mit 50, 60, 70 und 85 ccm nebeneinander, mit Größenvergleich.“

## Missions-Titelbilder (Dateien `img/m-<mission-id>.jpg`, 16:9)

Format: 1600 × 900. Gleicher Stil wie oben, nur 16:9 und ohne Personen. Die Mission-ID steht im Code (zum Beispiel `mathe-8`, `nawi-8`, `deutsch-7`). Beispiele:

- `m-mathe-1.jpg`: Nahaufnahme einer Tankuhr und eines orangefarbenen Simson-Tanks, Sonnenlicht.
- `m-mathe-2.jpg`: Luftaufnahme eines frisch gemähten Rasens mit Streifen und einem Rasentraktor.
- `m-mathe-8.jpg`: Drei Tuning-Zylinder nebeneinander in einer Werkstatt.
- `m-nawi-8.jpg`: Aufgeschnittener Zweitaktmotor als Schnittmodell, sauber ausgeleuchtet.
- `m-nawi-13.jpg`: Nahaufnahme einer Hand voll dunkler Erde mit einem Regenwurm, im Hintergrund ein Traktor auf dem Feld.
- `m-englisch-10.jpg`: Bauernhof am Morgen mit Traktor und Scheune, goldenes Licht.

Hinweis: Marken (Simson, Unimog) erscheinen nur als Fahrzeugtyp, bitte ohne sichtbare Logos erzeugen. Bilder prüfen, bevor sie in die App kommen.
