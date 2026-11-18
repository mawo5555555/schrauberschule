# Anonyme Besucherzahlen (GoatCounter): vorbereitet, Standard AUS

Stand: Paket 8, 17.11.2026. Datei: `v2/statistik.js`. Im Auslieferungszustand wird NICHTS geladen und NICHTS gesendet.

## Was die App tut, wenn es eingeschaltet ist
- Zählt nur grobe Ansichten: `/start`, `/lernen`, `/mission`, `/missionen`, `/werkstatt`, `/garage`, `/eltern`, `/andere`.
- Kein Cookie, keine Kennung, kein Titel, keine Referrer-Adresse, keine Bildschirmgröße, kein Name, kein Spielstand, keine Mission-Namen.
- Anfrage: `fetch(ENDPUNKT?p=/start&t=&r=&rnd=…, {mode:'no-cors', credentials:'omit', referrerPolicy:'no-referrer'})`. Kein fremdes Skript wird nachgeladen (`count.js` von GoatCounter wird nicht benutzt).
- Respektiert Do Not Track und Global Privacy Control (dann nie senden, Schalter in der Eltern-Seite gesperrt).
- Sendet nie bei `file://`, `localhost` und den Test-Hooks `#shot=...`.

## Alle Bedingungen gleichzeitig nötig
1. `window.APP_STAT_ENABLED === true` (Zeile in `v2/index.html`, Standard `false`)
2. `window.APP_STAT_ENDPOINT` gesetzt, z. B. `https://CODE.goatcounter.com/count` (muss `https://` sein und auf `/count` enden)
3. Die Eltern schalten in der Eltern-Seite „Anonyme Besucherzahlen“ auf an (Standard aus, gespeichert nur auf dem Gerät unter `ss-stat-optin`, nicht im Spielstand)
4. kein Do Not Track

## So schaltet man es später ein (Konto legt der Nutzer selbst an, nicht Claude)
1. Auf goatcounter.com ein kostenloses Konto für nicht-kommerzielle Nutzung anlegen (Code wählen, z. B. `schrauberschule`). Das macht der Nutzer selbst.
2. In GoatCounter unter Einstellungen die erlaubte Domain der veröffentlichten App eintragen (Domain der GitHub-Pages-Adresse) und IP-Anonymisierung/„Aggregate IP“ nicht abschalten.
3. In `v2/index.html` die Zeile ändern:
   `<script>window.APP_STAT_ENABLED=true;window.APP_STAT_ENDPOINT='https://CODE.goatcounter.com/count'</script>`
4. Datenschutzhinweis der Eltern-Seite prüfen (Text steht in `statistik.js`, Funktion `card`). Hinweis: GoatCounter speichert selbst keine Personendaten und setzt keine Cookies; trotzdem Datenschutzerklärung der Veröffentlichung auf Stimmigkeit prüfen. Das ist keine Rechtsberatung.
5. Neue Version veröffentlichen (version.js erhöhen, siehe CHANGELOG.md), in der Eltern-Seite Schalter einschalten, danach in GoatCounter eine Seitenansicht kontrollieren.
6. Ausschalten: Zeile zurück auf `false` und `''` oder Schalter in der Eltern-Seite aus.

## Test
- `./v2/ctest.sh p8-stat-test` ist leer = 0 Konsolenfehler. Der Hook zeigt zusätzlich Testergebnisse (document.title / `#p8stat`): Standard keine Anfrage, freigegeben aber file/localhost keine Anfrage, alle Freigaben mit Stub-Netz genau eine grobe Anfrage ohne Titel/Referrer, Schalter aus keine Anfrage.
- Netzwerkprotokoll des Standardzustands (Chrome net-log) enthält keinen Eintrag mit `goatcounter`.
