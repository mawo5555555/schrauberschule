'use strict';
// Prüfstand-Animation (Schrauberschule v3.0): Fahrzeug in Seitenansicht auf der Rolle, Messrechner mit Live-Kurve, Absaugschlauch, Zweitakt-Qualm, Lüfter.
// Ersetzt die alte Walze (.roller) und die Prüfstand-Standbilder. Nur Canvas/SVG-Transform, Ton per Web Audio (pruefstand-ton.js).
// Quellen und Annahmen: PRUEFSTAND-RECHERCHE.md. Maße der Fahrzeuge: Datenblatt-Näherungen (ca.), Zeichnung später durch Foto ersetzbar (PST.VEH[key]).
(function () {
  const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const NS = 'http://www.w3.org/2000/svg';
  const SC = 215;                       // 1 m = 215 Einheiten
  const SW = 720, SH = 400;             // Szene
  const FLOOR = 372, PT = 336, RT = 328, RR = 26;   // Hallenboden, Plattformoberkante, Rollenoberkante, Rollenradius
  const RX = 520;                       // Kontaktpunkt Hinterrad (x)
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const de = (x, d = 1) => (+x).toFixed(d).replace('.', ',');

  // ---------- Fahrzeugdaten (Radstand/Radgröße ca.) ----------
  // wb = Radstand in m, R = Reifenradius in Szene-Einheiten, gears = Übersetzungen (Spielwerte, geschätzt), col = Lackfarbe (frei gewählt)
  const G4 = [3.0, 1.85, 1.35, 1.0], G3 = [2.6, 1.5, 1.0];
  const VEH = {
    s51:     {type: 'moped',  wb: 1.175, R: 62, col: '#2f78c8', tank: 's51',  gears: G4, ex: [46, 36]},
    s50:     {type: 'moped',  wb: 1.175, R: 62, col: '#c9a23a', tank: 's50',  gears: G3, ex: [46, 36]},
    star:    {type: 'moped',  wb: 1.16,  R: 62, col: '#b8392f', tank: 'star', gears: G3, ex: [46, 36]},
    habicht: {type: 'moped',  wb: 1.15,  R: 62, col: '#3b8f5a', tank: 'hab',  gears: G4, ex: [46, 36]},
    kr51:    {type: 'roller', wb: 1.175, R: 62, col: '#56a08e', style: 'sw',   gears: G4, ex: [50, 38]},
    sr50:    {type: 'roller', wb: 1.19,  R: 62, col: '#c14a3f', style: 'sr',   gears: G4, ex: [50, 38]},
    duo:     {type: 'duo',    wb: 1.55,  R: 56, col: '#d8d2c2', gears: G4, ex: [58, 34]},
    klapp:   {type: 'klapp',  wb: 1.0,   R: 55, col: '#7a8590', gears: [1], ex: [0, 0]}
  };

  // ---------- Zeichnung ----------
  const wheelParts = (R, id, opt) => {
    opt = opt || {};
    const n = 36, ri = 7, ro = R - 14; let sp = '';
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d = (i % 2 ? .42 : -.42) * (i % 4 < 2 ? 1 : 1); sp += `<line x1="${(ri * Math.cos(a)).toFixed(1)}" y1="${(ri * Math.sin(a)).toFixed(1)}" x2="${(ro * Math.cos(a + d)).toFixed(1)}" y2="${(ro * Math.sin(a + d)).toFixed(1)}"/>` }
    let tr = ''; for (let i = 0; i < 40; i++) { const a = i / 40 * 360; tr += `<rect x="${R - 7}" y="-1.4" width="6" height="2.8" transform="rotate(${a.toFixed(1)})"/>` }
    const base = `<circle r="${R - 4}" fill="none" stroke="#14171c" stroke-width="11"/><circle r="${R - 9}" fill="none" stroke="#313842" stroke-width="1.4"/><circle r="${R - 13}" fill="none" stroke="#d2d9e1" stroke-width="2.8"/><circle r="${R - 15}" fill="none" stroke="#7b8592" stroke-width="1"/>`;
    const rot = `<g class="${id}-t" fill="#2b3139">${tr}</g><g class="${id}-s" stroke="#b9c2cd" stroke-width=".9" stroke-linecap="round" fill="none">${sp}<rect x="${R - 17}" y="-2" width="4" height="4" fill="#d63b2c" stroke="none"/></g>`;
    const blur = `<g class="${id}-b" opacity="0"><circle r="${R - 14}" fill="url(#pst-bl)"/><g class="${id}-bs" fill="none" stroke="#d5dde8" stroke-linecap="round"><circle r="${R * .55}" stroke-width="${R * .62}" stroke-opacity=".12" stroke-dasharray="${R * .9} ${R * .6}"/></g></g>`;
    const hub = `<circle r="12" fill="#8b95a1" stroke="#4a525d" stroke-width="1.5"/><circle r="5" fill="#cdd5de"/>`;
    return base + rot + blur + hub;
  };

  const bodyGrad = col => `<linearGradient id="pst-pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".25" stop-color="${col}"/><stop offset=".85" stop-color="${col}"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>`;
  const paint = col => `fill="${col}" stroke="#0b0f15" stroke-width="1.6" stroke-linejoin="round"`;
  const gloss = (d, o) => `<path d="${d}" fill="url(#pst-pt)" stroke="none" opacity="${o || 1}"/>`;
  const chrome = 'fill="url(#pst-ch)" stroke="#3a424d" stroke-width="1"';

  function motoEngine(x, y, ccm) {
    // Kurbelgehäuse, Getriebe, luftgekühlter Zylinder mit Rippen (nach vorn geneigt), Zündkerze
    const k = clamp((ccm || 50) / 50, .9, 1.4); let fins = '';
    for (let i = 0; i < 7; i++) fins += `<rect x="${-6 - i * 6.2 * k}" y="-17" width="4.2" height="34" rx="1" transform="translate(0 0)"/>`;
    return `<g transform="translate(${x} ${y})"><path d="M-36 -12 Q-44 18 -18 30 L34 30 Q48 8 36 -16 Q10 -26 -36 -12Z" fill="url(#pst-al)" stroke="#2f3640" stroke-width="1.5"/>
      <circle cx="4" cy="8" r="12" fill="#8d97a3" stroke="#3b434e" stroke-width="1.5"/><circle cx="4" cy="8" r="4" fill="#cdd5de"/>
      <g transform="rotate(38 -8 -4)"><rect x="-58" y="-17" width="50" height="34" rx="3" fill="#6c7683" stroke="#2f3640" stroke-width="1.2"/><g fill="#a7b1be" stroke="#2f3640" stroke-width=".6">${fins.replace(/<rect /g, '<rect ')}</g><rect x="-${58 * k}" y="-20" width="9" height="40" rx="3" fill="#59636f" stroke="#2f3640" stroke-width="1"/></g>
      <rect x="-60" y="-52" width="5" height="11" fill="#e8edf2" stroke="#2f3640" stroke-width=".8" transform="rotate(38 -8 -4) translate(22 20)"/></g>`;
  }

  function drawMoped(o) {
    const R = o.R, wb = o.wb * SC, col = o.col, fx = -wb;
    const tankP = {
      s51: 'M-196 -112 C-186 -128 -150 -130 -120 -124 L-92 -108 L-100 -98 C-130 -100 -170 -98 -196 -100Z',
      s50: 'M-194 -110 C-180 -122 -146 -124 -118 -118 L-92 -106 L-100 -98 C-130 -100 -170 -98 -194 -100Z',
      star: 'M-196 -112 C-186 -124 -156 -126 -128 -120 L-104 -106 L-110 -98 C-140 -102 -176 -100 -196 -102Z',
      hab: 'M-196 -112 C-184 -130 -140 -134 -112 -122 L-96 -106 L-104 -97 C-136 -99 -172 -97 -196 -100Z'
    }[o.tank];
    const cover = (o.tank === 's51' || o.tank === 's50') ? `<path d="M-120 -96 L-52 -92 L-44 -50 Q-60 -36 -112 -42 Q-124 -64 -120 -96Z" ${paint(col)}/>${gloss('M-120 -96 L-52 -92 L-44 -50 Q-60 -36 -112 -42Z', .5)}<circle cx="-82" cy="-66" r="3" fill="#0b0f15" opacity=".5"/>` : `<path d="M-112 -80 L-60 -78 L-56 -44 L-108 -44Z" fill="#26303c" stroke="#0b0f15" stroke-width="1.4"/>`;
    const fork = o.tank === 'star' || o.tank === 'hab' ? '' : '';
    return `<g class="vh">
      <g class="rwh" transform="translate(0 0)">${wheelParts(R, 'rw')}</g>
      <g class="fwh" transform="translate(${fx} 0)">${wheelParts(R, 'fw')}</g>
      <path d="M-122 22 L-6 8 L-4 14 L-120 32Z" fill="#20262e" stroke="#0b0f15" stroke-width="1.4"/>
      <path d="M-4 16 L-30 -78" stroke="#1b2027" stroke-width="5" stroke-linecap="round"/><path d="M-4 16 L-30 -78" stroke="#8c96a3" stroke-width="2" stroke-dasharray="3 2.2"/>
      <path d="M52 -8 C52 -52 24 -80 -14 -78 L-44 -64 L-40 -58 C-12 -66 14 -54 28 -30 L40 -4Z" ${paint(o.fcol || '#9aa5b2')}/>
      <path d="M-4 -86 L-96 -84 L-104 -92 L-98 -104 L-4 -108 Q32 -108 50 -90 L52 -76 L12 -72Z" fill="#171b21" stroke="#0b0f15" stroke-width="1.6"/><path d="M-96 -100 L10 -104" stroke="#4a5360" stroke-width="2" opacity=".7"/>
      <path d="M-134 -26 L-190 -96 M-120 -4 L-176 -84" stroke="#262d36" stroke-width="5" stroke-linecap="round"/>
      <path d="M-134 -26 L-110 -92" stroke="#262d36" stroke-width="5" stroke-linecap="round"/>
      ${motoEngine(-96, 12, o.ccm)}
      ${cover}
      <path d="${tankP}" ${paint(col)}/>${gloss(tankP, .6)}<circle cx="-146" cy="-124" r="5" fill="#cdd5de" stroke="#3a424d" stroke-width="1"/>
      <path d="M${fx + 52} -106 L-196 -108" stroke="#c4ccd6" stroke-width="2" opacity="0"/>
      <g class="fk"><path d="M${fx + 6} -4 L${fx + 52} -112" stroke="#0b0f15" stroke-width="9" stroke-linecap="round"/><path d="M${fx + 6} -4 L${fx + 52} -112" stroke="url(#pst-ch)" stroke-width="6" stroke-linecap="round"/><path d="M${fx + 30} -54 L${fx + 52} -106" stroke="#1f252d" stroke-width="10" stroke-linecap="round" opacity=".9"/></g>
      <path d="M${fx + 52} -112 L-190 -136 Q-186 -160 -170 -164" fill="none" stroke="#0b0f15" stroke-width="5.4" stroke-linecap="round"/><path d="M${fx + 52} -112 L-190 -136 Q-186 -160 -170 -164" fill="none" stroke="#bfc8d3" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="-176" y="-168" width="30" height="8" rx="4" fill="#1a1f26" stroke="#0b0f15"/>
      <circle cx="${fx + 38}" cy="-126" r="18" fill="url(#pst-ch)" stroke="#2b323b" stroke-width="2"/><circle cx="${fx + 30}" cy="-126" r="12" fill="#ffefb8" opacity=".85"/><circle cx="${fx + 30}" cy="-126" r="12" fill="url(#pst-gl)"/>
      <path d="M${fx - 26} -30 C${fx - 24} -66 ${fx + 4} -78 ${fx + 24} -74 L${fx + 20} -66 C${fx + 6} -70 ${fx - 14} -60 ${fx - 16} -34Z" fill="#a8b2be" stroke="#0b0f15" stroke-width="1.4"/>
      <path d="M-134 -2 C-144 40 -122 62 -92 54 L-50 44 L40 38 L40 30 L-50 34 L-92 44 C-114 48 -126 34 -124 -4Z" fill="#000" opacity="0"/>
      <path d="M-128 4 C-142 36 -124 56 -96 52 L-40 42 L44 36" fill="none" stroke="#0b0f15" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M-128 4 C-142 36 -124 56 -96 52 L-40 42 L44 36" fill="none" stroke="url(#pst-ch)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-62 48 L46 36 L46 24 L-62 36Z" ${chrome}/><path d="M-62 36 L46 24" stroke="#fff" stroke-width="2" opacity=".5"/><ellipse cx="46" cy="30" rx="3.2" ry="6" fill="#0b0f15"/>
      <rect x="-88" y="46" width="26" height="6" rx="2" fill="#20262e"/>
      <path d="M52 -66 L64 -64 L64 -50 L52 -50Z" fill="#c72a22" stroke="#0b0f15" stroke-width="1.2"/>
    </g>`;
  }

  function drawRoller(o) {
    const R = o.R, wb = o.wb * SC, col = o.col, fx = -wb, sw = o.style === 'sw';
    const rear = sw
      ? 'M-118 20 L-112 -70 C-88 -96 -10 -104 34 -84 C66 -66 70 -26 52 -2 C46 6 40 10 30 8 C20 -34 -22 -40 -48 -12 L-60 22Z'
      : 'M-122 22 L-116 -66 L-40 -98 L38 -92 L66 -62 L62 -14 L50 10 L32 8 C20 -30 -20 -40 -46 -12 L-58 24Z';
    const leg = sw
      ? `M-196 4 L-124 6 L-130 -20 C-150 -50 -168 -86 -176 -130 C-184 -120 -204 -80 -196 4Z`
      : `M-206 4 L-124 6 L-132 -24 L-156 -80 L-176 -136 L-206 -112 L-212 -40Z`;
    return `<g class="vh">
      <g class="rwh">${wheelParts(R, 'rw')}</g>
      <g class="fwh" transform="translate(${fx} 0)">${wheelParts(R, 'fw')}</g>
      <path d="M${fx} 0 L${fx + 46} -112" stroke="#0b0f15" stroke-width="9" stroke-linecap="round"/><path d="M${fx} 0 L${fx + 46} -112" stroke="url(#pst-ch)" stroke-width="5.6" stroke-linecap="round"/>
      <path d="M${fx - 24} -52 C${fx - 20} -96 ${fx + 26} -112 ${fx + 44} -96 L${fx + 36} -86 C${fx + 14} -94 ${fx - 6} -80 ${fx - 8} -52Z" ${paint(sw ? col : '#a3adba')}/>${gloss(`M${fx - 24} -52 C${fx - 20} -96 ${fx + 26} -112 ${fx + 44} -96`, .5)}
      <path d="M-196 4 L-110 8 L-110 18 L-196 14Z" fill="#323a45" stroke="#0b0f15" stroke-width="1.4"/><path d="M-190 8 L-116 11" stroke="#8e98a5" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="${leg}" ${paint(col)}/>${gloss(leg, .55)}
      <path d="${rear}" ${paint(col)}/>${gloss(rear, .6)}
      <path d="M-112 -70 L-96 -64 L-80 20" fill="none" stroke="#0b0f15" stroke-width="1" opacity=".4"/>
      <path d="M-114 -76 C-92 -104 -8 -112 32 -92 L30 -84 C-6 -98 -86 -92 -108 -68Z" fill="#161a20" stroke="#0b0f15" stroke-width="1.6"/><path d="M-100 -92 C-60 -102 -20 -102 20 -94" stroke="#4a5360" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M-176 -130 L-194 -150 L-186 -168 M-176 -130 L-168 -150" fill="none" stroke="#0b0f15" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M-176 -130 L-194 -150 L-186 -168" fill="none" stroke="#bfc8d3" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="-208" y="-174" width="28" height="8" rx="4" fill="#1a1f26" stroke="#0b0f15"/>
      <path d="M${fx - 6} -118 C${fx - 6} -148 ${fx + 40} -150 ${fx + 40} -118Z" fill="url(#pst-ch)" stroke="#2b323b" stroke-width="2"/><ellipse cx="${fx - 8}" cy="-124" rx="6" ry="14" fill="#ffefb8" opacity=".9" transform="translate(-10 4)"/>
      <path d="M-64 56 L50 38 L50 26 L-64 42Z" ${chrome}/><path d="M-64 42 L50 26" stroke="#fff" stroke-width="2" opacity=".5"/><path d="M-84 36 C-96 40 -84 56 -66 52" fill="none" stroke="#0b0f15" stroke-width="8" stroke-linecap="round"/><path d="M-84 36 C-96 40 -84 56 -66 52" fill="none" stroke="url(#pst-ch)" stroke-width="5" stroke-linecap="round"/><ellipse cx="50" cy="32" rx="3.2" ry="6" fill="#0b0f15"/>
      <path d="M62 -62 L72 -58 L72 -44 L60 -44Z" fill="#c72a22" stroke="#0b0f15" stroke-width="1.2"/>
    </g>`;
  }

  function drawDuo(o) {
    const R = o.R, wb = o.wb * SC, col = o.col, fx = -wb;
    return `<g class="vh">
      <g transform="translate(-9 -5)" opacity=".55"><g>${wheelParts(R, 'rx')}</g></g>
      <g class="rwh">${wheelParts(R, 'rw')}</g>
      <g class="fwh" transform="translate(${fx} 0)">${wheelParts(R, 'fw')}</g>
      <path d="M${fx + 4} 0 L${fx + 54} -102" stroke="#0b0f15" stroke-width="9" stroke-linecap="round"/><path d="M${fx + 4} 0 L${fx + 54} -102" stroke="url(#pst-ch)" stroke-width="5.6" stroke-linecap="round"/>
      <path d="M${fx - 24} -50 C${fx - 20} -92 ${fx + 26} -108 ${fx + 46} -94 L${fx + 38} -84 C${fx + 14} -92 ${fx - 6} -78 ${fx - 8} -50Z" fill="#a3adba" stroke="#0b0f15" stroke-width="1.6"/>
      <path d="M-262 8 L-256 -34 C-246 -52 -200 -58 -170 -56 L-150 -92 L-120 -94 L-112 -150 L-66 -154 L-60 -92 L40 -80 C70 -70 74 -30 62 8 L46 22 L-240 22Z" ${paint(col)}/>${gloss('M-262 8 L-256 -34 C-246 -52 -200 -58 -170 -56 L-150 -92 L-120 -94 L-112 -150 L-66 -154 L-60 -92 L40 -80 C70 -70 74 -30 62 8Z', .55)}
      <path d="M-118 -96 L-108 -146 L-70 -150 L-64 -96Z" fill="#3a4350" stroke="#0b0f15" stroke-width="1.4"/><path d="M-150 -92 L-170 -56 L-262 -30" fill="none" stroke="#0b0f15" stroke-width="1.2" opacity=".5"/>
      <path d="M-262 -34 L-170 -56 L-150 -94" fill="none" stroke="#bfe6ff" stroke-width="3" opacity=".4"/>
      <path d="M-170 -50 L-208 -74 L-224 -100" stroke="#0b0f15" stroke-width="5.4" stroke-linecap="round" fill="none"/><path d="M-170 -50 L-208 -74 L-224 -100" stroke="#bfc8d3" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <rect x="-244" y="-108" width="28" height="8" rx="4" fill="#1a1f26" stroke="#0b0f15"/>
      <rect x="-110" y="-60" width="94" height="30" rx="8" fill="#2a303a" stroke="#0b0f15" stroke-width="1.4"/><rect x="-100" y="-56" width="74" height="9" rx="4" fill="#4a5360" opacity=".7"/>
      <path d="M-62 56 L56 38 L56 26 L-62 44Z" ${chrome}/><ellipse cx="58" cy="32" rx="3.2" ry="6" fill="#0b0f15"/>
      <rect x="62" y="-48" width="9" height="14" fill="#c72a22" stroke="#0b0f15" stroke-width="1.2"/>
    </g>`;
  }

  function drawKlapp(o) {
    const R = o.R, wb = o.wb * SC, fx = -wb;
    const bx = -97, by = -3;       // Tretlager
    const hinge = '#d7dde5';
    return `<g class="vh">
      <g class="rwh">${wheelParts(R, 'rw')}</g>
      <g class="fwh" transform="translate(${fx} 0)">${wheelParts(R, 'fw')}</g>
      <path d="M-4 -8 C14 -50 6 -80 -22 -88 L-40 -78 C-20 -66 -8 -44 -14 -10Z" fill="#aab4bf" stroke="#0b0f15" stroke-width="1.2"/>
      <path d="M${fx + 6} -6 C${fx - 14} -56 ${fx - 8} -84 ${fx + 22} -92 L${fx + 40} -86 C${fx + 8} -76 ${fx + 6} -48 ${fx + 24} -8Z" fill="#aab4bf" stroke="#0b0f15" stroke-width="1.2"/>
      <path d="M${bx} ${by} L0 0 M${bx} ${by} L-4 -2" stroke="#1d2229" stroke-width="5" stroke-linecap="round"/>
      <path d="M-92 -112 L${bx} ${by}" stroke="#2c333c" stroke-width="6" stroke-linecap="round"/><path d="M-92 -112 L${bx} ${by}" stroke="#7a8590" stroke-width="3" stroke-linecap="round"/>
      <path d="M-92 -112 L-6 0" stroke="#2c333c" stroke-width="5" stroke-linecap="round"/><path d="M-92 -112 L-6 0" stroke="#7a8590" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-92 -78 L-134 -86 M-134 -86 L-196 -102" stroke="#2c333c" stroke-width="7" stroke-linecap="round"/><path d="M-92 -78 L-134 -86 L-196 -102" stroke="#8a95a1" stroke-width="3.6" stroke-linecap="round" fill="none"/>
      <circle cx="-134" cy="-86" r="8" fill="${hinge}" stroke="#2c333c" stroke-width="2"/><rect x="-142" y="-98" width="5" height="16" rx="2" fill="#d63b2c" stroke="#2c333c" stroke-width="1"/>
      <path d="M${fx + 22} -90 L-196 -102 L${fx + 6} -4" fill="none" stroke="#2c333c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-196 -102 L-186 -168" stroke="#2c333c" stroke-width="6" stroke-linecap="round"/><path d="M-196 -102 L-186 -168" stroke="#8a95a1" stroke-width="3" stroke-linecap="round"/>
      <path d="M-208 -172 L-166 -168" stroke="#161a20" stroke-width="7" stroke-linecap="round"/><path d="M-208 -172 L-166 -168" stroke="#c0c8d2" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <path d="M-120 -128 C-104 -138 -66 -136 -62 -124 C-70 -120 -104 -118 -120 -118Z" fill="#171b21" stroke="#0b0f15" stroke-width="1.4"/><path d="M-92 -118 L-90 -112" stroke="#8a95a1" stroke-width="4"/>
      <path d="M-26 -90 L28 -86 L26 -80 L-26 -82Z" fill="#8a95a1" stroke="#0b0f15" stroke-width="1"/>
      <g class="ch"><path class="chn" d="" fill="none" stroke="#161a20" stroke-width="2.2"/></g>
      <g class="cr" transform="translate(${bx} ${by})"><circle r="19" fill="#a9b3bf" stroke="#3a424d" stroke-width="1.6"/><circle r="14" fill="none" stroke="#5a636f" stroke-width="1.4" stroke-dasharray="2 2.4"/><circle r="4.6" fill="#2b323b"/>
        <g class="cra"><path d="M0 0 L0 36" stroke="#1d2229" stroke-width="6" stroke-linecap="round"/><path d="M0 0 L0 36" stroke="#cfd6df" stroke-width="2.6" stroke-linecap="round"/><g class="pd1" transform="translate(0 36)"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#1a1f26" stroke="#0b0f15"/></g>
        <path d="M0 0 L0 -36" stroke="#1d2229" stroke-width="6" stroke-linecap="round" opacity=".55"/><path d="M0 0 L0 -36" stroke="#9aa4b0" stroke-width="2.6" stroke-linecap="round" opacity=".55"/><g class="pd2" transform="translate(0 -36)" opacity=".7"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#1a1f26" stroke="#0b0f15"/></g></g></g>
      <circle cx="0" cy="0" r="7" fill="#9aa4b0" stroke="#3a424d" stroke-width="1.2"/>
      <rect x="40" y="-66" width="8" height="12" fill="#c72a22" stroke="#0b0f15" stroke-width="1"/>
    </g>`;
  }

  function vehicleSvg(id, ccm) {
    const o = Object.assign({ccm, pick: window.PSTART && PSTART.cur}, VEH[id]);
    // Neue Zeichnungen (pruefstand-art.js) haben Vorrang; austauschbar, z. B. durch ein Foto (siehe dort). Alte Zeichner bleiben als Rückfall.
    const A = window.PSTART; if (A && A.draw && A.draw[id]) { o.wb = o.wb * SC; return A.draw[id](o) }
    return o.type === 'moped' ? drawMoped(o) : o.type === 'roller' ? drawRoller(o) : o.type === 'duo' ? drawDuo(o) : drawKlapp(o);
  }

  // ---------- Szene ----------
  function sceneSvg(id, ccm) {
    const o = VEH[id], wb = o.wb * SC, frontX = RX - wb, R = o.R;
    const th = Math.atan2(RT - PT + 0, wb) * 0;   // Neigung: Rolle ragt 8 über die Plattform, Vorderrad steht auf der Plattform
    const tilt = -Math.atan2(PT - RT, wb) * 180 / Math.PI;   // negativ = vorn tiefer
    const ramp = frontX - R - 36, fanX = Math.max(46, ramp - 120);
    const gl = (x, y, r, a) => `<radialGradient id="${x}" cx="${y}" cy=".5" r="${r}"><stop offset="0" stop-color="#fff" stop-opacity="${a}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
    const roller = `<g transform="translate(${RX} ${RT + RR})"><circle r="${RR}" fill="url(#pst-ro)" stroke="#262c34" stroke-width="2"/><g class="ro-t" stroke="#0e1217" stroke-width="2.2">${Array.from({length: 30}, (_, i) => `<line x1="${RR - 7}" y1="0" x2="${RR - 1.5}" y2="0" transform="rotate(${i * 12})"/>`).join('')}</g><g class="ro-b" opacity="0"><circle r="${RR - 1}" fill="url(#pst-rb)"/></g><circle r="6" fill="#59626e" stroke="#262c34"/><path d="M-${RR * .8} -${RR * .55} A${RR} ${RR} 0 0 1 ${RR * .1} -${RR * .98}" stroke="#fff" stroke-width="3" fill="none" opacity=".3" stroke-linecap="round"/></g>`;
    return `<svg class="pst-sc" viewBox="0 0 ${SW} ${SH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Prüfstand mit ${id}">
    <defs>${bodyGrad(o.col)}${window.PSTART ? PSTART.defs() : ''}
      <linearGradient id="pst-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d131c"/><stop offset=".6" stop-color="#1a2330"/><stop offset="1" stop-color="#202a38"/></linearGradient>
      <linearGradient id="pst-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a313b"/><stop offset="1" stop-color="#12161c"/></linearGradient>
      <linearGradient id="pst-ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset=".35" stop-color="#aeb8c4"/><stop offset=".6" stop-color="#6e7886"/><stop offset=".8" stop-color="#cfd7e0"/><stop offset="1" stop-color="#5b6572"/></linearGradient>
      <linearGradient id="pst-al" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa5b2"/><stop offset="1" stop-color="#555f6c"/></linearGradient>
      <linearGradient id="pst-pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a95a3"/><stop offset=".12" stop-color="#5f6a79"/><stop offset="1" stop-color="#2d343e"/></linearGradient>
      <radialGradient id="pst-ro" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#d9dfe6"/><stop offset=".6" stop-color="#7d8794"/><stop offset="1" stop-color="#3a424d"/></radialGradient>
      <radialGradient id="pst-rb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7d8794" stop-opacity=".2"/><stop offset=".8" stop-color="#cdd5de" stop-opacity=".5"/><stop offset="1" stop-color="#7d8794" stop-opacity=".2"/></radialGradient>
      <radialGradient id="pst-bl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#c8d0da" stop-opacity=".02"/><stop offset=".6" stop-color="#c8d0da" stop-opacity=".12"/><stop offset="1" stop-color="#e5eaf0" stop-opacity=".3"/></radialGradient>
      <radialGradient id="pst-gl" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="pst-lamp" cx=".62" cy="0" r=".8"><stop offset="0" stop-color="#fff2d0" stop-opacity=".5"/><stop offset=".5" stop-color="#ffe9b8" stop-opacity=".12"/><stop offset="1" stop-color="#ffe9b8" stop-opacity="0"/></radialGradient>
      <radialGradient id="pst-sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="pst-duct" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e8ee"/><stop offset=".45" stop-color="#8b95a2"/><stop offset="1" stop-color="#3d4551"/></linearGradient>
      <linearGradient id="pst-fan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f9aa8"/><stop offset=".5" stop-color="#4c5662"/><stop offset="1" stop-color="#252b33"/></linearGradient>
      <linearGradient id="pst-vig" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
    </defs>
    <rect width="${SW}" height="${SH}" fill="url(#pst-wall)"/>
    <g opacity=".5" stroke="#0a0e14" stroke-width="2">${[60, 124, 188, 252, 316].map(y => `<line x1="0" y1="${y}" x2="${SW}" y2="${y}"/>`).join('')}</g>
    <g opacity=".5"><rect x="${SW - 190}" y="70" width="150" height="120" fill="#10161f" stroke="#2c3646" stroke-width="3"/><rect x="${SW - 182}" y="78" width="134" height="104" fill="#16202c"/><g stroke="#2c3646" stroke-width="2"><line x1="${SW - 115}" y1="78" x2="${SW - 115}" y2="182"/><line x1="${SW - 182}" y1="130" x2="${SW - 48}" y2="130"/></g></g>
    <g opacity=".55" fill="#0a0e14"><rect x="${SW - 330}" y="150" width="64" height="130" rx="3"/><rect x="40" y="90" width="120" height="8" rx="2"/><g fill="#26303e"><rect x="48" y="62" width="10" height="28"/><rect x="66" y="70" width="8" height="20"/><rect x="82" y="58" width="12" height="32"/><rect x="104" y="72" width="8" height="18"/></g></g>
    <rect y="${FLOOR - 30}" width="${SW}" height="${SH - FLOOR + 30}" fill="url(#pst-floor)"/>
    <rect y="${FLOOR - 30}" width="${SW}" height="2" fill="#000" opacity=".6"/>
    <ellipse cx="${SW * .55}" cy="${FLOOR + 10}" rx="360" ry="26" fill="#fff" opacity=".06"/>
    <!-- Deckenluftkanal rechts -->
    <rect x="${SW - 300}" y="14" width="300" height="24" fill="url(#pst-duct)" stroke="#262d37" stroke-width="1.5"/><g stroke="#262d37" stroke-width="1.5" opacity=".7">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${SW - 280 + i * 40}" y1="14" x2="${SW - 280 + i * 40}" y2="38"/>`).join('')}</g>
    <rect x="${SW - 52}" y="32" width="34" height="9" rx="2" fill="#6f7987" stroke="#262d37"/>
    <!-- Rampe, Plattform -->
    <path d="M${ramp - 56} ${FLOOR} L${ramp} ${PT} L${ramp} ${FLOOR}Z" fill="#3a424d" stroke="#1a1f26" stroke-width="2"/><path d="M${ramp - 56} ${FLOOR} L${ramp} ${PT}" stroke="#aab4c0" stroke-width="2" opacity=".55"/>
    <ellipse cx="${(ramp + SW - 12) / 2}" cy="${FLOOR + 3}" rx="${(SW - ramp) / 2 + 30}" ry="9" fill="url(#pst-sh)"/>
    <rect x="${ramp}" y="${PT}" width="${SW - 12 - ramp}" height="${FLOOR - PT}" fill="url(#pst-pl)" stroke="#1a1f26" stroke-width="2"/>
    <rect x="${ramp}" y="${PT}" width="${SW - 12 - ramp}" height="3" fill="#cfd7e0" opacity=".5"/>
    
    <g opacity=".95">${Array.from({length: Math.floor((SW - 12 - ramp) / 16)}, (_, i) => `<path d="M${ramp + i * 16} ${FLOOR} l8 -9 h8 l-8 9z" fill="${i % 2 ? '#1d1d1d' : '#f2b705'}"/>`).join('')}</g>
    <g opacity=".35" stroke="#0e1217" stroke-width="1.2">${Array.from({length: 24}, (_, i) => `<line x1="${ramp + 18 + i * 22}" y1="${PT + 6}" x2="${ramp + 12 + i * 22}" y2="${PT + 20}"/>`).join('')}</g>
    <!-- Rollenschlitz -->
    <rect x="${RX - RR - 12}" y="${PT - 1}" width="${RR * 2 + 24}" height="7" fill="#07090c"/>
    ${roller}
    <rect x="${RX - RR - 12}" y="${PT - 2}" width="12" height="5" fill="#cfd7e0" opacity=".6"/><rect x="${RX + RR}" y="${PT - 2}" width="12" height="5" fill="#cfd7e0" opacity=".6"/>
    <!-- Kontaktschatten -->
    <ellipse cx="${RX}" cy="${RT + 3}" rx="${R * .55}" ry="3.5" fill="#000" opacity=".5"/><ellipse cx="${frontX}" cy="${PT + 3}" rx="${R * .6}" ry="3.5" fill="#000" opacity=".55"/>
    <!-- Vorderrad-Klemme (Radwippe) -->
    <g transform="translate(${frontX} ${PT})"><rect x="-52" y="-5" width="104" height="6" rx="2" fill="#3b434e" stroke="#12161c"/>
      <path d="M-46 -5 L-26 -5 L-22 -26 L-40 -26Z" fill="#c9a128" stroke="#12161c" stroke-width="1.2"/><path d="M26 -5 L46 -5 L40 -26 L22 -26Z" fill="#c9a128" stroke="#12161c" stroke-width="1.2"/>
      <path d="M-34 -26 L-34 -44 M34 -26 L34 -44" stroke="#9aa5b2" stroke-width="3.4" stroke-linecap="round"/><circle cx="-34" cy="-44" r="4" fill="#d63b2c" stroke="#12161c"/><circle cx="34" cy="-44" r="4" fill="#d63b2c" stroke="#12161c"/></g>
    <!-- Fahrzeug -->
    <g class="pst-vib"><g transform="translate(${RX} ${RT - R}) rotate(${tilt.toFixed(2)})">${vehicleSvg(id, ccm)}${strapsSvg(o, id)}</g></g>
    <!-- Lüfter -->
    ${fanSvg(fanX, FLOOR, id)}
    <!-- Absaugschlauch (Pfad wird vom Skript gesetzt) -->
    <g class="pst-hose"></g>
    <!-- Licht: Deckenlampe, Vignette -->
    <rect width="${SW}" height="${SH}" fill="url(#pst-lamp)" pointer-events="none"/>
    <rect width="${SW}" height="${SH}" fill="url(#pst-vig)" pointer-events="none"/>
    </svg>`;
  }

  function strapsSvg(o, id) {
    // zwei Spanngurte: vorn vom Lenker/Gabel zur Plattform, hinten vom Heck zur Plattform; je mit Ratsche
    const wb = o.wb * SC, g = o.R + 10;
    let fr = id === 'klapp' ? [-192, -150] : o.type === 'duo' ? [-wb + 4, -92] : [-190, -132], ba = o.type === 'duo' ? [40, -42] : [48, -58];
    if (window.PSTART && PSTART.anch[id]) { fr = PSTART.anch[id].fr; ba = PSTART.anch[id].ba }
    const strap = (a, b, c) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      return `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#2a1a05" stroke-width="6.4" stroke-linecap="round"/><path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/><path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#fff" stroke-opacity=".25" stroke-width="1" stroke-dasharray="3 5"/>
      <g transform="translate(${mx} ${my}) rotate(${ang})"><rect x="-10" y="-5.5" width="20" height="11" rx="2" fill="url(#pst-ch)" stroke="#2a323c"/><rect x="-6" y="-2.5" width="12" height="5" fill="#2a323c"/></g><circle cx="${b[0]}" cy="${b[1]}" r="4" fill="#3a424d" stroke="#12161c"/>` };
    return strap(fr, [fr[0] - 22, g + 2], '#e6720f') + strap(ba, [ba[0] + 22, g - 2], '#e6720f');
  }

  function fanSvg(x, fl, id) {
    const cy = fl - 104;
    let bl = ''; for (let i = 0; i < 5; i++) bl += `<path d="M0 0 C14 -8 46 -10 54 -2 C46 6 14 8 0 0Z" transform="rotate(${i * 72})"/>`;
    let gr = ''; for (let r = 18; r <= 58; r += 13) gr += `<circle r="${r}"/>`; for (let i = 0; i < 12; i++) gr += `<line x1="0" y1="0" x2="${(60 * Math.cos(i * Math.PI / 6)).toFixed(1)}" y2="${(60 * Math.sin(i * Math.PI / 6)).toFixed(1)}"/>`;
    return `<g class="pst-fan" transform="translate(${x} 0)">
      <path d="M-22 ${fl} L0 ${cy + 40} L22 ${fl}Z" fill="#20262e" stroke="#0b0f15" stroke-width="1.4"/><rect x="-26" y="${fl - 6}" width="52" height="6" rx="2" fill="#2f3640" stroke="#0b0f15"/>
      <path d="M-16 ${cy - 58} L26 ${cy - 56} L26 ${cy + 56} L-16 ${cy + 58} Q-26 ${cy} -16 ${cy - 58}Z" fill="url(#pst-fan)" stroke="#0b0f15" stroke-width="1.6"/>
      <g transform="translate(26 ${cy}) scale(.34 1)"><circle r="60" fill="#12161c" stroke="#4a5360" stroke-width="5"/>
        <g class="fn-b" opacity=".0"><circle r="55" fill="#aab4c0" opacity=".14"/></g>
        <g class="fn-s" fill="#7b8592" stroke="#12161c" stroke-width="1.6">${bl}</g><circle r="9" fill="#cfd7e0" stroke="#12161c" stroke-width="2"/>
        <g fill="none" stroke="#c0c8d2" stroke-width="1.5" opacity=".75">${gr}</g></g>
    </g>`;
  }

  // ---------- Messrechner (HTML) ----------
  function monitorHtml(kl) {
    return `<div class="pst-mon"><div class="pst-mh"><b>MESSRECHNER</b><span class="pst-ph">Bereit</span></div>
      <svg class="pst-cv" viewBox="0 0 320 190" preserveAspectRatio="none"><rect width="320" height="190" fill="#06100c"/><g class="pst-grid"></g><path class="pst-base" fill="none" stroke="#6b7a72" stroke-width="1.6" stroke-dasharray="4 3"/><path class="pst-need" fill="none" stroke="#ff8a6b" stroke-width="2.2"/><path class="pst-nm" fill="none" stroke="#4fd1ff" stroke-width="2"/><path class="pst-ps" fill="none" stroke="#ffb03a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><line class="pst-cur" y1="14" y2="166" stroke="#ffd24a" stroke-width="1" stroke-dasharray="3 3" opacity="0"/><circle class="pst-dot" r="4.5" fill="#fff" opacity="0"/></svg>
      <div class="pst-ro"><div><small>${kl ? 'Kadenz' : 'Drehzahl'}</small><b class="r-rpm">0</b><i>U/min</i></div><div><small>${kl ? 'Muskelkraft' : 'Leistung'}</small><b class="r-ps">0,0</b><i class="u-ps">${kl ? 'W' : 'PS'}</i></div><div><small>${kl ? 'Widerstand' : 'Drehmoment'}</small><b class="r-nm">0,0</b><i class="u-nm">${kl ? 'W' : 'Nm'}</i></div><div><small>Tempo</small><b class="r-v">0</b><i>km/h</i></div><div><small>${kl ? 'Übers.' : 'Gang'}</small><b class="r-g">–</b><i></i></div></div>
      <div class="pst-st"><span data-p="0">Leerlauf</span><span data-p="1">${kl ? 'Anrollen' : 'Warmfahren'}</span><span data-p="2">${kl ? 'Steigerung' : 'Hochlauf'}</span><span data-p="3">Messlauf</span><span data-p="4">Auslaufen</span></div></div>`;
  }

  // ---------- Kontext: welches Fahrzeug mit welchen Teilen ----------
  function ctxNow() {
    try {
      const c = (view === 'w2' && W2.veh) ? W2.cars[W2.veh] : null;
      const id = view === 'pr' ? (W2.sel || 's51') : (c ? W2.veh : null);
      if (!id || !VEH[id]) return null;
      const cc = view === 'pr' ? W2.cars[id] : c;
      if (id === 'klapp') { const pick = cc ? cc.pick : KORIG, jet = cc ? cc.jet : 30, p = kperf(pick, jet, !!(cc && cc.lamp)), base = kBase(); return {id, kl: true, p, base, pick, jet, ccm: 0}; }
      const v = V2V[id], pick = cc ? cc.pick : ORIGP, jet = cc ? cc.jet : 70, p = w2perf(v, pick, jet), base = w2perf(v, ORIGP, 70);
      return {id, kl: false, p, base, pick, jet, ccm: p.ccm, v};
    } catch (e) { return null }
  }

  // ---------- Ein Modell fuer Live, Kurve und Ergebnis ----------
  // Moped: P(r) in PS, M(r) = P/omega in Nm (PS = Nm * U/min / 7023,6). Maximum von P liegt exakt bei p.peak mit Wert p.ps;
  // das Drehmomentmaximum liegt rechnerisch bei niedrigerer Drehzahl. Live-Anzeige, Kurve (Monitor) und Ergebnis lesen NUR dieses Modell.
  const PS_NM = 735.5 * 60 / (2 * Math.PI);   // = 7023,6: PS = Nm * U/min / PS_NM
  function modelOf(p) {
    const pk = p.peak, wd = p.width, ps = p.ps;
    const P = r => ps * (.18 + .82 * Math.exp(-Math.pow((r - pk) / wd, 2))) * (r < 3000 ? clamp((r - 1500) / 1500, 0, 1) : 1);
    const M = r => r > 500 ? P(r) * PS_NM / r : 0;
    const lim = Math.min(pk + 1900, 10200), r0 = 3200;       // lim = Abregeldrehzahl
    const sweep = () => { const a = []; let did = false; for (let r = r0; r <= lim; r += 50) { if (!did && r >= pk) { a.push([pk, P(pk), M(pk)]); did = true } if (r !== pk) a.push([r, P(r), M(r)]) } return a };
    return {pk, ps, P, M, lim, r0, sweep};
  }

  // ---------- Simulation ----------
  const P = {  // aktueller Lauf
    st: null, host: null
  };

  function makeSim(cx) {
    const o = VEH[cx.id], kl = cx.kl, p = cx.p, G = o.gears;
    const mod = kl ? null : modelOf(p), pk = kl ? 0 : mod.pk, ps = kl ? 0 : mod.ps;
    const Pof = r => mod.P(r);
    const rpmV = pk * 1.04;                   // Drehzahl bei Höchstgeschwindigkeit im letzten Gang
    const rpmEnd = kl ? 0 : mod.lim;          // Abregeldrehzahl
    const s = {
      t: 0, tp: 0, ph: 0, rpm: kl ? 0 : 1300, load: .08, gear: kl ? 1 : 1, v: 0, cad: 0, wa: 0, ra: 0, ca: 0, fa: 0, fw: 0, cut: 0, vib: 0,
      curve: [], nm: [], need: [], rmax: 0, smoke: 0, fat: 1, done: false, noise: 0, pop: 0, fanOn: false, sh: false
    };
    s.fanOn = true;
    const rollRatio = (o.R / SC) / (RR / SC);    // Rolle dreht schneller als das Rad (Verhältnis der Radien)
    s.step = function (dt) {
      s.t += dt; s.tp += dt; s.fa += s.fw * 3.4 * dt * 360; s.fw += ((s.fanOn ? 1 : 0) - s.fw) * Math.min(1, dt * (s.fanOn ? 1.4 : .5));
      s.pop = 0;
      if (kl) return stepK(dt);
      const last = G.length;
      const accel = (r, g) => 900 * Math.sqrt(Math.max(.5, ps / 3.7)) * (.28 + Pof(r) / ps) * [2.4, 1.8, 1.35, 1][g - 1 + (4 - last) * 0] * (last === 3 ? [1, 1.1, 1.0][0] : 1);
      switch (s.ph) {
        case 0: // Leerlauf
          s.rpm = 1300 + Math.sin(s.t * 7) * 40 + (Math.random() - .5) * 60; s.load = .08; s.v = 0;
          if (s.tp > 1.3) { s.ph = 1; s.tp = 0; s.gear = 1 }
          s.live = false;
          break;
        case 1: { // Warmfahren: Gang 1 und 2, Teillast
          s.load = .4; s.live = false; const tgt = s.gear === 1 ? 3600 : 3500;
          s.rpm += (tgt - s.rpm) * Math.min(1, dt * 1.4) + 120 * dt;
          s.v = gv(s.rpm, s.gear);
          if (s.gear === 1 && s.rpm > 3300) { shift(2, .3) }
          if (s.gear === 2 && s.tp > 2.6) { s.ph = 2; s.tp = 0; s.curve = []; s.nm = []; s.rmax = 0; shift(Math.min(2, last), .25) }
          break; }
        case 2: case 3: { // Vollgas durch die Gänge; im letzten Gang Messlauf
          if (s.cut > 0) { s.cut -= dt; s.load = .05; s.live = false; s.v = gv(s.rpm, s.gear); if (s.cut <= 0) s.load = 1; break }
          s.load = 1; const r1 = s.rpm; s.rpm += accel(s.rpm, s.gear) * dt;
          if (r1 < pk && s.rpm >= pk) s.rpm = pk;                 // Spitzenwert exakt treffen
          s.rpm = Math.min(s.rpm, rpmEnd); s.v = gv(s.rpm, s.gear);
          const lim = s.gear === last ? rpmEnd : Math.min(pk + 600, 9400, rpmEnd);
          s.live = true;
          if (s.gear === last) s.ph = 3;
          if (s.rpm >= mod.r0 && s.rpm > s.rmax) { s.rmax = s.rpm; s.curve.push([s.rpm, mod.P(s.rpm)]); s.nm.push([s.rpm, mod.M(s.rpm)]) }
          if (s.rpm >= lim) { if (s.gear < last) { s.gear++; s.rpm = s.rpm * G[s.gear - 1] / G[s.gear - 2]; shift(s.gear, .32, true) } else { s.ph = 4; s.tp = 0; s.vOut = s.v; s.load = 0; s.pop = 1; s.popN = (s.popN || 0) + 1; s.rOut = s.rpm } }
          break; }
        case 4: { // Auslaufen: Gas zu, Kupplung ziehen, Rolle läuft aus
          s.load = 0; const k = s.tp; s.live = false; s.rpm = Math.min(rpmEnd, 1350 + (s.rOut - 1350) * Math.exp(-k * 2.6) + Math.sin(s.t * 6) * 30); s.v = s.vOut * Math.exp(-k / 2.6);
          if (k < 1.6 && Math.random() < dt * 6 * Math.min(1, (p.kerze === 'schwarz' ? .6 : 1))) s.pop = 1; s.popN = (s.popN || 0) + 1;
          if (s.v < .4 && k > 4.5) { s.ph = 5; s.tp = 0; s.v = 0 }
          break; }
        case 5: s.live = false; s.rpm = 1300 + Math.sin(s.t * 7) * 35; s.v = 0; s.load = .08; if (s.tp > 1.2) { s.done = true } break;
      }
      advance(dt);
    };
    function gv(r, g) { return clamp(p.vmax * (r / rpmV) * G[G.length - 1] / G[g - 1], 0, p.vmax * 1.2) }
    function shift(g, t, snd) { s.gear = g; s.cut = t; s.sh = true; if (snd) s.shiftEv = true }
    function advance(dt) {
      const rpsW = s.v / 3.6 / (2 * Math.PI * (o.R / SC)); s.wa += rpsW * dt * 360; s.ra += rpsW * rollRatio * dt * 360; s.rpsW = rpsW;
      s.vib = kl ? 0 : (.25 + s.load * .5) * clamp(s.rpm / 7000, .15, 1.3);
    }
    function stepK(dt) {
      const pr = cx.p, v0 = o.R / SC;
      switch (s.ph) {
        case 0: s.cad = 0; s.v = 0; if (s.tp > 1.2) { s.ph = 1; s.tp = 0 } break;
        case 1: s.cad = 60 * Math.min(1, s.tp / 3); s.load = .3; s.v = pr.vOf(s.cad) * 3.6; { const vv = s.v / 3.6; if (vv > 0) { s.curve.push([s.v, pr.avail(vv)]); s.need.push([s.v, pr.need(vv) * KETA]) } } if (s.tp > 3.2) { s.ph = 2; s.tp = 0 } break;
        case 2: case 3: { const cmax = Math.min(125, Math.max(70, pr.cadMax * .98 || 100)); s.cad = 60 + (cmax - 60) * Math.min(1, s.tp / 6.5); s.load = 1; s.v = pr.vOf(s.cad) * 3.6; s.ph = 3;
          const vv = s.v / 3.6; s.curve.push([s.v, pr.avail(vv)]); s.need.push([s.v, pr.need(vv) * KETA]);
          if (s.tp > 6.6) { s.ph = 4; s.tp = 0; s.vOut = s.v; s.cOut = s.cad } break; }
        case 4: s.load = 0; s.cad = 0; s.v = s.vOut * Math.exp(-s.tp / 3.4); if (s.v < .5 && s.tp > 4.5) { s.ph = 5; s.tp = 0; s.v = 0 } break;
        case 5: s.v = 0; if (s.tp > 1) s.done = true; break;
      }
      s.rpm = s.cad;
      const rpsW = s.v / 3.6 / (2 * Math.PI * v0); s.wa += rpsW * dt * 360; s.ra += rpsW * rollRatio * dt * 360; s.rpsW = rpsW;
      s.ca += s.cad / 60 * 360 * dt; s.vib = 0;
    }
    // Anzeigewerte: einzige Quelle fuer Messrechner-Zahlen (Live) und Ergebnis
    s.liveVals = function () {
      if (kl) { const vv = s.v / 3.6, on = s.ph >= 1 && s.ph <= 3; return {rpm: s.cad, ps: on ? p.avail(vv) : 0, nm: on ? p.need(vv) * KETA : 0} }
      return {rpm: s.rpm, ps: s.live && s.ph >= 2 && s.ph <= 3 ? mod.P(s.rpm) : 0, nm: s.live && s.ph >= 2 && s.ph <= 3 ? mod.M(s.rpm) : 0};
    };
    s.result = function () { let m = null, mn = null; for (const a of s.curve) { if (!m || a[1] > m[1]) m = a } for (const a of s.nm) { if (!mn || a[1] > mn[1]) mn = a } return {ps: m ? m[1] : 0, rpm: m ? m[0] : 0, nm: mn ? mn[1] : 0, nmRpm: mn ? mn[0] : 0} };
    s.mod = mod;
    return s;
  }

  // ---------- Szene-Controller ----------
  function mount(la, cx) {
    if (!la || la.querySelector('.pst')) return null;
    if (window.PSTART) PSTART.cur = cx.pick || null;   // Teilewahl (Schrauben, Sitzbank) für die Zeichnung
    const host = document.createElement('div'); host.className = 'pst' + (cx.kl ? ' kl' : '');
    host.innerHTML = `<div class="pst-sw"><div class="pst-sc-w">${sceneSvg(cx.id, cx.ccm)}<canvas class="pst-cn"></canvas></div></div>${monitorHtml(cx.kl)}`;
    const dy = la.querySelector('.dynor'); if (dy) dy.remove(); la.insertBefore(host, la.firstChild);
    la.classList.add('pst-on'); if (!cx.kl) la.classList.add('pst-m');
    return setup(host, cx);
  }

  function setup(host, cx) {
    const o = VEH[cx.id], kl = cx.kl, p = cx.p, base = cx.base;
    const q = s => host.querySelector(s), qa = s => [...host.querySelectorAll(s)];
    const cv = q('.pst-cn'), svg = q('.pst-sc');
    const wb = o.wb * SC, tilt = -Math.atan2(PT - RT, wb), cs = Math.cos(tilt), sn = Math.sin(tilt);
    const lx = o.ex[0], ly = o.ex[1];   // Auspuffende relativ zur Hinterachse
    const T = {x: RX + lx * cs - ly * sn, y: RT - o.R + lx * sn + ly * cs};
    const hosePt = {p0: [T.x + 10, T.y], p1: [T.x + 80, T.y + 6], p2: [SW - 30, T.y - 60], p3: [SW - 35, 40]};
    const bz = u => { const a = 1 - u, [P0, P1, P2, P3] = [hosePt.p0, hosePt.p1, hosePt.p2, hosePt.p3]; return [a * a * a * P0[0] + 3 * a * a * u * P1[0] + 3 * a * u * u * P2[0] + u * u * u * P3[0], a * a * a * P0[1] + 3 * a * a * u * P1[1] + 3 * a * u * u * P2[1] + u * u * u * P3[1]] };
    const hd = `M${hosePt.p0[0]} ${hosePt.p0[1]} C${hosePt.p1[0]} ${hosePt.p1[1]} ${hosePt.p2[0]} ${hosePt.p2[1]} ${hosePt.p3[0]} ${hosePt.p3[1]}`;
    if (!kl) q('.pst-hose').innerHTML = `<path d="${hd}" fill="none" stroke="#12161c" stroke-width="17" stroke-linecap="round"/><path d="${hd}" fill="none" stroke="#6d7886" stroke-width="14.5" stroke-linecap="round"/><path d="${hd}" fill="none" stroke="#c4ccd6" stroke-width="12" stroke-dasharray="2.2 3.6"/><path d="${hd}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2.2" transform="translate(-2.5 -2.5)"/>
      <path d="M${T.x - 4} ${T.y - 7} L${T.x + 14} ${T.y - 12} L${T.x + 14} ${T.y + 12} L${T.x - 4} ${T.y + 7}Z" fill="url(#pst-ch)" stroke="#2a323c" stroke-width="1.4"/><rect x="${T.x + 12}" y="${T.y - 11}" width="5" height="22" rx="1.5" fill="#d63b2c" stroke="#2a323c"/>`;
    // Kette Klapprad
    const chain = () => { const g = q('.chn'); if (!g) return; const R0 = 19, r0 = 7, bx = -97, by = -3; g.setAttribute('d', `M${bx} ${by - R0} L0 ${-r0} M${bx} ${by + R0} L0 ${r0}`) }; chain();
    // Elemente
    const E = {vib: q('.pst-vib'), rwS: q('.rw-s'), rwT: q('.rw-t'), rwB: q('.rw-b'), rwBs: q('.rw-bs'), roT: q('.ro-t'), roB: q('.ro-b'), fnS: q('.fn-s'), fnB: q('.fn-b'), cra: q('.cra'), pd1: q('.pd1'), pd2: q('.pd2')};
    // Kurve (Monitor)
    const ps = q('.pst-ps'), nm = q('.pst-nm'), nd = q('.pst-need'), bs = q('.pst-base'), cur = q('.pst-cur'), dot = q('.pst-dot'), gridG = q('.pst-grid');
    const CW = 320, CH = 190, L = 34, B = 22, TT = 14;
    let xs, ys, ys2, xmin, xmax, ymax, y2max;
    if (kl) { xmin = 0; xmax = 50; ymax = Math.max(300, Math.ceil(Math.max(p.need(50 / 3.6), p.avail(p.vmax / 3.6 || 1), base.pm(8) + 100) / 100) * 100); y2max = ymax }
    else { xmin = 2000; xmax = Math.max(9000, Math.ceil((p.peak + 2200) / 1000) * 1000); ymax = 2 * Math.ceil(Math.max(p.ps, base.ps) * 1.2 / 2); y2max = Math.max(6, Math.ceil(Math.max(...modelOf(p).sweep().map(a => a[2])) * 1.25)) }
    xs = x => L + (x - xmin) / (xmax - xmin) * (CW - L - 8); ys = y => CH - B - clamp(y, 0, ymax) / ymax * (CH - B - TT); ys2 = y => CH - B - clamp(y, 0, y2max) / y2max * (CH - B - TT);
    let gg = ''; for (let i = 0; i <= 4; i++) { const yy = CH - B - i / 4 * (CH - B - TT); gg += `<line x1="${L}" x2="${CW - 8}" y1="${yy}" y2="${yy}" stroke="#2f5a46" stroke-width=".7"/><text x="${L - 4}" y="${yy + 3}" fill="#ffb03a" font-size="9" text-anchor="end">${kl ? Math.round(i * ymax / 4) : de(i * ymax / 4, 1)}</text>${kl ? '' : `<text x="${CW - 2}" y="${yy + 3}" fill="#4fd1ff" font-size="8" text-anchor="end" opacity=".8">${de(i * y2max / 4, 0)}</text>`}` }
    const stp = kl ? 10 : 1000; for (let x = Math.ceil(xmin / stp) * stp; x <= xmax; x += stp) gg += `<line x1="${xs(x)}" x2="${xs(x)}" y1="${TT}" y2="${CH - B}" stroke="#2f5a46" stroke-width=".5"/><text x="${xs(x)}" y="${CH - 8}" fill="#9fb8aa" font-size="9" text-anchor="middle">${kl ? x : x / 1000 + 'k'}</text>`;
    gg += `<text x="${L + 2}" y="10" fill="#9fb8aa" font-size="8.5">${kl ? 'Watt über km/h (orange: Muskel, rot: Widerstand)' : 'PS (orange) und Nm (blau) über U/min'}</text>`; gridG.innerHTML = gg;
    const pathOf = (pts, X, Y) => pts.length ? pts.map((a, i) => (i ? 'L' : 'M') + X(a[0]).toFixed(1) + ' ' + Y(a[1]).toFixed(1)).join('') : '';
    // Serien-Kurve gestrichelt
    (function () { let d = ''; if (kl) { for (let k = 0; k <= 60; k++) { const v = k * 50 / 60; d += (k ? 'L' : 'M') + xs(v).toFixed(1) + ' ' + ys(base.need(v / 3.6)).toFixed(1) } } else { const bm = modelOf(base); for (let r = xmin; r <= xmax; r += 250) { const vv = bm.P(r); d += (r > xmin ? 'L' : 'M') + xs(r).toFixed(1) + ' ' + ys(vv).toFixed(1) } } bs.setAttribute('d', d) })();
    // Canvas / Partikel
    const ctx2 = cv.getContext('2d');
    const spr = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.35, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c })();
    const parts = [], wind = [];
    const sim = makeSim(cx);
    const fat = kl ? 0 : (p.kerze === 'schwarz' ? clamp(1.2 + (cx.jet - p.ideal - 4) * .1, 1.2, 2.2) : p.kerze === 'weiß' ? .35 : 1);
    const ST = {sim, host, cx, raf: 0, last: 0, frame: 0, stop: false, sound: null};
    const bsz = () => { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); const w = Math.max(2, Math.round(r.width * d)), h = Math.max(2, Math.round(r.height * d)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h } return w / SW };
    function emit(dt) {
      if (kl) return; const k = sim.ph; if (k >= 5 || k === 0 && false) return;
      const rate = (sim.ph === 0 ? 7 : 6 + 22 * clamp(sim.rpm / 8000, 0, 1.2)) * (.55 + .45 * (1 - sim.load * .6)) * fat * (RM() ? 0 : 1);
      let n = rate * dt; n = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0);
      if (sim.pop) n += 3;
      for (let i = 0; i < n; i++) {
        const sucked = Math.random() < (fat > 1.5 ? .62 : .75);
        parts.push({m: sucked ? 1 : 0, x: T.x + 6, y: T.y, vx: rnd(10, 36) + sim.rpm / 400, vy: rnd(-10, 4), r: rnd(3, 6), a: rnd(.10, .2) * Math.min(1.5, fat * .8 + .2), u: 0, life: 0, mx: rnd(.9, 1.2), d: fat > 1.5 ? .78 : .92});
      }
      if (parts.length > 320) parts.splice(0, parts.length - 320);
    }
    function wind1(dt) {
      if (sim.fw < .1) return; if (Math.random() < dt * 22 * sim.fw) wind.push({x: fanXc + 14, y: FLOOR - 104 + rnd(-44, 44), l: rnd(26, 60), v: rnd(380, 520), a: rnd(.05, .12)});
      for (let i = wind.length - 1; i >= 0; i--) { const w = wind[i]; w.x += w.v * dt; if (w.x > RX - 10) wind.splice(i, 1) }
    }
    const fanXc = Math.max(46, (RX - wb - o.R - 36) - 120) + 26;
    function upd(dt) {
      for (let i = parts.length - 1; i >= 0; i--) {
        const q1 = parts[i]; q1.life += dt;
        if (q1.m) { // abgesaugt: entlang des Schlauchs
          q1.u += dt * (.10 + q1.life * .85); const pp = bz(Math.min(1, q1.u)); q1.x += (pp[0] - q1.x) * Math.min(1, dt * 14); q1.y += (pp[1] - q1.y) * Math.min(1, dt * 14); q1.r += dt * 4;
          if (q1.u >= 1) parts.splice(i, 1);
        } else { q1.vx += (sim.fw * 40 - q1.vx * .5) * dt; q1.vy -= dt * 14; q1.x += q1.vx * dt; q1.y += q1.vy * dt; q1.r += dt * 16 * q1.mx; if (q1.life > 3.4 || q1.x > SW + 40) parts.splice(i, 1) }
      }
    }
    function drawSmoke(k) {
      for (const q1 of parts) {
        let a = q1.a; if (q1.m) { a *= q1.u < .15 ? 1 : Math.max(0, 1 - (q1.u - .15) / .85) * .8 } else a *= Math.max(0, 1 - q1.life / 3.4) * Math.min(1, q1.life * 5 + .3);
        if (a <= .004) continue; ctx2.globalAlpha = Math.min(.9, a); const r = q1.r * k * 1.5; ctx2.drawImage(spr, q1.x * k - r, q1.y * k - r, r * 2, r * 2);
      }
      ctx2.globalAlpha = 1;
    }
    function drawWind(k) { ctx2.lineCap = 'round'; for (const w of wind) { ctx2.strokeStyle = `rgba(215,228,245,${w.a})`; ctx2.lineWidth = 1.6 * k; ctx2.beginPath(); ctx2.moveTo((w.x - w.l) * k, w.y * k); ctx2.lineTo(w.x * k, w.y * k); ctx2.stroke() } }
    // Rendern
    const rot = (el, a) => { if (el) el.setAttribute('transform', 'rotate(' + a.toFixed(1) + ')') };
    const f2 = (x, d) => (+x).toFixed(d).replace('.', ',');
    function render() {
      const s = sim, k = bsz();
      // Rad: Speichen verschwimmen oberhalb von ca. 3 U/s, Rolle ab ca. 5 U/s; Drehwinkel wird bei Unschärfe begrenzt (kein Wagenradeffekt)
      const rps = s.rpsW || 0, bw = clamp((rps - 2.6) / 4, 0, 1), rr = rps * 2.4, br = clamp((rr - 4) / 6, 0, 1);
      const wa = s.wa % 360, ra = s.ra % 360;
      rot(E.rwS, -wa); rot(E.rwT, -wa); if (E.rwS) E.rwS.setAttribute('opacity', (1 - bw * .92).toFixed(2)); if (E.rwT) E.rwT.setAttribute('opacity', (1 - bw).toFixed(2));
      if (E.rwB) { E.rwB.setAttribute('opacity', bw.toFixed(2)); if (E.rwBs) E.rwBs.setAttribute('transform', 'rotate(' + (-(s.t * 260) % 360).toFixed(1) + ')') }
      rot(E.roT, ra); if (E.roT) E.roT.setAttribute('opacity', (1 - br).toFixed(2)); if (E.roB) E.roB.setAttribute('opacity', br.toFixed(2));
      rot(E.fnS, s.fa); if (E.fnB) E.fnB.setAttribute('opacity', clamp(s.fw * .9, 0, .9).toFixed(2)); if (E.fnS) E.fnS.setAttribute('opacity', (1 - s.fw * .5).toFixed(2));
      if (kl) { const a = -(s.ca % 360); if (E.cra) E.cra.setAttribute('transform', 'rotate(' + (-a).toFixed(1) + ')'); if (E.pd1) E.pd1.setAttribute('transform', 'translate(0 36) rotate(' + a.toFixed(1) + ')'); if (E.pd2) E.pd2.setAttribute('transform', 'translate(0 -36) rotate(' + a.toFixed(1) + ')') }
      if (E.vib) { const v = s.vib, dx = (Math.random() - .5) * v * .9, dy = (Math.random() - .5) * v * 1.2; E.vib.setAttribute('transform', 'translate(' + dx.toFixed(2) + ' ' + dy.toFixed(2) + ')') }
      // Canvas
      ctx2.clearRect(0, 0, cv.width, cv.height); drawWind(k); drawSmoke(k);
      // Monitor
      if (s.curve.length && s.ph >= 3 || s.ph === 4 || s.ph === 5) { }
      if (kl) { ps.setAttribute('d', pathOf(s.curve, xs, ys)); nd.setAttribute('d', pathOf(s.need, xs, ys)) } else { ps.setAttribute('d', pathOf(s.curve, xs, ys)); nm.setAttribute('d', pathOf(s.nm, xs, ys2)) }
      const lastp = s.curve[s.curve.length - 1];
      if (lastp && (s.ph === 3 || kl && s.ph <= 3 && s.ph >= 1)) { cur.setAttribute('opacity', '.8'); cur.setAttribute('x1', xs(lastp[0])); cur.setAttribute('x2', xs(lastp[0])); dot.setAttribute('opacity', '1'); dot.setAttribute('cx', xs(lastp[0])); dot.setAttribute('cy', ys(lastp[1])) }
      else if (s.ph !== 3) { cur.setAttribute('opacity', '0'); dot.setAttribute('opacity', s.curve.length ? '0' : '0') }
      const set = (c, t) => { const e = q(c); if (e && e.textContent !== t) e.textContent = t };
      const lv = s.liveVals(), fin = s.ph >= 4 && s.curve.length, rs = fin ? s.result() : null;
      set('.r-rpm', String(Math.round(lv.rpm)));
      if (kl) { set('.r-ps', String(Math.round(fin ? rs.ps : lv.ps))); set('.r-nm', String(Math.round(fin ? 0 : lv.nm))); set('.r-g', f2(p.i, 2)) }
      else { set('.r-ps', f2(fin ? rs.ps : lv.ps, 1)); set('.r-nm', f2(fin ? rs.nm : lv.nm, 1)); set('.r-g', s.ph === 0 || s.ph >= 4 ? 'N' : String(s.gear)) }
      set('.u-ps', fin ? (kl ? 'W max' : 'PS max') : (kl ? 'W' : 'PS')); if (!kl) set('.u-nm', fin ? 'Nm max' : 'Nm');
      set('.r-v', String(Math.round(s.v)));
      host.setAttribute('data-ph', s.ph);
      const phn = kl ? ['Bereit', 'Anrollen', 'Steigerung', 'Messlauf', 'Auslaufen', 'Fertig'] : ['Leerlauf', 'Warmfahren', 'Vollgas-Hochlauf', 'Messlauf', 'Auslaufen', 'Fertig']; set('.pst-ph', s.done || s.ph === 5 ? 'Messung fertig' : phn[s.ph]);
      qa('.pst-st span').forEach(e => e.classList.toggle('on', +e.dataset.p === Math.min(4, s.ph)));
    }
    ST.render = render; ST.emit = emit; ST.upd = upd; ST.wind1 = wind1;
    ST.tick = dt => { sim.step(dt); emit(dt); wind1(dt); upd(dt) };
    ST.final = () => { // Endergebnis ohne Animation (weniger Bewegung): ganze Kurve
      const s = sim; s.curve = []; s.nm = []; s.need = [];
      if (kl) { for (let v = 6; v <= p.vmax * 1.05; v += .5) { s.curve.push([v, p.avail(v / 3.6)]); s.need.push([v, p.need(v / 3.6) * KETA]) } }
      else { for (const a of sim.mod.sweep()) { s.curve.push([a[0], a[1]]); s.nm.push([a[0], a[2]]) } }
      s.ph = 5; s.v = 0; s.rpm = kl ? 0 : 1300; s.done = true; render();
    };
    render();
    return ST;
  }

  // ---------- Lauf starten / stoppen ----------
  function stop() { const s = P.st; if (!s) return; s.stop = true; cancelAnimationFrame(s.raf); if (s.sound) { try { s.sound.stop() } catch (e) {} s.sound = null } P.st = null }
  function run(opts) {
    opts = opts || {};
    const la = document.querySelector('.lay.dy .la'); if (!la) return;
    let host = la.querySelector('.pst');
    const cx = ctxNow(); if (!cx) return;
    if (!host) { const st0 = mount(la, cx); if (!st0) return; host = st0.host; P.idle = st0 }
    const st = P.idle && P.idle.host === host ? P.idle : null; if (!st) return;
    stop(); P.st = st; st.stop = false;
    if (RM() && !opts.force) { st.final(); return }
    if (window.PSTSND && FX.on()) { try { st.sound = PSTSND.start(st, cx) } catch (e) { st.sound = null } }
    let last = performance.now(), acc = 0;
    const loop = now => {
      if (st.stop) return; if (!st.host.isConnected) { stop(); return }
      let dt = Math.min(.05, (now - last) / 1000); last = now; st.tick(dt); st.render();
      if (st.sim.done) { if (st.sound) { st.sound.stop(); st.sound = null } P.st = null; st.render(); return }
      st.raf = requestAnimationFrame(loop);
    };
    st.raf = requestAnimationFrame(loop);
  }
  // Offline-Simulation für Screenshots: bis zur Zeit T vorspulen, dann ein Bild
  function shotAt(T, force) {
    const la = document.querySelector('.lay.dy .la'); const cx = ctxNow(); if (!la || !cx) return;
    const st0 = la.querySelector('.pst') ? P.idle : mount(la, cx); if (!st0) return; P.idle = st0;
    for (let t = 0; t < T; t += 1 / 60) st0.tick(1 / 60);
    st0.render();
  }

  // ---------- Einhängen: nach jedem Rendern die Szene einsetzen ----------
  function inject() {
    const la = document.querySelector('.lay.dy .la'); if (!la) { if (P.st) stop(); P.idle = null; return }
    if (la.querySelector('.pst')) return;
    const cx = ctxNow(); if (!cx) return;
    if (P.st) stop(); P.idle = mount(la, cx);
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => { try { inject() } catch (e) { if (window.console) console.warn('pst', e) } }).observe(app, {childList: true});

  // alte Läufe ersetzen: w2Run (Moped) und kRun (Klapprad)
  const _wr = window.w2Run;
  window.w2Run = function () {
    const c = car(); if (c) { c.ran = true; w2save() } else W2.ranV = true;
    run(); setTimeout(() => { if (!document.querySelector('.vid') && (view === 'w2' || view === 'pr')) { const b = document.createElement('div'); b.innerHTML = videoBtn(); const h = document.querySelector('.lb2'); if (h) h.insertBefore(b.firstChild, h.lastElementChild && h.lastElementChild.id === 'nxd' ? h.lastElementChild : null) } }, 600);
  };
  const _kr = window.kRun;
  if (_kr) window.kRun = function () { const c = car(); if (c) { c.ran = true; w2save() } run() };
  // Probefahrt: kein Walzen-Funkenflug mehr
  window.PST = {run, stop, shotAt, VEH, inject, mount, ctxNow, modelOf, makeSim, PS_NM, P};

  // ---------- Konsistenztest (Browser-Hook #shot=pst-test, Auswertung: v2/pst-test.sh) ----------
  // Fuer alle 8 Modelle mit mehreren Tuningkombinationen: Live-Maximum == Ergebnis == Kurvenmaximum (== Modell-Spitze),
  // Live-Drehzahl <= Abregeldrehzahl, Drehmomentmaximum bei niedrigerer Drehzahl als Leistungsmaximum, PS = Nm * U/min / 7023,6.
  function selftest() {
    const out = [], bad = []; let n = 0;
    const chk = (c, msg) => { n++; if (!c) bad.push(msg) };
    const run1 = (label, cx) => {
      const sim = makeSim(cx), kl = cx.kl; let lmax = 0, rmax = 0, t = 0;
      while (!sim.done && t < 400) { sim.step(1 / 60); t += 1 / 60; const lv = sim.liveVals(); lmax = Math.max(lmax, lv.ps); if (!kl) rmax = Math.max(rmax, lv.rpm) }
      const rs = sim.result(), cmax = sim.curve.reduce((m, a) => Math.max(m, a[1]), 0);
      chk(sim.done, label + ': Lauf endet nicht');
      chk(Math.abs(lmax - rs.ps) < 1e-9, label + ': Live-Max ' + lmax + ' != Ergebnis ' + rs.ps);
      chk(Math.abs(cmax - rs.ps) < 1e-9, label + ': Kurven-Max != Ergebnis');
      if (!kl) {
        const m = sim.mod;
        chk(Math.abs(rs.ps - m.ps) < 1e-9 && rs.rpm === m.pk, label + ': Ergebnis ' + rs.ps + '@' + rs.rpm + ' != Modell ' + m.ps + '@' + m.pk + ' (App-Wert p.ps)');
        chk(rmax <= m.lim + 1e-9, label + ': Drehzahl ' + rmax + ' > Abregel ' + m.lim);
        chk(rs.nmRpm < rs.rpm, label + ': Drehmoment-Max bei ' + rs.nmRpm + ' nicht unter Leistungs-Max ' + rs.rpm);
        for (const a of sim.curve) { chk(Math.abs(a[1] * PS_NM / a[0] - m.M(a[0])) < 1e-9, label + ': M != P/omega'); }
        out.push(label + ': ' + rs.ps.toFixed(2) + ' PS @ ' + rs.rpm + ', Mmax ' + rs.nm.toFixed(2) + ' Nm @ ' + rs.nmRpm + ', lim ' + m.lim + ', rmax ' + Math.round(rmax));
      } else out.push(label + ': Max ' + rs.ps.toFixed(1) + ' W (Kurve ' + cmax.toFixed(1) + ')');
    };
    const tun = [ORIGP, {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r15'}, {zyl: 'z70', verg: 'v24', aus: 'ar', zuend: 'zv', rit: 'r17'}, {zyl: 'z85', verg: 'v24', aus: 'ar', zuend: 'ze', rit: 'r14'}, {zyl: 'z50', verg: 'v16', aus: 'as', zuend: 'zo', rit: 'r16'}, {zyl: 'z130', verg: 'v28', aus: 'ar', zuend: 'ze', rit: 'r15'}, {zyl: 'z130', verg: 'v24', aus: 'as', zuend: 'zo', rit: 'r17'}];
    Object.keys(VEH).forEach(id => {
      if (id === 'klapp') {
        [{}, {reifen: 'rs', kette: 'k50', ritzel: 'q14'}, {motor: 'mp'}, {motor: 'mv', reifen: 'rb'}].forEach((o, i) => { const pick = Object.assign({}, KORIG, o), p = kperf(pick, 30, false); run1('klapp#' + i, {id, kl: true, p, base: kBase(), pick, jet: 30, ccm: 0}) });
        return;
      }
      tun.forEach((pick, i) => { const v = V2V[id], p = w2perf(v, pick, 70), ideal = p.ideal; [70, ideal].forEach((jet, j) => { const pp = w2perf(v, pick, jet); run1(id + '#' + i + (j ? 'i' : ''), {id, kl: false, p: pp, base: w2perf(v, ORIGP, 70), pick, jet, ccm: pp.ccm}) }) });
    });
    return {n, bad, out};
  }
  window.PST.selftest = selftest;

  // ---------- Screenshot-Hooks: #shot=pst-s51 | pst-schwalbe | pst-klapprad ----------
  const mm = /shot=pst-(\w+)/.exec(location.hash); if (!mm) return;
  if (mm[1] === 'test') { setTimeout(() => { let r; try { r = selftest() } catch (e) { r = {n: 0, bad: ['Ausnahme: ' + e.message], out: []} } const pre = document.createElement('pre'); pre.id = 'pst-test'; pre.textContent = 'PSTTEST ' + (r.bad.length ? 'FEHLER' : 'OK') + ' Pruefungen=' + r.n + '\n' + r.bad.join('\n') + '\n' + r.out.join('\n'); document.body.appendChild(pre) }, 300); return }
  const kmap = {s51: 's51', schwalbe: 'kr51', klapprad: 'klapp', sr50: 'sr50', duo: 'duo', star: 'star', s50: 's50', habicht: 'habicht'}, id = kmap[mm[1]] || 's51';
  setTimeout(() => {
    try { S.points = Math.max(S.points, 300); ROTX = true } catch (e) {}
    if (id === 'klapp') { W2.cars.klapp = {ph: 5, took: [], put: [], pick: {reifen: 'rb', kette: 'k50', ritzel: 'q16', licht: 'la', hupe: 'hg', zub: 'zt', gepaeck: 'gr', motor: 'm0'}, jet: 30, drove: false}; }
    else { const tuned = {zyl: 'z60', verg: 'v19', aus: 'as', zuend: 'ze', rit: 'r15'}; const v = V2V[id], pp = w2perf(v, tuned, 70); W2.cars[id] = {ph: 5, took: [], put: [], pick: tuned, jet: pp.ideal + 10, drove: false} }
    const keep = JSON.parse(JSON.stringify(W2.cars[id]));
    W2.sel = id; view = 'pr'; render();
    setTimeout(() => {
      W2.cars[id] = JSON.parse(JSON.stringify(keep));   // andere Hooks setzen den Zustand zurück: erneut eintragen
      const old = document.querySelector('.pst'); if (old) old.remove(); P.idle = null; P.st = null;
      shotAt(id === 'klapp' ? 9 : 10.6);
    }, 400);
  }, 200);
})();
