const editorPegs$       = new Rx.BehaviorSubject([])
const editorPegsCmdBus$ = newCmdBus$(editorPegs$)


// MODEL COMMANDS
editorPegsCmdBus$.on('add peg', (state, cmd) => {
  state.push(cmd.peg)
  return state
})

editorPegsCmdBus$.on('clear', () => [])

editorPegsCmdBus$.on('add pegs', (state, cmd) => {
  return cmd.pegs.map((pegModel) => {
    return newPeg(pegModel.normalized)
  })
})

