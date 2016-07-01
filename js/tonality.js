// MODEL
const tonalities = createTonalities()

const currentTonality$ = new Rx.BehaviorSubject(localStorage['tonality'] || 'blues')
currentTonality$.subscribe((s) => localStorage['tonality'] = s)

// VIEW
// Build scale control
const scaleDivElem     = document.getElementById('scale')
const scaleCurrentElem = document.getElementById('scale-current')
for (let name of ownPropertiesIter(tonalities)()) {
  const input = document.createElement('INPUT')
  input.setAttribute('type', 'radio')
  input.setAttribute('name', 'scale')
  input.setAttribute('value', name)
  input.setAttribute('id', `scale-${name}`)
  scaleDivElem.insertBefore(input, scaleCurrentElem)

  const label = document.createElement('LABEL')
  label.setAttribute('for', `scale-${name}`)
  label.setAttribute('title', name)
  label.appendChild(document.createElement('SPAN'))
  scaleDivElem.insertBefore(label, scaleCurrentElem)

  Rx.Observable.fromEvent(input, 'change').mapTo(name).subscribe(currentTonality$)
}

currentTonality$.subscribe((s) => scaleCurrentElem.innerText = s)
