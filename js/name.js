import Rx from 'rxjs/Rx'

// MODEL
export const name$ = new Rx.BehaviorSubject('My Dotz')


// VIEW
name$.subscribe(function(name) {
  const el     = document.querySelector('#pattern-name .name')
  el.innerHTML = name
})


// INTENT

// Change name
Rx.Observable
    .fromEvent(document.getElementById('pattern-name'), 'click')
    .do(e => e.preventDefault())
    .subscribe(function() {
                 const newName = prompt("New name", name$.getValue())
                 if (newName != null) {
                   name$.next(newName)
                 }
               })
