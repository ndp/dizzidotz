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
import {subscribeLog, precondition, isFunction} from './util.js'

export function newCmdBus$(state$, dispatcher) {

  const cmdBus$ = new Subject(async)

  if (dispatcher) {
    cmdBus$.dispatch = dispatcher
  } else {
    const resolver     = newObjectResolver()
    cmdBus$.dispatch   = newDispatcher(resolver)
    cmdBus$.addReducer = resolver.addCmdHandler
    cmdBus$.on         = cmdBus$.addReducer // alias
  }

  cmdBus$
      .map((cmd) => typeof cmd == 'string' ? {name: cmd} : cmd)
      .withLatestFrom(state$, (cmd, state) => cmdBus$.dispatch(state, cmd))
      .subscribe(state$)

  return cmdBus$
}

export function logCmdBus(cmdBus$) {
  subscribeLog(cmdBus$, 'cmdBus$')
}

/*
 Uses an object to map commands to handler functions. What is an
 object anyway?

 Returns a function that can be used by a dispatcher,  with
 the signature:

 ```
 (String) => Fn(State, CmdObject)
 ```
 */
export function newObjectResolver(mapping) {

  const cmdHandlers = Object.assign({}, mapping)

  const resolver = function(name) {
    return cmdHandlers[name]
  }

  resolver.addCmdHandler = function(cmdName, handler) {
    precondition(cmdName, 'requires a command name')
    precondition(isFunction(handler), 'requires a projection function')
    cmdHandlers[cmdName] = handler
  }

  return resolver
}


/*
 The Dispatcher is responsible for:
 * managing registration of EventManagers (equivalent to the Observers)
 * dispatching the event to all EventManagers
 */
export function newDispatcher(resolver) {
  precondition(resolver, 'resolver is required for a dispatcher')
  precondition(isFunction(resolver), 'resolver must be a function')

  const dispatch         = function(state, cmdObject) {
    const fn = resolver(cmdObject.name)
    return fn ? fn(state, cmdObject) : state
  }
  dispatch.addCmdHandler = resolver.addCmdHandler
  return dispatch
}


/*
 Create a handler that only cares about a sub-model, allowing separation
 of concerns around different parts of the model.

 Normal usage is:

 ```
 const state = {
 foos: [...]
 likes: 0
 }
 ...
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


