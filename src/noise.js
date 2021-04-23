import { Subject }                      from 'rxjs/Subject'
import { currentTonality$, tonalities } from './tonality.js'
import * as Tone from 'tone'


let gSynth = null

function synth () {
  return gSynth || (gSynth = new Tone.PolySynth().toDestination())
}

export const soundOut$ = new Subject()

soundOut$.subscribe((sound) => {
  synth().volume.value = 0 // Normalize it from whatever it was
  synth().triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity)
  synth().volume.value = sound.volume
})


export const newSoundData = normalized => {
  const tonality  = normalized.tonality || currentTonality$.getValue()
  const frequency = tonalities[tonality](normalized.mag)
  return {
    frequency,
    volume:   normalized.sz * 20,   // 0.0 .. 1.0  => 30 .. 70
    velocity: 1 - normalized.sz,
    duration: normalized.sz,
  }
}
