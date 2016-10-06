/*eslint-env browser */

import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/do'

// MODEL
export const name$ = new BehaviorSubject('My Dotz')


// VIEW
name$.subscribe(function(name) {
  const el     = document.querySelector('#pattern-name .name')
  el.innerHTML = name
})


// INTENT

// Change name
Observable
    .fromEvent(document.getElementById('pattern-name'), 'click')
    .do(e => e.preventDefault())
    .map(() =>  prompt('New name', name$.getValue()))
    .filter(x => x !== null)
    .subscribe(name$)
