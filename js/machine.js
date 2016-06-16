"use strict";

// MODEL
const msPerTick = 20

const radiansPerTick = () => {
  return (msPerTick / msPerPeriod$.getValue() * radiansPerPeriod)
}

editorPegsCmdBus$.addListener('add', (state, cmd) => {
  state.push(cmd.value)
  return state
})

editorPegsCmdBus$.addListener('clear', () => [])

editorPegsCmdBus$.addListener('add normalized', (state, cmd) => {
  return cmd.pegs.map((pegModel) => {
    const screen = normalizedToScreen(pegModel.normalized, radius)
    return newPeg(radius, screen.pt, screen.size)
  })
})


const maxPegSize = (r = radius) => r / 5


const normalizeValues = (radius, pt, size) => {
  const r = {}
  const [angle, dist] = ptToVector(pt)
  r.angle = angle
  r.distScore = 1 - (dist / radius)
  r.sizeScore = size / maxPegSize(radius)
  return r
}

const normalizeEvent = (e, radius, size) =>
    normalizeValues(radius, eventToPt(e, radius), size)


const newPeg = (radius, pt, size) => {
  const normalized = normalizeValues(radius, pt, size)
  const peg = {
    normalized,
    id: `peg-${(new Date()).getTime()}${Math.random()}`,
    screen: {
      pt: pt,
      size: size
    },
    sound: newSoundData(normalized, currTonality$.getValue())
  }
  return peg
}

editorPegs$.subscribe((pegs) => {
  pegs.forEach((pegModel) => {
    renderPeg(pegModel)
  })
})


const pauser$ = playPause$

const ticker$ = Rx.Observable.interval(msPerTick).pausable(pauser$)
const radians$ = ticker$.scan((last) => normalizeRadians(last + radiansPerTick()))
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
const editor = document.getElementById('editor')
const body = document.getElementsByTagName('body')[0]
const wheel = document.getElementById('wheel')


const msPerPeriodInput = document.getElementById('ms-per-period')
const saveButton = document.getElementById('save-button')

const portrait = () => (body.clientHeight > body.clientWidth)
const radius = portrait() ?
Math.min(body.clientHeight - 2 * drawerDepth, body.clientWidth) / 2
    : Math.min(body.clientHeight, body.clientWidth - 2 * drawerDepth) / 2


const resizeAction$ = new Rx.Subject()
resizeAction$.subscribe(() => {
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
})

resizeAction$.onNext()

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
  e.setAttribute("cx", pegModel.screen.pt.x + radius)
  e.setAttribute("cy", pegModel.screen.pt.y + radius)
  e.setAttribute("r", pegModel.screen.size)
  e.setAttribute("fill", pegModel.screen.highlightcolor || pegModel.screen.color || Color.note)
  if (pegModel.screen.highlightcolor) {
    setTimeout(() => e.setAttribute('fill', pegModel.screen.color), Math.min(200, pegModel.sound.duration * 1000))
  }
}


// INTERACTIONS

const tempoChangeAction$ = Rx.Observable
    .fromEvent(msPerPeriodInput, 'change')
    .map((e) => e.target.value)

const msPerPeriod$ = new Rx.BehaviorSubject(2000)
tempoChangeAction$.subscribe(msPerPeriod$)


const saveEditorAction$ = Rx.Observable
    .fromEvent(saveButton, 'click')
    .withLatestFrom(editorPegs$, (_, pegs) => {
      return {
        pegs: pegs,
        svg: editor.outerHTML.replace(/(style|id)="[^"]+"/g, '')
      }
    })
saveEditorAction$.subscribe(persistPatternAction$)

resizeAction$.subscribe(saveEditorAction$)

// Remove all the pegs if they are gone
editorPegs$.filter((pegs) => pegs.length == 0).subscribe(() => {
  let peg
  while (peg = editor.getElementsByClassName('peg')[0]) {
    if (peg.parentNode) peg.parentNode.removeChild(peg)
  }
})


const editorMousedown$ = Rx.Observable.fromEvent(editor, 'mousedown')
const editorMouseup$ = Rx.Observable.fromEvent(editor, 'mouseup')


const normalizedToScreen = (normalized, radius) => {
  return {
    pt: vectorToPt(normalized.angle, (1 - normalized.distScore) * radius),
    size: normalized.sizeScore * maxPegSize(radius)
  }
}

var eventToPt = function (e, radius) {
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
  const pt = eventToPt(e, radius)
  const [angle, dist] = ptToVector(pt)

  const interval = setInterval(() => {
    if (startedPegAt) {
      const peg = {
        id: 'wip',
        angle: angle,
        dist: dist,
        screen: {
          size: calcSizeWhileGrowing(),
          pt: pt,
          color: Color.growing
        },
      }
      renderPeg(peg)
    } else {
      const e = document.getElementById('wip')
      if (e) e.parentNode.removeChild(e)
      clearInterval(interval)
    }
  }, 20)
})

editorMouseup$.subscribe((e) => {
  const pt = eventToPt(e, radius)
  const size = calcSizeWhileGrowing()

  const peg = newPeg(radius, pt, size)
  editorPegsCmdBus$.onNext({name: 'add', value: peg})
})

editorMouseup$.subscribe((e) => {
  startedPegAt = null
})


// Move the clock hand
radians$.subscribe((angle) => {
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
  tempModel.screen.color = Color.note
  tempModel.screen.highlightcolor = Color.playing
  renderPeg(tempModel)
})


// MUSIC
activePegs$.map((x) => x.sound).subscribe(soundOut$)


// Scratchin'
Rx.Observable.fromEvent(editor, 'mousemove')
    .throttle(50)
    .filter(e => e.shiftKey)
    .map(e => newSoundData(normalizeEvent(e, radius, maxPegSize() / 10), currTonality$.getValue()))
    .filter(s => s.frequency)
    .subscribe(soundOut$)

/*
 event => normalized
 event => normalized (in progress)
 normalized => peg
 normalized => sound


 event
 => action
 => commandFn
 commandFn (state) => new state
 render(state) => view
 watch(view) => event
 */