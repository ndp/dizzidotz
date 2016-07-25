/*
 # Command Bus

 Create a bus that receives and executes commands that transform
 the state.

 Caller provides the current
 state when creating the bus. The state must be a `Subject`--
 or at least both an `Observer` and `Observable`. A `Rx.BehaviorSubject`
 works quite well.

 Commands are identified with strings.

 Register listeners with `addReducer`. Provide the name
 of the command and a function. Only one command per name.
 The listener itself should know how to project the
 state given the current state and the command, ie.
 ```
 (state, cmd) => new state
 ```

 The bus will listen for commands; each command generates
 a new state. If it finds a matching command, it calls that
 reducer function to transform the state.
 If there is no matching function, then the same state is
 returned. Hint: use `distinct` to ignore insignificant "changes",
 including no-ops from missing listeners.

 Example:
 If the state were an integer, this system would
 increment and decrement:

 ```
 const state$ = new Rx.BehaviorSubject(0)

 const bus$ = newCmdBus$(state$)
 bus$.addReducer('increment', x => x + 1)
 bus$.addReducer('decrement', x => x - 1)

 bus$.next('increment')
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

import {Subject} from 'rxjs/Subject'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/withLatestFrom'
import {async} from 'rxjs/scheduler/async'


function precondition(x, msg) {
  if (!x) throw msg
}

function isFunction(x) {
  return typeof x === 'function'
}

function newDispatcher() {

  const dispatch = function(state, cmd) {
    const fn = dispatch.reducers[cmd.name]
    return fn ? fn(state, cmd) : state
  }

  dispatch.reducers = {}
  dispatch.addReducer = function(cmdName, reducer) {
    precondition(cmdName, 'Reducer requires a command name')
    precondition(isFunction(reducer), 'Reducer requires a projection function')
    dispatch.reducers[cmdName] = reducer
  }

  return dispatch
}

export function newCmdBus$(state$) {
  const cmdBus$  = new Subject(async)

  cmdBus$.dispatch = newDispatcher()
  cmdBus$.addReducer = cmdBus$.dispatch.addReducer
  cmdBus$.on = cmdBus$.addReducer // alias

  cmdBus$
      .map((cmd) => typeof cmd == 'string' ? {name: cmd} : cmd)
      .withLatestFrom(state$, (cmd, state) => cmdBus$.dispatch(state, cmd))
      .subscribe(state$)

  cmdBus$.subscribe(
      function(v) {
        console.log('cmdBus$next:', v)
      },
      function(v) {
        console.log('cmdBus$error:', v)
      },
      function(v) {
        console.log('cmdBus$complete:', v)
      }
  )

  return cmdBus$
}


