// hashmap of key => stored value
const patternStore$ = new Rx
    .BehaviorSubject(localStorageKeys
                         .filter((x) => /pattern.*/.exec(x))
                         .reduce((acc, x) => {
                                   acc[x] = JSON.parse(localStorage.getItem(x))
                                   return acc
                                 }, {}))


const patternStoreBus$ = newCmdBus$(patternStore$)

patternStoreBus$.on('insert', function(state, cmd) {
  const pattern       = cmd.pattern
  pattern.timestamp   = (new Date()).getTime()
  pattern.name        = `pattern-${pattern.timestamp}`

  localStorage.setItem(pattern.name, JSON.stringify(pattern))
  state[pattern.name] = pattern

  return state
})

patternStoreBus$.on('delete', function(state, cmd) {
  const key = cmd.key

  localStorage.removeItem(key)
  delete state[key]

  return state
})