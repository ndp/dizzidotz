/*eslint-env browser */


import Rx, {
  Observable,
  Subject,
  asapScheduler,
  pipe,
  of,
  from,
  interval,
  merge,
  fromEvent,
  SubscriptionLike,
  PartialObserver,
} from 'rxjs'
import {
  tap,
  map,
  mapTo,
  filter,
  scan,
  distinct,
  withLatestFrom,
} from 'rxjs/operators'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/mapTo'

import {
  linearScaleFns,
  humanizeTempo,
}                             from './lib/ndp-software/util.js'
import { mapBehaviorSubject } from './lib/ndp-software/map-behavior-subject.js'
import { newDial }            from './dial.js'

import { newCmdBus$ } from 'pilota'


// MODEL
export const msPerPeriod$ = new BehaviorSubject(2000)
const [unwrapFn, wrapFn]  = linearScaleFns(20000, 50)
const normalizedTempo$    = mapBehaviorSubject(msPerPeriod$,
                                               wrapFn,
                                               unwrapFn)

const msPerPeriodCmd$ = newCmdBus$(msPerPeriod$)
msPerPeriodCmd$.on('inc', state => state * 0.98)
msPerPeriodCmd$.on('incXL', state => state * 0.92)
msPerPeriodCmd$.on('dec', state => state * 1.02)
msPerPeriodCmd$.on('decXL', state => state * 1.08)

// VIEW
const dial     = document.getElementById('tempo-dial')
const preview$ = newDial(dial, normalizedTempo$)
const textElem = () => dial.querySelector('text')

// Show the value or the "preview" value inside the text element.
merge(preview$
        .pipe(
          withLatestFrom(msPerPeriod$, (preview, state) => preview > 0 ? unwrapFn(preview) : state)),
      msPerPeriod$
)
  .pipe(map(humanizeTempo))
  .subscribe((x) => textElem().textContent = x)

// Set a class on the text element.
merge(
  msPerPeriod$.pipe(mapTo('value')),
  preview$.pipe(map(x => x > 0 ? 'preview' : 'value'))
)
  .subscribe((cls) => textElem().classList[cls == 'preview' ? 'add' : 'remove']('preview'))


// INTENT
const keyDown$ = fromEvent(document, 'keydown')
//keyDown$.subscribe((x) => console.log(x))

keyDown$
  .pipe(
    filter(e => e.key.match(/^Arrow(Up|Down)/i)),
    tap(e => e.preventDefault()),
    map(e => `${e.key.match(/Down/i) ? 'dec' : 'inc'}${e.shiftKey ? 'XL' : ''}`))
  .subscribe(msPerPeriodCmd$)

//logCmdBus//(msPerPeriodCmd$)

