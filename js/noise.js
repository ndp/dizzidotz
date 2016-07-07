import Rx from 'rxjs/Rx'

const synth = new Tone.PolySynth(10, Tone.SimpleSynth).toMaster()

export const soundOut$ = new Rx.Subject()

soundOut$.subscribe((sound) => {
  synth.volume.value = 0 // Normalize it from whatever it was
  synth.triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity)
  synth.volume.value = sound.volume
})

