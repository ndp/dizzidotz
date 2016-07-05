const editorPegs$       = new Rx.BehaviorSubject([])
const editorCmdBus$ = newCmdBus$(editorPegs$)


// MODEL COMMANDS
editorCmdBus$.on('add peg', (state, cmd) => {
  state.push(cmd.peg)
  return state
})

editorCmdBus$.on('clear', () => [])

editorCmdBus$.on('add pattern', (state, cmd) => {
  console.log('add pattern: ', cmd)
  const pattern = cmd.pattern
  name$.next(pattern.name || 'My Dotz')
  currentTonality$.next(pattern.tonality)
  msPerPeriod$.next(pattern.periodMs)
  document.getElementById('wheel').classList = `wheel ${pattern.tonality}`
  return pattern.pegs.map((pegModel) => {
    // if there is no sub-structure, then values assumed to be the normalized ones
    return newPeg(pegModel.normalized || pegModel)
  })
})

