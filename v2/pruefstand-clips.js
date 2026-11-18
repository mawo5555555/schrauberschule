'use strict';
// Prüfstand-Clips (KI-Videos): beim Prüfstandslauf spielt über der gezeichneten Szene das freigegebene Video des Fahrzeugs.
// Die Simulation (Monitor, Messwerte) läuft darunter normal weiter. Ohne Clip/Fehler bleibt alles wie bisher.
(function () {
  const FILE = {s51: 's51', s50: 's50', star: 'star', habicht: 'habicht', kr51: 'schwalbe', sr50: 'sr50', duo: 'duo', klapp: 'klapprad', rasen: 'rasen'};
  function clearOv() { document.querySelectorAll('.pcl').forEach(o => { try { o.querySelector('video').pause() } catch (e) {} o.remove() }) }
  function show(id) {
    clearOv(); const f = FILE[id]; if (!f) return;
    if (!document.querySelector('.pst')) return;
    const o = document.createElement('div'); o.className = 'pcl';
    const v = document.createElement('video'); v.src = url(id); v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto';
    let snd = false; try { snd = !!(window.FX && FX.on()) } catch (e) {}
    v.muted = !snd;
    const end = () => { o.classList.add('out'); setTimeout(() => o.remove(), 400) };
    v.addEventListener('ended', end); v.addEventListener('error', () => o.remove());
    o.appendChild(v); o.addEventListener('click', end);
    const bar = document.createElement('div'); bar.className = 'pcb';
    bar.innerHTML = '<button class="btn vid" data-a="share">Teilen</button><button class="btn alt" data-a="save">Speichern</button><button class="btn alt" data-a="close">Schließen</button>';
    bar.addEventListener('click', e => { e.stopPropagation(); const a = e.target && e.target.dataset && e.target.dataset.a; if (a === 'share') shareClip(id); else if (a === 'save') saveClip(id); else if (a === 'close') end() });
    o.appendChild(bar); document.body.appendChild(o);
    const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; const q = v.play(); if (q && q.catch) q.catch(() => o.remove()) });
  }
  // ---------- Teilen / Speichern des KI-Clips ----------
  const NAME = {s51: 'S51', s50: 'S50', star: 'Star', habicht: 'Habicht', kr51: 'Schwalbe', sr50: 'SR50', duo: 'Duo', klapp: 'Klapprad', rasen: 'Rasentraktor'};
  // neuer Dateiname bei neuem Video, sonst liefert der Offline-Speicher das alte
  const VID = {klapp: 'klapprad2'};
  const url = id => 'v2/img/clips/pruefstand-' + (VID[id] || FILE[id]) + '-app.mp4';
  const fname = id => 'Schrauberschule-' + (NAME[id] || id) + '-Pruefstand.mp4';
  function msg(t) { try { if (typeof window.toast === 'function') return window.toast(t) } catch (e) {} const d = document.createElement('div'); d.className = 'pcm-t'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600) }
  async function getFile(id) { const r = await fetch(url(id)); if (!r.ok) throw new Error('clip'); const b = await r.blob(); return new File([b], fname(id), {type: 'video/mp4'}) }
  function download(id, f) { const a = document.createElement('a'); a.href = f ? URL.createObjectURL(f) : url(id); a.download = fname(id); document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); if (f) URL.revokeObjectURL(a.href) }, 1500) }
  async function saveClip(id) { try { download(id, await getFile(id)) } catch (e) { download(id) } msg('Gespeichert (Download).') }
  async function shareClip(id) {
    let f = null; try { f = await getFile(id) } catch (e) {}
    try {
      if (f && navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], text: 'Schau, mein ' + (NAME[id] || 'Moped') + ' auf dem Prüfstand! 🔧', title: 'Schrauberschule'}); msg('Geteilt.'); return }
    } catch (e) { if (e && e.name === 'AbortError') return }
    download(id, f); msg('Teilen geht hier nicht, die Datei wurde gespeichert.')
  }
  // ---------- Teilen-Menü auf der Prüfstandsseite ----------
  function menu() {
    const c = PST.ctxNow(); if (!c || !FILE[c.id]) return; const id = c.id;
    document.querySelectorAll('.pcm').forEach(x => x.remove());
    const o = document.createElement('div'); o.className = 'pcm';
    o.innerHTML = '<div class="pcm-b"><div class="pcm-h">Prüfstandsvideo · ' + (NAME[id] || '') + '</div>' +
      '<button class="btn vid" data-a="share">Teilen<small>WhatsApp, TikTok, Instagram …</small></button>' +
      '<button class="btn" data-a="save">Auf dem Gerät speichern</button>' +
      '<button class="btn alt" data-a="view">Clip ansehen</button>' +
      (typeof window.videoShare === 'function' ? '<button class="btn alt" data-a="own">Eigenen Lauf als Video (mit Messwerten)</button>' : '') +
      '<button class="btn alt" data-a="close">Schließen</button></div>';
    o.addEventListener('click', e => { const a = e.target && e.target.dataset && e.target.dataset.a; if (e.target === o || a === 'close') return o.remove();
      if (a === 'share') shareClip(id); else if (a === 'save') saveClip(id); else if (a === 'view') { o.remove(); show(id) } else if (a === 'own') { o.remove(); window.videoShare() } });
    document.body.appendChild(o);
  }
  function addMenuBtn() {
    const host = document.querySelector('.lay.dy .la .pst'); if (!host) return;
    const c = PST.ctxNow(); if (!c || !FILE[c.id]) return;
    const la = host.parentNode; if (document.querySelector('.pcm-btn')) return;
    const b = document.createElement('button'); b.className = 'btn vid pcm-btn'; b.innerHTML = '<span class="vi">🎞️</span> Prüfstandsvideo teilen<small>KI-Clip teilen oder speichern</small>'; b.onclick = menu;
    (la.closest('.lay') || la).appendChild(b);
  }
  const appEl = document.getElementById('app');
  if (appEl) new MutationObserver(() => { try { addMenuBtn() } catch (e) {} }).observe(appEl, {childList: true});
  setTimeout(() => { try { addMenuBtn() } catch (e) {} }, 400);
  const st = document.createElement('style');
  st.textContent = '.pcl{position:fixed;inset:0;z-index:9000;background:rgba(5,8,14,.94);display:flex;align-items:center;justify-content:center;transition:opacity .4s}.pcl.out{opacity:0}.pcl video{max-height:86vh;max-width:96vw;border-radius:14px;box-shadow:0 8px 40px #000a}';
  st.textContent += '.pcl{flex-direction:column;gap:12px}.pcb{display:flex;gap:8px;width:min(420px,94vw)}.pcb .btn{margin:0;flex:1}.pcm{position:fixed;inset:0;z-index:9100;background:rgba(5,8,14,.8);display:flex;align-items:flex-end;justify-content:center}.pcm-b{width:min(440px,100%);background:var(--card,#161b24);border-radius:18px 18px 0 0;padding:16px;display:flex;flex-direction:column;gap:8px}.pcm-h{font-weight:700;text-align:center;margin-bottom:4px}.pcm-b .btn{margin:0}.pcm-t{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#000c;color:#fff;padding:10px 16px;border-radius:12px;z-index:9200}';
  document.head.appendChild(st);
  window.PSTCLIPS = {show, clear: clearOv, menu};
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearOv() });
  // Start-Hook: w2Run (Mopeds, Roller, Duo) und kRun (Klapprad) starten den Lauf; danach Clip einblenden
  // ---------- Clip direkt im Prüfstand-Bild (ersetzt die gezeichnete Szene) ----------
  const poster = id => 'v2/img/clips/pruefstand-' + FILE[id] + '-poster.jpg';
  function inl() {
    const w = document.querySelector('.pst-sc-w'); if (!w) return null;
    const c = PST.ctxNow(); if (!c) return null;
    w.querySelectorAll('img.pcv').forEach(x => x.remove());
    if (!FILE[c.id]) { w.classList.remove('has-v'); return null }
    let v = w.querySelector('video.pcv');
    if (v && v.dataset.id === c.id) return v;
    if (v) v.remove();
    v = document.createElement('video'); v.className = 'pcv'; v.dataset.id = c.id; v.src = url(c.id); v.poster = poster(c.id);
    v.playsInline = true; v.setAttribute('playsinline', ''); v.muted = true; v.preload = 'metadata';
    v.addEventListener('ended', () => { try { v.currentTime = 0; v.pause() } catch (e) {} });
    w.classList.add('has-v'); w.appendChild(v); return v;
  }
  function playInl(id) {
    const v = inl(); if (!v) return show(id);
    let snd = false; try { snd = !!(window.FX && FX.on()) } catch (e) {}
    v.muted = !snd; try { v.currentTime = 0 } catch (e) {}
    const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}) });
  }
  window.PSTCLIPS.has = id => !!FILE[id];
  if (appEl) new MutationObserver(() => { try { inl() } catch (e) {} }).observe(appEl, {childList: true, subtree: true});
  st.textContent += '.pst-sc-w.has-v>svg.pst-sc,.pst-sc-w.has-v>canvas.pst-cn{visibility:hidden}.pst-sc-w.has-v{aspect-ratio:1/1}.pst-sc-w .pcv{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 52%;background:#0d131c}';
  const after = () => { try { const c = PST.ctxNow(); if (c && PST.P.st) playInl(c.id) } catch (e) { if (window.console) console.warn('pcl', e) } };
  ['w2Run', 'kRun'].forEach(k => { const o = window[k]; if (typeof o === 'function') window[k] = function () { const r = o.apply(this, arguments); setTimeout(after, 30); return r } });
})();
