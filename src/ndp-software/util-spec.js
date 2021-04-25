/*eslint-env mocha */

import { assert } from 'chai'
import {
  isFunction,
  pin,
  linearScaleFns,
  ptInRect,
  ptInInscribedCircle
}                 from './util.js'

describe('util.js: ', function () {

  describe('#isFunction', function () {
    it('detects a function', function () {
      assert.equal(true, isFunction(function () {
      }))
      assert.equal(true, isFunction(() => undefined))
    })
    it('rejects non-function', function () {
      assert.equal(false, isFunction(undefined))
      assert.equal(false, isFunction(null))
      assert.equal(false, isFunction(0))
      assert.equal(false, isFunction({}))
    })
  })

  describe('#pin', function () {
    it('pins to lower', function () {
      assert.equal(10, pin(0, 10, 20) )
    })
    it('pins to upper', function () {
      assert.equal(20, pin(30, 10, 20) )
    })
    it('passes through number within range', function () {
      assert.equal(15, pin(15, 10, 20) )
    })
  })

  describe('#linearScaleFns', function () {

    describe('with max', function () {
      it('scales on onwrap', function () {
        const [scaleFn, _] = linearScaleFns(100)
        assert.equal(0, scaleFn(0))
        assert.equal(100, scaleFn(1))
        assert.equal(50, scaleFn(0.5))
      })
      it('scales on wrap', function () {
        const [_, unscaleFn] = linearScaleFns(100)
        assert.equal(0, unscaleFn(0))
        assert.equal(1, unscaleFn(100))
        assert.equal(.5, unscaleFn(50))
      })
      it('constrains to range', function () {
        const [scaleFn, unscaleFn] = linearScaleFns(100)
        assert.equal(0, scaleFn(-0.1))
        assert.equal(0, scaleFn(-100))
        assert.equal(100, scaleFn(1.1))
        assert.equal(100, scaleFn(1000))

        assert.equal(0, unscaleFn(-0.0001))
        assert.equal(0, unscaleFn(-100))
        assert.equal(1, unscaleFn(101))
        assert.equal(1, unscaleFn(1000))
      })
    })

    describe('with min,max', function () {

      it('scales on onwrap', function () {
        const [scaleFn, _] = linearScaleFns(100, 200)
        assert.equal(100, scaleFn(0))
        assert.equal(200, scaleFn(1))
        assert.equal(150, scaleFn(0.5))
      })
      it('scales on wrap', function () {
        const [_, unscaleFn] = linearScaleFns(100, 200)
        assert.equal(0, unscaleFn(100))
        assert.equal(1, unscaleFn(200))
        assert.equal(.5, unscaleFn(150))
      })
      it('constrains to range', function () {
        const [scaleFn, unscaleFn] = linearScaleFns(100, 200)
        assert.equal(100, scaleFn(-0.1))
        assert.equal(100, scaleFn(-100))
        assert.equal(200, scaleFn(1.1))
        assert.equal(200, scaleFn(1000))

        assert.equal(0, unscaleFn(-0.0001))
        assert.equal(0, unscaleFn(-100))
        assert.equal(0, unscaleFn(99))
        assert.equal(1, unscaleFn(201))
        assert.equal(1, unscaleFn(1000))
      })
    })

    describe('with max, min (flipped)', function () {
      it('scales on onwrap', function () {
        const [scaleFn, _] = linearScaleFns(200, 100)
        assert.equal(100, scaleFn(1))
        assert.equal(200, scaleFn(0))
        assert.equal(150, scaleFn(0.5))
      })
      it('scales on wrap', function () {
        const [_, unscaleFn] = linearScaleFns(200, 100)
        assert.equal(1, unscaleFn(100))
        assert.equal(0, unscaleFn(200))
        assert.equal(.5, unscaleFn(150))
      })
      it('constrains to range', function () {
        const [scaleFn, unscaleFn] = linearScaleFns(200, 100)
        assert.equal(200, scaleFn(-0.1))
        assert.equal(200, scaleFn(-100))
        assert.equal(100, scaleFn(1.1))
        assert.equal(100, scaleFn(1000))

        assert.equal(1, unscaleFn(-0.0001))
        assert.equal(1, unscaleFn(-100))
        assert.equal(1, unscaleFn(99))
        assert.equal(0, unscaleFn(201))
        assert.equal(0, unscaleFn(1000))
      })
    })
  })


  describe('#ptInRect', function () {

    it('returns true for pt clearly within', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 15 }
      assert.equal(ptInRect(pt, rect), true)
    })

    it('returns false for pt outside on the x-axis', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 15, y: 15 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt outside on the y-axis', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 45 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt clearly outside', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 0, y: 0 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt on the left side', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 350, y: 15 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt on the right side', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 40, y: 15 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt on the top side', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 10 }
      assert.equal(ptInRect(pt, rect), false)
    })

    it('returns false for pt on the bottom side', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 20 }
      assert.equal(ptInRect(pt, rect), false)
    })

  })

  describe('#ptInInscribedCircle', function () {

    it('returns true for point at vertex', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 15 }
      assert.equal(ptInInscribedCircle(pt, rect), true)
    })

    it('returns true for point on edge', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 35, y: 10.0001 }
      assert.equal(ptInInscribedCircle(pt, rect), true)
    })

    it('returns false for point in corner-- outside circle but inside of rect', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 31, y: 11 }
      assert.equal(ptInInscribedCircle(pt, rect), false)
    })

    it('returns false for point outside rectangle', function () {
      const rect = { top: 10, bottom: 20, left: 30, right: 40 },
            pt   = { x: 0, y: 0 }
      assert.equal(ptInInscribedCircle(pt, rect), false)
    })

  })
})
