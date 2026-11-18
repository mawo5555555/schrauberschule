# Prüfung KI-Bilder V2 (Stand 16.11.2026)

Bildstil: siehe `STIL.md`. Jedes Bild wird dreimal geprüft: (a) Form und Proportionen, (b) Details gegen Referenzfoto, (c) Stil. Alte Bilder liegen in `alt/`, Rohdateien (PNG) in `roh/`.

Dienst: ChatGPT (kostenlos, vorhandenes Konto, normaler neuer Chat je Bild; "Temporärer Chat" kann keine Bilder). Referenzfoto wurde bei Fahrzeugen mit Vorlage mit hochgeladen. Format 3:4 (1086x1448) bzw. 1:1 (1254x1254) geprüft mit sips.

| Datei | Versuche | a Form | b Details | c Stil | Ergebnis |
|---|---|---|---|---|---|
| hero.jpg | 1 | ja | ja | ja | ersetzt |
| s51.jpg | 1 | ja | ja (grün/silber, kein Logo; winzige unleserliche Prägung am Motordeckel) | ja | ersetzt |
| schwalbe.jpg | 2 (V1 ohne Referenz wegen Upload-Fehler, V2 mit Referenz) | ja | ja | ja | ersetzt |
| sr50.jpg | 1 | ja | ja | ja | ersetzt |
| werkstatt.jpg | 1 | ja | n/a (kein Referenzfoto) | ja | ersetzt |
| pruefstand.jpg | 1 | ja | n/a | ja | ersetzt |
| zylinder.jpg | 2 | ja | ca. 9 bis 10 sichtbare Rippen statt 11, sonst plausibel | ja | ersetzt |
| vergaser.jpg | 1 | ja | plausibel (kein Referenzfoto) | ja | ersetzt |
| auspuff.jpg | 1 | ja | ja | ja | ersetzt |
| zuendung.jpg | 1 | ja | ja | ja | ersetzt |
| s50.jpg | 1 | ja | ja (gelb, ohne Aufkleber) | ja | ersetzt |
| habicht.jpg | 1 | ja | ja | ja | ersetzt |
| star.jpg | 0 | - | - | - | offen, ChatGPT-Bildlimit erreicht (Reset ca. 17.11. 18:27) |
| duo.jpg | 0 | - | - | - | offen |
| klapprad.jpg | 3 (FLUX.1-schnell-Space, danach Gast-Quota weg) | ja | teilweise: rotes Stahlrad, 20-Zoll-Speichenrader, Gepacktrager, Schutzbleche, Lenker/Sattelstutze lang; ABER kein erkennbares Klappgelenk, Frontgepacktrager statt Dynamo-Detail | ja (Fenster oben, kein Logo) | teilweise (Datei klapprad.jpg = Versuch 3, roh/flux/klapprad1-3.jpg) |

## Garage-Bilder (offen, alle noch nicht erzeugt)
Die App (`content.js`, Liste GARAGE) nutzt im Projektordner `img/ki/` und `img/foto/`. Zuordnung alte Datei → neue Datei:
- img/foto/rasen-front.jpg → ki/garage-rasentraktor.jpg
- img/foto/zt300-gelsdorf.jpg → ki/garage-zt300.jpg
- img/ki/traktor-anhaenger.jpg → ki/garage-traktor-anhaenger.jpg
- img/foto/e512-seite.jpg → ki/garage-e512.jpg
- img/ki/unimog.jpg → ki/garage-unimog.jpg (Referenz Unimog 406)
- img/ki/feldhaecksler.jpg → ki/garage-feldhaecksler.jpg
(S51, SR50, Schwalbe nutzen bereits die neuen Fahrzeugbilder.)

## Dienststand
- ChatGPT: Bildlimit erreicht ("morgen um 18:27").
- Gemini: "Limit erreicht".
- Copilot: nur mit Anmeldung, nicht genutzt.
Hinweis: Neue Dateien liegen in `v2/img/ki/`, die App liest `img/ki/` im Projektstamm; vor Einbau dorthin kopieren (nicht getan).

## FLUX-Versuch (Hugging Face, 16.11.)
- FLUX.1-schnell-Space ohne Anmeldung: nach 3 Bildern 'ZeroGPU quota exceeded' (Gastkontingent, Reset unbekannt); FLUX.1-dev gleicher Fehler. Weiter nur mit HF-Konto (nicht erlaubt).
- Pollinations (ohne Anmeldung) getestet: schlechte Qualitat und Wasserzeichen-Logo, verworfen.
- Offen: star, duo, sr50 neu, zylinder neu (nicht erzeugt).

## FLUX-Lauf mit HF-Konto (16.11., FLUX.1-schnell-Space, 768x1024, 4 Schritte)
Rohdateien: roh/flux/*_hf*.jpg, alte Versionen als alt/*_vorher.jpg.

| Datei | Versuche | Ergebnis | Bemerkung |
|---|---|---|---|
| klapprad.jpg | 3 (hf1-hf3) | teilweise | blau, 20-Zoll, hoher Chromlenker, Gepaecktraeger, Scheinwerfer, cremefarbene Reifen, Kettenschutz; Klappgelenk nur angedeutet (Klemmblock im unteren Rohr), Sattel braun statt schwarz, Dynamo nicht klar erkennbar. FLUX kennt kein Klapprad-Gelenk. |
| star.jpg | 1 | ok (plausibel) | Moped mit Rahmen, Rundscheinwerfer, Teleskopgabel, Speichenraeder, Motor sichtbar, gruen; keine Schrift. Kein Referenzfoto, Details nicht verifizierbar. |
| duo.jpg | 1 | ok | ein Vorderrad, zwei Hinterraeder, Verdeck, Lenker; kleine unleserliche Aufschrift an der Verkleidung. |
| sr50.jpg | 3 (hf1 Heckansicht, hf2 Frontansicht, hf3 Seite 3/4) | teilweise | runde Kunststoffverkleidung, kleine Gussraeder, Trittbrett, Doppelsitz; zusaetzlich Windschild und Spiegel (am Original nicht), wirkt etwas vespa-artig. |
| zylinder.jpg | 0 | offen | HF-Tageslimit ZeroGPU erreicht |
| garage-rasentraktor.jpg, garage-zt300.jpg, garage-traktor-anhaenger.jpg, garage-e512.jpg, garage-unimog.jpg, garage-feldhaecksler.jpg | 0 | offen | HF-Tageslimit ZeroGPU erreicht ("Unlock 8x more AI power with PRO"; kein Abo abgeschlossen) |
