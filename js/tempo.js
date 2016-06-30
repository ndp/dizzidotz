// MODEL
const msPerPeriod$ = new Rx.BehaviorSubject(2000)

// 20050..50 => 0..1
const normalizedTempo$ = scaleBehaviorSubject(msPerPeriod$, 20000, 50)

// VIEW
newDial(document.getElementById('tempo-dial'), normalizedTempo$)

