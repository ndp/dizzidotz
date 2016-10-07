import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/distinct'


export function mapBehaviorSubject(subject$, wrapFn, unwrapFn) {
  // Distinct keeps cycles from triggering.
  const wrapped$ = new BehaviorSubject(wrapFn(subject$.getValue()))
  subject$
    .distinct()
    .subscribe(function(x) {
                 wrapped$.next(wrapFn(x))
               },
               function(err) {
                 wrapped$.error(err)
               },
               function() {
                 wrapped$.complete()
               })

  wrapped$
    .distinct()
    .subscribe(function(x) {
                 subject$.next(unwrapFn(x))
               },
               function(err) {
                 subject$.error(err)
               },
               function() {
                 subject$.complete()
               })
  return wrapped$
}


