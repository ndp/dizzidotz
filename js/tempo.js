// MODEL
const msPerPeriod$ = new Rx.BehaviorSubject(2000)

// VIEW
const msPerPeriodInput = document.getElementById('ms-per-period')

// INTENT
const tempoChangeAction$ = Rx.Observable
    .fromEvent(msPerPeriodInput, 'change')
    .map((e) => e.target.value)

tempoChangeAction$.subscribe(msPerPeriod$)




msPerPeriod$
    .map(x => 20000 - x)
    .subscribe(function(x) {
                 const startAngle = 0
                 const value      = x / 20000.0 * 300 + startAngle
                 document
                     .getElementById('x')
                     .setAttribute('d', svgArc(50, 50, 45, startAngle, value))

               })