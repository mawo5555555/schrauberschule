// EINZIGE Stelle für die Versionsnummer (Seiten und Service Worker lesen sie von hier).
// 3.0.0 -> 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
// Beim Ändern: version, ggf. schema und news anpassen, CHANGELOG.md ergänzen.
self.APP = {
  name: 'Schrauberschule',
  version: '3.3.0',
  schema: 2,            // Schema-Version des Spielstands (nur erhöhen, wenn sich die Struktur ändert; dann Migration in migrate.js)
  date: '2026-11-18',
  news: [
    '🔊 Der Prüfstand macht wieder Ton.',
    '🎨 Lackieren geht jetzt sofort: Farbe wählen, fertig.',
    '🔧 Die Werkbank zeigt echte Fotos der Motorteile.',
    '🚿 Waschen mit dem Hochdruckreiniger.',
    '🏍️ Prüfstand: Beim Fahrzeugwechsel flackert nichts mehr.'
  ]
};
