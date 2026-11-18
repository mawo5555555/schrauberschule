# Faktencheck Sprachförderung (Stand 16.11.2026)

Geprüft: content.js, c-mathe/deutsch/englisch/nawi/sprechen/technik/extra/grafik.js, v2/c-v2.js, v2/werkstatt2.js, v2/studio.js, v2/TUNING-DATEN.md.
Methode: (1) eigenes Wissen, (2) gebündelte Websuche (Haiku-Subagenten, Budget 25 Suchen). Alle Mathe- und Physikaufgaben wurden mit JavaScriptCore nachgerechnet. Es wurden keine App-Dateien geändert.
Hinweis: Die Websuche-Ergebnisse sind Modellzusammenfassungen. Bei den Befunden "unsicher" fehlt eine zweite harte Quelle, bitte vor Veröffentlichung gegenprüfen.

## A. Falsch (zuerst korrigieren)

| Datei/Stelle | Aussage | Befund | Korrektur | Quelle |
|---|---|---|---|---|
| v2/werkstatt2.js Z.10 (V2V.duo) | "Simson Duo (SR4-3)", Krankenfahrstuhl, drei Räder | falsch | SR4-3 ist der Sperber. Der Duo hat eigene Typbezeichnungen (Duo 4/1, 4/2). Bezeichnung "(SR4-3)" streichen. Ob der Duo als Dreirad gelten darf, ist unsicher, vorsichtig formulieren. | de.wikipedia Simson-Vogelserie / Simson Duo |
| v2/werkstatt2.js Z.7 (V2V.kr51) | "Schwalbe KR51/2, Kleinroller 1964–1986" | falsch | 1964–1986 ist die ganze Schwalbe-Baureihe (KR51 ab 1964). Die KR51/2 wurde 1980–1986 gebaut (KR51/1 1968–1980). NICHT auf 1975 ändern. | de.wikipedia Simson Schwalbe |
| v2/werkstatt2.js Z.175 (Steckbrief Serie) | Hubraum 49,9 cm³, 38 × 44 mm gelten für jedes gewählte Fahrzeug | falsch | Beim Mifa-Klapprad (ohne Motor) sinnlos. Beim Duo und Star nur Richtwert. Steckbrief je Fahrzeug anpassen oder beim Klapprad ausblenden. | eigene Prüfung, V2V.klapp |
| v2/werkstatt2.js Z.16 (z60 Name) | "60er Zylinder", 42 × 44 mm | falsch (Rundung) | 42 × 44 mm ergeben 60,96 cm³, also rund 61 cm³. Handelsübliche 60er haben je nach Hersteller 41 bis 42 mm. Text "ca. 60 cm³ (je nach Hersteller 41 bis 42 mm)" nutzen. | nachgerechnet, area-s51.de |
| v2/werkstatt2.js Z.8 (V2V.s50) | s50 hat "etwas weniger Leistung", ps 3,4, wie Schwalbe | unsicher bis falsch | Serienwerte unterscheiden sich je Baujahr. Als Spielwert kennzeichnen oder Quelle ergänzen. | 2radgeber.de, de.wikipedia |
| v2/werkstatt2.js Z.9 (V2V.star) | Star Höchstgeschwindigkeit 60 km/h, 2,5 PS | unsicher bis falsch | Der Star war zeitweise auf 50 km/h gedrosselt. Der Text nennt "Spielwerte", das schützt, die vmax-Anzeige im Steckbrief nicht. | de.wikipedia Simson Star |

Hinweis: Im Zwischenstand zählte ich 6 klare Fehler. Die Tabelle listet die Stellen, die ich nach dem Zurücklesen noch belegen kann. Die letzten beiden Zeilen (s50, Star) sind eher "unsicher" und zählen nur halb.

## B. Unsicher (Quelle fehlt oder Quellen widersprechen sich)

| Datei/Stelle | Aussage | Befund | Korrektur | Quelle |
|---|---|---|---|---|
| v2/werkstatt2.js Z.30 (Ritzel) | Kettenrad 32 Z, Serie 15 : 32 = 2,13 | unsicher | Der Text sagt selbst "bitte nachzählen". Je nach Modell 32, 34 oder 36 Zähne. Beibehalten, aber als Beispiel markieren. | area-s51.de |
| c-grafik.js (Hinterrad-Spot) | "Hinterrad hat 36 Speichen und Trommelbremse" | unsicher | Trommelbremse stimmt. Speichenzahl nicht belegt, Zahl streichen. | keine zweite Quelle |
| c-nawi.js nawi-18 | "SR50 hat 12 Zoll statt 16 Zoll" | unsicher | SR50 hat kleinere Räder (Schwalbe 16 Zoll, SR50 12 Zoll Hinterrad/Vorderrad je nach Quelle). Vor Veröffentlichung prüfen. | de.wikipedia Simson SR50 |
| werkstatt2.js (Zylinder z70/z85) | 45 × 44 und 50 × 44 mm | unsicher | Rechnerisch 69,98 bzw. 86,4 cm³, passt zu "70er/85er". Marktübliche Maße variieren (Hub 44 bleibt). | nachgerechnet |
| werkstatt2.js (Düsen, Vergaser) | Hauptdüse ca. 75–85 / 95–105 / ab 110 | unsicher | Richtwerte, abhängig von Auspuff und Wetter. Hinweis "Abstimmung nötig" bleibt. | Fachforen |
| werkstatt2.js (Preise, BUDGET 450) | Teilepreise | unsicher | Marktpreise schwanken, nur als Spielwerte kennzeichnen. | Händlerseiten |
| werkstatt2.js (Leistung w2perf) | Leistungsmodell mit PS-Faktoren | unsicher | Ist ein Spielmodell, kein Messwert. Schon im Text als Schätzung markiert. | eigene Prüfung |
| content.js PROJECT | MTX-Zylinder 120–125 cm³ | unsicher | Honda MTX 200 R hat 195 cm³ Serienhubraum. Das Projekt wurde als eigenes Ziel formuliert. Wortlaut klarstellen: Zylinderkit, nicht Serie. | motorradundreisen.de |
| Legalität (content.js, werkstatt2.js, TUNING-DATEN.md) | Mofa/Moped/Mokick, Eintragung | richtig, aber vereinfacht | Hinweise sind als Hinweis formuliert. Für Kind (11) keine Fahrerlaubnis, Fahrten nur auf Privatgelände. Rechtsgrundlagen: StVZO §19, FeV §10. | gesetze-im-internet.de |
| c-nawi.js, c-technik.js (Unimog, Traktor, Mähdrescher) | Allradantrieb Unimog, ZT 300 gebaut in Schönebeck, E 512 Mähdrescher | richtig, Detailwerte unsicher | Zahlen wie Leistung/Baujahr nur dort belassen, wo sie geprüft sind. | de.wikipedia Unimog, ZT 300 |
| Lehrplanbezug Klasse 6 (Brandenburg) | Themen Dezimalzahlen, Bruchrechnen, Prozent, Dreisatz, Einheiten | richtig (grob) | Passt zu Rahmenlehrplan Teil C Mathematik Jgst. 1–10. Nicht einzeln gegen den Plan abgehakt. | bildungsserver.berlin-brandenburg.de |

## C. Richtig (Auswahl, geprüft und nachgerechnet)

| Datei/Stelle | Aussage | Befund | Korrektur | Quelle |
|---|---|---|---|---|
| c-technik.js technik-1, v2 Z.283 | V = π/4 · d² · h, 38 × 44 mm ergibt 49,9 cm³ (49,9 gerechnet) | richtig | – | nachgerechnet |
| v2 Zylinder | 41 mm 58,1; 42 mm 61,0; 45 mm 70,0; 50 mm 86,4 cm³ | richtig | – | nachgerechnet |
| v2 Ritzel | 32:14 = 2,29, 32:15 = 2,13, 32:16 = 2,00, 32:17 = 1,88 | richtig | – | nachgerechnet |
| c-technik.js | P[kW] = M · n / 9549, Mittlere Kolbengeschwindigkeit c = 2 · s · n / 60 | richtig | – | Lehrbuch / Wikipedia |
| c-technik.js | Gemisch 1:50 = 20 ml pro Liter, Verdichtung ε = (Vh + Vc) / Vc | richtig | – | Wikipedia Zweitaktmotor |
| v2/werkstatt2.js | S51 1980–1991, SR50 1987–1991, S50 1975–1980, Habicht 1971–1975, Star 1964–1975 | richtig | – | de.wikipedia, area-s51.de |
| v2/werkstatt2.js | Star 3 Gänge, Habicht 4 Gänge, Zweitakter 49,9 cm³ (Simson-Serie) | richtig | – | de.wikipedia |
| c-mathe.js (1–13), c-v2.js (w1–w3) | alle Rechenaufgaben und Lösungen | richtig | alle Ergebnisse nachgerechnet, keine Abweichung | nachgerechnet |
| c-deutsch.js (1–15), c-v2.js (deutsch-w1–w3) | Wortarten, Satzglieder, Zeiten, Rechtschreibung | richtig | stichprobenartig mit Duden-Regeln verglichen | duden.de |
| c-englisch.js (1–12), c-v2.js (englisch-w1–w3) | Vokabeln, Grammatik (simple present/past) | richtig | – | Cambridge/Oxford Dictionary |
| c-nawi.js (1–18), c-v2.js (nawi-w1–w4) | Viertakt/Zweitakt, Kühlung, Hebel, Reibung, Energie | richtig | – | Wikipedia, Lehrbuchwissen |
| c-extra.js, c-sprechen.js | SORT/GAP/TF/LINE, Sprechaufgaben | richtig | – | eigene Prüfung |

Gesamtzahl geprüfter Aussagen: rund 600 (davon Mathe/Physik nachgerechnet). Fehler: 4 belegt, 2 weitere Randfälle. Unsicher: 11 Stellen (Abschnitt B).
