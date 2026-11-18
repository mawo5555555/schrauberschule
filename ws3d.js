// 3D-Werkstatt (Three.js r128): vereinfachte Simson S51 aus Grundkörpern, selbst gebaut.
// Koordinaten in Metern: x = nach vorn, y = nach oben, z+ = rechte Seite (Auspuff, Kickstarter), z− = linke Seite (Kette, Zündung).
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const W3 = {on: false};
function ws3dLoad(cb) {
  if (window.THREE) return cb(true);
  const s = document.createElement('script'); s.src = THREE_URL; s.crossOrigin = 'anonymous'; s.onload = () => cb(!!window.THREE); s.onerror = () => cb(false); document.head.appendChild(s);
}
function ws3dStart() {
  const el = $('#ws3'); if (!el) return;
  ws3dLoad(ok => { if (!ok || !$('#ws3') || !ws3dInit($('#ws3'))) { el.outerHTML = wsSvgScene(); return } const l = el.querySelector('.ws3load'); if (l) l.remove() });
}

// ---- Modell
function buildS51(T, hue) {
  const M = {
    paint: new T.MeshStandardMaterial({color: 0xe2611b, metalness: .25, roughness: .32}),
    chrome: new T.MeshPhongMaterial({color: 0xd8d8de, specular: 0xffffff, shininess: 110}),
    alu: new T.MeshStandardMaterial({color: 0xb8b8bd, metalness: .55, roughness: .42}),
    dark: new T.MeshStandardMaterial({color: 0x2a2a2d, metalness: .5, roughness: .5}),
    black: new T.MeshStandardMaterial({color: 0x161616, roughness: .75}),
    rubber: new T.MeshStandardMaterial({color: 0x121212, roughness: .95}),
    frame: new T.MeshStandardMaterial({color: 0x1d1d20, metalness: .35, roughness: .45}),
    ceramic: new T.MeshStandardMaterial({color: 0xf4f4f4, roughness: .25}),
    glass: new T.MeshPhongMaterial({color: 0xfff3cf, emissive: 0x2a2208, shininess: 160}),
    red: new T.MeshStandardMaterial({color: 0xb3261a, roughness: .5}),
    stand: new T.MeshStandardMaterial({color: 0xc8371f, roughness: .55, metalness: .2})
  };
  M.paint.color.setHSL(((22 + (hue || 0)) % 360) / 360, .78, .48); W3.paint = M.paint;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const mesh = (g, m, p, r) => { const o = new T.Mesh(g, m); if (p) o.position.set(...p); if (r) o.rotation.set(...r); o.castShadow = true; o.receiveShadow = true; return o };
  const tube = (a, b, r, m, seg = 12) => { const A = V(...a), B = V(...b), o = mesh(new T.CylinderGeometry(r, r, A.distanceTo(B), seg), m); o.position.copy(A).add(B).multiplyScalar(.5); o.quaternion.setFromUnitVectors(V(0, 1, 0), B.clone().sub(A).normalize()); return o };
  const bike = new T.Group(), parts = {};
  const part = (k, g, ax, amt, spin = 0) => { g.userData = {part: k, base: g.position.clone(), baseRot: g.rotation.clone(), ax: ax.normalize(), amt, spin}; g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.userData.part = k } }); parts[k] = g; return g };

  // Räder
  const wheel = x => { const g = new T.Group();
    g.add(mesh(new T.TorusGeometry(.27, .046, 14, 56), M.rubber));
    g.add(mesh(new T.TorusGeometry(.218, .013, 8, 56), M.chrome));
    g.add(mesh(new T.CylinderGeometry(.055, .055, .11, 20), M.alu, null, [Math.PI / 2, 0, 0]));
    const pts = []; for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, s = i % 2 ? .045 : -.045; pts.push(V(0, 0, s), V(Math.cos(a) * .212, Math.sin(a) * .212, 0)) }
    g.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({color: 0xc9c9ce})));
    g.position.set(x, .315, 0); return g };
  const front = wheel(.68); bike.add(front);
  const rear = part('rad', wheel(-.66), V(0, 0, 1), 0, 6); bike.add(rear);

  // Rahmen (Zentralrohr), Schwinge, Federbeine
  [[[.5, .86, 0], [-.04, .72, 0], .036], [[.5, .86, 0], [.2, .4, 0], .03], [[-.04, .72, 0], [-.04, .38, 0], .03]].forEach(t => bike.add(tube(t[0], t[1], t[2], M.frame)));
  [-.09, .09].forEach(z => { bike.add(tube([-.04, .72, 0], [-.62, .74, z], .022, M.frame)); bike.add(tube([-.03, .34, z], [-.66, .315, z], .022, M.frame));
    bike.add(tube([-.56, .33, z * 1.25], [-.42, .73, z * 1.2], .024, M.chrome)); bike.add(tube([-.53, .4, z * 1.25], [-.45, .64, z * 1.2], .031, M.black)) });
  bike.add(mesh(new T.CylinderGeometry(.042, .042, .16, 16), M.frame, [.51, .86, 0], [0, 0, -.42]));

  // Gabel, Lenker, Scheinwerfer, Kotflügel
  [-.085, .085].forEach(z => { bike.add(tube([.47, 1.0, z], [.6, .62, z], .019, M.chrome)); bike.add(tube([.6, .62, z], [.685, .32, z], .027, M.alu)) });
  bike.add(tube([.45, 1.03, -.34], [.45, 1.03, .34], .012, M.chrome)); bike.add(tube([.47, 1.0, -.08], [.45, 1.03, -.08], .013, M.chrome)); bike.add(tube([.47, 1.0, .08], [.45, 1.03, .08], .013, M.chrome));
  [-.3, .3].forEach(z => bike.add(tube([.45, 1.03, z - .05], [.45, 1.03, z + .05], .018, M.black)));
  const hl = mesh(new T.SphereGeometry(.085, 24, 16), M.chrome, [.6, .9, 0]); hl.scale.set(.75, 1, 1); bike.add(hl);
  bike.add(mesh(new T.CircleGeometry(.07, 24), M.glass, [.666, .9, 0], [0, Math.PI / 2, 0]));
  const ff = mesh(new T.TorusGeometry(.32, .028, 8, 30, Math.PI * .55), M.chrome, [.68, .315, 0], [0, 0, Math.PI * .2]); ff.scale.set(1, 1, 2.2); bike.add(ff);
  const rf = mesh(new T.TorusGeometry(.33, .03, 8, 30, Math.PI * .5), M.paint, [-.66, .315, 0], [0, 0, Math.PI * .45]); rf.scale.set(1, 1, 2.4); bike.add(rf);
  bike.add(mesh(new T.BoxGeometry(.05, .04, .1), M.red, [-.88, .66, 0]));

  // Tank, Sitzbank, Seitendeckel
  const tank = new T.Group(); const tb = mesh(new T.SphereGeometry(1, 32, 20), M.paint); tb.scale.set(.25, .11, .135); tank.add(tb);
  tank.add(mesh(new T.CylinderGeometry(.025, .025, .02, 16), M.chrome, [.04, .105, 0]));
  tank.position.set(.25, .85, 0); bike.add(part('tank', tank, V(0, 1, 0), .1));
  bike.add(mesh(new T.BoxGeometry(.58, .075, .2), M.black, [-.28, .83, 0]));
  [-.1, .1].forEach(z => bike.add(mesh(new T.BoxGeometry(.22, .15, .02), M.paint, [-.12, .64, z])));

  // Motor: Kurbelgehäuse, Polrad-Deckel (Zündung), Zylinder mit Rippen, Kopf, Zündkerze
  bike.add(mesh(new T.BoxGeometry(.32, .22, .22), M.alu, [0, .3, 0]));
  const zd = new T.Group(); zd.add(mesh(new T.CylinderGeometry(.1, .1, .04, 32), M.alu, null, [Math.PI / 2, 0, 0])); zd.add(mesh(new T.CylinderGeometry(.03, .03, .045, 6), M.dark, null, [Math.PI / 2, 0, 0]));
  zd.position.set(.03, .29, -.13); bike.add(part('zuend', zd, V(0, 0, -1), .14));
  const zyl = new T.Group(); zyl.add(mesh(new T.CylinderGeometry(.046, .046, .17, 20), M.dark, [0, .085, 0]));
  for (let i = 0; i < 7; i++) zyl.add(mesh(new T.BoxGeometry(.17, .011, .16), M.alu, [0, .015 + i * .022, 0]));
  zyl.add(mesh(new T.BoxGeometry(.16, .045, .15), M.alu, [0, .19, 0]));
  const kerze = new T.Group(); kerze.add(mesh(new T.CylinderGeometry(.013, .013, .016, 6), M.chrome, [0, .008, 0])); kerze.add(mesh(new T.CylinderGeometry(.009, .009, .045, 12), M.ceramic, [0, .035, 0]));
  kerze.add(mesh(new T.CylinderGeometry(.017, .014, .045, 12), M.black, [0, .07, 0])); kerze.add(tube([0, .09, 0], [-.12, .2, -.02], .005, M.black, 6));
  kerze.position.set(0, .212, 0); zyl.add(part('kerze', kerze, V(0, 1, 0), .13, 10));
  zyl.position.set(.07, .4, 0); zyl.rotation.z = -.28; bike.add(part('zyl', zyl, V(-.3, 1, 0), .16));

  // Vergaser und Luftfilter
  const verg = new T.Group(); verg.add(mesh(new T.CylinderGeometry(.028, .028, .08, 16), M.alu, null, [0, 0, Math.PI / 2])); verg.add(mesh(new T.CylinderGeometry(.026, .026, .045, 16), M.alu, [0, -.04, 0]));
  verg.add(tube([0, .03, 0], [.05, .2, 0], .004, M.black, 6)); verg.position.set(-.06, .46, 0); bike.add(part('verg', verg, V(-1, 0, 0), .14));
  const luft = new T.Group(); luft.add(mesh(new T.BoxGeometry(.15, .13, .18), M.black)); luft.add(mesh(new T.BoxGeometry(.155, .02, .185), M.dark, [0, .066, 0]));
  luft.position.set(-.2, .55, 0); bike.add(part('luft', luft, V(0, 1, 0), .16));

  // Auspuff (rechts)
  const aus = new T.Group(); aus.add(tube([.13, .5, .03], [.17, .3, .1], .02, M.chrome)); aus.add(tube([.17, .3, .1], [.05, .2, .14], .02, M.chrome));
  aus.add(tube([.05, .2, .14], [-.6, .3, .15], .05, M.chrome, 20)); aus.add(tube([-.6, .3, .15], [-.68, .31, .15], .02, M.chrome));
  bike.add(part('aus', aus, V(0, 0, 1), .2));

  // Kette und Ritzel (links)
  const kette = new T.Group(); kette.add(mesh(new T.CylinderGeometry(.04, .04, .012, 18), M.dark, [.02, .28, -.12], [Math.PI / 2, 0, 0])); kette.add(mesh(new T.CylinderGeometry(.09, .09, .01, 28), M.dark, [-.66, .315, -.12], [Math.PI / 2, 0, 0]));
  kette.add(tube([.02, .32, -.12], [-.66, .405, -.12], .008, M.dark, 6)); kette.add(tube([.02, .24, -.12], [-.66, .225, -.12], .008, M.dark, 6));
  bike.add(part('kette', kette, V(0, 0, -1), .08));

  // Kickstarter (rechts)
  bike.add(tube([-.02, .3, .13], [-.16, .2, .17], .012, M.chrome)); bike.add(mesh(new T.BoxGeometry(.05, .015, .03), M.black, [-.18, .19, .17]));

  bike.position.y = .1; // auf dem Montageständer
  bike.add(mesh(new T.BoxGeometry(.3, .29, .24), M.stand, [0, .045, 0]));
  return {bike, parts, M};
}
function texCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c }

// ---- Szene, Kamera, Steuerung
function ws3dInit(el) {
  const T = window.THREE; let r;
  try { r = new T.WebGLRenderer({antialias: true}); } catch (e) { return false }
  if (!r || !r.getContext()) return false;
  Object.assign(W3, {el, r, on: true, sel: null, o: {yaw: .75, pitch: .2, dist: 2.7, t: new T.Vector3(0, .55, 0)}, goal: {dist: 2.7, t: new T.Vector3(0, .55, 0)}});
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap; r.outputEncoding = T.sRGBEncoding;
  r.setSize(el.clientWidth, el.clientHeight); r.domElement.className = 'ws3c'; el.prepend(r.domElement);
  const sc = new T.Scene(); sc.background = new T.Color(0x26221e); sc.fog = new T.Fog(0x26221e, 4.5, 10); W3.sc = sc;
  W3.cam = new T.PerspectiveCamera(38, el.clientWidth / el.clientHeight, .03, 40);
  sc.add(new T.HemisphereLight(0xfff1dc, 0x3a3024, .7));
  const d = new T.DirectionalLight(0xffffff, .95); d.position.set(1.8, 3.4, 2.4); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, {left: -1.4, right: 1.4, top: 1.4, bottom: -1.4}); d.shadow.bias = -.0005; sc.add(d);
  const b2 = new T.DirectionalLight(0x9fbfff, .35); b2.position.set(-2.5, 1.6, -2); sc.add(b2);
  const lamp = new T.PointLight(0xffe2b0, .5, 6); lamp.position.set(0, 2.4, 0); sc.add(lamp);
  // Boden mit Fliesen, Wand mit Lochwand
  const fl = new T.CanvasTexture(texCanvas(256, 256, (x, w) => { x.fillStyle = '#4a4540'; x.fillRect(0, 0, w, w); x.fillStyle = '#403b36'; x.fillRect(0, 0, w / 2, w / 2); x.fillRect(w / 2, w / 2, w / 2, w / 2); x.strokeStyle = '#2e2a26'; x.lineWidth = 3; x.strokeRect(0, 0, w, w); x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, w); x.moveTo(0, w / 2); x.lineTo(w, w / 2); x.stroke() }));
  fl.wrapS = fl.wrapT = T.RepeatWrapping; fl.repeat.set(8, 8);
  const floor = new T.Mesh(new T.PlaneGeometry(14, 14), new T.MeshStandardMaterial({map: fl, roughness: .9})); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  const pw = new T.CanvasTexture(texCanvas(128, 128, (x, w) => { x.fillStyle = '#7a5a3a'; x.fillRect(0, 0, w, w); x.fillStyle = '#4a3420'; for (let i = 8; i < w; i += 16) for (let j = 8; j < w; j += 16) { x.beginPath(); x.arc(i, j, 2.5, 0, 7); x.fill() } }));
  pw.wrapS = pw.wrapT = T.RepeatWrapping; pw.repeat.set(10, 4);
  const wall = new T.Mesh(new T.PlaneGeometry(8, 3.2), new T.MeshStandardMaterial({map: pw, roughness: .95})); wall.position.set(0, 1.6, -1.7); wall.receiveShadow = true; sc.add(wall);
  // Werkzeug an der Wand (einfache Formen)
  const tm = new T.MeshStandardMaterial({color: 0x9a9aa0, metalness: .7, roughness: .35});
  [-1.2, -.9, -.6, .6, .9, 1.2].forEach((x, i) => { const g = new T.Mesh(new T.BoxGeometry(.035, .32 + i % 3 * .06, .02), tm); g.position.set(x, 1.55, -1.68); g.castShadow = true; sc.add(g);
    const h = new T.Mesh(new T.TorusGeometry(.04, .012, 8, 16), tm); h.position.set(x, 1.73 + i % 3 * .03, -1.68); sc.add(h) });
  const bench = new T.Mesh(new T.BoxGeometry(1.6, .08, .5), new T.MeshStandardMaterial({color: 0x6b4a2a, roughness: .8})); bench.position.set(1.7, .85, -1.3); bench.castShadow = bench.receiveShadow = true; sc.add(bench);

  const hue = (tuneOf(gst(G.id)).hue) || 0, B = buildS51(T, hue); W3.bike = B.bike; W3.parts = B.parts; sc.add(B.bike);
  W3.ray = new T.Raycaster();

  // Bedienung: 1 Finger drehen, 2 Finger zoomen, Mausrad zoomen, kurz tippen wählt ein Teil
  const cv = r.domElement, P = new Map(); let down = null, pinch = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); P.set(e.pointerId, {x: e.clientX, y: e.clientY}); if (P.size === 1) down = {x: e.clientX, y: e.clientY, t: performance.now(), moved: 0}; if (P.size === 2) { const [a, b] = [...P.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); down = null } });
  cv.addEventListener('pointermove', e => { const p = P.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (P.size === 1) { W3.goal.yaw = undefined; W3.o.yaw -= dx * .009; W3.o.pitch = Math.max(-.05, Math.min(1.25, W3.o.pitch + dy * .006)); if (down) down.moved += Math.abs(dx) + Math.abs(dy) }
    else if (P.size === 2) { const [a, b] = [...P.values()], n = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) W3.goal.dist = W3.o.dist = Math.max(.45, Math.min(4.5, W3.o.dist * pinch / n)); pinch = n } });
  const up = e => { if (down && P.size === 1 && down.moved < 8 && performance.now() - down.t < 450) ws3dPick(e); P.delete(e.pointerId); if (P.size < 2) pinch = 0; if (!P.size) down = null };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', e => { P.delete(e.pointerId); down = null });
  cv.addEventListener('wheel', e => { e.preventDefault(); W3.goal.dist = W3.o.dist = Math.max(.45, Math.min(4.5, W3.o.dist * (1 + e.deltaY * .001))) }, {passive: false});
  W3.rs = () => { if (!W3.on || !W3.el.isConnected) return; const w = W3.el.clientWidth, h = W3.el.clientHeight; W3.r.setSize(w, h); W3.cam.aspect = w / h; W3.cam.updateProjectionMatrix() };
  window.addEventListener('resize', W3.rs);
  const loop = () => { if (!W3.on) return; if (!W3.el.isConnected) { ws3dStop(); return } W3.raf = requestAnimationFrame(loop); ws3dTick() };
  loop(); return true;
}
function ws3dTick() {
  const T = window.THREE, o = W3.o, g = W3.goal, now = performance.now() / 1000;
  o.t.lerp(g.t, .08); if (Math.abs(o.dist - g.dist) > .001) o.dist += (g.dist - o.dist) * .08;
  if (g.yaw !== undefined) { o.yaw += (g.yaw - o.yaw) * .08; o.pitch += (g.pitch - o.pitch) * .08; if (Math.abs(g.yaw - o.yaw) < .002 && Math.abs(g.pitch - o.pitch) < .002) { g.yaw = undefined } }
  const sh = W3.shift || 0; W3.cs = (W3.cs || 0) + (sh - (W3.cs || 0)) * .08; const ew = W3.el.clientWidth, eh = W3.el.clientHeight;
  if (W3.cs > .001) W3.cam.setViewOffset(ew, eh, 0, eh * W3.cs, ew, eh); else W3.cam.clearViewOffset();
  const c = W3.cam; c.position.set(o.t.x + o.dist * Math.cos(o.pitch) * Math.sin(o.yaw), o.t.y + o.dist * Math.sin(o.pitch) + .05, o.t.z + o.dist * Math.cos(o.pitch) * Math.cos(o.yaw)); c.lookAt(o.t);
  Object.values(W3.parts).forEach(p => { const u = p.userData, f = u.f || 0; u.cf = (u.cf || 0) + (f - (u.cf || 0)) * .25;
    p.position.copy(u.base).addScaledVector(u.ax, u.amt * u.cf);
    if (u.spin) { if (p.userData.part === 'rad') p.rotation.z = -u.cf * u.spin; else p.rotation.y = u.cf * u.spin }
    const hl = W3.sel === u.part; p.traverse(m => { if (m.isMesh && m.material.emissive) m.material.emissive.setHex(hl ? (Math.sin(now * 6) > 0 ? 0x553300 : 0x221100) : (m.material.userData.em ?? (m.material.userData.em = m.material.emissive.getHex()))) }) });
  W3.r.render(W3.sc, c);
}
function ws3dPick(e) {
  const b = W3.r.domElement.getBoundingClientRect(), T = window.THREE; W3.ray.setFromCamera(new T.Vector2((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1), W3.cam);
  const hit = W3.ray.intersectObject(W3.bike, true).find(h => h.object.userData.part);
  if (!hit) { tone(300, .04, 0, 'sine', .03); return }
  const i = WS[G.id].spots.findIndex(s => s.id === hit.object.userData.part); if (i >= 0) wsOpen(i);
}
// Blickwinkel je Teil: yaw 0 = von rechts (Auspuffseite), π = von links (Kettenseite), pitch = von oben
const VIEW3D = {kerze: [.45, .45, .75], zyl: [.3, .25, 1.05], verg: [.15, .2, .95], luft: [.05, .3, 1.1], aus: [.1, .12, 1.7], kette: [Math.PI - .1, .15, 1.6], zuend: [Math.PI - .35, .15, 1], rad: [-.55, .2, 1.5], tank: [.55, .55, 1.2]};
function ws3dFocus(k) {
  if (!W3.on) return; const T = window.THREE; W3.sel = k;
  if (!k) { W3.goal.t.set(0, .55, 0); W3.goal.dist = 2.7; W3.goal.yaw = .75; W3.goal.pitch = .2; W3.shift = 0; return }
  const p = W3.parts[k], v = new T.Vector3(); p.getWorldPosition(v);
  if (k === 'aus') v.set(-.2, .38, .15); if (k === 'kette') v.set(-.32, .42, -.12); if (k === 'rad') v.set(-.66, .42, 0);
  const [yaw, pitch, dist] = VIEW3D[k] || [.75, .25, 1.2];
  W3.goal.t.copy(v); W3.goal.dist = dist; W3.goal.yaw = W3.o.yaw + Math.atan2(Math.sin(yaw - W3.o.yaw), Math.cos(yaw - W3.o.yaw)); W3.goal.pitch = pitch; W3.shift = .2;
}
// Beim Schrauben: Teil bewegt sich im Modell mit (f = 0..1 Fortschritt, dir −1 = lösen, +1 = festziehen)
const JOB3D = {kerze: 'kerze', luft: 'luft', kette: 'kette', reifen: 'rad'}, SLOT3D = {zyl: 'zyl', verg: 'verg', aus: 'aus', luft: 'luft', zuend: 'zuend', rit: 'kette'};
function ws3dTurn(f, dir) {
  if (!W3.on || !G.job) return; const k = G.job.slot ? SLOT3D[G.job.slot] : JOB3D[G.job.k]; if (!k || !W3.parts[k]) return;
  W3.parts[k].userData.f = dir < 0 ? f : 1 - f; W3.sel = k;
}
function ws3dOut(on) { if (!W3.on || !G.job) return; const k = G.job.slot ? SLOT3D[G.job.slot] : JOB3D[G.job.k]; if (k && W3.parts[k]) W3.parts[k].userData.f = on ? 1 : 0 }
function ws3dReset() { if (!W3.on) return; Object.values(W3.parts).forEach(p => p.userData.f = 0) }
function ws3dPaint(h) { if (W3.on && W3.paint) { W3.paint.color.setHSL(((22 + h) % 360) / 360, .78, .48); Object.values(W3.parts).forEach(p => p.traverse(m => { if (m.isMesh && m.material.name === '' && p.userData.part === 'tank' && m.material.color && m.geometry.type === 'SphereGeometry') m.material.color.copy(W3.paint.color) })) } }
function ws3dStop() { if (!W3.on) return; W3.on = false; cancelAnimationFrame(W3.raf); window.removeEventListener('resize', W3.rs); try { W3.r.dispose(); W3.r.forceContextLoss() } catch (e) {} }
