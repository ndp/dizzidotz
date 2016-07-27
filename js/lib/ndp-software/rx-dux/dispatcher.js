import {precondition, isFunction} from '../util.js'


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
  dispatch.addCmdHandler = resolver.addCmdHandler // OK if `resolver.addCmdHandler` is undefined
  return dispatch
}

