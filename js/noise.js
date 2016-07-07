import Rx from 'rxjs/Rx'

import {currentTonality$, tonalities} from './tonality.js'

const synth = new Tone.PolySynth(10, Tone.SimpleSynth).toMaster()

export const soundOut$ = new Rx.Subject()

soundOut$.subscribe((sound) => {
  synth.volume.value = 0 // Normalize it from whatever it was
  synth.triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity)
  synth.volume.value = sound.volume
})


export const newSoundData = (normalized) => {
  const tonality  = normalized.tonality || currentTonality$.getValue()
  const frequency = tonalities[tonality](normalized.mag)
  return {
              frequency,
    volume:   normalized.sz * 30,
    velocity: normalized.sz,
    duration: normalized.sz
  }
}
