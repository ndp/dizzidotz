const doubleIter = function* (x) {
  while (true) {
    yield x
    x *= 2
  }
}

const counterIter = function* (x = 0) {
  while (true) {
    yield x
    x += 1
  }
}

const takeWhile = function* (it, fn) {
  for (let x of it) {
    if (fn(x))
      yield x;
    else
      return
  }
}

const whileLessThan = function (it, max) {
  return takeWhile(it, (x) => x < max)
}
