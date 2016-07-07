import Rx from 'rxjs/Rx'
import {newCmdBus$ } from './lib/ndp-software/cmdBus.js'
import { localStorageKeys } from './lib/ndp-software/util.js'
import { ownPropertiesIter } from './lib/ndp-software/generators.js'
import { tonalities } from './tonality.js'

// hashmap of key => stored value
export const patternStore$ = new Rx
    .BehaviorSubject(localStorageKeys()
                         .filter((x) => /^(pattern|template).*/.exec(x))
                         .reduce((acc, x) => {
                                   const item = localStorage.getItem(x)
                                   try {
                                     acc[x] = JSON.parse(item)
                                   } catch (x) {
                                     global.console.log(`Unable to load or parse [${x}]: ${ item}`)
                                   }
                                   return acc
                                 }, {}))


export const patternStoreBus$ = newCmdBus$(patternStore$)

patternStoreBus$.on('insert', function(state, cmd) {
  const pattern      = cmd.pattern
  pattern.timestamp  = (new Date()).getTime()
  pattern.key        = pattern.key || `pattern-${pattern.timestamp}`
  pattern.name       = pattern.name || `Pattern ${pattern.timestamp}`

  localStorage.setItem(pattern.key, JSON.stringify(pattern))
  state[pattern.key] = pattern

  return state
})

patternStoreBus$.on('delete', function(state, cmd) {
  const key = cmd.key

  localStorage.removeItem(key)
  delete state[key]

  return state
})

patternStoreBus$.on('delete all', function(state, cmd) {

  localStorageKeys().forEach(key => {
    if (!/pattern\-/.exec(key)) return
    localStorage.removeItem(key)
  })

  return {}
})

patternStoreBus$.on('create template', function(state, cmd) {
  const key = `template-${cmd.tonality}`
  if (!localStorage[key]) {

    const template = {
      name:     cmd.tonality,
      key:      key,
      tonality: cmd.tonality,
      periodMs: 2000,
      pegs:     [],
      svg:      `<svg viewBox="0 0 618 618"><g class="wheel ${cmd.tonality}">
        <circle class="bg" cx="50%" cy="50%" r="49%"></circle></g></svg>`
    }

    patternStoreBus$.next({name: 'insert', pattern: template})
  }
  return state;
})

patternStoreBus$.on('create missing templates', function(state, cmd) {
  for (let name of ownPropertiesIter(tonalities)()) {
    patternStoreBus$.next({name: 'create template', tonality: name})
  }
  return state;
})

setTimeout(() => patternStoreBus$.next('create missing templates'), 3000)

