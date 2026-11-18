// Technische Zeichnungen als SVG (selbst gezeichnete, detailreiche Illustrationen, keine Fotos).
// Fotorealistische Bilder kommen später aus ChatGPT (siehe BILD-PROMPTS.md) und werden unter img/ abgelegt.
const SVGS = {};
const INK = '#d1d1d6', DARK = '#2c2c2e', MID = '#48484a', GREY = '#8e8e93', OR = '#ff8a1f';

const DEFS = `<defs>
 <linearGradient id="gPaint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffbf73"/><stop offset=".4" stop-color="#ff8a1f"/><stop offset="1" stop-color="#a64e06"/></linearGradient>
 <linearGradient id="gChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f7fa"/><stop offset=".38" stop-color="#9c9ca1"/><stop offset=".55" stop-color="#ececf0"/><stop offset="1" stop-color="#58585c"/></linearGradient>
 <linearGradient id="gAlu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6d6db"/><stop offset=".5" stop-color="#97979c"/><stop offset="1" stop-color="#5d5d62"/></linearGradient>
 <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#64c776"/><stop offset=".45" stop-color="#2f8a43"/><stop offset="1" stop-color="#17512a"/></linearGradient>
 <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6f5e"/><stop offset=".45" stop-color="#d3382a"/><stop offset="1" stop-color="#7a1810"/></linearGradient>
 <linearGradient id="gYel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#c79a14"/></linearGradient>
 <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe9ff"/><stop offset="1" stop-color="#3d7ea0"/></linearGradient>
 <linearGradient id="gWhite" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6e6ea"/><stop offset="1" stop-color="#b3b3b9"/></linearGradient>
 <radialGradient id="gLamp" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#fff7c2"/><stop offset=".6" stop-color="#ffd60a"/><stop offset="1" stop-color="#b8860b"/></radialGradient>
</defs>`;
const svg = (body, vb = '0 0 480 270') => `<svg viewBox="${vb}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block">${DEFS}${body}</svg>`;
const f1 = n => n.toFixed(1);

// Speichenrad (Simson: 36 Speichen, Vollnabe)
function spokeWheel(cx, cy, R) {
  const rim = R * .75, hub = R * .22, n = 36; let sp = '';
  for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n, d = (i % 2 ? 1 : -1) * .36;
    sp += `M${f1(cx + hub * Math.cos(a))} ${f1(cy + hub * Math.sin(a))}L${f1(cx + rim * Math.cos(a + d))} ${f1(cy + rim * Math.sin(a + d))}` }
  let bolts = ''; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; bolts += `<circle cx="${f1(cx + hub * .62 * Math.cos(a))}" cy="${f1(cy + hub * .62 * Math.sin(a))}" r="1.1" fill="#3a3a3c"/>` }
  return `<circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="none" stroke="#101012" stroke-width="16"/>
   <circle cx="${cx}" cy="${cy}" r="${R - 1.4}" fill="none" stroke="#2f2f32" stroke-width="2.6" stroke-dasharray="3.2 2.4"/>
   <circle cx="${cx}" cy="${cy}" r="${R - 15}" fill="none" stroke="#3a3a3c" stroke-width=".8"/>
   <circle cx="${cx}" cy="${cy}" r="${rim}" fill="none" stroke="url(#gChrome)" stroke-width="3.6"/>
   <path d="${sp}" fill="none" stroke="#c9c9ce" stroke-width=".7"/>
   <circle cx="${cx}" cy="${cy}" r="${hub}" fill="url(#gAlu)" stroke="#6a6a6f" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${hub * .72}" fill="none" stroke="#6a6a6f" stroke-width=".8"/>${bolts}
   <circle cx="${cx}" cy="${cy}" r="3.4" fill="url(#gChrome)" stroke="#555" stroke-width=".6"/>`;
}
const coil = (x1, y1, x2, y2, n = 9, w = 4.5) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; let d = `M${x1} ${y1}`;
  for (let i = 1; i <= n * 2; i++) { const t = i / (n * 2), s = (i % 2 ? 1 : -1) * w; d += `L${f1(x1 + dx * t + nx * s)} ${f1(y1 + dy * t + ny * s)}` } return d + `L${x2} ${y2}` };
const bolt = (x, y, r = 1.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a4a4e" stroke="#c4c4c9" stroke-width=".5"/>`;

// ---- Simson S51 (Seitenansicht, rechte Seite)
(() => {
  let fins = '', hfins = '', i;
  for (i = 0; i < 6; i++) fins += `<rect x="-21" y="${-9 - i * 4.8}" width="42" height="2.8" rx="1" fill="url(#gAlu)" stroke="#5d5d62" stroke-width=".4"/>`;
  for (i = 0; i < 4; i++) hfins += `<rect x="-19" y="${-40 - i * 4}" width="38" height="2.4" rx="1" fill="url(#gAlu)" stroke="#5d5d62" stroke-width=".4"/>`;
  let covb = ''; for (i = 0; i < 6; i++) { const a = i * Math.PI / 3; covb += bolt(f1(232 + 18 * Math.cos(a)), f1(179 + 18 * Math.sin(a)), 1.3) }
  SVGS.simson = svg(`<ellipse cx="240" cy="237" rx="215" ry="6" fill="rgba(0,0,0,.45)"/><line x1="8" y1="235" x2="472" y2="235" stroke="#3a3a3c" stroke-width="1.5" stroke-dasharray="7 7"/>
  ${spokeWheel(90, 167, 68)}${spokeWheel(384, 167, 68)}
  <!-- Kette und Kettenräder -->
  <path d="M90 150 L176 181 M90 184 L176 200" fill="none" stroke="#2a2a2c" stroke-width="3.4"/><path d="M90 150 L176 181 M90 184 L176 200" fill="none" stroke="#8e8e93" stroke-width="1.4" stroke-dasharray="2 2"/>
  <circle cx="90" cy="167" r="17.5" fill="none" stroke="#8e8e93" stroke-width="3" stroke-dasharray="2.4 1.8"/><circle cx="176" cy="190" r="10.5" fill="none" stroke="#8e8e93" stroke-width="3" stroke-dasharray="2.4 1.8"/>
  <!-- Schwinge und Federbeine -->
  <path d="M176 184 L92 166" fill="none" stroke="#18181a" stroke-width="8" stroke-linecap="round"/><path d="M176 184 L92 166" fill="none" stroke="#3b3b3f" stroke-width="3" stroke-linecap="round"/>
  <path d="M176 198 L94 172" fill="none" stroke="#18181a" stroke-width="5" stroke-linecap="round"/>
  <path d="M120 166 L132 124" fill="none" stroke="#101012" stroke-width="7" stroke-linecap="round"/>
  <path d="${coil(131, 128, 140, 98, 8, 6)}" fill="none" stroke="#d1d1d6" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M120 166 L131 130 M140 98 L138 104" fill="none" stroke="#bfbfc4" stroke-width="3" stroke-linecap="round"/><circle cx="120" cy="167" r="3.4" fill="#d1d1d6" stroke="#333"/><circle cx="140" cy="97" r="3.4" fill="#d1d1d6" stroke="#333"/>
  <!-- Rahmen -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path d="M330 92 L216 104 L146 100" stroke="#17171a" stroke-width="8"/><path d="M330 92 L216 104 L146 100" stroke="#3d3d42" stroke-width="2.6"/>
   <path d="M330 94 L309 142 L290 186" stroke="#17171a" stroke-width="7"/><path d="M330 94 L309 142 L290 186" stroke="#3d3d42" stroke-width="2.4"/>
   <path d="M146 100 L112 96" stroke="#17171a" stroke-width="6"/><path d="M216 104 L176 140 L176 186" stroke="#17171a" stroke-width="6"/>
   <path d="M290 186 L226 208 L176 198" stroke="#17171a" stroke-width="6"/>
  </g>
  <!-- Motor-Getriebe-Einheit -->
  <rect x="170" y="150" width="94" height="58" rx="17" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="1.6"/>
  <path d="M184 154 Q220 146 252 154" fill="none" stroke="#f1f1f5" stroke-width="1.2" opacity=".6"/>
  <circle cx="232" cy="179" r="23" fill="url(#gAlu)" stroke="#47474b" stroke-width="1.6"/><circle cx="232" cy="179" r="14" fill="none" stroke="#6a6a6f" stroke-width="1"/>${covb}<circle cx="232" cy="179" r="6.5" fill="url(#gChrome)" stroke="#444" stroke-width=".8"/>
  <circle cx="176" cy="190" r="14" fill="url(#gAlu)" stroke="#47474b" stroke-width="1.4"/>${bolt(170, 184)}${bolt(182, 184)}${bolt(170, 196)}${bolt(182, 196)}
  <rect x="212" y="206" width="30" height="7" rx="3" fill="#18181a"/><path d="M218 206 L218 202" stroke="#c8c8cd" stroke-width="3"/>
  <!-- Fußschalthebel und Kickstarter -->
  <path d="M176 200 L148 212" fill="none" stroke="#d1d1d6" stroke-width="3.6" stroke-linecap="round"/><rect x="138" y="209" width="14" height="6" rx="3" transform="rotate(-24 145 212)" fill="#18181a"/>
  <path d="M200 206 L186 222 L176 226" fill="none" stroke="#d1d1d6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="164" y="222" width="18" height="7" rx="3.4" fill="#18181a"/>
  <!-- Vergaser, Ansaugschlauch, Luftfilter -->
  <path d="M182 138 C196 138 198 150 208 150" fill="none" stroke="#17171a" stroke-width="9" stroke-linecap="round"/><path d="M182 138 C196 138 198 150 208 150" fill="none" stroke="#3a3a3e" stroke-width="2.6" stroke-dasharray="3 3"/>
  <rect x="142" y="120" width="42" height="30" rx="9" fill="#26262a" stroke="#6e6e73" stroke-width="1.8"/><g stroke="#4a4a4e" stroke-width="1.2"><line x1="152" y1="126" x2="152" y2="144"/><line x1="160" y1="126" x2="160" y2="144"/><line x1="168" y1="126" x2="168" y2="144"/><line x1="176" y1="126" x2="176" y2="144"/></g>
  <rect x="204" y="142" width="23" height="18" rx="5" fill="url(#gAlu)" stroke="#3d3d42" stroke-width="1.2"/><path d="M209 160 h13 v9 q-6.5 5 -13 0z" fill="#c9a24b" stroke="#6e5416" stroke-width="1"/><rect x="211" y="138" width="9" height="6" rx="2" fill="#18181a"/><path d="M215 138 L215 106" fill="none" stroke="#111" stroke-width="1.6"/>
  <!-- Zylinder und Kopf -->
  <g transform="translate(236 168) rotate(40)"><rect x="-20" y="-7" width="40" height="7" rx="1.5" fill="url(#gAlu)" stroke="#4d4d52" stroke-width=".8"/><rect x="-14" y="-38" width="28" height="31" fill="#4a4a4f"/>${fins}
   <path d="M-17 -39 L17 -39 L15 -56 Q0 -61 -15 -56 Z" fill="url(#gAlu)" stroke="#4d4d52" stroke-width=".8"/>${hfins}${bolt(-12, -50)}${bolt(12, -50)}
   <rect x="-5.5" y="-60" width="11" height="4" rx="1" fill="url(#gChrome)"/><rect x="-3.4" y="-70" width="6.8" height="11" rx="1.4" fill="#f4f4f6" stroke="#bbb" stroke-width=".6"/><rect x="-4.2" y="-78" width="8.4" height="9" rx="2.4" fill="#141416"/>
   <path d="M0 -78 C0 -90 -16 -92 -28 -86" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round"/></g>
  <!-- Auspuff -->
  <path d="M256 164 C288 166 300 198 268 207 L172 211" fill="none" stroke="#2a2a2c" stroke-width="9" stroke-linecap="round"/><path d="M256 164 C288 166 300 198 268 207 L172 211" fill="none" stroke="#a9a9ae" stroke-width="6" stroke-linecap="round"/><path d="M256 164 C288 166 300 198 268 207 L172 211" fill="none" stroke="#f2f2f6" stroke-width="1.2" stroke-linecap="round" opacity=".7" transform="translate(0 -1.5)"/>
  <rect x="58" y="198" width="118" height="19" rx="9.5" fill="url(#gChrome)" stroke="#4a4a4e" stroke-width="1.3"/><g stroke="#4a4a4e" stroke-width="1"><line x1="84" y1="199" x2="84" y2="216"/><line x1="150" y1="199" x2="150" y2="216"/></g><ellipse cx="58" cy="207.5" rx="3" ry="8" fill="#2a2a2c"/>
  <path d="M120 217 L124 226 M120 198 L116 190" stroke="#58585c" stroke-width="2.4"/>
  <!-- hinterer Kotflügel, Rücklicht, Blinker -->
  <path d="M18.5 148 A74 74 0 0 1 146.7 119.4" fill="none" stroke="#7a3a05" stroke-width="7.4" stroke-linecap="round"/><path d="M18.5 148 A74 74 0 0 1 146.7 119.4" fill="none" stroke="#ff8a1f" stroke-width="5.4" stroke-linecap="round"/><path d="M22 145 A71 71 0 0 1 120 117" fill="none" stroke="#ffd0a0" stroke-width="1.2" opacity=".7"/>
  <rect x="12" y="145" width="10" height="12" rx="3" fill="#d3382a" stroke="#5c0f09" stroke-width="1"/><circle cx="34" cy="132" r="3.6" fill="#ff9f0a" stroke="#5d3b00" stroke-width=".8"/><path d="M34 135 L30 144" stroke="#18181a" stroke-width="2"/>
  <!-- Sitzbank, Tank, Knieschutz, Tankdeckel -->
  <path d="M106 94 Q104 82 116 81 L198 79 C208 79 210 89 204 95 L112 101 Q106 101 106 94 Z" fill="#2b2b30" stroke="#6a6a6f" stroke-width="1.6"/><path d="M114 85 L198 83" fill="none" stroke="#55555a" stroke-width="1.4"/><path d="M116 90 L200 88" fill="none" stroke="#17171a" stroke-width="1.6"/><path d="M112 94 L96 98 L94 106" fill="none" stroke="#d1d1d6" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M196 86 C199 70 214 64 240 62 L296 60 C313 60 323 69 322 83 L318 99 L206 101 C198 99 195 93 196 86 Z" fill="url(#gPaint)" stroke="#8a3f03" stroke-width="1.6"/>
  <path d="M208 70 C226 66 262 64 298 63" fill="none" stroke="#ffe2bf" stroke-width="2" opacity=".6"/><path d="M200 92 L316 90" fill="none" stroke="#1a1a1a" stroke-width="1.4" opacity=".8"/>
  <rect x="226" y="77" width="54" height="17" rx="8.5" fill="#101012" opacity=".92"/><ellipse cx="297" cy="60" rx="9" ry="3.6" fill="url(#gChrome)" stroke="#555" stroke-width=".8"/><ellipse cx="297" cy="58.5" rx="4" ry="1.4" fill="#8e8e93"/>
  <!-- Teleskopgabel, Kotflügel, Bremse -->
  <path d="M327.3 119.4 A74 74 0 0 1 453.5 141.7" fill="none" stroke="#7a3a05" stroke-width="7.4" stroke-linecap="round"/><path d="M327.3 119.4 A74 74 0 0 1 453.5 141.7" fill="none" stroke="#ff8a1f" stroke-width="5.4" stroke-linecap="round"/><path d="M335 121 A70 70 0 0 1 430 124" fill="none" stroke="#ffd0a0" stroke-width="1.2" opacity=".7"/>
  <path d="M326 68 L354 117" fill="none" stroke="#6e6e73" stroke-width="9" stroke-linecap="round"/><path d="M326 68 L354 117" fill="none" stroke="#f2f2f6" stroke-width="6" stroke-linecap="round"/><path d="M326 68 L354 117" fill="none" stroke="#8e8e93" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
  <path d="M332 80 L343 100" fill="none" stroke="#111" stroke-width="9" stroke-dasharray="2.2 2" stroke-linecap="butt"/>
  <path d="M354 117 L384 167" fill="none" stroke="#18181a" stroke-width="8" stroke-linecap="round"/><path d="M354 117 L384 167" fill="none" stroke="#4a4a4e" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M370 142 L360 150 L358 160" fill="none" stroke="#c8c8cd" stroke-width="2.4"/><circle cx="358" cy="161" r="2.6" fill="#c8c8cd"/>
  <rect x="323" y="63" width="14" height="32" rx="4" fill="#17171a" stroke="#4a4a4e" stroke-width="1.2" transform="rotate(8 330 78)"/>
  <rect x="337" y="63" width="26" height="36" rx="12" fill="url(#gChrome)" stroke="#555" stroke-width="1.2"/><path d="M357 66 Q368 82 357 97 L351 97 Q360 82 351 66 Z" fill="url(#gLamp)" stroke="#8a6a00" stroke-width=".8"/>
  <rect x="338" y="97" width="9" height="5.4" rx="2.7" fill="#ff9f0a" stroke="#5d3b00" stroke-width=".8"/>
  <!-- Lenker, Griff, Bremshebel, Tacho -->
  <path d="M324 66 L318 43 Q316 38 308 38 L292 38" fill="none" stroke="#111" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M324 66 L318 43 Q316 38 308 38 L292 38" fill="none" stroke="#3d3d42" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
  <path d="M290 39 L304 40.5" fill="none" stroke="#0c0c0e" stroke-width="8" stroke-linecap="round"/><path d="M299 44 L312 52 L314 53" fill="none" stroke="#e5e5ea" stroke-width="2.6" stroke-linecap="round"/>
  <rect x="304" y="43" width="15" height="12" rx="4.5" fill="url(#gChrome)" stroke="#555" stroke-width=".8"/><circle cx="311.5" cy="49" r="3.4" fill="#f5f5f7" stroke="#333" stroke-width=".6"/>
  <circle cx="326" cy="86" r="3.4" fill="#c8c8cd" stroke="#333" stroke-width=".6"/>`);
})();
const SIMSON_SPOTS = [
  {x: 44.6, y: 56.3, name: 'Vergaser', info: 'Der Vergaser mischt Luft und Benzin zu einem zündfähigen Gemisch. Beim Tuning wird er oft gegen einen größeren Vergaser getauscht, die Düsen müssen dann neu abgestimmt werden.'},
  {x: 52.1, y: 55.6, name: 'Zylinder mit Kühlrippen', info: 'Im Zylinder bewegt sich der Kolben. Die Rippen geben die Wärme an die Luft ab (Luftkühlung). Tuning-Zylinder haben oft mehr Hubraum und geänderte Kanäle.'},
  {x: 57.9, y: 43.7, name: 'Zündkerze', info: 'Die Kerze erzeugt den Zündfunken, der das verdichtete Gemisch entzündet. Der Elektrodenabstand muss stimmen. Das Kabel mit dem Kerzenstecker führt unter den Tank.'},
  {x: 21.0, y: 76.7, name: 'Auspuff-Endtopf', info: 'Der Auspuff leitet die heißen Abgase ab und dämpft den Lärm. Seine Form beeinflusst auch, wie gut der Motor Leistung abgibt.'},
  {x: 28.1, y: 62.2, name: 'Kette', info: 'Die Kette überträgt die Kraft vom Ritzel am Motor auf das Kettenrad am Hinterrad. Sie braucht die richtige Spannung und etwas Schmierung.'},
  {x: 54.6, y: 28.1, name: 'Tank', info: 'Im Tank ist das Gemisch aus Benzin und Zweitaktöl. An den Seiten sitzen Knieschutz-Polster.'},
  {x: 63.5, y: 14.1, name: 'Lenker', info: 'Am Lenker sitzen Gasgriff, Bremshebel und Kupplungshebel. Davor sitzt der Tacho.'},
  {x: 72.9, y: 30.4, name: 'Scheinwerfer', info: 'Der Scheinwerfer wird vom Stromkreis der Lichtmaschine versorgt.'},
  {x: 7.9, y: 72.9, name: 'Hinterrad', info: 'Das Hinterrad wird über die Kette angetrieben. Es hat 36 Speichen und eine Nabe mit Trommelbremse.'},
  {x: 33.3, y: 49.6, name: 'Luftfilter', info: 'Der Luftfilter hält Staub und Schmutz aus der Ansaugluft fern.'},
  {x: 26.5, y: 47.4, name: 'Federbein', info: 'Hinten dämpfen zwei Federbeine Stöße. Eine Feder fängt den Schlag auf, der Dämpfer bremst das Nachschwingen.'},
  {x: 73.3, y: 40.7, name: 'Teleskopgabel', info: 'Die Gabel vorn federt und dämpft. Das Öl im Inneren bremst das Einfedern.'},
  {x: 37.1, y: 83.0, name: 'Kickstarter', info: 'Mit dem Kickstarter tritt man den Motor an. Dabei dreht sich die Kurbelwelle, und der Motor kann anspringen.'}
];

// ---- Simson SR50 (Seitenansicht, Verkleidung, Trittbrett, Mittelständer)
(() => {
  let rib = '', i; for (i = 0; i < 13; i++) rib += `<line x1="${112 + i * 10}" y1="${98 - i * .3}" x2="${110 + i * 10}" y2="${112 - i * .3}" stroke="#34343a" stroke-width="1.6"/>`;
  let step = ''; for (i = 0; i < 9; i++) step += `<line x1="${196 + i * 11}" y1="187" x2="${194 + i * 11}" y2="194" stroke="#3b3b40" stroke-width="1.6"/>`;
  SVGS.sr50 = svg(`<ellipse cx="240" cy="238" rx="215" ry="6" fill="rgba(0,0,0,.45)"/><line x1="8" y1="236" x2="472" y2="236" stroke="#3a3a3c" stroke-width="1.5" stroke-dasharray="7 7"/>
  <!-- Mittelständer -->
  <path d="M232 206 L220 236 M256 206 L268 236" fill="none" stroke="#1a1a1c" stroke-width="5.4" stroke-linecap="round"/><path d="M214 236 h14 M262 236 h14" stroke="#58585c" stroke-width="3.4" stroke-linecap="round"/>
  ${spokeWheel(105, 175, 60)}${spokeWheel(375, 175, 60)}
  <!-- Motor-Getriebe unten, Kickstarter, Auspuff -->
  <rect x="158" y="188" width="108" height="30" rx="11" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="1.6"/><circle cx="236" cy="203" r="12" fill="url(#gAlu)" stroke="#47474b" stroke-width="1.2"/>${bolt(230, 198)}${bolt(242, 198)}${bolt(230, 208)}${bolt(242, 208)}<circle cx="172" cy="204" r="8" fill="url(#gAlu)" stroke="#47474b" stroke-width="1.2"/>
  <path d="M184 216 L168 232 L160 234" fill="none" stroke="#d1d1d6" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="150" y="230" width="16" height="6" rx="3" fill="#18181a"/>
  <path d="M262 198 C284 200 288 222 262 223 L196 224" fill="none" stroke="#2a2a2c" stroke-width="8" stroke-linecap="round"/><path d="M262 198 C284 200 288 222 262 223 L196 224" fill="none" stroke="#a9a9ae" stroke-width="5.4" stroke-linecap="round"/>
  <rect x="86" y="212" width="116" height="17" rx="8.5" fill="url(#gChrome)" stroke="#4a4a4e" stroke-width="1.3"/><g stroke="#4a4a4e" stroke-width="1"><line x1="112" y1="213" x2="112" y2="228"/><line x1="176" y1="213" x2="176" y2="228"/></g>
  <!-- Schwinge, Federbein -->
  <path d="M168 200 L108 176" fill="none" stroke="#18181a" stroke-width="7" stroke-linecap="round"/>
  <path d="M126 170 L146 118" fill="none" stroke="#101012" stroke-width="7" stroke-linecap="round"/><path d="${coil(144, 124, 152, 100, 7, 6)}" fill="none" stroke="#d1d1d6" stroke-width="1.8" stroke-linejoin="round"/><path d="M126 170 L144 124" stroke="#bfbfc4" stroke-width="3" stroke-linecap="round"/><circle cx="126" cy="171" r="3.4" fill="#d1d1d6" stroke="#333"/><circle cx="153" cy="99" r="3.4" fill="#d1d1d6" stroke="#333"/>
  <!-- hinterer Kotflügel, Rücklicht, Blinker -->
  <path d="M43 152.4 A66 66 0 0 1 159 137" fill="none" stroke="#0c0c0e" stroke-width="9" stroke-linecap="round"/><path d="M43 152.4 A66 66 0 0 1 159 137" fill="none" stroke="#3b3b40" stroke-width="6" stroke-linecap="round"/><path d="M48 150 A63 63 0 0 1 130 132" fill="none" stroke="#7b7b82" stroke-width="1.2" opacity=".7"/>
  <rect x="34" y="142" width="14" height="9" rx="3" fill="#ff9f0a" stroke="#5d3b00" stroke-width=".9"/><rect x="30" y="156" width="9" height="9" rx="3" fill="#d3382a" stroke="#5c0f09" stroke-width=".9"/>
  <path d="M126 168 C138 188 172 196 222 198 L296 198 L296 186 L222 188 L176 184 C160 180 148 172 140 158 Z" fill="url(#gRed)" stroke="#5c0f09" stroke-width="1.6"/>
  <!-- weißes Tankgehäuse unter der Sitzbank -->
  <path d="M138 118 C130 140 140 174 176 186 L216 190 C222 162 224 132 218 114 Z" fill="url(#gWhite)" stroke="#a5a5ab" stroke-width="1.6"/><path d="M146 126 C142 146 150 166 172 178" fill="none" stroke="#ffffff" stroke-width="2" opacity=".8"/><rect x="176" y="136" width="34" height="9" rx="4" fill="#d9d9de" stroke="#a5a5ab" stroke-width=".8"/>
  <!-- Sitzbank mit Haltebügel -->
  <path d="M100 106 C100 94 118 92 140 92 L238 88 C252 88 256 97 250 103 L234 114 L108 119 C99 119 96 114 100 106 Z" fill="#17171a" stroke="#55555a" stroke-width="1.6"/>${rib}<path d="M110 96 L240 92" fill="none" stroke="#4a4a50" stroke-width="1.4"/>
  <path d="M104 108 C86 102 80 116 88 126" fill="none" stroke="#e5e5ea" stroke-width="5" stroke-linecap="round"/><path d="M104 108 C86 102 80 116 88 126" fill="none" stroke="#7a7a7f" stroke-width="1.4" stroke-linecap="round"/>
  <!-- Trittbrett -->
  <path d="M186 187 L300 187 L304 196 L184 197 Z" fill="#1c1c1e" stroke="#58585c" stroke-width="1.4"/>${step}<path d="M180 197 L304 196" stroke="#c8c8cd" stroke-width="2.4"/>
  <!-- Beinschild und Seitenverkleidung (breit geschwungen) -->
  <path d="M326 58 C320 96 312 140 304 176 L298 190 L226 192 C236 178 250 160 262 134 C274 106 296 80 316 56 Z" fill="url(#gRed)" stroke="#5c0f09" stroke-width="1.8"/>
  <path d="M318 70 C310 104 304 140 298 172" fill="none" stroke="#ffb3a8" stroke-width="2" opacity=".7"/><path d="M296 104 C284 122 272 142 262 160" fill="none" stroke="#7a1810" stroke-width="1.4" opacity=".8"/>
  <path d="M296 150 L306 150 L306 188 L296 190 Z" fill="#a8261a" stroke="#5c0f09" stroke-width="1.2"/><path d="M232 192 L298 190" stroke="#e5e5ea" stroke-width="3" stroke-linecap="round"/>
  <!-- Teleskopgabel mit sichtbaren Federn, Kotflügel -->
  <path d="M321 137 A66 66 0 0 1 435 147" fill="none" stroke="#0c0c0e" stroke-width="9" stroke-linecap="round"/><path d="M321 137 A66 66 0 0 1 435 147" fill="none" stroke="#3b3b40" stroke-width="6" stroke-linecap="round"/><path d="M330 132 A62 62 0 0 1 420 128" fill="none" stroke="#7b7b82" stroke-width="1.2" opacity=".7"/>
  <path d="M334 68 L372 168" fill="none" stroke="#6e6e73" stroke-width="10" stroke-linecap="round"/><path d="M334 68 L372 168" fill="none" stroke="#f2f2f6" stroke-width="7" stroke-linecap="round"/>
  <path d="${coil(338, 78, 354, 120, 9, 6.4)}" fill="none" stroke="#e5e5ea" stroke-width="2" stroke-linejoin="round"/><path d="M354 120 L372 168" fill="none" stroke="#18181a" stroke-width="9" stroke-linecap="round"/><path d="M354 120 L372 168" fill="none" stroke="#4a4a4e" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="375" cy="175" r="4.4" fill="#c8c8cd" stroke="#333"/>
  <!-- Lenkerverkleidung, Scheinwerfer, Blinker, Lenker, Spiegel -->
  <path d="M322 56 C326 40 356 40 372 52 C382 62 380 82 366 90 L336 92 C324 86 318 72 322 56 Z" fill="#1d1d21" stroke="#5a5a60" stroke-width="1.6"/><path d="M330 50 C346 44 362 48 370 56" fill="none" stroke="#6a6a70" stroke-width="1.4" opacity=".8"/>
  <circle cx="356" cy="70" r="16" fill="url(#gChrome)" stroke="#555" stroke-width="1.2"/><circle cx="356" cy="70" r="11.4" fill="url(#gLamp)" stroke="#8a6a00" stroke-width=".8"/>
  <rect x="298" y="94" width="14" height="9" rx="3" fill="#ff9f0a" stroke="#5d3b00" stroke-width=".9"/><rect x="356" y="86" width="12" height="7" rx="3" fill="#ff9f0a" stroke="#5d3b00" stroke-width=".9"/>
  <path d="M322 50 L304 44" fill="none" stroke="#0c0c0e" stroke-width="7.6" stroke-linecap="round"/><path d="M312 52 L328 56" fill="none" stroke="#e5e5ea" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M312 46 L300 20" fill="none" stroke="#9a9aa0" stroke-width="2"/><circle cx="298" cy="14" r="9.4" fill="#17171a" stroke="#6a6a70" stroke-width="1.4"/><circle cx="298" cy="14" r="6.4" fill="#cfd3d8"/>
  <path d="M326 50 L338 22" fill="none" stroke="#d1d1d6" stroke-width="2.2"/><circle cx="340" cy="16" r="10" fill="#0e0e10" stroke="#8a8a90" stroke-width="1.4"/><circle cx="340" cy="16" r="7" fill="#e5e9ee"/>`);
})();
const SR50_SPOTS = [
  {x: 35.4, y: 37.8, name: 'Sitzbank', info: 'Die lange Sitzbank hat oben Rippen und bietet Platz für zwei. Unter ihr sitzt das Tankgehäuse.'},
  {x: 35.8, y: 55.6, name: 'Tankgehäuse', info: 'Der weiße Kunststoffkörper unter der Sitzbank enthält den Tank für das Gemisch aus Benzin und Zweitaktöl.'},
  {x: 18.3, y: 42.2, name: 'Haltebügel', info: 'Hinten kann sich der Beifahrer am Bügel festhalten. Er dient auch zum Aufbocken.'},
  {x: 28.8, y: 51.1, name: 'Federbein', info: 'Das Federbein hinten fängt Stöße ab. Die Feder ist sichtbar, der Dämpfer sitzt dahinter.'},
  {x: 60.8, y: 44.4, name: 'Beinschild', info: 'Das Beinschild schützt die Beine vor Wind und Spritzwasser. Es sitzt hinter der Gabel.'},
  {x: 73.3, y: 39.3, name: 'Teleskopgabel mit Federn', info: 'Die Gabel vorn federt. Beim SR50 liegen die Federn offen sichtbar frei.'},
  {x: 73.3, y: 25.2, name: 'Rundscheinwerfer', info: 'Der runde Scheinwerfer sitzt in der Lenkerverkleidung. Er wird vom Stromkreis der Lichtmaschine versorgt.'},
  {x: 70.4, y: 5.2, name: 'Rückspiegel', info: 'Mit den Spiegeln siehst du, was hinter dir ist. Beide Seiten gehören zur Ausstattung.'},
  {x: 63.8, y: 35.6, name: 'Blinker', info: 'Mit den Blinkern zeigst du an, wohin du abbiegen willst. Sie leuchten orange.'},
  {x: 50, y: 70.7, name: 'Trittbrett', info: 'Das Trittbrett ermöglicht einen bequemen Durchstieg. Es hat Gummi mit Rippen für Halt.'},
  {x: 29.2, y: 79.3, name: 'Auspuff-Endtopf', info: 'Der Auspuff führt unter dem Trittbrett nach hinten. Der Endtopf dämpft den Lärm.'},
  {x: 43.8, y: 74, name: 'Motor und Getriebe', info: 'Der Zweitaktmotor mit Getriebe sitzt tief zwischen den Rädern, das senkt den Schwerpunkt. Er gehört zur selben Motorfamilie wie bei S51 und Schwalbe.'},
  {x: 50, y: 84.4, name: 'Mittelständer', info: 'Auf dem Mittelständer steht das Moped fest. Das Hinterrad ist dann frei, praktisch für Kettenpflege.'},
  {x: 68.8, y: 75.9, name: 'Vorderrad', info: 'Das Vorderrad hat eine Trommelbremse und Speichen.'},
  {x: 11.5, y: 76, name: 'Hinterrad', info: 'Das Hinterrad wird über die Kette angetrieben.'}
];

// ---- Traktor (Schema, seitlich, angelehnt an ostdeutsche Radtraktoren)
(() => {
  let lugs = '', fb = '', slats = '', i;
  for (i = 0; i < 24; i++) lugs += `<rect x="147" y="${178 - 66}" width="6" height="10" rx="1.5" fill="#0d0d0f" transform="rotate(${i * 15} 150 178)"/>`;
  for (i = 0; i < 6; i++) fb += bolt(f1(150 + 25 * Math.cos(i * Math.PI / 3)), f1(178 + 25 * Math.sin(i * Math.PI / 3)), 1.8);
  for (i = 0; i < 9; i++) slats += `<line x1="410" y1="${118 + i * 6}" x2="421" y2="${118 + i * 6}" stroke="#58585c" stroke-width="2"/>`;
  SVGS.traktor = svg(`<ellipse cx="240" cy="243" rx="220" ry="6" fill="rgba(0,0,0,.45)"/><line x1="8" y1="241" x2="472" y2="241" stroke="#3a3a3c" stroke-width="1.5" stroke-dasharray="7 7"/>
  <!-- Unterbau Heck: Dreipunkt, Hubstange, Zapfwelle -->
  <path d="M148 208 L58 214" fill="none" stroke="#17171a" stroke-width="7" stroke-linecap="round"/><path d="M148 208 L58 214" fill="none" stroke="#4d4d52" stroke-width="2.4" stroke-linecap="round"/><circle cx="56" cy="214" r="4.6" fill="url(#gChrome)" stroke="#333"/>
  <path d="M146 152 L62 184" fill="none" stroke="#17171a" stroke-width="5" stroke-linecap="round"/><rect x="92" y="164" width="22" height="9" rx="3" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="1" transform="rotate(-21 103 168)"/>
  <path d="M142 170 L88 162" fill="none" stroke="#e5e5ea" stroke-width="6" stroke-linecap="round"/><path d="M142 170 L88 162" fill="none" stroke="#6a6a6f" stroke-width="1.4"/>
  <path d="M86 163 L82 207" fill="none" stroke="#d1d1d6" stroke-width="3.4" stroke-linecap="round"/><circle cx="86" cy="163" r="3.6" fill="#c8c8cd" stroke="#333"/><circle cx="82" cy="207" r="3.6" fill="#c8c8cd" stroke="#333"/>
  <rect x="50" y="193" width="26" height="8" rx="3" fill="url(#gChrome)" stroke="#4d4d52" stroke-width="1"/><g stroke="#4d4d52" stroke-width="1"><line x1="54" y1="193" x2="54" y2="201"/><line x1="58" y1="193" x2="58" y2="201"/><line x1="62" y1="193" x2="62" y2="201"/><line x1="66" y1="193" x2="66" y2="201"/></g><path d="M74 191 L86 192 L86 202 L74 202" fill="#2a2a2c" stroke="#58585c"/>
  <!-- Motor, Haube, Grill, Frontgewicht -->
  <rect x="228" y="176" width="176" height="24" rx="5" fill="#2e2e32" stroke="#5a5a5f" stroke-width="1.4"/><rect x="352" y="196" width="68" height="10" rx="3" fill="#202024" stroke="#5a5a5f"/>
  <path d="M222 152 L222 98 Q224 90 234 90 L388 96 Q404 98 408 112 L414 158 L412 180 L222 180 Z" fill="url(#gGreen)" stroke="#0f3d1d" stroke-width="2"/>
  <path d="M232 98 L384 104" fill="none" stroke="#a6e8b2" stroke-width="1.6" opacity=".65"/>
  <g stroke="#0f3d1d" stroke-width="2.2"><line x1="252" y1="122" x2="338" y2="126"/><line x1="252" y1="130" x2="338" y2="134"/><line x1="252" y1="138" x2="338" y2="142"/><line x1="252" y1="146" x2="338" y2="150"/></g>
  <rect x="406" y="112" width="18" height="64" rx="4" fill="#17171a" stroke="#5a5a5f" stroke-width="1.4"/>${slats}
  <circle cx="414" cy="106" r="9" fill="url(#gChrome)" stroke="#555" stroke-width="1"/><circle cx="414" cy="106" r="6" fill="url(#gLamp)" stroke="#8a6a00" stroke-width=".7"/>
  <rect x="420" y="150" width="16" height="42" rx="3" fill="#3a3a3e" stroke="#6a6a6f" stroke-width="1.4"/><circle cx="428" cy="160" r="2.6" fill="#111"/><circle cx="428" cy="172" r="2.6" fill="#111"/><circle cx="428" cy="184" r="2.6" fill="#111"/>
  <!-- Auspuff -->
  <rect x="346" y="86" width="12" height="7" rx="2" fill="#58585c"/><rect x="348" y="24" width="8" height="64" fill="#7a7a7f" stroke="#3a3a3e" stroke-width="1"/><path d="M349 26 L349 86" stroke="#c9c9ce" stroke-width="1.4" opacity=".7"/><path d="M340 24 L364 24 L360 16 Q352 12 344 16 Z" fill="#4a4a4e" stroke="#222" stroke-width="1"/>
  <!-- Kabine -->
  <path d="M74 150 L82 56 Q84 46 96 46 L198 46 Q208 46 212 56 L222 150 Z" fill="url(#gGreen)" stroke="#0f3d1d" stroke-width="2.4"/>
  <path d="M92 66 Q94 58 102 58 L196 58 Q203 58 204 66 L212 122 L88 122 Z" fill="url(#gGlass)" opacity=".62" stroke="#0b2a15" stroke-width="2"/><rect x="144" y="58" width="4" height="64" fill="#10341a"/><path d="M100 68 L116 118" fill="none" stroke="#fff" stroke-width="3" opacity=".35"/>
  <rect x="68" y="38" width="154" height="10" rx="5" fill="#1e6b30" stroke="#0f3d1d" stroke-width="1.6"/><rect x="94" y="30" width="14" height="8" rx="2" fill="url(#gLamp)" stroke="#6a5000"/><rect x="180" y="30" width="14" height="8" rx="2" fill="url(#gLamp)" stroke="#6a5000"/>
  <rect x="198" y="130" width="12" height="4" rx="2" fill="#0f3d1d"/><path d="M80 84 L58 78" fill="none" stroke="#17171a" stroke-width="3"/><rect x="48" y="66" width="12" height="24" rx="3" fill="#17171a" stroke="#8e8e93"/>
  <!-- Räder -->
  <circle cx="150" cy="178" r="52" fill="none" stroke="#17171a" stroke-width="20"/>${lugs}<circle cx="150" cy="178" r="40" fill="url(#gYel)" stroke="#8a6a0c" stroke-width="2"/><circle cx="150" cy="178" r="30" fill="none" stroke="#a07d10" stroke-width="1.2"/><circle cx="150" cy="178" r="13" fill="url(#gAlu)" stroke="#555" stroke-width="1.4"/>${fb}
  <!-- Heckkotflügel -->
  <path d="M86.6 148.4 A72 72 0 0 1 215.8 154.1" fill="none" stroke="#0f3d1d" stroke-width="9" stroke-linecap="round"/><path d="M86.6 148.4 A72 72 0 0 1 215.8 154.1" fill="none" stroke="#2f8a43" stroke-width="6.6" stroke-linecap="round"/><path d="M92 146 A68 68 0 0 1 200 142" fill="none" stroke="#9be3a8" stroke-width="1.4" opacity=".7"/>
  <circle cx="388" cy="206" r="30" fill="none" stroke="#17171a" stroke-width="14"/><circle cx="388" cy="206" r="37" fill="none" stroke="#2c2c2e" stroke-width="2" stroke-dasharray="4 3"/><circle cx="388" cy="206" r="30" fill="none" stroke="#2c2c2e" stroke-width="1.6"/><circle cx="388" cy="206" r="22" fill="url(#gYel)" stroke="#8a6a0c" stroke-width="1.6"/><circle cx="388" cy="206" r="9" fill="url(#gAlu)" stroke="#555"/>
  <path d="M349.6 188 A38 38 0 0 1 426.4 190" fill="none" stroke="#0f3d1d" stroke-width="7" stroke-linecap="round"/><path d="M349.6 188 A38 38 0 0 1 426.4 190" fill="none" stroke="#2f8a43" stroke-width="4.8" stroke-linecap="round"/>
  <path d="M226 154 L226 208 M226 166 L240 166 M226 184 L240 184 M226 202 L240 202" fill="none" stroke="#c9c9ce" stroke-width="3" stroke-linecap="round"/>`);
})();
const TRAKTOR_SPOTS = [
  {x: 62.5, y: 48.1, name: 'Motor unter der Haube', info: 'Im Traktor arbeitet meist ein starker Dieselmotor. Er treibt die Räder, die Hydraulik und die Zapfwelle an.'},
  {x: 86.5, y: 53.3, name: 'Kühlergrill', info: 'Durch den Grill strömt Luft zum Kühler. Der Kühler holt die Wärme aus dem Motor.'},
  {x: 72.9, y: 14.8, name: 'Auspuff', info: 'Der Auspuff steht senkrecht nach oben, damit Abgase und Lärm nicht in die Kabine ziehen. Oben sitzt eine Klappe gegen Regen.'},
  {x: 30.4, y: 31.1, name: 'Kabine', info: 'Die Kabine schützt vor Wetter und Lärm. Auf dem Dach sitzen Arbeitsscheinwerfer.'},
  {x: 21.7, y: 77.8, name: 'Hinterrad', info: 'Die großen Hinterräder mit dem groben Profil (Stollen) haben viel Grip auf dem Acker und verteilen das Gewicht.'},
  {x: 76.0, y: 82.0, name: 'Vorderrad', info: 'Die kleineren Vorderräder lenken den Traktor.'},
  {x: 19.0, y: 78.2, name: 'Unterlenker', info: 'Die Unterlenker halten Geräte wie Pflug oder Mähwerk am Heck. Zusammen mit dem Oberlenker nennt man das Dreipunktaufhängung.'},
  {x: 20.8, y: 62.6, name: 'Oberlenker', info: 'Der Oberlenker hält das Gerät oben. Seine Länge lässt sich verstellen (Spindel in der Mitte).'},
  {x: 17.0, y: 68.5, name: 'Hubarm und Hubstange', info: 'Die Hydraulik hebt die Hubarme. Über die Hubstangen heben sie die Unterlenker und damit das Gerät. Weil Öl sich nicht zusammendrücken lässt, bleibt das Gerät in der Position.'},
  {x: 12.9, y: 72.6, name: 'Zapfwelle', info: 'Die Zapfwelle ist eine drehende Welle am Heck. Sie treibt angehängte Geräte an, zum Beispiel ein Mähwerk.'},
  {x: 86.3, y: 44.6, name: 'Scheinwerfer', info: 'Scheinwerfer und Arbeitsscheinwerfer helfen bei der Arbeit in der Dämmerung.'},
  {x: 89.0, y: 65.2, name: 'Frontgewicht', info: 'Das Frontgewicht aus Gusseisen sorgt für Gleichgewicht, wenn schwere Geräte am Heck hängen.'}
];

// ---- Rasentraktor (Schema, seitlich, Heckfangkorb)
(() => {
  let tread = '', mesh = '', slats = '', i;
  for (i = 0; i < 30; i++) tread += `<rect x="138.6" y="${198 - 46}" width="2.8" height="5" fill="#0c0c0e" transform="rotate(${i * 12} 140 198)"/>`;
  for (i = 0; i < 7; i++) mesh += `<line x1="${22 + i * 9}" y1="118" x2="${22 + i * 9}" y2="178" stroke="#6a6a6f" stroke-width="1"/>`;
  for (i = 0; i < 7; i++) mesh += `<line x1="20" y1="${122 + i * 9}" x2="86" y2="${122 + i * 9}" stroke="#6a6a6f" stroke-width="1"/>`;
  for (i = 0; i < 7; i++) slats += `<line x1="368" y1="${138 + i * 6}" x2="379" y2="${138 + i * 6}" stroke="#4a4a4e" stroke-width="1.8"/>`;
  SVGS.rasen = svg(`<ellipse cx="220" cy="243" rx="205" ry="6" fill="rgba(0,0,0,.45)"/><line x1="8" y1="241" x2="472" y2="241" stroke="#3a3a3c" stroke-width="1.5" stroke-dasharray="7 7"/>
  <!-- Fangsack und Schlauch -->
  <path d="M190 216 C160 216 150 188 100 166" fill="none" stroke="#17171a" stroke-width="15" stroke-linecap="round"/><path d="M190 216 C160 216 150 188 100 166" fill="none" stroke="#4a4a4e" stroke-width="12" stroke-dasharray="2.2 2.6"/>
  <path d="M30 118 Q30 110 44 110 L66 110 Q86 110 86 126 L86 172 Q86 182 74 182 L32 182 Q20 182 20 172 Z" fill="#26262a" stroke="#8e8e93" stroke-width="2.2"/><path d="M24 122 L84 122" stroke="#8e8e93" stroke-width="3"/>${mesh}<path d="M38 110 Q50 98 64 110" fill="none" stroke="#c8c8cd" stroke-width="3.4" stroke-linecap="round"/><rect x="82" y="162" width="10" height="14" rx="3" fill="#17171a" stroke="#8e8e93"/>
  <!-- Mähdeck mit Schnittbild (Messer) -->
  <path d="M176 214 L338 214 Q346 214 346 222 L346 234 L168 234 L168 222 Q168 214 176 214 Z" fill="#3a3a3e" stroke="#8e8e93" stroke-width="1.8"/><path d="M180 218 L334 218" stroke="#a6a6ab" stroke-width="1.4" opacity=".7"/>
  <rect x="198" y="222" width="96" height="9" rx="2" fill="#0f0f11"/><path d="M204 224 Q246 220 288 224 L288 229 Q246 232 204 229 Z" fill="url(#gChrome)" stroke="#555" stroke-width=".8"/><circle cx="246" cy="226.5" r="4" fill="#26262a" stroke="#bbb" stroke-width="1"/>
  ${bolt(186, 224)}${bolt(326, 224)}${bolt(186, 230)}${bolt(326, 230)}<path d="M346 222 L362 226 L362 234 L346 232" fill="#2a2a2e" stroke="#8e8e93" stroke-width="1.4"/><circle cx="176" cy="238" r="4.4" fill="#17171a" stroke="#8e8e93"/><circle cx="338" cy="238" r="4.4" fill="#17171a" stroke="#8e8e93"/>
  <path d="M206 214 L206 188 M318 214 L318 178" fill="none" stroke="#c8c8cd" stroke-width="2.6"/>
  <rect x="108" y="172" width="80" height="30" rx="8" fill="#2b2b30" stroke="#6a6a6f" stroke-width="1.4"/><rect x="132" y="184" width="240" height="13" rx="5" fill="#26262a" stroke="#6e6e73" stroke-width="1.4"/><path d="M140 186 L366 186" stroke="#55555a" stroke-width="1.2"/>
  <rect x="352" y="194" width="22" height="26" rx="4" fill="#202024" stroke="#6e6e73" stroke-width="1.2"/>${bolt(141, 190)}${bolt(358, 190)}
  <!-- Räder -->
  <circle cx="140" cy="198" r="34" fill="none" stroke="#141416" stroke-width="16"/>${tread}<circle cx="140" cy="198" r="26" fill="url(#gAlu)" stroke="#5d5d62" stroke-width="1.6"/><circle cx="140" cy="198" r="19" fill="none" stroke="#6a6a6f" stroke-width="1"/><circle cx="140" cy="198" r="7" fill="url(#gChrome)" stroke="#555"/>
  <circle cx="365" cy="216" r="20" fill="none" stroke="#141416" stroke-width="11"/><circle cx="365" cy="216" r="25.4" fill="none" stroke="#2f2f32" stroke-width="2" stroke-dasharray="3 2.4"/><circle cx="365" cy="216" r="14" fill="url(#gAlu)" stroke="#5d5d62" stroke-width="1.4"/><circle cx="365" cy="216" r="5" fill="url(#gChrome)" stroke="#555"/>
  <!-- Rahmen, Kotflügel, Motorhaube -->
  <path d="M96 168 Q104 150 140 150 L240 168 L240 186 L170 188 Z" fill="none"/>
  <path d="M93 181 A50 50 0 0 1 188.3 185.1" fill="none" stroke="#4d100a" stroke-width="8" stroke-linecap="round"/><path d="M93 181 A50 50 0 0 1 188.3 185.1" fill="none" stroke="#d3382a" stroke-width="5.8" stroke-linecap="round"/>
  <rect x="176" y="188" width="64" height="7" rx="3" fill="#0f0f11"/><g stroke="#3a3a3e" stroke-width="1.6"><line x1="186" y1="188" x2="186" y2="195"/><line x1="198" y1="188" x2="198" y2="195"/><line x1="210" y1="188" x2="210" y2="195"/><line x1="222" y1="188" x2="222" y2="195"/></g>
  <path d="M100 152 L100 112 Q100 100 112 100 L124 100 Q131 100 131 112 L133 140 L168 140 Q178 140 178 149 L178 155 L100 155 Z" fill="#0f0f11" stroke="#5a5a5f" stroke-width="1.6"/><path d="M106 112 Q108 104 116 104" fill="none" stroke="#6a6a6f" stroke-width="1.4"/><path d="M138 156 L142 178" fill="none" stroke="#c8c8cd" stroke-width="3"/>
  <path d="M232 184 L232 150 Q236 126 262 124 L346 128 Q366 130 372 150 L378 184 Z" fill="url(#gRed)" stroke="#4d100a" stroke-width="2"/><path d="M244 138 Q250 130 266 129 L340 133" fill="none" stroke="#ffb3a8" stroke-width="1.6" opacity=".6"/>
  <g stroke="#4d100a" stroke-width="2"><line x1="274" y1="146" x2="336" y2="148"/><line x1="274" y1="154" x2="336" y2="156"/><line x1="274" y1="162" x2="336" y2="164"/></g>
  <rect x="366" y="134" width="14" height="48" rx="3" fill="#17171a" stroke="#6a6a6f" stroke-width="1.3"/>${slats}<ellipse cx="373" cy="130" rx="6" ry="4.4" fill="url(#gLamp)" stroke="#8a6a00" stroke-width=".8"/>
  <ellipse cx="300" cy="126" rx="9" ry="3" fill="url(#gChrome)" stroke="#555" stroke-width=".8"/>
  <!-- Lenksäule, Lenkrad, Hebel, Pedal -->
  <path d="M258 128 L246 90" fill="none" stroke="#17171a" stroke-width="7" stroke-linecap="round"/><path d="M258 128 L246 90" fill="none" stroke="#4a4a4e" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="244" cy="82" rx="23" ry="6.4" transform="rotate(-18 244 82)" fill="none" stroke="#0f0f11" stroke-width="5.4"/><ellipse cx="244" cy="82" rx="23" ry="6.4" transform="rotate(-18 244 82)" fill="none" stroke="#4a4a4e" stroke-width="1.4"/><path d="M226 88 L262 76" stroke="#17171a" stroke-width="3"/><circle cx="244" cy="82" r="4.2" fill="#d3382a" stroke="#222"/>
  <path d="M190 160 L186 140" fill="none" stroke="#c8c8cd" stroke-width="3" stroke-linecap="round"/><circle cx="185" cy="138" r="4.6" fill="#ff8a1f" stroke="#8a3f03"/>
  <path d="M222 184 L216 150" fill="none" stroke="#c8c8cd" stroke-width="3"/><rect x="208" y="146" width="16" height="7" rx="3" transform="rotate(-10 216 150)" fill="#0f0f11"/>`);
})();
const RASEN_SPOTS = [
  {x: 53.1, y: 83.0, name: 'Mähdeck', info: 'Unter dem Mähdeck drehen Messer. Die Schnitthöhe wird mit einem Hebel eingestellt. Das Mähdeck hängt an Stangen am Rahmen.'},
  {x: 51.5, y: 83.7, name: 'Messer', info: 'Das Messer schneidet das Gras und wirbelt es zum Auswurf. Es muss scharf sein, sonst reißt es die Halme.'},
  {x: 11.0, y: 54.8, name: 'Fangkorb', info: 'Im Fangsack sammelt sich das Gras. Ist er voll, muss man ihn leeren.'},
  {x: 21.7, y: 60.7, name: 'Fangschlauch', info: 'Durch den Schlauch bläst das Messer das Gras vom Deck in den Fangsack.'},
  {x: 51.0, y: 30.0, name: 'Lenkrad', info: 'Mit dem Lenkrad werden die Vorderräder eingeschlagen.'},
  {x: 24.6, y: 42.6, name: 'Sitz', info: 'Auf dem Sitz fährst du. Ein Sicherheitsschalter schaltet das Messer ab, wenn man aufsteht.'},
  {x: 62.5, y: 56.7, name: 'Motor unter der Haube', info: 'Meist ein kleiner Benzinmotor mit Einzylinder oder Zweizylinder. Er treibt Räder und Messer an.'},
  {x: 22.0, y: 82.2, name: 'Hinterrad', info: 'Die Hinterräder sind größer und treiben den Rasentraktor an.'},
  {x: 70.9, y: 83.3, name: 'Vorderrad', info: 'Die kleinen Vorderräder lenken den Rasentraktor.'},
  {x: 38.5, y: 51.1, name: 'Schnitthöhen-Hebel', info: 'Mit dem Hebel stellst du ein, wie hoch das Gras bleibt. Niedriger Schnitt ist nicht immer besser, weil das Gras sonst leidet.'},
  {x: 77.9, y: 52.6, name: 'Scheinwerfer', info: 'Der Scheinwerfer erleuchtet die Strecke in der Dämmerung.'}
];

// ---- Kühlkreislauf (Schema, wassergekühlter Zweitakter)
(() => {
  let fins = '', i; for (i = 0; i < 13; i++) fins += `<line x1="${44 + i * 5}" y1="60" x2="${44 + i * 5}" y2="204" stroke="#5a5a5f" stroke-width="1.2"/>`;
  let jacket = ''; for (i = 0; i < 5; i++) jacket += `<rect x="${296 + i * 14}" y="92" width="7" height="64" rx="3" fill="#3b8cff" opacity=".75"/>`;
  SVGS.kuehlung = svg(`<ellipse cx="240" cy="244" rx="215" ry="5" fill="rgba(0,0,0,.4)"/>
  <!-- Kühler -->
  <rect x="38" y="56" width="78" height="152" rx="8" fill="#26262a" stroke="url(#gChrome)" stroke-width="3"/>${fins}<g stroke="#8e8e93" stroke-width="1"><line x1="40" y1="80" x2="114" y2="80"/><line x1="40" y1="104" x2="114" y2="104"/><line x1="40" y1="128" x2="114" y2="128"/><line x1="40" y1="152" x2="114" y2="152"/><line x1="40" y1="176" x2="114" y2="176"/></g>
  <rect x="62" y="46" width="30" height="12" rx="4" fill="url(#gChrome)" stroke="#555" stroke-width="1"/>
  <path d="M26 120 h-14 m6 -6 l-6 6 l6 6 M26 150 h-14 m6 -6 l-6 6 l6 6" fill="none" stroke="#5ac8fa" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Motorblock mit Wassermantel -->
  <rect x="236" y="160" width="190" height="62" rx="12" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="2"/><circle cx="332" cy="190" r="22" fill="#6a6a6f" stroke="#33333a" stroke-width="1.6"/><circle cx="332" cy="190" r="8" fill="url(#gChrome)"/>
  <rect x="286" y="82" width="92" height="84" rx="8" fill="#9a9aa0" stroke="#4d4d52" stroke-width="2"/>${jacket}<rect x="306" y="64" width="52" height="22" rx="6" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="1.6"/><rect x="326" y="50" width="12" height="16" rx="2" fill="#f4f4f6" stroke="#bbb"/><rect x="324" y="40" width="16" height="12" rx="3" fill="#141416"/>
  <!-- Thermostat, Schläuche, Pumpe -->
  <path d="M286 100 C240 96 190 96 112 84" fill="none" stroke="#7a1810" stroke-width="12" stroke-linecap="round"/><path d="M286 100 C240 96 190 96 112 84" fill="none" stroke="#ff6f5e" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 8"/>
  <path d="M112 190 C170 204 214 214 250 208" fill="none" stroke="#10417a" stroke-width="12" stroke-linecap="round"/><path d="M112 190 C170 204 214 214 250 208" fill="none" stroke="#5ac8fa" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 8"/>
  <rect x="190" y="82" width="26" height="26" rx="6" fill="url(#gChrome)" stroke="#555" stroke-width="1.4"/><path d="M196 95 h14" stroke="#555" stroke-width="2"/><circle cx="203" cy="95" r="4" fill="#ffd60a" stroke="#555"/>
  <circle cx="262" cy="208" r="20" fill="url(#gAlu)" stroke="#4d4d52" stroke-width="2"/><g stroke="#33333a" stroke-width="2.4" stroke-linecap="round"><line x1="262" y1="196" x2="262" y2="220"/><line x1="250" y1="208" x2="274" y2="208"/><line x1="254" y1="200" x2="270" y2="216"/><line x1="254" y1="216" x2="270" y2="200"/></g><circle cx="262" cy="208" r="4" fill="#d1d1d6"/>
  <path d="M268 160 L268 190" fill="none" stroke="#10417a" stroke-width="10" stroke-linecap="round"/><path d="M268 160 L268 190" fill="none" stroke="#5ac8fa" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 6"/>
  <text x="130" y="76" font-size="11" fill="#ff6f5e">heiß</text><text x="150" y="226" font-size="11" fill="#5ac8fa">kalt</text>`);
})();
const KUEHLUNG_SPOTS = [
  {x: 16.5, y: 49.5, name: 'Kühler', info: 'Im Kühler fließt das Wasser durch viele dünne Kanäle mit Rippen. Die Fahrtluft nimmt die Wärme mit.'},
  {x: 16.5, y: 18.5, name: 'Kühlerdeckel', info: 'Der Deckel hält Druck im System. Bei heißem Motor nie öffnen: Verbrühungsgefahr.'},
  {x: 42.0, y: 36.0, name: 'Thermostat', info: 'Das Thermostat öffnet erst, wenn der Motor warm genug ist. So erreicht er schneller die richtige Temperatur.'},
  {x: 54.5, y: 82.5, name: 'Wasserpumpe', info: 'Die Pumpe treibt das Kühlmittel durch das ganze System.'},
  {x: 44.0, y: 35.0, name: 'Oberer Schlauch', info: 'Durch den oberen Schlauch fließt das heiße Wasser vom Motor zum Kühler.'},
  {x: 38.0, y: 77.5, name: 'Unterer Schlauch', info: 'Durch den unteren Schlauch fließt das abgekühlte Wasser zurück zum Motor.'},
  {x: 69.0, y: 45.0, name: 'Wassermantel', info: 'Um den Zylinder liegen Kanäle mit Kühlwasser. Dort nimmt das Wasser die Wärme auf.'},
  {x: 70.0, y: 22.0, name: 'Zündkerze', info: 'Die Kerze entzündet das Gemisch im Zylinder.'}
];
// ---- Zweitaktmotor im Schnitt (Modell: Hub 44, Kurbelradius 22, Pleuel 62; 1 Einheit = 1 mm)
function zyl(alpha, opt = {}) {
  const r = 22, l = 62, a = alpha * Math.PI / 180, cx = 150, cy = 240;
  const pin = cy - (r * Math.cos(a) + Math.sqrt(l * l - (r * Math.sin(a)) ** 2)), crown = pin - 22, skirt = crown + 34;
  const EX = opt.exTop ?? 164, ex = crown > EX, tr = crown > 169, inn = skirt < 186, up = alpha > 180 && alpha < 360;
  const kx = cx + r * Math.sin(a), ky = cy - r * Math.cos(a);
  const burn = alpha >= 345 || alpha <= 70, fl = alpha >= 345 ? .25 + (alpha - 345) / 30 : alpha <= 70 ? Math.max(.18, .6 - alpha / 140) : 0;
  const gas = ex ? 'rgba(142,142,147,.45)' : burn ? `rgba(255,138,31,${fl.toFixed(2)})` : up && alpha > 255 ? 'rgba(255,190,100,.28)' : 'rgba(90,200,250,.22)';
  let o = `<rect x="84" y="200" width="132" height="96" rx="38" fill="${DARK}" stroke="${INK}" stroke-width="2.5"/>
   <path d="M98 126 H202 V200 H98 Z" fill="url(#gAlu)" stroke="${INK}" stroke-width="2"/>
   <g stroke="${INK}" stroke-width="2.4" stroke-linecap="round"><line x1="88" y1="130" x2="98" y2="130"/><line x1="202" y1="130" x2="212" y2="130"/><line x1="88" y1="138" x2="98" y2="138"/><line x1="202" y1="138" x2="212" y2="138"/><line x1="88" y1="146" x2="98" y2="146"/><line x1="202" y1="146" x2="212" y2="146"/><line x1="88" y1="154" x2="98" y2="154"/><line x1="202" y1="154" x2="212" y2="154"/><line x1="88" y1="162" x2="98" y2="162"/><line x1="202" y1="162" x2="212" y2="162"/><line x1="88" y1="170" x2="98" y2="170"/><line x1="202" y1="170" x2="212" y2="170"/><line x1="88" y1="178" x2="98" y2="178"/><line x1="202" y1="178" x2="212" y2="178"/><line x1="88" y1="186" x2="98" y2="186"/><line x1="202" y1="186" x2="212" y2="186"/></g>
   <path d="M98 126 Q98 98 150 98 Q202 98 202 126 Z" fill="url(#gAlu)" stroke="${INK}" stroke-width="2"/><g stroke="#5a5a5f" stroke-width="1.2"><line x1="108" y1="116" x2="192" y2="116"/><line x1="112" y1="108" x2="188" y2="108"/></g><circle cx="108" cy="122" r="2.4" fill="#4a4a4e"/><circle cx="192" cy="122" r="2.4" fill="#4a4a4e"/>
   <rect x="112" y="126" width="76" height="74" fill="${DARK}"/>
   <path d="M112 126 Q112 106 150 106 Q188 106 188 126 Z" fill="${gas}"/><rect x="112" y="126" width="76" height="${Math.max(0, crown - 126)}" fill="${gas}"/>
   <rect x="60" y="${EX}" width="52" height="18" fill="#1c1c1e" stroke="${INK}" stroke-width="2"/><rect x="60" y="186" width="52" height="14" fill="#1c1c1e" stroke="${INK}" stroke-width="2"/>
   <path d="M188 169 H214 V204 H202 V187 H188 Z" fill="#1c1c1e" stroke="${INK}" stroke-width="2"/>
   <rect x="86" y="202" width="128" height="92" rx="36" fill="rgba(90,200,250,.14)"/>
   <rect x="146" y="74" width="8" height="26" fill="#f4f4f6" stroke="${INK}" stroke-width="1.3"/><rect x="144" y="94" width="12" height="6" fill="url(#gChrome)" stroke="${INK}" stroke-width="1"/><rect x="142" y="60" width="16" height="16" rx="3" fill="#141416" stroke="${INK}" stroke-width="1.5"/>
   <circle cx="${cx}" cy="${cy}" r="34" fill="url(#gAlu)" stroke="${INK}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="#5a5a5f" stroke-width="1.4"/><path d="M${(cx - 30 * Math.sin(a)).toFixed(1)} ${(cy + 30 * Math.cos(a)).toFixed(1)} A30 30 0 0 1 ${(cx - 30 * Math.cos(a)).toFixed(1)} ${(cy - 30 * Math.sin(a)).toFixed(1)}" fill="none" stroke="#3a3a3e" stroke-width="0"/><circle cx="${cx}" cy="${cy}" r="5" fill="${INK}"/>
   <line x1="${cx}" y1="${cy}" x2="${kx.toFixed(1)}" y2="${ky.toFixed(1)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
   <line x1="${kx.toFixed(1)}" y1="${ky.toFixed(1)}" x2="150" y2="${pin.toFixed(1)}" stroke="#bfbfc4" stroke-width="6" stroke-linecap="round"/>
   <rect x="114" y="${crown.toFixed(1)}" width="72" height="34" rx="3" fill="url(#gAlu)" stroke="${INK}" stroke-width="1.6"/>
   <line x1="114" y1="${(crown + 7).toFixed(1)}" x2="186" y2="${(crown + 7).toFixed(1)}" stroke="#636366" stroke-width="2"/><line x1="114" y1="${(crown + 12).toFixed(1)}" x2="186" y2="${(crown + 12).toFixed(1)}" stroke="#636366" stroke-width="2"/>
   <circle cx="150" cy="${pin.toFixed(1)}" r="5" fill="#2c2c2e" stroke="${INK}" stroke-width="1.5"/><circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="5" fill="${INK}"/>`;
  if (!opt.still) {
    if (ex) o += `<path d="M104 ${EX + 9} H56 M64 ${EX + 4} L54 ${EX + 9} L64 ${EX + 14}" stroke="${GREY}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (tr) o += `<path d="M208 196 V176 M203 183 L208 174 L213 183" stroke="#5ac8fa" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (inn) o += `<path d="M54 193 H104 M96 188 L106 193 L96 198" stroke="#5ac8fa" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (alpha >= 345 && alpha <= 359 || alpha === 0) o += `<path d="M150 106 l5 -9 l-3 0 l5 -9 M150 106 l-6 -8" stroke="#ffd60a" stroke-width="3" fill="none"/>`;
    o += `<text x="8" y="156" font-size="10" fill="${GREY}">Auslass</text><text x="8" y="209" font-size="10" fill="${GREY}">Einlass</text><text x="218" y="180" font-size="10" fill="${GREY}">Überströmer</text>`;
  }
  let phase;
  if (tr) phase = 'Spülen: Frisches Gemisch strömt aus dem Kurbelgehäuse durch den Überströmkanal nach oben und schiebt die Abgase hinaus.';
  else if (ex) phase = 'Auslass: Der Kolben gibt den Auslass frei, die heißen Abgase strömen hinaus.';
  else if (up && alpha > 255) phase = 'Verdichten: Der Kolben steigt und presst das Gemisch zusammen. Unter dem Kolben wird gleichzeitig neues Gemisch angesaugt.';
  else if (burn && alpha >= 345 || alpha === 0) phase = 'Zündung: Der Funke entzündet das verdichtete Gemisch.';
  else if (up) phase = 'Aufwärtshub: Unter dem Kolben saugt der Unterdruck frisches Gemisch ins Kurbelgehäuse.';
  else phase = 'Arbeiten: Das heiße Gas dehnt sich aus und drückt den Kolben nach unten. Das ist der Antrieb.';
  return {svg: svg(o, '0 54 300 246'), phase, ex, tr, inn, up};
}
SVGS.zyl = zyl(130, {still: true}).svg;
const ZYL_SPOTS = [
  {x: 50, y: 6, name: 'Zündkerze', info: 'Sie entzündet das verdichtete Gemisch mit einem Funken.'},
  {x: 50, y: 23, name: 'Brennraum', info: 'Hier verbrennt das Gemisch. Die Form des Brennraums und die Verdichtung sind beim Tuning wichtige Stellschrauben.'},
  {x: 50, y: 49, name: 'Kolben', info: 'Der Kolben wird vom heißen Gas nach unten gedrückt. Er dichtet mit Kolbenringen gegen die Zylinderwand ab.'},
  {x: 28, y: 49, name: 'Auslass', info: 'Hier strömen die Abgase aus dem Zylinder in den Auspuff. Beim Tuning wird der Auslass oft höher oder breiter gemacht. Das verändert die Steuerzeiten.'},
  {x: 70, y: 54, name: 'Überströmer', info: 'Der Kanal führt frisches Gemisch vom Kurbelgehäuse in den Zylinder. Tuning-Zylinder haben oft mehr oder größere Überströmkanäle.'},
  {x: 28, y: 60, name: 'Einlass', info: 'Hier strömt frisches Gemisch vom Vergaser in den Motor, sobald der Kolben das Fenster freigibt.'},
  {x: 50, y: 76, name: 'Kurbelwelle', info: 'Die Kurbelwelle wandelt die Auf-und-ab-Bewegung des Kolbens in eine Drehung um.'},
  {x: 46, y: 65, name: 'Pleuel', info: 'Das Pleuel verbindet Kolben und Kurbelwelle.'},
  {x: 28, y: 88, name: 'Kurbelgehäuse', info: 'Im Kurbelgehäuse wird das frische Gemisch vorverdichtet, bevor es durch die Überströmkanäle nach oben geht.'}
];

// ---- Fotos vom eigenen Rasentraktor (img/foto/), mit Tipp-Punkten
SVGS.rasenfront = '<img src="img/foto/rasen-front.jpg" alt="Rasentraktor von schräg vorn" style="display:block;width:100%;border-radius:12px">';
SVGS.rasenmotor = '<img src="img/foto/rasen-motor.jpg" alt="Rasentraktor mit geöffneter Haube" style="display:block;width:100%;border-radius:12px">';
const RASENFRONT_SPOTS = [
  {x: 36, y: 36, name: 'Scheinwerfer', info: 'Zwei rechteckige Scheinwerfer sitzen vorn in der Haube. Sie leuchten die Fahrbahn in der Dämmerung aus.'},
  {x: 33, y: 52, name: 'Frontgitter', info: 'Durch das Gitter strömt Luft zum Motor. Die Rippen lassen Luft durch und schützen vor Steinen und Gras.'},
  {x: 49, y: 31, name: 'Motorhaube', info: 'Unter der Haube sitzt der Motor. Die Haube lässt sich nach vorn aufklappen.'},
  {x: 54, y: 17, name: 'Lenkrad', info: 'Mit dem Lenkrad werden die Vorderräder eingeschlagen. Die Lenkwelle geht durch eine Gummimanschette nach unten.'},
  {x: 65, y: 30, name: 'Sitz', info: 'Der Sitz ist auf Federn gelagert und dämpft Stöße. Beim Aufstehen schaltet ein Sicherheitsschalter in der Regel das Messer ab.'},
  {x: 72, y: 46, name: 'Kotflügel', info: 'Der Kotflügel schützt den Fahrer vor hochgeschleuderter Erde und Gras.'},
  {x: 74, y: 63, name: 'Hinterrad', info: 'Das Hinterrad mit breiter Lauffläche und Profil schont den Rasen und treibt den Traktor an.'},
  {x: 52, y: 74, name: 'Vorderrad', info: 'Die kleineren Vorderräder lenken. Auch sie haben ein Rasenprofil.'},
  {x: 62, y: 73, name: 'Mähdeck', info: 'Unter dem Mähdeck drehen die Messer. Das Deck hängt unter dem Rahmen und lässt sich in der Höhe verstellen.'},
  {x: 35, y: 68, name: 'Kette an der Haube', info: 'Die Kette hält die Haube, wenn sie geöffnet wird, und verhindert, dass sie zu weit aufschwingt.'}
];
const RASENMOTOR_SPOTS = [
  {x: 28, y: 20, name: 'Offene Motorhaube', info: 'Die Haube ist nach vorn aufgeklappt. So kommt man an den Motor, den Tank und den Vergaser.'},
  {x: 20, y: 47, name: 'Scheinwerfer von innen', info: 'Von innen sieht man die Scheinwerfergehäuse. Hinter der Haubenblende sitzen die Kabel.'},
  {x: 42, y: 32, name: 'Motor mit Kühlluftgitter', info: 'Der luftgekühlte Benzinmotor hat oben ein Gitter. Hier saugt ein Lüfterrad die Kühlluft an. Die Kurbelwelle steht meist senkrecht.'},
  {x: 36, y: 40, name: 'Luftfilter-Gehäuse', info: 'Im schwarzen Gehäuse links am Motor sitzt vermutlich der Luftfilter. Er hält Staub und Schmutz von der Ansaugluft fern.'},
  {x: 52, y: 29, name: 'Kraftstofftank', info: 'Der gelbliche Kunststofftank enthält das Benzin. Er sitzt neben dem Motor, damit der Kraftstoff nach unten zum Vergaser fließt.'},
  {x: 45, y: 52, name: 'Vergaser', info: 'Der Vergaser mischt Luft und Benzin. Das Gasgestänge und der Kraftstoffschlauch führen zu ihm.'},
  {x: 53, y: 58, name: 'Haubenstütze', info: 'Die lange Stange hält die geöffnete Haube oben und stützt sie zum Armaturenträger ab.'},
  {x: 56, y: 17, name: 'Lenksäule', info: 'Die Lenksäule führt nach unten zu den Vorderrädern. Die gerippte Gummimanschette schützt sie vor Schmutz.'},
  {x: 57, y: 8, name: 'Lenkrad', info: 'Mit dem Lenkrad lenkst du die Vorderräder.'},
  {x: 60, y: 24, name: 'Zündschloss', info: 'Mit dem Schlüssel schaltest du die Zündung ein und startest den Motor.'},
  {x: 66, y: 55, name: 'Fußplatte (Riffelblech)', info: 'Das Riffelblech ist rutschfest. So stehst du auch bei nassen Schuhen sicher.'},
  {x: 48, y: 80, name: 'Vorderrad', info: 'Das Vorderrad hat ein Rasenprofil und eine Stahlfelge. Die Felge ist schwarz lackiert.'},
  {x: 64, y: 72, name: 'Mähdeck mit Riemenscheibe', info: 'Oben auf dem Deck sitzt die Riemenscheibe. Ein Keilriemen überträgt die Kraft vom Motor auf die Messer.'}
];
const SPOTS = {sr50: SR50_SPOTS, rasenfront: RASENFRONT_SPOTS, rasenmotor: RASENMOTOR_SPOTS, kuehlung: KUEHLUNG_SPOTS, simson: SIMSON_SPOTS, traktor: TRAKTOR_SPOTS, rasen: RASEN_SPOTS, zyl: ZYL_SPOTS};
