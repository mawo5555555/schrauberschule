'use strict';
// Interaktive Missionen V2 (Engine): Fehlersuche, Ziehen (Touch), Regler mit Live-Wirkung, Kunden-Dialog, Blitzrunde (Zeitdruck), Bilderquiz.
// Dazu: Werkzeugwand und Werkstatt-Stufen (Freischalten durch Lernen), Tagesauftrag mit Belohnung, Missions-Hub, "Mission des Tages" im neuen Stil.
// Missionen selbst stehen in missionen2-daten.js. Alle Zahlen sind gerundete Richtwerte (ca.), keine Herstellerangaben.
const mxId = id => document.getElementById(id);
const mxHearts = n => '❤️'.repeat(n) + '🖤'.repeat(Math.max(0, 3 - n));

// ================= Fehlersuche =================
STEP.fehler = s => { const c = run.cur; c.seen = []; c.mist = 0;
  return `<h1>${esc(s.title)}</h1><div class="cust"><span class="cav">${s.av || '🧑'}</span><div class="cb">${rich(s.story)}</div></div>
  <p class="m">Prüfe der Reihe nach. Jede Prüfung zeigt dir einen Befund. Du musst nicht alles prüfen, aber überlege, was zuerst dran ist.</p>
  <div class="chk">${s.checks.map(k => `<button class="ck" id="ck_${k.id}" onclick="fCheck('${k.id}')"><span>${k.ic}</span>${esc(k.n)}</button>`).join('')}</div>
  <div id="fbefund"></div>
  <div id="fdiag" style="display:none"><h2>Was ist die Ursache?</h2>${shuffle(s.causes.map((_, i) => i)).map(i => `<button class="opt" id="fc_${i}" onclick="fCause(${i})">${esc(s.causes[i].n)}</button>`).join('')}</div>
  ${hbtn('💡 Wo fange ich an?')}<div id="fb"></div>${nextBtn('Weiter', true)}`; };
function fCheck(id) {
  const s = run.steps[run.i], c = run.cur, k = s.checks.find(x => x.id === id), b = mxId('ck_' + id); if (c.done || c.seen.includes(id)) return;
  c.seen.push(id); b.classList.add(k.ok ? 'okc' : 'warn'); tone(k.ok ? 660 : 330, .09, 0, 'sine', .06);
  mxId('fbefund').insertAdjacentHTML('beforeend', `<div class="bef ${k.ok ? '' : 'w'}"><b>${k.ic} ${esc(k.n)} ${k.ok ? '✓ in Ordnung' : '⚠ auffällig'}</b>${k.svg || ''}<div>${rich(k.res)}</div></div>`);
  if (c.seen.length >= 2) mxId('fdiag').style.display = '';
  mxId('fbefund').lastElementChild.scrollIntoView({block: 'nearest', behavior: 'smooth'});
}
function fCause(i) {
  const s = run.steps[run.i], c = run.cur; if (c.done) return; const b = mxId('fc_' + i), ca = s.causes[i]; c.tries++;
  if (ca.right) { b.classList.add('ok'); if (c.tries === 1) scoreQ(true);
    const n = c.seen.length, best = s.checks.filter(k => k.must).length || 3;
    fb('good', `<b>Richtig!</b> ${rich(s.fix)}<br><span class="m" style="color:var(--t)">Du hast ${n} von ${s.checks.length} Prüfungen gebraucht${n <= best + 1 ? ': sehr systematisch!' : '. Mit einer festen Reihenfolge geht es oft schneller.'}</span>`);
    document.querySelectorAll('#fdiag .opt').forEach(x => x.disabled = true); qDone(); return }
  b.classList.add('bad'); b.disabled = true; if (c.tries === 1) scoreQ(false);
  fb('bad', nope() + rich(ca.why || 'Das passt nicht zu dem, was du gefunden hast. Schau dir die auffälligen Befunde (gelb) noch einmal an.'));
}
// ================= Ziehen (Drag and Drop, Touch und Maus, dazu Antippen) =================
STEP.drag = s => { const c = run.cur; c.left = s.items.length; c.mist = 0; c.sel = null;
  return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')} Ziehe die Kärtchen auf das passende Feld. Du kannst auch erst das Kärtchen und dann das Feld antippen.</p>
  <div class="dzw" id="dzw" style="aspect-ratio:${s.W}/${s.H}">${s.bg || ''}${s.zones.map(z => `<div class="dz" id="dz_${z.id}" data-z="${z.id}" style="left:${100 * z.x / s.W}%;top:${100 * z.y / s.H}%;width:${100 * z.w / s.W}%;height:${100 * z.h / s.H}%" onclick="dTapZone('${z.id}')"><i>${esc(z.n || '')}</i></div>`).join('')}</div>
  <div class="dtr" id="dtr">${shuffle(s.items.map((_, i) => i)).map(i => `<div class="dit" id="di_${i}" data-i="${i}">${esc(s.items[i].l)}${s.items[i].en ? `<small>${esc(s.items[i].en)}</small>` : ''}</div>`).join('')}</div>
  ${hbtn('💡 Zeig mir eins')}<div id="fb"></div>${nextBtn('Weiter', true)}`; };
function dZoneAt(x, y) { let best = null, bd = 1e9; document.querySelectorAll('.dz').forEach(z => { const r = z.getBoundingClientRect(), m = 10; if (x < r.left - m || x > r.right + m || y < r.top - m || y > r.bottom + m) return;
  const d = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2); if (d < bd) { bd = d; best = z } }); return best }
INIT.drag = s => {
  document.querySelectorAll('.dit').forEach(el => { let gh = null, sx = 0, sy = 0, mv = false, dn = false;
    const off = () => { if (gh) { gh.remove(); gh = null } el.classList.remove('lift'); document.querySelectorAll('.dz.hot').forEach(z => z.classList.remove('hot')); dn = false };
    el.addEventListener('pointerdown', e => { if (run.cur.done || el.classList.contains('placed')) return; e.preventDefault(); try { el.setPointerCapture(e.pointerId) } catch (x) {} dn = true; mv = false; sx = e.clientX; sy = e.clientY });
    el.addEventListener('pointermove', e => { if (!dn) return; e.preventDefault(); if (!mv && Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return; mv = true;
      if (!gh) { gh = el.cloneNode(true); gh.removeAttribute('id'); gh.classList.add('dgh'); document.body.appendChild(gh); el.classList.add('lift') }
      gh.style.left = e.clientX + 'px'; gh.style.top = e.clientY + 'px'; const z = dZoneAt(e.clientX, e.clientY); document.querySelectorAll('.dz').forEach(q => q.classList.toggle('hot', q === z)) });
    el.addEventListener('pointerup', e => { if (!dn) return; const z = mv ? dZoneAt(e.clientX, e.clientY) : null, wasMv = mv; off();
      if (wasMv) { if (z) dPlace(+el.dataset.i, z.dataset.z) } else { document.querySelectorAll('.dit.sel').forEach(x => x.classList.remove('sel')); run.cur.sel = run.cur.sel === +el.dataset.i ? null : +el.dataset.i; if (run.cur.sel !== null) el.classList.add('sel') } });
    el.addEventListener('pointercancel', off); el.addEventListener('contextmenu', e => e.preventDefault()) });
};
function dTapZone(zid) { const c = run.cur; if (c.done || c.sel === null || c.sel === undefined) return; dPlace(c.sel, zid) }
function dPlace(i, zid) {
  const s = run.steps[run.i], c = run.cur, it = s.items[i], el = mxId('di_' + i), z = mxId('dz_' + zid), zd = s.zones.find(q => q.id === zid); if (c.done || !el || el.classList.contains('placed')) return;
  if (!zd.multi && z.classList.contains('full')) { c.mist++; fb('bad', 'Dieses Feld ist schon belegt.'); return }
  if (it.z === zid) { el.classList.remove('sel'); el.classList.add('placed'); z.appendChild(el); z.classList.add('full'); c.sel = null; c.left--; tone(720, .08, 0, 'sine', .07); fb('', '');
    if (c.left <= 0) { scoreQ(c.mist === 0); fb('good', (c.mist === 0 ? '<b>Alles richtig, ohne Fehlversuch!</b> ' : `<b>Geschafft.</b> Fehlversuche: ${c.mist}. `) + rich(s.why || '')); qDone() } }
  else { c.mist++; z.classList.add('shk'); setTimeout(() => z.classList.remove('shk'), 320); tone(190, .18, 0, 'triangle', .1); el.classList.remove('sel'); c.sel = null;
    fb('bad', nope() + rich(it.no || `„${it.l}“ gehört nicht an diese Stelle. Überlege: Was macht das Teil, und wo sitzt es?`)) }
}
HINT.drag = (s, c) => { const i = s.items.findIndex((x, k) => !mxId('di_' + k).classList.contains('placed')); if (i < 0) return; const el = mxId('di_' + i), z = mxId('dz_' + s.items[i].z); flash(el, z); hintBox(`<b>${esc(s.items[i].l)}</b> gehört in das blinkende Feld.`) };

// ================= Regler mit Live-Wirkung =================
STEP.regler = s => { const c = run.cur; c.tg = {}; (s.toggles || []).forEach(t => c.tg[t.id] = !!t.val); c.tries = 0;
  return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')}</p>${s.goal ? `<div class="card" style="padding:12px 14px"><b>🎯 Ziel:</b> ${rich(s.goal)}</div>` : ''}
  ${(s.sliders || []).map(x => `<div class="sld"><div class="row sp"><span>${esc(x.l)}</span><b id="sv_${x.id}"></b></div><input type="range" id="sr_${x.id}" min="${x.min}" max="${x.max}" step="${x.step}" value="${x.val}" oninput="rShow()"></div>`).join('')}
  ${(s.toggles || []).map(t => `<button class="tg ${t.val ? 'on' : ''}" id="tg_${t.id}" onclick="rTog('${t.id}')"><span>${esc(t.l)}</span><b>${t.val ? 'AN' : 'AUS'}</b></button>`).join('')}
  <div class="card lab" id="rlab"></div>${s.goal ? hbtn('💡 Tipp') : ''}<div id="fb"></div>${s.goal ? '<button class="btn" id="chk" onclick="rCheck()">Einstellung prüfen</button>' : ''}${nextBtn('Weiter', !!s.goal)}`; };
const rVals = s => { const v = {}; (s.sliders || []).forEach(x => v[x.id] = +mxId('sr_' + x.id).value); Object.assign(v, run.cur.tg); return v };
function rShow() { const s = run.steps[run.i]; if (!s || !s.live) return; const v = rVals(s);
  (s.sliders || []).forEach(x => { const e = mxId('sv_' + x.id); if (e) e.textContent = (x.fmt ? x.fmt(v[x.id]) : de(v[x.id], x.step < 1 ? (x.step < .1 ? 2 : 1) : 0)) + (x.u || '') });
  const o = s.live(v); mxId('rlab').innerHTML = o.html; run.cur.last = o; run.cur.moved = true }
function rTog(id) { const c = run.cur, s = run.steps[run.i], t = s.toggles.find(x => x.id === id); c.tg[id] = !c.tg[id]; const b = mxId('tg_' + id); b.classList.toggle('on', c.tg[id]); b.lastElementChild.textContent = c.tg[id] ? 'AN' : 'AUS'; tone(c.tg[id] ? 600 : 400, .06, 0, 'square', .04); rShow() }
INIT.regler = s => { rShow() };
function rCheck() { const s = run.steps[run.i], c = run.cur; if (c.done) return; const o = s.live(rVals(s)); c.tries++;
  if (o.ok) { if (c.tries === 1) scoreQ(true); fb('good', `<b>${c.tries === 1 ? 'Richtig eingestellt!' : 'Jetzt passt es.'}</b> ${rich(s.why || '')}`); qDone() }
  else { if (c.tries === 1) scoreQ(false); fb('bad', nope() + rich(o.msg || 'Das Ziel ist noch nicht erreicht. Schau auf die Anzeige und probiere weiter.')) } }
HINT.regler = (s, c) => { hintBox(esc(s.tip || 'Verändere einen Regler nach dem anderen und beobachte, was sich in der Anzeige ändert.')); hintOff() };

// ================= Kunden-Dialog (Story, Antworten wählen, teils mit Zeitdruck) =================
const zeitAn = () => !!S.zeitAn; // Standard: aus (Zeitdruck kann Stottern verstärken); nur nach Einschalten durch das Kind
function zeitToggle() { S.zeitAn = !S.zeitAn; save(); toast(S.zeitAn ? 'Zeitdruck ist an.' : 'Zeitdruck ist aus.'); const b = mxId('ztb'); if (b) b.textContent = zeitAn() ? '⏱ Zeitdruck: an' : '⏱ Zeitdruck: aus'; { const t = mxId('tmr'); if (t) t.style.display = S.zeitAn ? '' : 'none' } }
const ztBtn = () => `<button class="zt" id="ztb" onclick="zeitToggle()">${zeitAn() ? '⏱ Zeitdruck: an' : '⏱ Zeitdruck: aus'}</button>`;
STEP.kunde = s => { const c = run.cur; c.k = 0; c.hearts = 3; c.tr = 0;
  return `<div class="row sp"><h1 style="margin:0">${esc(s.title)}</h1>${s.lines.some(l => l.sek) ? ztBtn() : ''}</div>${s.story ? `<div class="card" style="padding:12px 14px"><p style="margin:0">${rich(s.story)}</p></div>` : ''}
  <div class="row sp"><span class="m">Kundenzufriedenheit</span><span class="hearts" id="kh">${mxHearts(3)}</span></div><div id="kd"></div><div id="fb"></div>${nextBtn('Weiter', true)}`; };
INIT.kunde = s => kShow();
function kShow() { const s = run.steps[run.i], c = run.cur, l = s.lines[c.k]; c.tr = 0; c.ord = shuffle(l.ch.map((_, i) => i)); c.lt = 0;
  mxId('kd').innerHTML = `<div class="cust"><span class="cav">${s.av || '🧑'}</span><div class="cb">${rich(l.say)}</div></div>${l.sek && zeitAn() ? `<div class="tmr" id="tmr"><i id="tmri"></i></div>` : ''}
  <div id="kch">${c.ord.map(i => `<button class="opt" id="kc_${i}" onclick="kPick(${i})">${esc(l.ch[i].t)}</button>`).join('')}</div>`;
  if (l.sek && zeitAn()) { const t0 = Date.now(), tot = l.sek * 1000; const iv = setInterval(() => { const r = Math.max(0, 1 - (Date.now() - t0) / tot), b = mxId('tmri'); if (!b) { clearInterval(iv); return } b.style.width = 100 * r + '%'; if (r <= 0) { clearInterval(iv); kTime() } }, 100); timers.push(iv); c.iv = iv } }
function kTime() { const s = run.steps[run.i], c = run.cur, l = s.lines[c.k]; if (c.tr || c.done) return; c.tr = 1; c.hearts = Math.max(0, c.hearts - 1); scoreQ(false); mxId('kh').textContent = mxHearts(c.hearts);
  const g = l.ch.findIndex(x => x.good); mxId('kc_' + g).classList.add('ok'); fb('bad', '<b>Die Zeit war um.</b> Kein Problem. Die beste Antwort ist grün markiert. ' + rich(l.ch[g].re || '')); kEnd(c.k, g) }
function kPick(i) { const s = run.steps[run.i], c = run.cur, l = s.lines[c.k], ch = l.ch[i], b = mxId('kc_' + i); if (c.done || b.disabled) return; if (c.iv) { clearInterval(c.iv); const t = mxId('tmr'); if (t) t.style.display = 'none' } c.tr++;
  if (ch.good) { b.classList.add('ok'); if (c.tr === 1) scoreQ(true); fb('good', rich(ch.re || '')); kEnd(c.k, i) }
  else { b.classList.add('bad'); b.disabled = true; if (c.tr === 1) { scoreQ(false); c.hearts = Math.max(0, c.hearts - 1); mxId('kh').textContent = mxHearts(c.hearts) } fb('bad', rich(ch.re || 'Das kommt beim Kunden nicht gut an. Probiere eine andere Antwort.')) } }
function kEnd(k, i) { const s = run.steps[run.i], c = run.cur; document.querySelectorAll('#kch .opt').forEach(x => x.disabled = true);
  const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = k + 1 < s.lines.length ? 'Weiter im Gespräch' : 'Gespräch beenden';
  btn.onclick = () => { if (k + 1 < s.lines.length) { c.k++; fb('', ''); kShow(); btn.remove() } else { btn.remove(); fb('good', `<b>${c.hearts === 3 ? 'Der Kunde ist begeistert!' : c.hearts >= 1 ? 'Der Kunde ist zufrieden.' : 'Der Kunde war nicht ganz zufrieden. Beim nächsten Mal klappt es besser.'}</b> ${mxHearts(c.hearts)}<br>${rich(s.end || '')}`); qDone() } };
  mxId('kd').appendChild(btn); btn.scrollIntoView({block: 'nearest', behavior: 'smooth'}) }

// ================= Blitzrunde (Zeitdruck, ohne Strafe) =================
STEP.blitz = s => { const c = run.cur; c.q = 0; c.ok = 0; c.ans = 0; c.fin = false; c.list = shuffle(s.items);
  return `<div class="row sp"><h1 style="margin:0">${esc(s.title)}</h1>${ztBtn()}</div><p class="m">${esc(s.text || '')} Die Zeit ist nur ein freiwilliges Spiel: Mit dem Knopf kannst du sie einschalten. Ohne Zeit zählt dasselbe, du hast dann alle Zeit der Welt.</p>
  <div class="tmr" id="tmr" style="${zeitAn() ? '' : 'display:none'}"><i id="tmri"></i></div><div id="bq"></div><div id="fb"></div>${nextBtn('Weiter', true)}`; };
INIT.blitz = s => { bShow(); if (zeitAn()) { const c = run.cur, t0 = Date.now(), tot = s.sek * 1000; c.iv = setInterval(() => { if (!zeitAn()) return; const r = Math.max(0, 1 - (Date.now() - t0) / tot), b = mxId('tmri'); if (!b) { clearInterval(c.iv); return } b.style.width = 100 * r + '%'; if (r <= 0) { clearInterval(c.iv); bEnd(true) } }, 100); timers.push(c.iv) } };
function bShow() { const s = run.steps[run.i], c = run.cur, it = c.list[c.q]; c.ord = shuffle(it.o.map((_, i) => i)); c.t1 = 0;
  mxId('bq').innerHTML = `<div class="m">Aufgabe ${c.q + 1} von ${c.list.length}</div><div class="q" style="margin:6px 0 10px">${rich(it.q)}</div>${c.ord.map(i => `<button class="opt" id="bo_${i}" onclick="bPick(${i})">${esc(it.o[i])}</button>`).join('')}` }
function bPick(i) { const s = run.steps[run.i], c = run.cur; if (c.done || c.fin) return; const it = c.list[c.q], b = mxId('bo_' + i); if (b.disabled) return; c.t1++;
  if (i === 0) { b.classList.add('ok'); if (c.t1 === 1) { scoreQ(true); c.ok++ } c.ans++; document.querySelectorAll('#bq .opt').forEach(x => x.disabled = true);
    fb(c.t1 === 1 ? 'good' : 'hint', rich((it.why || '')) || '✓');
    later(() => { if (c.fin) return; c.q++; if (c.q >= c.list.length) bEnd(false); else { fb('', ''); bShow() } }, 900) }
  else { b.classList.add('bad'); b.disabled = true; if (c.t1 === 1) { scoreQ(false); c.ans += 0 } } }
function bEnd(timeout) { const s = run.steps[run.i], c = run.cur; if (c.fin || c.done) return; c.fin = true; if (c.iv) clearInterval(c.iv); const n = c.list.length;
  document.querySelectorAll('#bq .opt').forEach(x => x.disabled = true);
  fb(timeout ? 'hint' : 'good', timeout ? `<b>Zeit um!</b> Du hast ${c.q} von ${n} Aufgaben bearbeitet, ${c.ok} davon gleich richtig. Gut gekämpft. ${rich(s.end || '')}` : `<b>Geschafft${zeitAn() ? ' vor Ablauf der Zeit' : ''}!</b> ${c.ok} von ${n} gleich richtig. ${rich(s.end || '')}`); qDone() }

// ================= Bilderquiz =================
STEP.bild = s => { const c = run.cur; c.q = 0; c.done2 = 0;
  return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')}</p><div id="bw"></div><div id="fb"></div>${nextBtn('Weiter', true)}`; };
INIT.bild = s => biShow();
function biShow() { const s = run.steps[run.i], c = run.cur, it = s.items[c.q]; c.ord = shuffle(it.o.map((_, i) => i)); c.t1 = 0; fb('', '');
  const pic = it.svg ? `<div class="bildw">${it.svg}${it.mk ? `<span class="mk" style="left:${it.mk[0]}%;top:${it.mk[1]}%"></span>` : ''}</div>` : `<div class="bildw"><img src="${it.img}" alt="${esc(it.alt || 'Bild zur Aufgabe')}" onerror="this.style.minHeight='120px'">${it.mk ? `<span class="mk" style="left:${it.mk[0]}%;top:${it.mk[1]}%"></span>` : ''}</div>`;
  mxId('bw').innerHTML = `<div class="m">Bild ${c.q + 1} von ${s.items.length}</div>${pic}<div class="q" style="margin:6px 0 10px">${rich(it.q)}</div><div id="bos">${c.ord.map(i => `<button class="opt" id="bi_${i}" onclick="biPick(${i})">${esc(it.o[i])}</button>`).join('')}</div>` }
function biPick(i) { const s = run.steps[run.i], c = run.cur, it = s.items[c.q], b = mxId('bi_' + i); if (c.done || b.disabled) return; c.t1++;
  if (i === 0) { b.classList.add('ok'); if (c.t1 === 1) scoreQ(true); document.querySelectorAll('#bos .opt').forEach(x => x.disabled = true); fb('good', (c.t1 === 1 ? '<b>Richtig!</b> ' : 'Jetzt stimmt es. ') + rich(it.why || ''));
    const nb = document.createElement('button'); nb.className = 'btn'; nb.textContent = c.q + 1 < s.items.length ? 'Nächstes Bild' : 'Fertig'; nb.onclick = () => { if (c.q + 1 < s.items.length) { c.q++; biShow() } else { nb.remove(); qDone() } }; mxId('bw').appendChild(nb); nb.scrollIntoView({block: 'nearest', behavior: 'smooth'}) }
  else { b.classList.add('bad'); b.disabled = true; if (c.t1 === 1) scoreQ(false); fb('bad', nope() + 'Schau noch einmal genau hin.') } }

// ================= Werkzeugwand und Werkstatt-Stufen (Freischalten durch Lernen) =================
const TOOLS = [
  {id: 'kerz', n: 'Kerzenschlüssel', en: 'spark plug spanner', need: [], use: 'Zündkerze lösen und festziehen'},
  {id: 'gabel', n: 'Gabelschlüssel-Satz', en: 'open-end spanner set', need: [], use: 'Muttern und Schrauben am Rahmen und Motor'},
  {id: 'steck', n: 'Steckschlüssel-Satz', en: 'socket set', need: [['alle', 2]], use: 'Zylinderkopfmuttern und enge Stellen'},
  {id: 'schieb', n: 'Messschieber', en: 'caliper', need: [['mathe', 2]], use: 'Bohrung, Hub und Düse genau messen'},
  {id: 'dreh', n: 'Drehmomentschlüssel', en: 'torque wrench', need: [['mathe', 4]], use: 'Schrauben mit dem richtigen Moment anziehen'},
  {id: 'multi', n: 'Multimeter', en: 'multimeter', need: [['nawi', 3]], use: 'Spannung, Widerstand und Durchgang prüfen'},
  {id: 'zuend', n: 'Stroboskop-Zündlampe', en: 'timing light', need: [['nawi', 5]], use: 'Zündzeitpunkt einstellen'},
  {id: 'komp', n: 'Kompressionsprüfer', en: 'compression tester', need: [['nawi', 4], ['englisch', 2]], use: 'Verdichtung im Zylinder messen'}
];
const toolHave = id => { const t = TOOLS.find(x => x.id === id); return !t || t.need.every(([k, n]) => doneIn(k) >= n) };
const toolLockTxt = id => { const t = TOOLS.find(x => x.id === id); return t && !toolHave(id) ? needTxt(t.need, t.n) : '' };
const STUFEN = [
  {n: 'Azubi', m: 0, o: 0}, {n: 'Geselle', m: 6, o: 0}, {n: 'Tuner', m: 14, o: 1}, {n: 'Werkstattmeister', m: 28, o: 3}
];
const stufeIdx = () => { let k = 0; STUFEN.forEach((s, i) => { if (doneIn('alle') >= s.m && (W2.orders || 0) >= s.o) k = i }); return k };
const stufeNow = () => STUFEN[stufeIdx()];
function stufeHint() { const k = stufeIdx(), nx = STUFEN[k + 1]; if (!nx) return 'Höchste Stufe erreicht.'; const parts = [];
  if (doneIn('alle') < nx.m) parts.push((nx.m - doneIn('alle')) + ' ' + (nx.m - doneIn('alle') === 1 ? 'Mission' : 'Missionen')); if ((W2.orders || 0) < nx.o) parts.push((nx.o - (W2.orders || 0)) + ' ' + (nx.o - (W2.orders || 0) === 1 ? 'Werkstattauftrag' : 'Werkstattaufträge'));
  return 'Noch ' + parts.join(' und ') + ' bis ' + nx.n }
// ================= Sperren für Missionen =================
function mLock(m) {
  if (m.tool) { const t = toolLockTxt(m.tool); if (t) return t }
  if (m.stufe && stufeIdx() < m.stufe) return 'Noch ' + (STUFEN[m.stufe].m - doneIn('alle')) + ' Missionen bis Stufe ' + STUFEN[m.stufe].n;
  if (m.veh) { const g = GARAGE.find(x => x.id === m.veh); if (g && S.points < g.need) return 'Noch ' + (g.need - S.points) + ' Punkte bis ' + g.name }
  return '';
}
(function () { const st = window.start; window.start = function (id) { const m = MISSIONS.find(x => x.id === id); const t = m && mLock(m); if (t) { toast('🔒 ' + t); return } return st.apply(null, arguments) } })();

// ================= Tagesauftrag mit Belohnung =================
const TAGIDS = ['sim-tag-a', 'sim-tag-b', 'sim-tag-c'];
const tagId = () => TAGIDS[dayIdx() % 3];
const tagDone = () => !!(S.tag && S.tag.last === today());
const tagStreak = () => { const t = S.tag; if (!t) return 0; if (t.last === today()) return t.streak; const y = new Date(); y.setDate(y.getDate() - 1); return t.last === ymd(y) ? t.streak : 0 };
(function () { const f = window.finish; window.finish = function () { const m = run && run.m, tag = m && m.tag, first = tag && !tagDone(); let rw = null;
  if (first) { const sk = tagStreak() + 1, bonus = sk % 3 === 0 ? 15 : 0; rw = {coins: 20 + bonus, pts: 10, sk, bonus}; S.tag = {last: today(), streak: sk}; S.coins = (S.coins || 0) + rw.coins; S.points += rw.pts; save() }
  f.apply(null, arguments);
  if (tag) { const b = document.querySelector('#app .btn:last-of-type'), d = document.createElement('div'); d.className = 'card center tagc';
    d.innerHTML = rw ? `<div class="big">🎁</div><b style="font-size:19px">Tagesauftrag erledigt!</b><p style="margin:6px 0">Belohnung: <b>🪙 ${rw.coins} Taler</b> und <b>${rw.pts} Extra-Punkte</b>.${rw.bonus ? ' Darin sind ' + rw.bonus + ' Taler Serien-Bonus (jeder 3. Tag in Folge).' : ''}</p><p class="m">Das ist Tag ${rw.sk} in Folge. Morgen wartet ein neuer Auftrag.</p>` : `<b>Tagesauftrag heute schon abgeholt.</b><p class="m">Die Belohnung gibt es einmal am Tag. Morgen kommt ein neuer Auftrag.</p>`;
    if (b) b.parentNode.insertBefore(d, b) } } })();
const tagCard = () => { const m = MISSIONS.find(x => x.id === tagId()), done = tagDone(), sk = tagStreak(); if (!m) return '';
  return `<h2>Tagesauftrag</h2><button class="item tagc" onclick="start('${m.id}')"><div class="dot" style="background:rgba(var(--ar),.18)">${done ? '✅' : '🎁'}</div><div style="flex:1"><b>${esc(m.title)}</b><span class="m">${done ? 'Heute geschafft. Die Belohnung ist abgeholt.' : 'Belohnung: 🪙 20 Taler + 10 Punkte'}${sk ? ' · Serie: ' + sk + ' ' + (sk === 1 ? 'Tag' : 'Tage') : ''}</span></div></button>` };

// ================= Mission des Tages im neuen Stil =================
const MDT_IMG = {mathe: ['pruefstand', 'vergaser'], deutsch: ['werkstatt', 'hero'], englisch: ['auspuff', 'schwalbe'], nawi: ['zylinder', 'zuendung'], technik: ['pruefstand', 'zylinder']};
const mdtImg = m => m.cov || 'v2/img/ki/' + (MDT_IMG[m.subject] || MDT_IMG.technik)[hash(m.id) % 2] + '.jpg';
function mdt(m) { const sub = SUBJECTS[m.subject], done = doneToday(m.id);
  return `<button class="mdt" onclick="start('${m.id}')"><div class="mi"><img src="${mdtImg(m)}" alt="" onerror="this.remove()"><div class="mtag"><span>${sub.long}</span><span>${m.min} Min.</span></div></div>
  <div class="mb2"><b>${esc(m.title)}</b><span class="m">${esc(m.sub)}</span><span class="go">${done ? 'Heute geschafft ✓ · nochmal' : 'Los geht’s'}</span></div></button>` }

// ================= Missions-Hub =================
const KIND = {fehler: ['🔎', 'Fehlersuche'], ziehen: ['🧩', 'Ziehen und Zuordnen'], regler: ['🎚️', 'Regler mit Live-Wirkung'], kunde: ['📋', 'Kundenaufträge'], bild: ['🖼️', 'Bilderquiz'], tag: ['🎁', 'Tagesaufträge']};
const mRow = m => { const lk = mLock(m), n = S.stars[m.id] || 0, d = S.done[m.id], sub = SUBJECTS[m.subject];
  return `<button class="item ${lk ? 'lkm' : ''}" onclick="start('${m.id}')"><div class="dot" style="background:${sub.color}33">${KIND[m.kind] ? KIND[m.kind][0] : sub.emoji}</div><div style="flex:1"><b>${esc(m.title)}</b><span class="m">${sub.name} · ${m.min} Min.${m.timed ? ' · ⏱ Zeit (kannst du einschalten)' : ''}${lk ? '<br>🔒 ' + esc(lk) : ''}</span></div>${d ? `<span class="stars">${starStr(n)}</span>` : ''}</button>` };
const SIMM = () => MISSIONS.filter(m => m.sim && !m.veh && !m.tag);
const VEHM = id => MISSIONS.filter(m => m.veh === id);
function hubView() {
  const k = stufeIdx(), tg = TAGIDS.map(id => MISSIONS.find(m => m.id === id)).filter(Boolean);
  const kinds = Object.keys(KIND).filter(x => x !== 'tag');
  return `<div class="mhub"><div class="nav"><button class="back" onclick="go('missions')" aria-label="Zurück">‹</button><b>Interaktive Missionen</b><span class="chip" style="margin-left:auto">🪙 ${S.coins || 0}</span></div>
  <p class="m">Fehler suchen, Teile ziehen, Regler einstellen, Kunden beraten. Jede Mission ist mit Mathe, Deutsch, Englisch oder NaWi verknüpft. Was du lernst, schaltet Werkzeug, Stufen und Fahrzeuge frei.</p>
  ${tagCard()}
  <h2>Deine Werkstatt-Stufe</h2><div class="stufe"><span>🏅</span><div><b>${STUFEN[k].n}</b> · ${doneIn('alle')} Missionen · ${W2.orders || 0} ${(W2.orders || 0) === 1 ? 'Auftrag' : 'Aufträge'}<br>${esc(stufeHint())}</div></div>
  <h2>Werkzeugwand</h2><div class="tgrid">${TOOLS.map(t => { const lk = toolLockTxt(t.id); return `<div class="tool ${lk ? 'lk' : 'fr'}"><b>${lk ? '🔒' : '✅'} ${esc(t.n)}</b><small>${esc(t.en)}</small><div class="m" style="font-size:12px">${esc(t.use)}</div>${lk ? `<small>${esc(lk)}</small>` : ''}</div>` }).join('')}</div>
  ${kinds.map(kd => { const l = SIMM().filter(m => m.kind === kd); return l.length ? `<h2>${KIND[kd][0]} ${KIND[kd][1]}</h2><div class="grp">${l.map(mRow).join('')}</div>` : '' }).join('')}
  <h2>🎁 Tagesaufträge (täglich ein anderer)</h2><div class="grp">${tg.map(mRow).join('')}</div>
  <h2>Fahrzeug-Missionen</h2>${GARAGE.filter(g => VEHM(g.id).length).map(g => `<p class="m" style="margin:10px 0 2px"><b style="color:var(--t)">${esc(g.name)}</b>${S.points < g.need ? ' · 🔒 noch ' + (g.need - S.points) + ' Punkte' : ''}</p><div class="grp">${VEHM(g.id).map(mRow).join('')}</div>`).join('')}</div>`;
}
window.V2X = window.V2X || {}; V2X.hub = hubView; XTAB.hub = 'missions';
// Einstiege: Lernen-Tab, Fahrzeugseite
(function () { const mo = window.missions; window.missions = function () { return `<button class="item tagc" onclick="go('hub')"><div class="dot" style="background:rgba(var(--ar),.18)">🎯</div><div style="flex:1"><b>Interaktive Missionen</b><span class="m">Fehlersuche, Ziehen, Regler, Kunden, Tagesauftrag, Werkzeugwand</span></div></button>` + mo.apply(null, arguments) } })();
(function () { const ov = window.vehView; window.vehView = function () { let h = ov.apply(null, arguments); const g = GARAGE.find(x => x.id === G.id); if (g && VEHM(g.id).length && S.points >= g.need) h = h.replace('<div class="vtiles">', '<div class="vtiles"><button class="vt" id="vt_mis" onclick="vPanel(\'mis\')"><span>🎯</span>Missionen</button>'); return h } })();
VP.mis = (g, v, st) => `<b>🎯 Missionen: ${esc(g.name)}</b><p class="m">Echte Technik zum Ausprobieren, verknüpft mit Schulstoff.</p><div class="vmis">${VEHM(g.id).map(mRow).join('')}</div>`;
// Stufenanzeige in der Werkstatt (nach dem Zeichnen) und Werkzeug-Hinweis
(function () { const r = render; render = function () { const x = r.apply(null, arguments); try { if (view === 'w2') { const hud = document.querySelector('#app .hud'); if (hud && !document.querySelector('#app .stufe')) { const d = document.createElement('div'); d.className = 'stufe'; d.innerHTML = `<span>🏅</span><div><b>${esc(stufeNow().n)}</b>: ${esc(stufeHint())}. <a href="javascript:go('hub')" style="color:var(--a)">Werkzeug und Missionen</a></div>`; hud.parentNode.insertBefore(d, hud.nextSibling) } } } catch (e) { console.error(e) } return x } })();
rankW2 = () => stufeNow().n;
// Titelbilder: Missionen mit eigenem Bild (m.cov)
(function () { const cs = window.coverSrc; window.coverSrc = function (m) { return m && m.cov ? m.cov : cs.apply(null, arguments) } })();
HINT.fehler = (s, c) => { const nx = (s.order || s.checks.map(k => k.id)).find(id => !c.seen.includes(id)); if (nx) flash(mxId('ck_' + nx)); hintBox(esc(s.tip || 'Prüfe zuerst das, was am häufigsten schiefgeht und am schnellsten zu testen ist.') + (nx ? ' Der blinkende Punkt ist ein guter nächster Schritt.' : '')); hintOff() };
