// Englisch Klasse 6 (Rahmenlehrplan Berlin-Brandenburg, Moderne Fremdsprachen): Wortschatz, simple past, Steigerung, Wegbeschreibung, Zukunft
MISSIONS.push(

{id:'englisch-1', subject:'englisch', theme:'hof', topic:'Wortschatz', title:'On the Farm', sub:'Hof-Vokabeln auf Englisch', min:12,
 rlp:'Wortschatz: Tiere, Landwirtschaft, Umwelt; Sprechen: einfache Beschreibungen',
 steps:[
  W('On the farm', 'Auf Englisch heißt der Hof **farm**. Wichtige Wörter:\n\ntractor (Traktor), barn (Scheune), field (Feld), harvest (Ernte), cow (Kuh), pig (Schwein), sheep (Schaf, auch Mehrzahl!), chicken (Huhn), horse (Pferd), wheat (Weizen).',
    'Das Wort „tractor“ kommt aus dem Lateinischen: „trahere“ bedeutet ziehen.'),
  M('Ordne zu', [['Traktor', 'tractor'], ['Scheune', 'barn'], ['Ernte', 'harvest'], ['Weide', 'pasture'], ['Kuh', 'cow'], ['Schwein', 'pig']], 'Welches englische Wort passt?'),
  Q('What does a cow give us?', 'milk', ['wool', 'eggs', 'honey'], 'Cows give us milk. Hens give us eggs, sheep give us wool.'),
  T('Wie heißt „Huhn“ auf Englisch?', ['chicken', 'hen'], 'A chicken (oder hen) lives on the farm.', {}),
  T('Wie heißt „Pferd“ auf Englisch?', 'horse', 'Horse – a horse is a big animal.', {}),
  T('Wie heißt „Weizen“ auf Englisch?', 'wheat', 'Wheat – we make flour and bread from wheat.', {}),
  Q('Welche Mehrzahl von „sheep“ ist richtig?', 'sheep', ['sheeps', 'sheepes', 'shepp'], 'Sheep ist in der Einzahl und Mehrzahl gleich: one sheep, two sheep.'),
  Q('In summer we ___ the wheat.', 'harvest', ['harvests', 'harvesting', 'harvested'], 'Nach „we“ steht die Grundform: we harvest.'),
  X('Erzähle auf Englisch: „On the farm there is … / there are …“. Sag drei Sätze.', 'Tipp: Es dürfen kleine Fehler sein. Es geht um das Sprechen.', 45)
]},

{id:'englisch-2', subject:'englisch', theme:'simson', topic:'Technik-Vokabeln', title:'Engine Talk', sub:'Teile und Sätze rund ums Moped', min:12,
 rlp:'Wortschatz: Verkehr und Technik; Sprachmittlung: einfache Sätze übersetzen',
 steps:[
  W('Das Moped auf Englisch', 'handlebar (Lenker), tyre (Reifen), brake (Bremse), chain (Kette), spark plug (Zündkerze), exhaust (Auspuff), engine (Motor), tank (Tank), seat (Sitz).\n\nSätze: „The engine is very loud.“ = Der Motor ist sehr laut.'),
  M('Ordne zu', [['Lenker', 'handlebar'], ['Reifen', 'tyre'], ['Bremse', 'brake'], ['Kette', 'chain'], ['Zündkerze', 'spark plug'], ['Auspuff', 'exhaust']], 'Welches englische Wort passt?'),
  Q('What do you use to stop the moped?', 'the brake', ['the engine', 'the chain', 'the seat'], 'You use the brake to stop.'),
  T('Wie heißt „Motor“ auf Englisch?', 'engine', 'Engine – the engine makes the moped go.', {}),
  T('Wie heißt „Auspuff“ auf Englisch?', 'exhaust', 'Exhaust – the exhaust pipe is at the back.', {}),
  Q('A moped has ___ wheels.', 'two', ['four', 'three', 'one'], 'Moped = two wheels.'),
  Q('„The engine is very loud.“ bedeutet:', 'Der Motor ist sehr laut.', ['Der Motor ist sehr langsam.', 'Der Motor ist kaputt.', 'Der Motor ist sehr teuer.'], 'loud = laut.'),
  T('Übersetze ins Englische: Ich fahre mit dem Moped zur Schule.', ['I ride my moped to school', 'I go to school by moped', 'I drive my moped to school', 'I ride a moped to school', 'I go to school on my moped', 'I go to school on a moped'], 'Zum Beispiel: I ride my moped to school.', {hint:'ride = fahren (auf einem Fahrzeug).'})
]},

{id:'englisch-3', subject:'englisch', theme:'sport', topic:'Simple Past', title:'What did you do?', sub:'Vergangenheit auf Englisch', min:12,
 rlp:'Grammatik: simple past (regelmäßige und unregelmäßige Verben), Fragen und Verneinung mit did',
 steps:[
  W('Simple Past', 'Vergangenes erzählst du im **simple past**.\n\n• Regelmäßig: Verb + -ed (play – played, help – helped).\n• Unregelmäßig: go – went, run – ran, win – won, ride – rode, eat – ate, see – saw, drive – drove.\n\nFragen mit **did** + Grundform: Did you play football?\nVerneinung: I **didn’t** + Grundform: I didn’t go.'),
  M('Unregelmäßige Verben', [['go', 'went'], ['run', 'ran'], ['win', 'won'], ['ride', 'rode'], ['eat', 'ate'], ['see', 'saw']], 'Ordne die Vergangenheitsform zu.'),
  Q('Yesterday I ___ to football training.', 'went', ['go', 'goed', 'gone'], 'Go – went.'),
  Q('___ you play football yesterday?', 'Did', ['Do', 'Does', 'Are'], 'Fragen im simple past beginnen mit „did“.'),
  Q('I didn’t ___ my homework.', 'do', ['did', 'done', 'doed'], 'Nach „didn’t“ steht die Grundform: do.'),
  T('Simple past von „drive“:', 'drove', 'Drive – drove – driven.', {}),
  T('Setze ein: We ___ the game yesterday. (see)', 'saw', 'See – saw – seen.', {}),
  Q('Welcher Satz ist richtig?', 'She didn’t go to school.', ['She didn’t went to school.', 'She not go to school.', 'She doesn’t went to school.'], 'Nach didn’t steht die Grundform: go.'),
  O('Baue den Satz', ['Yesterday', 'I', 'rode', 'my', 'moped', 'to', 'the', 'farm'], 'Tippe die Wörter in der richtigen Reihenfolge an.', [['I', 'rode', 'my', 'moped', 'to', 'the', 'farm', 'yesterday']])
]},

{id:'englisch-4', subject:'englisch', theme:'simson', topic:'Comparatives', title:'Faster, bigger, the best', sub:'Steigern und vergleichen', min:12,
 rlp:'Grammatik: comparatives und superlatives, Vergleiche mit than und as … as',
 steps:[
  W('Steigerung im Englischen', '**Kurze Adjektive:** fast – faster – the fastest. Bei Doppelkonsonant: big – bigger – the biggest. Bei -y: heavy – heavier – the heaviest.\n\n**Lange Adjektive:** expensive – more expensive – the most expensive.\n\n**Unregelmäßig:** good – better – the best, bad – worse – the worst.\n\nVergleich: A is faster **than** B. Gleich: A is **as** fast **as** B.'),
  Q('A tractor is ___ than a moped.', 'heavier', ['heavy', 'heaviest', 'more heavy'], 'Heavy wird zu heavier (y wird zu i).'),
  Q('The Simson is ___ than the tractor.', 'faster', ['fast', 'fastest', 'more fast'], 'Kurzes Adjektiv: fast, faster.'),
  Q('This is ___ tractor on the farm.', 'the biggest', ['the bigger', 'the most big', 'big'], 'Big – bigger – the biggest.'),
  Q('A combine harvester is ___ than a tractor.', 'more expensive', ['expensiver', 'most expensive', 'the more expensive'], 'Lange Adjektive bekommen „more“.'),
  T('Setze ein: good – better – the ___', 'best', 'Good – better – best.', {}),
  T('Setze ein: big – ___', 'bigger', 'Beim Steigern wird das „g“ verdoppelt: bigger.', {}),
  Q('Der Traktor ist so schnell wie das Moped.', 'The tractor is as fast as the moped.', ['The tractor is faster than the moped.', 'The tractor is more fast the moped.', 'The tractor as fast as the moped.'], '„as … as“ drückt Gleichheit aus.'),
  M('Steigerung', [['small', 'smaller'], ['hot', 'hotter'], ['easy', 'easier'], ['good', 'better'], ['bad', 'worse']], 'Welche Steigerungsform passt?')
]},

{id:'englisch-5', subject:'englisch', theme:'hof', topic:'Directions', title:'How do I get to the farm?', sub:'Den Weg beschreiben', min:12,
 rlp:'Wortschatz Wohnort und Orientierung; Präpositionen; Sprachmittlung',
 steps:[
  W('Wegbeschreibung', 'Fragen: „Excuse me, how do I get to the farm?“\n\nAntworten: go straight on (geradeaus), turn left/right (links/rechts abbiegen), at the bridge (an der Brücke), next to (neben), behind (hinter), between (zwischen), opposite (gegenüber), across (über … hinweg).'),
  M('Ordne zu', [['geradeaus gehen', 'go straight on'], ['links abbiegen', 'turn left'], ['rechts abbiegen', 'turn right'], ['gegenüber', 'opposite'], ['neben', 'next to'], ['zwischen', 'between']], 'Welcher englische Ausdruck passt?'),
  Q('The barn is ___ the tractor and the pond.', 'between', ['behind', 'across', 'opposite'], 'between = zwischen.'),
  Q('The bakery is ___ the church. (hinter)', 'behind', ['between', 'across', 'next'], 'behind = hinter.'),
  Q('Excuse me, ___ do I get to the sports hall?', 'how', ['what', 'where is', 'which'], '„How do I get to …?“ fragt nach dem Weg.'),
  T('Wie heißt „Brücke“ auf Englisch?', 'bridge', 'Bridge – cross the bridge.', {}),
  T('Wie heißt „Kreuzung“ auf Englisch?', ['crossroads', 'junction', 'crossing', 'intersection'], 'Crossroads oder junction.', {}),
  O('Baue die Wegbeschreibung', ['Go', 'straight', 'on', 'and', 'turn', 'left', 'at', 'the', 'bridge'], 'Tippe die Wörter in der richtigen Reihenfolge an.'),
  Q('Dein Freund sagt: „Turn right at the farm.“ Was musst du tun?', 'An der Farm rechts abbiegen.', ['An der Farm links abbiegen.', 'An der Farm geradeaus fahren.', 'An der Farm anhalten.'], 'right = rechts, turn = abbiegen.')
]},

{id:'englisch-6', subject:'englisch', theme:'sport', topic:'Future', title:'Future Plans', sub:'will und going to', min:12,
 rlp:'Grammatik: will-future, going to-future, would like to',
 steps:[
  W('Über die Zukunft sprechen', '**going to** nutzt du für Pläne und Dinge, die man schon sieht: I’m going to play football on Saturday. Look, it’s going to rain.\n\n**will** nutzt du für spontane Entscheidungen und Versprechen: I’ll help you!\n\n**would like to** = möchte gern: I would like to be a farmer.'),
  Q('Look at the sky! It ___ rain.', 'is going to', ['will to', 'going to', 'is go to'], 'Man sieht dunkle Wolken. Dafür nimmt man „going to“.'),
  Q('I have a plan: I ___ buy a moped next year.', 'am going to', ['will to', 'going to', 'am go to'], 'Ein Plan wird mit „going to“ ausgedrückt.'),
  Q('Dad: „The phone is ringing!“ – You: „I ___ answer it!“', 'will', ['am going to answer', 'would to', 'going to'], 'Spontane Entscheidung: „will“. Kurzform: I’ll answer it.'),
  Q('„It’s cold in here.“ – „OK, I ___ close the window.“', 'will', ['am going', 'would', 'am go to'], 'Spontane Entscheidung: I will (I’ll) close the window.'),
  T('Setze ein: I would ___ to be a farmer.', 'like', 'I would like to … = Ich möchte gern …', {}),
  T('Wie heißt „Landwirt“ auf Englisch?', 'farmer', 'Farmer – a farmer works on a farm.', {}),
  X('Erzähle auf Englisch: Drei Dinge, die du am Wochenende vorhast. Beginne mit „I’m going to …“.', 'Tipp: Kurze Sätze reichen völlig.', 45)
]}

);

// ---- Erweiterung: Tuning-Werkstatt, Present Continuous, Present Perfect, Lesen, Einkaufsdialog
MISSIONS.push(

{id:'englisch-7', subject:'englisch', theme:'tuning', topic:'Technik-Vokabeln', title:'Tuning Workshop', sub:'Motorteile und Tuning-Begriffe auf Englisch', min:12,
 rlp:'Wortschatz: Technik und Hobby; Sprachmittlung: einfache technische Sätze verstehen',
 steps:[
  W('Words from the workshop', 'cylinder (Zylinder), piston (Kolben), crankshaft (Kurbelwelle), carburettor (Vergaser), clutch (Kupplung), gearbox (Getriebe), spark plug (Zündkerze), exhaust (Auspuff).\n\n**tuning** heißt: Du machst etwas leistungsfähiger oder besser. Das Verb dazu: to tune.',
    'Bei amerikanischem Englisch schreibt man „carburetor“ mit einem t weniger. Die Briten schreiben „carburettor“.'),
  M('Ordne zu', [['Zylinder', 'cylinder'], ['Kolben', 'piston'], ['Vergaser', 'carburettor'], ['Kurbelwelle', 'crankshaft'], ['Kupplung', 'clutch'], ['Getriebe', 'gearbox']], 'Welches englische Wort passt?'),
  P('Die Simson auf Englisch', 'Tippe auf die Zahlen. Du siehst die deutschen und die englischen Namen.', 'simson', false, true),
  P('Finde das Teil', 'Tippe auf das Teil mit dem englischen Namen.', 'simson', true, true),
  Q('The piston moves up and down in the ___.', 'cylinder', ['clutch', 'gearbox', 'chain'], 'The piston moves in the cylinder.'),
  T('Wie heißt „Kupplung“ auf Englisch?', 'clutch', 'Clutch – you pull the clutch lever to change gear.', {}),
  T('Wie heißt „Vergaser“ auf Englisch? (britisch oder amerikanisch)', ['carburettor', 'carburetor', 'carb'], 'Carburettor (UK) oder carburetor (US).', {}),
  Q('„I am tuning my moped.“ bedeutet:', 'Ich tune mein Moped.', ['Ich putze mein Moped.', 'Ich verkaufe mein Moped.', 'Ich verliere mein Moped.'], 'To tune = verbessern, einstellen.'),
  Q('Welcher Satz ist richtig?', 'The engine needs more air.', ['The engine need more air.', 'The engine needs more airs.', 'The engines needs more air.'], 'Bei he, she, it kommt ein -s an das Verb: needs.'),
  O('Baue den Satz', ['The', 'new', 'cylinder', 'makes', 'the', 'engine', 'stronger'], 'Tippe die Wörter in der richtigen Reihenfolge an.')
]},

{id:'englisch-8', subject:'englisch', theme:'traktor', topic:'Present Continuous', title:'What are you doing?', sub:'Was passiert gerade?', min:12,
 rlp:'Grammatik: present continuous (am/is/are + -ing), Unterschied zum simple present',
 steps:[
  W('Present continuous', 'Was passiert **gerade jetzt**? Dafür nimmst du das **present continuous**:\n\nam / is / are + Verb mit **-ing**\n\nI **am** clean**ing** the carburettor. He **is** drivi**ng** the tractor. They **are** mow**ing** the lawn.\n\nRechtschreibung: Ein stummes -e fällt weg (drive – driving, make – making). Kurzer Vokal vor einem Konsonanten: Konsonant verdoppeln (run – running).'),
  Q('Look! The tractor ___ into the field.', 'is driving', ['drive', 'are driving', 'driving'], 'Mit „the tractor“ (it) nimmst du „is“.'),
  Q('I ___ cleaning the carburettor now.', 'am', ['is', 'are', 'be'], 'Zu „I“ passt „am“.'),
  Q('The boys ___ playing football.', 'are', ['is', 'am', 'be'], 'Zu „they, the boys“ passt „are“.'),
  T('Setze ein: He is ___ the lawn. (mow)', 'mowing', 'mow + -ing = mowing.', {}),
  T('Setze ein: We are ___ to the farm. (run)', 'running', 'Run – running: Das n wird verdoppelt.', {}),
  Q('Welcher Satz ist richtig?', 'She is working in the barn.', ['She working in the barn.', 'She is work in the barn.', 'She are working in the barn.'], 'is + Verb mit -ing.'),
  Q('Welcher Satz beschreibt, was gerade passiert?', 'My dad is repairing the moped.', ['My dad repairs mopeds every Sunday.', 'My dad repaired the moped yesterday.', 'My dad will repair the moped.'], 'Present continuous = gerade jetzt.'),
  O('Baue den Satz', ['I', 'am', 'fixing', 'my', 'moped', 'now'], 'Tippe die Wörter in der richtigen Reihenfolge an.')
]},

{id:'englisch-9', subject:'englisch', theme:'sport', topic:'Present Perfect', title:'Have you ever ...?', sub:'Erfahrungen auf Englisch erzählen', min:12,
 rlp:'Grammatik: present perfect (have/has + Partizip), since und for, ever und never',
 steps:[
  W('Erfahrungen mit dem present perfect', 'Mit dem **present perfect** sprichst du über Erfahrungen: have / has + **Partizip**.\n\n• Have you ever **ridden** a tractor? – Yes, I have. / No, I haven’t.\n• I have never **driven** a quad.\n• She has **won** a medal.\n\nSeit wann? **since** (+ Zeitpunkt): since 2020. Wie lange? **for** (+ Zeitraum): for three years.',
    'Unregelmäßige Partizipien lernst du am besten auswendig, wie im Deutschen: fahren – gefahren.'),
  M('Verb und Partizip', [['ride', 'ridden'], ['drive', 'driven'], ['eat', 'eaten'], ['see', 'seen'], ['win', 'won'], ['write', 'written']], 'Welches Partizip passt?'),
  Q('___ you ever ridden a tractor?', 'Have', ['Has', 'Did', 'Are'], 'Mit „you“ nimmst du „have“.'),
  Q('She ___ won the race.', 'has', ['have', 'is', 'did'], 'Mit „she“ nimmst du „has“.'),
  Q('I have never ___ a quad.', 'driven', ['drove', 'drive', 'driving'], 'Nach have steht das Partizip: driven.'),
  T('Setze ein: He has ___ a tractor. (ride)', 'ridden', 'ride – rode – ridden.', {}),
  Q('I have lived here ___ 2019.', 'since', ['for', 'ago', 'in'], '„since“ nennt den Zeitpunkt, an dem es begann.'),
  Q('We have worked on the moped ___ three hours.', 'for', ['since', 'ago', 'in'], '„for“ nennt eine Dauer.'),
  X('Erzähle auf Englisch: Zwei Dinge, die du schon gemacht hast (zum Beispiel: I have ridden a tractor.) und eine, die du noch nie gemacht hast.', 'Tipp: „I have … / I have never …“. Kurze Sätze genügen.', 45)
]},

{id:'englisch-10', subject:'englisch', theme:'hof', topic:'Reading', title:'A day on the farm', sub:'Einen englischen Text lesen und verstehen', min:14,
 rlp:'Leseverstehen: kurze Texte global und im Detail verstehen, Fragen beantworten',
 steps:[
  W('Read the text', 'A day on Tom’s farm\n\nTom lives on a farm near a small village. Every morning at six o’clock he feeds the cows and the chickens. His sister Anna collects the eggs. After breakfast, Tom’s father drives the big tractor to the field. He is mowing the grass for hay. Tom helps him in the afternoon. He drives the small tractor and carries water to the sheep. In the evening the family eats dinner together. Tom is tired, but he is happy. He loves the farm.'),
  Q('What does Tom do at six o’clock?', 'He feeds the cows and the chickens.', ['He drives the big tractor.', 'He collects the eggs.', 'He eats dinner.'], 'Im Text: „Every morning at six o’clock he feeds the cows and the chickens.“'),
  Q('Who collects the eggs?', 'Anna', ['Tom', 'The father', 'The sheep'], 'Anna ist Toms Schwester und sammelt die Eier.'),
  Q('What is the father doing with the big tractor?', 'He is mowing the grass for hay.', ['He is feeding the sheep.', 'He is washing the tractor.', 'He is eating dinner.'], 'Im Text: „He is mowing the grass for hay.“'),
  Q('What does Tom carry to the sheep in the afternoon?', 'water', ['hay', 'eggs', 'milk'], 'Im Text: „carries water to the sheep“.'),
  T('Find the word: Tom lives on a ___ near a small village. (ein Wort aus dem Text)', 'farm', 'Der erste Satz nennt die farm.', {}),
  Q('How does Tom feel in the evening?', 'He is tired but happy.', ['He is sad.', 'He is angry.', 'He is afraid.'], 'Im Text: „Tom is tired, but he is happy.“'),
  Q('Welcher Satz fasst den Text am besten zusammen?', 'Tom hilft auf dem Bauernhof und mag das Leben dort.', ['Tom verkauft Traktoren.', 'Tom lernt im Urlaub Englisch.', 'Tom zieht in die Stadt.'], 'Der Text beschreibt einen Tag auf dem Hof und Toms Freude daran.')
]},

{id:'englisch-11', subject:'englisch', theme:'tuning', topic:'Dialog', title:'At the parts shop', sub:'Ein Teil bestellen oder kaufen', min:14,
 rlp:'Sprechen und Hören: einfache Alltagsdialoge, Zahlen und Preise, höfliche Wendungen',
 steps:[
  W('Im Ersatzteilladen', 'Wichtige Sätze:\n\n• Can I help you? – Kann ich helfen?\n• I’d like a spark plug, please. – Ich hätte gern eine Zündkerze.\n• How much is it? – Wie viel kostet es?\n• It’s three euros ninety. – Es kostet 3,90 €.\n• Here you are. – Bitte sehr.\n• Anything else? – Sonst noch etwas?\n• That’s all, thanks. – Das ist alles, danke.\n\nZahlen: 13 thirteen, 14 fourteen, 15 fifteen, 20 twenty, 30 thirty, 50 fifty, 100 a hundred.'),
  O('Der Dialog in der richtigen Reihenfolge', ['Hello, can I help you?', 'Yes, I’d like a new spark plug, please.', 'Here you are. That’s three euros ninety.', 'Thank you. Here are five euros.', 'And one euro ten change. Goodbye!'], 'Tippe die Zeilen in der richtigen Reihenfolge an.'),
  Q('Wie fragst du nach dem Preis?', 'How much is it?', ['What time is it?', 'Where is it?', 'Who is it?'], '„How much is it?“ fragt nach dem Preis.'),
  Q('Du möchtest eine Kette kaufen. Was sagst du?', 'I’d like a chain, please.', ['I am chain, please.', 'Chain I would a like.', 'Give chain me.'], 'Höflich mit „I’d like … , please.“'),
  T('Wie schreibt man 15 auf Englisch?', 'fifteen', '13 thirteen, 14 fourteen, 15 fifteen.', {}),
  T('Wie schreibt man 50 auf Englisch?', 'fifty', '40 forty, 50 fifty, 60 sixty.', {}),
  Q('„It’s three euros ninety.“ Wie viel kostet es?', '3,90 €', ['3,09 €', '39 €', '0,39 €'], 'three euros und ninety (cent).'),
  Q('Der Verkäufer fragt: „Anything else?“ Du brauchst nichts mehr. Was sagst du?', 'No, that’s all, thanks.', ['Yes, my name is Tom.', 'I am fine, thank you.', 'It is nine o’clock.'], '„That’s all, thanks.“ = Das ist alles, danke.'),
  X('Rollenspiel: Du bist im Ersatzteilladen und kaufst eine Kerze und eine Kette. Spiele beide Rollen, Käufer und Verkäufer.', 'Tipp: Fang mit „Hello, can I help you?“ an.', 60)
]}

);

// ---- Großes Ziel: MTX-Zylinder
MISSIONS.push(

{id:'englisch-12', subject:'englisch', theme:'tuning', topic:'Reading', title:'Water-cooled Power', sub:'Einen Technik-Text lesen', min:14,
 rlp:'Leseverstehen: Sachtexte global und im Detail verstehen, Fachwörter; Wortschatz Technik',
 steps:[
  W('Read the text', 'The MTX engine\n\nThe Honda MTX is a small enduro motorcycle from the 1980s. Its two-stroke engine is liquid-cooled. A pump moves the coolant through the engine and the radiator. The coolant takes the heat away from the cylinder.\n\nSome fans put the MTX engine into a Simson frame. This is called an engine swap. For a bigger cylinder, they often need a stronger carburettor and a new exhaust.\n\nWords: liquid-cooled (flüssigkeitsgekühlt), coolant (Kühlmittel), radiator (Kühler), pump (Pumpe), engine swap (Motorumbau), displacement (Hubraum).'),
  Q('How is the MTX engine cooled?', 'With liquid', ['With air only', 'With oil only', 'It is not cooled'], 'Im Text: „liquid-cooled“.'),
  Q('What moves the coolant through the engine?', 'A pump', ['A chain', 'A tyre', 'A seat'], 'Im Text: „A pump moves the coolant.“'),
  Q('What does the coolant do?', 'It takes the heat away from the cylinder.', ['It makes the engine louder.', 'It fills the tank.', 'It cleans the tyres.'], 'Im Text: „The coolant takes the heat away from the cylinder.“'),
  T('Wie heißt „Kühler“ auf Englisch? (ein Wort)', 'radiator', 'Radiator – the coolant gives its heat to the air in the radiator.', {}),
  T('Wie heißt „Hubraum“ auf Englisch? (ein Wort)', 'displacement', 'Displacement is the volume that the pistons move.', {}),
  Q('What is an engine swap?', 'You put a different engine into a frame.', ['You wash the engine.', 'You sell the engine.', 'You paint the engine.'], 'Swap = tauschen.'),
  Q('What do they often need for a bigger cylinder?', 'A stronger carburettor and a new exhaust', ['A new seat', 'A new horn', 'A new mirror'], 'Im letzten Satz des Textes.')
]}

);
