// MODEL
const tonalities = createTonalities()

const currentTonality$ = new Rx.BehaviorSubject('blues')

// VIEW
// Build scale control
const scaleCurrentElem    = document.getElementById('scale-current')

currentTonality$.subscribe((s) => scaleCurrentElem.innerHTML = `&#127925; ${s}`)
