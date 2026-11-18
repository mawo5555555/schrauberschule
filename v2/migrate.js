'use strict';
// Spielstand-Schema + Migration. Läuft SYNCHRON vor app.js. Löscht nie etwas:
// vor jeder Änderung wird der alte Rohtext als Sicherung gespeichert (localStorage, später auch IndexedDB über pwa.js).
(function () {
  // Testdaten: realistischer Spielstand aus der Zeit vor Version 3.0.0 (kein Schema-Feld), mit Zusatzfeld, das erhalten bleiben muss
  if (/shot=migtest/.test(location.hash)) window.SS_FIXTURE_OLD = {points: 777, days: ['2026-11-10', '2026-11-11', '2026-11-16'], done: {m1: 3, m2: 1}, stars: {m1: 3, m2: 2}, miss: {m5: 2}, log: [{d: '2026-11-16', id: 'm1', ok: 1}], ratings: [], theme: 'simson', subj: 'nawi', name: 'Tester', daily: {}, goalDate: '', sound: false, rev: {a: 1},
    w2: {veh: null, orders: 5, cars: {s51: {ph: 3, took: ['zyl'], put: [], pick: {}, jet: 70, drove: false, cert: null}}, garage: [{id: 'g1', veh: 's51', ps: 3.4}, {id: 'g2', veh: 'kr51', ps: 3.1}], album: [{id: 1}], kb: [], players: ['A'], player: 'A', sel: 'kr51'}, zukunft: {bleibt: true}};
  const KEY = 'wt-state-v1', BK = 'ss-backup-', MAXBK = 5, A = self.APP;
  // Schritte: MIGS[n] bringt Schema n auf n+1. Fehlendes Schema = 1 (alle Stände vor Version 3.0.0).
  const MIGS = {
    1: s => { // 1 -> 2: Pflichtfelder sicherstellen, Schema und Versionsmarke setzen
      const d = {points: 0, days: [], done: {}, stars: {}, miss: {}, log: [], ratings: [], theme: 'simson', subj: 'mathe', name: '', daily: {}, goalDate: '', sound: true, rev: {}};
      for (const k in d) if (s[k] === undefined || s[k] === null || typeof s[k] !== typeof d[k] || Array.isArray(s[k]) !== Array.isArray(d[k])) s[k] = d[k];
      return s;
    }
  };
  function migrate(s, from) { // reine Funktion, testbar
    let v = from || 1;
    while (v < A.schema) { const f = MIGS[v]; if (f) s = f(s); v++ }
    s.schema = A.schema; return s;
  }
  function listBackups() { const r = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(BK) === 0) r.push(k) } } catch (e) {} return r.sort() }
  function backup(raw, why) {
    const k = BK + new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '-' + why;
    try { localStorage.setItem(k, raw) } catch (e) { return null }
    const all = listBackups(); while (all.length > MAXBK) { try { localStorage.removeItem(all.shift()) } catch (e) { break } }
    window.__ssPendingBackup = {key: k, raw}; return k;
  }
  const info = {from: null, to: A.schema, backup: null, ok: true, error: null};
  try {
    // Testhook: alten Spielstand (Schema 1) einspielen, danach prüft pwa.js den Ablauf
    if (/shot=migtest/.test(location.hash) && !localStorage.getItem('ss-migtest-done')) { localStorage.setItem('ss-migtest-done', '1'); localStorage.setItem(KEY, JSON.stringify(JSON.stringify(window.SS_FIXTURE_OLD || {}) && window.SS_FIXTURE_OLD)) }
    const raw = localStorage.getItem(KEY);
    if (raw) {
      let s = null; try { s = JSON.parse(raw) } catch (e) {}
      if (!s || typeof s !== 'object' || Array.isArray(s)) { info.ok = false; info.error = 'unlesbar'; info.backup = backup(raw, 'unlesbar') } // nichts überschreiben
      else {
        const from = typeof s.schema === 'number' ? s.schema : 1; info.from = from;
        if (from > A.schema) { info.ok = false; info.error = 'neuer' } // Stand von neuerer App: nicht anfassen
        else if (from < A.schema) { info.backup = backup(raw, 'v' + from + '-nach-v' + A.schema); localStorage.setItem(KEY, JSON.stringify(migrate(s, from))) }
      }
    }
  } catch (e) { info.ok = false; info.error = String(e) }
  window.SS_MIG = {info, migrate, listBackups, backup, KEY, BK};
})();
