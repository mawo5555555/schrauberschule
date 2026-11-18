'use strict';
// Motivation (Paket 8): Etappenziel, Vorschau gesperrter Teile/Modelle, Meilenstein-Feiern, Wochenziel, Tagesserie mit Joker.
// Grundlage: echter Freischalt-Stand aus freischalten.js (LK, MODLK, doneIn, needTxt, partLabel, V2V, CAT, KCAT).
// Spielstand: alles Gemerkte liegt in S.mot (Teil des normalen Spielstands, wird von Sicherung, Datei, Code und QR mit erfasst).
// Kinderschutz: keine Strafen, keine Verlustangst, keine Zufallsbelohnungen, keine Timer. Pausen sind okay.
(function () {
  const WEEKGOAL = 5, MILES = [5, 10, 25, 50, 75, 100, 150, 200];
  const MS_TXT = {
    5: ['Warmgelaufen', '5 Missionen geschafft. Der Motor läuft rund.'], 10: ['Zehn Missionen', 'Zweistellig. Das ist schon richtig Schrauber-Niveau.'],
    25: ['Fünfundzwanzig', 'Ein Viertel Hundert. Du kennst dich in der Werkstatt aus.'], 50: ['Fünfzig Missionen', 'Halbzeit zur Hundert. Gesellenstück.'],
    75: ['Fünfundsiebzig', 'Dreiviertel Hundert. Richtig stark.'], 100: ['Hundert Missionen', 'Meisterstück. Darauf darfst du stolz sein.'],
    150: ['Hundertfünfzig', 'Mehr geht kaum. Echter Profi.'], 200: ['Zweihundert', 'Legende der Werkstatt.']
  };
  const mot = () => { if (!S.mot || typeof S.mot !== 'object') S.mot = {}; if (!S.mot.ms || typeof S.mot.ms !== 'object') S.mot.ms = {}; return S.mot };
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eur = v => v.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' €';
  const pl = (n, a, b) => n === 1 ? a : b;

  // ---------- Ziele aus dem echten Freischalt-Stand ----------
  function findPart(id) { for (const C of [CAT, KCAT]) for (const s in C) { const o = C[s].opts.find(x => x.id === id); if (o) return {slot: s, o, kcat: C === KCAT} } return null }
  const undone = k => MISSIONS.filter(m => !m.speech && (k === 'alle' || m.subject === k) && !S.done[m.id]).length;
  function reqsOf(reqs) {   // -> {rem, total, done, subs:[...]} oder null wenn schon frei
    const miss = reqs.map(([k, n]) => [k, n, Math.max(0, n - doneIn(k))]).filter(x => x[2] > 0); if (!miss.length) return null;
    const rem = miss.reduce((a, x) => a + x[2], 0), total = reqs.reduce((a, x) => a + x[1], 0), got = total - rem;
    return {rem, total, got, subs: miss.map(x => x[0]), reachable: miss.every(x => undone(x[0]) >= x[2])};
  }
  function goals() {
    const out = [], klappOpen = typeof modLock === 'function' && modLock('klapp');
    Object.keys(MODLK).forEach(id => { const r = reqsOf(MODLK[id]); if (r && r.reachable && V2V[id]) out.push(Object.assign(r, {kind: 'modell', id, name: V2V[id].name.replace('Simson ', ''), txt: needTxt(MODLK[id], '')})) });
    Object.keys(LK).forEach(id => { const r = reqsOf([LK[id]]); const p = findPart(id); if (!r || !r.reachable || !p) return; if (p.kcat && klappOpen) return;
      out.push(Object.assign(r, {kind: 'teil', id, name: partLabel(id), part: p, txt: needTxt([LK[id]], '')})) });
    // nächstliegend zuerst; bei Gleichstand Modell vor Teil, dann günstigere Teile
    out.sort((a, b) => a.rem - b.rem || (a.kind === b.kind ? 0 : a.kind === 'modell' ? -1 : 1) || ((a.part && a.part.o.price) || 0) - ((b.part && b.part.o.price) || 0));
    return out;
  }
  const goalText = g => { const t = g.txt.replace(/ bis $/, '').replace(/^Noch /, ''); return (g.rem <= 5 ? 'Nur noch ' : 'Noch ') + t + ' bis ' + g.name };
  const anyDone = () => doneIn('alle') > 0;
  const pct = g => Math.round(Math.max(anyDone() ? 8 : 3, 100 * g.got / g.total));   // Endowed Progress: nie bei null starten, wenn schon gelernt wurde
  const near = g => g.rem <= 2 || g.got / g.total >= .66;
  const subjGo = g => g.subs.length === 1 && g.subs[0] !== 'alle' ? `S.subj='${g.subs[0]}';save();go('missions')` : "go('missions')";

  function banner(g) {
    if (!g) return `<div class="mot-b done"><span class="mot-ic">🏆</span><div><b>Alles Wichtige freigeschaltet</b><span>Du hast alle Teile und Modelle durch Lernen verdient. Bau etwas Neues oder probiere ein Werkzeug aus.</span></div></div>`;
    return `<button class="mot-b${near(g) ? ' near' : ''}" onclick="${subjGo(g)}" aria-label="${esc(goalText(g))}. Antippen zum Lernen"><span class="mot-ic">${g.kind === 'modell' ? '🏍️' : '🔧'}</span><div><b>${esc(goalText(g))}</b>
      <span>${near(g) ? 'Fast geschafft! ' : ''}${g.got} von ${g.total} Missionen</span><div class="mot-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${g.total}" aria-valuenow="${g.got}"><i style="width:${pct(g)}%"></i></div></div><span class="mot-go" aria-hidden="true">›</span></button>`;
  }

  // ---------- Vorschau (Silhouette + Wert) ----------
  const SLOTIMG = {zyl: 'zylinder', verg: 'vergaser', aus: 'auspuff', zuend: 'zuendung'};
  const hasKi = n => window.IMGS && IMGS.ki && IMGS.ki.includes(n);
  function tile(g) {
    let img = '', val = '', emo = '⚙️';
    if (g.kind === 'modell') { const v = V2V[g.id]; emo = v.klapp ? '🚲' : '🛵'; if (hasKi(v.key)) img = `v2/img/ki/${v.key}.jpg`; val = v.klapp ? 'ca. 20 km/h, Muskelkraft' : `ca. ${String(v.ps).replace('.', ',')} PS · ca. ${v.vmax} km/h`; }
    else { const o = g.part.o; emo = g.part.kcat ? '🚲' : '⚙️'; if (SLOTIMG[g.part.slot] && hasKi(SLOTIMG[g.part.slot])) img = `v2/img/ki/${SLOTIMG[g.part.slot]}.jpg`; val = o.price ? 'Wert ca. ' + eur(o.price) : 'Teil'; }
    return `<div class="mot-t${near(g) ? ' near' : ''}"><div class="mot-sil" aria-hidden="true">${img ? `<img src="${img}" alt="" loading="lazy" onerror="this.remove()">` : ''}<span class="e">${emo}</span><span class="lk">🔒</span></div>
      <b>${esc(g.name)}</b><span class="v">${esc(val)}</span><div class="mot-bar sm"><i style="width:${pct(g)}%"></i></div><span class="r">${near(g) ? 'Fast da: ' : ''}noch ${g.rem} ${pl(g.rem, 'Mission', 'Missionen')}</span></div>`;
  }
  function preview(gs) {
    const l = gs.slice(0, 3); if (!l.length) return '';
    return `<div class="mot-pv"><h2>Das kannst du bald bauen</h2><div class="mot-tiles">${l.map(tile).join('')}</div><p class="mot-note">Gezeigt wird, was dir am nächsten ist. Preise und Werte sind Spielwerte (ca.).</p></div>`;
  }

  // ---------- Wochenziel und Tagesserie mit Joker ----------
  const D = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) };
  const addD = (d, n) => { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x };
  const monday = d => addD(d, -((d.getDay() + 6) % 7));
  function weekCount(now) { const mo = ymd(monday(now || new Date())); return S.log.filter(e => e.id !== 'box' && e.d >= mo && e.d <= ymd(addD(monday(now || new Date()), 6))).length }
  function serie(now) {   // -> {n, bridged:[Datum], jokerFree}
    const t0 = now || new Date(), has = x => S.days.includes(ymd(x)), usedW = {}, bridged = [];
    let d = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()), n = 0; if (!has(d)) d = addD(d, -1);
    for (let guard = 0; guard < 800; guard++) {
      if (has(d)) { n++; d = addD(d, -1); continue }
      const wk = ymd(monday(d)), prev = addD(d, -1);
      if (n > 0 && has(prev) && !usedW[wk]) { usedW[wk] = 1; bridged.push(ymd(d)); d = prev; continue }   // ein freier Tag, Joker der Woche rettet die Serie
      break;
    }
    const thisWk = ymd(monday(t0)); return {n, bridged, jokerFree: !usedW[thisWk]};
  }
  function rhythm() {
    const wc = weekCount(), s = serie(), wd = wc >= WEEKGOAL, left = WEEKGOAL - wc;
    const rec = s.bridged.find(x => D(x) >= addD(new Date(), -3));
    const wtxt = wd ? 'Wochenziel geschafft. Alles darüber ist Bonus.' : left <= 2 ? `Fast geschafft: noch ${left} ${pl(left, 'Mission', 'Missionen')} bis zum Wochenziel` : `Noch ${left} Missionen bis zum Wochenziel`;
    const stxt = s.n ? `${s.n} ${pl(s.n, 'Tag', 'Tage')} in Folge` : 'Starte heute eine neue Serie';
    return `<div class="mot-r"><div class="mot-row"><span class="mot-ic">${wd ? '✅' : '🎯'}</span><div><b>Wochenziel: ${Math.min(wc, WEEKGOAL)} von ${WEEKGOAL} Missionen</b><span>${wtxt}</span>
      <div class="mot-bar${wd || left <= 2 ? ' hi' : ''}" role="progressbar" aria-valuemin="0" aria-valuemax="${WEEKGOAL}" aria-valuenow="${Math.min(wc, WEEKGOAL)}"><i style="width:${Math.round(Math.max(wc ? 8 : 3, 100 * Math.min(wc, WEEKGOAL) / WEEKGOAL))}%"></i></div></div></div>
      <div class="mot-row"><span class="mot-ic">🔥</span><div><b>${stxt}</b><span>${rec ? 'Dein Joker hat deine Serie gerettet. Ein freier Tag ist völlig okay.' : s.jokerFree ? '🛡 Joker diese Woche: frei. Ein freier Tag macht nichts kaputt.' : '🛡 Joker diese Woche genutzt. Am Montag gibt es einen neuen.'}</span></div></div></div>`;
  }

  // ---------- Einhängen in Start, Werkstatt, Garage ----------
  function topAnchor(a) { const h = a.querySelector('h1'); if (!h) return null; let t = h; while (t.parentElement && t.parentElement !== a) t = t.parentElement; return t }
  function mount() {
    const a = document.getElementById('app'); if (!a) return; a.querySelectorAll('.mot').forEach(x => x.remove());
    const home = view === 'home', w2 = view === 'w2' && !(W2.veh), gar = view === 'garage'; if (!home && !w2 && !gar) return;
    const gs = goals(), first = gs[0];
    const top = `<div class="mot">${banner(first)}${home ? rhythm() : ''}</div>`;
    let anchor = a.querySelector('.stufe') || a.querySelector('.hud') || a.querySelector('.chips') || (gar ? topAnchor(a) : null);
    if (anchor) anchor.insertAdjacentHTML('afterend', top); else a.insertAdjacentHTML('afterbegin', top);
    if (home || w2) {
      const pv = preview(gs); if (!pv) return;
      let at = home ? [...a.querySelectorAll('h2')].find(h => /Noch mehr/.test(h.textContent)) : null;
      if (at) at.insertAdjacentHTML('beforebegin', pv); else { const m = a.querySelector('.mot'); m && m.insertAdjacentHTML('afterend', pv) }
    }
  }
  const r0 = render; render = function () { const x = r0.apply(this, arguments); try { mount() } catch (e) { console.error(e) } return x };

  // Serie überall gleich zählen (Kopfzeile, Abschlussseite, Eltern-Seite): mit Joker
  window.streak = function () { return serie().n };

  // ---------- Meilenstein-Feier ----------
  function crossed(before, after) { const m = mot(); const c = MILES.filter(x => before < x && after >= x && !m.ms[x]); return c.length ? c : [] }
  function claim(before, after) {   // -> Meilenstein (höchster) oder null; merkt alle überschrittenen
    const c = crossed(before, after); if (!c.length) return null; const m = mot(); c.forEach(x => { m.ms[x] = today() }); save(); return c[c.length - 1];
  }
  function celebrate(n, keep) {
    const t = MS_TXT[n] || [n + ' Missionen', 'Stark gemacht.']; document.querySelectorAll('.mot-fest').forEach(x => x.remove());
    const e = document.createElement('div'); e.className = 'mot-fest'; e.setAttribute('role', 'status'); e.setAttribute('aria-live', 'polite');
    e.innerHTML = `<div class="mot-fc"><div class="big" aria-hidden="true">🏅</div><b>${esc(t[0])}</b><span>${esc(t[1])}</span><button class="btn" type="button">Weiter</button></div>`;
    const close = () => { e.classList.add('out'); setTimeout(() => e.remove(), reduced() ? 0 : 300) };
    e.addEventListener('click', ev => { if (ev.target === e || ev.target.tagName === 'BUTTON') close() });
    document.body.appendChild(e); try { confetti() } catch (x) {}
    if (!keep) setTimeout(close, 9000);
  }
  const f0 = finish; finish = function () {
    const before = doneIn('alle'), x = f0.apply(this, arguments);
    try { const n = claim(before, doneIn('alle')); if (n) setTimeout(() => celebrate(n), 900) } catch (e) { console.error(e) }
    return x;
  };

  // Zurücksetzen: Merker mit löschen
  if (typeof resetAll === 'function') { const ra = resetAll; window.resetAll = function () { S.mot = {}; return ra.apply(this, arguments) } }

  window.MOT = {goals, serie, weekCount, claim, crossed, celebrate, mount, WEEKGOAL, MILES};
  try { mount() } catch (e) { console.error(e) }   // der erste Aufbau lief schon vor diesem Skript

  // ---------- Test-Hooks: #shot=p8-motiv | p8-motiv-fest | p8-motiv-vorschau | p8-motiv-test ----------
  const hk = /shot=(p8-motiv[\w-]*)/.exec(location.hash); if (!hk) return; const k = hk[1];
  const dayStr = n => ymd(addD(new Date(), -n));
  function setup(nDone, subj) {
    S.points = Math.max(S.points, 120); S.done = {}; S.log = []; S.mot = {};
    const pool = {}; MISSIONS.filter(m => !m.speech).forEach(m => (pool[m.subject] = pool[m.subject] || []).push(m));
    const order = subj || ['mathe', 'deutsch', 'nawi', 'englisch']; let i = 0, c = 0;
    while (c < nDone) { const s = order[i % order.length], l = pool[s] || []; const m = l[Math.floor(i / order.length)]; i++; if (i > 400) break; if (m) { S.done[m.id] = 1; S.stars[m.id] = 2; c++ } }
    return c;
  }
  function weekDemo() { const mo = monday(new Date()), t = new Date(); const ds = []; for (let d = new Date(mo); d <= t; d = addD(d, 1)) ds.push(ymd(d)); return ds }
  W2.veh = null;
  if (k === 'p8-motiv-test') {   // Selbsttest der Logik
    const res = [], ok = (n, c) => res.push((c ? 'OK ' : 'FEHLER ') + n); setup(0); const sv = {d: S.days.slice()};
    ok('Meilenstein 10 einmal', MOT.claim(9, 10) === 10 && MOT.claim(9, 10) === null);
    ok('mehrere auf einmal: nur höchster, alle gemerkt', (S.mot = {}, MOT.claim(0, 30) === 25 && S.mot.ms[5] && S.mot.ms[10] && !S.mot.ms[50]));
    const T = new Date(2026, 10, 18);   // Mittwoch
    S.days = ['2026-11-14', '2026-11-15', '2026-11-17']; let s = serie(T); ok('ein freier Tag (16.) vom Joker gerettet, Serie 3', s.n === 3 && s.bridged[0] === '2026-11-16');
    S.days = ['2026-11-10', '2026-11-12', '2026-11-14']; s = serie(new Date(2026, 10, 15)); ok('zweiter freier Tag in derselben Woche: kein zweiter Joker', s.n === 2 && s.bridged.length === 1 && s.jokerFree === false);
    S.days = ['2026-11-10', '2026-11-13']; s = serie(new Date(2026, 10, 14)); ok('Serie bricht bei 2 freien Tagen', s.n === 1);
    S.days = []; ok('leer = 0', serie(T).n === 0);
    S.days = sv.d; const g = (setup(0), goals()); ok('Ziele vorhanden und aufsteigend', g.length > 0 && g.every((x, i) => !i || g[i - 1].rem <= x.rem));
    setup(1, ['mathe']); const g1 = goals()[0]; ok('Etappenziel nach 1 Mathe-Mission: noch 1 Mathe-Mission', g1 && g1.rem === 1 && /Nur noch 1 Mathe-Mission bis/.test(goalText(g1)));
    ok('Balken nie bei 0 wenn schon gelernt', g1 && pct(g1) >= 8);
    const d = document.createElement('pre'); d.id = 'p8mot'; d.textContent = res.join('\n'); document.body.appendChild(d); document.title = res.join(' | '); console.log('MOTTEST ' + res.join(' | ')); return;
  }
  const nDone = k === 'p8-motiv-fest' ? 10 : 1;
  setup(nDone, k === 'p8-motiv' ? ['mathe'] : null);
  S.days = [dayStr(5), dayStr(4), dayStr(2), dayStr(1), dayStr(0)];   // Lücke vor 3 Tagen: Joker
  const wd = weekDemo(); S.log = wd.slice(-3).map((d, i) => ({d, id: 'x' + i, s: 2})); S.days = Array.from(new Set(S.days.concat(wd.slice(-3))));
  if (k === 'p8-motiv-vorschau') { view = 'w2'; render(); return }
  view = 'home'; render();
  if (k === 'p8-motiv-fest') { mot().ms = {5: '2026-11-10'}; setTimeout(() => celebrate(10, true), 300) }
})();
