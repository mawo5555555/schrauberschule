'use strict';
// Test-Hook (nur Ansicht): #shot=mhub | mveh_g3 | mx_<missions-id mit _>_<Schrittnummer>, z. B. mx_sim_fehler_1_1
(function () {
  const m = /shot=(\w+)/.exec(location.hash);
  if (!m) { view = 'home'; return render() }
  const k = m[1]; if (!/^(mhub|mhome|mveh_\w+|mx_.+_\d+)$/.test(k)) return;
  S.points = Math.max(S.points, 2500);
  MISSIONS.filter(x => !x.sim && !x.speech).slice(0, 40).forEach(x => { S.done[x.id] = 1 }); W2.orders = Math.max(W2.orders || 0, 1);
  if (k === 'mhome') { view = 'home'; return render() }
  if (k === 'mhub') { view = 'hub'; return render() }
  let v = /^mveh_(\w+)$/.exec(k); if (v) { openVeh(v[1]); vPanel('mis'); return }
  v = /^mx_(.+)_(\d+)$/.exec(k); const id = v[1].replace(/_/g, '-');
  start(id); if (run) { run.i = +v[2]; render() }
})();
