export function precondition(x, msg) {
  if (!x) throw msg
}

export function isFunction(x) {
  return typeof x === 'function'
}

export function pin(x, min, max) {
  return Math.min(max, Math.max(min, x))
}

export function ptInRect(pt, rect) {
  return pt.x > rect.left
         && pt.x < rect.right
         && pt.y > rect.top
         && pt.y < rect.bottom
}

export function ptInInscribedCircle(pt, rect) {
  if (ptInRect(pt, rect)) {
    const center             =
          {
            x: (rect.right - rect.left) / 2 + rect.left,
            y: (rect.bottom - rect.top) / 2 + rect.top
          },
          distanceFromCenter = Math.sqrt(Math.pow(center.x - pt.x, 2) + Math.pow(center.y - pt.y, 2)),
          radius             = Math.min(rect.right - rect.left, rect.bottom - rect.top) / 2
    return distanceFromCenter <= radius
  } else {
    return false
  }
}


/*
 linearScaleFns: create functions that scale linearly
 from [0..1] to a given range. Range can be:
 * max  (implicit 0 min)
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

  const unscaleFn = (x) => pin(flipFn((x - min) / range), 0, 1)
  const scaleFn   = (x) => pin((flipFn(x) * range) + min, min, max)
  return [scaleFn, unscaleFn]
}

/*global global, localStorage */
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


// ms/rev => human readable
export function humanizeTempo(x) {
  const speed = x < 5000 ? Math.round(60000 / x) : x < 10000 ? Math.round(x / 100) / 10 : Math.round(x / 1000)
  return `${speed}${x < 5000 ? 'rpm' : 's'}`
}

