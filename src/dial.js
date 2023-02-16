import {
  BehaviorSubject,
  merge,
  fromEvent,
  Scheduler
}                          from 'rxjs'

import { svgClippedArc }                from './ndp-software/svg.js'
import { ptToVector, normalizeRadians } from './ndp-software/trig.js'

import {
  newCmdBus$,
  logCmdBus
} from 'pilota'
import {
  debounceTime,
  delay,
  tap,
  map,
  mapTo,
  throttleTime
} from 'rxjs/operators'

const MAX_DEGREE = 355

function arc (startAngle, value) {
  return svgClippedArc(50, 50, 25, 45, startAngle, value)
}

export function newDial (dom, model$) {

  function eventToPt (e) {
    return {
      x: e.layerX / dom.clientWidth - 0.5,
      y: e.layerY / dom.clientHeight - 0.5
    }
  }

  function ptToNormalizedValue (pt) {
    let rads = ptToVector(pt)[0]
    rads     = rads + Math.PI / 2
    rads     = normalizeRadians(rads, true)
    return rads * 0.5 / Math.PI // normalize [0..1]
  }

  // MODEL
  const preview$    = new BehaviorSubject({ paused: false, value: null })
  const previewCmd$ = newCmdBus$(preview$, {
    pause () {
      return { value: 0, paused: true }
    },
    resume () {
      return { value: 0, paused: false }
    },
    change (state, cmd) {
      return { ...state, value: cmd.value }
    }
  })
  logCmdBus //(previewCmd$)


  // VIEW
  model$.subscribe(function (x) {
    const value        = x * MAX_DEGREE
    const tempoReading = dom.querySelector('.reading')
    tempoReading
      .setAttribute('d', arc(0, value))
  })

  // Draw preview
  const previewElem = dom.querySelector('.preview')
  preview$
    .subscribe(state => previewElem.setAttribute('d', (state.paused || state.value === 0) ? '' : arc(0, state.value * MAX_DEGREE)))

  // INTENT
  const click$     = fromEvent(dom, 'click').pipe(tap(e => e.preventDefault()))
  const mouseMove$ = fromEvent(dom, 'mousemove')

  click$
    .pipe(
      map(eventToPt),
      map(ptToNormalizedValue))
    .subscribe(model$)

  // preview mouse moves
  const scheduler = Scheduler.requestAnimationFrame
  mouseMove$
    .pipe(
      throttleTime(50, scheduler),
      map(eventToPt),
      map(ptToNormalizedValue),
      map(x => {
        return { name: 'change', value: x }
      }))
    .subscribe(previewCmd$)

  // Preview off during pause: mm mm mm ...   [1s pause]
  mouseMove$
    .pipe(
      debounceTime(1000, scheduler),
      map(() => {
        return { name: 'change', value: null }
      })
    )
    .subscribe(previewCmd$)

  // When click, turn preview off: mm mm mm mc  [1 sec off]
  const pause$  = click$.pipe(mapTo('pause'))
  const resume$ = click$.pipe(delay(1000), mapTo('resume'))
  merge(pause$, resume$).subscribe(previewCmd$)

  // Return a stream of preview values
  return preview$
    .pipe(
      map((state) => state.paused ? null : state.value))
}


