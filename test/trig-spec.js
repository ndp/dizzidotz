/*eslint-env mocha */

import {assert} from 'chai'
import {ptToVector,vectorToPt, normalizeRadians} from '../src/lib/ndp-software/trig.js'


const threshold = 0.00000001

describe('normalizeRadians', function() {
  it('0', function() {
    assert.closeTo(normalizeRadians(0), 0, threshold)
  })
  it('2π', function() {
    assert.closeTo(normalizeRadians(Math.PI * 2), 0, threshold)
  })
  it('-2π', function() {
    assert.closeTo(normalizeRadians(Math.PI * -2), 0, threshold)
  })
  it('4π', function() {
    assert.closeTo(normalizeRadians(Math.PI * 4), 0, threshold)
  })

  it('1/2π', function() {
    assert.closeTo(normalizeRadians(.5 * Math.PI), .5 * Math.PI, threshold)
  })

  it('5/2π', function() {
    assert.closeTo(normalizeRadians(2.5 * Math.PI), .5 * Math.PI, threshold)
  })

  it('-3/2π', function() {
    assert.closeTo(normalizeRadians(-1.5 * Math.PI), .5 * Math.PI, threshold)
  })

  it('-7/2π', function() {
    assert.closeTo(normalizeRadians(-3.5 * Math.PI), .5 * Math.PI, threshold)
  })


  it('π', function() {
    assert.closeTo(normalizeRadians(Math.PI), Math.PI, threshold)
  })
  it('3π', function() {
    assert.closeTo(normalizeRadians(Math.PI * 3), Math.PI, threshold)
  })
  it('-π', function() {
    assert.closeTo(normalizeRadians(Math.PI * -1), Math.PI, threshold)
  })
  it('3π', function() {
    assert.closeTo(normalizeRadians(Math.PI * -3), Math.PI, threshold)
  })

})


const assertArrayClose = (r, e) => {
  e.forEach((_, i) => {
    assert.closeTo(r[i], e[i], threshold)
  })
}


describe('ptToVector', function() {
  it('ptToVector([1,1])', function() {
    assertArrayClose(ptToVector({x: 1, y: 1}), [Math.PI / 4, Math.sqrt(2)], 'We expect values to be sqrt(2)')
  })

  it('ptToVector([-100,0])', function() {
    assertArrayClose(ptToVector({x: -100, y: 0}), [Math.PI, 100], 'We expect values to be sqrt(2)')
  })

  it('ptToVector([-30,-40])', function() {
    assertArrayClose(ptToVector({x: -30, y: -40}), [-2.214297435588181, 50], 'We expect values to be sqrt(2)')
  })

})

describe('vectorToPt', function() {
  it('vectorToPt([Math.PI / 4, Math.sqrt(2)])', function() {
    var r = vectorToPt(Math.PI / 4, Math.sqrt(2))
    assertArrayClose([r.x, r.y], [1, 1])
  })

  it('vectorToPt([Math.PI, 100])', function() {
    var r = vectorToPt(Math.PI, 100)
    assertArrayClose([r.x, r.y], [-100, 0])
  })

  it('vectorToPt([-2.214297435588181, 50])', function() {
    var r = vectorToPt(-2.214297435588181, 50)
    assertArrayClose([r.x, r.y], [-30, -40])
  })

})

