'use strict';
// Pflicht-Regel: Teile, Modelle und Budget hängen am Lernfortschritt. Kein Freischalten ohne Lernen.
// Budget = 150 € + 10 € je absolvierter Mission (höchstens 600 €). Teile und Modelle brauchen absolvierte Missionen in einem Fach.
const SUBJN = {mathe: ['Mathe-Mission', 'Mathe-Missionen'], deutsch: ['Deutsch-Mission', 'Deutsch-Missionen'], englisch: ['Englisch-Mission', 'Englisch-Missionen'], nawi: ['NaWi-Mission', 'NaWi-Missionen'], alle: ['Mission', 'Missionen']};
const doneIn = k => MISSIONS.filter(m => !m.speech && (k === 'alle' || m.subject === k) && S.done[m.id]).length;
const budgetNow = () => Math.min(600, 150 + 10 * doneIn('alle'));
const LK = {   // Teil-ID: [Fach, Anzahl]
  z60: ['mathe', 2], z70: ['mathe', 4], z85: ['mathe', 7], v19: ['nawi', 2], v24: ['nawi', 5], as: ['nawi', 3], ar: ['nawi', 7], ze: ['englisch', 2], zv: ['englisch', 4], r14: ['mathe', 1], r16: ['mathe', 1], r17: ['mathe', 3],
  // Klapprad
  rs: ['mathe', 1], rb: ['nawi', 1], k38: ['mathe', 1], k50: ['mathe', 3], q14: ['mathe', 2], q18: ['mathe', 1], la: ['nawi', 2], lb: ['nawi', 1], hg: ['deutsch', 1], hx: ['deutsch', 3], gr: ['deutsch', 1], gb: ['deutsch', 2], zs: ['englisch', 1], zt: ['englisch', 2], mp: ['nawi', 5], mv: ['nawi', 8]
};
// MTX-Stil Großhubraum-Aufbau (Showbau, höchste Stufe): erst 30 Missionen UND alle Stufen 1 bis 4 (= alle Tuningteile der Stufen davor freigeschaltet: Mathe 7 für den 85er, NaWi 7 für den Resonanzauspuff, Englisch 4 für die Vape-Zündung)
const MTXREQ = [['alle', 30], ['mathe', 7], ['nawi', 7], ['englisch', 4]];
const LKM = {z130: MTXREQ, v28: MTXREQ};
const MODLK = {s50: [['alle', 4]], habicht: [['alle', 6]], star: [['alle', 8]], duo: [['alle', 10]], klapp: [['mathe', 2], ['nawi', 1]]};
const needTxt = (reqs, label) => { const miss = reqs.map(([k, n]) => [k, n - doneIn(k)]).filter(x => x[1] > 0); return miss.length ? 'Noch ' + miss.map(([k, n]) => n + ' ' + SUBJN[k][n === 1 ? 0 : 1]).join(' und ') + ' bis ' + label : '' };
const partLabel = id => { for (const C of [CAT, KCAT]) for (const s in C) { const o = C[s].opts.find(x => x.id === id); if (o) return o.n.replace(/ \(.*\)$/, '') } return id };
const partLock = id => (LKM[id] && W2.veh === 'duo') ? 'Nicht für den Duo (Dreirad, Spielregel)' : LKM[id] ? needTxt(LKM[id], partLabel(id)) : LK[id] ? needTxt([LK[id]], partLabel(id)) : '';
const modLock = id => MODLK[id] ? needTxt(MODLK[id], V2V[id].name.replace('Simson ', '')) : '';
const origOf = s => (typeof ORIGP !== 'undefined' && ORIGP[s]) || KORIG[s];
function lockAfter() {   // nach dem Zeichnen: Sperren anzeigen und erzwingen
  BUDGET = budgetNow();
  const c = W2.veh && W2.cars[W2.veh]; if (c && c.pick) { let ch = 0; Object.keys(c.pick).forEach(s => { if (partLock(c.pick[s])) { c.pick[s] = (W2.veh === 'klapp' ? KORIG : ORIGP)[s]; ch = 1 } }); if (ch) { w2save(); if (view === 'w2') { $('#app').innerHTML = w2View() } } }
  document.querySelectorAll('.opt2[onclick^="w2Choose"]').forEach(b => { const m = /w2Choose\('(\w+)','(\w+)'\)/.exec(b.getAttribute('onclick')); if (!m) return; const t = partLock(m[2]); if (!t) return;
    b.classList.add('lockd'); b.removeAttribute('onclick'); b.addEventListener('click', () => toast('🔒 ' + t)); const d = document.createElement('span'); d.className = 'lk'; d.textContent = '🔒 ' + t; b.appendChild(d) });
  const live = document.querySelector('.card.live'); if (live && !live.querySelector('.budl')) { const d = document.createElement('div'); d.className = 'budl'; d.textContent = 'Budget aus dem Lernen: 150 € + 10 € je absolvierter Mission (' + doneIn('alle') + ' geschafft). Mehr lernen, mehr Budget.'; live.appendChild(d) }
  document.querySelectorAll('.mods button[onclick^="w2Sel"]').forEach(b => { const id = /w2Sel\('(\w+)'\)/.exec(b.getAttribute('onclick'))[1]; if (modLock(id)) { b.classList.add('lm'); if (!b.textContent.startsWith('🔒')) b.textContent = '🔒 ' + b.textContent } });
  const pk = document.querySelector('button.btn[onclick^="w2Pick"]'); if (pk) { const id = /w2Pick\('(\w+)'\)/.exec(pk.getAttribute('onclick'))[1], t = modLock(id); if (t) { pk.disabled = true; pk.textContent = '🔒 Gesperrt'; const d = document.createElement('div'); d.className = 'lkcard'; d.textContent = '🔒 ' + t + '. Fahrzeuge schaltest du durch Lernen frei.'; pk.parentNode.insertBefore(d, pk) } }
}
(function () {
  const ch = window.w2Choose; window.w2Choose = function (s, id) { const t = partLock(id); if (t) { toast('🔒 ' + t); return } return ch.apply(null, arguments) };
  const pk = window.w2Pick; window.w2Pick = function (id) { const t = modLock(id); if (t) { toast('🔒 ' + t); return } return pk.apply(null, arguments) };
  const r = render; render = function () { BUDGET = budgetNow(); const x = r.apply(null, arguments); try { lockAfter() } catch (e) { console.error(e) } return x };
  const ws = window.w2Sel; window.w2Sel = function () { const x = ws.apply(null, arguments); try { lockAfter() } catch (e) { console.error(e) } return x };
  const wc = window.w2Choose; const wc2 = wc; window.w2Choose = function (s, id) { const x = wc2.apply(null, arguments); try { lockAfter() } catch (e) { console.error(e) } return x };
  const wj = window.w2Jet; if (wj) window.w2Jet = wj;
})();
BUDGET = budgetNow(); if (typeof view !== 'undefined' && view !== 'run') render();
// Zurücksetzen: auch Taler, Tagesauftrag-Serie, Wiederholplan und Werkstatt (Aufträge, laufende Aufträge, Garage, Album, Klappräder). Namen, Spielerliste und Tonwahl bleiben.
function resetAll() {
  S.points = 0; S.coins = 0; S.days = []; S.done = {}; S.stars = {}; S.miss = {}; S.log = []; S.ratings = []; S.daily = {}; S.rev = {}; S.goalDate = ''; S.tag = null;
  W2.veh = null; W2.orders = 0; W2.cars = {}; W2.garage = []; W2.album = []; W2.kb = []; W2.ranV = false; W2.last = null; try { localStorage.removeItem('ss_tor_gesehen') } catch (e) {} save(); w2save(); render();
}
(function () { const p = window.parents; window.parents = function () { return p.apply(null, arguments).replace(/S\.points=0;S\.days=\[\];[^"]*?save\(\);render\(\)/, 'resetAll()') } })();
