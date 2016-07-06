"use strict";

// MODEL
const NORMALIZED_RADIUS = 600 // main editor is 1200 virtual pizels
const maxPegSize = () => NORMALIZED_RADIUS / 5

const MS_PER_TICK = 20
const radiansPerTick = () => {
  return (MS_PER_TICK / msPerPeriod$.getValue() * radiansPerPeriod)
}




const normalizeValues = (pt, size) => {
  const r = {}
  const [rad, dist] = ptToVector(pt)
  r.rad   = rad
  r.mag   = 1 - (dist / NORMALIZED_RADIUS)
  r.sz    = size / maxPegSize()
  return r
}

const normalizeEvent = (e, size) =>
    normalizeValues(eventToPt(e), size)


const newSoundData = (normalized) => {
  const tonality  = normalized.tonality || currentTonality$.getValue()
  const frequency = tonalities[tonality](normalized.mag)
  return {
              frequency,
    volume:   normalized.sz * 30,
    velocity: normalized.sz,
    duration: normalized.sz
  }
}

const newPeg = function(normalized) {
  return {
    id:         `peg-${(new Date()).getTime()}${Math.random()}`,
    normalized: normalized,
    sound:      newSoundData(normalized)
  }
}


const ticker$  = Rx.Observable.interval(MS_PER_TICK).filter(() => playState$.getValue() == 'playing')
const radians$ = ticker$.scan((last) => normalizeRadians(last + radiansPerTick()))

// activePegs$ is a stream of the "active" or highlighted peg.
const activePegs$ = new Rx.Subject()
radians$.withLatestFrom(editorPegs$, (angle, pegs) => {
  // Generate stream of active pegs
  pegs.forEach((pegModel) => {
    if (angle <= pegModel.normalized.rad && pegModel.normalized.rad < (angle + radiansPerTick())) {
      activePegs$.next(pegModel)
    }
  })
})
    .subscribe(() => null)


// VIEW
const drawerDepth = 115
const editor      = document.getElementById('editor')
const wheel       = document.getElementById('wheel')
const pegsEl      = wheel.getElementsByClassName('pegs')[0]
const body        = document.getElementsByTagName('body')[0]

const saveButton = document.getElementById('save-button')


const Color = {
  note:    'violet',
  playing: 'white',
  growing: 'deeppink',
  scratch: 'yellow'
}


// Draw the pegs
editorPegs$
    .map((pegs) => {
           const newPegs = []
           pegs.forEach((pegModel) => {
             const screen = normalizedToScreen(pegModel.normalized)
             newPegs.push([pegModel, screen])
           })
           return newPegs
         })
    .subscribe(pegs => pegs.forEach((p) => renderPeg(p[0], p[1])))

//// Remove pegs if they are gone
editorPegs$
    .subscribe(function(pegs) {
                 const ids    = pegs.map(x => x.id)
                 const pegEls = pegsEl.getElementsByClassName('peg')
                 // Note: go backwards, because there appears to be a bug with el.remove() when going forward.
                 for (let i = pegEls.length - 1; i >= 0; i--) {
                   let el   = pegEls[i]
                   const id = el.getAttribute('id')
                   if (ids.indexOf(id) == -1) {
                     el.remove()
                   }
                 }
               })

const normalizedToScreen = (normalized) => {
  return {
    pt:   vectorToPt(normalized.rad, (1 - normalized.mag) * NORMALIZED_RADIUS),
    size: normalized.sz * maxPegSize()
  }
}


const findOrCreatePeg = (pegModel) => {
  let peg = document.getElementById(pegModel.id)
  if (!peg) {
    peg = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    peg.setAttribute('id', pegModel.id)
    peg.setAttribute('class', 'peg')
    pegsEl.appendChild(peg)
  }
  return peg
}

const renderPeg = (pegModel, screen) => {
  //console.log(pegModel)
  const e = findOrCreatePeg(pegModel)
  e.setAttribute("cx", screen.pt.x + NORMALIZED_RADIUS)
  e.setAttribute("cy", screen.pt.y + NORMALIZED_RADIUS)
  e.setAttribute("r", screen.size)
  e.setAttribute("fill", screen.highlightcolor || screen.color || Color.note)
}


// INTERACTIONS
const saveEditorAction$ = Rx.Observable
    .fromEvent(saveButton, 'click')
    .withLatestFrom(editorPegs$, (_, pegs) => {
                      return {
                        name:    'insert',
                        pattern: {
                          name:     name$.getValue(),
                          tonality: currentTonality$.getValue(),
                          periodMs: msPerPeriod$.getValue(),
                          pegs:     pegs,
                          svg:      `<svg viewBox="${editor.getAttribute('viewBox')}">${wheel.outerHTML.replace(/(style|id)="[^"]+"/g, '')}</svg>`
                        }
                      }
                    })
    .subscribe(patternStoreBus$)


const editorMousedown$ = Rx.Observable.fromEvent(editor, 'mousedown')
const editorMouseup$   = Rx.Observable.fromEvent(editor, 'mouseup')


var eventToPt = function(e) {
  const bounds = editor.getBoundingClientRect()
  //const width = bounds.right - bounds.left
  const x = ((e.x - bounds.left) / editor.clientWidth - 0.5) * 2.0 * NORMALIZED_RADIUS
  const y = ((e.y - bounds.top) / editor.clientHeight - 0.5) * 2.0 * NORMALIZED_RADIUS
  return {x: x, y: y}
}

let startedPegAt = null

// Size based on how long the mouse press/touch is
const calcSizeWhileGrowing = (start = startedPegAt) => {
  return Math.min(maxPegSize(), (((new Date()).getTime()) - start) / 40)
}

editorMousedown$.subscribe((e) => {
  startedPegAt = (new Date()).getTime()
  const pt     = eventToPt(e)
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
           const pt   = eventToPt(e)
           const size = calcSizeWhileGrowing()
           return {pt, size}
         })
    .map((screen) => {
           const normalized = normalizeValues(screen.pt, screen.size)
           return {name: 'add peg', peg: newPeg(normalized)}
         })
    .subscribe(editorCmdBus$)

editorMouseup$.subscribe((e) => {
  startedPegAt = null
})


// Move the clock hand
radians$.subscribe((angle) => {
  const hand     = document.getElementById('hand')
  const duration = MS_PER_TICK * .75 // smaller than interval so we don't drop behind
  Velocity(hand, {
    x1: NORMALIZED_RADIUS + Math.cos(angle) * NORMALIZED_RADIUS,
    y1: NORMALIZED_RADIUS + Math.sin(angle) * NORMALIZED_RADIUS,
    x2: NORMALIZED_RADIUS,
    y2: NORMALIZED_RADIUS
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
const scratch$ = Rx.Observable.fromEvent(editor, 'mousemove')
    .throttleTime(30)
    .filter(e => e.shiftKey)

scratch$
    .map(e => newSoundData(normalizeEvent(e, maxPegSize() / 5)))
    .filter(s => s.frequency)
    .subscribe(soundOut$)

scratch$
    .subscribe(function(e) {
                 const pt     = eventToPt(e)
                 const screen = {
                   size:  3,
                   pt:    pt,
                   color: Color.scratch
                 }
                 const [angle, dist] = ptToVector(pt)
                 const peg    = {
                   id:    'scratch',
                   angle: angle,
                   dist:  dist,
                 }
                 renderPeg(peg, screen)
               })

scratch$
    .debounceTime(100)
    .subscribe(function() {
                 const scratch = document.getElementById('scratch')
                 if (scratch) scratch.remove()
               })


/// DELETE ALL
Rx.Observable.fromEvent(document.getElementById('delete-all-btn'), 'click')
    .filter(() => window.confirm("really delete all your data? there’s no going back!"))
    .mapTo('delete all')
    .subscribe(patternStoreBus$)


// Needed otherwise JSON gets filled with really long precision numbers, where
// that level of precision is not needed for regular old JSON
function roundForJSON(x) {
  const c = 1000000.0
  return Math.round(x * c) / c
}

function compressedModel(pegs) {
  const model = {
    name:     name$.getValue(),
    tonality: currentTonality$.getValue(),
    periodMs: msPerPeriod$.getValue(),
    pegs:     pegs.map(function(peg) {
      return {
        rad: roundForJSON(peg.normalized.rad),
        mag: roundForJSON(peg.normalized.mag),
        sz:  roundForJSON(peg.normalized.sz)
      }
    })
  }
  // max length 2000
  const json = JSON.stringify(model)
  //console.log(json, json.length)
  const compressed = LZString.compressToEncodedURIComponent(json)
  return compressed
}

Rx.Observable
    .fromEvent(document.getElementById('permalink-button'), 'click')
    .do(e => e.preventDefault())
    .withLatestFrom(editorPegs$, (_, pegs) => pegs)
    .map(pegs => compressedModel(pegs))
    .do(x => {
         if (x.length > 2000) {
           window.alert('This dotz is too complicated to share in a URL. Sorriz. Lemme know, and I’ll make it work... - dr. dotz.')
         }
        })
    .subscribe(function(serialized) {
                 const newHref = document.location.href.replace(/[#\?].*/, '') + '?v1=' + serialized
                 window.history.replaceState({}, '', newHref)
               })


// Load a pattern from the URL, if needed
Rx.Observable
    .of(document.location)
    .map(x => x.search)
    .filter(x => x.indexOf('v1=') !== -1)
    .map(x => x.replace(/\??v1=/, ''))
    .map(x => LZString.decompressFromEncodedURIComponent(x))
    .filter(x => x)
    .map(x => JSON.parse(x))
    .map(x => {
           return {
             name:    'add pattern',
             pattern: x
           }
         })
    .subscribe(x => editorCmdBus$.next(x))




const keyPress$ = Rx.Observable
    .fromEvent(document, 'keypress')

keyPress$.subscribe(log('char'))