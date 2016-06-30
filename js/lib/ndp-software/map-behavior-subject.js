if (typeof(require) !== 'undefined') Rx = require('rxjs/Rx')

// RxJS 4.0 v. 5.0 compat
Rx.BehaviorSubject.prototype.next = Rx.BehaviorSubject.prototype.onNext
Rx.BehaviorSubject.prototype.error = Rx.BehaviorSubject.prototype.oError
Rx.BehaviorSubject.prototype.complete = Rx.BehaviorSubject.prototype.onComplete

function mapBehaviorSubject(subject$, wrapFn, unwrapFn) {
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


if (typeof(module) !== 'undefined') {
  module.exports = {
    mapBehaviorSubject: mapBehaviorSubject
  }
}

