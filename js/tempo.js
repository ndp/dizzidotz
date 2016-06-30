// MODEL
const msPerPeriod$ = new Rx.BehaviorSubject(2000)

// 20050..50 => 0..1
const normalizedTempo$ = mapBehaviorSubject(msPerPeriod$,
                                            (x) => Math_within(1 - (x - 50) / 20000, 0, 1),
                                            (x) => Math_within(((1 - x) * 20000) + 50, 50, 20000))

// VIEW
newDial(document.getElementById('tempo-dial'), normalizedTempo$)

