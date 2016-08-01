/*eslint-env browser */

import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/mapTo'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'

import {linearScaleFns, humanizeTempo} from './lib/ndp-software/util.js'
import {mapBehaviorSubject} from './lib/ndp-software/map-behavior-subject.js'
import {newDial} from './dial.js'

import {newCmdBus$, logCmdBus} from './lib/ndp-software/rx-dux/cmdBus.js'


// MODEL
export const msPerPeriod$ = new BehaviorSubject(2000)
const [unwrapFn, wrapFn] = linearScaleFns(20000, 50)
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


// INTENT
const keyDown$ = Observable.fromEvent(document, 'keydown')
//keyDown$.subscribe((x) => console.log(x))

keyDown$
    .filter(e => e.key.match(/^Arrow(Up|Down)/i))
    .do(e => e.preventDefault())
    .map(e => `${e.key.match(/Down/i) ? 'dec' : 'inc'}${e.shiftKey? 'XL' : ''}`)
    .subscribe(msPerPeriodCmd$)

//logCmdBus//(msPerPeriodCmd$)

