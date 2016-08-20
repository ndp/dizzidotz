/*eslint-env mocha */

import {assert} from 'chai'

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import {newCmdBus$} from '../../js/lib/ndp-software/pilota/cmdBus.js'
import {submodelCmd} from '../../js/lib/ndp-software/pilota/submodelCmd.js'


describe('submodelCmd', function() {

  it('applies to submodel', function(done) {
    const cmd = submodelCmd('b', i => i + 1)

    const state$ = new BehaviorSubject({a: 0, b: 0})

    const bus$ = newCmdBus$(state$)
    bus$.addHandler('increment', cmd)
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
    bus$.addHandler('increment', cmd)
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
    bus$.addHandler('increment', cmd)
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
    bus$.addHandler('increment', submodelCmd('b', i => i + 1))
    bus$.next('increment')

    state$.subscribe(() => {
      assert.equal(originalState.a, 0)
      assert.equal(originalState.b, 0)
      done()
    })
  })

  it('creates a partially appliable function [Experimental]', function(done) {
    const cmd = submodelCmd(i => i + 1)

    const state$ = new BehaviorSubject({a: 0, b: 0, c: 1})

    const bus$ = newCmdBus$(state$)
    bus$.addHandler('incrementb', cmd('b'))
    bus$.addHandler('incrementc', cmd('c'))
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
