/*eslint-env mocha */

import {assert} from 'chai'

import {newObjectResolver} from '../../js/lib/ndp-software/ottomann/resolver.js'
import {newDispatcher} from '../../js/lib/ndp-software/ottomann/dispatcher.js'

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

})

