/* eslint-env mocha */
/* global document */

import {assert} from 'chai'
import {newDial} from '../src/dial.js'

describe('Dial', function() {

  xit('can be called', function() {
    const context = document.createElement('div')
    assert.equal(newDial(context))
  })

})