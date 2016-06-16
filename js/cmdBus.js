// Command Bus
// Create a bus that receives (listens for) commands that tranform
// the state.
// Caller provides the current
// state when creating the bus. The state must be a `Subject`--
// or at least both an `Observer` and `Observable`.
//
// Commands are identified with String names.
//
// Register listeners with `addListener`. Provide the name
// of the command and a function. Only one command per name.
//
// Registered listeners look like
//  `(state, cmd) => new state`
//
// Stream commands to the bus, and it finds the appropriate
// listener to transform the state.
// If there is no matching listener, then the same state is
// returned. Use `distinct` to ignore insignificant "changes",
// including no-ops from missing listeners.
//
function newCmdBus$(state$) {
  const cmdBus$ = new Rx.Subject()
  const listeners = {}

  cmdBus$.addListener = function (cmdName, listener) {
    listeners[cmdName] = listener
  }
  //cmdBus$.on = cmdBus$.addListener // alias

  cmdBus$.withLatestFrom(state$, (cmd, state) => {
    const listener = listeners[cmd.name]
    return listener ? listener(state, cmd) : state
  }).subscribe(state$)

  return cmdBus$
}



