"use strict";

// MODEL
const msPerTick = 20

const radiansPerTick = () => {
  return (msPerTick / msPerPeriod$.getValue() * radiansPerPeriod)
}


const maxPegSize = (r = radius) => r / 5


const normalizeValues = (radius, pt, size) => {
  const r     = {}
  const [angle, dist] = ptToVector(pt)
  r.angle     = angle
  r.distScore = 1 - (dist / radius)
  r.sizeScore = size / maxPegSize(radius)
  r.tonality  = currentTonality$.getValue()
  return r
}

const normalizeEvent = (e, radius, size) =>
    normalizeValues(radius, eventToPt(e, radius), size)


const newSoundData = (normalized) => {
  const tonality  = normalized.tonality || currentTonality$.getValue()
  const frequency = tonalities[tonality](normalized.distScore)
  return {
    scale:    tonality,
    tonality: tonality,
              frequency,
    volume:   normalized.sizeScore * 30,
    velocity: normalized.sizeScore,
    duration: normalized.sizeScore
  }
}

const newPeg = function(normalized) {
  return {
    id:         `peg-${(new Date()).getTime()}${Math.random()}`,
    normalized: normalized,
    sound:      newSoundData(normalized)
  }
}


const ticker$     = Rx.Observable.interval(msPerTick).pausable(playState$.map(s => s == 'playing' ? 1 : 0))
const radians$    = ticker$.scan((last) => normalizeRadians(last + radiansPerTick()))

// activePegs$ is a stream of the "active" or highlighted peg.
const activePegs$ = new Rx.Subject()
radians$.withLatestFrom(editorPegs$, (angle, pegs) => {
  // Generate stream of active pegs
  pegs.forEach((pegModel) => {
    if (angle <= pegModel.normalized.angle && pegModel.normalized.angle < (angle + radiansPerTick())) {
      activePegs$.onNext(pegModel)
    }
  })
})
    .subscribe(() => null)


// VIEW
const drawerDepth = 115
const editor      = document.getElementById('editor')
const body        = document.getElementsByTagName('body')[0]
const wheel       = document.getElementById('wheel')

const saveButton       = document.getElementById('save-button')

const portrait = () => (body.clientHeight > body.clientWidth)
const radius   = portrait() ?
Math.min(body.clientHeight - 2 * drawerDepth, body.clientWidth) / 2
    : Math.min(body.clientHeight, body.clientWidth - 2 * drawerDepth) / 2


const resizeAction$ = new Rx.Subject()
resizeAction$.subscribe(() => {
  editor.style.width  = 2 * radius
  editor.style.height = 2 * radius
  if (portrait()) {
    editor.style.marginTop  = `${((body.clientHeight - drawerDepth) / 2) - radius}px`
    editor.style.marginLeft = `${(body.clientWidth / 2) - radius}px`
  } else {
    editor.style.marginTop  = `${(body.clientHeight / 2) - radius}px`
    editor.style.marginLeft = `${((body.clientWidth - drawerDepth) / 2) - radius}px`
  }
  editor.setAttribute('viewBox', `0 0 ${2 * radius} ${2 * radius}`)
})

resizeAction$.onNext()

//wheel.setAttribute('cx', radius)
//wheel.setAttribute('cy', radius)
//wheel.setAttribute('r', radius)


const Color = {
  note:    'violet',
  playing: 'white',
  growing: 'deeppink'
}


// Draw the pegs
editorPegs$
    .map((pegs) => {
           const newPegs = []
           pegs.forEach((pegModel) => {
             const screen = normalizedToScreen(pegModel.normalized, radius)
             newPegs.push([pegModel, screen])
           })
           return newPegs
         })
    .subscribe(pegs => pegs.forEach((p) => renderPeg(p[0], p[1])))

const normalizedToScreen = (normalized, radius) => {
  return {
    pt:   vectorToPt(normalized.angle, (1 - normalized.distScore) * radius),
    size: normalized.sizeScore * maxPegSize(radius)
  }
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

const renderPeg = (pegModel, screen) => {
  //console.log(pegModel)
  const e = findOrCreatePeg(pegModel)
  e.setAttribute("cx", screen.pt.x + radius)
  e.setAttribute("cy", screen.pt.y + radius)
  e.setAttribute("r", screen.size)
  e.setAttribute("fill", screen.highlightcolor || screen.color || Color.note)
}


// INTERACTIONS



const saveEditorAction$ = Rx.Observable
    .fromEvent(saveButton, 'click')
    .withLatestFrom(editorPegs$, (_, pegs) => {
                                                return {
                                                  name:  'insert',
                                                  pattern: {
                                                    tonality: currentTonality$.getValue(),
                                                    periodMs: msPerPeriod$.getValue(),
                                                    pegs:     pegs,
                                                    svg:      editor.outerHTML.replace(/(style|id)="[^"]+"/g, '')
                                                  }
                                                }
                                              })
    .subscribe(patternStoreBus$)

resizeAction$.subscribe(saveEditorAction$)

// Remove all the pegs if they are gone
editorPegs$
    .filter((pegs) => pegs.length == 0)
    .subscribe(function() {
                 let peg
                 while (peg = editor.getElementsByClassName('peg')[0]) {
                   if (peg.parentNode) peg.parentNode.removeChild(peg)
                 }
               })


const editorMousedown$ = Rx.Observable.fromEvent(editor, 'mousedown')
const editorMouseup$   = Rx.Observable.fromEvent(editor, 'mouseup')


var eventToPt = function(e, radius) {
  const x = (e.offsetX || e.clientX) - radius
  const y = (e.offsetY || e.clientY) - radius
  return {x: x, y: y}
}

let startedPegAt = null

// Size based on how long the mouse press/touch is
const calcSizeWhileGrowing = (start = startedPegAt) => {
  return Math.min(maxPegSize(), (((new Date()).getTime()) - start) / 40)
}

editorMousedown$.subscribe((e) => {
  startedPegAt = (new Date()).getTime()
  const pt     = eventToPt(e, radius)
  const [angle, dist] = ptToVector(pt)

  const interval = setInterval(() => {
    if (startedPegAt) {
      const peg    = {
        id:    'wip',
        angle: angle,
        dist:  dist,
      }
      const screen = {
        size:  calcSizeWhileGrowing(),
        pt:    pt,
        color: Color.growing
      }
      renderPeg(peg, screen)
    } else {
      const e = document.getElementById('wip')
      if (e) e.parentNode.removeChild(e)
      clearInterval(interval)
    }
  }, 20)
})

editorMouseup$
    .map((e) => {
           const pt   = eventToPt(e, radius)
           const size = calcSizeWhileGrowing()
           return {pt, size}
         })
    .map((screen) => {
           const normalized = normalizeValues(radius, screen.pt, screen.size)
           return {name: 'add peg', peg: newPeg(normalized)}
         })
    .subscribe(editorCmdBus$)

editorMouseup$.subscribe((e) => {
  startedPegAt = null
})


// Move the clock hand
radians$.subscribe((angle) => {
  const hand     = document.getElementById('hand')
  const duration = msPerTick * .75 // smaller than interval so we don't drop behind
  Velocity(hand, {
    x1: radius + Math.cos(angle) * radius,
    y1: radius + Math.sin(angle) * radius,
    x2: radius,
    y2: radius
  }, {duration: duration, easing: "linear", queue: false});
})


activePegs$.subscribe((pegModel) => {
  let e = document.getElementById(pegModel.id)
  if (e) {
    e.setAttribute("fill", Color.playing)
    const highlightDuration = Math.min(200, pegModel.sound.duration * 1000)
    setTimeout(() => e.setAttribute('fill', Color.note), highlightDuration)
  }
})


// MUSIC
activePegs$.map((x) => x.sound).subscribe(soundOut$)


// Scratchin'
Rx.Observable.fromEvent(editor, 'mousemove')
    .throttle(50)
    //.filter(e => e.shiftKey)
    .map(e => newSoundData(normalizeEvent(e, radius, maxPegSize() / 10)))
    .filter(s => s.frequency)
    .subscribe(soundOut$)

