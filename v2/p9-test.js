'use strict';
// Selbsttest (nur mit #shot=p9test oder #shot=migtest): Ergebnis in document.title und #p9res
(async function () { try {
  const A = self.APP, M = window.SS_MIG, KEY = M.KEY, R = [], ok = (n, c, x) => R.push([n, !!c, c ? '' : (x === undefined ? '' : JSON.stringify(x))]);
  const deep = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const mig = /shot=migtest/.test(location.hash);
  if (mig) {
    const F = window.SS_FIXTURE_OLD, st = JSON.parse(localStorage.getItem(KEY)), bk = M.listBackups();
    ok('migtest: Info from=1 to=2', M.info.from === 1 && M.info.to === A.schema && M.info.ok, M.info);
    ok('migtest: Sicherungskopie vorhanden', bk.length === 1 && bk[0].indexOf('v1-nach-v2') > 0, bk);
    ok('migtest: Sicherung = alter Rohtext', localStorage.getItem(bk[0]) === JSON.stringify(F));
    ok('migtest: Schema gesetzt', st.schema === A.schema, st.schema);
    const diff = Object.keys(F).filter(k => k !== 'daily' && !deep(st[k], F[k]));
    ok('migtest: Stand vollständig erhalten (jedes alte Feld unverändert; App darf Felder ergänzen)', !diff.length, diff.map(k => [k, F[k], st[k]]));
    ok('migtest: Zusatzfeld erhalten', st.zukunft && st.zukunft.bleibt === true);
    ok('migtest: App-Zustand S hat Punkte 777 und Fahrzeuge', typeof S !== 'undefined' && S.points === 777 && S.w2.garage.length === 2 && S.name === 'Tester', typeof S !== 'undefined' ? S.points : 'S fehlt');
    // Neuere Schema-Version wird nicht angefasst
    const fut = {points: 5, done: {}, days: [], schema: 99}, r = SS.check({app: 'Schrauberschule', format: 1, schema: 99, state: fut}); ok('migtest: Stand von neuerer App wird abgelehnt', !r.ok);
  }
  // Datei + Code
  const f = SS.makeFile(); ok('Datei erzeugen', f && f.app === 'Schrauberschule' && f.schema === A.schema && f.check);
  const c = SS.check(JSON.parse(JSON.stringify(f))); ok('Datei prüfen ok', c.ok, c);
  const t = JSON.parse(JSON.stringify(f)); t.state.points += 1; ok('manipulierte Datei wird erkannt', !SS.check(t).ok);
  ok('fremde Datei wird erkannt', !SS.check({foo: 1}).ok && !SS.check(null).ok && !SS.check({app: 'Schrauberschule', state: {points: 'x'}}).ok);
  const old = {app: 'Schrauberschule', format: 1, schema: 1, state: {points: 10, days: [], done: {a: 1}, zusatz: 7}}; const co = SS.check(old); ok('alte Datei (Schema 1) wird migriert', co.ok && co.state.schema === A.schema && co.state.zusatz === 7 && co.state.done.a === 1, co);
  const code = await SS.makeCode(false); ok('Code erzeugt', /^SS[01]-[\w-]+-[0-9a-f]{4}$/.test(code), code && code.slice(0, 30));
  const back = await SS.readCode(code); const exp = JSON.parse(JSON.stringify(f.state)); delete exp.name;
  ok('Code: Rundlauf ergibt gleichen Stand (ohne Namen)', back.ok && deep(Object.assign({}, back.state, {schema: 0}), Object.assign({}, exp, {schema: 0})), back.err);
  ok('Code ohne Namen', back.ok && back.state.name === undefined);
  const bad = code.slice(0, 20) + (code[20] === 'A' ? 'B' : 'A') + code.slice(21); ok('beschädigter Code wird erkannt', !(await SS.readCode(bad)).ok);
  ok('Quatsch-Code wird erkannt', !(await SS.readCode('hallo')).ok);
  const url = 'https://x.example/v2/index.html#ss=' + code; ok('Code aus Link wird gelesen', (await SS.readCode(url)).ok);
  ok('QR-Bibliothek lokal da', typeof qrcode === 'function');
  let qr = null; try { const q = qrcode(0, 'L'); q.addData(code, 'Byte'); q.make(); qr = q.getModuleCount() } catch (e) { qr = String(e) } ok('QR passt für Code (Module ' + qr + ')', typeof qr === 'number', qr);
  ok('Code-Länge ' + code.length, true);
  const show = () => { const fail = R.filter(x => !x[1]); const out = R.map(x => (x[1] ? 'OK   ' : 'FEHL ') + x[0] + (x[2] ? ' ' + x[2] : '')).join('\n'); let pre = document.getElementById('p9res'); if (!pre) { pre = document.createElement('pre'); pre.id = 'p9res'; pre.style.cssText = 'position:fixed;inset:0;z-index:999;background:#000;color:#0f0;padding:10px;font-size:11px;white-space:pre-wrap;overflow:auto'; document.body.appendChild(pre) } pre.textContent = out; document.title = 'P9TEST ' + (R.length - fail.length) + ' OK, ' + fail.length + ' FEHL' };
  show();
  if (mig) { const bk = M.listBackups(), F = window.SS_FIXTURE_OLD;
    const sl = /slow=(\d+)/.exec(location.hash); if (sl) { try { await fetch('http://127.0.0.1:' + sl[1] + '/', {cache: 'no-store'}) } catch (e) {} } else await new Promise(r => setTimeout(r, 1500));
    const race = p => p; const ib = await race(SS.idbGet('backup-' + bk[0])); ok('migtest: Sicherung auch in IndexedDB', ib === JSON.stringify(F), ib === 'TIMEOUT' ? ib : 'abweichend');
    const is = await race(SS.idbGet('state')); ok('migtest: IndexedDB-Spiegel des Stands', is && is.raw && JSON.parse(is.raw).points === 777, is);
    show(); }
} catch (e) { const pre = document.createElement('pre'); pre.id = 'p9res'; pre.textContent = 'TESTFEHLER ' + e + ' ' + (e && e.stack); document.body.appendChild(pre) } })();
