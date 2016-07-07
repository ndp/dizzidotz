import Rx from 'rxjs/Rx'
import {createTonalities} from './tonality-factory.js'

// MODEL
export const tonalities = createTonalities()

export const currentTonality$ = new Rx.BehaviorSubject('blues')

// VIEW
// Build scale control
const scaleCurrentElem    = document.getElementById('scale-current')

currentTonality$.subscribe((s) => scaleCurrentElem.innerHTML = `${s}`) // &#127925;
