'use strict';
// Prüfstand-Zeichnungen (Seitenansicht, Fahrzeug fährt nach LINKS, Ursprung = Hinterachse, y nach unten, 1 m = 215 Einheiten).
// AUSTAUSCHBAR: window.PSTART.draw[<fahrzeug-id>](o) liefert den SVG-Inhalt eines Fahrzeugs (o = {R, wb (Einheiten), col, ...}).
// Soll später ein Foto verwendet werden: PSTART.draw.s51 = o => '<g class="vh"><image href="..." x=".." y=".." width=".." height=".."/>'
// + zwei Raeder-Overlays PSTART.wheel(o.R, 'rw') bei (0 0) und PSTART.wheel(o.R, 'fw') bei (-o.wb 0) (Klassen rw-s, rw-t, rw-b / fw-... drehen/verwischen).
// PSTART.anch[id] = Gurt-Ankerpunkte {fr, ba}; die Auspuffmündung steht in VEH[id].ex (pruefstand.js).
// Maße (ca.): Radstand 1175 mm, Rad Ø ca. 580 mm (Reifen 2,75-16, Felge 16 Zoll), Sitzhöhe ca. 780 mm, Lenker ca. 1050 mm.
(function () {
  const T = (x) => (+x).toFixed(1);
  const cos = (d) => Math.cos(d * Math.PI / 180), sin = (d) => Math.sin(d * Math.PI / 180);
  const pol = (cx, cy, r, a) => [cx + r * cos(a), cy + r * sin(a)];
  const arc = (cx, cy, r, a0, a1) => { const p0 = pol(cx, cy, r, a0), p1 = pol(cx, cy, r, a1); return `M${T(p0[0])} ${T(p0[1])} A${r} ${r} 0 0 1 ${T(p1[0])} ${T(p1[1])}` };
  const K = '#0b0f15';

  // ---------- Verläufe (werden in <defs> der Szene eingefügt) ----------
  const defs = () => `
    <radialGradient id="pa-tire" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#2b3038"/><stop offset=".74" stop-color="#3a4049"/><stop offset=".86" stop-color="#181b20"/><stop offset=".96" stop-color="#0c0e11"/><stop offset="1" stop-color="#000"/></radialGradient>
    <linearGradient id="pa-alu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4dae2"/><stop offset=".5" stop-color="#8f99a6"/><stop offset="1" stop-color="#4b535e"/></linearGradient>
    <linearGradient id="pa-cyl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8492"/><stop offset=".45" stop-color="#4c5560"/><stop offset="1" stop-color="#2a3037"/></linearGradient>
    <linearGradient id="pa-seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f58"/><stop offset=".3" stop-color="#23272e"/><stop offset="1" stop-color="#0e1013"/></linearGradient>
    <linearGradient id="pa-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a636f"/><stop offset=".5" stop-color="#2e353e"/><stop offset="1" stop-color="#171b21"/></linearGradient>
    <linearGradient id="pa-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset=".5" stop-color="#ffe9a8"/><stop offset="1" stop-color="#c9a24a"/></linearGradient>
    <linearGradient id="pa-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a5c"/><stop offset="1" stop-color="#9c1710"/></linearGradient>
    <linearGradient id="pa-sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>${window.P8D ? P8D.defsSvg() : ''}`;

  // ---------- Räder ----------
  // Moped-Rad 2,75-16: Reifen deutlich dicker (ca. 17 von 62 Einheiten) als die Felge (ca. 3 Einheiten Ring), 36 Speichen, Vollnabe (Trommelbremse).
  // Klassen: ${id}-t (Profil, dreht), ${id}-s (Speichen, drehen), ${id}-b (Unschärfe bei hoher Drehzahl). Genau so erwartet es pruefstand.js.
  function wheel(R, id) {
    const rr = R - 18.5, n = 36; let sp = '', tr = '', sp2 = '';
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d = (i % 2 ? .36 : -.36); sp += `<line x1="${T(9 * Math.cos(a))}" y1="${T(9 * Math.sin(a))}" x2="${T((rr - 1) * Math.cos(a + d))}" y2="${T((rr - 1) * Math.sin(a + d))}"/>` }
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; sp2 += `<line x1="${T(9 * Math.cos(a))}" y1="${T(9 * Math.sin(a))}" x2="${T((rr - 1) * Math.cos(a))}" y2="${T((rr - 1) * Math.sin(a))}" stroke="#8a94a1"/>` }
    for (let i = 0; i < 48; i++) { const a = i / 48 * 360; tr += `<rect x="${R - 5.2}" y="-1.5" width="5.2" height="3" rx=".6" transform="rotate(${a.toFixed(1)})"/>` }
    return `<circle r="${R}" fill="url(#pa-tire)" stroke="#000" stroke-width="1.4"/>
      <circle r="${R - 3}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1"/>
      <path d="${arc(0, 0, R - 8.5, 195, 285)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2.4" stroke-linecap="round"/>
      <circle r="${R - 15.6}" fill="none" stroke="#0a0c0f" stroke-width="1.6"/>
      <circle r="${rr + 1}" fill="#0e1218" fill-opacity=".34"/>
      <g class="${id}-t" fill="#07090b" fill-opacity=".8">${tr}</g>
      <g class="${id}-s" fill="none" stroke="#c0c8d2" stroke-width=".7" stroke-linecap="round">${sp}${sp2}<rect x="${rr - 5}" y="-1.6" width="3.2" height="3.2" fill="#e0402f" stroke="none"/></g>
      <circle r="${rr}" fill="none" stroke="#7d8794" stroke-width="1.2"/><circle r="${rr + 1.6}" fill="none" stroke="url(#pst-ch)" stroke-width="3.4"/><circle r="${rr + 3.8}" fill="none" stroke="#59616c" stroke-width="1"/>
      <g class="${id}-b" opacity="0"><circle r="${rr}" fill="url(#pst-bl)"/><g class="${id}-bs" fill="none" stroke="#d5dde8" stroke-linecap="round"><circle r="${R * .5}" stroke-width="${R * .55}" stroke-opacity=".12" stroke-dasharray="${R * .9} ${R * .6}"/></g></g>
      <circle r="15.5" fill="url(#pa-alu)" stroke="#2d343d" stroke-width="1.4"/><circle r="12" fill="none" stroke="#3c444f" stroke-width="1"/><circle r="9" fill="#a9b2be" stroke="#3c444f" stroke-width="1"/><circle r="4.4" fill="#e3e8ee" stroke="#3c444f" stroke-width="1"/>
      <path d="${arc(0, 0, 13.6, 200, 260)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round"/>`;
  }
  // Fahrrad-Rad (Klapprad 20", Reifen 20 x 1,75): schlanker Reifen, Alufelge, viele dünne Speichen
  function wheelBike(R, id) {
    const rr = R - 10, n = 32; let sp = '', tr = '';
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d = (i % 2 ? .3 : -.3); sp += `<line x1="${T(4 * Math.cos(a))}" y1="${T(4 * Math.sin(a))}" x2="${T((rr - 1) * Math.cos(a + d))}" y2="${T((rr - 1) * Math.sin(a + d))}"/>` }
    for (let i = 0; i < 40; i++) { const a = i / 40 * 360; tr += `<rect x="${R - 4}" y="-1" width="4" height="2" transform="rotate(${a.toFixed(1)})"/>` }
    return `<circle r="${R - 4.2}" fill="none" stroke="#0b0d10" stroke-width="8.6"/><circle r="${R - 7.6}" fill="none" stroke="#2c323a" stroke-width="1.2"/><path d="${arc(0, 0, R - 2.2, 200, 280)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.4" stroke-linecap="round"/>
      <g class="${id}-t" fill="#2b3139">${tr}</g>
      <g class="${id}-s" fill="none" stroke="#c7cfd9" stroke-width=".7">${sp}<rect x="${rr - 4}" y="-1.5" width="3" height="3" fill="#d63b2c" stroke="none"/></g>
      <circle r="${rr}" fill="none" stroke="url(#pst-ch)" stroke-width="2.8"/><circle r="${rr - 2}" fill="none" stroke="#6e7886" stroke-width=".8"/>
      <g class="${id}-b" opacity="0"><circle r="${rr}" fill="url(#pst-bl)"/><g class="${id}-bs" fill="none" stroke="#d5dde8" stroke-linecap="round"><circle r="${R * .55}" stroke-width="${R * .6}" stroke-opacity=".12" stroke-dasharray="${R * .9} ${R * .6}"/></g></g>
      <circle r="6.5" fill="url(#pa-alu)" stroke="#3a424d" stroke-width="1.2"/><circle r="2.8" fill="#e3e8ee"/>`;
  }

  // ---------- Hilfsformen ----------
  const paint = (c) => `fill="${c}" stroke="${K}" stroke-width="1.5" stroke-linejoin="round"`;
  const gloss = (d, o) => `<path d="${d}" fill="url(#pst-pt)" stroke="none" opacity="${o || .8}"/>`;
  const tube = (d, w, col, hi) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 2.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>${hi ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${Math.max(1, w * .28)}" stroke-linecap="round" transform="translate(${-w * .18} ${-w * .22})"/>` : ''}`;
  const coil = (x0, y0, x1, y1, n, w) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; let d = `M${T(x0)} ${T(y0)}`; for (let i = 1; i <= n * 2; i++) { const u = i / (n * 2), s = (i % 2 ? 1 : -1) * w; d += `L${T(x0 + dx * u + nx * s)} ${T(y0 + dy * u + ny * s)}` } return d };
  const lamp = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#pst-ch)" stroke="#2b323b" stroke-width="1.6"/><ellipse cx="${cx - 1.5}" cy="${cy}" rx="${rx * .68}" ry="${ry * .78}" fill="url(#pa-glass)" stroke="#6b5a2c" stroke-width="1"/><ellipse cx="${cx - 2}" cy="${cy - ry * .25}" rx="${rx * .35}" ry="${ry * .32}" fill="#fff" opacity=".6"/>`;
  const shadeUnder = (d) => `<path d="${d}" fill="url(#pa-sh)" stroke="none"/>`;

  // ---------- Fahrzeug-Teile ----------
  function fenderArc(cx, cy, r, a0, a1, col, w) { const d = arc(cx, cy, r, a0, a1); return `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 2.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="${arc(cx, cy, r + w * .22, a0 + 4, a1 - 4)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="${w * .22}" stroke-linecap="round"/>` }

  // Motor M541: Kurbelgehäuse, rundes Lichtmaschinen-Gehäuse, geneigter Rippen-Zylinder mit Kopf und Kerze, Vergaser, Schalthebel
  function engine(ccm, big, pick) {
    const sw = (x, y, r) => (window.P8D ? P8D.screwEl(x, y, r, pick) : '');   // Eloxal-Schrauben (p8d.js), Farbe aus der Teilewahl
    const k = Math.max(.95, Math.min(1.3, (ccm || 50) / 50));
    let fins = '', hf = '';
    for (let i = 0; i < 6; i++) { const x = 8 + i * 4.8 * k, h = 16.5 - i * .35; fins += `<rect x="${T(x)}" y="${-h}" width="3.2" height="${2 * h}" rx="1" fill="#8d97a4" stroke="#242a31" stroke-width=".7"/>` }
    const cylLen = 8 + 6 * 4.8 * k;
    for (let i = 0; i < 4; i++) hf += `<rect x="${T(cylLen + 1 + i * 4.6)}" y="-14.5" width="2.6" height="29" rx="1" fill="#9aa4b1" stroke="#242a31" stroke-width=".7"/>`;
    return `
      <path d="M-136 -6 C-140 18 -124 38 -98 38 L-60 36 C-48 24 -52 2 -62 -8 C-86 -20 -124 -18 -136 -6Z" fill="url(#pa-alu)" stroke="#2b323b" stroke-width="1.6"/>
      <path d="M-134 -4 C-120 -16 -86 -18 -64 -8" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>
      <path d="M-62 -8 C-48 2 -46 20 -60 36 L-34 30 C-30 16 -34 0 -44 -8Z" fill="url(#pa-alu)" stroke="#2b323b" stroke-width="1.4"/>
      <circle cx="-102" cy="14" r="20" fill="url(#pa-cyl)" stroke="#20262d" stroke-width="1.6"/><circle cx="-102" cy="14" r="14" fill="none" stroke="#a4aebb" stroke-width="1.2"/><circle cx="-102" cy="14" r="6" fill="#b9c2ce" stroke="#2b323b" stroke-width="1.2"/>${[30, 90, 150, 210, 270, 330].map(a => sw((-102 + 16.6 * cos(a)).toFixed(1), (14 + 16.6 * sin(a)).toFixed(1), 2.7)).join('')}${sw(-124, -4, 2.4)}${sw(-72, 30, 2.4)}${sw(-50, 18, 2.2)}
      <g stroke="#a4aebb" stroke-width=".9" opacity=".7"><line x1="-102" y1="-5" x2="-102" y2="3"/><line x1="-102" y1="25" x2="-102" y2="33"/><line x1="-121" y1="14" x2="-113" y2="14"/><line x1="-91" y1="14" x2="-83" y2="14"/></g>
      <g transform="translate(-122 -2) rotate(228)"><rect x="2" y="-17" width="8" height="34" rx="2" fill="#6a7482" stroke="#242a31" stroke-width="1.2"/>${sw(6, -12, 2.2)}${sw(6, 12, 2.2)}
        <rect x="9" y="-15" width="${T(cylLen - 6)}" height="30" fill="url(#pa-cyl)" stroke="#242a31" stroke-width="1"/>${fins}
        <path d="M${T(cylLen)} -15 L${T(cylLen + 22)} -12 L${T(cylLen + 22)} 12 L${T(cylLen)} 15Z" fill="#59636f" stroke="#242a31" stroke-width="1.2"/>${hf}${sw(T(cylLen + 2), -11, 2.3)}${sw(T(cylLen + 2), 11, 2.3)}${sw(T(cylLen + 19), -11, 2.3)}${sw(T(cylLen + 19), 11, 2.3)}
        <g transform="translate(${T(cylLen + 8)} 0)"><rect x="-2.2" y="14" width="4.4" height="9" fill="#e9eef3" stroke="#242a31" stroke-width=".8"/><rect x="-3.2" y="22" width="6.4" height="6" rx="1.4" fill="#16191e" stroke="#000" stroke-width=".8"/></g></g>
      <path d="M-96 -22 L-80 -23 L-79 -11 L-96 -10Z" fill="url(#pa-alu)" stroke="#2b323b" stroke-width="1.2"/><rect x="-92" y="-30" width="8" height="8" rx="1.6" fill="#c8d0da" stroke="#2b323b" stroke-width="1"/><path d="M-80 -17 C-70 -17 -66 -22 -60 -26" fill="none" stroke="#16191e" stroke-width="6" stroke-linecap="round"/>
      <path d="M-88 34 L-130 42" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M-88 34 L-130 42" stroke="#9aa4b0" stroke-width="3.4" stroke-linecap="round"/><rect x="-142" y="36" width="14" height="9" rx="3" fill="#16191e" stroke="#000" stroke-width=".8" transform="rotate(10 -135 40)"/>`;
  }

  function exhaust() {
    // Krümmer vom Zylinder nach vorn unten, dann nach hinten zum Topf (Endrohr bei x=46, y=35, wie VEH.ex)
    const pipe = 'M-151 -7 C-170 8 -164 38 -136 46 L-96 50 L-66 46';
    return `${tube(pipe, 7, '#9aa4b0', true)}
      <path d="M-66 34 C-30 31 14 29 40 30 C48 31 51 33 51 36 C51 40 48 42 40 43 C14 46 -30 52 -66 52 C-72 52 -74 40 -66 34Z" fill="url(#pst-ch)" stroke="#2f3742" stroke-width="1.5"/>
      <path d="M-60 37 C-20 34 20 33 44 33" stroke="#fff" stroke-width="2" opacity=".7" fill="none" stroke-linecap="round"/><path d="M-62 49 C-20 47 20 44 44 42" stroke="#000" stroke-width="2" opacity=".25" fill="none"/>
      <path d="M-10 31 L-8 51 M26 29 L28 45" stroke="#2f3742" stroke-width="2.4" opacity=".75"/>
      <ellipse cx="50" cy="36" rx="2.6" ry="5.6" fill="#0b0f15"/>
      <path d="M-166 -2 C-172 10 -170 28 -156 38" stroke="#c9a23a" stroke-opacity=".0" fill="none"/>
      <path d="M-54 44 L-48 60 M18 38 L12 56" stroke="${K}" stroke-width="2.4" opacity=".0"/>`;
  }

  // Teleskopgabel: Standrohre mit Faltenbälgen, Tauchrohre verchromt; Achse bei (fx,0)
  function fork(fx, top) {
    const ux = (top[0] - fx), uy = top[1], L = Math.hypot(ux, uy), nx = ux / L, ny = uy / L; // Einheitsvektor nach oben/hinten
    const at = (t) => [fx + nx * t, ny * t];
    const a = at(0), b = at(50), c = at(L);
    let bel = ''; for (let i = 0; i < 6; i++) { const p = at(54 + i * 6); bel += `<line x1="${T(p[0] - 5)}" y1="${T(p[1])}" x2="${T(p[0] + 5)}" y2="${T(p[1])}" stroke="#000" stroke-opacity=".5" stroke-width="1"/>` }
    return `${tube(`M${T(a[0])} ${T(a[1])} L${T(b[0])} ${T(b[1])}`, 7, '#c9d1da', true)}
      ${tube(`M${T(b[0])} ${T(b[1])} L${T(c[0])} ${T(c[1])}`, 8.5, '#262c34', true)}${bel}
      <circle cx="${T(a[0])}" cy="0" r="4.6" fill="#dfe5ec" stroke="#3a424d" stroke-width="1.2"/>`;
  }

  // ---------- S51 und Verwandte (Mokick/Moped) ----------
  // spec: tank (Pfadstring), cover ('rund' | 'eck' | 'kasten'), lampe ('s51'|'s50'|'alt'), fenderChrome, rahmen ('press'|'rohr')
  const TANK = {
    s51: 'M-118 -99 C-119 -114 -124 -124 -140 -127 C-158 -130 -176 -128 -187 -119 L-189 -106 C-176 -101 -142 -98 -118 -99Z',
    s50: 'M-118 -99 C-120 -112 -128 -119 -144 -121 C-162 -123 -178 -121 -188 -114 L-190 -105 C-176 -100 -142 -98 -118 -99Z',
    star: 'M-114 -99 C-118 -118 -130 -127 -148 -128 C-166 -129 -182 -125 -190 -115 L-190 -104 C-178 -99 -140 -97 -114 -99Z',
    hab: 'M-116 -99 C-118 -116 -128 -126 -146 -129 C-164 -131 -180 -126 -190 -116 L-191 -104 C-176 -99 -142 -97 -116 -99Z'
  };
  function drawMopedArt(o, spec) {
    const R = o.R, wb = o.wb, fx = -wb, col = o.col, ftop = [-194, -122];
    const tank = TANK[spec.tank], seatTop = -106;
    const cover = spec.cover === 'rund'
      ? `<path d="M-112 -92 L-34 -90 C-24 -80 -22 -58 -36 -46 C-62 -36 -98 -38 -110 -52 C-116 -64 -115 -80 -112 -92Z" ${paint(col)}/>${gloss('M-112 -92 L-34 -90 C-24 -80 -22 -58 -36 -46 C-62 -36 -98 -38 -110 -52Z', .6)}<path d="M-100 -80 C-70 -86 -50 -84 -40 -76" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6"/><circle cx="-74" cy="-64" r="3.2" fill="url(#pst-ch)" stroke="${K}" stroke-width=".8"/>${shadeUnder('M-110 -52 C-98 -38 -62 -36 -36 -46 L-36 -52 L-108 -56Z')}`
      : spec.cover === 'eck'
        ? `<path d="M-110 -92 L-40 -90 L-34 -48 L-104 -44Z" ${paint('#2d343d')}/><path d="M-104 -84 L-44 -82" stroke="#7a8592" stroke-width="1.4" opacity=".6"/><rect x="-86" y="-72" width="28" height="12" rx="2" fill="none" stroke="#7a8592" stroke-width="1"/>`
        : `<path d="M-110 -92 L-34 -90 L-30 -52 C-40 -40 -96 -40 -108 -50Z" ${paint(col)}/>${gloss('M-110 -92 L-34 -90 L-30 -52 C-40 -40 -96 -40 -108 -50Z', .55)}`;
    const frame = spec.rahmen === 'rohr'
      ? tube('M-194 -118 L-150 -78 L-124 -50 L-66 -30 L-8 -6', 7, '#2a313a', true) + tube('M-150 -80 L-112 -96 L-20 -96', 6, '#2a313a', true) + tube('M-118 -98 L-30 -88 L-8 -6', 5, '#2a313a')
      : tube('M-196 -116 C-170 -92 -140 -72 -122 -56', 9, col, false) + gloss('M-198 -120 C-172 -96 -142 -76 -122 -60 L-124 -50 C-142 -66 -172 -88 -196 -110Z', .5) + tube('M-30 -90 L-10 -6', 5, '#2a313a');
    const guard = 'M-80 6 C-52 -8 -24 -14 -8 -15 L-6 -9 C-26 -8 -54 0 -76 14Z';
    const lampSvg = spec.lampe === 's51'
      ? lamp(-222, -128, 12, 17) + `<path d="M-212 -146 C-204 -152 -192 -152 -186 -146 L-188 -140 L-210 -140Z" ${paint('#aab3bf')}/>${gloss('M-212 -146 C-204 -152 -192 -152 -186 -146', .6)}<circle cx="-199" cy="-146" r="5.6" fill="url(#pa-glass)" stroke="${K}" stroke-width="1"/><path d="M-203 -147 L-196 -145" stroke="#c0392b" stroke-width="1.3"/>`
      : lamp(-220, -130, 11, 15) + `<path d="M-210 -144 C-200 -150 -190 -148 -186 -142 L-190 -138 L-208 -138Z" ${paint('#9aa5b2')}/>`;
    const fenderCol = spec.fenderChrome ? '#cfd7e0' : col;
    return `<g class="vh">
      <g class="rwh">${wheel(R, 'rw')}</g>
      <g class="fwh" transform="translate(${T(fx)} 0)">${wheel(R, 'fw')}</g>
      ${fenderArc(0, 0, R + 7, 200, 345, fenderCol, 7)}
      ${fenderArc(fx, 0, R + 6, 188, 330, fenderCol, 6.4)}
      <path d="M${T(fx + 3)} ${-R - 5} L${T(fx + 10)} -80" stroke="${K}" stroke-width="3" stroke-linecap="round" opacity=".0"/>
      ${exhaust()}
      ${frame}
      <rect x="-142" y="22" width="40" height="8" rx="3" fill="#222831" stroke="${K}" stroke-width="1" opacity="0"/>
      ${engine(o.ccm, 0, o.pick)}
      ${tube('M-100 10 L-4 -4', 9, '#2f363f', true)}
      <path d="M-98 6 L-6 -8 L-3 8 L-98 24Z" fill="url(#pa-steel)" stroke="${K}" stroke-width="1.4"/>
      <path d="M-92 9 L-10 -4" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/><circle cx="-96" cy="15" r="5" fill="url(#pa-alu)" stroke="${K}" stroke-width="1"/>
      <circle cx="0" cy="0" r="17" fill="url(#pa-alu)" stroke="#2d343d" stroke-width="1.4"/><g stroke="#4b535e" stroke-width="2">${Array.from({length: 28}, (_, i) => `<line x1="17" y1="0" x2="19.6" y2="0" transform="rotate(${i * 360 / 28})"/>`).join('')}</g><circle cx="0" cy="0" r="9" fill="none" stroke="#586270" stroke-width="1"/>
      <circle cx="-82" cy="16" r="6.4" fill="url(#pa-alu)" stroke="#2d343d" stroke-width="1.2"/>
      <path d="M-82 9.6 L-1 -17 M-82 22.4 L-1 17" stroke="#14171c" stroke-width="2.6" stroke-dasharray="2.6 1.6"/>
      <path d="${guard}" fill="#252b33" stroke="${K}" stroke-width="1.2"/><path d="M-76 6 C-52 -4 -28 -10 -10 -12" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" fill="none"/>
      <!-- Federbein hinten -->
      <path d="M-2 -6 L-14 -38" stroke="${K}" stroke-width="7.4" stroke-linecap="round"/><path d="M-2 -6 L-14 -38" stroke="url(#pst-ch)" stroke-width="5" stroke-linecap="round"/>
      <path d="${coil(-14, -38, -32, -78, 7, 4.6)}" fill="none" stroke="${K}" stroke-width="3.2" stroke-linejoin="round"/><path d="${coil(-14, -38, -32, -78, 7, 4.6)}" fill="none" stroke="#9aa4b0" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M-30 -74 L-34 -86" stroke="#1a1f26" stroke-width="7.4" stroke-linecap="round"/><circle cx="-34" cy="-86" r="3.2" fill="#cdd5de" stroke="${K}"/><circle cx="-2" cy="-6" r="3.6" fill="#cdd5de" stroke="${K}"/>
      ${cover}
      <!-- Sitzbank -->
      <g transform="translate(0 -88) scale(1 ${window.P8D ? P8D.seatK(o.pick) : 1}) translate(0 88)"><path d="M-122 -96 C-122 -108 -114 -110 -98 -109 L10 -106 C34 -105 48 -102 50 -94 L48 -88 L-116 -88Z" fill="url(#pa-seat)" stroke="${K}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
      <path d="M-112 -105 L10 -102 C30 -101 42 -99 46 -96" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.6" vector-effect="non-scaling-stroke"/></g><path d="M-116 -88 L48 -88" stroke="#8a95a1" stroke-width="2.2"/>
      <path d="M-128 -98 L-118 -98 L-122 -88 L-130 -88Z" fill="#1a1f26" stroke="${K}" stroke-width="1"/>
      <path d="${tank}" ${paint(col)}/>${gloss(tank, .7)}<path d="M-186 -117 C-170 -124 -148 -125 -126 -118" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>${shadeUnder('M-189 -106 C-176 -101 -142 -98 -118 -99 L-118 -104 C-140 -103 -176 -106 -189 -111Z')}
      <path d="M-152 -127 L-152 -131 L-144 -131 L-144 -127Z" fill="url(#pst-ch)" stroke="#3a424d" stroke-width=".9"/>
      <!-- Rücklicht, Schutzblech hinten -->
      <path d="M52 -52 L66 -50 L66 -32 L54 -30Z" fill="url(#pa-red)" stroke="${K}" stroke-width="1.3"/><path d="M56 -48 L62 -47" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/>
      <!-- Fußraste -->
      <path d="M-62 26 L-34 28" stroke="${K}" stroke-width="5" stroke-linecap="round"/><rect x="-70" y="24" width="24" height="7" rx="3" fill="#15181d" stroke="#000" stroke-width="1"/>
      <!-- Vordergabel, Lampe, Lenker -->
      ${fork(fx, ftop)}
      ${lampSvg}
      <path d="M-194 -126 L-187 -141" stroke="${K}" stroke-width="7.4" stroke-linecap="round"/><path d="M-194 -126 L-187 -141" stroke="url(#pst-ch)" stroke-width="5" stroke-linecap="round"/>
      <path d="M-186 -143 C-180 -152 -172 -156 -162 -156" fill="none" stroke="${K}" stroke-width="6.2" stroke-linecap="round"/><path d="M-186 -143 C-180 -152 -172 -156 -162 -156" fill="none" stroke="url(#pst-ch)" stroke-width="3.6" stroke-linecap="round"/>
      <rect x="-172" y="-160" width="22" height="8" rx="4" fill="#1a1f26" stroke="#000" stroke-width="1"/><path d="M-170 -158 L-152 -158" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/>
      <path d="M-170 -152 L-190 -148" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/><path d="M-170 -152 L-190 -148" stroke="#c0c8d2" stroke-width="1.8" stroke-linecap="round"/>
    </g>`;
  }

  // ---------- Roller (Schwalbe KR51/2, SR50) ----------
  function drawRollerArt(o, sw) {
    const R = o.R, wb = o.wb, fx = -wb, col = o.col, ftop = [-198, -126];
    const body = sw
      ? `M-172 12 L-69 12 A71 71 0 0 1 66 -25 C71 -46 66 -78 50 -98 C20 -108 -60 -108 -118 -104 C-150 -102 -164 -96 -168 -80 C-174 -50 -174 -20 -172 12Z`
      : `M-172 12 L-69 12 A71 71 0 0 1 66 -25 L70 -60 C68 -80 60 -94 44 -100 L-40 -108 L-116 -106 C-150 -104 -164 -96 -168 -80 C-174 -50 -174 -20 -172 12Z`;
    const leg = sw
      ? 'M-178 12 C-188 -12 -204 -60 -202 -126 L-182 -120 C-180 -90 -172 -50 -154 12Z'
      : 'M-178 12 C-190 -16 -208 -66 -206 -128 L-184 -122 C-180 -90 -170 -48 -152 12Z';
    return `<g class="vh">
      <g class="rwh">${wheel(R, 'rw')}</g>
      <g class="fwh" transform="translate(${T(fx)} 0)">${wheel(R, 'fw')}</g>
      ${fenderArc(fx, 0, R + 6, 186, 322, o.fcol || col, 6.6)}
      ${fork(fx, ftop)}
      <path d="${leg}" ${paint(col)}/>${gloss(leg, .6)}
      <path d="M-180 10 L-110 12 L-110 22 L-176 20Z" fill="#303842" stroke="${K}" stroke-width="1.4"/><g stroke="#0b0f15" stroke-width="1.2" opacity=".6">${Array.from({length: 11}, (_, i) => `<line x1="${-174 + i * 6.2}" y1="11" x2="${-176 + i * 6.2}" y2="20"/>`).join('')}</g><path d="M-178 12 L-110 13" stroke="#cfd7e0" stroke-opacity=".6" stroke-width="1.6"/>
      <path d="${body}" ${paint(col)}/>${gloss(body, .65)}${shadeUnder(sw ? 'M-172 12 L-69 12 L-69 4 L-172 -2Z' : 'M-172 12 L-69 12 L-69 4 L-172 -2Z')}
      <path d="M-160 -84 C-100 -96 -20 -96 40 -88" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2"/>
      <path d="M-150 -30 C-120 -34 -90 -34 -76 -18" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/><path d="M-150 -62 L-90 -58 L-88 -24 L-150 -26Z" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.2" rx="6"/>
      <circle cx="-120" cy="-44" r="3" fill="#2a303a" stroke="#000" stroke-width=".6"/>
      <path d="M-166 -104 C-120 -111 -40 -111 20 -106 C36 -104 52 -102 54 -96 L52 -90 L-160 -90Z" fill="url(#pa-seat)" stroke="${K}" stroke-width="1.6"/><path d="M-150 -104 L10 -105" stroke="#fff" stroke-opacity=".2" stroke-width="1.6"/>
      <path d="M56 -76 L70 -72 L69 -50 L58 -50Z" fill="url(#pa-red)" stroke="${K}" stroke-width="1.3"/>
      ${exhaustRoller()}
      <path d="M-4 -4 L-14 -34 L-34 -80" stroke="${K}" stroke-width="3" opacity="0"/>
      <path d="M-2 -8 L-12 -38" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M-2 -8 L-12 -38" stroke="url(#pst-ch)" stroke-width="4.6" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="14" fill="url(#pa-alu)" stroke="#2d343d" stroke-width="1.4" opacity=".0"/>
      <!-- Lenkerverkleidung, Lampe -->
      ${sw ? `<path d="M-224 -132 C-226 -150 -212 -160 -192 -158 C-176 -156 -170 -146 -172 -134 C-190 -128 -208 -126 -224 -132Z" ${paint(col)}/>${gloss('M-224 -132 C-226 -150 -212 -160 -192 -158 C-176 -156 -170 -146 -172 -134Z', .7)}` : `<path d="M-226 -136 L-222 -154 L-182 -160 L-168 -150 L-170 -132 C-190 -126 -210 -128 -226 -136Z" ${paint(col)}/>${gloss('M-226 -136 L-222 -154 L-182 -160 L-168 -150', .7)}`}
      ${sw ? lamp(-226, -136, 8, 14) : `<path d="M-232 -150 L-228 -126 L-222 -126 L-224 -150Z" fill="url(#pa-glass)" stroke="${K}" stroke-width="1.2"/>`}
      <path d="M-180 -138 C-176 -148 -170 -154 -162 -156" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M-180 -138 C-176 -148 -170 -154 -162 -156" fill="none" stroke="url(#pst-ch)" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="-172" y="-160" width="22" height="8" rx="4" fill="#1a1f26" stroke="#000" stroke-width="1"/>
    </g>`;
  }
  function exhaustRoller() {
    return `<path d="M-60 32 C-30 30 14 28 40 29 C48 30 51 33 51 38 C51 42 48 44 40 45 C14 47 -30 50 -60 50 C-68 50 -68 34 -60 32Z" fill="url(#pst-ch)" stroke="#2f3742" stroke-width="1.5"/><path d="M-54 36 C-20 34 20 33 44 34" stroke="#fff" stroke-width="2" opacity=".7" fill="none"/><ellipse cx="50" cy="38" rx="2.6" ry="5.4" fill="#0b0f15"/>`;
  }

  // ---------- Duo (Dreirad, 2 Hinterräder) ----------
  function drawDuoArt(o) {
    const R = o.R, wb = o.wb, fx = -wb, col = o.col;
    const body = 'M-262 6 L-256 -34 C-246 -52 -200 -58 -170 -56 L-150 -92 L-120 -94 L-112 -150 L-66 -154 L-60 -92 L40 -80 C70 -70 74 -30 62 8 L46 22 L-240 22Z';
    return `<g class="vh">
      <g transform="translate(-9 -5)" opacity=".62"><g>${wheel(R, 'rx')}</g></g>
      <g class="rwh">${wheel(R, 'rw')}</g>
      <g class="fwh" transform="translate(${T(fx)} 0)">${wheel(R, 'fw')}</g>
      ${fenderArc(fx, 0, R + 6, 186, 336, '#aab3bf', 6.4)}
      ${fork(fx, [fx + 56, -108])}
      <path d="${body}" ${paint(col)}/>${gloss(body, .6)}${shadeUnder('M-262 8 L-240 22 L46 22 L62 8Z')}
      <path d="M-118 -96 L-108 -146 L-70 -150 L-64 -96Z" fill="#aeb9c6" fill-opacity=".55" stroke="${K}" stroke-width="1.4"/><path d="M-112 -100 L-104 -142 L-90 -144" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
      <path d="M-170 -50 L-208 -74 L-224 -100" stroke="${K}" stroke-width="7.4" stroke-linecap="round" fill="none"/><path d="M-170 -50 L-208 -74 L-224 -100" stroke="url(#pst-ch)" stroke-width="4.6" stroke-linecap="round" fill="none"/>
      <rect x="-244" y="-108" width="28" height="8" rx="4" fill="#1a1f26" stroke="#000"/>
      ${lamp(-258, -40, 8, 12)}
      <rect x="-110" y="-60" width="94" height="30" rx="9" fill="url(#pa-seat)" stroke="${K}" stroke-width="1.4"/><path d="M-100 -56 L-26 -56" stroke="#fff" stroke-opacity=".25" stroke-width="1.6"/>
      <path d="M-62 36 L56 36 L56 28 L-62 28Z" fill="url(#pst-ch)" stroke="#2f3742" stroke-width="1.5"/><ellipse cx="58" cy="32" rx="2.8" ry="5.2" fill="${K}"/>
      <rect x="62" y="-50" width="9" height="16" fill="url(#pa-red)" stroke="${K}" stroke-width="1.2"/>
    </g>`;
  }

  // ---------- Klapprad (20 Zoll, Muskelantrieb) ----------
  function drawKlappArt(o) {
    const R = o.R, wb = o.wb, fx = -wb, bx = -97, by = -3, hinge = '#d7dde5';
    const lt = (d, w, c) => tube(d, w, c, true);
    return `<g class="vh">
      <g class="rwh">${wheelBike(R, 'rw')}</g>
      <g class="fwh" transform="translate(${T(fx)} 0)">${wheelBike(R, 'fw')}</g>
      ${fenderArc(0, 0, R + 4, 200, 340, '#aab4bf', 3.6)}${fenderArc(fx, 0, R + 4, 200, 340, '#aab4bf', 3.6)}
      ${lt('M0 0 L-96 -4', 4, '#7a8590')}${lt('M0 0 L-92 -112', 4, '#7a8590')}
      ${lt(`M${bx} ${by} L-92 -112`, 5, '#7a8590')}
      ${lt('M-92 -80 L-134 -86 L-196 -102', 5, '#8a95a1')}
      <circle cx="-134" cy="-86" r="8" fill="${hinge}" stroke="#2c333c" stroke-width="2"/><rect x="-142" y="-98" width="5" height="16" rx="2" fill="#d63b2c" stroke="#2c333c" stroke-width="1"/>
      ${lt(`M${fx + 4} 0 L-196 -102`, 4.4, '#9aa4b0')}
      ${lt('M-196 -102 L-188 -164', 4.6, '#8a95a1')}
      <path d="M-208 -168 L-166 -164" stroke="#161a20" stroke-width="7" stroke-linecap="round"/><path d="M-208 -168 L-166 -164" stroke="#c0c8d2" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <path d="M-124 -128 C-106 -138 -66 -136 -62 -124 C-70 -119 -104 -117 -122 -118Z" fill="url(#pa-seat)" stroke="${K}" stroke-width="1.4"/><path d="M-92 -118 L-92 -112" stroke="#8a95a1" stroke-width="4"/>
      <path d="M-26 -90 L28 -86 L26 -80 L-26 -82Z" fill="#8a95a1" stroke="${K}" stroke-width="1"/>
      <g class="ch"><path class="chn" d="" fill="none" stroke="#161a20" stroke-width="2.2"/></g>
      <g class="cr" transform="translate(${bx} ${by})"><circle r="19" fill="url(#pa-alu)" stroke="#3a424d" stroke-width="1.6"/><circle r="14" fill="none" stroke="#5a636f" stroke-width="1.4" stroke-dasharray="2 2.4"/><circle r="4.6" fill="#2b323b"/>
        <g class="cra"><path d="M0 0 L0 36" stroke="#1d2229" stroke-width="6" stroke-linecap="round"/><path d="M0 0 L0 36" stroke="#cfd6df" stroke-width="2.6" stroke-linecap="round"/><g class="pd1" transform="translate(0 36)"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#1a1f26" stroke="${K}"/></g>
        <path d="M0 0 L0 -36" stroke="#1d2229" stroke-width="6" stroke-linecap="round" opacity=".55"/><path d="M0 0 L0 -36" stroke="#9aa4b0" stroke-width="2.6" stroke-linecap="round" opacity=".55"/><g class="pd2" transform="translate(0 -36)" opacity=".7"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#1a1f26" stroke="${K}"/></g></g></g>
      <circle cx="0" cy="0" r="7.4" fill="url(#pa-alu)" stroke="#3a424d" stroke-width="1.2"/>
      <rect x="40" y="-66" width="8" height="12" fill="url(#pa-red)" stroke="${K}" stroke-width="1"/>
    </g>`;
  }

  window.PSTART = {
    defs, wheel, wheelBike,
    draw: {
      s51: o => drawMopedArt(o, {tank: 's51', cover: 'rund', lampe: 's51', rahmen: 'press'}),
      s50: o => drawMopedArt(o, {tank: 's50', cover: 'rund', lampe: 's50', rahmen: 'press', fenderChrome: false}),
      star: o => drawMopedArt(o, {tank: 'star', cover: 'eck', lampe: 'alt', rahmen: 'rohr', fenderChrome: true}),
      habicht: o => drawMopedArt(o, {tank: 'hab', cover: 'eck', lampe: 'alt', rahmen: 'rohr'}),
      kr51: o => drawRollerArt(o, true),
      sr50: o => drawRollerArt(o, false),
      duo: drawDuoArt,
      klapp: drawKlappArt
    },
    // Gurt-Ankerpunkte (relativ zur Hinterachse): fr = Lenker/Gabel, ba = Heck
    anch: {s51: {fr: [-168, -158], ba: [50, -70]}, s50: {fr: [-168, -158], ba: [50, -70]}, star: {fr: [-168, -158], ba: [50, -70]}, habicht: {fr: [-168, -158], ba: [50, -70]}, kr51: {fr: [-166, -156], ba: [56, -84]}, sr50: {fr: [-166, -156], ba: [56, -84]}, duo: {fr: [-235, -100], ba: [40, -42]}, klapp: {fr: [-190, -164], ba: [26, -88]}}
  };
})();
