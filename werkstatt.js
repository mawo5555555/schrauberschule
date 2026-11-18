// Werkstatt-Ansicht: Das Fahrzeug steht auf dem Montageständer. Teil antippen → Ansicht zoomt hin → dort schrauben.
// Punkte (x/y in % der Zeichnung) und was man dort machen kann: jobs = Wartung (JOBS), parts = Tuning-Teile (PARTS), duese = Vergaser abstimmen, act = Sprung zu Tanken
const WS = {
  g1: {svg: 'simson', spots: [
    {x: 57.9, y: 43.7, id: 'kerze', n: 'Zündkerze', ic: '🔌', jobs: ['kerze']},
    {x: 52.1, y: 55.6, id: 'zyl', n: 'Zylinder', ic: '🔩', parts: ['zyl60', 'zyl70'], info: 'Im Zylinder läuft der Kolben auf und ab. Mit einer größeren Bohrung wird der Hubraum größer.'},
    {x: 44.6, y: 56.3, id: 'verg', n: 'Vergaser', ic: '🌀', parts: ['verg19'], duese: true},
    {x: 33.3, y: 49.6, id: 'luft', n: 'Luftfilter', ic: '🌬️', jobs: ['luft'], parts: ['luft']},
    {x: 28.1, y: 62.2, id: 'kette', n: 'Kette und Ritzel', ic: '⛓️', jobs: ['kette'], parts: ['ritp', 'ritm'], info: 'Die Kette überträgt die Kraft vom Ritzel am Motor aufs Kettenrad am Hinterrad.'},
    {x: 21.0, y: 76.7, id: 'aus', n: 'Auspuff', ic: '💨', parts: ['aus'], info: 'Der Auspuff leitet die Abgase ab. Ein Resonanzauspuff nutzt Druckwellen für mehr Leistung.'},
    {x: 46.5, y: 67.5, id: 'zuend', n: 'Zündung (Polrad)', ic: '⚡', parts: ['zuend'], info: 'Unter dem linken Motordeckel sitzt das Polrad mit Magneten. Es erzeugt Strom für Zündfunken und Licht.'},
    {x: 7.9, y: 72.9, id: 'rad', n: 'Hinterrad', ic: '🛞', jobs: ['reifen']},
    {x: 54.6, y: 28.1, id: 'tank', n: 'Tank', ic: '⛽', act: 'fuel'}
  ]}
};
const spotInfo = p => p.info || ((SIMSON_SPOTS.find(x => x.name.startsWith(p.n.split(' ')[0])) || {}).info) || '';
const spotDue = (p, st) => (p.jobs || []).some(k => jobDue(st, k));

function openWs() { clearTimers(); if (G.on) { engStop(); toast('Motor aus. An einem laufenden Motor wird nicht geschraubt.') } G.job = null; G.wsi = null; view = 'ws'; render() }
function wsBack() { G.job = null; view = 'veh'; G.panel = null; render() }
function wsView() {
  const g = GARAGE.find(x => x.id === G.id), st = gst(g.id), W = WS[g.id], due = W.spots.some(p => spotDue(p, st)), t = tuneOf(st);
  return `<div class="nav"><button class="back" onclick="wsBack()">‹</button><b>${esc(g.name)}</b><span class="chip" style="margin-left:auto">🪙 ${S.coins || 0}</span></div>
  <h1>🔧 Werkstatt</h1><p class="m">Die ${esc(g.name)} steht auf dem Montageständer. Tippe auf ein Teil, an dem du schrauben willst.${due ? ' <b style="color:#ff6b5e">Rot heißt: Wartung fällig.</b>' : ''}</p>
  <div class="ws3" id="ws3"><div class="ws3load">🔧 3D-Werkstatt wird aufgebaut …</div><div class="ws3h">☝️ Ziehen: drehen · 🤏 Zwei Finger: zoomen · Tippen: Teil wählen</div></div>
  <div class="wsl">${W.spots.map((p, i) => `<button onclick="wsOpen(${i})" class="${spotDue(p, st) ? 'due' : ''}">${p.ic} ${esc(p.n)}</button>`).join('')}</div>
  <div class="wstools"><span>🔧</span><span>🪛</span><span>🗜️</span><span>🔨</span><span>📏</span><span>🧴</span><span>🔦</span></div>
  <div id="sheet"></div>`;
}
function wsSvgScene() {
  const g = GARAGE.find(x => x.id === G.id), st = gst(g.id), W = WS[g.id], t = tuneOf(st);
  return `<div class="wsc"><div class="wsb"><div class="wsz" id="wsz"><div class="wsbike" style="${t.hue ? `filter:hue-rotate(${t.hue}deg)` : ''}">${SVGS[W.svg]}</div><div class="wsstand"></div>
    ${W.spots.map((p, i) => `<button class="wsp${spotDue(p, st) ? ' due' : ''}" id="wsp${i}" style="left:${p.x}%;top:${p.y}%" onclick="wsOpen(${i})" aria-label="${esc(p.n)}"></button>`).join('')}</div></div></div>`;
}
function wsOpen(i) {
  const g = GARAGE.find(x => x.id === G.id), st = gst(g.id), p = WS[g.id].spots[i], t = tuneOf(st); G.wsi = i; G.job = null;
  const z = $('#wsz'); if (z) { z.style.transformOrigin = `${p.x}% ${p.y}%`; z.classList.add('zoom') } ws3dFocus(p.id); ws3dReset(); document.querySelectorAll('.wsp').forEach(b => b.classList.toggle('sel', b.id === 'wsp' + i));
  tone(500, .05, 0, 'sine', .05);
  const jobs = (p.jobs || []).map(k => { const j = JOBS[k], d = jobDue(st, k), left = j.every - (st.km - ((st.svc || {})[k] || 0));
    return `<button class="item" onclick="jStart('${k}')"><div class="dot" style="background:${d ? '#ff453a33' : '#30d15822'}">${j.icon}</div><div style="flex:1"><b>${j.name}</b><span class="m">${d ? '⚠️ jetzt fällig' : 'Wartung erst in ' + left + ' km fällig, üben geht immer'}</span></div><span class="chev">›</span></button>` }).join('');
  const parts = (p.parts || []).map(k => partRow(k, st)).join('');
  const duese = p.duese ? `<h2>Hauptdüse</h2><div class="sld"><div class="row sp"><span>Größe</span><b id="dv">${t.duese}</b></div><input type="range" min="56" max="124" step="2" value="${t.duese}" oninput="$('#dv').textContent=this.value" onchange="tDuese(+this.value)"></div><button class="btn alt" onclick="wsGo('dyno')">📈 Auf den Prüfstand</button>` : '';
  const act = p.act === 'fuel' ? `<p class="m">Tank: ${Math.round(st.fuel)} %. Getankt wird draußen an der Zapfsäule.</p><button class="btn" onclick="wsGo('fuel')">⛽ Zum Tanken</button>` : '';
  const w3 = $('#ws3'); if (w3) w3.scrollIntoView({behavior: 'smooth', block: 'start'});
  $('#sheet').innerHTML = `<div class="shb" onclick="wsClose()"></div><div class="shc low"><div class="shh" onclick="wsClose()"></div><div class="vpc"><div class="row sp"><b style="font-size:20px">${p.ic} ${esc(p.n)}</b><button class="back" onclick="wsClose()">✕</button></div>
    <p class="m">${esc(spotInfo(p))}</p>${jobs ? '<h2>Wartung</h2>' + jobs : ''}${parts ? '<h2>Tuning-Teile</h2>' + parts : ''}${duese}${act}</div></div>`;
}
function wsClose() { G.job = null; G.wsi = null; $('#sheet').innerHTML = ''; ws3dFocus(null); ws3dReset(); const z = $('#wsz'); if (z) z.classList.remove('zoom'); document.querySelectorAll('.wsp').forEach(b => b.classList.remove('sel')) }
function wsGo(k) { const id = G.id; openVeh(id); vPanel(k) }
// Nach Änderungen die richtige Ansicht neu zeichnen
function vRe() {
  if (view !== 'ws') return vRefresh();
  const i = G.wsi, tmp = document.createElement('div'); tmp.innerHTML = wsView();
  ['.wsl', '.nav'].forEach(sel => { const a = $(sel), b = tmp.querySelector(sel); if (a && b) a.replaceWith(b) });
  if (!$('#ws3') && !W3.on) { const a = $('.wsc'); if (a) a.outerHTML = wsSvgScene() }
  if (i !== null && i !== undefined) wsOpen(i);
}

// Testmodus (nur lokal): ?test#werkstatt springt direkt in die S51-Werkstatt
if (/[?&]test\b/.test(location.search) && location.hash === '#werkstatt' && !/github\.io$/.test(location.hostname)) setTimeout(() => { openVeh('g1'); vPanel('shop') }, 400);
