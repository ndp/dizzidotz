/*eslint-env mocha */

import {assert} from 'chai'

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import {newCmdBus$} from '../js/lib/ndp-software/cmdBus.js'

describe('CmdBus', function() {

  it('unknown command does not mutate state', function(done) {
    const state$ = new BehaviorSubject('x')
    state$.subscribe((state) => assert.equal(state, 'x'))

    const bus$ = newCmdBus$(state$)
    bus$.next({name: 'unknown command'})

    assert.equal(state$.getValue(), 'x')
    state$.subscribe(() => done())
  })


  it('register without a listener', function() {
    const state$ = new BehaviorSubject(0)
    const bus$   = newCmdBus$(state$)

    assert.throws(()=> bus$.addReducer(), 'Listeners require a command name')
    assert.throws(()=> bus$.addReducer('x'), 'Listeners require a projection function')
    assert.throws(()=> bus$.addReducer('x', 'y'), 'Listeners require a projection function')
  })

  it('command mutates state', function(done) {

    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', x => x + 1)
    bus$.next({name: 'increment'})

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  })

  it('provides command data', function(done) {

    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', (x, c) => x + c.value)
    bus$.next({name: 'increment', value: 100})

    state$.subscribe((state) => {
      assert.equal(state, 100)
      done()
    })
  })

  it('command with string only', function(done) {
    const state$ = new BehaviorSubject(0)

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', x => x + 1)
    bus$.next('increment')

    state$.subscribe((state) => {
      assert.equal(state, 1)
      done()
    })
  })
})

function submodelCmd(property, fn) {
  if (typeof fn != 'undefined') {
    return function(state, ...props) {
      const result     = Object.assign({}, state)
      result[property] = fn(state[property], ...props)
      return result
    }
  } else {
    // If no property is provided, then we return a partially applied fn.
    fn = property
    return function(property) {
      return submodelCmd(property, fn)
    }
  }
}


describe('SubmodelCmd', function() {

  it('applies to submodel', function(done) {
    const cmd = submodelCmd('b', i => i + 1)

    const state$ = new BehaviorSubject({a: 0, b: 0})

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', cmd)
    bus$.next('increment')

    state$.subscribe((state) => {
      assert.equal(state.a, 0)
      assert.equal(state.b, 1)
      done()
    })
  })

  it('provides command properties', function(done) {

    const cmd = submodelCmd('b', (i, c) => i + c.value)

    const state$ = new BehaviorSubject({a: 0, b: 0})

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', cmd)
    bus$.next({name: 'increment', value: 10})

    state$.subscribe((state) => {
      assert.equal(state.a, 0)
      assert.equal(state.b, 10)
      done()
    })
  })

  it('works from undefined state', function(done) {

    const cmd = submodelCmd('a', (i) => `was ${i}`)

    const state$ = new BehaviorSubject({})

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', cmd)
    bus$.next('increment')

    state$.subscribe((state) => {
      assert.equal(state.a, 'was undefined')
      done()
    })
  })

  it('does not change original state', function(done) {
    var originalState = {a: 0, b: 0}
    const state$      = new BehaviorSubject(originalState)

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('increment', submodelCmd('b', i => i + 1))
    bus$.next('increment')

    state$.subscribe(() => {
      assert.equal(originalState.a, 0)
      assert.equal(originalState.b, 0)
      done()
    })
  })

  it('creates a partially appliable function (needed?)', function(done) {
    const cmd = submodelCmd(i => i + 1)

    const state$ = new BehaviorSubject({a: 0, b: 0, c: 1})

    const bus$ = newCmdBus$(state$)
    bus$.addReducer('incrementb', cmd('b'))
    bus$.addReducer('incrementc', cmd('c'))
    bus$.next('incrementb')
    bus$.next('incrementc')

    state$.subscribe((state) => {
      assert.equal(state.a, 0)
      assert.equal(state.b, 1)
      assert.equal(state.c, 2)
      done()
    })

  })
})