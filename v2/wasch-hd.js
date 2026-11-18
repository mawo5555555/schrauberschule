'use strict';
// Waschen 2 (einfach + fotorealistisch): Hochdruckreiniger auf dem echten Dreckfoto.
// Finger/Maus gedrückt halten = Wasserstrahl. Der Dreck löst sich Stück für Stück, darunter kommt das saubere Foto.
// Ersetzt WASCH.open; Quiz und Belohnung (1x je Fahrzeug und Tag, S.wash) bleiben wie bisher.
(function () {
  if (!window.WASCH) return;
  const OLD = window.WASCH.open;
  const NAMES = {s51: 'Simson S51', kr51: 'Schwalbe KR51/2', sr50: 'Simson SR50', s50: 'Simson S50', habicht: 'Simson Habicht', star: 'Simson Star', duo: 'Simson Duo', klapp: 'Mifa Klapprad'};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const rm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false } };
  const sndOn = () => { try { return typeof FX !== 'undefined' && FX.on() } catch (e) { return false } };
  const wsh = () => (S.wash = S.wash || {});
  const day = () => (typeof today === 'function' ? today() : '');
  const img = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src });
  const GW = 40, GH = 54;          // Fortschrittsraster
  let ov = null, T = null, raf = 0;

  function close() { if (raf) cancelAnimationFrame(raf); raf = 0; if (ov) ov.remove(); ov = null; T = null; document.documentElement.style.overflow = '' }

  async function open(id) {
    if (!NAMES[id]) return OLD && OLD(id);
    close();
    const [d, s] = await Promise.all([img('v2/img/wash/' + id + '-dreckig.jpg'), img('v2/img/wash/' + id + '-sauber.jpg')]);
    if (!d || !s) return OLD && OLD(id);
    ov = document.createElement('div'); ov.className = 'wz-ov wh-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Waschen mit Hochdruckreiniger');
    ov.innerHTML = '<div class="wz-in"><div class="wz-top"><button class="wz-x" onclick="WASCH.close()" aria-label="Schließen">‹</button><b>💦 Hochdruckreiniger · ' + esc(NAMES[id]) + '</b><button class="wz-x" id="wh-snd" aria-label="Ton an oder aus">' + (sndOn() ? '🔊' : '🔇') + '</button></div>' +
      '<div class="wz-bar"><i class="wz-tot"></i></div>' +
      '<p class="wz-txt wh-txt">Halte den Finger gedrückt und fahre über das Fahrzeug: Der Strahl spült den Dreck weg. Ganz nah ran macht es sauberer.</p>' +
      '<div class="wh-stage"></div><div class="wh-pct">0 % sauber</div>' +
      '<div class="wz-ctl"><button class="wz-gh" id="wh-auto">▶ Auto</button></div>' +
      '<div class="wz-quiz" style="display:none"></div></div>';
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    const stg = ov.querySelector('.wh-stage'), W = 640, H = Math.round(W * s.height / s.width);
    stg.style.aspectRatio = W + '/' + H;
    const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; stg.appendChild(c); return c };
    const cs = mk(), cd = mk(), cf = mk();          // sauber, dreckig (wird abgetragen), Effekte
    cs.getContext('2d').drawImage(s, 0, 0, W, H);
    const gd = cd.getContext('2d'); gd.drawImage(d, 0, 0, W, H);
    const gf = cf.getContext('2d');
    const small = document.createElement('canvas'); small.width = GW; small.height = GH; const gs = small.getContext('2d', {willReadFrequently: true});
    T = {id, W, H, cs, cd, cf, gd, gf, gs, small, drops: [], x: 0, y: 0, down: false, lastX: 0, lastY: 0, clean: 0, done: 0, auto: null, t: 0, sx: 0};
    cf.style.touchAction = 'none';
    const pos = e => { const r = cf.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H] };
    cf.addEventListener('pointerdown', e => { if (!T || T.done) return; T.auto = null; T.down = true; try { cf.setPointerCapture(e.pointerId) } catch (x) {} const p = pos(e); T.x = T.lastX = p[0]; T.y = T.lastY = p[1]; jet(p[0], p[1], 0); e.preventDefault() });
    cf.addEventListener('pointermove', e => { if (!T) return; const p = pos(e); T.x = p[0]; T.y = p[1]; if (!T.down || T.done) return; const dx = p[0] - T.lastX, dy = p[1] - T.lastY, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 12)); for (let i = 1; i <= n; i++) jet(T.lastX + dx * i / n, T.lastY + dy * i / n, Math.hypot(dx, dy)); T.lastX = p[0]; T.lastY = p[1]; e.preventDefault() });
    const up = () => { if (T) T.down = false }; cf.addEventListener('pointerup', up); cf.addEventListener('pointercancel', up);
    ov.querySelector('#wh-snd').onclick = () => { S.sound = !(S.sound !== false); try { save() } catch (e) {} ov.querySelector('#wh-snd').textContent = sndOn() ? '🔊' : '🔇' };
    ov.querySelector('#wh-auto').onclick = auto;
    let lt = performance.now(); const loop = t => { raf = 0; if (!T) return; const dt = Math.min(.05, (t - lt) / 1000); lt = t; frame(dt); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop);
    stg.dataset.ready = 1;
    return ov;
  }

  // Strahl: trägt Dreck ab (weicher Pinsel), erzeugt Spritzer
  function jet(x, y, speed) {
    const g = T.gd, r = 34 + Math.min(14, speed * .3);
    g.save(); g.globalCompositeOperation = 'destination-out';
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,.8)'); gr.addColorStop(.6, 'rgba(0,0,0,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore();
    for (let i = 0; i < 4; i++) { const a = Math.random() * 6.283, v = 60 + Math.random() * 190; T.drops.push({x: x + (Math.random() - .5) * 16, y: y + (Math.random() - .5) * 16, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, l: .45 + Math.random() * .4, r: 1 + Math.random() * 2.4}) }
    if (T.drops.length > 260) T.drops.splice(0, T.drops.length - 260);
    if (sndOn() && (T.t - T.sx) > .07) { T.sx = T.t; try { FX.noise(.09, 3600, .12, 'highpass'); FX.noise(.09, 1100, .08, 'lowpass') } catch (e) {} }
  }

  function frame(dt) {
    T.t += dt;
    if (T.auto) { const a = T.auto; a.u += dt * 1.0; const n = a.path.length; if (a.i < n) { const q = a.path[a.i]; const dx = q[0] - T.x, dy = q[1] - T.y, d = Math.hypot(dx, dy), step = 420 * dt; if (d <= step) { a.i++; jet(q[0], q[1], 30); T.x = q[0]; T.y = q[1] } else { const k = step / d, nx = T.x + dx * k, ny = T.y + dy * k; jet(nx, ny, 30); T.x = nx; T.y = ny } T.down = true } else { T.auto = null; T.down = false } }
    const g = T.gf; g.clearRect(0, 0, T.W, T.H);
    // Wasserfilm / nasse Spur
    for (const p of T.drops) { p.l -= dt; p.vy += 420 * dt; p.x += p.vx * dt; p.y += p.vy * dt }
    T.drops = T.drops.filter(p => p.l > 0);
    g.fillStyle = 'rgba(225,240,255,.75)'; for (const p of T.drops) { g.globalAlpha = Math.min(1, p.l * 2); g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill() } g.globalAlpha = 1;
    // Düse + Strahl
    if (T.down && !T.done && (T.x || T.y)) {
      const sx = T.W * .82, sy = T.H + 30, gr = g.createLinearGradient(sx, sy, T.x, T.y); gr.addColorStop(0, 'rgba(210,235,255,0)'); gr.addColorStop(.5, 'rgba(210,235,255,.28)'); gr.addColorStop(1, 'rgba(235,248,255,.7)');
      g.strokeStyle = gr; g.lineCap = 'round'; g.lineWidth = 7; g.beginPath(); g.moveTo(sx, sy); g.lineTo(T.x, T.y); g.stroke(); g.lineWidth = 2.5; g.strokeStyle = 'rgba(255,255,255,.65)'; g.beginPath(); g.moveTo(sx + 2, sy); g.lineTo(T.x, T.y); g.stroke();
      const hl = g.createRadialGradient(T.x, T.y, 0, T.x, T.y, 30); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.beginPath(); g.arc(T.x, T.y, 30, 0, 7); g.fill();
    }
    // Glanz-Sweep nach dem Waschen
    if (T.glint != null) { const x = T.glint; T.glint += T.W * dt * 1.1; const gg = g.createLinearGradient(x - 90, 0, x + 90, 0); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,255,255,.55)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gg; g.fillRect(x - 90, 0, 180, T.H); if (x > T.W + 120) T.glint = null }
    T.pt = (T.pt || 0) + dt; if (T.pt > .18) { T.pt = 0; progress() }
  }

  function progress() {
    if (!T || T.done) return;
    const s = T.gs; s.clearRect(0, 0, GW, GH); s.drawImage(T.cd, 0, 0, GW, GH);
    const dta = s.getImageData(0, 0, GW, GH).data; let sum = 0, tot = 0;
    for (let i = 3; i < dta.length; i += 4) { sum += dta[i] / 255; tot++ }
    // Anteil Dreck bezogen auf Start (Foto hat überall Alpha 1)
    const clean = Math.max(0, Math.min(1, 1 - sum / tot)); T.clean = clean;
    const pct = Math.min(100, Math.round(clean / .85 * 100));
    ov.querySelector('.wz-tot').style.width = pct + '%'; ov.querySelector('.wh-pct').textContent = pct + ' % sauber';
    if (clean >= .85) finish();
  }

  function finish() {
    if (!T || T.done) return; T.done = 1; T.auto = null; T.down = false;
    T.gd.clearRect(0, 0, T.W, T.H); T.glint = rm() ? null : -120; if (sndOn()) { try { FX.tone && FX.tone(880, .12, .08) } catch (e) {} }
    ov.querySelector('.wz-tot').style.width = '100%'; ov.querySelector('.wh-pct').textContent = '100 % sauber ✨';
    ov.querySelector('.wh-txt').innerHTML = '<b>Blitzblank!</b> ' + esc(NAMES[T.id]) + ' glänzt wieder.'; ov.querySelector('.wz-ctl').style.display = 'none';
    T.q = 0; T.right = 0; setTimeout(quiz, rm() ? 100 : 1700);
  }

  // Auto: Serpentinen über das Fahrzeug
  function auto() {
    if (!T || T.done) return; const pts = [], W = T.W, H = T.H;
    for (let row = 0, y = H * .02; y < H * .99; y += 30, row++) { const a = W * .02, b = W * .98; if (row % 2) { pts.push([b, y], [a, y]) } else { pts.push([a, y], [b, y]) } }
    for (let k = 0; k < 2; k++) pts.push(...pts.slice(0, pts.length).map(p => [p[0], p[1] + 15]));
    T.auto = {path: pts, i: 0, u: 0}; T.x = pts[0][0]; T.y = pts[0][1];
  }

  // ---------- Quiz + Belohnung (wie bisher) ----------
  const QUIZ = () => (window.WASCH.DATA && window.WASCH.DATA.QUIZ) || [];
  function quiz() {
    if (!ov || !T) return; const Q = QUIZ()[T.q]; if (!Q) return reward(); const b = ov.querySelector('.wz-quiz'); b.style.display = 'block'; delete b.dataset.lock;
    b.innerHTML = '<div class="wz-qh">🧠 Frage ' + (T.q + 1) + ' von ' + QUIZ().length + '</div><p>' + esc(Q.q) + '</p>' + Q.o.map((o, i) => '<button data-i="' + i + '">' + esc(o) + '</button>').join('');
    b.querySelectorAll('button[data-i]').forEach(x => x.onclick = () => ans(+x.dataset.i));
  }
  function ans(i) {
    const Q = QUIZ()[T.q], b = ov.querySelector('.wz-quiz'); if (b.dataset.lock) return; b.dataset.lock = 1; const ok = i === Q.a; if (ok) T.right++;
    b.querySelectorAll('button[data-i]').forEach((e, j) => { e.disabled = true; if (j === Q.a) e.classList.add('ok'); else if (j === i) e.classList.add('no') });
    b.insertAdjacentHTML('beforeend', '<div class="wz-ex">' + (ok ? '✅ Richtig! ' : '❌ Nicht ganz. ') + esc(Q.e) + '</div><button class="wz-go" id="wh-next">' + (T.q + 1 < QUIZ().length ? 'Nächste Frage ›' : 'Belohnung abholen ›') + '</button>');
    b.querySelector('#wh-next').onclick = () => { if (++T.q < QUIZ().length) quiz(); else reward() };
  }
  function reward() {
    const b = ov.querySelector('.wz-quiz'), id = T.id; let msg;
    if (wsh()[id] === day()) msg = '<div class="wz-rw">Heute hast du die ' + esc(NAMES[id]) + ' schon gewaschen. Die Taler-Belohnung gibt es pro Fahrzeug nur einmal am Tag. Morgen wieder!</div>';
    else { const coins = 10 + 5 * T.right, pts = 5; wsh()[id] = day(); S.coins = (S.coins || 0) + coins; S.points = (S.points || 0) + pts; try { save() } catch (e) {}
      msg = '<div class="wz-rw">🪙 <b>+' + coins + ' Taler</b> und <b>+' + pts + ' Punkte</b><br><small>10 Taler fürs Waschen, 5 je richtige Antwort (' + T.right + ' von ' + QUIZ().length + '). Einmal pro Fahrzeug und Tag.</small></div>'; if (sndOn()) { try { FX.clink() } catch (e) {} } }
    b.innerHTML = '<div class="wz-qh">✨ Fertig!</div>' + msg + '<div class="wz-row"><button class="wz-go" onclick="WASCH.close()">Fertig</button><button class="wz-gh" onclick="WASCH.open(\'' + id + '\')">Nochmal waschen</button></div>';
  }

  window.WASCH.open = open; window.WASCH.close = close; window.WASCH.old = OLD;
  window.WASCH.hd = {st: () => T, auto, finish, ans};

  // Test-Hook: #shot=p8-wash-hd  (halb sauber)  |  p8-wash-hd-test (Selbsttest)
  const hk = /shot=(p8-wash-hd[\w-]*)/.exec(location.hash); if (hk) setTimeout(async () => {
    await open('s51'); if (!T) return;
    if (hk[1] === 'p8-wash-hd') { for (let y = 0.1; y < 0.55; y += .04) for (let x = .05; x < .95; x += .03) jet(T.W * x, T.H * y * 1.5, 30); T.x = T.W * .5; T.y = T.H * .55; T.down = true; progress() }
    else if (hk[1] === 'p8-wash-hd-test') { auto(); let n = 0; while (T.auto && n++ < 4000) frame(.03); progress(); const err = []; if (!T.done) err.push('nicht fertig ' + T.clean); const c0 = S.coins || 0; delete wsh().s51; T.q = 0; T.right = 0; if (T.done) { setTimeout(() => { quiz(); ans(1); document.getElementById('wh-next') && document.getElementById('wh-next').click(); ans(1); document.getElementById('wh-next') && document.getElementById('wh-next').click(); document.title = (S.coins || 0) - c0 === 20 && wsh().s51 === day() ? 'WASCHHD OK' : 'FEHLER Taler ' + ((S.coins || 0) - c0) }, 50) } else document.title = 'FEHLER ' + err.join(';') }
  }, 1000);
})();
