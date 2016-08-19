/*eslint-env mocha */

import {assert} from 'chai'

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import {newCmdBus$} from '../../js/lib/ndp-software/ottomann/cmdBus.js'
import {newDispatcher} from '../../js/lib/ndp-software/ottomann/dispatcher.js'
import {newObjectResolver} from '../../js/lib/ndp-software/ottomann/resolver.js'

describe('CmdBus', function() {

  it('unknown command does not mutate state', function(done) {
    const state$ = new BehaviorSubject('x')
    state$.subscribe((state) => assert.equal(state, 'x'))

    const bus$ = newCmdBus$(state$)
    bus$.next({name: 'unknown command'})

    assert.equal(state$.getValue(), 'x')
    state$.subscribe(() => done())
  })

  it('command mutates state', function(done) {

    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addHandler('increment', x => x + 1)
    bus$.next({name: 'increment'})

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  })

  it('provides command data', function(done) {

    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addHandler('increment', (x, c) => x + c.value)
    bus$.next({name: 'increment', value: 100})

    state$.subscribe((state) => {
      assert.equal(state, 100)
      done()
    })
  })

  it('command with string only', function(done) {
    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addHandler('increment', x => x + 1)
    bus$.next('increment')

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  })

  it('allows defining with explicit dispatcher', function(done) {
    const state$ = new BehaviorSubject(0)

    const actions = {
      plusOne:  (x) => x + 1,
      timesTen: (x) => x * 10
    }

    const dispatcher = newDispatcher(newObjectResolver(actions))
    const bus$ = newCmdBus$(state$, dispatcher)
    bus$.next('plusOne')
    bus$.next('timesTen')
    bus$.next('plusOne')

    state$.subscribe((state) => {
      assert.equal(state, 11)
      done()
    })


  })

  it('allows defining with object', function(done) {
    const state$ = new BehaviorSubject(0)

    const actions = {
      plusOne:  (x) => x + 1,
      timesTen: (x) => x * 10
    }

    const bus$ = newCmdBus$(state$, actions)
    bus$.next('plusOne')
    bus$.next('timesTen')
    bus$.next('plusOne')

    state$.subscribe((state) => {
      assert.equal(state, 11)
      done()
    })


  })
})




