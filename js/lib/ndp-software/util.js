
export function precondition(x, msg) {
  if (!x) throw msg
}

export function isFunction(x) {
  return typeof x === 'function'
}

export function Math_within(x, min, max) {
  return Math.min(max, Math.max(min, x))
}

/*
 linearScaleFns: create functions that scale linearly
 from [0..1] to a given range. Range can be:
 * max
 * min, max
 * max, min (where scaling is inverted)
 Returns two functions:
 * first function (n) => x, where x is normalized 0..1, and x is the specified range
 * the second function does the reverse scaling
 */
export function linearScaleFns(minOrMax, max) {
  let min

  if (typeof(max) == 'undefined') {
    [min,max] = [0, minOrMax]
  } else {
    min = minOrMax
  }

  let flipFn = (x) => x
  if (min > max) {
    [min, max] = [max, min]
    flipFn = (x) => 1 - x
  }

  const range = max - min

  const unscaleFn = (x) => Math_within(flipFn((x - min) / range), 0, 1)
  const scaleFn   = (x) => Math_within((flipFn(x) * range) + min, min, max)
  return [scaleFn, unscaleFn]
}


export function localStorageKeys() {
  const keys = []
  if (typeof(localStorage) !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++)
      keys[i] = localStorage.key(i)
  }
  return keys
}


export function labelLog(label) {
  return function(...msgs) {
    global.console.log(...[`${label}: `, ...msgs])
  }
}

export function subscribeLog(observable$, name) {
  observable$.subscribe(
      function(v) {
        global.console.log(`${name}.next:`, v)
      },
      function(v) {
        global.console.log(`${name}.error:`, v)
      },
      function(v) {
        global.console.log(`${name}.complete:`, v)
      }
  )
}


