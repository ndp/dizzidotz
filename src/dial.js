import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs'
import Rx from 'rxjs'
import 'rxjs/add/observable/fromEvent'

import {svgClippedArc} from './lib/ndp-software/svg.js'
import {ptToVector, normalizeRadians} from './lib/ndp-software/trig.js'

import {newCmdBus$, logCmdBus} from 'pilota'


//import {run} from '@cycle/rxjs-run'
//import {makeDOMDriver, svg} from '@cycle/dom'

const MAX_DEGREE = 355

function arc(startAngle, value) {
  return svgClippedArc(50, 50, 25, 45, startAngle, value)
}

export function newDial(dom, model$) {

  function eventToPt(e) {
    return {x: e.layerX / dom.clientWidth - 0.5, y: e.layerY / dom.clientHeight - 0.5}
  }

  function ptToNormalizedValue(pt) {
    let rads = ptToVector(pt)[0]
    rads     = rads + Math.PI / 2
    rads     = normalizeRadians(rads)
    rads     = rads < 0 ? rads + 2 * Math.PI : rads
    return rads * 0.5 / Math.PI // normalize [0..1]
  }

  // MODEL
  const preview$    = new BehaviorSubject({paused: false, value: null})
  const previewCmd$ = newCmdBus$(preview$, {
    pause()  {
      return {value: 0, paused: true}
    },
    resume() {
      return {value: 0, paused: false}
    },
    change(state, cmd) {
      return Object.assign({}, state, {value: cmd.value})
    }
  })
  logCmdBus //(previewCmd$)


  // VIEW
  model$.subscribe(function(x) {
    const value        = x * MAX_DEGREE
    const tempoReading = dom.querySelector('.reading')
    tempoReading
        .setAttribute('d', arc(0, value))
  })

  // Draw preview
  const previewElem = dom.querySelector('.preview')
  preview$
      .subscribe(state => previewElem.setAttribute('d', (state.paused || state.value == 0) ? '' : arc(0, state.value * MAX_DEGREE)))

  // INTENT
  const click$     = Observable.fromEvent(dom, 'click').do(e => e.preventDefault())
  const mouseMove$ = Observable.fromEvent(dom, 'mousemove')

  click$
      .map(eventToPt)
      .map(ptToNormalizedValue)
      .subscribe(model$)

  // preview mouse moves
  const scheduler = Rx.Scheduler.requestAnimationFrame
  mouseMove$
      .throttleTime(50, scheduler)
      .map(eventToPt)
      .map(ptToNormalizedValue)
      .map(x => {
             return {name: 'change', value: x}
           })
      .subscribe(previewCmd$)

  // Preview off during pause: mm mm mm ...   [1s pause]
  mouseMove$
      .debounceTime(1000, scheduler)
      .map(() => {
             return {name: 'change', value: null}
           })
      .subscribe(previewCmd$)

  // When click, turn preview off: mm mm mm mc  [1 sec off]
  click$
      .mapTo('pause')
      .merge(click$.delay(1000).mapTo('resume'))
      .subscribe(previewCmd$)

  // Return a stream of preview values
  return preview$.map((state) => state.paused ? null : state.value)
}


