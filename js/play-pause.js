// MODEL
const playState$ = new Rx.BehaviorSubject('playing')

playStateBus$ = newCmdBus$(playState$)
playStateBus$.on('toggle', state => state == 'playing' ? 'paused' : 'playing')


// VIEW
const playPauseEl = document.getElementById('play-pause')

playState$.subscribe(x => {
  playPauseEl.className = playPauseEl.className.replace(/playing|paused/, x) // x = 'playing' or 'paused'
})


// INTENT
const playPauseClicks$ = Rx.Observable.fromEvent(playPauseEl, 'click')
playPauseClicks$.mapTo('toggle').subscribe(playStateBus$)


const playPauseKeypress$ = Rx.Observable.fromEvent(document, 'keypress')
    .filter(e => e.keyCode == 32) // space
    .mapTo('toggle')
    .subscribe(playStateBus$)