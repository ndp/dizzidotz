/*
 Uses an object to map commands to handler functions. What is an
 object anyway?

 Returns a function that can be used by a dispatcher,  with
 the signature:

 ```
 (String) => Fn(State, CmdObject)
 ```
 */

import { precondition, isFunction } from '../util.js'

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

