// equal tempered scale
const semitone = Math.pow(2, 1 / 12)
// ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html

const majorSecondAbove = (ν) => ν * semitone * semitone
const minorThirdAbove = (ν) => ν * Math.pow(semitone, 3)
const majorThirdAbove = (ν) => ν * 5.0 / 4.0
const perfectFourthAbove = (ν) => ν * 4.0 / 3.0
const flatFiveAbove = (ν) => ν * Math.pow(semitone, 6)
const perfectFifthAbove = (ν) => ν * 3.0 / 2.0
const majorSixthAbove = (ν) => ν * Math.pow(semitone, 9)
const minorSeventhAbove = (ν) => ν * Math.pow(semitone, 10)
const majorSeventhAbove = (ν) => ν * Math.pow(semitone, 11)

const floor = (x, d) => x - (x % d)
const roundToEqualTempered = (f) => floor(f * 4000, semitone)


function buildOctavesGenerator(lo, hi) {
  const iterable = {}
  iterable[Symbol.iterator] = function* () {
    let a = lo
    while (a < hi) {
      yield a
      a *= 2
    }
  }
  return [...iterable]
}

function buildOctavesRecursive2a(lo, hi) {
  return (function next(f) {
    if (f * 2 < hi) {
      return [f].concat(next(f * 2))
    } else {
      return [f]
    }
  })(lo)
}

function buildOctavesRecursive2b(lo, hi) {
  return (function next(f) {
    const n = f * 2
    if (n < hi) {
      return [f].concat(next(n))
    } else {
      return [f]
    }
  })(lo)
}


function buildOctavesRecursive2(lo, hi) {
  return (function next(f) {
    if (f < hi) {
      const n = next(f*2)
      return (n) ? [f].concat(n) : [f]
    }
  })(lo)
}


function buildOctavesGenerator2(lo, hi) {
  const iterator = function* () {
    let a = lo
    while (a < hi) {
      yield a
      a *= 2
    }
  }
  return [...iterator()]
}

function buildOctavesGenerator25(lo, hi) {
  return [...(function* () {
    let a = lo
    while (a < hi) {
      yield a
      a *= 2
    }
  })()]
}

const iterateX2 = function* (x) {
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


function buildOctavesGenerator3(lo, hi) {

  const whileLessThan = function*(it, max) {
    for (x of it) {
      if (x < max)
        yield x;
      else
        return
    }
  }

  const c = whileLessThan(iterateX2(lo), hi)
  return [...c]
}


function buildOctavesForLoop(lo, hi) {
  const o = []
  for (let f = lo; f < hi; f *= 2)
    o.push(f)
  return o
}


function buildOctavesRecursive(lo, hi) {
  const o = [];
  (function next(f) {
    if (f < hi) {
      o.push(f)
      next(f * 2)
    }
  })(lo)
  return o
}

const ν = {}
ν.octaves = buildOctavesGenerator(110, 4000) // [110, 220, 440, 880, 1760, 3520]
ν.octaves = buildOctavesForLoop(110, 4000)
ν.octaves = buildOctavesRecursive(110, 4000)


// Give a name to the scale, and provide any number of
// functions to generate the notes above the tonic.
const buildScale = (name, ...noteFns) => {
  const all = []
  ν.octaves.forEach((a) => {
    all.push(a)
    for (let f of noteFns) {
      all.push(f(a))
    }
  })
  ν[name] = all
}

buildScale('fifths', perfectFifthAbove)
buildScale('perfect', perfectFourthAbove, perfectFifthAbove)
buildScale('majorTriad', majorThirdAbove, perfectFifthAbove)
buildScale('major', majorSecondAbove, majorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, majorSeventhAbove)
buildScale('blues', minorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSeventhAbove)


// x = 0..1
const calcNote = (x, scale) => {
  const s = ν[scale]
  const note = s[Math.floor(x * s.length)]
  console.log(note)
  return note
}

const newSoundData = (peg) => {
  const r = {}
  r.frequency = calcNote(peg.normalized.distScore, 'blues')
  r.volume = peg.normalized.sizeScore * 40
  r.velocity = peg.normalized.sizeScore
  r.duration = peg.normalized.sizeScore
  return r
}

