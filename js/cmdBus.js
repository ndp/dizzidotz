/*
 # Command Bus

 Create a bus that receives and executes commands that transform
 the state.

 Caller provides the current
 state when creating the bus. The state must be a `Subject`--
 or at least both an `Observer` and `Observable`. A `Rx.BehaviorSubject`
 works quite well.

 Commands are identified with strings.

 Register listeners with `addListener`. Provide the name
 of the command and a function. Only one command per name.
 The listener itself should know how to project the
 state given the current state and the command, ie.
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
 If the state were an integer, this system would
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

```
 Rx.Observable
   .fromEvent(elem, 'click')
   .map('increment')
   .subscribe(bus$)
```
 */

function precondition(x, msg) {
  if (!x) throw msg
}

function newCmdBus$(state$) {
  const cmdBus$ = new Rx.Subject()
  const listeners = {}

  cmdBus$.addListener = function (cmdName, fn) {
    precondition(cmdName, 'Listeners require a command name')
    precondition(Rx.helpers.isFunction(fn), 'Listeners require a projection function')
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



