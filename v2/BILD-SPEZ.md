
## Teil 6 (17.11. nachts)
### ki/sr50 (Versuch 1)
- Refs: referenz/simson/sr50-bj93.jpg (Seite), sr50-ce.jpg (3/4)
- Prompt: Reproduce exactly the Simson SR50 from the reference photos: open telescopic fork with bare chrome stanchions NO rubber gaiters, white 5-spoke plastic wheels, leg shield, white side panels with red Simson decal, short exhaust hidden low, red seat. Dark workshop, wear/patina, 16:9.
- Verbot: Faltenbälge, langes Chromrohr, erfundene Logos, Speichenräder
### m-nawi-16 (Versuch 1)
- Refs: s51-motor-links.jpg (links), s51-motor-rechts.jpg (rechts), aktuelles img/m-nawi-16.jpg (Komposition)
- Prompt: Edit image 3 so engine matches photos 1+2 exactly; ONLY change cables: spark plug cable runs from the angled plug cap (front top of head) freely over/beside carburetor backwards, NOT ending in carburetor; separate throttle cable enters top of carburetor. Keep both covers (left with 4 + IFA rhombus, right oval).
- Verbot: Zündkabel am Vergaser endend, Gaszug+Zündkabel verschmolzen, erfundene Logos
- m-nawi-16 V1 FEHLGESCHLAGEN: KI kopierte Entwurf, Kabel unveraendert (neu/m-nawi-16-v1.jpg).
### m-nawi-16 (Versuch 2)
- Refs: nur s51-motor-links.jpg + s51-motor-rechts.jpg (kein Entwurf)
- Prompt: Reproduce engine exactly; bench scene; spark plug cable leaves plug cap and runs AWAY from carburettor to the upper left behind the engine (ignition coil under tank, out of frame); throttle cable separate, enters top of carburettor from the right.
- m-nawi-16 V2 FEHLGESCHLAGEN: Zuendkabel-Bogen endet weiter am Vergaserdeckel (neu/m-nawi-16-v2.jpg); Rest (Kopf, Deckel 4+IFA, Oval) sehr gut.
### m-nawi-16 (Versuch 3, letzter)
- Refs: links+rechts. Prompt: plug cable goes straight UP out of frame at the top edge; carburettor gets only a thin steel throttle cable with small sleeve; no thick black cable near the carburettor.
### m-technik-10 (Versuch 1)
- Refs: s51-motor-links.jpg, s51-motor-rechts.jpg, neu/m-nawi-16-v3.jpg (korrigierte Kabel)
- Prompt: Keep engine and cables exactly as image 3 (matches photos 1+2); add yellow multimeter with red/black probe leads on bench at left, loose carburettor part on bench in front. Plug cable stays going up, throttle cable separate.
- Verbot: Zuendkabel am Vergaser, neue Logos
- m-technik-10 V1 OK (neu/m-technik-10-v1.jpg).
### m-nawi-8 (Versuch 1)
- Refs: s51-motor-links.jpg, s51-motor-rechts.jpg
- Prompt: same exterior as photos; one part of cylinder and crankcase cut open (cutaway: piston, connecting rod, crankshaft, transfer ports visible) while rest intact, same head, carburettor, covers; cables as nawi-16 (plug cable up, throttle separate). Display stand on workshop table.
- Verbot: V-Motor, erfundene Logos, Kabel am Vergaser endend
- m-nawi-8 V1: Schnitt+Kabel gut, aber Deckel mit SIMSON-Oval + '4' vermischt (neu/m-nawi-8-v1.jpg) -> Mischfehler links/rechts.
### m-nawi-8 (Versuch 2)
- Refs: NUR s51-motor-links.jpg; Ansicht von links; Deckel mit 4 + IFA-Raute, KEIN SIMSON-Schriftzug.
- KORREKTUR nach Zoom: m-nawi-16-v3, m-technik-10-v1 und m-nawi-8-v2 zeigen das schwarze Zuendkabel weiterhin im Bogen zum Vergaserdeckel (Fehler bleibt). m-nawi-8-v2 sonst gut (Schnitt, 4-Deckel, IFA, kein SIMSON).
### m-nawi-8 (Versuch 3) = gezielte Bearbeitung von neu/m-nawi-8-v2.jpg
- Ref: m-nawi-8-v2.jpg + s51-motor-links.jpg. Prompt: edit only the cable: remove black cable section that goes down to the carburettor; plug cable leaves cap and goes up out of the top edge; carburettor keeps only the thin throttle cable. Everything else pixel-identical.
- m-nawi-8 V3 (Bearbeitung) OK: Zuendkabel geht nach oben aus dem Bild, Gaszug separat, Rest unveraendert (neu/m-nawi-8-v3.jpg). Methode "gezielte Bearbeitung des Vorbilds, nur Kabel aendern" funktioniert.
### m-technik-10 (Versuch 2) = Bearbeitung von neu/m-technik-10-v1.jpg, gleicher Prompt wie nawi-8 V3
- m-technik-10 V2 (Bearbeitung) OK: Zuendkabel nach oben aus Bild, Gaszug separat, Multimeter/Tools unveraendert (neu/m-technik-10-v2.jpg).
### m-nawi-16 (Versuch 4 – ueber 3er-Limit, neue Methode, im Bericht ausgewiesen) = Bearbeitung von neu/m-nawi-16-v3.jpg, gleicher Prompt
- m-nawi-16 V4 (Bearbeitung): Kabel geht oben raus, laeuft aber hinter dem Vergaser wieder herab -> ZWEIFEL, nicht weiter versucht (neu/m-nawi-16-v4.jpg). Rest wie Referenz.
### m-deutsch-7 (Versuch 1)
- Refs: s51-motor-links.jpg + s51-motor-rechts.jpg (Zylinder+Kopf Form)
- Prompt: only the cylinder with cylinder head of the M541 (no crankcase, no covers) standing on a wooden workbench; box-shaped finned head, fins like photos, angled spark plug cap front top; kerzenschluessel nearby. No cables to carburettor, no carburettor.
- Verbot: abstrakter Block, Logos, Kabel
- m-deutsch-7 V1 OK (neu/m-deutsch-7-v1.jpg)
### cover/simson-3 (Versuch 1) = Bearbeitung von ../img/cover/simson-3.jpg (nur Kabel)
- Befund: Zuendkabel laeuft zum Vergaserdeckel (Fehler). Refs: s51-motor-links.jpg + aktuelles Bild. Prompt wie nawi-8 V3, Deckel/Tank unveraendert.
- Pruefbefund andere: ki/s51 Kabel OK; cover/tuning-2 Kabel OK, aber Deckel Raute+Oval gemischt -> ZWEIFEL (nicht neu); m-technik-1 Zylinder blockfoermig, nicht M541-typisch -> ZWEIFEL.
- simson-3 V1 (Bearbeitung) OK (neu/simson-3-v1.jpg)

## Teil 7 (18.11. nachts) – alle Bilder in img/ki/neu/*-t7-v*.jpg, NICHT eingebaut
Regeln aus BILD-FEHLER-LOG angewandt: Referenzfotos hochgeladen, "Reproduce exactly… only change", gezielte Bearbeitung statt Neu-Erzeugung, Verbotsliste.
- tuning-1: Bearbeitung cover/tuning-1 + s51-motor-links.jpg. Verbot: SIMSON-Oval links, neue Logos, Personen. -> V1 OK
- tuning-2: Bearbeitung cover/tuning-2 + s51-motor-rechts.jpg. Verbot: IFA-Raute/4FP rechts. -> V1 OK
- m-technik-1: Bearbeitung + s51-zylinder-set.jpg + s51-motor-links.jpg. Verbot: Kastenblock mit senkrechten Rippen. -> V1 OK
- m-englisch-7: Bearbeitung + s51-gruen.jpg + s51-motor-links.jpg. V1 Deckel falsch (SIMSON-Oval), V2 gezielte Deckel-Korrektur OK
- zt300-gelsdorf / zt300-seite: Bearbeitung + garage-zt300.jpg (Formreferenz), Patina, keine Person. je V1 OK
- s51-b24: Bearbeitung + s51-motor-links.jpg, Werkstatt, Patina, keine Person (Referenz s51-post.jpg zeigt Person, bewusst NICHT hochgeladen). V1 OK
- sport-1 / sport-2: neu aus s51-gruen.jpg + s51-motor-links.jpg (Thema aus App: Boxenstopp/Sport = Mokick-Rennen). je V1 OK

## Teil 8 (18.11. nachts) – Ausgabe img/ki/neu/*-t8-v1.jpg
### m-nawi-16 (V1)
- Refs: referenz/wassergekuehlt/kreidler-vanveen-wassergekuehlt-1+2.jpg (CC0). Prompt: liquid-cooled 50cc engine, hoses, radiator, expansion tank, workbench, dark workshop, 16:9; NO logos/text/people; one plug cable straight up out of frame, thin steel throttle cable separate. -> OK
- Verbot: Zuendkabel am Vergaser endend, Logos/Aufkleber (Vorlage hat Kreidler-Aufkleber, nicht uebernommen)
### zylinder (V1; 1 Fehlstart ohne Bildmodus, zaehlt nicht)
- Refs: simson/s51-motor-ifa21.jpg + s51-motor-ueberholt.jpg. Prompt: horizontale Rippen am Zylinder, kastiger Kopf, Auspuffflansch, Werkbank dunkel, 1:1. Verbot: Zinnen oben, senkrechte Rippen am Kopf. -> OK
### sr50 (V1; 1 Fehlstart ohne Bildmodus, zaehlt nicht)
- Refs: simson/sr50-bj93.jpg + altes ki/sr50.jpg (sr50-ce NICHT genutzt: zeigt Faltenbaelge und eckige Verkleidung = andere Variante, wuerde Fehler aus Log wiederholen). Prompt: Hochformat 3:4, dunkle Werkstatt, Patina. Verbot: Faltenbaelge, erfundene Logos. -> OK, 955x1280

## Duo (Auftrag DUO) – img/ki/neu/duo-t9-v1.jpg, NICHT eingebaut
- Refs: referenz/duo-vorn.jpg (Roßdorf, schräg vorn) + duo-seite.jpg (Güsen, Seite). Prompt: "Reproduce exactly… ONE front wheel, TWO rear wheels, WIDE body, cream top, motor+exhaust left; only change lighting/background: workshop with wear". Hochformat 3:4, auf 955x1280.
- Verbot: Personen, Text, Logos, Kennzeichen, schmaler Aufbau, 4 Räder. -> V1 OK

## ZYLFIX (zylinder, 18./19.11.) – Merkmale aus Referenzfotos
Neue Refs: referenz/zylinder2/s50-motor.jpg (Commons "S50-Motor.jpg", Public domain, Zylinder+Kopf eingebaut, seitlich), referenz/zylinder2/ifa-motor1.jpg (Commons "21 IFA Motor1.jpg", CC BY-SA 4.0, Rippen-Nahaufnahme + Stehbolzen), dazu Haendler-Set referenz/alt/zylinder-haendler/s51-zylinder-set.jpg (nur Vorlage, Rechte ungeklaert, nie in die App).
Befund M541/M531 (50 cm3, luftgekuehlt, S50/S51/KR51):
- Zylinder: Alu, 5 breite, flache, horizontale Rippen (rechteckig-abgerundete Platten, quer zur Zylinderachse), oberste Platte = dicker Flansch mit Dichtflaeche.
- Laufbuchse: Graugussbuchse (dunkelgrau, matt) ragt ueber die Flanschflaeche heraus, oben mit Aussparungen/Schlitzen (Ueberstroemkanal-Fenster); Flansch um die Buchse mit 4 Stehbolzen-Loechern (Ecken) und polygonalem Dichtflaechenring.
- Auslass: runder Flansch/Gewindestutzen seitlich (Auspuffanschluss, Ueberwurfmutter-Gewinde), Rippen laufen dahinter durch.
- Zylinderkopf: separates Alu-Gussteil, kastig/rechteckig; Rippen laufen parallel zur Zylinderachse (senkrecht stehend, lange Rippen mit rechteckigen Durchbruechen an den Seiten); Unterseite: runde flache Brennraumkalotte mit mittigem Kerzengewinde-Loch, 4 Stehbolzen-Loecher an den Ecken, Dichtflaeche ringsum.
- Kerze sitzt mittig im Kopf, Kerzenstecker abgewinkelt (im montierten Zustand schraeg nach oben/hinten, Motor liegt geneigt).
- Stehbolzen: 4 Stueck, Gewindebolzen M7; Verbot: Zinnen/Kuehlrippen als Block, waagerechte Rippen am Kopf, Wasserkuehlung.
- zylinder-t10 V1 (Gemini Pro, 3 Refs hochgeladen: s50-motor, ifa-motor1, Haendler-Set): Prompt mit obigen Merkmalen + Verbotsliste. Zoom Buchse (Graugussbuchse mit Schlitzen, 4 Stehbolzenloecher, Flansch) und Kopf (Brennraumkalotte, Kerzengewinde mittig, 4 Loecher, senkrechte Rippen mit Rechteckschlitzen) OK -> OK.
