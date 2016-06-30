const assert = require('chai').assert;
const {linearScaleFns} = require('../js/lib/ndp-software/util.js')


describe('util.js: ', function() {

  describe('#linearScaleFns', function() {
    describe('with max', function() {
      it('scales on onwrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(100)
        assert.equal(0, scaleFn(0))
        assert.equal(100, scaleFn(1))
        assert.equal(50, scaleFn(0.5))
      })
      it('scales on wrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(100)
        assert.equal(0, unscaleFn(0))
        assert.equal(1, unscaleFn(100))
        assert.equal(.5, unscaleFn(50))
      })
      it('constrains to range', function() {
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
    describe('with min,max', function() {
      it('scales on onwrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(100, 200)
        assert.equal(100, scaleFn(0))
        assert.equal(200, scaleFn(1))
        assert.equal(150, scaleFn(0.5))
      })
      it('scales on wrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(100, 200)
        assert.equal(0, unscaleFn(100))
        assert.equal(1, unscaleFn(200))
        assert.equal(.5, unscaleFn(150))
      })
      it('constrains to range', function() {
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
    describe('with max, min (flipped)', function() {
      it('scales on onwrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(200, 100)
        assert.equal(100, scaleFn(1))
        assert.equal(200, scaleFn(0))
        assert.equal(150, scaleFn(0.5))
      })
      it('scales on wrap', function() {
        const [scaleFn, unscaleFn] = linearScaleFns(200, 100)
        assert.equal(1, unscaleFn(100))
        assert.equal(0, unscaleFn(200))
        assert.equal(.5, unscaleFn(150))
      })
      it('constrains to range', function() {
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

})
