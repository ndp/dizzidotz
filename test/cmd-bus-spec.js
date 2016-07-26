/*eslint-env mocha */

import {assert} from 'chai'

import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import {newCmdBus$, newObjectResolver, newDispatcher, submodelHandler} from '../js/lib/ndp-software/cmdBus.js'

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


describe('submodelHandler', function() {

  it('applies to submodel', function(done) {
    const cmd = submodelHandler('b', i => i + 1)

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

    const cmd = submodelHandler('b', (i, c) => i + c.value)

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

    const cmd = submodelHandler('a', (i) => `was ${i}`)

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
    bus$.addReducer('increment', submodelHandler('b', i => i + 1))
    bus$.next('increment')

    state$.subscribe(() => {
      assert.equal(originalState.a, 0)
      assert.equal(originalState.b, 0)
      done()
    })
  })

  it('creates a partially appliable function [Experimental]', function(done) {
    const cmd = submodelHandler(i => i + 1)

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


describe('newDispatcher', function() {

  it('provides a no-op', function() {
    const dispatcher = newDispatcher(newObjectResolver())
    assert.equal('foo', dispatcher('foo', {name: 'x'}))
    assert.equal('bar', dispatcher('bar', {name: 'x'}))
  })

  it('add an event handler', function() {
    const dispatcher = newDispatcher(newObjectResolver())
    dispatcher.addCmdHandler('addOne', (x) => x * 10)
    assert.equal(50, dispatcher(5, {name: 'addOne'}))
    assert.equal(5, dispatcher(5, {name: 'x'}))
  })

})

describe('newObjectResolver', function() {

  it('returns null for unassigned', function() {
    const resolver = newObjectResolver()
    assert.equal(null, resolver('foo'))
  })

  it('add an event handler', function() {
    const resolver = newObjectResolver()
    const handler = (x) => x * 10
    resolver.addCmdHandler('addOne', handler)
    assert.equal(handler, resolver('addOne'))
  })

  it('add an event handler without the right data', function() {
    const resolver = newObjectResolver()

    assert.throws(()=> resolver.addCmdHandler(), 'requires a command name')
    assert.throws(()=> resolver.addCmdHandler('x'), 'requires a projection function')
    assert.throws(()=> resolver.addCmdHandler('x', 'y'), 'requires a projection function')
  })

  it('can provide object as starting pt', function() {
    const handler = (x) => x * 10
    const resolver = newObjectResolver({
      addOne: handler
    })
    assert.equal(handler, resolver('addOne'))
  })

})