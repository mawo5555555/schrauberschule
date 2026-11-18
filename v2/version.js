// EINZIGE Stelle für die Versionsnummer (Seiten und Service Worker lesen sie von hier).
// 3.0.0 -> 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
// Beim Ändern: version, ggf. schema und news anpassen, CHANGELOG.md ergänzen.
self.APP = {
  name: 'Schrauberschule',
  version: '3.4.0',
  test: true,          // TESTVERSION: alles freigeschaltet. Für den echten Einsatz auf false!
  schema: 2,            // Schema-Version des Spielstands (nur erhöhen, wenn sich die Struktur ändert; dann Migration in migrate.js)
  date: '2026-11-18',
  news: [
    '🧪 TESTVERSION: Alle Fahrzeuge, Teile und die Garage sind zum Ausprobieren frei.',
    '📦 Offline-Paket: Unter Spielstand alle Bilder und Prüfstand-Videos laden, dann geht alles ohne Internet.',
    '🔧 Ritzel 14 und Schmalreifen sind von Anfang an frei.',
    '📏 Leistung und Hubraum aller Simsons geprüft und vereinheitlicht.',
    '❓ Quizfragen überarbeitet: Die richtige Antwort ist nicht mehr die längste.',
    '✨ Leicht bewegter Hintergrund in den Hauptansichten.'
  ]
};
