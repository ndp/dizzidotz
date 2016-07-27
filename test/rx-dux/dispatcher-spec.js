/*eslint-env mocha */

import {assert} from 'chai'

import {newObjectResolver} from '../../js/lib/ndp-software/rx-dux/resolver.js'
import {newDispatcher} from '../../js/lib/ndp-software/rx-dux/dispatcher.js'

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

