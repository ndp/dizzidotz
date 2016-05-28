"use strict";

// MODEL
const msPerTick = 20
let msPerPeriod = 2000
const radiansPerPeriod = 2 * Math.PI
const radiansPerTick = () => {
  return (msPerTick / msPerPeriod * radiansPerPeriod)
}

// equal tempered scale
const chromaticDist = Math.pow(2, 1 / 12)
// ref. http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
const roundToEqualTempered = (f) => f - (f % chromaticDist)

let pegs = []
const maxPegSize = (r = radius) => r / 5


const newSoundData = (peg) => {
  const r = {}
  r.frequency = roundToEqualTempered((1 - peg.normalized.distScore) * 4000)
  r.volume = peg.normalized.sizeScore * 40
  r.velocity = peg.normalized.distScore
  r.duration = peg.normalized.sizeScore
  return r
}

const normalizedValues = (peg, radius) => {
  const r = {}
  const [angle, dist] = ptToVector(peg.pt)
  r.angle = angle
  r.dist = dist
  r.distScore = dist / radius
  r.sizeScore = peg.size / maxPegSize(radius)
  return r
}

const newPeg = (radius, pt, size) => {
  const p = {
    id: `peg-${(new Date()).getTime()}`,
    pt: pt,
    size: size
  }
  p.normalized = normalizedValues(p, radius)
  p.sound = newSoundData(p)
  pegs.push(p)
  return p
}


const normalizeRadians = (r) => {
  if (Math.abs(r) < Math.pi) return r
  r = r % radiansPerPeriod
  if (r > Math.PI) r = r - radiansPerPeriod
  return r
}

const ticker$ = Rx.Observable.interval(msPerTick)
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
const svg = document.getElementById('editor')
const body = document.getElementsByTagName('body')[0]
const wheel = document.getElementById('wheel')


const msPerPeriodInput = document.getElementById('ms-per-period')
const saveButton = document.getElementById('save-button')

const radius = Math.min(body.clientHeight, body.clientWidth) / 2

// View set up
const sizeSVG = () => {
  svg.style.width = 2 * radius
  svg.style.height = 2 * radius
  svg.style.marginLeft = `${(body.clientWidth / 2) - radius}px`
  svg.setAttribute('viewBox', `0 0 ${2 * radius} ${2 * radius}`)
}
sizeSVG()
wheel.setAttribute('cx', radius)
wheel.setAttribute('cy', radius)
wheel.setAttribute('r', radius)


const Color = {
  note: 'violet',
  playing: 'white',
  growing: 'deeppink'
}


const ptToVector = function (pt) {
  const angle = Math.atan2(pt.y, pt.x) // note: unintuitive order is JS spec
  const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y)
  return [angle, dist]
}


const findOrCreatePeg = (pegModel) => {
  let peg = document.getElementById(pegModel.id)
  if (!peg) {
    peg = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    peg.setAttribute('id', pegModel.id)
    svg.appendChild(peg)
  }
  return peg
}

const renderPeg = (pegModel) => {
  console.log(pegModel)
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
saveClicks$.subscribe((e) => saveProject(e))


const saveProject = () => {
  const projects = loadSavedProjects()
  svg.style.width = 'auto'
  svg.style.height = 'auto'
  svg.style.marginLeft = 'auto'
  projects.unshift({pegs: pegs, svg: svg.outerHTML.replace(/id="peg[^"]+"/g, '')})
  sizeSVG()
  localStorage['projects'] = JSON.stringify(projects)
  drawProjects(projects)
}


const clearProject = () => {
  pegs.forEach((pegModel) => {
    const peg = document.getElementById(pegModel.id)
    peg.parentNode.removeChild(peg)
  })
  pegs = []
}


const mousedown$ = Rx.Observable.fromEvent(svg, 'mousedown')
const mouseup$ = Rx.Observable.fromEvent(svg, 'mouseup')


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
  const duration = msPerTick * .75 // smaller than intervalso we don't drop behind
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
const synthFor = (pegModel) => synth

activePegs$.map((x) => x.sound).subscribe((sound) => {
  synth.volume.value = 0 // Normalize it from whatever it was
  synth.triggerAttackRelease(sound.frequency, sound.duration, undefined, sound.velocity)
  synth.volume.value = sound.volume
})

