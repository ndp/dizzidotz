const editorPegs$       = new Rx.BehaviorSubject([])
const editorCmdBus$ = newCmdBus$(editorPegs$)


// MODEL COMMANDS
editorCmdBus$.on('add peg', (state, cmd) => {
  state.push(cmd.peg)
  return state
})

editorCmdBus$.on('clear', () => [])

editorCmdBus$.on('add pattern', (state, cmd) => {
  return cmd.pattern.pegs.map((pegModel) => {
    return newPeg(pegModel.normalized)
  })
})

