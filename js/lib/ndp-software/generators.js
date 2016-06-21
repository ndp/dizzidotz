// Given a fn, returns an iterator that calls that function for each step
// of an iteration.
const iterateWith = function(fn) {
  return function *(x) {
    while (true) {
      yield x
      x = fn(x)
    }
  }
}

// Starting with the given number, yields a number doubling each time.
const doubleIter = iterateWith(x => x * 2)

// Starting with a given number, yields numbers increasing by ones
const counterIter = iterateWith(x => x + 1)

// Given an iterator and a function, yields iterator value until
/// function returns false.
const takeWhile = function* (it, fn) {
  for (let x of it) {
    if (fn(x))
      yield x;
    else
      return
  }
}

// Calls iterator until number is less than the max value provided.
const whileLessThan = function(it, max) {
  return takeWhile(it, (x) => x < max)
}


const ownPropertiesIter = function(x) {
  return function *() {
    for (let p in x) {
      if (x.hasOwnProperty(p)) {
        yield p
      }
    }
  }
}