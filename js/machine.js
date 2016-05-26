"use strict";

const svg = document.getElementsByTagName('svg')[0]
const hand = document.getElementById('hand')
const body = document.getElementsByTagName('body')[0]
const hub = document.getElementById('hub')


const keydown = Rx.Observable.fromEvent(document, 'keydown')
const keyup = Rx.Observable.fromEvent(document, 'keyup')
const click = Rx.Observable.fromEvent(document, 'click')
const mousedown = Rx.Observable.fromEvent(document, 'mousedown')
const mouseup = Rx.Observable.fromEvent(document, 'mouseup')


const msPerTick = 20
let msPerPeriod = 2000
const ticker = Rx.Observable.interval(msPerTick)
const radius = Math.min(body.clientHeight, body.clientWidth) / 2
const radiansPerPeriod = 2 * Math.PI
const radiansPerTick = () => {
  return (msPerTick / msPerPeriod * radiansPerPeriod)
}

const normalizeRadians = (r) => {
  if (Math.abs(r) < Math.pi) return r
  r = r % radiansPerPeriod
  if (r > Math.PI) r = r - radiansPerPeriod
  return r
}


const synth = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster()// new Tone.SimpleSynth().toMaster()
const synthFor = (pegModel) => synth

keydown.subscribe((e) => {
  const ch = /Key([A-G])/.exec(e.code)
  if (ch) {
    synth.triggerAttack(ch[1] + "4")
  }
})

keyup.subscribe(() => {
  synth.triggerRelease()
})


const pegs = []

const ptToVector = function (pt) {
  const angle = Math.atan2(pt.y, pt.x) // note: backward order is JS spec
  const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y)
  return [angle, dist]
}
var eventToPt = function (e) {
  const x = e.clientX - radius
  const y = e.clientY - radius
  return {x: x, y: y}
}

let startTimeStamp = null

mousedown.subscribe((e) => {
  console.log(e.timeStamp)
  startTimeStamp = (new Date()).getTime()

  const interval = setInterval(() => {
    if (startTimeStamp) {
      const pt = eventToPt(e)
      const [angle, dist] = ptToVector(pt)
      console.log(angle, dist)
      const peg = {
        id: `peg-${angle}`,
        angle: angle,
        dist: dist,
        size: (((new Date()).getTime()) - startTimeStamp) / 50,
        pt: pt,
        color: 'green',
        duration: dist / 1000.0,
        frequency: "c4",
      }
      renderPeg(peg)
    } else {
      clearInterval(interval)
    }
  }, 30)
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
  e.setAttribute("fill", pegModel.highlightcolor || pegModel.color)
  if (pegModel.highlightcolor) {
    setTimeout(() => e.setAttribute('fill', pegModel.color), 100)
  }
}

mouseup.subscribe((e) => {
  const pt = eventToPt(e)
  const [angle, dist] = ptToVector(pt)
  console.log(angle, dist)
  const peg = {
    id: `peg-${angle}`,
    angle: angle,
    dist: dist,
    size: ((new Date()).getTime() - startTimeStamp) / 50,
    pt: pt,
    color: 'green',
    duration: dist / 1000.0,
    frequency: "c4",
  }

  pegs.push(peg)
  renderPeg(peg)

  startTimeStamp = null
})


const radians = ticker.scan((last) => normalizeRadians(last + radiansPerTick()))
radians.subscribe((angle) => {
  Velocity(hand, {
    x1: radius + Math.cos(angle) * radius,
    y1: radius + Math.sin(angle) * radius,
    x2: radius,
    y2: radius
  }, {duration: msPerTick - 2, easing: "linear", queue: false});
})

const activePegs = new Rx.Subject()

radians.subscribe((angle) => {
  pegs.forEach((pegModel) => {
    if (angle <= pegModel.angle && pegModel.angle < (angle + radiansPerTick())) {
      activePegs.onNext(pegModel)
    }
  })
})


activePegs.subscribe((pegModel) => {
  synthFor(pegModel).triggerAttackRelease(pegModel.frequency, pegModel.duration)
})

activePegs.subscribe((pegModel) => {
  const tempModel = Object.create(pegModel)
  tempModel.highlightcolor = 'red'
  renderPeg(tempModel)
})

hub.setAttribute('cx', radius)
hub.setAttribute('cy', radius)

//    ticker.subscribe((e) => {
//        console.log('tick', e)
//    })
//    radians.subscribe((e) => {
//        console.log('radians', e)
//    })

