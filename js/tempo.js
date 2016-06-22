// MODEL
const msPerPeriod$ = new Rx.BehaviorSubject(2000)

// VIEW
const msPerPeriodInput = document.getElementById('ms-per-period')

// INTENT
const tempoChangeAction$ = Rx.Observable
    .fromEvent(msPerPeriodInput, 'change')
    .map((e) => e.target.value)

tempoChangeAction$.subscribe(msPerPeriod$)
