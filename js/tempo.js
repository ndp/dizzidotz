/*eslint-env browser */

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import 'rxjs/add/operator/mapTo'

import {linearScaleFns, humanizeTempo} from './lib/ndp-software/util.js'
import {mapBehaviorSubject} from './lib/ndp-software/map-behavior-subject.js'
import {newDial} from './dial.js'


// MODEL
export const msPerPeriod$ = new BehaviorSubject(2000)
const [unwrapFn, wrapFn] = linearScaleFns(20000, 50)
const normalizedTempo$    = mapBehaviorSubject(msPerPeriod$,
                                               wrapFn,
                                               unwrapFn)

// VIEW
const dial     = document.getElementById('tempo-dial')
const preview$ = newDial(dial, normalizedTempo$)
const textElem = () => dial.querySelector('text')

// Show the value or the "preview" value inside the text element.
preview$
    .withLatestFrom(msPerPeriod$, (preview, state) =>  preview > 0 ? unwrapFn(preview) : state)
    .merge(msPerPeriod$)
    .map(humanizeTempo)
    .subscribe((x)  => textElem().textContent = x)

// Set a class on the text element.
msPerPeriod$
    .mapTo('value')
    .merge(preview$.map(x => x > 0 ? 'preview' : 'value'))
    .subscribe((cls) => textElem().classList[cls == 'preview' ? 'add' : 'remove']('preview'))
