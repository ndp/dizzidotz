const editorPegs$       = new Rx.BehaviorSubject([])
const editorCmdBus$ = newCmdBus$(editorPegs$)


// MODEL COMMANDS
editorCmdBus$.on('add peg', (state, cmd) => {
  state.push(cmd.peg)
  return state
})

editorCmdBus$.on('clear', () => [])

editorCmdBus$.on('add pattern', (state, cmd) => {
  const pattern = cmd.pattern
  name$.next(pattern.name || 'My Dotz')
  currentTonality$.next(pattern.tonality)
  msPerPeriod$.next(pattern.periodMs)
  return pattern.pegs.map((pegModel) => {
    return newPeg(pegModel.normalized || pegModel)
  })
})

