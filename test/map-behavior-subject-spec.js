/*eslint-env mocha */

import {assert} from 'chai'

import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/skip'

import {mapBehaviorSubject} from '../js/lib/ndp-software/map-behavior-subject.js'


function modelWrapped() {
  const model$ = new BehaviorSubject(100)

  const sinkFn   = (x) => x * 10
  const srcFn = (x) => x / 10
  const wrapped$  = mapBehaviorSubject(model$, sinkFn, srcFn)
  return [model$, wrapped$]
}

describe('MappedModel', function() {

  this.timeout(200)

  it('filters initial value', function() {
    const [model$, wrapped$] = modelWrapped()
    assert.equal(100, model$.getValue())
    assert.equal(1000, wrapped$.getValue())
  })

  it('filters subsequent values', function() {
    const [model$, wrapped$] = modelWrapped()
    model$.next(90)
    assert.equal(90, model$.getValue())
    assert.equal(900, wrapped$.getValue())
  })

  it('filters subscribed values', function(done) {
    const [model$, wrapped$] = modelWrapped()
    let expected = 1000
    wrapped$.subscribe(function(x) {
      assert.equal(expected, x)
      expected -= 100
    }, () => null, done)

    model$.next(90)
    model$.next(80)
    model$.next(70)
    model$.complete()
  })

  it('reacts to wrapped error', function(done) {
    const [model$, wrapped$] = modelWrapped()
    wrapped$.subscribe(() => null,
                      function(error) {
                        assert.equal(error, 'whoops!')
                        done()
                      }, () => {})
    model$.error('whoops!')
  })


  it('reacts to wrapped change', function(done) {
    const [model$, wrapped$] = modelWrapped()
    model$.skip(1).subscribe(function(x) {
      assert.equal(x, 10)
    }, () => null, done)
    wrapped$.next(100)
    wrapped$.complete()
  })

  it('reacts to wrapped error', function(done) {
    const [model$, wrapped$] = modelWrapped()
    model$.skip(1).subscribe(() => null,
                            function(error) {
                              assert.equal(error, 'whoops!')
                              done()
                            }, () => {})
    wrapped$.error('whoops!')
  })


})
