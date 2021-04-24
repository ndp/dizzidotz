/*eslint-env browser */
import {
  BehaviorSubject,
  fromEvent
}                          from 'rxjs'
import { newCmdBus$ }      from 'pilota'
import { tap, mapTo, filter } from 'rxjs/operators'

// MODEL
export const playState$ = new BehaviorSubject('paused')

const playStateBus$ = newCmdBus$(playState$)
playStateBus$.on('toggle', state => state === 'playing' ? 'paused' : 'playing')


// VIEW
const playPauseEl = document.getElementById('play-pause')

playState$.subscribe(x => {
  playPauseEl.className = playPauseEl.className.replace(/playing|paused/, x) // x = 'playing' or 'paused'
})


// INTENT
fromEvent(playPauseEl, 'click')
  .pipe(tap(e => e.preventDefault()),
        mapTo('toggle'))
  .subscribe(playStateBus$)

fromEvent(document, 'keypress')
  .pipe(
    filter(e => e.keyCode === 32), // space
    mapTo('toggle'))
  .subscribe(playStateBus$)
