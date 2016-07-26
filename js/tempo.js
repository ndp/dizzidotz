/*eslint-env browser */

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import 'rxjs/add/operator/mapTo'

import {linearScaleFns} from './lib/ndp-software/util.js'
import {mapBehaviorSubject} from './lib/ndp-software/map-behavior-subject.js'
import {newDial} from './dial.js'


// MODEL
export const msPerPeriod$ = new BehaviorSubject(2000)

const [unwrapFn, wrapFn] = linearScaleFns(20000, 50)
const normalizedTempo$ = mapBehaviorSubject(msPerPeriod$,
                                            wrapFn,
                                            unwrapFn)

// VIEW
const preview$ = newDial(document.getElementById('tempo-dial'), normalizedTempo$)

const text = () => document.getElementById('tempo-dial').querySelector('text')

// ms/rev => human readable
function humanizeTempo(x) {
  const speed = x < 5000 ? Math.round(60000 / x) : x < 10000 ? Math.round(x / 100) / 10 : Math.round(x / 1000)
  return `${speed}${x < 5000 ? 'rpm' : 's'}`
}

msPerPeriod$
    .merge(preview$.map(unwrapFn))
    .subscribe(function(x) {
                 text().textContent = humanizeTempo(x)
               })

// Set a class on the text
msPerPeriod$
    .mapTo('value')
    .merge(preview$.mapTo('preview'))
    .subscribe(function(className) {
                 text().classList[className == 'preview' ? 'add' : 'remove']('preview')
               })


preview$
    .debounceTime(400)
    .withLatestFrom(msPerPeriod$)
    .subscribe(function(values) {
                 text().classList.remove('preview')
                 text().textContent = humanizeTempo(values[1])
               })