# Waschen: Bildpaar austauschbar

Die Waschen-Animation (`v2/wasch.js`) nimmt pro Fahrzeug bevorzugt zwei Fotos mit **gleicher Perspektive und gleichem Ausschnitt**:

- `<id>-dreckig.jpg` (verschmutzt)
- `<id>-sauber.jpg` (sauber)

`<id>` = s51, kr51, sr50, s50, habicht, star, duo, klapp. Es werden nur beide zusammen verwendet (onerror-Kette: fehlt eine Datei, nimmt die App den Platzhalter).

Platzhalter (ohne Fotos): Seitenansicht-Zeichnung aus `PSTART.draw[id]` (pruefstand-art.js) in der gewählten Lackfarbe plus eine per Canvas erzeugte Schmutzschicht (Schlamm, Staub, Ölfilm am Motor, Rost am Auspuff).

Hinweise für Fotos: Fahrzeug von links, Ausschnitt etwa 3:2 bis 2:1, Fahrzeug mittig. Die Zonen (Felgen, Motor, Auspuff, Tank, Kotflügel) sind für die Zeichnungs-Proportionen festgelegt; bei Fotos ggf. `zonesOf()` in wasch.js anpassen. Die Lackfarben-Wahl wirkt nur beim Platzhalter (Zeichnung), nicht auf Fotos.
