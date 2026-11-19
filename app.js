'use strict';
const $ = s => document.querySelector(s);
const KEY = 'wt-state-v1';
const VERSION = '2.5';
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) } catch (e) {}
S = Object.assign({points: 0, days: [], done: {}, stars: {}, miss: {}, log: [], ratings: [], theme: 'simson', subj: 'mathe', name: '', daily: {}, goalDate: '', sound: true, rev: {}}, S || {});
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) {} };
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => ymd(new Date());
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };

let view = 'home', run = null, timers = [], audioCtx = null, mediaUrl = null;
const clearTimers = () => { timers.forEach(t => { clearTimeout(t); clearInterval(t) }); timers = [];
  if (mediaUrl) { URL.revokeObjectURL(mediaUrl); mediaUrl = null } };
const later = (f, ms) => { const t = setTimeout(f, ms); timers.push(t); return t };

// ---- Aufgaben-Index (für Boxenstopp)
const QT = ['quiz', 'num', 'text', 'match', 'order', 'parts', 'sort', 'gap', 'tf', 'line'];
const QIDX = {};
MISSIONS.forEach(m => m.steps.forEach((s, i) => { if (QT.includes(s.type) && (s.type !== 'parts' || s.ask)) { s.qid = m.id + '#' + i; QIDX[s.qid] = {m, s} } }));
const SUBJ_ORDER = ['mathe', 'deutsch', 'englisch', 'nawi'];
const TAB_SUBJ = [...SUBJ_ORDER, 'technik'];
const byS = k => [...MISSIONS.filter(m => m.subject === k && !m.speech), ...MISSIONS.filter(m => m.subject === k && m.speech)];
const stageDone = st => st.ids.every(id => (S.stars[id] || 0) >= 2);
const projectDone = () => PROJECT.stages.every(stageDone);
const projectPct = () => { const all = PROJECT.stages.flatMap(x => x.ids); return Math.round(100 * all.filter(id => (S.stars[id] || 0) >= 2).length / all.length) };
const missCount = () => Object.keys(S.miss).filter(q => QIDX[q]).length;

function streak() {
  let n = 0; const d = new Date();
  const has = x => S.days.includes(ymd(x));
  if (!has(d)) d.setDate(d.getDate() - 1);
  while (has(d)) { n++; d.setDate(d.getDate() - 1) }
  return n;
}
const dayIdx = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5) };
const doneToday = id => S.log.some(e => e.d === today() && e.id === id);
const pickFor = k => { const l = byS(k); return l.find(m => !S.done[m.id]) || l.slice().sort((a, b) => (S.stars[a.id] || 0) - (S.stars[b.id] || 0))[0] || l[0] };
const nextPro = () => { const l = byS('technik'); return l.find(m => !S.done[m.id]) || l.slice().sort((x, y) => (S.stars[x.id] || 0) - (S.stars[y.id] || 0))[0] };
function plan() {
  if (S.daily.d !== today()) {
    const k = SUBJ_ORDER[dayIdx() % 4], k2 = SUBJ_ORDER[(dayIdx() + 1) % 4];
    S.daily = {d: today(), main: pickFor(k).id, bonus: pickFor(k2).id, pro: nextPro().id}; save();
  }
  return {main: MISSIONS.find(m => m.id === S.daily.main), bonus: MISSIONS.find(m => m.id === S.daily.bonus), pro: MISSIONS.find(m => m.id === S.daily.pro) || nextPro()};
}
const theme = id => THEMES[id];

// ---- Titelbilder (Fotos als Ausschnitte, Sport als Zeichnung). Eigene Bilder: img/m-<id>.jpg und Id in MIMG eintragen
const COVERS = {simson: ['simson-1', 'simson-2', 'simson-3', 'simson-4'], traktor: ['traktor-1', 'traktor-3', 'traktor-2', 'traktor-4'], hof: ['hof-1', 'hof-3', 'hof-2', 'hof-4'], tuning: ['tuning-1', 'tuning-3', 'tuning-2', 'tuning-4'], sport: ['sport-1', 'sport-2']};
const SUBJ_COVER = {mathe: 'img/m-mathe-8.jpg', deutsch: 'img/m-deutsch-3.jpg', englisch: 'img/m-englisch-7.jpg', nawi: 'img/m-nawi-8.jpg', technik: 'img/m-technik-3.jpg'};
const MIMG = typeof MIMG_LIST !== 'undefined' ? MIMG_LIST : [];
const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const coverFile = n => n.startsWith('img/') ? n : 'img/cover/' + n + '.jpg';
function coverSrc(m, k = 0) { if (MIMG.includes(m.id)) return 'img/m-' + m.id + '.jpg'; const l = COVERS[m.theme] || COVERS.tuning; return coverFile(l[(hash(m.id) + k) % l.length]) }
function cover(src, o = {}) { const sub = o.subj ? SUBJECTS[o.subj] : null;
  return `<div class="cv ${o.cls || ''}"><img src="${src}" alt="" loading="lazy" onerror="this.remove()">${sub ? `<span class="cvc">${sub.emoji} ${sub.long}${o.min ? ' · ' + o.min + ' Min.' : ''}</span>` : ''}${o.title ? `<div class="cvt">${o.title}</div>` : ''}</div>`; }

function setAccent(c) { document.documentElement.style.setProperty('--ac', c) }
const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
const REV_INT = [3, 7, 14, 30];
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d) };
const dueMissions = () => Object.entries(S.rev).filter(([id, r]) => r.due <= today() && MISSIONS.some(m => m.id === id)).map(([id]) => id);
const rankOf = pts => { let i = 0; RANKS.forEach((r, k) => { if (pts >= r.p) i = k }); return {cur: RANKS[i], next: RANKS[i + 1], i} };
function tone(f, d, at = 0, type = 'sine', g = .12) {
  if (!S.sound) return;
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), v = audioCtx.createGain(), t0 = audioCtx.currentTime + at;
    o.type = type; o.frequency.value = f; v.gain.setValueAtTime(g, t0); v.gain.exponentialRampToValueAtTime(.0008, t0 + d); o.connect(v); v.connect(audioCtx.destination); o.start(t0); o.stop(t0 + d + .02) } catch (e) {}
}
const snd = k => { if (k === 'ok') { tone(660, .12); tone(880, .18, .1) } else if (k === 'bad') tone(190, .22, 0, 'triangle', .1); else if (k === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, .28, i * .12)) };
function confetti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'confetti'; const cols = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#0a84ff', '#bf5af2'];
  for (let i = 0; i < 46; i++) { const p = document.createElement('i'); p.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 6]};animation-delay:${Math.random() * .5}s;animation-duration:${1.6 + Math.random() * 1.2}s;transform:rotate(${Math.random() * 360}deg)`; box.appendChild(p) }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3400);
}
const ringsHTML = () => {
  const dayN = new Set(S.log.filter(e => e.d === today() && e.id !== 'box').map(e => e.id)).size;
  const wk = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return S.days.includes(ymd(d)) }).filter(Boolean).length;
  const all = MISSIONS.filter(m => !m.speech), mast = Math.round(100 * all.filter(m => (S.stars[m.id] || 0) >= 2).length / all.length);
  const ring = (r, col, frac) => { const L = 2 * Math.PI * r; return `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${col}" stroke-opacity=".22" stroke-width="10"/><circle class="rg" cx="60" cy="60" r="${r}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" transform="rotate(-90 60 60)" style="stroke-dasharray:0 ${L}" data-v="${Math.max(.001, Math.min(1, frac)) * L} ${L}"/>` };
  const rk = rankOf(S.points), nx = rk.next;
  return `<div class="card ringcard"><svg viewBox="0 0 120 120" width="112" height="112">${ring(52, '#fa114f', dayN / 2)}${ring(40, '#92e82a', wk / 5)}${ring(28, '#1eeaef', mast / 100)}</svg>
  <div class="rl"><div><span style="color:#fa114f">●</span> <b>Heute</b> ${Math.min(dayN, 2)}/2 Missionen</div><div><span style="color:#92e82a">●</span> <b>Woche</b> ${wk}/5 Tage</div><div><span style="color:#1eeaef">●</span> <b>Können</b> ${mast} %</div>
  <div class="rk">${rk.cur.e} <b>${rk.cur.n}</b>${nx ? ` · noch ${nx.p - S.points} Punkte bis ${nx.e} ${nx.n}` : ' · höchster Rang'}</div></div></div>`;
};

function go(v) { clearTimers(); if (typeof engStop === 'function') engStop(); run = null; view = v; render() }

function render() {
  if (view !== 'ws' && typeof ws3dStop === 'function') ws3dStop();
  const a = $('#app');
  const tabs = [['home', '🏠', 'Heute'], ['missions', '📚', 'Lernen'], ['garage', '🏁', 'Garage'], ['parents', '👪', 'Eltern']];
  $('#tab').innerHTML = tabs.map(t => `<button class="${view === t[0] || ((view === 'veh' || view === 'ws') && t[0] === 'garage') ? 'on' : ''}" onclick="go('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`).join('');
  $('#tab').style.display = view === 'run' ? 'none' : 'flex';
  if (view === 'home') { const p = plan(); setAccent(SUBJECTS[p.main.subject].color); a.innerHTML = home(p) }
  else if (view === 'missions') { setAccent(SUBJECTS[S.subj].color); a.innerHTML = missions() }
  else if (view === 'garage') { setAccent('#e0b43a'); a.innerHTML = garage() }
  else if (view === 'ws') { setAccent('#e0b43a'); a.innerHTML = wsView(); requestAnimationFrame(ws3dStart) }
  else if (view === 'veh') { setAccent('#e0b43a'); a.innerHTML = vehView(); requestAnimationFrame(() => drawDirt(false)) }
  else if (view === 'parents') { setAccent('#3b8cff'); a.innerHTML = parents() }
  else if (view === 'run') step();
  if (view === 'home') requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.rg').forEach(c => { c.style.strokeDasharray = c.dataset.v })));
  window.scrollTo(0, 0);
}

const mItem = (m, tag = '') => { const t = theme(m.theme), n = S.stars[m.id] || 0, d = S.done[m.id] || 0;
  return `<button class="item" onclick="start('${m.id}')"><div class="th2" style="background:${t.color}55"><img src="${coverSrc(m)}" alt="" loading="lazy" onerror="this.remove()"><span>${SUBJECTS[m.subject].emoji}</span></div>
  <div style="flex:1"><b>${esc(m.title)}</b><span class="m">${esc(m.sub)} · ${m.min} Min.${m.pro ? ' · <b style="color:#ff453a">PROFI</b>' : ''}${tag}</span></div>
  ${d ? (m.speech ? `<span class="done">✓ ${d}×</span>` : `<span class="stars">${starStr(n)}</span>`) : ''}</button>`; };

function home(p) {
  const m = p.main, sub = SUBJECTS[m.subject], t = theme(m.theme), st = streak(), done = doneToday(m.id);
  const g = [...GARAGE].reverse().find(x => S.points >= x.need);
  const nxt = GARAGE.find(x => x.need > S.points);
  const bonusDone = doneToday(p.bonus.id), box = missCount(), due = dueMissions().length;
  const hour = new Date().getHours(), hi = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';
  return `<div class="top"><div><div class="m">${new Date().toLocaleDateString('de-DE', {weekday: 'long', day: 'numeric', month: 'long'})}</div><h1 onclick="egg('h1',5,()=>ride('🛵💨','Ring-ding-ding! Zweitakt-Alarm'))">${hi}${S.name ? ', ' + esc(S.name) : ''}!</h1></div></div>
  <div class="chips"><span class="chip" onclick="egg('fire',3,()=>toast('Heiß! Aber bitte keinen Kolbenklemmer bauen 😅'))">🔥 ${st} ${st === 1 ? 'Tag' : 'Tage'}</span><span class="chip" onclick="egg('star',5,()=>ride('🚜🌾','Rasentraktor-Parade! Bahn frei.'))">⭐ ${S.points} Punkte</span></div>
  ${ringsHTML()}
  <div class="hero"><div class="cv hi"><img src="${coverSrc(m)}" alt="" onerror="this.remove()"></div><div class="m" style="color:rgba(255,255,255,.85)">Mission des Tages · ${sub.emoji} ${sub.long} · ${m.min} Min.</div>
    <h3>${t.emoji} ${esc(m.title)}</h3><p>${esc(m.sub)}</p>
    <button class="btn" onclick="start('${m.id}')">${done ? 'Heute geschafft ✓ · nochmal' : 'Los geht’s'}</button></div>
  <h2>Noch mehr?</h2>
  <button class="item" onclick="start('${p.bonus.id}')"><div class="dot" style="background:${SUBJECTS[p.bonus.subject].color}33">${SUBJECTS[p.bonus.subject].emoji}</div><div style="flex:1"><b>Bonus: ${esc(p.bonus.title)}</b><span class="m">${SUBJECTS[p.bonus.subject].long} · ${p.bonus.min} Min.</span></div>${bonusDone ? '<span class="done">✓</span>' : ''}</button>
  <button class="item" onclick="start('${p.pro.id}')"><div class="dot" style="background:#ff453a33">🔩</div><div style="flex:1"><b>Profi-Challenge: ${esc(p.pro.title)}</b><span class="m">Motortechnik für Fortgeschrittene · ${p.pro.min} Min. · mit Taschenrechner</span></div>${doneToday(p.pro.id) ? '<span class="done">✓</span>' : ''}</button>
  ${box || due ? `<button class="item" onclick="startBox()"><div class="dot" style="background:#ff453a33">🏁</div><div style="flex:1"><b>Boxenstopp</b><span class="m">${box ? box + ' Aufgaben zum Wiederholen' : ''}${box && due ? ' · ' : ''}${due ? due + (due === 1 ? ' Mission' : ' Missionen') + ' zum Auffrischen' : ''}</span></div></button>` : ''}
  <h2>Deine Fächer</h2>
  <div class="grid">${TAB_SUBJ.map(k => { const v = SUBJECTS[k], l = byS(k), d = l.filter(x => S.done[x.id]).length, g2 = l.filter(x => (S.stars[x.id] || 0) >= 2).length;
    return `<button class="th" style="border-color:${v.color}55" onclick="S.subj='${k}';save();go('missions')"><div class="thi"><img src="${coverFile(SUBJ_COVER[k])}" alt="" loading="lazy" onerror="this.remove()"><span>${v.emoji}</span></div><b>${v.name}</b>
    <span class="m">${d} von ${l.length} Missionen</span><div class="bar" style="margin-top:8px"><i style="width:${Math.max(3, 100 * g2 / l.length)}%;background:${v.color}"></i></div></button>`; }).join('')}</div>
  <h2>Das große Ziel</h2>
  <button class="item" onclick="go('garage')"><div class="dot" style="background:#ff453a33">🏆</div><div style="flex:1"><b>${esc(PROJECT.name)}</b><span class="m">${projectDone() ? 'Geschafft! Urkunde in der Garage' : projectPct() + ' % der Etappen geschafft'}</span><div class="bar" style="margin-top:8px"><i style="width:${Math.max(3, projectPct())}%;background:#ff453a"></i></div></div></button>
  <h2>Deine Garage</h2>
  <div class="card gcard" onclick="openVeh('${g.id}')"><div class="gimg">${gimg(g)}</div><div style="flex:1"><b>${esc(g.name)}</b>
  ${nxt ? `<div class="m">Noch ${nxt.need - S.points} Punkte bis ${esc(nxt.name)}</div><div class="bar" style="margin-top:8px"><i style="width:${Math.max(4, 100 * (S.points - g.need) / (nxt.need - g.need))}%"></i></div>` : '<div class="m">Alles freigeschaltet!</div>'}</div></div>`;
}
const gimg = g => g.svg && SVGS[g.svg] ? `<div style="width:100%;padding:2px">${SVGS[g.svg]}</div>` : `<img src="${g.img}" alt="" onerror="this.replaceWith(document.createTextNode('${g.emoji}'))">`;

function missions() {
  const list = byS(S.subj); let last = '', out = '';
  list.forEach(m => { if (m.topic !== last) { out += `<h2>${esc(m.topic)}</h2>`; last = m.topic } out += mItem(m); });
  const s = SUBJECTS[S.subj];
  return `${cover(coverFile(SUBJ_COVER[S.subj]), {cls: 'tall', title: s.emoji + ' ' + s.long})}<p class="m">${S.subj === 'technik' ? 'Über den Schulstoff hinaus: Motortechnik für Fortgeschrittene. Der Taschenrechner ist erlaubt.' : 'Klasse 6 · Sterne gibt es für Aufgaben, die du gleich beim ersten Versuch löst.'}</p>
  <div class="chips2 wrap">${TAB_SUBJ.map(k => `<button class="${S.subj === k ? 'on' : ''}" style="${S.subj === k ? 'border-color:' + SUBJECTS[k].color : ''}" onclick="S.subj='${k}';save();render()">${SUBJECTS[k].emoji} ${SUBJECTS[k].name}</button>`).join('')}</div>${out}`;
}

function projectView() {
  const done = projectDone();
  return `<div class="card" style="background:linear-gradient(150deg,#3a1411,#1c1c1e)"><div class="row sp"><b style="font-size:20px">🏆 ${esc(PROJECT.title)}</b><span class="chip">${projectPct()} %</span></div><p class="m" style="color:var(--t)">${esc(PROJECT.text)}</p>
  <div class="bar" style="margin:10px 0"><i style="width:${Math.max(3, projectPct())}%;background:#ff453a"></i></div>
  ${PROJECT.stages.map((st, k) => `<div style="margin-top:12px"><div class="row sp"><b>${stageDone(st) ? '✅' : '🔧'} Etappe ${k + 1}: ${esc(st.title)}</b></div><p class="m" style="margin:2px 0 6px">${esc(st.text)}</p>
    ${st.ids.map(id => { const m = MISSIONS.find(x => x.id === id), n = S.stars[id] || 0; return `<button class="item" style="margin:4px 0;padding:10px" onclick="start('${id}')"><div class="dot" style="width:34px;height:34px;font-size:18px;background:${theme(m.theme).color}33">${SUBJECTS[m.subject].emoji}</div><div style="flex:1"><b style="font-size:15px">${esc(m.title)}</b></div><span class="stars">${n >= 2 ? '✓ ' : ''}${starStr(n)}</span></button>` }).join('')}</div>`).join('')}
  ${done ? `<div class="card center" style="background:#ff453a22;margin-top:16px"><div class="big">🏆</div><b style="font-size:20px">Urkunde</b><p>Du hast alle Etappen geschafft und weißt jetzt, was zu einem MTX-Zylinder gehört.${S.goalDate ? '<br><span class="m">Geschafft am ' + esc(S.goalDate) + '</span>' : ''}</p></div>` : ''}
  <p class="m" style="margin-top:14px">${esc(PROJECT.note)}</p></div>`;
}
function parents() {
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d });
  const cnt = d => S.log.filter(e => e.d === ymd(d)).length;
  const r = S.ratings.slice(-10);
  const avg = r.length ? (r.reduce((a, b) => a + b.score, 0) / r.length).toFixed(1) : '–';
  const rows = TAB_SUBJ.map(k => { const v = SUBJECTS[k], l = byS(k).filter(m => !m.speech), d = l.filter(m => S.done[m.id]), st = d.filter(m => S.stars[m.id]);
    const a = st.length ? (st.reduce((x, m) => x + S.stars[m.id], 0) / st.length).toFixed(1) : '–';
    return `<div class="row sp" style="padding:6px 0"><span>${v.emoji} <b>${v.name}</b></span><span class="m">${d.length} von ${l.length} Missionen · Ø ${a} Sterne</span></div>`; }).join('');
  const weak = {}; Object.entries(S.miss).forEach(([q, n]) => { if (QIDX[q]) { const m = QIDX[q].m; weak[m.title + ' (' + SUBJECTS[m.subject].name + ')'] = (weak[m.title + ' (' + SUBJECTS[m.subject].name + ')'] || 0) + n } });
  const wk = Object.entries(weak).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const plans = TAB_SUBJ.map(k => `<details class="card"><summary><b>${SUBJECTS[k].emoji} ${SUBJECTS[k].long}</b></summary>${byS(k).map(m => `<p class="m"><b style="color:var(--t)">${esc(m.title)}:</b> ${esc(m.rlp)}</p>`).join('')}</details>`).join('');
  return `<h1>Eltern</h1><p class="m">Überblick über Fortschritt und Themen. Sprachaufnahmen werden nicht gespeichert.</p>
  <div class="card"><b>Letzte 7 Tage</b><div class="week">${days.map(d => `<div><i style="height:${cnt(d) * 26 + 4}px"></i>${d.toLocaleDateString('de-DE', {weekday: 'short'}).slice(0, 2)}</div>`).join('')}</div>
  <div class="m">Serie: ${streak()} Tage · Missionen gesamt: ${Object.values(S.done).reduce((a, b) => a + b, 0)}</div></div>
  <div class="card"><b>Fächer</b>${rows}</div>
  <div class="card"><b>Das fällt noch schwer</b>${wk.length ? wk.map(w => `<div class="row sp" style="padding:6px 0"><span>${esc(w[0])}</span><span class="m">${w[1]}×</span></div>`).join('') + '<p class="m">Diese Aufgaben kommen im Boxenstopp noch einmal dran.</p>' : '<p class="m">Noch nichts. Gut so.</p>'}</div>
  ${r.length ? `<div class="card"><b>Gefühl beim Sprechen (1–5)</b><p class="m">Durchschnitt der letzten ${r.length} Einträge: <b style="color:var(--t)">${avg}</b></p></div>` : ''}
  <h2>Lehrplan-Bezug</h2>${plans}
  <div class="card"><b>Tipps</b><p class="m">• Erst zuhören, ausreden lassen, Zeit geben.<br>• Fehler als Hinweis sehen: Im Boxenstopp wird geübt, was nicht gleich klappte.<br>• Anstrengung loben, nicht nur Ergebnisse.<br>• Zehn bis fünfzehn Minuten täglich sind besser als eine lange Stunde.</p></div>
  <div class="card"><b>Name in der App</b><input id="nm" value="${esc(S.name)}" placeholder="Vorname (optional)" style="width:100%;margin-top:8px;padding:12px;border-radius:12px;border:0;background:var(--card2);color:var(--t);font:inherit" onchange="S.name=this.value.trim().slice(0,20);save()"></div>
  <div class="card"><div class="row sp"><b>Töne</b><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" ${S.sound ? 'checked' : ''} onchange="S.sound=this.checked;save()"> an</label></div><p class="m">Kurze Klänge bei richtigen Antworten und am Ende einer Mission.</p></div>
  <details class="card"><summary><b>Wie die App lernt (Lernprinzipien)</b></summary><p class="m">• <b style="color:var(--t)">Abrufen statt nur lesen:</b> Fast alles sind Fragen und Aufgaben. Aktives Erinnern festigt Wissen besser als bloßes Durchlesen.<br>• <b style="color:var(--t)">Verteiltes Wiederholen:</b> Der Boxenstopp bringt Fehler und ältere Missionen nach 3, 7, 14 und 30 Tagen zurück.<br>• <b style="color:var(--t)">Abwechslung:</b> Die Fächer wechseln täglich (Verschränken statt Blocklernen).<br>• <b style="color:var(--t)">Sofortiges Feedback:</b> Jede Antwort wird erklärt, nicht nur bewertet.<br>• <b style="color:var(--t)">Wachstum statt Fehlerangst:</b> Sterne zählen den ersten Versuch, aber Fehler führen zu Wiederholung, nicht zu Punktabzug.<br>• <b style="color:var(--t)">Faire Ziele:</b> Wochenziel 5 von 7 Tagen, damit ein freier Tag die Serie nicht zerstört.<br>• <b style="color:var(--t)">Eigener Antrieb:</b> Eigene Interessen (Simson, Traktor, Tuning) und das große Ziel geben Sinn, Punkte sind nur Beiwerk.</p></details>
  <details class="card"><summary><b>Bildnachweis</b></summary>${CREDITS.map(c => `<p class="m"><b style="color:var(--t)">${esc(c.title)}</b><br>${esc(c.author)} · ${esc(c.license)} · <a style="color:#0a84ff" href="https://commons.wikimedia.org/wiki/File:${encodeURI(c.page)}" target="_blank" rel="noopener">Quelle</a></p>`).join('')}<p class="m">Fotos von Wikimedia Commons, in der Größe angepasst. Fotos vom Rasentraktor: eigene Aufnahmen. Die Zeichnungen sind selbst erstellt. Die Garage-Bilder von Simson S51, SR50, Schwalbe, Traktor mit Anhänger, Unimog und Feldhäcksler sowie die Titelbilder vieler Missionen wurden mit KI (ChatGPT, Gemini) erzeugt und zeigen typische, aber keine echten Fahrzeuge.</p></details>
  <div class="card"><b>Version</b><p class="m" onclick="egg('ver',5,()=>toast('🔧 Merke: Zweitakt-Gemisch 1:50. Gebaut mit Liebe, Öl und Kaffee.'))">Lernwerkstatt, Version ${VERSION}. Missionen: ${MISSIONS.length} (davon ${MISSIONS.filter(m => m.speech).length} Sprechübungen).</p></div>
  <div class="card"><b>Synchronisation</b><p class="m">Noch nicht aktiv. Der Fortschritt liegt nur auf diesem Gerät.</p></div>
  <button class="btn alt" onclick="if(confirm('Wirklich alle Fortschritte löschen?')){S.points=0;S.days=[];S.done={};S.stars={};S.miss={};S.log=[];S.ratings=[];S.daily={};S.goalDate='';save();render()}">Fortschritt zurücksetzen</button>`;
}

// ---- Mission ablaufen lassen
function start(id) {
  clearTimers();
  const m = MISSIONS.find(x => x.id === id);
  run = {m, i: 0, ok: 0, tot: 0, help: 0, score: 0, steps: [...m.steps, ...(m.speech ? [{type: 'rate'}] : [])]};
  view = 'run'; setAccent(theme(m.theme).color); render();
}
function startBox() {
  clearTimers();
  let ids = Object.keys(S.miss).filter(q => QIDX[q]).sort((x, y) => S.miss[y] - S.miss[x]).slice(0, 6), dueIds = [];
  dueMissions().forEach(id => { if (ids.length >= 9) return; const qs = shuffle(Object.keys(QIDX).filter(q => QIDX[q].m.id === id && !ids.includes(q))).slice(0, 2); if (qs.length) { qs.forEach(q => ids.push(q)); dueIds.push(id) } });
  if (ids.length < 4) shuffle(Object.keys(QIDX).filter(q => S.done[QIDX[q].m.id] && !ids.includes(q))).slice(0, 6 - ids.length).forEach(q => ids.push(q));
  if (!ids.length) { alert('Noch nichts zu wiederholen. Schließe zuerst eine Mission ab.'); return }
  const steps = [{type: 'wissen', title: 'Boxenstopp', text: 'Hier kommen Aufgaben dran, die beim ersten Mal nicht gleich geklappt haben, und Aufgaben zum Auffrischen. Wer Wissen mit Pausen wiederholt, behält es länger. Nimm dir Zeit.'}, ...shuffle(ids).map(q => QIDX[q].s)];
  run = {m: {id: 'box', theme: 'sport', title: 'Boxenstopp', steps}, i: 0, ok: 0, tot: 0, help: 0, score: 0, steps, dueIds};
  view = 'run'; setAccent(theme('sport').color); render();
}
const next = () => { clearTimers(); run.i++; step() };
function step() {
  const a = $('#app'), s = run.steps[run.i], n = run.steps.length;
  if (run.i >= n) return finish();
  const head = `<div class="nav"><button class="back" onclick="if(confirm('Mission beenden?'))go('home')">✕</button><div class="steps">${run.steps.map((_, k) => `<i class="${k <= run.i ? 'on' : ''}"></i>`).join('')}</div></div>`;
  run.cur = {tries: 0, done: false, hl: 0, help: false};
  a.innerHTML = head + stepVis(s) + STEP[s.type](s);
  if (INIT[s.type]) INIT[s.type](s);
  window.scrollTo(0, 0);
}
function stepVis(s) {
  const m = run.m, i = run.i; if (m.speech) return '';
  if (s.type === 'wissen' && !s.svg) return cover(coverSrc(m, i), i === 0 && m.id !== 'box' ? {subj: m.subject, min: m.min} : {cls: 'sm'});
  if ((s.type === 'quiz' || s.type === 'num') && !s.img && i % 3 === 1) return cover(coverSrc(m, i), {cls: 'sm'});
  return '';
}
const nextBtn = (label = 'Weiter', dis = false) => `<button class="btn" id="nx" ${dis ? 'disabled' : ''} onclick="next()">${label}</button>`;
const fb = (cls, html) => { const e = $('#fb'); if (e) e.innerHTML = html ? `<div class="fb ${cls}">${html}</div>` : '' };

// Antwort werten: nur der erste Versuch zählt für Sterne und Boxenstopp
function scoreQ(ok) {
  const s = run.steps[run.i]; run.tot++; snd(ok ? 'ok' : 'bad');
  if (ok && run.cur.help) { run.ok++; run.help++; if (s.qid && !S.miss[s.qid]) S.miss[s.qid] = 1 }
  else if (ok) { run.ok++; if (s.qid && S.miss[s.qid]) { S.miss[s.qid]--; if (S.miss[s.qid] <= 0) delete S.miss[s.qid] } }
  else if (s.qid) S.miss[s.qid] = (S.miss[s.qid] || 0) + 1;
  save();
}
function qDone() { run.cur.done = true; const b = $('#nx'); if (b) { b.disabled = false; b.scrollIntoView({block: 'nearest', behavior: 'smooth'}) } const c = $('#chk'); if (c) c.style.display = 'none' }
const norm = (s, cs) => { s = String(s).normalize('NFC').trim().replace(/[.,!?;:„“"’']/g, '').replace(/\s+/g, ' '); return cs ? s : s.toLowerCase() };
const parseNum = s => { s = String(s).replace(/\s/g, '').replace(/[^\d.,\-]/g, ''); if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, ''); return Number(s.replace(',', '.')) };

const STEP = {
  wissen: s => `<h1>${esc(s.title)}</h1>${s.svg ? `<div class="card art">${SVGS[s.svg]}</div>` : ''}<div class="card"><p>${rich(s.text)}</p></div>${s.fact ? `<div class="card fact"><b>💡 Wusstest du?</b><p class="m" style="color:var(--t)">${rich(s.fact)}</p></div>` : ''}${nextBtn()}`,
  quiz: s => { run.cur.order = shuffle(s.opts.map((_, i) => i));
    return `<div class="q">${rich(s.q)}</div>${s.img ? `<img class="qimg" src="${s.img}" alt="">` : ''}${run.cur.order.map(i => `<button class="opt" id="o${i}" onclick="qpick(${i})">${esc(s.opts[i])}</button>`).join('')}${hbtn(s.opts.length > 2 ? '💡 Tipp: 50:50' : '💡 Tipp')}<div id="fb"></div>${nextBtn('Weiter', true)}`; },
  num: s => `<div class="q">${rich(s.q)}</div>${run.m.pro ? '<button class="calcb" onclick="calcOpen()">🖩 Taschenrechner</button>' : ''}<div class="row"><input id="in" class="in" inputmode="decimal" autocomplete="off" placeholder="Antwort" onkeydown="if(event.key==='Enter')ncheck()"><span class="m">${esc(s.unit || '')}</span></div>${hbtn()}<div id="fb"></div>
    <button class="btn" id="chk" onclick="ncheck()">Prüfen</button>${nextBtn('Weiter', true)}`,
  text: s => `<div class="q">${rich(s.q)}</div><input id="in" class="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Antwort" onkeydown="if(event.key==='Enter')tcheck()">${hbtn()}<div id="fb"></div>
    <button class="btn" id="chk" onclick="tcheck()">Prüfen</button>${nextBtn('Weiter', true)}`,
  match: s => { run.cur.R = shuffle(s.pairs.map((_, i) => i)); run.cur.sel = null; run.cur.found = 0; run.cur.mist = 0;
    return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')} Tippe links und rechts jeweils eins an.</p><div class="mt"><div>${s.pairs.map((p, i) => `<button class="mb" id="ml${i}" onclick="mpick('l',${i})">${esc(p[0])}</button>`).join('')}</div>
    <div>${run.cur.R.map(i => `<button class="mb" id="mr${i}" onclick="mpick('r',${i})">${esc(s.pairs[i][1])}</button>`).join('')}</div></div>${hbtn('💡 Zeig mir ein Paar')}<div id="fb"></div>${nextBtn('Weiter', true)}`; },
  order: s => { run.cur.idx = shuffle(s.items.map((_, i) => i)); run.cur.got = []; run.cur.mist = 0;
    return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')}</p><div class="card" id="oo" style="min-height:54px"><span class="m">Hier entsteht die richtige Reihenfolge …</span></div>
    <div id="op">${run.cur.idx.map(i => `<button class="mb wide" id="oi${i}" onclick="opick(${i})">${esc(s.items[i])}</button>`).join('')}</div>${hbtn('💡 Was kommt als Nächstes?')}<div id="fb"></div>${nextBtn('Weiter', true)}`; },
  sort: s => { const c = run.cur; c.sel = null; c.left = s.items.length; c.mist = 0;
    return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')} Tippe ein Kärtchen an und dann das passende Fach.</p>
    <div class="pool" id="pool">${shuffle(s.items.map((_, i) => i)).map(i => `<button class="mb kt" id="si${i}" onclick="spick(${i})">${esc(s.items[i][0])}</button>`).join('')}</div>
    <div class="bins b${s.cats.length}">${s.cats.map((k, j) => `<button class="bin" id="sb${j}" onclick="sbin(${j})"><b>${esc(k)}</b><div class="bc" id="bc${j}"></div></button>`).join('')}</div>${hbtn('💡 Zeig mir eins')}<div id="fb"></div>${nextBtn('Weiter', true)}`; },
  gap: s => { const c = run.cur; c.k = 0; c.mist = 0; const segs = s.text.split(/\{([^}]*)\}/); c.ans = segs.filter((_, i) => i % 2).map(x => x.split('|'));
    const chips = shuffle([...c.ans.map(a => a[0]), ...(s.extra || [])]);
    return `<h1>${esc(s.title)}</h1><p class="m">Tippe die Wörter in der richtigen Reihenfolge in die Lücken. Die blaue Lücke ist dran.</p>
    <div class="card gapt">${segs.map((x, i) => i % 2 ? `<span class="gp${i === 1 ? ' cur' : ''}" id="gp${(i - 1) / 2}">${' '.repeat(Math.max(3, Math.min(10, x.split('|')[0].length)))}</span>` : rich(x)).join('')}</div>
    <div class="pool">${chips.map((w, k) => `<button class="mb kt" id="gc${k}" data-w="${esc(w)}" onclick="gpick(${k})">${esc(w)}</button>`).join('')}</div>${hbtn('💡 Welches Wort passt?')}<div id="fb"></div>${nextBtn('Weiter', true)}`; },
  tf: s => { run.cur.k = 0; run.cur.mist = 0; run.cur.row = 0;
    return `<h1>${esc(s.title || 'Blitzrunde')}</h1><p class="m">Richtig oder falsch? Entscheide dich.</p><div class="card tfc" id="tfc"></div>
    <div class="tfb" id="tfb"><button class="tfx no" onclick="tfa(false)">✗ Falsch</button><button class="tfx yes" onclick="tfa(true)">✓ Richtig</button></div><div id="fb"></div>${nextBtn('Weiter', true)}`; },
  line: s => { const t = s.ticks || [[s.min, de(s.min, 3)], [s.max, de(s.max, 3)]];
    return `<div class="q">${rich(s.q)}</div>${run.m.pro ? '<button class="calcb" onclick="calcOpen()">🖩 Taschenrechner</button>' : ''}<div class="card nlc"><div class="nlv"><b id="lv">?</b></div>
    <div class="nl"><div class="nlr" id="nlr"></div><input type="range" id="lr" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.start ?? s.min}" oninput="lshow()">
    <div class="nlt">${t.map(x => `<span style="left:${nlp((x[0] - s.min) / (s.max - s.min))}">${esc(x[1])}</span>`).join('')}</div></div></div>${hbtn()}<div id="fb"></div>
    <button class="btn" id="chk" onclick="lcheck()">Prüfen</button>${nextBtn('Weiter', true)}`; },
  parts: s => { const sp = SPOTS[s.svg]; run.cur.n = 0; run.cur.mist = 0; run.cur.todo = s.ask ? shuffle(sp.map((_, i) => i)) : []; run.cur.hit = [];
    return `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')}</p><div class="card art"><button class="zoomb" onclick="this.parentNode.classList.toggle('z');this.textContent=this.parentNode.classList.contains('z')?'🔍 Verkleinern':'🔍 Vergrößern'">🔍 Vergrößern</button><div class="pwo"><div class="pw">${SVGS[s.svg]}${sp.map((p, i) => `<button class="hs" id="hs${i}" style="left:${p.x}%;top:${p.y}%" onclick="hpick(${i})">${s.ask ? '' : i + 1}</button>`).join('')}</div></div></div>
    <div class="card" id="hi"><p class="m">${s.ask ? 'Los geht’s …' : 'Tippe auf die Zahlen und lerne die Teile kennen.'}</p></div>${s.ask ? hbtn('💡 Wo ist das?') : ''}<div id="fb"></div>${nextBtn('Weiter', !!s.ask)}`; },
  slider: s => `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text || '')}</p>${s.sliders.map(x => `<div class="sld"><div class="row sp"><span>${esc(x.label)}</span><b id="sv_${x.id}"></b></div><input type="range" id="sr_${x.id}" min="${x.min}" max="${x.max}" step="${x.step}" value="${x.val}" oninput="slid()"></div>`).join('')}
    <div class="card lab" id="lab"></div>${nextBtn()}`,
  circuit: () => `<h1>Stromkreis-Labor</h1><p class="m">Schließe den Schalter und stecke etwas in die Lücke. Leuchtet die Lampe?</p><div class="card"><div id="cv"></div><div class="center" id="cs" style="font-weight:700"></div></div>
    <button class="btn alt" id="csw" onclick="cswitch()">Schalter einschalten</button><div class="chips2 wrap" id="cmat">${CMAT.map((m, k) => `<button onclick="cmat(${k})">${m[0]}</button>`).join('')}</div>${nextBtn()}`,
  reaction: () => `<h1>Reaktionstest</h1><p class="m">Tippe auf die Fläche, sobald sie grün wird. Nicht zu früh tippen!</p><button class="react" id="rx" onclick="rxTap()">Tippe zum Start</button><div class="center m" id="rr"></div>${nextBtn()}`,
  breath: s => `<h1>Tanken</h1><p class="m">${esc(s.text)}</p><div class="ring" id="ring">Gleich geht’s los</div><div class="center m" id="bc"></div>${nextBtn('Überspringen')}`,
  rhythm: s => `<h1>Gänge</h1><p class="m">${esc(s.text)}</p>
    <div class="chips2" id="gears"><button data-b="66" class="on">Gang 1</button><button data-b="84">Gang 2</button><button data-b="104">Gang 3</button></div>
    <div class="card">${s.lines.map((l, a) => `<div class="line">${l.map((y, b) => `<span class="syl" id="s${a}_${b}">${esc(y)}</span>`).join('')}</div>`).join('')}</div>
    <button class="btn alt" id="rs" onclick="rhythmToggle()">▶ Takt starten</button>${nextBtn()}`,
  soft: s => `<h1>Kaltstart</h1><p class="m">${esc(s.text)}</p>${s.lines.map((l, k) => `<div class="card"><div class="sl">${esc(l)}</div><div class="rev" id="rv${k}"><i></i></div><button class="btn alt" style="margin:6px 0 0;padding:12px" onclick="softGo(${k})">Sanft starten</button></div>`).join('')}${nextBtn()}`,
  phrase: s => `<h1>Schaltpause</h1><p class="m">${esc(s.text)}</p><div id="ph"></div>`,
  talk: s => `<h1>Erzähl, wenn du magst</h1><div class="card"><p style="font-size:20px;font-weight:600">${esc(s.prompt)}</p><p class="m">${esc(s.hint)}</p></div>
    <div class="card center"><div class="big" id="rc">🎙️</div><div class="m" id="rt">Aufnahme ist freiwillig und bleibt nur auf diesem Gerät.</div>
    <button class="btn alt" id="rb" onclick="recToggle()">Aufnehmen</button><div id="pl"></div></div>${nextBtn()}`,
  challenge: s => `<h1>${esc(s.title)}</h1><p class="m">${esc(s.text)}</p>${s.options.map((o, k) => `<button class="opt" onclick="pick(this,${k})">${esc(o)}</button>`).join('')}
    <p class="m">Mach es in deinem Tempo. Ob es klemmt oder nicht: Du hast es gemacht, das zählt.</p>${nextBtn('Heute erledigt ✓', true)}`,
  rate: () => `<h1>Wie war’s?</h1><p class="m">Wie entspannt hat sich das Sprechen heute angefühlt? Es gibt kein richtig oder falsch.</p>
    <div class="rate">${['😬', '😕', '😐', '🙂', '😎'].map((e, k) => `<button onclick="rate(${k + 1},this)">${e}</button>`).join('')}</div>
    <button class="btn" id="nx" disabled onclick="next()">Fertig</button>`
};

// ---- Aufgaben-Logik
function qpick(i) {
  const s = run.steps[run.i], c = run.cur; if (c.done) return;
  const el = $('#o' + i); c.tries++;
  if (i === 0) { el.classList.add('ok'); if (c.tries === 1) scoreQ(true); fb('good', c.tries === 1 ? '<b>Richtig!</b> ' + rich(s.why) : 'Jetzt stimmt es. ' + rich(s.why)); qDone(); return }
  el.classList.add('bad'); el.disabled = true;
  if (c.tries === 1) scoreQ(false);
  const left = c.order.filter(k => !$('#o' + k).disabled).length;
  if (c.tries >= 2 || left <= 1) { $('#o0').classList.add('ok'); document.querySelectorAll('.opt').forEach(x => x.disabled = true); fb('bad', '<b>Die richtige Antwort ist grün.</b> ' + rich(s.why)); qDone() }
  else fb('bad', nope() + 'Versuche es noch einmal.' + ($('#hb') ? ' Brauchst du Hilfe? Dann tippe auf 💡.' : ''));
}
// Richtung und Komma-Fehler erkennen
function dirHint(v, a) {
  if (!isFinite(v)) return 'Bitte nur eine Zahl eingeben. ';
  if (a && v && [10, 100, 1000, .1, .01, .001].some(f => Math.abs(v / a - f) < 1e-9)) return 'Die Ziffern stimmen, aber das Komma oder die Einheit nicht. ';
  return v > a ? 'Dein Ergebnis ist <b>zu groß</b>. ' : 'Dein Ergebnis ist <b>zu klein</b>. ';
}
// Rechenweg mit Lücke: die Lösung im Erklärtext durch ❓ ersetzen
function gapWhy(s) {
  const str = de(s.a, 3), [ip, fp] = str.split(','), digs = ip.replace('-', '').split('').join('[\\s.\\u00a0\\u202f]?');
  const re = new RegExp('(^|[^\\d,/])(-?' + digs + (fp ? ',' + fp + '0*' : '(?:,0+)?') + ')(?![\\d/]|,\\d)', 'g');
  const out = String(s.why).replace(re, '$1❓');
  return out !== s.why ? out : '';
}
function ncheck() {
  const s = run.steps[run.i], c = run.cur, inp = $('#in'); if (c.done || !inp.value.trim()) return;
  const v = parseNum(inp.value), ok = isFinite(v) && Math.abs(v - s.a) <= (s.tol || 0) + 1e-9; c.tries++;
  if (c.tries === 1) scoreQ(ok);
  const gw = gapWhy(s);
  if (ok) { inp.disabled = true; fb('good', (c.tries === 1 ? '<b>Richtig!</b> ' : '<b>Jetzt stimmt’s!</b> ') + rich(s.why)); qDone() }
  else if (c.tries >= 3 || (c.tries === 2 && !gw)) { inp.disabled = true; fb('bad', '<b>Die Lösung ist ' + de(s.a, 3) + (s.unit ? ' ' + esc(s.unit) : '') + '.</b> ' + rich(s.why)); qDone() }
  else if (c.tries === 2) { fb('bad', dirHint(v, s.a) + 'Letzter Versuch. Hier ist der Rechenweg mit Lücke:<div class="gw">' + rich(gw) + '</div>'); hintOff(); inp.select() }
  else { fb('bad', nope() + dirHint(v, s.a) + esc(s.hint || 'Rechne noch einmal in Ruhe.') + ($('#hb') ? ' Mit 💡 bekommst du Hilfe.' : '')); inp.select() }
}
const lev = (a, b) => { const d = [...Array(b.length + 1).keys()]; for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t } } return d[b.length] };
// Buchstaben-Muster als Hilfe: B _ _ _ _
const letters = (w, lvl) => [...w].map((ch, k) => /[\s\-'’]/.test(ch) ? (ch === ' ' ? ' ' : ch) : (k === 0 || (lvl > 1 && k % 2 === 0)) ? ch : '_').join(' ');
function tcheck() {
  const s = run.steps[run.i], c = run.cur, inp = $('#in'); if (c.done || !inp.value.trim()) return;
  const ok = s.a.some(a => norm(a, s.cs) === norm(inp.value, s.cs)); c.tries++;
  if (c.tries === 1) scoreQ(ok);
  const near = s.a.some(a => lev(norm(a, true).toLowerCase(), norm(inp.value, true).toLowerCase()) === 1), caseOnly = s.cs && s.a.some(a => norm(a) === norm(inp.value));
  const tip = caseOnly ? 'Fast! Achte auf <b>Groß- und Kleinschreibung</b>. ' : near ? 'Ganz knapp! Nur <b>ein Buchstabe</b> stimmt nicht. ' : '';
  if (ok) { inp.disabled = true; fb('good', (c.tries === 1 ? '<b>Richtig!</b> ' : '<b>Jetzt stimmt’s!</b> ') + rich(s.why)); qDone() }
  else if (c.tries >= 3) { inp.disabled = true; fb('bad', '<b>Richtig wäre: ' + esc(s.a[0]) + '.</b> ' + rich(s.why)); qDone() }
  else if (c.tries === 2) { fb('bad', tip + 'Letzter Versuch, hier ein paar Buchstaben:<div class="gw lt">' + esc(letters(s.a[0], 2)) + '</div>'); hintOff(); inp.select() }
  else { fb('bad', (tip || nope()) + esc(s.hint || 'Schau noch einmal genau hin.') + ($('#hb') ? ' Mit 💡 bekommst du Hilfe.' : '')); inp.select() }
}

// ---- Hilfe-Knopf (💡). Mit Tipp gelöste Aufgaben zählen, kommen aber zur Festigung in den Boxenstopp.
const hbtn = (l = '💡 Tipp') => `<button class="hintb" id="hb" onclick="hint()">${l}</button><div id="hn"></div>`;
const hintOff = () => { const b = $('#hb'); if (b) b.remove() };
const hintBox = html => { const e = $('#hn'); if (e) e.innerHTML = `<div class="fb hint">💡 ${html}</div>` };
const flash = (...els) => els.forEach(e => { if (!e) return; e.classList.remove('hl'); void e.offsetWidth; e.classList.add('hl'); setTimeout(() => e.classList.remove('hl'), 1800) });
function hint() {
  const s = run.steps[run.i], c = run.cur; if (c.done || !HINT[s.type]) return;
  c.hl++; c.help = true; tone(990, .09, 0, 'sine', .06); HINT[s.type](s, c);
}
const HINT = {
  quiz(s, c) { const wrong = c.order.filter(k => k !== 0 && !$('#o' + k).disabled);
    if (wrong.length > 1) { shuffle(wrong).slice(0, wrong.length - 1).forEach(k => { const b = $('#o' + k); b.disabled = true; b.classList.add('gone') }); hintBox('Zwei falsche Antworten sind weg. Jetzt hast du die Wahl zwischen zwei.' + (s.hint ? ' ' + esc(s.hint) : '')) }
    else hintBox(s.hint ? esc(s.hint) : 'Lies die Frage noch einmal Wort für Wort. Welche Antwort passt wirklich genau dazu?');
    hintOff() },
  num(s, c) { const gw = gapWhy(s);
    if (c.hl === 1 && s.hint) { hintBox(esc(s.hint) + (gw ? '<br><span class="m">Noch mehr Hilfe? Tippe nochmal.</span>' : '')); if (!gw) hintOff(); $('#hb') && ($('#hb').textContent = '💡 Rechenweg zeigen'); return }
    hintBox(gw ? 'So geht der Rechenweg, die Lösung fehlt noch:<div class="gw">' + rich(gw) + '</div>' : 'Schreib auf: Was ist gegeben? Was ist gesucht? Dann rechne Schritt für Schritt und mach einen Überschlag: Ist das Ergebnis ungefähr sinnvoll?'); hintOff() },
  text(s, c) { const w = s.a[0];
    if (c.hl === 1) { hintBox((s.hint ? esc(s.hint) + '<br>' : '') + 'So sieht das Wort aus (' + [...w].filter(x => /\S/.test(x)).length + ' Zeichen):<div class="gw lt">' + esc(letters(w, 1)) + '</div>'); $('#hb').textContent = '💡 Mehr Buchstaben'; return }
    hintBox('Noch mehr Buchstaben:<div class="gw lt">' + esc(letters(w, 2)) + '</div>'); hintOff() },
  match(s, c) { const i = s.pairs.findIndex((_, k) => !$('#ml' + k).classList.contains('ok')); if (i < 0) return; flash($('#ml' + i), $('#mr' + i)); hintBox('Die zwei blinkenden Kärtchen gehören zusammen. Tippe sie an.') },
  order(s, c) { const want = s.items[c.got.length]; const i = s.items.findIndex((w, k) => w === want && !$('#oi' + k).disabled); flash($('#oi' + i)); hintBox('Das blinkende Kärtchen kommt als Nächstes.') },
  parts(s, c) { flash($('#hs' + c.todo[c.n])); hintBox('Schau, was da blinkt!') },
  sort(s, c) { const i = s.items.findIndex((_, k) => $('#si' + k)); if (i < 0) return; flash($('#si' + i), $('#sb' + s.items[i][1])); hintBox(`<b>${esc(s.items[i][0])}</b> gehört in das blinkende Fach.`) },
  gap(s, c) { const a = c.ans[c.k]; const b = [...document.querySelectorAll('.pool .kt')].find(x => !x.disabled && a.includes(x.dataset.w)); flash(b); hintBox('Das blinkende Wort passt in die blaue Lücke.') },
  line(s, c) { const w = (s.max - s.min) / 5, lo = Math.max(s.min, s.a - w * (c.hl === 1 ? 1 : .5)), hi = Math.min(s.max, s.a + w * (c.hl === 1 ? 1 : .5)), f = s.fmt || (v => de(v, 3) + (s.unit || ''));
    const r = $('#nlr'); r.style.left = nlp((lo - s.min) / (s.max - s.min)); r.style.width = `calc((100% - 26px) * ${(hi - lo) / (s.max - s.min)})`; r.style.display = 'block';
    hintBox(`Die Lösung liegt im grünen Bereich, zwischen <b>${f(lo)}</b> und <b>${f(hi)}</b>.` + (s.hint ? ' ' + esc(s.hint) : '')); if (c.hl > 1) hintOff(); else $('#hb').textContent = '💡 Bereich enger machen' }
};

// ---- Sortieren
function spick(i) { const c = run.cur; if (c.done) return; document.querySelectorAll('.kt.sel').forEach(x => x.classList.remove('sel')); c.sel = i; $('#si' + i).classList.add('sel') }
function sbin(j) {
  const s = run.steps[run.i], c = run.cur; if (c.done) return;
  if (c.sel === null) { flash(...document.querySelectorAll('.pool .kt')); return }
  const i = c.sel, it = s.items[i], b = $('#si' + i), bin = $('#sb' + j);
  if (it[1] === j) { b.remove(); $('#bc' + j).insertAdjacentHTML('beforeend', `<span class="kok">${esc(it[0])}</span>`); c.sel = null; c.left--; tone(720, .08, 0, 'sine', .07); fb('', '');
    if (!c.left) { scoreQ(c.mist <= 1); fb('good', c.mist === 0 ? '<b>Alles richtig einsortiert!</b>' : 'Geschafft. Fehlversuche: ' + c.mist); qDone() } }
  else { c.mist++; b.classList.add('no'); bin.classList.add('no'); later(() => { b.classList.remove('no'); bin.classList.remove('no') }, 450); fb('bad', 'Passt nicht in dieses Fach. ' + (it[2] ? rich(it[2]) : 'Überleg noch einmal.')) }
}
// ---- Lückentext
function gpick(k) {
  const s = run.steps[run.i], c = run.cur, b = $('#gc' + k); if (c.done || b.disabled) return;
  if (c.ans[c.k].includes(b.dataset.w)) { const g = $('#gp' + c.k); g.textContent = b.dataset.w; g.className = 'gp ok'; b.disabled = true; b.classList.add('ok'); c.k++; tone(720, .08, 0, 'sine', .07);
    if (c.k >= c.ans.length) { scoreQ(c.mist <= 1); fb('good', c.mist === 0 ? '<b>Alle Lücken richtig!</b>' : 'Geschafft. Fehlversuche: ' + c.mist); qDone() } else $('#gp' + c.k).classList.add('cur') }
  else { c.mist++; b.classList.add('no'); later(() => b.classList.remove('no'), 450) }
}
// ---- Blitzrunde richtig/falsch
function tfShow() { const s = run.steps[run.i], c = run.cur, it = s.items[c.k];
  $('#tfc').innerHTML = `<div class="row sp m"><span>${c.k + 1} von ${s.items.length}</span><span>${c.row > 1 ? '🔥 ' + c.row + ' in Folge' : ''}</span></div><div class="tfs">${rich(it[0])}</div>` }
function tfa(v) {
  const s = run.steps[run.i], c = run.cur; if (c.done || c.lock) return;
  const it = s.items[c.k], ok = v === it[1]; c.lock = true; if (!ok) { c.mist++; c.row = 0 } else c.row++;
  snd(ok ? 'ok' : 'bad'); $('#tfc').classList.add(ok ? 'good' : 'bad');
  const go = () => { c.lock = false; $('#tfc').classList.remove('good', 'bad'); c.k++; fb('', '');
    if (c.k >= s.items.length) { $('#tfb').remove(); scoreQ(c.mist <= 1); $('#tfc').innerHTML = `<div class="center"><div class="big">${c.mist === 0 ? '🏆' : '👍'}</div><b>${s.items.length - c.mist} von ${s.items.length} richtig</b></div>`; fb(c.mist <= 1 ? 'good' : 'bad', c.mist === 0 ? '<b>Fehlerfrei!</b>' : 'Die Erklärungen helfen beim nächsten Mal.'); qDone() } else tfShow() };
  if (ok) { fb('good', '<b>Richtig!</b> ' + (it[2] ? rich(it[2]) : '')); later(go, it[2] ? 1700 : 800) }
  else { fb('bad', `<b>Das ist ${it[1] ? 'richtig' : 'falsch'}.</b> ${it[2] ? rich(it[2]) : ''}<button class="btn alt" style="margin:10px 0 0;padding:10px" id="tfn">Weiter ›</button>`); $('#tfn').onclick = go }
}
// ---- Zahlenstrahl (13 px Rand für den Regler-Knopf)
const nlp = p => `calc(13px + (100% - 26px) * ${p})`;
function lshow() { const s = run.steps[run.i], v = +$('#lr').value, f = s.fmt || (x => de(x, 3) + (s.unit || '')); $('#lv').textContent = s.hide ? '📍' : f(v); run.cur.moved = true }
function lcheck() {
  const s = run.steps[run.i], c = run.cur, r = $('#lr'); if (c.done) return;
  if (!c.moved) { fb('bad', 'Schiebe zuerst den Regler an die richtige Stelle.'); return }
  const v = +r.value, ok = Math.abs(v - s.a) <= (s.tol ?? s.step / 2) + 1e-9, f = s.fmt || (x => de(x, 3) + (s.unit || '')); c.tries++;
  if (c.tries === 1) scoreQ(ok);
  const showA = () => { r.disabled = true; $('.nl').insertAdjacentHTML('beforeend', `<i class="nlm" style="left:${nlp((s.a - s.min) / (s.max - s.min))}"></i>`); $('#lv').textContent = f(v) };
  if (ok) { showA(); fb('good', (c.tries === 1 ? '<b>Treffer!</b> ' : '<b>Jetzt stimmt’s!</b> ') + rich(s.why || '')); qDone() }
  else if (c.tries >= 2) { showA(); fb('bad', `<b>Richtig ist ${f(s.a)}</b> (grüne Markierung). ` + rich(s.why || '')); qDone() }
  else fb('bad', nope() + 'Du bist ' + (v > s.a ? '<b>zu weit rechts</b>.' : '<b>zu weit links</b>.') + (s.hint ? ' ' + esc(s.hint) : ''));
}
function mpick(side, i) {
  const s = run.steps[run.i], c = run.cur, b = $('#m' + side + i); if (c.done || b.classList.contains('ok')) return;
  if (!c.sel || c.sel.side === side) { if (c.sel) $('#m' + c.sel.side + c.sel.i).classList.remove('sel'); c.sel = {side, i}; b.classList.add('sel'); return }
  const o = c.sel, ob = $('#m' + o.side + o.i); c.sel = null; ob.classList.remove('sel');
  if (o.i === i) { b.classList.add('ok'); ob.classList.add('ok'); c.found++;
    if (c.found === s.pairs.length) { scoreQ(c.mist <= 1); fb('good', c.mist === 0 ? '<b>Alles richtig!</b>' : 'Geschafft. Fehlversuche: ' + c.mist); qDone() } }
  else { c.mist++; b.classList.add('no'); ob.classList.add('no'); later(() => { b.classList.remove('no'); ob.classList.remove('no') }, 450) }
}
function opick(i) {
  const s = run.steps[run.i], c = run.cur, b = $('#oi' + i); if (c.done || b.disabled) return;
  const cand = c.got.concat(s.items[i]), seqs = [s.items, ...(s.alts || [])];
  if (seqs.some(q => cand.every((w, k) => q[k] === w))) { c.got = cand; b.disabled = true; b.classList.add('ok');
    $('#oo').innerHTML = cand.map((w, k) => `<div class="ordl"><b>${k + 1}</b> ${esc(w)}</div>`).join('');
    if (cand.length === s.items.length) { scoreQ(c.mist <= 1); fb('good', c.mist === 0 ? '<b>Alles richtig!</b>' : 'Geschafft. Fehlversuche: ' + c.mist); qDone() } }
  else { c.mist++; b.classList.add('no'); later(() => b.classList.remove('no'), 450) }
}
function hpick(i) {
  const s = run.steps[run.i], c = run.cur, sp = SPOTS[s.svg], b = i >= 0 ? $('#hs' + i) : null; if (c.done) return;
  if (i < 0) { askShow(); return }
  if (!s.ask) { document.querySelectorAll('.hs').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); $('#hi').innerHTML = `<b>${i + 1}. ${esc(sp[i].name)}${s.en && sp[i].en ? ' = ' + esc(sp[i].en) : ''}</b><p class="m" style="color:var(--t)">${esc(sp[i].info)}</p>`; return }
  if (c.hit.includes(i)) return;
  const want = c.todo[c.n];
  if (i === want) { c.hit.push(i); b.classList.add('ok'); b.textContent = '✓'; c.n++; if (c.n === sp.length) { scoreQ(c.mist <= 1); fb('good', c.mist === 0 ? '<b>Alles gefunden!</b>' : 'Geschafft. Fehlversuche: ' + c.mist); $('#hi').innerHTML = '<p class="m">Alle Teile gefunden.</p>'; qDone(); return } }
  else { c.mist++; b.classList.add('no'); later(() => b.classList.remove('no'), 450) }
  askShow();
}
function askShow() {
  const s = run.steps[run.i], c = run.cur, sp = SPOTS[s.svg];
  $('#hi').innerHTML = `<p class="q" style="margin:0">Tippe auf: <b>${esc(s.en && sp[c.todo[c.n]].en ? sp[c.todo[c.n]].en : sp[c.todo[c.n]].name)}</b></p><p class="m">${c.n} von ${sp.length} gefunden</p>`;
}
function slid() {
  const s = run.steps[run.i], v = {};
  s.sliders.forEach(x => { v[x.id] = +$('#sr_' + x.id).value; $('#sv_' + x.id).textContent = de(v[x.id], x.step < 1 ? 1 : 0) + x.unit });
  $('#lab').innerHTML = s.out(v);
}
const CMAT = [['Kupferdraht', true], ['Eisennagel', true], ['Alufolie', true], ['Gummiband', false], ['Holzstab', false], ['Glasstab', false], ['Plastiklineal', false]];
function circ() {
  const c = run.cur, lit = c.on && CMAT[c.m][1];
  $('#cv').innerHTML = `<svg viewBox="0 0 300 180" width="100%"><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
    <path d="M40 90 V40 H100"/><path d="M160 40 H260 V70"/><path d="M260 110 V140 H180"/><path d="M120 140 H40 V110"/>
    <line x1="100" y1="40" x2="${c.on ? 160 : 150}" y2="${c.on ? 40 : 14}"/></g>
    <line x1="22" y1="90" x2="58" y2="90" stroke="#fff" stroke-width="6"/><line x1="30" y1="104" x2="50" y2="104" stroke="#fff" stroke-width="3"/><text x="66" y="98" fill="#98989f" font-size="11">Batterie</text>
    <circle cx="260" cy="90" r="22" fill="${lit ? '#ffd60a' : '#2c2c2e'}" stroke="#fff" stroke-width="3"/>${lit ? '<circle cx="260" cy="90" r="34" fill="#ffd60a" opacity=".25"/>' : ''}
    <text x="214" y="132" fill="#98989f" font-size="11">Lampe</text>
    <rect x="120" y="133" width="60" height="14" rx="4" fill="${CMAT[c.m][1] ? '#c98a4b' : '#8e8e93'}"/><text x="150" y="170" text-anchor="middle" fill="#98989f" font-size="11">${CMAT[c.m][0]}</text></svg>`;
  $('#cs').innerHTML = lit ? '💡 Die Lampe leuchtet! Der Stromkreis ist geschlossen.' : !c.on ? 'Dunkel: Der Schalter ist offen.' : 'Dunkel: ' + CMAT[c.m][0] + ' leitet keinen Strom. Der Kreis ist unterbrochen.';
  $('#csw').textContent = c.on ? 'Schalter ausschalten' : 'Schalter einschalten';
  document.querySelectorAll('#cmat button').forEach((b, k) => b.classList.toggle('on', k === c.m));
}
function cswitch() { run.cur.on = !run.cur.on; circ() }
function cmat(k) { run.cur.m = k; circ() }
function rxTap() {
  const c = run.cur, b = $('#rx'), r = $('#rr'); c.best = c.best || 9999;
  if (c.st === 'wait') { clearTimers(); c.st = 'idle'; b.className = 'react'; b.textContent = 'Zu früh! Tippe zum Neustart'; return }
  if (c.st === 'go') { const ms = Math.round(performance.now() - c.t0); c.best = Math.min(c.best, ms); c.st = 'idle'; b.className = 'react'; b.textContent = ms + ' ms';
    r.innerHTML = `Beste Zeit: <b style="color:var(--t)">${c.best} ms</b> · Menschen reagieren meist in 200 bis 300 ms. Tippe für einen neuen Versuch.`; return }
  c.st = 'wait'; b.className = 'react wait'; b.textContent = 'Warte …';
  later(() => { c.st = 'go'; c.t0 = performance.now(); b.className = 'react go'; b.textContent = 'JETZT!' }, 1500 + Math.random() * 2500);
}

const INIT = {
  slider() { slid() },
  tf() { tfShow() },
  line(s) { if (s.hide) $('#lv').textContent = '📍' },
  parts(s) { if (s.ask) hpick(-1) },
  circuit() { run.cur.on = false; run.cur.m = 3; circ() },
  reaction() { run.cur.st = 'idle' },
  breath(s) {
    const ring = $('#ring'), bc = $('#bc'); let r = 0;
    ring.style.transitionDuration = s.inSec + 's';
    const cycle = () => {
      if (r >= s.rounds) { ring.textContent = 'Geschafft'; ring.className = 'ring'; bc.textContent = ''; $('#nx').textContent = 'Weiter'; return }
      r++; bc.textContent = `Runde ${r} von ${s.rounds}`;
      ring.textContent = 'Einatmen'; ring.style.transitionDuration = s.inSec + 's'; ring.className = 'ring big';
      later(() => { ring.textContent = 'Ausatmen'; ring.style.transitionDuration = s.outSec + 's'; ring.className = 'ring small';
        later(cycle, s.outSec * 1000) }, s.inSec * 1000);
    };
    later(cycle, 600);
  },
  rhythm(s) {
    $('#gears').onclick = e => { const b = e.target.closest('button'); if (!b) return;
      document.querySelectorAll('#gears button').forEach(x => x.classList.remove('on')); b.classList.add('on'); if (R.on) { rhythmToggle(); rhythmToggle() } };
    R = {on: false, s};
  },
  phrase(s) { run.p = {a: 0, b: 0}; phraseShow(s) }
};
let R = {};
function click(accent) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = accent ? 880 : 640; g.gain.setValueAtTime(.25, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .08);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + .09);
  } catch (e) {}
}
function rhythmToggle() {
  const btn = $('#rs'); if (R.on) { clearTimers(); R.on = false; btn.textContent = '▶ Takt starten'; document.querySelectorAll('.syl').forEach(x => x.classList.remove('hot')); return }
  const bpm = +document.querySelector('#gears .on').dataset.b, seq = [];
  R.s.lines.forEach((l, a) => { l.forEach((_, b) => seq.push([a, b])); seq.push(null) });
  let k = 0; R.on = true; btn.textContent = '⏹ Stopp';
  const tick = () => {
    document.querySelectorAll('.syl').forEach(x => x.classList.remove('hot'));
    const q = seq[k % seq.length]; if (q) { $(`#s${q[0]}_${q[1]}`).classList.add('hot'); click(q[1] === 0) }
    k++; if (k > seq.length * 2) rhythmToggle();
  };
  tick(); timers.push(setInterval(tick, 60000 / bpm));
}
function softGo(k) {
  const el = $('#rv' + k); el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
}
function phraseShow(s) {
  const p = run.p, sent = s.sentences[p.a]; if (!sent) { $('#ph').innerHTML = `<div class="card center"><div class="big">👏</div><p>Alle Abschnitte geschafft!</p></div>${nextBtn()}`; return }
  $('#ph').innerHTML = `<div class="card"><div class="sl">${sent.map((c, k) => `<span class="${k === p.b ? 'c' : 'a'}">${esc(c)} </span>`).join('')}</div></div>
    <div class="ring" id="pr" style="width:110px;height:110px;font-size:16px;transition:none">${p.b + 1} / ${sent.length}</div>
    <button class="btn" id="pb" onclick="phraseNext()">Gesprochen · Pause</button>`;
  $('#ph .sl').classList.add('cur');
}
function phraseNext() {
  const p = run.p, s = run.steps[run.i], sent = s.sentences[p.a], pr = $('#pr'), pb = $('#pb');
  pb.disabled = true; pb.textContent = 'Schaltpause …'; pr.textContent = 'Atmen'; pr.style.transition = 'transform 1.4s'; pr.className = 'ring big'; pr.style.width = '110px'; pr.style.height = '110px';
  later(() => { p.b++; if (p.b >= sent.length) { p.b = 0; p.a++ } phraseShow(s) }, 1500);
}
let rec = null, chunks = [];
async function recToggle() {
  const b = $('#rb'), t = $('#rt');
  if (rec && rec.state === 'recording') { rec.stop(); return }
  try {
    const st = await navigator.mediaDevices.getUserMedia({audio: true});
    rec = new MediaRecorder(st); chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => { st.getTracks().forEach(x => x.stop()); if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      mediaUrl = URL.createObjectURL(new Blob(chunks, {type: rec.mimeType}));
      $('#pl').innerHTML = `<audio controls src="${mediaUrl}"></audio>`; b.textContent = 'Nochmal aufnehmen'; t.textContent = 'Hör dir an, was dir gefällt. Das bleibt nur auf dem Gerät.'; $('#rc').textContent = '🎧' };
    rec.start(); b.textContent = '⏹ Stopp'; t.textContent = 'Läuft … sprich in deinem Tempo.'; $('#rc').textContent = '🔴';
  } catch (e) { t.textContent = 'Mikrofon nicht freigegeben. Kein Problem: Sprich einfach laut, dann geht’s weiter.' }
}
function pick(el) { document.querySelectorAll('.opt').forEach(x => x.classList.remove('on')); el.classList.add('on'); $('#nx').disabled = false; run.ch = el.textContent }
function rate(n, el) { document.querySelectorAll('.rate button').forEach(x => x.classList.remove('on')); el.classList.add('on'); run.score = n; $('#nx').disabled = false }

function finish() {
  const m = run.m, box = m.id === 'box', talk = m.steps.some(s => s.type === 'talk');
  let pts = (box ? 6 : 10) + 2 * run.ok - run.help;
  const perfect = run.tot > 0 && run.ok === run.tot && !run.help; if (perfect && !box) pts += 5;
  if (m.speech) { if (m.skill === 'mut') pts += 5; if (talk) pts += 5 } else if (talk) pts += 3;
  const quote = run.tot ? (run.ok - run.help / 2) / run.tot : 1;
  const stars = m.speech || !run.tot ? 3 : quote >= .85 ? 3 : quote >= .6 ? 2 : 1;
  const before = S.points, rankBefore = rankOf(S.points).i; S.points += pts; S.coins = (S.coins || 0) + pts; const rankUp = rankOf(S.points).i > rankBefore ? rankOf(S.points).cur : null;
  if (!box) { S.done[m.id] = (S.done[m.id] || 0) + 1; S.stars[m.id] = Math.max(S.stars[m.id] || 0, stars) }
  if (!box && !m.speech) { const r = S.rev[m.id]; S.rev[m.id] = stars >= 2 ? (() => { const k = r ? Math.min(r.step + 1, 3) : 0; return {step: k, due: addDays(REV_INT[k])} })() : {step: 0, due: addDays(1)} }
  if (box && run.dueIds) run.dueIds.forEach(id => { const r = S.rev[id]; if (r) { const k = Math.min(r.step + 1, 3); S.rev[id] = {step: k, due: addDays(REV_INT[k])} } });
  S.log.push({d: today(), id: m.id, s: stars}); S.log = S.log.slice(-500);
  if (!S.days.includes(today())) S.days.push(today());
  if (run.score) S.ratings.push({date: today(), id: m.id, score: run.score});
  const wasDone = !!S.goalDate; if (!wasDone && projectDone()) S.goalDate = new Date().toLocaleDateString('de-DE');
  save(); const st = streak(); const goalNow = !wasDone && !!S.goalDate;
  const unlocked = GARAGE.find(g => before < g.need && S.points >= g.need), mc = missCount();
  const praise = !run.tot ? 'Gut gemacht. Dranbleiben zählt.' : stars === 3 ? ['Stark! Das saß.', 'Sauber gearbeitet, das war fast fehlerfrei.', 'Das war Meisterarbeit.'][Math.floor(Math.random() * 3)] : stars === 2 ? 'Gut gemacht. Mit Übung wird es noch sicherer.' : 'Aus Fehlern lernt man: Die kniffligen Aufgaben üben wir im Boxenstopp.';
  if (stars >= 2 || rankUp || goalNow) { snd('win'); confetti() }
  $('#app').innerHTML = `${cover(coverSrc(m), {cls: 'tall'})}<div class="center" style="margin-top:14px"><div class="big" onclick="egg('flag',3,()=>{confetti();ride('🏎️💨','Zielflagge! Brumm brumm!')})">🏁</div><h1>${box ? 'Boxenstopp erledigt!' : 'Mission geschafft!'}</h1>
    ${run.tot ? `<div class="stars big2">${starStr(stars)}</div><p class="m">${run.ok} von ${run.tot} Aufgaben gleich beim ersten Versuch richtig${run.help ? ', davon ' + run.help + ' mit Tipp' : ''}.</p>` : ''}
    <p class="m">Du hast ${pts} Punkte geholt${st > 1 ? ' und ' + st + ' Tage in Folge gelernt' : ''}.</p>
    <p style="font-weight:600">${praise}</p></div>
    ${rankUp ? `<div class="card center" style="background:#ffd60a22"><div class="big">${rankUp.e}</div><b style="font-size:20px">Neuer Rang: ${rankUp.n}</b></div>` : ''}
    ${goalNow ? `<div class="card center" style="background:#ff453a22"><div class="big">🏆</div><b style="font-size:20px">Großes Ziel geschafft!</b><p class="m">Alle Etappen zum MTX-Zylinder sind erledigt. Deine Urkunde liegt in der Garage.</p></div>` : ''}
    ${unlocked ? `<div class="card gcard" style="cursor:pointer" onclick="openVeh('${unlocked.id}')"><div class="gimg">${gimg(unlocked)}</div><div style="flex:1"><b>Neu in der Garage:</b><br>${esc(unlocked.name)}<div class="m">Antippen: starten, Gas geben, tanken …</div></div><span class="chev">›</span></div>` : ''}
    ${mc ? `<button class="btn alt" onclick="startBox()">Boxenstopp: ${mc} Aufgaben wiederholen</button>` : ''}
    <button class="btn" onclick="go('home')">Zurück</button>`;
  run = null; view = 'home'; $('#tab').style.display = 'flex';
}

// ---- Taschenrechner (für Profi-Aufgaben)
let CE = '';
function calcFmt(v) { return isFinite(v) ? String(+v.toPrecision(10)).replace('.', ',') : 'Fehler' }
function calcEval(e) { try { let x = e.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-').replace(/,/g, '.').replace(/π/g, '(Math.PI)').replace(/√/g, 'Math.sqrt'); x = x.replace(/(\d|\))(?=\(|Math)/g, '$1*');
  if (!/^[0-9+\-*/().\sMathPIsqrt]*$/.test(x) || !x.trim()) return NaN; return Function('"use strict";return (' + x + ')')() } catch (er) { return NaN } }
function calcOpen() {
  if ($('#calc')) return; CE = '';
  const keys = ['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', ',', 'π', '√'];
  const o = document.createElement('div'); o.id = 'calc'; o.innerHTML = `<div class="cb"><div class="cd" id="cd">0</div><div class="ck">${keys.map(k => `<button class="${'÷×−+'.includes(k) ? 'op' : k === 'C' ? 'cl' : ''}" onclick="calcKey('${k}')">${k}</button>`).join('')}<button class="op eq" onclick="calcKey('=')">=</button></div>
  <div class="row" style="gap:10px"><button class="btn alt" style="margin:8px 0" onclick="calcClose()">Schließen</button><button class="btn" style="margin:8px 0" onclick="calcUse()">Übernehmen</button></div></div>`;
  document.body.appendChild(o);
}
function calcKey(k) { const d = $('#cd'); if (k === 'C') CE = ''; else if (k === '=') { const v = calcEval(CE); CE = isFinite(v) ? calcFmt(v) : ''; if (v === 125) toast('125: Das ist das große Ziel, der MTX-Zylinder 🏆'); else if (v === 50) toast('50 ccm: Mokick-Klasse 🛵'); else if (v === 70) toast('70 ccm: der Klassiker unter den Tuning-Sätzen 🔧'); d.textContent = isFinite(v) ? CE : 'Fehler'; return } else CE += (k === '√' ? '√(' : k); d.textContent = CE || '0' }
function calcClose() { const c = $('#calc'); if (c) c.remove() }
function calcUse() { const v = calcEval(CE), inp = $('#in'); if (isFinite(v) && inp && !inp.disabled) inp.value = calcFmt(v).replace(/\.\d*$/, m => m); calcClose(); if (inp) inp.focus() }

// ---- Easter Eggs und kleine Überraschungen
const eggN = {};
const egg = (k, n, fn) => { eggN[k] = (eggN[k] || 0) + 1; clearTimeout(eggN[k + 't']); eggN[k + 't'] = setTimeout(() => eggN[k] = 0, 1800); if (eggN[k] >= n) { eggN[k] = 0; fn() } };
function toast(t) { const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 3200) }
const brumm = () => [90, 110, 95, 130, 105, 150, 120].forEach((f, i) => tone(f, .12, i * .08, 'sawtooth', .07));
function ride(em, t) { const r = document.createElement('div'); r.className = 'ride'; r.textContent = em; document.body.appendChild(r); setTimeout(() => r.remove(), 3600); brumm(); if (t) toast(t) }
const OOPS = ['Auch die Simson springt nicht immer beim ersten Kick an.', 'Kolben klemmt kurz. Kein Problem, ölen und weiter.', 'Fast! Zündkerze kurz abwischen und neu denken.', 'Schrauber-Weisheit: Nach fest kommt ab. Also ruhig bleiben.', 'Auch der ZT 300 braucht manchmal zwei Anläufe.', 'Fehlzündung! Passiert den Besten.'];
const nope = () => Math.random() < .35 ? OOPS[Math.floor(Math.random() * OOPS.length)] + ' ' : 'Nicht ganz. ';

if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.__SW_OFF) { const had = !!navigator.serviceWorker.controller; navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !run) location.reload() }); navigator.serviceWorker.register('sw.js').catch(() => {}) }
render();
