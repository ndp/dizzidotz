import Rx from 'rxjs/Rx'
import {svgClippedArc} from './lib/ndp-software/svg.js'
import {ptToVector, normalizeRadians} from './lib/ndp-software/trig.js'

export function newDial(dom, model$) {

  // VIEW
  model$.subscribe(function(x) {
    const startAngle   = 0
    const value        = x * 350 + startAngle
    const tempoReading = dom.querySelector('.reading')
    tempoReading
        .setAttribute('d', svgClippedArc(50, 50, 30, 45, startAngle, value))
  })


  function pt2rads(pt) {
    let rads = ptToVector(pt)[0]
    rads     = rads + Math.PI / 2
    rads     = normalizeRadians(rads)
    rads     = rads < 0 ? rads + 2 * Math.PI : rads
    return rads
  }

  // INTENT
  const click$ = Rx.Observable
      .fromEvent(dom, 'click')

  click$
      .map(e => {
             return {x: e.layerX - 50, y: e.layerY - 50}
           })
      .map(pt2rads)
      .map(r=>r * 0.5 / Math.PI)    // normalize [0..1]
      .subscribe(model$)


  // A click pauses preview for a while
  const pauser$ =
            click$
                .mapTo(false)
                .merge(click$.delay(1000).mapTo(true))
                .startWith(true)
                .distinctUntilChanged()

  const mouseMove$ = Rx.Observable
      .fromEvent(dom, 'mousemove')
      .throttleTime(100) // , Rx.Scheduler.requestAnimationFrame

  const stop$ = mouseMove$
      .debounceTime(2000)
      .merge(click$)
      .merge(Rx.Observable.fromEvent(dom, 'mouseout'))

  stop$
      .subscribe(function() {
                   dom.querySelector('.hover')
                       .setAttribute('d', '')
                 })

  const preview$ = mouseMove$
      .filter(() => pauser$.last())
      .map(e => {
             return {x: e.layerX - 50, y: e.layerY - 50}
           })
      .map(pt2rads)
      .map(r=>r * 0.5 / Math.PI)  // normalize [0..1]

  preview$
      .subscribe(function(x) {
                   dom.querySelector('.hover')
                       .setAttribute('d', svgClippedArc(50, 50, 30, 45, 0, x * 350))
                 })

  return preview$
}


