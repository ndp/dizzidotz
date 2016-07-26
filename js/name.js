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
    .subscribe(function() {
                 const newName = prompt('New name', name$.getValue())
                 if (newName != null) {
                   name$.next(newName)
                 }
               })
