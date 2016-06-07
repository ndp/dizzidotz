// equal tempered scale
const semitone = Math.pow(2, 1 / 12)
// ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html

const ν = {
    octaves = [110, 220, 440, 880, 1760, 1760 * 2]
}

//function* fibonacci(){
//  var current = 55;
//  while (1) { current = current * 2;
//    yield current;
//  }
//}
//
//Rx.Observable.from(fibonacci())
//    .take(10)
//    .subscribe(function (x) {
//      console.log('Value: %s', x);
//    });

const floor = (x, d) => x - (x % d)


const roundToEqualTempered = (f) => floor(f * 4000, semitone)

// s = 0..1
const octaves = (s) => {
  return ν.octaves[Math.floor(s * ν.octaves.length)]
}

// s = 0..1
const fifths = (s) => {

  const all = []
  ν.octaves.forEach((a) => {
    all.push(a)
    all.push(a * 3.0 / 2.0) // add fifth above
  })
  console.log('All', all)

  const note = all[Math.floor(s * all.length)]
  console.log(note)
  return note
}

const chords = (s) => {
  const all = []
  ν.octaves.forEach((a) => {
    all.push(a)
    all.push(a * semitone * semitone) // add major second
    all.push(a * 5.0 / 4.0) // add major third above
    all.push(a * 4.0 / 3.0) // add perfect fourth above
    all.push(a * 3.0 / 2.0) // add perfect fifth above
    all.push(a * semitone * semitone * semitone * semitone *
        semitone * semitone * semitone * semitone * semitone) // add major sixth
  })
  console.log('Chords', all)

  const note = all[Math.floor(s * all.length)]
  console.log(note)
  return note
}


const newSoundData = (peg) => {
  const r = {}
  r.frequency = chords(peg.normalized.distScore)
  r.volume = peg.normalized.sizeScore * 40
  r.velocity = peg.normalized.sizeScore
  r.duration = peg.normalized.sizeScore
  return r
}

