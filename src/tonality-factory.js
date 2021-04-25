import * as generators from './ndp-software/generators.js'
import {pin} from './ndp-software/util.js'

export function createTonalities() {
// equal tempered scale
  const semitone = Math.pow(2, 1 / 12)
// ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html

  const semitoneAbove      = (ν) => ν * semitone
  const majorSecondAbove   = (ν) => ν * semitone * semitone
  const minorThirdAbove    = (ν) => ν * Math.pow(semitone, 3)
  const majorThirdAbove    = (ν) => ν * 5.0 / 4.0
  const perfectFourthAbove = (ν) => ν * 4.0 / 3.0
  const flatFiveAbove      = (ν) => ν * Math.pow(semitone, 6)
  const perfectFifthAbove  = (ν) => ν * 3.0 / 2.0
  const minorSixthAbove    = (ν) => ν * Math.pow(semitone, 8)
  const majorSixthAbove    = (ν) => ν * Math.pow(semitone, 9)
  const minorSeventhAbove  = (ν) => ν * Math.pow(semitone, 10)
  const majorSeventhAbove  = (ν) => ν * Math.pow(semitone, 11)

  function buildOctaves(lo, hi) {
    const octaveIter = generators.doubleIter(lo)
    const notes      = generators.whileLessThan(octaveIter, hi)
    return [...notes]
  }

  function buildRange(lo, hi) {
    return [...generators.whileLessThan(generators.counterIter(lo), hi)]
  }

  function generateNotes(octaves, ...noteFns) {
    const all = []
    octaves.forEach(note => {
      all.push(note)
      for (const fn of noteFns) {
        all.push(fn(note))
      }
    })
    return all
  }


  const ν            = {
    octaves: buildOctaves(110, 4000) // [110, 220, 440, 880, 1760, 3520]
  }

  // Give a name to the scale, and provide any number of
  // functions to generate the notes above the tonic.
  const buildTonality = generateNotes.bind(null, ν.octaves)

  ν['fifths']        = buildTonality(perfectFifthAbove)
  ν['perfect']       = buildTonality(perfectFourthAbove, perfectFifthAbove)
  ν['majorTriad']    = buildTonality(majorThirdAbove, perfectFifthAbove)
  ν['major']         = buildTonality(majorSecondAbove, majorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, majorSeventhAbove)
  ν['harmonicMinor'] = buildTonality(majorSecondAbove, minorThirdAbove, perfectFourthAbove, perfectFifthAbove, majorSixthAbove, minorSeventhAbove)
  ν['blues']         = buildTonality(minorThirdAbove, perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSeventhAbove)
  ν['chromatic']     = buildTonality(semitoneAbove, majorSecondAbove, minorThirdAbove, majorThirdAbove,
                                     perfectFourthAbove, flatFiveAbove, perfectFifthAbove, minorSixthAbove,
                                     majorSixthAbove, minorSeventhAbove, majorSeventhAbove)

  ν['continuous'] = buildRange(100, 4000)

  const tonalityCalculator = function(tonalityName) {
    return function(x) {
      const s = ν[tonalityName]
      return s[Math.floor(pin(x, 0, 1) * s.length)]
    }
  }

  const fns = {}
  for (const t in ν) fns[t] = tonalityCalculator(t)
  return fns
}
