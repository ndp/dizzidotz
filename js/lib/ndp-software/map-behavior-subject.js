let Rx
if (require) Rx = require('rxjs/Rx')

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

if (module) module.exports = {
  mapBehaviorSubject: mapBehaviorSubject
}