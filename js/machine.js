"use strict";

// MODEL
const msPerTick = 20
let msPerPeriod = 2000
const radiansPerPeriod = 2 * Math.PI
const radiansPerTick = () => {
  return (msPerTick / msPerPeriod * radiansPerPeriod)
}







// VIEW
const svg = document.getElementsByTagName('svg')[0]
const hand = document.getElementById('hand')
const body = document.getElementsByTagName('body')[0]
const hub = document.getElementById('hub')
const wheel = document.getElementById('wheel')
const msPerPeriodInput = document.getElementById('ms-per-period')

const radius = Math.min(body.clientHeight, body.clientWidth) / 2

// View set up
svg.style.width = 2 * radius
svg.style.height = 2 * radius
svg.style.marginLeft = `${(body.clientWidth / 2) - radius}px`
hub.setAttribute('cx', radius)
hub.setAttribute('cy', radius)
wheel.setAttribute('cx', radius)
wheel.setAttribute('cy', radius)
wheel.setAttribute('r', radius)


const mousedown$ = Rx.Observable.fromEvent(svg, 'mousedown')
const mouseup$ = Rx.Observable.fromEvent(svg, 'mouseup')
const tempoChange$ = Rx.Observable.fromEvent(msPerPeriodInput, 'change')

const Color = {
  note: 'violet',
  playing: 'white',
  growing: 'deeppink'
}



const maxSize = 128

const normalizeRadians = (r) => {
  if (Math.abs(r) < Math.pi) return r
  r = r % radiansPerPeriod
  if (r > Math.PI) r = r - radiansPerPeriod
  return r
}

tempoChange$.subscribe((e) => msPerPeriod = e.target.value)


const synth = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster()// new Tone.SimpleSynth().toMaster()
const synthFor = (pegModel) => synth


const pegs = []

const ptToVector = function (pt) {
  const angle = Math.atan2(pt.y, pt.x) // note: backward order is JS spec
  const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y)
  return [angle, dist]
}
var eventToPt = function (e) {
  const x = (e.offsetX || e.clientX) - radius
  const y = (e.offsetY || e.clientY) - radius
  return {x: x, y: y}
}

let startTimeStamp = null

const calcSize = (start = startTimeStamp) => {
  return Math.min(maxSize, (((new Date()).getTime()) - start) / 40)
}

mousedown$.subscribe((e) => {
  console.log(e)
  startTimeStamp = (new Date()).getTime()
  const pt = eventToPt(e)
  console.log(pt)
  const [angle, dist] = ptToVector(pt)

  const interval = setInterval(() => {
    if (startTimeStamp) {
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
  const e = findOrCreatePeg(pegModel)
  e.setAttribute("cx", pegModel.pt.x + radius)
  e.setAttribute("cy", pegModel.pt.y + radius)
  e.setAttribute("r", pegModel.size)
  e.setAttribute("fill", pegModel.highlightcolor || pegModel.color || Color.note)
  if (pegModel.highlightcolor) {
    setTimeout(() => e.setAttribute('fill', pegModel.color), 100)
  }
}

const createPegModel = (pt, size) => {
  const [angle, dist] = ptToVector(pt)
  return {
    id: `peg-${angle}`,
    angle: angle,
    dist: dist,
    size: size,
    pt: pt,
    duration: size / maxSize,
    velocity: dist / radius,
    frequency: (1 - dist / radius) * 4000,
    volume: Math.log2(size) * 3
  }
}

mouseup$.subscribe((e) => {
  const pt = eventToPt(e)
  const size = calcSize()

  const peg = createPegModel(pt, size)

  pegs.push(peg)
  renderPeg(peg)
})

mouseup$.subscribe((e) => {
  startTimeStamp = null
})


const ticker$ = Rx.Observable.interval(msPerTick)
const radians$ = ticker$.scan((last) => normalizeRadians(last + radiansPerTick()))

radians$.subscribe((angle) => {
  // Move the clock hand
  Velocity(hand, {
    x1: radius + Math.cos(angle) * radius,
    y1: radius + Math.sin(angle) * radius,
    x2: radius,
    y2: radius
  }, {duration: msPerTick * .75, easing: "linear", queue: false});
})

const activePegs$ = new Rx.Subject()

radians$.subscribe((angle) => {
  // Generate stream of active pegs
  pegs.forEach((pegModel) => {
    if (angle <= pegModel.angle && pegModel.angle < (angle + radiansPerTick())) {
      activePegs$.onNext(pegModel)
    }
  })
})


activePegs$.subscribe((pegModel) => {
  const synth = synthFor(pegModel)
  synth.volume.value = 0
  synth.triggerAttackRelease(pegModel.frequency, pegModel.duration, undefined, pegModel.velocity)
  synth.volume.value = pegModel.volume
})

activePegs$.subscribe((pegModel) => {
  const tempModel = Object.create(pegModel)
  tempModel.color = Color.note
  tempModel.highlightcolor = Color.playing
  renderPeg(tempModel)
})


