// MODEL
const msPerPeriod$ = new Rx.BehaviorSubject(2000)

// VIEW
const tempoReading = document.getElementById('tempo-reading')

msPerPeriod$
    .map(x => 20000 - x)
    .subscribe(function(x) {
                 const startAngle = 0
                 const value      = x / 20000.0 * 270 + startAngle
                 tempoReading
                     .setAttribute('d', svgArc(50, 50, 45, startAngle, value))

               })

//newDial(msPerPeriod$, tempoReading, { min: 200, max: 20000 })
//
//
//function newDial(model$, el, settings = {}) {
//  const defaults = {min: 0, max: 0, minDegree: 0, maxDegree: 270}
//  settings = Object.assign({}, defaults, settings)
//
//  model$
//      .map(x => settings.max - x)
//      .subscribe(function(x) {
//                   const startAngle = settings.minDegree
//                   const value      = x / 20000.0 * (settings.maxDegree - settings.minDegree) + startAngle
//                     el.setAttribute('d', svgArc(50, 50, 45, startAngle, value))
//                 })
//
//}

// INTENT
Rx.Observable
    .fromEvent(document.getElementById('tempo-dial'), 'click')
    .map(e => {
           return {x: e.layerX - 50, y: e.layerY - 50}
         })
    .map(pt => ptToVector(pt)[0])
    .map(normalizeRadians)
    .filter(r => r >= -Math.PI / 2)  // [-.5π..π]
    .map(r=>r + Math.PI / 2)   // 0..3/2π
    .map(r=>r * .66665 / Math.PI) // normalize [0..1]
  //.map(log('clicks'))
    .map(s => 20200 - s * 20000)
    .subscribe(msPerPeriod$)


