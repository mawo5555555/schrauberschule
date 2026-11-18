# Stil-Leitfaden KI-Bilder (Simson-Lern-App)

Ziel: alle KI-Bilder sehen gleich aus, damit die App einheitlich wirkt.

## Regeln

**Fahrzeuge** (S51, SR50, Schwalbe, Star, Duo, S50, Habicht, Zylinder, Vergaser, Zündung, Prüfstand, Hero, Werkstatt)
- fotorealistisch
- Seitenansicht, leicht erhöht
- dunkle Werkstatt mit Betonboden, weiches Studiolicht von links oben
- gleicher Bildausschnitt bei allen Fahrzeugen
- kein Wald, keine Straße, kein Haus, keine Personen, keine Logos
- Hochformat 3:4

**Teile** (Zylinder, Vergaser, Zündung, Auspuff)
- auf einer dunklen Werkbank aus Metall
- gleiches Licht wie bei den Fahrzeugen (weich, von links oben)
- Makro-Ansicht
- quadratisch 1:1
- keine Fahrzeuge im Bild, nur das Teil selbst

## Fester Prompt-Block (wird an JEDEN Prompt angehängt)

Fahrzeug:
> Fotorealistisch, Seitenansicht leicht erhöht, dunkle Werkstatt mit Betonboden, weiches Studiolicht von links oben, gleicher Bildausschnitt. Kein Wald, keine Straße, kein Haus, keine Personen, keine Logos, keine Schrift. Hochformat 3:4.

Teil:
> Fotorealistisch, auf einer dunklen Werkbank aus Metall, weiches Studiolicht von links oben, Makro, quadratisch 1:1. Kein Fahrzeug im Hintergrund, keine Personen, keine Logos, keine Schrift.

## Bildliste

| Datei | Typ | Motiv |
|---|---|---|
| s51.jpg | Fahrzeug | Simson S51, Referenz: `../foto/s51.jpg` |
| sr50.jpg | Fahrzeug | Simson SR50, Referenz: `../foto/sr50.jpg` |
| schwalbe.jpg | Fahrzeug | Simson Schwalbe KR51/2, Referenz: `../foto/kr51.jpg` |
| star.jpg | Fahrzeug | Simson Star |
| duo.jpg | Fahrzeug | Simson Duo |
| s50.jpg | Fahrzeug | Simson S50, Referenz: `../foto/s50.jpg` |
| habicht.jpg | Fahrzeug | Simson Habicht, Referenz: `../foto/habicht.jpg` |
| zylinder.jpg | Teil | Original-Zylinder, Gusseisen, elf Kühlrippen |
| vergaser.jpg | Teil | Original-Rundschiebervergaser 16 mm |
| auspuff.jpg | Teil | Nur der Auspuff, kein Moped |
| zuendung.jpg | Teil | Zündung (Polrad mit Magneten) |
| pruefstand.jpg | Fahrzeug-Szene | Moped-Prüfstand mit Bildschirm, der eine Leistungskurve zeigt |
| hero.jpg | Fahrzeug-Szene | Titelbild, Simson S51 in der Werkstatt |
| werkstatt.jpg | Fahrzeug-Szene | Werkstatt mit Montageständer, ohne Personen |

Die alten Bilder liegen nach jedem Überschreiben in `alt/`.
