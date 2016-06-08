const doubleIter = function* (x) {
  while (true) {
    yield x
    x *= 2
  }
}

const takeWhile = function* (it, fn) {
  for (x of it) {
    if (fn(x))
      yield x;
    else
      return
  }
}

const whileLessThan = function (it, max) {
  return takeWhile(it, (x) => x < max)
}
