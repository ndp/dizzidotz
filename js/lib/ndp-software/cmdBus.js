/*
 # Command Bus

 Create a bus that receives and executes commands that transform
 the state.

 Caller provides the current
 state when creating the bus. The state must be a `Subject`--
 or at least both an `Observer` and `Observable`. A `Rx.BehaviorSubject`
 works well.

 Commands are identified with strings.

 Register command handlers with `addReducer`. Provide the name
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

 The dispatching strategy can be overriden by passing your
 own dispatcher. See `newDispatcher` for the standard implementation.
 Using this technique, the command bus can be object-oriented, where
 each command is handled by a method of an object.

 Basic support for nested states is available with `submodelHandler`.
 This is a wrapper for a reducer that takes the property of the main
 state being used. Another technique that might be more useful is to
 use separate command buses for different parts of the app.

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

export function newCmdBus$(state$, dispatcher) {

  const cmdBus$  = new Subject(async)

  cmdBus$.dispatch = dispatcher || newDispatcher()
  cmdBus$.addReducer = cmdBus$.dispatch.addEventHandler
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


/*
 The Dispatcher.
 It is responsible for:
 * managing registration of EventManagers (equivalent to the Observers)
 * dispatching the event to all EventManagers
 */
export function newDispatcher(mapping) {

  const dispatch = function(state, cmd) {
    const fn = dispatch.eventMgrs[cmd.name]
    return fn ? fn(state, cmd) : state
  }

  dispatch.eventMgrs = Object.assign({}, mapping)
  dispatch.addEventHandler = function(eventName, handler) {
    precondition(eventName, 'requires a command name')
    precondition(isFunction(handler), 'requires a projection function')
    dispatch.eventMgrs[eventName] = handler
  }

  return dispatch
}


/*
Create a handler that only cares about a sub-model.

Normal usage is:

```
  cmdBus$.on('incLikes', submodelHandler('likes', (state) => state + 1)
```

[Experimental] It can also be partially applied, with just the function, as in:

```
  inc = submodelHandler((state) => state + 1)
  cmdBus$.on('incLikes', inc('likes')
```
 */
export function submodelHandler(property, fn) {
  if (typeof fn != 'undefined') {
    return function(state, ...props) {
      const result     = Object.assign({}, state)
      result[property] = fn(state[property], ...props)
      return result
    }
  } else {
    // If no property is provided, then we return a partially applied fn.
    fn = property
    return function(property) {
      return submodelHandler(property, fn)
    }
  }
}


