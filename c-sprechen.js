// Sprechen und Präsentieren (Deutsch: Sprechen und Zuhören). Die bisherigen Werkstatt-Missionen, jetzt als kleiner Bereich im Fach Deutsch.
const breath = (n = 4) => ({type:'breath', inSec:4, outSec:6, rounds:n,
  text:'Atme durch die Nase ein wie beim Tanken. Dann langsam und gleichmäßig ausatmen, wie ein Motor, der ausrollt.'});
const SP = {subject:'deutsch', topic:'Sprechen und Präsentieren', speech:true, rlp:'Sprechen und Zuhören: Erzählen, Beschreiben, Interview und Präsentation'};

MISSIONS.push(
 {...SP, id:'simson-1', theme:'simson', skill:'start', title:'Kaltstart', sub:'Simson sanft anwerfen', min:10, steps:[
   {type:'wissen', title:'Sanft starten', text:'Eine Simson springt am besten an, wenn du sie nicht mit Vollgas trittst. Mit der Stimme ist das genauso: Erst ganz leise und weich einschalten, dann lauter werden.'},
   breath(4),
   {type:'soft', text:'Tippe auf „Sanft starten“ und lass die Stimme langsam hochdrehen, dann lies den Satz.', lines:[
     'Alte Motoren laufen ruhig.','Ich öle die Kette ordentlich.','Am Abend essen wir Eis.','Unser Onkel erzählt von der Simson.','Es ist eine alte Maschine.']},
   {type:'talk', prompt:'Erkläre in drei Sätzen: Wie startest du eine Simson?', hint:'Tipp: Fang jeden Satz leise an. Zwischen den Sätzen kurz Luft holen.', seconds:45}
 ]},
 {...SP, id:'simson-2', theme:'simson', skill:'tempo', title:'Die vier Gänge', sub:'Takt und Tempo steuern', min:12, steps:[
   {type:'wissen', title:'Gang wählen', text:'Beim Sprechen kannst du wie beim Schalten das Tempo wählen. Gang 1 ist ruhig und rund, Gang 3 ist schneller. Starte immer im ersten Gang.'},
   breath(3),
   {type:'rhythm', text:'Sprich jede Silbe zum Klick. Wenn du dich wohlfühlst, probiere den nächsten Gang.', lines:[
     ['Die','Sim','son','fährt','zum','Hof.'],
     ['Der','Mo','tor','läuft','ganz','ruhig.'],
     ['Wir','hal','ten','an','der','Wie','se.'],
     ['Heu','te','ist','schö','nes','Wet','ter.']]},
   {type:'talk', prompt:'Beschreibe die Teile einer Simson: Lenker, Tank, Motor, Räder. Sprich im ersten oder zweiten Gang.', hint:'Tipp: Lass nach jedem Teil eine kleine Pause.', seconds:45}
 ]},
 {...SP, id:'traktor-1', theme:'traktor', skill:'phrase', title:'Rasentraktor mähen', sub:'Schaltpausen beim Erzählen', min:10, steps:[
   {type:'wissen', title:'Schaltpause', text:'Ein Traktor schaltet in kleinen Pausen. Beim Sprechen machst du das auch: Sprich ein Stück, mach eine kurze Pause und atme locker ein. So bleibt das Tempo unter deiner Kontrolle.'},
   breath(3),
   {type:'phrase', text:'Sprich jeden Abschnitt, dann kommt die Schaltpause. Danach kurz atmen, dann kommt der nächste Abschnitt.', sentences:[
     ['Der Rasentraktor','steht in der Garage.'],
     ['Heute mähen wir','den ganzen Rasen.'],
     ['Zuerst fahre ich','eine Runde am Zaun entlang.'],
     ['Danach leere ich','den Grasfangkorb.']]},
   {type:'talk', prompt:'Erzähle: Wie mähst du einen Rasen vom Anfang bis zum Ende?', hint:'Tipp: Drei bis vier kleine Schritte, mit Schaltpausen dazwischen.', seconds:60}
 ]},
 {...SP, id:'traktor-2', theme:'traktor', skill:'erzaehlen', title:'Traktor-Reporter', sub:'Reporter-Rolle: erklären und kommentieren', min:12, steps:[
   breath(3),
   {type:'soft', text:'Starte jeden Satz leise und weich, wie ein Reporter, der ruhig beginnt.', lines:[
     'Und hier kommt der große Traktor.','Er zieht den Anhänger über das Feld.','Alle schauen gespannt zu.','Das war eine tolle Fahrt.']},
   {type:'talk', prompt:'Du bist Reporter auf dem Feld. Kommentiere in eigenen Worten, was der Traktor gerade macht.', hint:'Tipp: Sprich so, als würde ein Publikum zuhören: ruhig und klar.', seconds:60}
 ]},
 {...SP, id:'hof-1', theme:'hof', skill:'phrase', title:'Morgenrunde auf dem Hof', sub:'Tagesablauf in Abschnitten erzählen', min:12, steps:[
   breath(3),
   {type:'phrase', text:'Abschnitt sprechen, Pause, nächster Abschnitt.', sentences:[
     ['Früh am Morgen','füttern wir die Tiere.'],
     ['Danach kontrolliere ich','das Wasser und die Weide.'],
     ['Mittags fahren wir','mit dem Traktor aufs Feld.'],
     ['Am Abend','ist alles wieder sauber.']]},
   {type:'talk', prompt:'Erzähle den Ablauf eines Tages auf einem Bauernhof. Was passiert zuerst, was zuletzt?', hint:'Tipp: „Zuerst … danach … am Ende …“ hilft dir beim Aufbau.', seconds:60}
 ]},
 {...SP, id:'hof-2', theme:'hof', skill:'erzaehlen', title:'Ernte-Radio', sub:'Ein kurzes Interview führen', min:12, steps:[
   {type:'wissen', title:'Ruhig ins Mikro', text:'Ein guter Interviewer spricht klar, nicht schnell. Er lässt seinem Gegenüber Zeit und denkt vor jeder Frage kurz nach. Das übst du jetzt.'},
   breath(3),
   {type:'rhythm', text:'Sprich im Takt, das hilft dir, ruhig und klar zu bleiben.', lines:[
     ['Wann','be','ginnt','die','Ern','te?'],
     ['Wel','ches','Ge','trei','de','wächst','hier?'],
     ['Wie','lan','ge','dau','ert','das?']]},
   {type:'talk', prompt:'Stelle dir einen Landwirt vor und stelle ihm drei Fragen zur Ernte. Du darfst auch seine Antworten sprechen.', hint:'Tipp: Vor jeder Frage einmal ruhig einatmen.', seconds:60}
 ]},
 {...SP, id:'sport-1', theme:'sport', skill:'start', title:'Aufwärmen vor dem Spiel', sub:'Sanfter Start und Kommentar', min:10, steps:[
   breath(4),
   {type:'soft', text:'Wie beim Aufwärmen: erst locker, dann mehr Tempo. Starte jeden Satz weich.', lines:[
     'Alle laufen sich warm.','Ein Ball geht ins Tor.','Auf geht’s, Mannschaft!','Ich spiele im Mittelfeld.']},
   {type:'talk', prompt:'Kommentiere ein Tor wie ein Sportreporter: Wer schießt, wie fällt das Tor, wie reagieren die Fans?', hint:'Tipp: Kurze Sätze, kleine Pausen, ruhige Atmung.', seconds:45}
 ]},
 {...SP, id:'mut-1', theme:'sport', skill:'mut', title:'Mut-Mission', sub:'Im echten Leben anwenden', min:10, steps:[
   {type:'wissen', title:'Ausrollen lassen', text:'Wenn ein Wort mal hängt: Nicht drücken, nicht kämpfen. Lass es einfach ausrollen wie ein Motor, atme kurz und mach weiter. Du darfst hängen bleiben. Das ist kein Fehler.'},
   {type:'challenge', title:'Deine Mission für heute', text:'Wähle eine Aufgabe und mach sie heute:', options:[
     'Beim Bäcker oder im Laden selbst etwas bestellen.','Jemandem erklären, wie eine Simson oder ein Traktor funktioniert.','Beim Training oder in der Schule eine Frage stellen.','Am Telefon bei jemandem anrufen (Oma, Opa, Freund).']}
 ]}
);
