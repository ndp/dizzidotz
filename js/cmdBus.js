/*
 Command Bus
 Create a bus that receives (listens for) commands that transform
 the state.

 Caller provides the current
 state when creating the bus. The state must be a `Subject`--
 or at least both an `Observer` and `Observable`. A `Rx.BehaviorSubject`
 works quite well.

 A command is identified with a string.

 Register listeners with `addListener`. Provide the name
 of the command and a function. Only one command per name.
 The listener itself should know how to project the
 state given the current state and the command:
 ```
 (state, cmd) => new state
 ```

 The bus will listen for commands; each command generates
 a new state. If it finds a matching command, it calls that
 function to transform the state.
 If there is no matching listener, then the same state is
 returned. Hint: use `distinct` to ignore insignificant "changes",
 including no-ops from missing listeners.

 Example:
 For example, if the state is simply an integer, this could
 increment and decrement:

```
const state$ = new Rx.BehaviorSubject(0)

const bus$ = newCmdBus$(state$)
bus$.addListener('increment', x => x + 1)
bus$.addListener('decrement', x => x - 1)

bus$.onNext('increment')
...
```
The bus can also be fed from other streams, as in:

Rx.Observable.fromEvent(elem, 'click')
  .map('increment').subscribe(bus$)

 */

function newCmdBus$(state$) {
  const cmdBus$ = new Rx.Subject()
  const listeners = {}

  cmdBus$.addListener = function (cmdName, fn) {
    if (!cmdName) throw 'Listeners require a command name'
    if (!fn) throw 'Listeners require a projection function'
    if (!Rx.helpers.isFunction(fn)) throw 'Listeners require a projection function'
    listeners[cmdName] = fn
  }

  cmdBus$
      .map((cmd) => typeof cmd == 'string' ? {name: cmd} : cmd)
      .withLatestFrom(state$, (cmd, state) => {
        const fn = listeners[cmd.name]
        return fn ? fn(state, cmd) : state
      }).subscribe(state$)

  return cmdBus$
}



