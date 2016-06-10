"use strict";

// MODEL
const msPerTick = 20
let msPerPeriod = 2000
const radiansPerTick = () => {
  return (msPerTick / msPerPeriod * radiansPerPeriod)
}


let pegs = []
const maxPegSize = (r = radius) => r / 5


const normalizedValues = (peg, radius) => {
  const r = {}
  const [angle, dist] = ptToVector(peg.pt)
  r.angle = angle
  r.distScore = 1 - (dist / radius)
  r.sizeScore = peg.size / maxPegSize(radius)
  return r
}

const newPeg = (radius, pt, size) => {
  const p = {
    id: `peg-${(new Date()).getTime()}${Math.random()}`,
    pt: pt,
    size: size
  }
  p.normalized = normalizedValues(p, radius)
  p.sound = newSoundData(p.normalized, currTonality$.getValue())
  pegs.push(p)
  return p
}


const pauser$ = playPause$

const ticker$ = Rx.Observable.interval(msPerTick).pausable(pauser$)
const radians$ = ticker$.scan((last) => normalizeRadians(last + radiansPerTick()))
const activePegs$ = new Rx.Subject()

radians$.subscribe((angle) => {
  // Generate stream of active pegs
  pegs.forEach((pegModel) => {
    if (angle <= pegModel.normalized.angle && pegModel.normalized.angle < (angle + radiansPerTick())) {
      activePegs$.onNext(pegModel)
    }
  })
})


// VIEW
const drawerDepth = 115
const editor = document.getElementById('editor')
const body = document.getElementsByTagName('body')[0]
const wheel = document.getElementById('wheel')


const msPerPeriodInput = document.getElementById('ms-per-period')
const saveButton = document.getElementById('save-button')

const portrait = () => (body.clientHeight > body.clientWidth)
const radius = portrait() ?
Math.min(body.clientHeight - 2 * drawerDepth, body.clientWidth) / 2
    : Math.min(body.clientHeight, body.clientWidth - 2 * drawerDepth) / 2

// View set up
const sizeEditor = () => {
  editor.style.width = 2 * radius
  editor.style.height = 2 * radius
  if (portrait()) {
    editor.style.marginTop = `${((body.clientHeight - drawerDepth) / 2) - radius}px`
    editor.style.marginLeft = `${(body.clientWidth / 2) - radius}px`
  } else {
    editor.style.marginTop = `${(body.clientHeight / 2) - radius}px`
    editor.style.marginLeft = `${((body.clientWidth - drawerDepth) / 2) - radius}px`
  }
  editor.setAttribute('viewBox', `0 0 ${2 * radius} ${2 * radius}`)
}
sizeEditor()
wheel.setAttribute('cx', radius)
wheel.setAttribute('cy', radius)
wheel.setAttribute('r', radius)


const Color = {
  note: 'violet',
  playing: 'white',
  growing: 'deeppink'
}


const findOrCreatePeg = (pegModel) => {
  let peg = document.getElementById(pegModel.id)
  if (!peg) {
    peg = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    peg.setAttribute('id', pegModel.id)
    peg.setAttribute('class', 'peg')
    editor.appendChild(peg)
  }
  return peg
}

const renderPeg = (pegModel) => {
  //console.log(pegModel)
  const e = findOrCreatePeg(pegModel)
  e.setAttribute("cx", pegModel.pt.x + radius)
  e.setAttribute("cy", pegModel.pt.y + radius)
  e.setAttribute("r", pegModel.size)
  e.setAttribute("fill", pegModel.highlightcolor || pegModel.color || Color.note)
  if (pegModel.highlightcolor) {
    setTimeout(() => e.setAttribute('fill', pegModel.color), Math.min(200, pegModel.sound.duration * 1000))
  }
}


// INTERACTIONS

const tempoChange$ = Rx.Observable.fromEvent(msPerPeriodInput, 'change')
tempoChange$.subscribe((e) => msPerPeriod = e.target.value)


const saveClicks$ = Rx.Observable.fromEvent(saveButton, 'click')
saveClicks$.subscribe((e) => savePattern(e))


const savePattern = () => {
  editor.style.width = 'auto'
  editor.style.height = 'auto'
  editor.style.marginLeft = 'auto'
  editor.style.marginTop = 'auto'
  newPatterns$.onNext({pegs: pegs, svg: editor.outerHTML.replace(/id="[^"]+"/g, '')})
  sizeEditor()
}


const clearPattern = () => {
  let peg
  while (peg = editor.getElementsByClassName('peg')[0]) {
    if (peg.parentNode) peg.parentNode.removeChild(peg)
  }
  pegs = []
}


const mousedown$ = Rx.Observable.fromEvent(editor, 'mousedown')
const mouseup$ = Rx.Observable.fromEvent(editor, 'mouseup')


var eventToPt = function (e) {
  const x = (e.offsetX || e.clientX) - radius
  const y = (e.offsetY || e.clientY) - radius
  return {x: x, y: y}
}

let startedPegAt = null

// Size based on how long the mouse press/touch is
const calcSize = (start = startedPegAt) => {
  return Math.min(maxPegSize(), (((new Date()).getTime()) - start) / 40)
}

mousedown$.subscribe((e) => {
  startedPegAt = (new Date()).getTime()
  const pt = eventToPt(e)
  const [angle, dist] = ptToVector(pt)

  const interval = setInterval(() => {
    if (startedPegAt) {
      const peg = {
        id: 'wip',
        angle: angle,
        dist: dist,
        size: calcSize(),
        pt: pt,
        color: Color.growing,
      }
      renderPeg(peg)
    } else {
      const e = document.getElementById('wip')
      if (e) e.parentNode.removeChild(e)
      clearInterval(interval)
    }
  }, 20)
})

mouseup$.subscribe((e) => {
  const pt = eventToPt(e)
  const size = calcSize()

  const peg = newPeg(radius, pt, size)

  renderPeg(peg)
})

mouseup$.subscribe((e) => {
  startedPegAt = null
})


radians$.subscribe((angle) => {
  // Move the clock hand
  const hand = document.getElementById('hand')
  const duration = msPerTick * .75 // smaller than interval so we don't drop behind
  Velocity(hand, {
    x1: radius + Math.cos(angle) * radius,
    y1: radius + Math.sin(angle) * radius,
    x2: radius,
    y2: radius
  }, {duration: duration, easing: "linear", queue: false});
})

activePegs$.subscribe((pegModel) => {
  const tempModel = Object.create(pegModel)
  tempModel.color = Color.note
  tempModel.highlightcolor = Color.playing
  renderPeg(tempModel)
})


// MUSIC

const synth = new Tone.PolySynth(10, Tone.SimpleSynth).toMaster()

activePegs$.map((x) => x.sound).subscribe((sound) => {
  synth.volume.value = 0 // Normalize it from whatever it was
  synth.triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity)
  synth.volume.value = sound.volume
})


// Scratchin'
Rx.Observable.fromEvent(editor, 'mousemove')
    .throttle(50)
    .filter((e) => e.shiftKey)
    .map((e) => {
      const pt = eventToPt(e)
      const [angle, dist] = ptToVector(pt)
      const peg = {
        angle: angle,
        dist: dist,
        size: maxPegSize() / 10,
        pt: pt,
        color: Color.growing,
      }
      return newSoundData(normalizedValues(peg, radius), currTonality$.getValue())
    })
    .filter((s) => s.frequency)
    .subscribe((s) => synth.triggerAttackRelease(s.frequency, s.duration, undefined, s.velocity))
