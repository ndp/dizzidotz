// equal tempered scale
const semitone = Math.pow(2, 1 / 12)
// ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html

const semitoneAbove = (ν) => ν * semitone
const majorSecondAbove = (ν) => ν * semitone * semitone
const minorThirdAbove = (ν) => ν * Math.pow(semitone, 3)
const majorThirdAbove = (ν) => ν * 5.0 / 4.0
const perfectFourthAbove = (ν) => ν * 4.0 / 3.0
const flatFiveAbove = (ν) => ν * Math.pow(semitone, 6)
const perfectFifthAbove = (ν) => ν * 3.0 / 2.0
const minorSixthAbove = (ν) => ν * Math.pow(semitone, 8)
const majorSixthAbove = (ν) => ν * Math.pow(semitone, 9)
const minorSeventhAbove = (ν) => ν * Math.pow(semitone, 10)
const majorSeventhAbove = (ν) => ν * Math.pow(semitone, 11)

function buildOctaves(lo, hi) {
  const octaveIter = doubleIter(lo)
  const notes = whileLessThan(octaveIter, hi)
  return [...notes]
}

function buildRange(lo, hi) {
  return [...whileLessThan(counterIter(lo), hi)]
}

const ν = {
  continuous: buildRange(100, 4000),
  octaves: buildOctaves(110, 4000), // [110, 220, 440, 880, 1760, 3520]
}


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
buildScale('harmonicMinor', majorSecondAbove, minorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, minorSeventhAbove)
buildScale('blues', minorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSeventhAbove)
buildScale('chromatic', semitoneAbove, majorSecondAbove, minorThirdAbove, majorThirdAbove,
    perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSixthAbove, majorSixthAbove,
    minorSeventhAbove, majorSeventhAbove)


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
