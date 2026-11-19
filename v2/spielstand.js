'use strict';
// Spielstand sichern: doppelt speichern (localStorage + IndexedDB), Datei-Export/Import mit Prüfung, Code/QR (nur lokal erzeugt),
// dauerhaften Speicher anfragen, dezente Erinnerung nach Meilensteinen. Keine Server, keine Anmeldung.
(function () {
  const A = self.APP, M = window.SS_MIG, KEY = M.KEY, LSK = 'ss-sicher-v1', FMT = 1;
  const rd = () => { try { return JSON.parse(localStorage.getItem(LSK)) || {} } catch (e) { return {} } };
  const wr = o => { try { localStorage.setItem(LSK, JSON.stringify(o)) } catch (e) {} };
  const T = m => typeof toast === 'function' ? toast(m) : 0;
  const $$ = (s, r) => (r || document).querySelector(s);
  const esc2 = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  // ---------- IndexedDB (zweite Kopie) ----------
  let dbp = null;
  const idb = () => dbp || (dbp = new Promise((ok, no) => { try { const r = indexedDB.open('schrauberschule', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error) } catch (e) { no(e) } }));
  const idbPut = (k, v) => idb().then(db => new Promise((ok, no) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = ok; t.onerror = () => no(t.error) })).catch(() => {});
  const idbGet = k => idb().then(db => new Promise((ok, no) => { const r = db.transaction('kv').objectStore('kv').get(k); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error) })).catch(() => undefined);
  const idbKeys = () => idb().then(db => new Promise(ok => { const r = db.transaction('kv').objectStore('kv').getAllKeys(); r.onsuccess = () => ok(r.result); r.onerror = () => ok([]) })).catch(() => []);
  const idbDel = k => idb().then(db => new Promise(ok => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').delete(k); t.oncomplete = ok; t.onerror = ok })).catch(() => {});
  // Fortschrittswert eines Standes (für "besser/schlechter"-Vergleich)
  const prog = s => { try { const x = sum(s); return x.pts + x.miss * 5 + x.fz * 20 + x.tage * 3 } catch (e) { return 0 } };
  // Spiegel: 'state' = letzter Stand, 'best' = bester Stand, 'day-JJJJMMTT' = Tagesstand (letzte 7). Ein viel schlechterer Stand überschreibt nichts.
  let mt = null; const mirror = () => { clearTimeout(mt); mt = setTimeout(async () => { try {
    const raw = localStorage.getItem(KEY); if (!raw) return; let s; try { s = JSON.parse(raw) } catch (e) { return } if (!s || typeof s !== 'object' || Array.isArray(s)) return;
    const p = prog(s), rec = {raw, t: Date.now(), v: A.version, p}, best = await idbGet('best'), bp = best && typeof best.p === 'number' ? best.p : 0;
    if (p > bp) await idbPut('best', rec);
    if (bp >= 20 && p < bp * .5) return;
    await idbPut('state', rec); await idbPut('day-' + new Date().toISOString().slice(0, 10).replace(/-/g, ''), rec);
    const days = (await idbKeys()).filter(k => /^day-\d{8}$/.test(k)).sort(); for (const k of days.slice(0, Math.max(0, days.length - 7))) await idbDel(k)
  } catch (e) {} }, 700) };
  const _set = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) { const r = _set.apply(this, arguments); if (this === localStorage && k === KEY) mirror(); return r };
  if (window.__ssPendingBackup) idbPut('backup-' + window.__ssPendingBackup.key, window.__ssPendingBackup.raw);
  window.SS_idb = {put: idbPut, get: idbGet, keys: idbKeys};

  // ---------- Dauerhafter Speicher ----------
  const persist = async () => { try { if (navigator.storage && navigator.storage.persist) { if (await navigator.storage.persisted()) return true; return await navigator.storage.persist() } } catch (e) {} return false };
  const race = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(undefined), ms || 1200))]);
  const persisted = async () => { try { return !!(navigator.storage && navigator.storage.persisted && await navigator.storage.persisted()) } catch (e) { return false } };

  // ---------- Stand lesen, prüfen, einspielen ----------
  const cur = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null } catch (e) { return null } };
  const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(16).padStart(8, '0') };
  const sum = s => { const w = s.w2 || {}, n = o => o && typeof o === 'object' ? Object.keys(o).length : 0;
    return {pts: s.points | 0, miss: n(s.done), fz: (w.kb || []).length + (w.garage || []).length, tage: (s.days || []).length} };
  const sumTxt = s => { const x = sum(s); return `${x.pts} Punkte · ${x.miss} Missionen · ${x.fz} fertige Fahrzeuge · ${x.tage} Lerntage` };
  const makeFile = () => { const st = cur(); if (!st) return null; st.schema = st.schema || A.schema;
    const js = JSON.stringify(st); return {app: 'Schrauberschule', format: FMT, schema: st.schema, version: A.version, created: new Date().toISOString(), check: hash(js), state: st} };
  function check(o) { // -> {ok, err, state}
    if (!o || typeof o !== 'object') return {err: 'Das ist keine Spielstand-Datei.'};
    if (o.app !== 'Schrauberschule' || !o.state || typeof o.state !== 'object' || Array.isArray(o.state)) return {err: 'Das ist keine Spielstand-Datei der Schrauberschule.'};
    if (o.format > FMT || o.schema > A.schema) return {err: 'Dieser Spielstand ist von einer neueren Version. Bitte erst die App aktualisieren.'};
    if (o.check && o.check !== hash(JSON.stringify(o.state))) return {err: 'Die Datei ist beschädigt (Prüfsumme stimmt nicht). Nichts wurde geändert.'};
    const s = o.state; if (typeof s.points !== 'number' || typeof s.done !== 'object' || !Array.isArray(s.days)) return {err: 'In der Datei fehlen wichtige Teile. Nichts wurde geändert.'};
    return {ok: 1, state: M.migrate(JSON.parse(JSON.stringify(s)), typeof o.schema === 'number' ? o.schema : (typeof s.schema === 'number' ? s.schema : 1))};
  }
  function applyState(s) { // alten Stand erst sichern, dann ersetzen, dann neu laden
    const old = localStorage.getItem(KEY); if (old) { const k = M.backup(old, 'vor-import'); if (k) idbPut('backup-' + k, old) }
    const keepName = cur() && cur().name; if (!s.name && keepName) s.name = keepName;
    localStorage.setItem(KEY, JSON.stringify(s)); const o = rd(); o.lastM = milestone(s); wr(o); setTimeout(() => location.replace(location.href.split('#')[0] + '#imported'), 150); setTimeout(() => location.reload(), 250);
  }

  // ---------- Datei ----------
  const stamp = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) };
  async function exportFile() {
    const f = makeFile(); if (!f) return T('Noch kein Spielstand da.');
    const name = 'Schrauberschule-Spielstand-' + stamp() + '.json', blob = new Blob([JSON.stringify(f, null, 1)], {type: 'application/json'});
    let shared = false;
    try { const file = new File([blob], name, {type: 'application/json'}); if (navigator.canShare && navigator.canShare({files: [file]})) { await navigator.share({files: [file], title: 'Schrauberschule Spielstand'}); shared = true } } catch (e) { if (e && e.name === 'AbortError') return }
    if (!shared) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 3000) }
    const o = rd(); o.lastBackup = Date.now(); o.lastM = milestone(cur()); wr(o); T('Spielstand gesichert: ' + name); refresh();
  }
  function importFile(file) {
    const r = new FileReader(); r.onerror = () => say('Die Datei konnte nicht gelesen werden.', 1);
    r.onload = () => { let o; try { o = JSON.parse(r.result) } catch (e) { return say('Das ist keine gültige Datei (kein JSON).', 1) } confirmImport(check(o)) };
    r.readAsText(file);
  }

  // ---------- Code / QR ----------
  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') };
  const unb64 = t => { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; const s = atob(t), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u };
  async function pipe(u8, cls) { const cs = new (window[cls])('deflate-raw'), w = cs.writable.getWriter(); w.write(u8); w.close(); return new Uint8Array(await new Response(cs.readable).arrayBuffer()) }
  const canZ = () => typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
  async function makeCode(slim) {
    const f = makeFile(); if (!f) return null; const s = f.state; delete s.name; // keine Namen im Code
    if (slim) { delete s.log; delete s.ratings }
    const raw = new TextEncoder().encode(JSON.stringify({s, sc: f.schema})), z = canZ(), body = z ? await pipe(raw, 'CompressionStream') : raw, b = b64(body);
    return (z ? 'SS1-' : 'SS0-') + b + '-' + hash(b).slice(0, 4);
  }
  async function readCode(code) {
    code = String(code || '').trim().replace(/^.*#ss=/, '').replace(/\s+/g, ''); const m = /^(SS[01])-([A-Za-z0-9_-]+)-([0-9a-f]{4})$/.exec(code);
    if (!m) return {err: 'Der Code sieht nicht richtig aus. Bitte komplett kopieren (er beginnt mit SS1-).'};
    if (hash(m[2]).slice(0, 4) !== m[3]) return {err: 'Der Code ist unvollständig oder falsch kopiert. Nichts wurde geändert.'};
    try { let u = unb64(m[2]); if (m[1] === 'SS1') { if (!canZ()) return {err: 'Dieses Gerät kann den Code nicht entpacken. Bitte Datei benutzen.'}; u = await pipe(u, 'DecompressionStream') } const o = JSON.parse(new TextDecoder().decode(u)); return check({app: 'Schrauberschule', format: FMT, schema: o.sc, state: o.s}) }
    catch (e) { return {err: 'Der Code konnte nicht gelesen werden.'} }
  }
  function qrSvg(text) {
    if (typeof qrcode !== 'function') return null;
    try { const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); const n = q.getModuleCount(), c = 4; let d = '';
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + c},${y + c}h1v1h-1z`;
      return `<svg class="ss-qr" viewBox="0 0 ${n + 2 * c} ${n + 2 * c}" shape-rendering="crispEdges" role="img" aria-label="QR-Code mit deinem Spielstand"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>` } catch (e) { return null }
  }

  // ---------- Meilensteine / Erinnerung ----------
  function milestone(s) { s = s || cur() || {}; const w = s.w2 || {}; return Math.floor((s.points | 0) / 150) + (w.kb || []).length + (w.garage || []).length + (w.album || []).length }
  const DAY = 864e5;
  function remindCheck(force) {
    if (document.querySelector('.ss-rem, .ss-bk') || (!force && /shot=/.test(location.hash))) return;
    const s = cur(); if (!s) return; const o = rd(), m = milestone(s);
    if (o.lastM === undefined) { o.lastM = m; wr(o); if (!force) return }
    if (!force && !(m > o.lastM && Date.now() - (o.lastRem || 0) > 20 * 36e5 && Date.now() - (o.lastBackup || 0) > 2 * DAY)) return;
    if (typeof view !== 'undefined' && (view === 'run')) return;
    const b = document.createElement('div'); b.className = 'ss-rem'; b.setAttribute('role', 'status');
    b.innerHTML = '<span>🏆 Starker Fortschritt! Soll ich deinen Spielstand sichern?</span><button class="go" data-a="s">Sichern</button><button data-a="x" aria-label="Schließen">✕</button>';
    document.body.appendChild(b); o.lastRem = Date.now(); wr(o);
    const end = () => { b.remove(); const q = rd(); q.lastM = milestone(); wr(q) }; const t = setTimeout(end, 16000);
    b.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 's') { clearTimeout(t); end(); openPanel() } else if (a === 'x') { clearTimeout(t); end() } };
  }

  // ---------- Oberfläche ----------
  let pan = null, msgEl = null;
  function say(t, bad) { if (msgEl) { msgEl.className = 'ss-msg' + (bad ? ' bad' : ' ok'); msgEl.textContent = t } else T(t) }
  function closePanel(fromPop) { if (!pan) return; pan.remove(); pan = null; msgEl = null; stopScan(); if (!fromPop && history.state && history.state.ssModal) history.back() }
  function confirmImport(r) {
    if (!r.ok) return say(r.err, 1); const c = cur();
    const box = document.createElement('div'); box.className = 'ss-bk ss-conf'; box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = `<div class="ss-sh"><h3>Diesen Spielstand laden?</h3><p class="ss-s">Das hast du gerade:</p><p class="ss-c">${c ? esc2(sumTxt(c)) : 'noch nichts'}</p><p class="ss-s">Das wird geladen:</p><p class="ss-c on">${esc2(sumTxt(r.state))}</p><p class="ss-s">Dein jetziger Stand wird vorher automatisch in einer Sicherungskopie abgelegt. Es geht nichts verloren.</p>
      <div class="ss-row"><button class="ss-b alt" data-a="n">Abbrechen</button><button class="ss-b" data-a="j">Laden</button></div></div>`;
    document.body.appendChild(box); box.querySelector('[data-a=j]').focus();
    box.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'n' || e.target === box) box.remove(); else if (a === 'j') { box.remove(); applyState(r.state) } };
    box.onkeydown = e => { if (e.key === 'Escape') box.remove() };
  }
  async function showCode(slimTry) {
    const out = $$('#ss-code-out', pan); if (!out) return; out.innerHTML = '<p class="ss-s">Code wird erzeugt …</p>';
    let code = await makeCode(slimTry), url = location.href.split('#')[0] + '#ss=' + code, svg = code && /^https?:/.test(location.protocol) ? qrSvg(url) : (code ? qrSvg(code) : null), slim = slimTry;
    if (!svg && !slimTry && code) { const c2 = await makeCode(true), u2 = location.href.split('#')[0] + '#ss=' + c2, s2 = /^https?:/.test(location.protocol) ? qrSvg(u2) : qrSvg(c2); if (s2) { code = c2; svg = s2; slim = true } }
    if (!code) { out.innerHTML = '<p class="ss-s">Noch kein Spielstand da.</p>'; return }
    out.innerHTML = (svg ? `<div class="ss-qrw">${svg}</div><p class="ss-s">Mit der Kamera des anderen Geräts scannen. ${/^https?:/.test(location.protocol) ? 'Es öffnet sich die Schrauberschule und fragt, ob der Stand geladen werden soll.' : ''}${slim ? ' (Kurzfassung ohne Verlauf, damit der QR-Code lesbar bleibt.)' : ''}</p>` : '<p class="ss-s">Der Stand ist für einen QR-Code zu groß. Nimm den Code zum Kopieren oder die Datei.</p>')
      + `<textarea id="ss-code-t" readonly rows="3" aria-label="Spielstand-Code">${code}</textarea><button class="ss-b alt" data-a="copy">Code kopieren</button><p class="ss-s">Der Code enthält deinen Spielstand, aber keinen Namen. Er wird nur auf diesem Gerät erzeugt.</p>`;
  }
  let scanStream = null, scanTimer = null;
  function stopScan() { clearInterval(scanTimer); scanTimer = null; if (scanStream) { scanStream.getTracks().forEach(t => t.stop()); scanStream = null } const v = $$('.ss-scan'); if (v) v.remove() }
  async function scan() {
    if (!('BarcodeDetector' in window)) return say('Dieses Gerät kann QR-Codes in der App nicht scannen. Benutze die Kamera-App: Sie öffnet den Link.', 1);
    try { const det = new BarcodeDetector({formats: ['qr_code']}); scanStream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
      const w = document.createElement('div'); w.className = 'ss-scan'; w.innerHTML = '<video playsinline muted></video><button class="ss-b alt" data-a="stop">Abbrechen</button>'; $$('.ss-sh', pan).appendChild(w); const v = w.querySelector('video'); v.srcObject = scanStream; await v.play();
      w.querySelector('button').onclick = stopScan;
      scanTimer = setInterval(async () => { try { const r = await det.detect(v); if (r && r[0]) { stopScan(); const x = await readCode(r[0].rawValue); confirmImport(x) } } catch (e) {} }, 400) }
    catch (e) { stopScan(); say('Die Kamera ist nicht freigegeben oder nicht vorhanden.', 1) }
  }
  async function refresh() {
    if (!pan) return; const o = rd(), p = await race(persisted()), st = $$('#ss-stat', pan); if (!st) return;
    const ago = o.lastBackup ? Math.max(0, Math.floor((Date.now() - o.lastBackup) / DAY)) : null;
    const ids = await race(idbGet('state')), twin = ids && ids.raw ? 'doppelt gespeichert (Browser + Datenbank)' : 'einfach gespeichert';
    st.innerHTML = `<li><b>${esc2(sumTxt(cur() || {points: 0, done: {}, days: []}))}</b></li><li>${p ? '🟢 Speicher ist vom Browser geschützt' : '🟡 Speicher noch nicht dauerhaft geschützt'} · ${twin}</li><li>${ago === null ? '🟡 Noch nie als Datei gesichert' : ago === 0 ? '🟢 Heute als Datei gesichert' : ago < 15 ? `🟢 Zuletzt gesichert vor ${ago} Tag${ago === 1 ? '' : 'en'}` : `🟡 Zuletzt gesichert vor ${ago} Tagen`}</li>`;
  }
  function openPanel(tab) {
    if (pan) return; race(persist()).then(refresh);
    pan = document.createElement('div'); pan.className = 'ss-bk'; pan.setAttribute('role', 'dialog'); pan.setAttribute('aria-modal', 'true'); pan.setAttribute('aria-label', 'Spielstand sichern');
    const hint = (isIOS && !standalone()) ? '<div class="ss-warn">📱 <b>iPhone/iPad:</b> Im Safari-Browser kann iOS Daten löschen, wenn die Seite länger nicht benutzt wird. <b>Installiere die App</b> (Teilen → Zum Home-Bildschirm) und sichere ab und zu die Datei.</div>' : '';
    pan.innerHTML = `<div class="ss-sh"><button class="ss-x" data-a="close" aria-label="Schließen">✕</button><h3>Spielstand sichern</h3><p class="ss-s">Alles bleibt auf deinem Gerät. Nichts wird ins Internet geschickt.</p>${hint}<ul class="ss-stat" id="ss-stat"></ul><div class="ss-msg" id="ss-msg" role="status" aria-live="polite"></div>
      <div class="ss-grid"><section><h4>💾 Als Datei</h4><button class="ss-b" data-a="exp">Sichern (Datei speichern oder teilen)</button><label class="ss-b alt ss-file" tabindex="0">Datei laden<input type="file" accept=".json,application/json" hidden></label></section>
      <section><h4>🔁 Auf anderes Gerät</h4><button class="ss-b alt" data-a="code">Code und QR zeigen</button><div id="ss-code-out"></div><textarea id="ss-code-in" rows="2" placeholder="Code hier einfügen (SS1-…)" aria-label="Code einfügen"></textarea><div class="ss-row"><button class="ss-b alt" data-a="rcode">Code einlesen</button>${'BarcodeDetector' in window ? '<button class="ss-b alt" data-a="scan">QR scannen</button>' : ''}</div></section></div>
      <button class="ss-b" data-a="warm">📦 Offline-Paket laden (Bilder und Videos)</button><details class="ss-more"><summary>Mehr</summary><button class="ss-b alt" data-a="perm">Dauerhaften Speicher anfragen</button><button class="ss-b alt" data-a="bks">Automatische Sicherungskopien zeigen</button><div id="ss-more-out"></div></details></div>`;
    document.body.appendChild(pan); msgEl = $$('#ss-msg', pan); refresh();
    try { history.pushState({ssModal: 1, v: typeof view !== 'undefined' ? view : 'home'}, '') } catch (e) {}
    pan.onclick = async e => { const a = e.target.dataset && e.target.dataset.a;
      if (a === 'close' || e.target === pan) closePanel();
      else if (a === 'exp') exportFile(); else if (a === 'code') showCode(false);
      else if (a === 'copy') { const t = $$('#ss-code-t', pan); try { await navigator.clipboard.writeText(t.value); say('Code kopiert.') } catch (x) { t.select(); say('Bitte den markierten Code selbst kopieren.') } }
      else if (a === 'rcode') confirmImport(await readCode($$('#ss-code-in', pan).value)); else if (a === 'scan') scan();
      else if (a === 'perm') { const ok = await persist(); say(ok ? 'Speicher ist jetzt geschützt.' : 'Der Browser hat es nicht erlaubt. Das ist normal, solange die App nicht installiert ist.', !ok); refresh() }
      else if (a === 'warm') warm(); else if (a === 'bks') bks() };
    pan.querySelector('input[type=file]').onchange = e => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = '' };
    pan.onkeydown = e => { if (e.key === 'Escape') closePanel(); if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('ss-file')) { e.preventDefault(); e.target.querySelector('input').click() } };
    const f = pan.querySelector('[data-a=exp]'); if (f) f.focus(); if (tab === 'code') showCode(false);
  }
  async function bks() {
    const out = $$('#ss-more-out', pan), items = [];
    M.listBackups().reverse().forEach(k => { let raw = null; try { raw = localStorage.getItem(k) } catch (e) {} items.push({id: 'l:' + k, label: k.replace(M.BK, '').replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)\d*-/, '$3.$2.$1 $4:$5 · '), raw}) });
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(KEY + '-defekt-') === 0) items.push({id: 'l:' + k, label: 'Kaputter Stand vom ' + new Date(+k.split('-defekt-')[1] || 0).toLocaleDateString('de-DE'), raw: localStorage.getItem(k)}) } } catch (e) {}
    for (const k of (await idbKeys()).sort().reverse()) { if (!/^(best|state|day-\d{8})$/.test(k)) continue; const c = await idbGet(k); if (c && c.raw) items.push({id: 'd:' + k, label: k === 'best' ? 'Bester Stand (Datenbank)' : k === 'state' ? 'Letzter Stand (Datenbank)' : 'Tagesstand ' + k.slice(10, 12) + '.' + k.slice(8, 10) + '.' + k.slice(4, 8) + ' (Datenbank)', raw: c.raw}) }
    items.forEach(x => { x.s = null; try { x.s = JSON.parse(x.raw) } catch (e) {} });
    out.innerHTML = items.length ? '<ul class="ss-bl">' + items.map((x, n) => `<li><span>${esc2(x.label)}${x.s && typeof x.s === 'object' ? '<small>' + esc2(sumTxt(x.s)) + '</small>' : '<small>nicht lesbar</small>'}</span><button class="ss-b alt" data-n="${n}">Laden</button></li>`).join('') + '</ul>' : '<p class="ss-s">Noch keine Sicherungen.</p>';
    out.onclick = e => { const n = e.target.dataset && e.target.dataset.n; if (n == null) return; const x = items[+n], s = x && x.s; if (!s || typeof s !== 'object') return say('Kopie nicht lesbar.', 1); confirmImport(check({app: 'Schrauberschule', format: FMT, schema: typeof s.schema === 'number' ? s.schema : 1, state: s})) };
  }
  function warm() {
    const I = window.IMGS || {}, urls = []; for (const d in I) (I[d] || []).forEach(n => urls.push(new URL(`v2/img/${d}/${n}.jpg`, document.baseURI).href));
    (window.IMGS_ROOT || []).concat(window.IMGS_EXTRA || []).forEach(p => urls.push(new URL(p, document.baseURI).href));
    const sw = navigator.serviceWorker && navigator.serviceWorker.controller; if (!sw) return say('Offline-Paket gibt es nur, wenn die App über das Internet (https) geöffnet wurde.', 1);
    say(`Lade ${urls.length} Bilder und Videos (ca. 80 MB, nur im WLAN, Platz auf dem Gerät nötig) …`); sw.postMessage({type: 'WARM', urls});
    navigator.serviceWorker.addEventListener('message', function f(e) { const d = e.data; if (d && d.type === 'WARM') { say(d.done ? 'Fertig: Bilder und Prüfstand-Videos gehen jetzt auch ohne Internet.' : `Geladen: ${d.n} von ${d.of}`); if (d.done) navigator.serviceWorker.removeEventListener('message', f) } });
  }

  // ---------- Wiederherstellung aus der zweiten Kopie ----------
  // Beste Kopie aus der Datenbank suchen (letzter Stand, bester Stand, Tagesstände)
  async function bestCopy() {
    const ks = (await idbKeys()).filter(k => /^(state|best|day-\d{8})$/.test(k)); let top = null;
    for (const k of ks) { const c = await idbGet(k); if (!c || !c.raw) continue; let o; try { o = JSON.parse(c.raw) } catch (e) { continue }
      const r = check({app: 'Schrauberschule', format: FMT, schema: typeof o.schema === 'number' ? o.schema : 1, state: o}); if (!r.ok) continue; const p = prog(r.state); if (p > 0 && (!top || p > top.p)) top = {p, t: c.t, state: r.state, key: k} }
    return top;
  }
  async function rescue() {
    const raw = localStorage.getItem(KEY); let s = null; try { s = JSON.parse(raw) } catch (e) {}
    const curP = s && typeof s === 'object' ? prog(s) : 0, top = await bestCopy(); if (!top || curP >= top.p * .5) return;
    try { if (localStorage.getItem('ss-rescue-no') === String(top.t)) return } catch (e) {}
    const empty = curP === 0;
    const box = document.createElement('div'); box.className = 'ss-bk ss-conf'; box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = `<div class="ss-sh"><h3>Dein Spielstand wurde gefunden</h3><p class="ss-s">${empty ? 'Der Speicher war leer oder kaputt, aber' : 'Dein jetziger Stand ist viel kleiner als'} eine Kopie ${empty ? 'war noch da' : 'vom'} ${esc2(new Date(top.t).toLocaleDateString('de-DE'))}:</p><p class="ss-c on">${esc2(sumTxt(top.state))}</p><div class="ss-row"><button class="ss-b alt" data-a="n">${empty ? 'Neu anfangen' : 'Jetzigen behalten'}</button><button class="ss-b" data-a="j">Wiederherstellen</button></div></div>`;
    document.body.appendChild(box); box.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 'j') { box.remove(); applyState(top.state) } else if (a === 'n') { try { localStorage.setItem('ss-rescue-no', String(top.t)) } catch (x) {} box.remove() } };
  }
  window.SS_rescue = {bestCopy, prog, rescue};

  // ---------- Start ----------
  window.SS = {openPanel, makeCode, readCode, check, makeFile, applyState, exportFile, milestone, remindCheck, idbGet, idbPut, persist, hash};
  const shot = /shot=([\w-]+)/.exec(location.hash), hs = shot && shot[1];
  addEventListener('load', () => setTimeout(async () => {
    const m = /#ss=(SS[01]-[\w-]+)/.exec(location.hash);
    if (m) { history.replaceState(history.state, '', location.href.split('#')[0]); confirmImport(await readCode(m[1])); return }
    if (hs === 'sichern') openPanel(); else if (hs === 'sichern-code') openPanel('code'); else if (hs === 'sichern-mehr') { openPanel(); setTimeout(() => { const d = $$('.ss-more', pan); if (d) { d.open = true; bks() } }, 100) }
    else if (hs === 'erinnerung') remindCheck(true);
    else if (!hs) { rescue(); setTimeout(remindCheck, 4000); persist() }
    if (!hs) { const o = rd(); if (!o.lastM) { o.lastM = milestone(); wr(o) } }
  }, 900));
  mirror(); // erste Kopie in die Datenbank
  // Browser-Zurück schließt das Fenster
  addEventListener('popstate', () => { if (pan) closePanel(true) });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pan) closePanel() });
  const pp = window.parents;
  if (typeof pp === 'function') window.parents = function () {
    const h = pp.apply(null, arguments), card = '<div class="card"><div class="row sp"><b>Spielstand sichern</b></div><p class="m">Datei speichern, auf ein anderes Gerät übertragen oder zurückladen. Alles bleibt lokal.</p><button class="btn alt" onclick="SS.openPanel()">Sichern und Übertragen</button></div>';
    const i = h.indexOf('<div class="card"><b>Version</b>'); return i < 0 ? h + card : h.slice(0, i) + card + h.slice(i);
  };
})();
