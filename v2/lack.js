'use strict';
// Paket 8 Teil B1: Lackieren (Farbwahl, Lackierkabine, Wirkung in Prüfstand/Bildern).
// Spielstand: S.lack[fahrzeugId] = {k: 'o' (Originalfarbe) | 'w' (Wunschfarbe), n: Name, hex: '#rrggbb'}; S wird von save()/Sicherung/Export komplett erfasst.
// Farben und Hinweise: LACKFARBEN-RECHERCHE.md. Hex = ca.-Näherung (Originallacke verblassen, keine RAL-Töne).
(function () {
  const B = 'belegt', H = 'Hinweis', U = 'unsicher';
  const DATA = {
    s51: {name: 'Simson S51', years: '1980 bis 1991', list: [
      ['Billardgrün', '#2f6b45', 'ab 1980, S51 B2-4', B], ['Saharabraun', '#a8875c', 'Farbe der S50/Schwalbe, für die S51 nicht einzeln belegt', H], ['Kirschrot', '#8e1f2a', 'Farbe der S50/Schwalbe, für die S51 nicht einzeln belegt', H],
      ['Olympiablau', '#1f4f9a', 'S51 N', B], ['Brillantblau', '#2a6cc4', 'S51 N', B], ['Metallic-Silbergrau', '#a9adb2', 'S51 E, ab Nov. 1981', B], ['Silbergrau', '#9ea3a8', 'S51 Enduro', B], ['Weiß (Atlasweiß)', '#efefea', 'S51 Comfort, ab Jan. 1983', B]]},
    kr51: {name: 'Schwalbe KR51/2', years: 'ca. 1980 bis 1986 (Reihe ab 1964)', list: [
      ['Blau (kräftig)', '#2a5fb0', 'KR51/2 N bis 1983, auch KR51/1', B], ['Saharabraun', '#a8875c', 'KR51/2 N ab 1983', B], ['Biberbraun', '#7a4a2a', 'KR51/2 E', B], ['Kirschrot', '#8e1f2a', 'KR51/2 L bis 1982', B],
      ['Billardgrün', '#2f6b45', 'KR51/2 L ab 1982', B], ['Olivgrün', '#5f6b3a', 'KR51/1 S (Topmodell)', B], ['Signalrot', '#b3261e', 'KR51/1 S ab 1978, Quellen widersprechen sich', H], ['Tundragrau', '#8a949a', 'KR51/1 bis 1973', B],
      ['Pastellweiß', '#e8e4d8', 'KR51/1 K', B], ['Verkehrsorange', '#e8741a', 'frühe KR51 (1964 bis 1968), Jahr nicht genannt', H]]},
    sr50: {name: 'Simson SR50', years: '1987 bis 1991', list: [
      ['Weinrot', '#6e1f2b', 'SR 50 B3 (im Original mit Dunkelbraun)', B], ['Beige', '#cdbf9c', 'SR 50 B4 (im Original mit Dunkelbraun)', B], ['Weiß', '#ecebe6', 'so im Bild der App, keine belegte Werksfarbe', U]]},
    s50: {name: 'Simson S50', years: '1975 bis 1980', list: [
      ['Rapsgelb', '#e0aa1c', 'S50 B, z. B. 1978 (damals "Schwefelgelb")', B], ['Kirschrot', '#8e1f2a', 'S50 B', B], ['Saharabraun', '#a8875c', 'S50 B', B], ['Saftgrün', '#6fa83a', 'S50 B', B], ['Blau', '#2a5fb0', 'S50 N, ab Mitte 1975 nur noch Blau', B]]},
    habicht: {name: 'Simson Habicht', years: '1971 bis 1975', list: [
      ['Olivgrün', '#5f6b3a', 'Grundfarbe', B], ['Alabasterweiß', '#e0d7bd', 'im Original Teilfarbe (Verkleidung, Tank)', B]]},
    star: {name: 'Simson Star', years: '1964 bis 1975', list: [
      ['Weinrot', '#8b1e24', 'ca. RAL 3003, ganzer Zeitraum', B], ['Beige', '#cbc6a8', 'im Original Teilfarbe (Verkleidung, Tank)', B], ['Maron', '#5a2a1e', 'Anfangszeit, Jahre fehlen', H], ['Blaugrau', '#3f6178', 'so im Bild der App, nicht belegt', U]]},
    duo: {name: 'Simson Duo', years: 'ca. 1965 bis 1970er (Dreirad)', list: [
      ['Blau', '#2a5fb0', 'Piccolo Duo/2 (1965), Duo/3 1968 bis 1970', B], ['Olivgrün', '#5f6b3a', 'Duo 4/1 nach 1972, zuerst', B], ['Orange', '#e8741a', 'Duo 4/1 später, Jahre fehlen', B], ['Mintgrün', '#8fb8a0', 'so im Bild der App, nicht belegt', U]]},
    klapp: {name: 'Mifa Klapprad', years: 'ab 1967 bis 1990', list: [
      ['Dunkelgrün', '#1f4a30', 'Modell 904 (1978), Museumsstück', B], ['Blau', '#1f4f8f', '1985 bis 1990, Museumsstück', B], ['Rot', '#b3202a', 'so im Bild der App, nicht belegt', U]]}
  };
  const ORDER = ['s51', 'kr51', 'sr50', 's50', 'habicht', 'star', 'duo', 'klapp'], SHORT = {s51: 'S51', kr51: 'Schwalbe', sr50: 'SR50', s50: 'S50', habicht: 'Habicht', star: 'Star', duo: 'Duo', klapp: 'Klapprad'};
  const IMG = {s51: 's51', kr51: 'schwalbe', sr50: 'sr50', s50: 's50', habicht: 'habicht', star: 'star', duo: 'duo', klapp: 'klapprad'};
  const GMAP = {g1: 's51', g6: 'kr51', g9: 'sr50'};
  const BADGE = {[B]: ['lk-b1', '✓ belegt'], [H]: ['lk-b2', '~ Hinweis'], [U]: ['lk-b3', '? unsicher']};
  const SC = 215, PRIMER = '#8a9199';
  const VEH = () => (window.PST && PST.VEH) || {};
  const ORIGCOL = {}; Object.keys(VEH()).forEach(k => ORIGCOL[k] = VEH()[k].col);
  const lk = () => (S.lack = S.lack || {});
  const rm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false } };
  const wishOpen = () => (typeof doneIn === 'function' ? doneIn('mathe') : 0) >= 3;
  const wishNeed = () => Math.max(0, 3 - (typeof doneIn === 'function' ? doneIn('mathe') : 0));
  const hexOk = h => /^#[0-9a-f]{6}$/i.test(h || '');

  // ---------- Farbe wirkt im Prüfstand ----------
  function applyAll() { const V = VEH(); ORDER.forEach(id => { if (!V[id]) return; const c = lk()[id]; V[id].col = c && hexOk(c.hex) ? c.hex : (ORIGCOL[id] || V[id].col) }) }
  applyAll();

  // ---------- Fahrzeug zeichnen (Seitenansicht aus pruefstand-art.js) ----------
  function vbOf(id, pad) { const V = VEH()[id], wb = V.wb * SC, R = V.R; return [-wb - R - 70, -pad, wb + 2 * R + 170, pad + R + 30] }
  function drawVeh(id, col) {
    const V = VEH()[id], A = window.PSTART; if (!V || !A || !A.draw || !A.draw[id]) return '';
    const o = Object.assign({ccm: 60, pick: A.cur || null}, V, {col}); o.wb = V.wb * SC;
    try { return A.draw[id](o) } catch (e) { console.error(e); return '' }
  }
  const defsSvg = () => '<defs>' + ((window.PSTART && PSTART.defs) ? PSTART.defs() : '') + '</defs>';
  function previewSvg(id, col) { const v = vbOf(id, 235);
    return `<svg viewBox="${v.join(' ')}" role="img" aria-label="${esc(DATA[id].name)} in der gewählten Farbe">${defsSvg()}<ellipse cx="${v[0] + v[2] / 2 - 20}" cy="${VEH()[id].R + 6}" rx="${v[2] * .42}" ry="8" fill="#000" opacity=".4"/>${drawVeh(id, col)}</svg>` }

  // ---------- Farbwahl ----------
  let cur = 'dis', pick = null, mix = {a: null, b: null, w: 0}, ov = null;
  const selNow = id => lk()[id];
  const hexNow = () => pick ? pick.hex : (selNow(cur) ? selNow(cur).hex : ORIGCOL[cur]);
  function mixColor() {
    const P = {r: [200, 40, 40], y: [245, 205, 30], b: [30, 80, 190]}; let a = mix.a, b = mix.b; if (!a) return null;
    let c = b && b !== a ? P[a].map((x, i) => (x + P[b][i]) / 2) : P[a].slice();
    c = c.map(x => x + (mix.w > 0 ? (255 - x) * mix.w * .22 : mix.w < 0 ? x * mix.w * .22 : 0));
    return '#' + c.map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  }
  const mixName = () => { const a = mix.a, b = mix.b, s = [a, b].filter(Boolean).sort().join(''); const base = {r: 'Rot', y: 'Gelb', b: 'Blau', br: 'Violett', by: 'Grün', ry: 'Orange'}[s === 'bry' ? 'ry' : s] || '';
    return base + (mix.w > 0 ? ', heller' : mix.w < 0 ? ', dunkler' : '') + (mix.w ? ' (' + Math.abs(mix.w) + ')' : '') };
  function wahlHtml() {
    const D = DATA[cur], now = selNow(cur), hx = hexNow(), nm = pick ? pick.n : (now ? now.n : 'Grundfarbe der App');
    const sw = D.list.map((c, i) => `<button class="${hx.toLowerCase() === c[1] && pick && pick.i === i || (!pick && now && now.k === 'o' && now.hex === c[1] && now.n === c[0]) ? 'on' : ''}" onclick="LACK.pickO(${i})" aria-label="${esc(c[0])}"><i style="background:${c[1]}"></i><div><b>${esc(c[0])}</b><em class="${BADGE[c[3]][0]}">${BADGE[c[3]][1]}</em><span>ca. ${c[1]} · ${esc(c[2])}</span></div></button>`).join('');
    const mc = mixColor(), open = wishOpen();
    const pb = (k, n, c) => `<button class="${mix.a === k || mix.b === k ? 'on' : ''}" onclick="LACK.mixP('${k}')"><i style="background:${c}"></i>${n}</button>`;
    return `<div class="lk-in"><div class="lk-top"><button class="lk-x" onclick="LACK.close()" aria-label="Zurück">‹</button><b>🎨 Lackieren</b></div>
    <div class="lk-chips">${ORDER.map(k => `<button class="${k === cur ? 'on' : ''}" onclick="LACK.veh('${k}')">${SHORT[k]}</button>`).join('')}</div>
    <div class="lk-pv">${previewSvg(cur, hx)}<div class="nm"><b>${esc(D.name)}</b> in <b>${esc(nm)}</b></div></div>
    <p class="lk-m">${esc(D.name)}: gebaut ${esc(D.years)}. Die Farben unten gab es laut Wikipedia, Sammlern und Museen. Die Farbtöne sind <b>ca.-Näherungen</b> (alter Lack verblasst, es sind keine genauen RAL-Töne).</p>
    <p class="lk-m"><em class="lk-b1" style="font-style:normal;padding:1px 6px;border-radius:8px">✓ belegt</em> in einer Quelle mit Modell genannt · <em class="lk-b2" style="font-style:normal;padding:1px 6px;border-radius:8px">~ Hinweis</em> nur Händler/Sammler, nicht ganz sicher · <em class="lk-b3" style="font-style:normal;padding:1px 6px;border-radius:8px">? unsicher</em> nur Bildfarbe der App</p>
    <div class="lk-sw">${sw}</div>
    <p class="lk-m">Zweifarbige Originale (z. B. Star, Habicht, SR50) färbt die App vereinfacht in einer Farbe.</p>
    <div class="lk-card"><h3>🌈 Wunschfarbe</h3>${open ? `<div class="lk-row"><input type="color" id="lkcol" value="${hx}" oninput="LACK.wish(this.value)" aria-label="Wunschfarbe wählen"><span class="lk-m">Such dir jede Farbe aus. Das ist <b>deine</b> Farbe, kein Original.</span></div>`
      : `<p class="lk-m">🔒 Noch ${wishNeed()} ${wishNeed() === 1 ? 'Mathe-Mission' : 'Mathe-Missionen'}, dann kannst du jede Farbe frei wählen. Die Original-Farben darfst du schon jetzt benutzen.</p>`}</div>
    <details class="lk-card"${/mix/.test(location.hash) ? ' open' : ''}><summary><b>🧪 Farben mischen (Lernkasten)</b></summary>
      <p class="lk-m">Mit den Grundfarben <b>Rot, Gelb und Blau</b> kannst du im Malkasten fast alles mischen: Rot + Gelb = Orange, Gelb + Blau = Grün, Rot + Blau = Violett. Mit <b>Weiß</b> wird eine Farbe heller, mit <b>Schwarz</b> dunkler. (Bei Licht und Bildschirmen mischt es anders, dort sind Rot, Grün und Blau die Grundfarben.)</p>
      <div class="lk-mx">${pb('r', 'Rot', '#c82828')}${pb('y', 'Gelb', '#f5cd1e')}${pb('b', 'Blau', '#1e50be')}</div>
      <div class="lk-mx"><button onclick="LACK.mixW(1)"><i style="background:#fff"></i>+ Weiß</button><button onclick="LACK.mixW(-1)"><i style="background:#111"></i>+ Schwarz</button><button onclick="LACK.mixReset()">Neu</button></div>
      <div class="lk-res"><i style="background:${mc || '#2a3648'}"></i><div class="lk-m">${mc ? '<b>' + mixName() + '</b>, Tippe zwei Grundfarben (zuerst eine, dann die zweite).' : 'Tippe eine oder zwei Grundfarben.'}${mc ? `<br><button class="lk-ghost" ${open ? '' : 'disabled'} onclick="LACK.useMix()">${open ? 'Als Wunschfarbe nehmen' : '🔒 Wunschfarbe noch gesperrt'}</button>` : ''}</div></div></details>
    <button class="lk-go" onclick="LACK.go()">🎨 In die Lackierkabine</button>
    <button class="lk-ghost" style="width:100%;margin-top:8px" onclick="LACK.share()">📤 Foto teilen</button>
    ${now ? '<div style="height:8px"></div><button class="lk-ghost" onclick="LACK.reset()">Zurück zur Grundfarbe</button>' : ''}</div>`;
  }
  function wr() { if (ov) { const sc = ov.scrollTop; ov.innerHTML = wahlHtml(); ov.scrollTop = sc; photoPv() } }
  // Foto-Vorschau: echtes Fahrzeugfoto, Lack per Maske umgefärbt (lack-foto.js); ohne Foto bleibt die Zeichnung
  let pvTok = 0;
  async function photoPv(hex) {
    const pv = ov && ov.querySelector('.lk-pv'); if (!pv || !window.LackFoto || LackFoto.ids.indexOf(cur) < 0) return; const tok = ++pvTok, id = cur, hx = hex || hexNow();
    try {
      let cv = pv.querySelector('canvas.lk-ph'); const fresh = !cv; if (!cv) cv = document.createElement('canvas'), cv.className = 'lk-ph';
      const tmp = document.createElement('canvas'); await LackFoto.draw(tmp, id, hx); if (tok !== pvTok || !ov || id !== cur) return;
      cv.width = tmp.width; cv.height = Math.round(tmp.height * .62); cv.getContext('2d').drawImage(tmp, 0, Math.round(tmp.height * .08), tmp.width, cv.height, 0, 0, tmp.width, cv.height);
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', DATA[id].name + ' in der gewählten Farbe');
      if (fresh) { const sv = pv.querySelector('svg'); if (sv) sv.replaceWith(cv); else pv.prepend(cv) }
    } catch (e) { if (window.console) console.warn('lack-foto', e) }
  }
  // Teilen: Foto mit Beschriftung als Bild
  async function shareImg(id, hex, name) {
    id = id || cur; hex = hex || hexNow(); name = name || (pick ? pick.n : (selNow(id) ? selNow(id).n : 'Grundfarbe'));
    const tmp = document.createElement('canvas'); try { await LackFoto.draw(tmp, id, hex) } catch (e) { toastL('Das Foto ging nicht.'); return }
    const sy = Math.round(tmp.height * .08), sh = Math.round(tmp.height * .62), W = 1080, H = Math.round(W * sh / tmp.width) + 120, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.fillStyle = '#0b121c'; x.fillRect(0, 0, W, H); x.drawImage(tmp, 0, sy, tmp.width, sh, 0, 0, W, H - 120);
    x.fillStyle = '#0b121c'; x.fillRect(0, H - 120, W, 120); x.fillStyle = hex; x.fillRect(40, H - 90, 60, 60); x.fillStyle = '#fff'; x.font = '700 38px -apple-system,system-ui,sans-serif'; x.fillText(DATA[id].name + ' in ' + name, 120, H - 62); x.fillStyle = '#9fb3cc'; x.font = '26px -apple-system,system-ui,sans-serif'; x.fillText('Selbst lackiert in der Schrauberschule', 120, H - 28);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .92)); const f = new File([blob], 'Schrauberschule-' + SHORT[id] + '-Lack.jpg', {type: 'image/jpeg'});
    try { if (navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], text: 'Schau, meine ' + SHORT[id] + ' in ' + name + '! 🎨', title: 'Schrauberschule'}); toastL('Geteilt.'); return } } catch (e) { if (e && e.name === 'AbortError') return }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 1500); toastL('Gespeichert (Download).')
  }
  function toastL(t) { try { if (typeof window.toast === 'function') return window.toast(t) } catch (e) {} const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#000c;color:#fff;padding:10px 16px;border-radius:12px;z-index:99999'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600) }
  function open(id) { if (id && DATA[id]) cur = id; else if (!DATA[cur] || cur === 'dis') cur = 's51'; pick = null; mix = {a: null, b: null, w: 0}; if (ov) ov.remove(); ov = document.createElement('div'); ov.className = 'lk-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Lackieren'); document.body.appendChild(ov); wr() }
  function close() { stopKab(); const k = document.querySelector('.lk-kb'); if (k) k.remove(); if (ov) { ov.remove(); ov = null } try { if (view !== 'run') render() } catch (e) {} }

  // ---------- Lackierkabine ----------
  const hs = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) };
  let kab = null;
  function kabine(id, hex, name, opt) {
    opt = opt || {}; stopKab(); const V = VEH()[id], R = V.R, wb = V.wb * SC, v = vbOf(id, 285), xl = v[0] + 10, xr = v[0] + v[2] - 10, gy = -250, reduced = rm(), freeze = opt.at != null;
    const T = reduced ? [0, 1.3, 2.6, 3.9, 5.2] : [0, 2.6, 7.4, 10.4, 12.6], NAMES = ['Abkleben', 'Spritzen', 'Trocknen', 'Glanz'], SUBS = ['Reifen und Motor werden mit Klebeband und Papier geschützt.', 'Die Spritzpistole fährt zweimal über das Fahrzeug. Zwei dünne Schichten halten besser als eine dicke.', 'Warmluft und Infrarotlampen trocknen den Lack (ca. 60 Grad, Spielwert).', 'Zum Schluss glänzt der Klarlack. Fertig!'];
    const col = hex, tape = '#dcc98f', box = document.createElement('div'); box.className = 'lk-kb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Lackierkabine');
    const tp = (cx, cy, rot, w, h, k) => `<g class="tp" data-k="${k}" transform="translate(${cx} ${cy}) rotate(${rot})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="2" fill="${tape}" stroke="#a48d4a" stroke-width="1.2"/><path d="M${-w / 2} 0 H${w / 2}" stroke="#fff8" stroke-width="1"/></g>`;
    const tw = (cx, k) => `<g class="tw" data-k="${k}" transform="translate(${cx} 0)"><circle r="${R + 2}" fill="${tape}" fill-opacity=".94" stroke="#a48d4a" stroke-width="2"/><path d="M${-R} ${-R * .35} L${R} ${R * .35} M${-R} 0 L${R} ${R * .7} M${-R} ${-R * .7} L${R} 0" stroke="#fff6" stroke-width="3"/></g>`;
    const pc = id2 => `<clipPath id="${id2}"><rect x="${v[0]}" y="${v[1]}" width="0" height="${v[3] + 40}"/></clipPath>`;
    const heat = [0, 1, 2, 3, 4, 5].map(i => `<path class="ht" d="M${xl + 40 + i * (xr - xl - 80) / 5} ${R - 10} q10 -30 0 -60 t0 -60 t0 -60" fill="none" stroke="#ffb060" stroke-width="3" stroke-linecap="round" stroke-dasharray="18 14" opacity="0"/>`).join('');
    const parts = Array.from({length: 46}, (_, i) => `<circle class="pp" r="2" fill="${col}"/>`).join('');
    box.innerHTML = `<div class="hd"><b id="lkh">Abkleben</b><span id="lks"></span></div><div class="st"><svg viewBox="${v.join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lackierkabine mit ${esc(DATA[id].name)}">
      <defs>${(window.PSTART && PSTART.defs) ? PSTART.defs() : ''}${pc('lkA')}${pc('lkB')}
        <linearGradient id="lkwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3442"/><stop offset="1" stop-color="#151b24"/></linearGradient>
        <linearGradient id="lkfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#39424f"/><stop offset="1" stop-color="#10141a"/></linearGradient>
        <radialGradient id="lkirg2" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ff8a2a" stop-opacity=".85"/><stop offset=".55" stop-color="#ff6a00" stop-opacity=".25"/><stop offset="1" stop-color="#ff6a00" stop-opacity="0"/></radialGradient>
        <linearGradient id="lkglg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="lkcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".75"/><stop offset="1" stop-color="${col}" stop-opacity=".05"/></linearGradient></defs>
      <rect x="${v[0] - 600}" y="-3000" width="${v[2] + 1200}" height="${R + 6 + 3000}" fill="url(#lkwall)"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${v[0] + i * v[2] / 6.5 - 20}" y="${v[1] + 10}" width="${v[2] / 6.5 - 12}" height="${R - v[1] - 40}" rx="6" fill="#fff" opacity=".035"/>`).join('')}
      <rect x="${v[0] - 600}" y="${R + 6}" width="${v[2] + 1200}" height="3000" fill="url(#lkfl)"/><ellipse cx="${(xl + xr) / 2}" cy="${R + 8}" rx="${v[2] * .4}" ry="9" fill="#000" opacity=".5"/>
      <g id="lkp" opacity="1">${drawVeh(id, PRIMER)}</g>
      <g id="gA" clip-path="url(#lkA)" opacity=".62" style="display:none">${drawVeh(id, col)}</g>
      <g id="gB" clip-path="url(#lkB)" style="display:none">${drawVeh(id, col)}</g>
      <g id="lkt" style="display:none">${tw(0, 0)}${tw(-wb, 1)}${tp(-wb * .45, -38, -8, 110, 22, 2)}${tp(-wb * .5, -12, 4, 96, 20, 3)}${tp(-wb * .2, -60, 12, 70, 18, 4)}</g>
      <g id="gir" style="display:none"><rect x="${xl}" y="-278" width="${xr - xl}" height="12" rx="6" fill="#4a3320"/><rect x="${xl + 30}" y="-272" width="${xr - xl - 60}" height="6" rx="3" fill="#ff7a1a"/><rect id="lkirg" x="${xl}" y="-270" width="${xr - xl}" height="${R + 276}" fill="url(#lkirg2)" opacity="0"/>${heat}</g>
      <g id="lkgun" style="display:none"><g class="pp0">${parts}</g><path id="lkc" d="" fill="url(#lkcone)"/>
        <g id="lkgb"><rect x="-26" y="${gy - 14}" width="52" height="22" rx="8" fill="#c9d2dc" stroke="#222" stroke-width="2"/><rect x="-6" y="${gy - 34}" width="12" height="22" rx="3" fill="#8a96a4" stroke="#222" stroke-width="2"/><rect x="-14" y="${gy + 6}" width="28" height="16" rx="3" fill="${col}" stroke="#222" stroke-width="2"/><path d="M-8 ${gy + 22} h16 l-3 12 h-10z" fill="#555" stroke="#222" stroke-width="1.5"/><path d="M22 ${gy - 4} q36 -30 80 -50" stroke="#2a2e34" stroke-width="5" fill="none"/></g></g>
      <rect id="gGl" x="0" y="${v[1]}" width="90" height="${v[3] + 40}" fill="url(#lkglg)" opacity="0" transform="skewX(-18)" style="mix-blend-mode:overlay"/>
      <g id="lksp" opacity="0" transform="translate(${-wb * .4} -150)"><path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5Z" fill="#fff"/></g>
    </svg></div><div class="ft"><div class="lk-dots">${NAMES.map(() => '<i></i>').join('')}</div><div id="lkbt"><button onclick="LACK.skip()">Überspringen</button></div></div>`;
    document.body.appendChild(box);
    const q = s => box.querySelector(s), dots = box.querySelectorAll('.lk-dots i'), pps = box.querySelectorAll('.pp'), tps = box.querySelectorAll('.tp,.tw'), hts = box.querySelectorAll('.ht');
    const A = q('#gA'), Bv = q('#gB'), rA = box.querySelector('clipPath#lkA rect'), rB = box.querySelector('clipPath#lkB rect');
    let lastS = -1, fin = false;
    const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
    function frame(t) {
      const s = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : t < T[4] ? 3 : 4, W = xr - xl;
      if (s !== lastS) { lastS = s; const k = Math.min(s, 3); q('#lkh').textContent = (k + 1) + '. ' + NAMES[k]; q('#lks').textContent = SUBS[k]; dots.forEach((d, i) => { d.className = i < s || s === 4 ? 'dn' : i === s ? 'on' : '' }) }
      // Klebeband
      const tapeVis = s <= 2 ? 1 : s === 3 && !reduced ? 1 - ease((t - T[3]) / .7) : 0;
      q('#lkt').style.display = tapeVis > 0 ? '' : 'none'; q('#lkt').style.opacity = tapeVis;
      tps.forEach((g, i) => { const p = reduced || s > 0 ? 1 : ease((t - .15 - i * .38) / .6), tr = g.getAttribute('transform').replace(/ scale\([^)]*\)/, ''); g.setAttribute('transform', tr + ' scale(' + (.2 + .8 * p).toFixed(3) + ')'); g.style.opacity = p });
      // Lack
      const showA = s >= 1, showB = s >= 2 || (!reduced && t >= T[1] + (T[2] - T[1]) / 2);
      A.style.display = showA ? '' : 'none'; Bv.style.display = showB ? '' : 'none';
      let gx = xl, gun = false, pass = 0;
      if (reduced) { A.style.opacity = 1; Bv.style.display = 'none'; rA.setAttribute('x', v[0]); rA.setAttribute('width', v[2]) }
      else if (s === 1) { const p = (t - T[1]) / (T[2] - T[1]); if (p < .5) { pass = 0; const q1 = p * 2; gx = xl + W * ease(q1); rA.setAttribute('x', v[0]); rA.setAttribute('width', Math.max(0, gx - v[0])) } else { pass = 1; const q2 = (p - .5) * 2; gx = xr - W * ease(q2); rA.setAttribute('x', v[0]); rA.setAttribute('width', v[2]); rB.setAttribute('x', gx); rB.setAttribute('width', Math.max(0, v[0] + v[2] - gx)) } gun = p > .02 && p < .98 }
      else if (s >= 2) { rA.setAttribute('x', v[0]); rA.setAttribute('width', v[2]); rB.setAttribute('x', v[0]); rB.setAttribute('width', v[2]) }
      const gunG = q('#lkgun'); gunG.style.display = gun ? '' : 'none';
      if (gun) { q('#lkgb').setAttribute('transform', `translate(${gx.toFixed(1)} 0)`); const top = gy + 30, bot = R - 20, hw = 70;
        q('#lkc').setAttribute('d', `M${(gx - 4).toFixed(1)} ${top} L${(gx + 4).toFixed(1)} ${top} L${(gx + hw).toFixed(1)} ${bot} L${(gx - hw).toFixed(1)} ${bot}Z`);
        pps.forEach((c, i) => { const ph = (t * 2.4 + hs(i) * 3 + i * .137) % 1, sp = (hs(i + 9) - .5) * 2; c.setAttribute('cx', (gx + sp * (6 + ph * 80)).toFixed(1)); c.setAttribute('cy', (top + ph * (bot - top)).toFixed(1)); c.setAttribute('r', (1.6 + ph * 3.2).toFixed(1)); c.setAttribute('opacity', ((1 - ph) * .85).toFixed(2)) }) }
      // Trocknen
      const dry = s === 2 || (s === 3 && !reduced && t < T[3] + 1);
      q('#gir').style.display = s === 2 ? '' : 'none';
      if (s === 2) { const g = reduced ? .55 : .35 + .3 * (.5 + .5 * Math.sin(t * 4)); q('#lkirg').setAttribute('opacity', g.toFixed(2)); hts.forEach((h, i) => { h.setAttribute('opacity', reduced ? .35 : (.3 + .3 * Math.sin(t * 3 + i)).toFixed(2)); h.setAttribute('stroke-dashoffset', (-(t * 30 + i * 9)).toFixed(1)) }) }
      // Glanz
      const gl = q('#gGl'), spk = q('#lksp');
      if (s === 3 || s === 4) { const p = s === 4 ? 1 : (t - T[3]) / (T[4] - T[3]);
        if (reduced) { gl.setAttribute('opacity', .3); gl.setAttribute('x', (xl + W * .45) * 1.05 + 0) } else { gl.setAttribute('x', ((xr + 120) - (W + 240) * ease(p)) * 1.0 + (R + 6) * .32); gl.setAttribute('opacity', (s === 4 ? 0 : Math.sin(Math.min(1, p) * Math.PI) * .85).toFixed(2)) }
        const sp = s === 4 ? .9 : ease((p - .45) / .3) * (1 - ease((p - .8) / .2)); spk.setAttribute('opacity', sp.toFixed(2)); spk.setAttribute('transform', `translate(${-wb * .4} -150) scale(${(.4 + sp * .9).toFixed(2)}) rotate(${(p * 40).toFixed(0)})`) } else { gl.setAttribute('opacity', 0); spk.setAttribute('opacity', 0) }
      if (s === 4 && !fin) { fin = true; done() }
    }
    function done() { q('#lkh').textContent = '✅ Fertig lackiert!'; q('#lks').textContent = DATA[id].name + ' in ' + name + '. Du findest die Farbe jetzt im Prüfstand, in der Garage und in der Werkstatt.'; q('#lkbt').innerHTML = '<button onclick="LACK.again()">Nochmal ansehen</button><button onclick="LACK.shareDone()">📤 Teilen</button><button class="pri" onclick="LACK.close()">Weiter</button>'; if (!opt.quiet) { try { if (typeof confetti === 'function' && !reduced) confetti() } catch (e) {} ding() } }
    kab = {box, frame, id, hex, name, raf: 0, snd: null, T, fin: () => fin};
    if (freeze) { frame(opt.at); return kab }
    const t0 = performance.now(); sndStart(T);
    const loop = now => { if (!kab || kab.box !== box) return; const t = (now - t0) / 1000; frame(Math.min(t, T[4] + .01)); if (t < T[4] + .02) kab.raf = requestAnimationFrame(loop) };
    kab.raf = requestAnimationFrame(loop); kab.skip = () => { cancelAnimationFrame(kab.raf); sndStop(); frame(T[4] + .01) };
    return kab;
  }
  function stopKab() { if (kab) { cancelAnimationFrame(kab.raf); sndStop(); const b = kab.box; kab = null; if (b) b.remove() } }

  // ---------- Ton (synthetisch, folgt dem Ton-Schalter der App) ----------
  let snd = null;
  const soundOn = () => { try { return S.sound !== false } catch (e) { return false } };
  function sndStart(T) {
    if (!soundOn() || rm() && false) return; let c = null; try { c = window.FX && FX.A ? FX.A() : null } catch (e) {} if (!c) return;
    try {
      const t0 = c.currentTime + .05, master = c.createGain(); master.gain.value = .5; master.connect(c.destination);
      const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = () => { const s = c.createBufferSource(); s.buffer = nb; s.loop = true; return s };
      // Zischen der Spritzpistole: Rauschen, Bandpass, an/aus je Durchgang
      const hiss = ns(), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = .7; const hg = c.createGain(); hg.gain.value = 0; hiss.connect(bp); bp.connect(hg); hg.connect(master);
      const sp = T[1], dur = T[2] - T[1];
      [[.02, .48], [.52, .98]].forEach(([a, b]) => { hg.gain.setTargetAtTime(.16, t0 + sp + dur * a, .04); hg.gain.setTargetAtTime(0, t0 + sp + dur * b, .05) });
      hiss.start(t0); hiss.stop(t0 + T[4] + 1);
      // Kompressor: tiefes Brummen mit Takt, bis zum Ende des Spritzens
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 46; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180; const og = c.createGain(); og.gain.value = 0; o.connect(lp); lp.connect(og); og.connect(master);
      for (let t = 0; t < T[2]; t += .9) { og.gain.setTargetAtTime(.2, t0 + t + .2, .08); og.gain.setTargetAtTime(.07, t0 + t + .62, .12) }
      og.gain.setTargetAtTime(0, t0 + T[2], .2); o.start(t0); o.stop(t0 + T[2] + 1);
      // Klebeband abziehen: kurze Rausch-Rutscher
      [.3, .8, 1.4, 1.9].forEach(x => { const s = ns(), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; const g = c.createGain(); g.gain.value = 0; s.connect(hp); hp.connect(g); g.connect(master); g.gain.setTargetAtTime(.12, t0 + x, .01); g.gain.setTargetAtTime(0, t0 + x + .18, .05); s.start(t0 + x); s.stop(t0 + x + .6) });
      // Trocknen: leises Gebläse
      const fan = ns(), fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 500; const fg = c.createGain(); fg.gain.value = 0; fan.connect(fl); fl.connect(fg); fg.connect(master); fg.gain.setTargetAtTime(.09, t0 + T[2], .3); fg.gain.setTargetAtTime(0, t0 + T[3], .3); fan.start(t0 + T[2] - .5); fan.stop(t0 + T[3] + 2);
      snd = {c, master};
    } catch (e) { console.error(e) }
  }
  function sndStop() { if (snd) { try { snd.master.gain.setTargetAtTime(0, snd.c.currentTime, .05) } catch (e) {} snd = null } }
  function ding() { if (!soundOn()) return; try { const c = FX.A(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = 1046; g.gain.setValueAtTime(.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(.18, c.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + .9); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 1) } catch (e) {} }

  // ---------- Bilder umfärben (Garage, Werkstatt): nur Lackbereich per Farbton-Maske ----------
  const rgb2hsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60 } return [h, s, l] };
  const hsl2rgb = (h, s, l) => { h /= 360; const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p }; if (!s) return [l * 255, l * 255, l * 255]; const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255] };
  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const tintCache = {};
  function tintCanvas(im, hex) {   // liefert Canvas mit umgefärbtem Lack oder null (kein Lack erkennbar)
    const sc = Math.min(1, 720 / Math.max(im.naturalWidth || im.width, im.naturalHeight || im.height)), w = Math.round((im.naturalWidth || im.width) * sc), h = Math.round((im.naturalHeight || im.height) * sc), cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, w, h);
        const dt = cx.getImageData(0, 0, w, h), px = dt.data, n = w * h, hist = new Float32Array(36);
        for (let i = 0; i < n; i++) { const [H, Sa, L] = rgb2hsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); if (Sa > .28 && L > .18 && L < .85) hist[Math.floor(H / 10) % 36] += Sa }
        let pk = 0, bs = 0; for (let b = 0; b < 36; b++) { const s3 = hist[b] + hist[(b + 1) % 36] + hist[(b + 35) % 36]; if (s3 > bs) { bs = s3; pk = b } }
        const hp = pk * 10 + 5;
        if (bs < n * .012) {   // Paket 10: weißer/silberner Lack (keine Farbsättigung): Helligkeitsmaske, Schatten und Glanz bleiben
          const y0 = Math.floor(h * .27); let sL2 = 0, c2 = 0;
          for (let i = y0 * w; i < n; i++) { const [H, Sa, L] = rgb2hsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); if (Sa < .16 && L > .66) { sL2 += L; c2++ } }
          if (c2 < n * .01) return null; const aL2 = sL2 / c2, [tH2, tS2, tL2] = rgb2hsl(...hex2rgb(hex));
          for (let i = y0 * w; i < n; i++) { const [H, Sa, L] = rgb2hsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); if (Sa > .2 || L < .38) continue;
            const yy = Math.floor(i / w) / h, xx = (i % w) / w; if (yy > .88 || (yy > .7 && xx < .7) || (yy > .6 && xx < .12) || (yy > .72 && xx > .85)) continue;   // Boden und Spiegelungen auslassen
            const wgt = Math.min(1, (L - .38) / .2) * Math.min(1, (.2 - Sa) / .08);
            let nl = Math.max(.03, Math.min(.97, tL2 * Math.min(1.12, L / aL2))); if (L > .92) nl += (.98 - nl) * (L - .92) / .08; const [r2, g2, b2] = hsl2rgb(tH2, tS2, nl);
            px[i * 4] += (r2 - px[i * 4]) * wgt; px[i * 4 + 1] += (g2 - px[i * 4 + 1]) * wgt; px[i * 4 + 2] += (b2 - px[i * 4 + 2]) * wgt }
          cx.putImageData(dt, 0, 0); return cv;
        }
        let sS = 0, sL = 0, cnt = 0; const hd = x => { let d = Math.abs(x - hp); return d > 180 ? 360 - d : d };
        for (let i = 0; i < n; i++) { const [H, Sa, L] = rgb2hsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); if (Sa > .28 && L > .18 && L < .85 && hd(H) < 22) { sS += Sa; sL += L; cnt++ } }
        if (cnt < n * .01) return null; const aS = sS / cnt, aL = sL / cnt, [tH, tS, tL] = rgb2hsl(...hex2rgb(hex));
        for (let i = 0; i < n; i++) { const [H, Sa, L] = rgb2hsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); if (Sa < .2 || L < .1 || L > .92) continue; const d = hd(H); if (d > 34) continue; const wgt = Math.min(1, (34 - d) / 14) * Math.min(1, (Sa - .2) / .15);
          const nl = Math.max(.03, Math.min(.97, L + (tL - aL) * .9)), ns = Math.min(1, tS * Math.min(1.25, Sa / aS)), [r2, g2, b2] = hsl2rgb(tH, ns, nl);
          px[i * 4] += (r2 - px[i * 4]) * wgt; px[i * 4 + 1] += (g2 - px[i * 4 + 1]) * wgt; px[i * 4 + 2] += (b2 - px[i * 4 + 2]) * wgt }
        cx.putImageData(dt, 0, 0); return cv;
  }
  function tintImg(img, hex) {
    const src = img.dataset.o || img.src, key = src + hex; if (img.dataset.lk === hex) return;
    const apply = u => { img.dataset.o = src; img.dataset.lk = hex; img.src = u };
    if (tintCache[key]) return apply(tintCache[key]);
    const im = new Image(); im.onload = () => {
      try { const cv = tintCanvas(im, hex); if (!cv) return; const u = cv.toDataURL('image/jpeg', .9); tintCache[key] = u; apply(u) } catch (e) { console.log('TINTERR ' + e.message) }
    }; im.onerror = () => {}; im.src = src;
  }
  function tintPics(root) {   // Paket 10: Fahrzeugbilder als CSS-Hintergrund (Werkstatt, Garage-Kacheln)
    (root || document).querySelectorAll('[style*="v2/img/ki/"]').forEach(el => {
      const m0 = /v2\/img\/ki\/([a-z0-9-]+)\.jpg/.exec(el.dataset.o || el.style.backgroundImage || ''); if (!m0) return;
      const id = Object.keys(IMG).find(k => IMG[k] === m0[1]); if (!id) return; const c = S.lack && S.lack[id], orig = el.dataset.o || ('v2/img/ki/' + m0[1] + '.jpg');
      if (c && hexOk(c.hex)) { if (el.dataset.lk === c.hex) return; const px = {dataset: el.dataset, complete: true, naturalWidth: 1, get src() { return orig }, set src(u) { el.style.backgroundImage = 'url(' + u + ')' }}; el.dataset.o = orig; tintImg(px, c.hex) }
      else if (el.dataset.o && el.dataset.lk) { el.style.backgroundImage = 'url(' + el.dataset.o + ')'; delete el.dataset.lk }
    });
  }
  function tintAll(root) {
    tintPics(root);
    const imgs = (root || document).querySelectorAll('img'); imgs.forEach(img => {
      const src = img.dataset.o || img.getAttribute('src') || ''; const m = /v2\/img\/ki\/([a-z0-9-]+)\.jpg/.exec(src); if (!m) return;
      let id = Object.keys(IMG).find(k => IMG[k] === m[1]); if (!id) return; const c = S.lack && S.lack[id];
      if (img.id === 'vimg' || img.closest('.gk') || img.closest('.gg') || true) { if (c && hexOk(c.hex)) { if (img.complete && img.naturalWidth) tintImg(img, c.hex); else img.addEventListener('load', () => tintImg(img, c.hex), {once: true}) } else if (img.dataset.o && img.dataset.lk) { img.src = img.dataset.o; delete img.dataset.lk } }
    });
  }
  let busy = 0; new MutationObserver(() => { if (busy) return; busy = 1; setTimeout(() => { busy = 0; try { tintAll() } catch (e) { console.error(e) } addButtons() }, 60) }).observe(document.body, {childList: true, subtree: true});

  // ---------- Einstieg: Knopf "Lackieren" ----------
  function addButtons() {
    if (document.querySelector('.lk-ov')) return;
    let id = null;
    try { if (view === 'w2' || view === 'pr') { const v = typeof veh === 'function' ? veh() : null; id = (v && v.id) || (W2 && W2.sel) } } catch (e) {}
    const m = document.querySelector('#app .mods:not(.lkd)');
    if (m && id && DATA[id]) { m.classList.add('lkd'); const b = document.createElement('div'); b.className = 'lk-btn'; const c = lk()[id]; b.innerHTML = `<button class="lk-ghost" onclick="LACK.open('${id}')">🎨 Lackieren</button><span class="lk-chip">${c ? esc(c.n) : 'Grundfarbe'}</span>`; m.parentNode.insertBefore(b, m.nextSibling) }
    try { if (view === 'veh' && G && GMAP[G.id] && !document.querySelector('#app .lk-btn')) { const t = document.querySelector('#app .vtiles'); if (t) { const id2 = GMAP[G.id], c = lk()[id2], b = document.createElement('div'); b.className = 'lk-btn'; b.innerHTML = `<button class="lk-ghost" onclick="LACK.open('${id2}')">🎨 Lackieren</button><span class="lk-chip">${c ? esc(c.n) : 'Grundfarbe'}</span>`; t.parentNode.insertBefore(b, t) } } } catch (e) {}
  }

  // ---------- Öffentliche Schnittstelle ----------
  const L = window.LACK = {DATA, open, close,
    farbe(id) { const c = S.lack && S.lack[id]; return c && hexOk(c.hex) ? c.hex : null },
    tintFor(imgKey, im) { try { const id = Object.keys(IMG).find(k => IMG[k] === imgKey), c = id && S.lack && S.lack[id]; if (!c || !hexOk(c.hex) || !im) return im; return tintCanvas(im, c.hex) || im } catch (e) { return im } }, veh(id) { cur = id; pick = null; wr() },
    pickO(i) { const c = DATA[cur].list[i]; pick = {k: 'o', n: c[0], hex: c[1], i}; wr() },
    wish(h) { if (!wishOpen() || !hexOk(h)) return; pick = {k: 'w', n: 'Wunschfarbe', hex: h}; const pv = ov && ov.querySelector('.lk-pv'); if (pv) { if (window.LackFoto && LackFoto.ids.indexOf(cur) >= 0) { const nm0 = pv.querySelector('.nm'); if (nm0) nm0.innerHTML = '<b>' + esc(DATA[cur].name) + '</b> in <b>Wunschfarbe</b>'; photoPv(h); return } pv.innerHTML = previewSvg(cur, h) + `<div class="nm"><b>${esc(DATA[cur].name)}</b> in <b>Wunschfarbe</b></div>` } },
    mixP(k) { if (!mix.a || (mix.a && mix.b)) { mix.a = k; mix.b = null } else if (mix.a !== k) mix.b = k; wr() },
    mixW(d) { if (mix.a) mix.w = Math.max(-3, Math.min(3, mix.w + d)); wr() }, mixReset() { mix = {a: null, b: null, w: 0}; wr() },
    useMix() { const c = mixColor(); if (c && wishOpen()) { pick = {k: 'w', n: 'Gemischte Wunschfarbe', hex: c}; wr() } },
    reset() { if (lk()[cur]) { delete lk()[cur]; save(); applyAll(); tintAll() } pick = null; wr() },
    go() { const c = pick || lk()[cur] || {k: 'o', n: DATA[cur].list[0][0], hex: DATA[cur].list[0][1]}; lk()[cur] = {k: c.k, n: c.n, hex: c.hex}; save(); applyAll(); const id = cur; if (ov) ov.style.display = 'none'; kabine(id, c.hex, c.n); try { tintAll() } catch (e) {} },
    share() { shareImg() }, shareDone() { const k = kab; if (k) shareImg(k.id, k.hex, k.name) },
    again() { const k = kab; if (k) kabine(k.id, k.hex, k.name) }, skip() { if (kab && kab.skip) kab.skip() },
    kabine, tintAll, applyAll, wishOpen};
  // ---------- Test-Hooks: #shot=p8-lack-wahl | p8-lack-wahl-gesperrt | p8-lack-kabine | p8-lack-kabine-trocknen | p8-lack-pst ----------
  const hk = /shot=(p8-lack[\w-]*)/.exec(location.hash); if (!hk) { tintAll(); addButtons(); return }
  const k = hk[1];
  setTimeout(() => {
    S.points = Math.max(S.points, 300); S.done = S.done || {};
    if (k !== 'p8-lack-wahl-gesperrt') MISSIONS.filter(m => !m.speech && m.subject === 'mathe').slice(0, 3).forEach(m => { S.done[m.id] = 1 });
    if (k === 'p8-lack-p10studio') { lk().sr50 = {k: 'w', n: 'Test', hex: '#c0201c'}; const b = {id: 'sr50', key: 'sr50', name: 'Simson SR50', ccm: '50', ps: 3.6, vmax: 60, base: {ps: 3.6, vmax: 60}, parts: [], pick: {}, jet: 70, legal: true, cost: 0, date: '17.11.2026', player: ''}; document.body.innerHTML = '<div style="display:flex;gap:6px;background:#000"><canvas id="c1" width="360" height="480"></canvas><canvas id="c2" width="360" height="640"></canvas></div>'; Promise.all([sceneDraw(document.getElementById('c1'), b, true), cardDraw(document.getElementById('c2'), b)]).then(() => { document.title = 'ok' }).catch(e => { document.title = 'ERR ' + e.message }); return }
    if (k === 'p8-lack-sr50-rot' || k === 'p8-lack-sr50-blau') { lk().sr50 = {k: 'w', n: 'Test', hex: k.endsWith('rot') ? '#c0201c' : '#1f4f9a'}; applyAll(); W2.veh = null; W2.sel = 'sr50'; view = 'w2'; render(); setTimeout(tintAll, 300); return }
    if (k === 'p8-lack-wahl' || k === 'p8-lack-wahl-gesperrt') { lk().s51 = {k: 'o', n: 'Billardgrün', hex: '#2f6b45'}; applyAll(); open('s51'); if (k === 'p8-lack-wahl') { ov.querySelector('details').open = true; mix = {a: 'y', b: 'b', w: 1}; wr() } return }
    if (k === 'p8-lack-kabine' || k === 'p8-lack-kabine-trocknen' || k === 'p8-lack-kabine-abkleben' || k === 'p8-lack-kabine-glanz') { const at = {'p8-lack-kabine': 5.3, 'p8-lack-kabine-trocknen': 8.6, 'p8-lack-kabine-abkleben': 1.9, 'p8-lack-kabine-glanz': 11.5}[k]; kabine('s51', '#2f6b45', 'Billardgrün', {at: rm() ? at * .4 : at}); return }
    if (k === 'p8-lack-pst') {
      lk().s51 = {k: 'o', n: 'Billardgrün', hex: '#2f6b45'}; applyAll();
      const pick = {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r16', schr: 'ss', sitz: 'sb0'}; W2.veh = null; W2.sel = 's51';
      const c = W2.cars.s51 = {ph: 5, took: BP.map(p => p.id), put: BP.map(p => p.id), pick, jet: 80, drove: true, ran: true}; c.jet = w2perf(V2V.s51, pick, 70).ideal; const keep = JSON.parse(JSON.stringify(c));
      view = 'pr'; render(); setTimeout(() => { W2.cars.s51 = JSON.parse(JSON.stringify(keep)); const old = document.querySelector('.pst'); if (old) old.remove(); PST.shotAt(13.5) }, 150);
    }
  }, 1000);
})();
