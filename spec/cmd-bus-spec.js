

QUnit.test("unknown command does not mutate state", (assert) => {
  const state$ = new Rx.BehaviorSubject('x')
  state$.subscribe((state) => assert.equal(state, 'x'))

  const bus$ = newCmdBus$(state$)
  bus$.next({name: 'unknown command'})

  state$.subscribe(assert.async())
})


QUnit.test("register without a listener", (assert) => {
  const state$ = new Rx.BehaviorSubject(0)
  const bus$ = newCmdBus$(state$)

  assert.throws(()=> bus$.addListener(), 'Listeners require a command name')
  assert.throws(()=> bus$.addListener('x'), 'Listeners require a projection function')
  assert.throws(()=> bus$.addListener('x', 'y'), 'Listeners require a projection function')
});

QUnit.test("command mutates state", (assert) => {
  const done = assert.async()

  const state$ = new Rx.BehaviorSubject(0)

  const bus$ = newCmdBus$(state$)
  bus$.addListener('increment', x => x + 1)
  bus$.next({name: 'increment'})

  state$.subscribe((state) => {
    assert.equal(state, 1)
    done()
  })
})

QUnit.test("command with string only", (assert) => {
  const done = assert.async()

  const state$ = new Rx.BehaviorSubject(0)

  const bus$ = newCmdBus$(state$)
  bus$.addListener('increment', x => x + 1)
  bus$.next('increment')

  state$.subscribe((state) => {
    assert.equal(state, 1)
    done()
  })
});
