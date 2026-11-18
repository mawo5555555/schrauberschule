// Kerninhalte: Welten (Themen), Fächer, Garage und Bausteine für die Missionen.
// Die Missionen selbst stehen in c-mathe.js, c-deutsch.js, c-englisch.js, c-nawi.js, c-sprechen.js
// Schritt-Typen: wissen, quiz, num, text, match, order, slider, parts, circuit, reaction, talk
//   (Sprech-Schritte: breath, rhythm, soft, phrase, challenge, rate)

const THEMES = {
  simson:  {name:'Simson',         emoji:'🛵', color:'#ff8a1f'},
  traktor: {name:'Traktor',        emoji:'🚜', color:'#4cc35a'},
  hof:     {name:'Landwirtschaft', emoji:'🌾', color:'#e0b43a'},
  sport:   {name:'Sport',          emoji:'⚽', color:'#3b8cff'},
  tuning:  {name:'Tuning',         emoji:'🔧', color:'#ff453a'}
};

const SUBJECTS = {
  mathe:    {name:'Mathe',    long:'Mathematik',          emoji:'🧮', color:'#0a84ff'},
  deutsch:  {name:'Deutsch',  long:'Deutsch',             emoji:'📖', color:'#ff6b4a'},
  englisch: {name:'Englisch', long:'Englisch',            emoji:'🌍', color:'#bf5af2'},
  nawi:     {name:'NaWi',     long:'Naturwissenschaften', emoji:'🔬', color:'#30d158'},
  technik:  {name:'Profi',    long:'Profi-Werkstatt',     emoji:'🔩', color:'#ff453a'}
};

const MISSIONS = [];
// Missionen mit eigenem Titelbild (img/m-<id>.jpg)
const MIMG_LIST = ['mathe-1', 'mathe-2', 'mathe-8', 'nawi-8', 'nawi-13', 'englisch-10', 'technik-1', 'technik-8', 'mathe-3', 'mathe-4', 'mathe-6', 'mathe-7', 'deutsch-3', 'deutsch-7', 'nawi-2', 'nawi-6', 'nawi-9', 'nawi-10', 'nawi-12', 'nawi-16', 'englisch-7', 'englisch-11', 'technik-3', 'technik-10'];

// ---- Hilfen
const de = (n, d = 1) => (+n).toFixed(d).replace('.', ',').replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');
const eur = n => (+n).toFixed(2).replace('.', ',') + ' €';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;

// ---- Bausteine (richtige Antwort bei quiz steht immer zuerst, die App mischt)
const W = (title, text, fact, svg) => ({type:'wissen', title, text, fact, svg});
// Teile-Zeichnung: svg = Schlüssel in SVGS/SPOTS (c-grafik.js). ask=true: Teile müssen angetippt werden (zählt als Aufgabe)
const P = (title, text, svg, ask = false, en = false) => ({type:'parts', title, text, svg, ask, en});
const Q = (q, right, wrong, why, img) => ({type:'quiz', q, opts:[right, ...wrong], why, img});
const N = (q, a, why, o = {}) => ({type:'num', q, a, why, ...o});
const T = (q, a, why, o = {}) => ({type:'text', q, a:[].concat(a), why, ...o});
const M = (title, pairs, text) => ({type:'match', title, pairs, text});
const O = (title, items, text, alts) => ({type:'order', title, items, text, alts});
const L = (title, text, sliders, out) => ({type:'slider', title, text, sliders, out});
const X = (prompt, hint, seconds = 60) => ({type:'talk', prompt, hint, seconds});

const GARAGE = [
  {id:'g1', name:'Simson S51',           need:0,    emoji:'🛵', img:'v2/img/ki/s51.jpg', text:'Dein erstes Moped.'},
  {id:'g2', name:'Rasentraktor',         need:80,   emoji:'🚜', img:'v2/img/ki/garage-rasentraktor.jpg', text:'Fürs Mähen und Üben.'},
  {id:'g3', name:'Fortschritt ZT 300',   need:200,  emoji:'🚜', img:'v2/img/ki/garage-zt300.jpg', text:'Der DDR-Klassiker auf dem Acker.'},
  {id:'g4', name:'Traktor mit Anhänger', need:400,  emoji:'🚛', img:'v2/img/ki/garage-traktor-anhaenger.jpg', text:'Ernte einfahren.'},
  {id:'g9', name:'Simson SR50',          need:550,  emoji:'🛵', img:'v2/img/ki/sr50.jpg', text:'Mit Verkleidung und Trittbrett.'},
  {id:'g5', name:'Mähdrescher E 512',    need:700,  emoji:'🌾', img:'v2/img/ki/garage-e512.jpg', text:'Großes Gerät für große Aufgaben.'},
  {id:'g6', name:'Simson Schwalbe',      need:1000, emoji:'🛵', img:'v2/img/ki/schwalbe.jpg', text:'Der Klassiker für die Sammlung.'},
  {id:'g7', name:'Unimog',               need:1400, emoji:'🚛', img:'v2/img/ki/garage-unimog.jpg', text:'Geht überall durch.'},
  {id:'g8', name:'Feldhäcksler',         need:1900, emoji:'🌽', img:'v2/img/ki/garage-feldhaecksler.jpg', text:'Ganz oben in der Garage.'}
];

// ---- Das große Ziel: Etappen. Eine Etappe ist geschafft, wenn alle Missionen mindestens 2 Sterne haben.
const PROJECT = {
  name: 'MTX 125',
  title: 'Das große Ziel: MTX-Zylinder',
  text: 'Ein Zylinder mit etwa 120 bis 125 cm³ für den MTX-Motor. Bis du ihn einbauen kannst, sammelst du hier das Wissen eines echten Tuners. Jede Etappe besteht aus Missionen aus verschiedenen Fächern.',
  note: 'Wichtig: Ein Umbau auf 125 cm³ ist nur mit Prüfung, Eintragung in die Papiere und dem passenden Führerschein für die Straße erlaubt. Schrauben und Planen machst du mit Erwachsenen.',
  stages: [
    {title: 'Motor verstehen',        text: 'Zweitakt, Wärme und Kühlkreislauf.',          ids: ['nawi-8', 'nawi-9', 'nawi-16']},
    {title: 'Rechnen wie ein Tuner',  text: 'Hubraum, Übersetzung und Zahlen im Griff.',    ids: ['mathe-8', 'mathe-9', 'mathe-12']},
    {title: 'Lesen und verstehen',    text: 'Fachtexte auf Deutsch und Englisch.',          ids: ['deutsch-10', 'deutsch-14', 'englisch-12']},
    {title: 'Planen und sparen',      text: 'Teile-Liste, Sparplan und Brief an den Händler.', ids: ['mathe-10', 'mathe-13', 'deutsch-13']},
    {title: 'Regeln und Sicherheit',  text: 'Betriebserlaubnis, Führerschein und Argumente.', ids: ['deutsch-8', 'deutsch-15']},
    {title: 'Profi-Tuner',            text: 'Hubraum berechnen, Verdichtung, Steuerzeiten und Leistung.', ids: ['technik-1', 'technik-2', 'technik-3', 'technik-4']}
  ]
};

// ---- Bildnachweis (KI-Bilder nach Vorlagen von Wikimedia Commons)
const CREDITS = [
  {file:'s51-b24.jpg',          title:'DDR Postmoped Simson S51 B2-4',              author:'KI-Bild nach Vorlage von Historiker BRD DDR, bearbeitet', license:'CC BY-SA 4.0 (Vorlage)', page:'DDR_Postmoped_-_SIMSON_S51_B2-4.jpg'},
  {file:'schwalbe-kr51-2.jpg',  title:'Simson Schwalbe KR51/2',                     author:'KI-Bild nach Vorlage von Metal-star (de.wikipedia), bearbeitet', license:'gemeinfrei (Vorlage)', page:'Simson_Schwalbe_KR51_2.jpg'},
  {file:'zt300-gelsdorf.jpg',   title:'Fortschritt ZT 300, Gelsdorf 2011',          author:'KI-Bild nach Vorlage von Slick, bearbeitet', license:'CC0 1.0 (Vorlage)',         page:'Fortschritt_ZT_300,_Gelsdorf_2011_(tonemapped_HDR).jpg'},
  {file:'zt300-seite.jpg',      title:'Fortschritt ZT 300, Seitenansicht',          author:'KI-Bild nach Vorlage von Fiver, der Hellseher, bearbeitet', license:'CC BY-SA 4.0 (Vorlage)', page:'Fortschritt_ZT_300_(2).jpg'},
  {file:'e512-seite.jpg',       title:'Mähdrescher Fortschritt E 512',              author:'KI-Bild nach Vorlage von Fiver, der Hellseher, bearbeitet', license:'CC BY-SA 4.0 (Vorlage)', page:'Mähdrescher_Fortschritt_E_512_mit_Sonnendach,_Schneidwerk_und_Abtankrohr_(side).jpg'},
];

// ---- Ränge (nach Punkten)
const RANKS = [
  {n:'Lehrling',      e:'🔧', p:0},
  {n:'Geselle',       e:'🛠️', p:150},
  {n:'Schrauber',     e:'⚙️', p:400},
  {n:'Techniker',     e:'🔩', p:800},
  {n:'Meister',       e:'🏅', p:1300},
  {n:'Tuner-Legende', e:'🏆', p:2000}
];
