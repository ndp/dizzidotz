function createFrequencyCalculator() {
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


// Give a name to the scale, and provide any number of
// functions to generate the notes above the tonic.
  const buildTonality = (...noteFns) => {
    const all = []
    ν.octaves.forEach((a) => {
      all.push(a)
      for (let f of noteFns) {
        all.push(f(a))
      }
    })
    return all
  }

  const ν = {
    continuous: buildRange(100, 4000),
    octaves: buildOctaves(110, 4000), // [110, 220, 440, 880, 1760, 3520]
  }
  ν['fifths'] = buildTonality(perfectFifthAbove)
  ν['perfect'] = buildTonality(perfectFourthAbove, perfectFifthAbove)
  ν['majorTriad'] = buildTonality(majorThirdAbove, perfectFifthAbove)
  ν['major'] = buildTonality(majorSecondAbove, majorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, majorSeventhAbove)
  ν['harmonicMinor'] = buildTonality(majorSecondAbove, minorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, minorSeventhAbove)
  ν['blues'] = buildTonality(minorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSeventhAbove)
  ν['chromatic'] = buildTonality(semitoneAbove, majorSecondAbove, minorThirdAbove, majorThirdAbove,
      perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSixthAbove, majorSixthAbove,
      minorSeventhAbove, majorSeventhAbove)

  function *tonalityNames() {
    for (p in ν) {
      if (ν.hasOwnProperty(p)) {
        yield p
      }
    }
  }

  // Return a function that can calculate a frequency based on the scale
  // x: 0..1
  // scale: name of scale
  return [tonalityNames, (x, scale) => {
    x = Math.min(1.0, Math.max(0.0, x))
    const s = ν[scale]
    return s[Math.floor(x * s.length)]
  }]
}
