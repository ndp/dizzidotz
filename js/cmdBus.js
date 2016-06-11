function newCmdBus$(state$) {
  const cmdBus$ = new Rx.Subject()
  const cmdHandlers = {}

  cmdBus$.handleCmdWith = function (key, fn) {
    cmdHandlers[key] = fn
  }

  cmdBus$.withLatestFrom(state$, (cmd, state) => {
    const cmdFn = cmdHandlers[cmd.cmd]
    return cmdFn ? cmdFn(state, cmd) : state
  }).subscribe(state$)

  return cmdBus$
}



