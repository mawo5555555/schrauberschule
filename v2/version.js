// EINZIGE Stelle für die Versionsnummer (Seiten und Service Worker lesen sie von hier).
// 3.0.0 -> 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
// Beim Ändern: version, ggf. schema und news anpassen, CHANGELOG.md ergänzen.
self.APP = {
  name: 'Schrauberschule',
  version: '3.4.4',
  test: false,         // true = Testversion (alles frei)
  schema: 2,            // Schema-Version des Spielstands (nur erhöhen, wenn sich die Struktur ändert; dann Migration in migrate.js)
  date: '2026-11-18',
  news: [
    '🚲 Prüfstand: Klapprad hat jetzt den Start-Knopf, alle Modelle lassen sich im Prüfstand testen.',
    '🚜 Neu im Prüfstand: der graue Rasentraktor mit eigenem Prüfstandsvideo, Rauch, Staub und Funken.',
    '🔧 Werkstatt: Teile passen jetzt genau zum Motor, Prüfstandswerte realistisch zum Tuning.',
    '📚 Aufgaben für Klasse 6/7 geprüft, schwere sind als Profi-Aufgabe markiert.',
    '🐞 Prüfstand startet nach einem Lauf wieder, oberer Rand immer bedienbar.',
    '🔒 Freischalten wieder durch Lernen (Testphase beendet).'
  ]
};
