import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {createTonalities} from './tonality-factory.js'

// MODEL
export const tonalities = createTonalities()

export const currentTonality$ = new BehaviorSubject('blues')

// VIEW
/* global document */
// Build scale control
const scaleCurrentElem    = document.getElementById('scale-current')

currentTonality$.subscribe((s) => scaleCurrentElem.innerHTML = `${s}`) // &#127925;
