const assert = require('chai').assert;
const {newCmdBus$} = require('../js/lib/ndp-software/cmdBus.js')

describe('CmdBus', function() {

  it("unknown command does not mutate state", function(done) {
    const state$ = new Rx.BehaviorSubject('x')
    state$.subscribe((state) => assert.equal(state, 'x'))

    const bus$ = newCmdBus$(state$)
    bus$.next({name: 'unknown command'})

    assert.equal(state$.getValue(), 'x')
    state$.subscribe((state) => done())
  })


  it("register without a listener", function() {
    const state$ = new Rx.BehaviorSubject(0)
    const bus$   = newCmdBus$(state$)

    assert.throws(()=> bus$.addListener(), 'Listeners require a command name')
    assert.throws(()=> bus$.addListener('x'), 'Listeners require a projection function')
    assert.throws(()=> bus$.addListener('x', 'y'), 'Listeners require a projection function')
  });

  it("command mutates state", function(done) {

    const state$ = new Rx.BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addListener('increment', x => x + 1)
    bus$.next({name: 'increment'})

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  })

  it("command with string only", function(done) {
    const state$ = new Rx.BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addListener('increment', x => x + 1)
    bus$.next('increment')

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  });
})
