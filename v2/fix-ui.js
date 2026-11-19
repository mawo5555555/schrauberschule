'use strict';
// Fehlerkorrekturen UI (18.11.): (1) Prüfstand-Start nach beendetem Lauf, (2) Toast/Overlays blockieren den oberen Rand.
(function () {
  // --- 2: reine Deko darf nie Taps schlucken (Toast lag oben mittig ueber Zurueck-Knopf/HUD, 3,2 s lang)
  const st = document.createElement('style');
  st.textContent = '.toast,.coinpill,.bgfx,.amb,.lf,.gate,.rt,.rt *,.confetti,.fx,.spk,.wr,.coin,.ride,.pcm-t{pointer-events:none!important}' +
    '.toast{top:max(calc(var(--top,56px) + 8px),54px)!important;max-width:min(90vw,520px)}';
  document.head.appendChild(st);
  // Clip-Overlay (Vollbild) das nie startet (iOS Stromsparmodus, blockierte Wiedergabe): nach 4 s entfernen
  const app = document.body;
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType === 1 && n.classList && n.classList.contains('pcl')) setTimeout(() => {
      try { const v = n.querySelector('video'); if (n.isConnected && v && v.paused && v.currentTime === 0) n.remove() } catch (e) {}
    }, 4000);
  }))).observe(app, {childList: true});
  // Rolltor-Reste: Wenn nach 10 s noch .rt/.gate da ist, entfernen
  setInterval(() => { document.querySelectorAll('.rt,.gate').forEach(e => { const t = +e.dataset.fxT || (e.dataset.fxT = Date.now()); if (Date.now() - t > 10000) e.remove() }) }, 3000);

  // --- 1: Prüfstand starten: nach beendetem Lauf blieb der Start-Knopf wirkungslos (fertige Szene wurde wiederverwendet).
  // Vor jedem Start: fertige/verwaiste Szene verwerfen, damit run() neu aufbaut. Zusätzlich Mehrfach-Tap entprellen und Fehler abfangen.
  let last = 0;
  ['w2Run', 'kRun'].forEach(k => {
    const o = window[k]; if (typeof o !== 'function') return;
    window[k] = function () {
      const now = Date.now(); if (now - last < 350) return; last = now;
      try {
        const P = window.PST && PST.P, i = P && P.idle;
        if (i && i.sim && i.sim.done) { if (PST.stop) PST.stop(); const old = document.querySelector('.pst'); if (old) old.remove(); P.idle = null; P.st = null; document.querySelectorAll('.pst-sc-w.has-v').forEach(w => w.classList.remove('has-v')) }
        return o.apply(this, arguments);
      } catch (e) { if (window.console) console.warn('Prüfstand-Start', e); try { if (window.toast) toast('Prüfstand konnte nicht starten. Bitte nochmal tippen.') } catch (e2) {} }
    };
  });
})();

// Alte Werkstatt (werkstatt.js) hat für manche Garage-Fahrzeuge (z. B. S51 g1) keine Daten -> Absturz "W is undefined".
// Simsons gehen in die neue Werkstatt (Fotos statt Comic-Zeichnung), andere ohne Daten bekommen einen Hinweis.
(function () {
  const o = window.openWs; if (typeof o !== 'function') return;
  const MAP = {g1: 's51', g6: 'kr51', g9: 'sr50'};
  window.openWs = function () {
    try { if (typeof G !== 'undefined') { if (MAP[G.id] && window.W2) { W2.veh = MAP[G.id]; if (typeof w2save === 'function') w2save(); return go('w2') } if (typeof WS === 'undefined' || !WS[G.id]) { toast('Die Werkstatt für dieses Fahrzeug kommt in einem Update.'); return } } } catch (e) {}
    return o.apply(this, arguments);
  };
})();
// Namensnennung (CC BY 4.0) für den Rasentraktor-Sound auf der Eltern-Seite
(function () { const p = window.parents; if (typeof p !== 'function') return; window.parents = function () { return p.apply(null, arguments) + '<div class="card"><p class="m">Rasentraktor-Ton: „WWS Lawnmower“, Work With Sounds / Tekniska museet, Wikimedia Commons, Lizenz CC BY 4.0 (gekürzt und als Schleife bearbeitet).</p></div>' } })();
// Namensnennung (CC BY 4.0) für den Moped-Leerlauf der Start-Animation auf der Eltern-Seite
(function () { const p = window.parents; if (typeof p !== 'function') return; window.parents = function () { return p.apply(null, arguments) + '<div class="card"><p class="m">Moped-Ton Start-Animation: „WWS MotorcycleTOMOS Colibri special D-3“, Work With Sounds / Technical Museum of Slovenia, Wikimedia Commons, Lizenz CC BY 4.0 (gekürzt, Ein-/Ausblendung).</p></div>' } })();
