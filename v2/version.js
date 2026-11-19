// EINZIGE Stelle für die Versionsnummer (Seiten und Service Worker lesen sie von hier).
// 3.0.0 -> 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
// Beim Ändern: version, ggf. schema und news anpassen, CHANGELOG.md ergänzen.
self.APP = {
  name: 'Schrauberschule',
  version: '3.5.9',
  test: false,         // true = Testversion (alles frei)
  schema: 2,            // Schema-Version des Spielstands (nur erhöhen, wenn sich die Struktur ändert; dann Migration in migrate.js)
  date: '2026-11-18',
  news: [
    { v: '3.5.9', t: 'Fehlererkennung: Elternseite zeigt letzte Fehler, Neu-laden-Hilfe nach Updates.' },
    { v: '3.5.8', t: 'Größere Tippflächen, Meldungen unter der Kopfzeile, Lackieren ohne Zeichnungs-Blitz.' },
    { v: '3.5.7', t: 'Schnelleres Laden: Videos nur im WLAN vorab. Die S51 fährt beim Start vorwärts.' },
    { v: '3.5.6', t: 'Werkstatt-Tor nur noch beim Tipp auf den Reiter. Viele Fachtexte und Quizfragen verbessert.' },
    '👆 Animationen lassen sich jetzt per Tipp sofort beenden.',
    '🏍️ Start-Animation mit echtem Zweitakt-Motorsound.',
    '✨ Alle Animationen blenden jetzt weich ein.',
    '🔊 Rolltor klingt angenehmer, ohne schrilles Quietschen.',
    '🌅 Neue Start-Animation: Die S51 fährt morgens auf den Hof.',
    '🏚️ Garage: Hinter dem Scheunentor wartet jetzt eine echte Schrauberwerkstatt.',
    '🔊 Werkstatt-Rolltor mit echtem Torgeräusch.',
    '🎬 Prüfstand-Animation jetzt als echtes Video, länger und realistischer.',
    '✨ Alle Animationen blenden sanft aus.',
    '🎬 Neue Animationen: Prüfstand-Kabine, Lern-Schublade, Garagen-Scheunentor und eine S51 beim Tagesstart.',
    '🔘 Prüfstand: Start-Knopf jetzt oben, kein Scrollen mehr.',
    '🚲 Klapprad-Prüflauf startet wieder zuverlässig.',
    '🚪 Werkstatttor jetzt auch auf älteren iPhones sichtbar.',
    '🚲 Neues Klapprad-Prüfstandsvideo wird sicher geladen.',
    '🚪 Werkstatt: Das Rolltor fährt bei jedem Tipp auf Werkstatt.',
    '🚲 Klapprad: neues, ruhiges Prüfstandsvideo wie bei den Mopeds.',
    '🚲 Prüfstand: Klapprad hat jetzt den Start-Knopf, alle Modelle lassen sich im Prüfstand testen.',
    '🚜 Neu im Prüfstand: der graue Rasentraktor mit eigenem Prüfstandsvideo, Rauch, Staub und Funken.',
    '🔧 Werkstatt: Teile passen jetzt genau zum Motor, Prüfstandswerte realistisch zum Tuning.',
    '📚 Aufgaben für Klasse 6/7 geprüft, schwere sind als Profi-Aufgabe markiert.',
    '🐞 Prüfstand startet nach einem Lauf wieder, oberer Rand immer bedienbar.',
    '🔒 Freischalten wieder durch Lernen (Testphase beendet).'
  ]
};
