/*eslint-env browser */

import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/filter'
import {newCmdBus$} from './lib/ndp-software/ottomann/cmdBus.js'

// MODEL
const STORE_KEY         = 'play-pause'
export const playState$ = new BehaviorSubject(localStorage[STORE_KEY] || 'playing')
playState$
    .subscribe(x => localStorage[STORE_KEY] = x)

const playStateBus$ = newCmdBus$(playState$)
playStateBus$.on('toggle', state => state == 'playing' ? 'paused' : 'playing')


// VIEW
const playPauseEl = document.getElementById('play-pause')

playState$.subscribe(x => {
  playPauseEl.className = playPauseEl.className.replace(/playing|paused/, x) // x = 'playing' or 'paused'
})


// INTENT
const playPauseClicks$ = Observable
    .fromEvent(playPauseEl, 'click')
    .do(e => e.preventDefault())

playPauseClicks$.mapTo('toggle').subscribe(playStateBus$)

Observable.fromEvent(document, 'keypress')
    .filter(e => e.keyCode == 32) // space
    .mapTo('toggle')
    .subscribe(playStateBus$)