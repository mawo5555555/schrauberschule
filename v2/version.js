// EINZIGE Stelle für die Versionsnummer (Seiten und Service Worker lesen sie von hier).
// 3.0.0 -> 3.0.1 = Fehlerbehebung, 3.1.0 = neue Funktionen, 4.0.0 = große Neuerung.
// Beim Ändern: version, ggf. schema und news anpassen, CHANGELOG.md ergänzen.
self.APP = {
  name: 'Schrauberschule',
  version: '3.2.0',
  schema: 2,            // Schema-Version des Spielstands (nur erhöhen, wenn sich die Struktur ändert; dann Migration in migrate.js)
  date: '2026-11-18',
  news: [               // "Was ist neu" nach einem Update, kindgerecht und kurz
    '🏍️ Tuning auf dem echten S51-Foto: Sitzbank, Auspuff, Zylinder, Vergaser und bunte Schrauben siehst du jetzt am Moped.',
    '🪑 Sechs neue flache Sitzbänke (gesteppt, Raute, Wabe, braun).',
    '📊 Neue Leistungswerte: Die S51 hat jetzt ca. 3,4 PS.',
    '👆 Antippen klappt jetzt sofort: ganze Karten sind Knöpfe, nichts springt mehr zurück.',
    '📲 Du kannst die Schrauberschule jetzt als App installieren.',
    '💾 Dein Spielstand ist sicherer: Sichern, Wiederherstellen und Code zum Übertragen.',
    '🖥️ Sieht jetzt auch auf Tablet und Computer gut aus.'
  ]
};
