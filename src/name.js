/*eslint-env browser */

import {
  BehaviorSubject,
  fromEvent,
  tap, map, filter
} from 'rxjs'

// MODEL
export const name$ = new BehaviorSubject('My Dotz')


// VIEW
name$.subscribe(function (name) {
  const el     = document.querySelector('#pattern-name .name')
  el.innerHTML = name
})


// INTENT

// Change name
fromEvent(document.getElementById('pattern-name'), 'click')
  .pipe(
    tap(e => e.preventDefault()),
    map(() => prompt('New name', name$.getValue())),
    filter(x => x !== null)
  )
  .subscribe(name$)
