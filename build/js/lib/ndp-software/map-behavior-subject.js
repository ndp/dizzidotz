import Rx from 'rxjs/Rx'

export function mapBehaviorSubject(subject$, wrapFn, unwrapFn) {
  // Distinct keeps cycles from triggering.
  const wrapped$ = new Rx.BehaviorSubject(wrapFn(subject$.getValue()))
  subject$.distinct().subscribe(function(x) {
                                  wrapped$.next(wrapFn(x))
                                },
                                function(err) {
                                  wrapped$.error(err)
                                },
                                function() {
                                  wrapped$.complete()
                                })

  wrapped$.distinct().subscribe(function(x) {
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


function scaleBehaviorSubject(subject$, minOrMax, max) {
  const [unwrapFn, wrapFn] = linearScaleFns(minOrMax, max)
  return mapBehaviorSubject(subject$,
                            wrapFn,
                            unwrapFn)
}

