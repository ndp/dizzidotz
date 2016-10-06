/*eslint-env mocha */

import {assert} from 'chai'
import simple from 'simple-mock'

import {newObjectResolver} from '../../src/lib/ndp-software/pilota/resolver.js'
import {newDispatcher} from '../../src/lib/ndp-software/pilota/dispatcher.js'

describe('newDispatcher', function() {

  it('provides a no-op', function() {
    const dispatch = newDispatcher(newObjectResolver())
    assert.equal(undefined, dispatch('foo', {name: 'x'}))
    assert.equal(undefined, dispatch('bar', {name: 'x'}))
  })

  it('add an event handler', function() {
    const dispatch = newDispatcher(newObjectResolver())
    dispatch.addHandler('addOne', (x) => x * 10)
    assert.equal(50, dispatch(5, {name: 'addOne'}))
    assert.equal(undefined, dispatch(5, {name: 'x'}))
  })

  it('provides command object in `this` context', function() {
    const dispatch = newDispatcher(newObjectResolver())
    const handler  = simple.spy(function() {})
    dispatch.addHandler('addOne', handler)
    dispatch(5, {name: 'addOne', detail: 42})
    assert.equal(handler.lastCall.context.name, 'addOne')
    assert.equal(handler.lastCall.context.detail, 42)
  })

  afterEach(function() {
    simple.restore()
  })
})

