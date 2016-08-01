import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/last'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/throttleTime'
import {AnimationFrameScheduler} from 'rxjs/scheduler/AnimationFrameScheduler'

import {svgClippedArc} from './lib/ndp-software/svg.js'
import {ptToVector, normalizeRadians} from './lib/ndp-software/trig.js'

import {newCmdBus$, logCmdBus} from './lib/ndp-software/rx-dux/cmdBus.js'


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

  // VIEW
  model$.subscribe(function(x) {
    const value        = x * MAX_DEGREE
    const tempoReading = dom.querySelector('.reading')
    tempoReading
        .setAttribute('d', arc(0, value))
  })

  const previewElem = dom.querySelector('.preview')


  // INTENT
  const click$ = Observable
      .fromEvent(dom, 'click')
      .do(e => e.preventDefault())

  const mouseMove$ = Observable
      .fromEvent(dom, 'mousemove')
      .throttleTime(100, animationFrame)

  const mouseOut$ = Observable.fromEvent(dom, 'mouseout').debounceTime(800)

  click$
      .map(eventToPt)
      .map(ptToNormalizedValue)
      .subscribe(model$)


  // A click pauses preview for a while
  const pauser$ =
            click$
                .mapTo(false)
                .merge(click$.delay(1000).mapTo(true))
                .startWith(true)
                .distinctUntilChanged()


  const stopPreview$ = mouseMove$
      .debounceTime(2000)
      .merge(click$)
      .merge(mouseOut$)

  stopPreview$.subscribe(() => previewElem.setAttribute('d', ''))

  const preview$ = mouseMove$
      .filter(() => pauser$.last())
      .map(eventToPt)
      .map(ptToNormalizedValue)

  preview$
      .subscribe((x) => previewElem.setAttribute('d', arc(0, x * MAX_DEGREE)))

  return preview$
}


