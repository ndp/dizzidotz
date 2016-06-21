// MODEL
const playState$ = new Rx.BehaviorSubject('playing')

playStateBus$ = newCmdBus$(playState$)
playStateBus$.on('toggle', state => state == 'playing' ? 'paused' : 'playing')


// VIEW
const playPauseEl = document.getElementById('play-pause')

playState$.subscribe(x => {
  playPauseEl.className = x // 'playing' or 'paused'
})


// INTENT
const playPauseClicks$ = Rx.Observable.fromEvent(playPauseEl, 'click')
playPauseClicks$.map('toggle').subscribe(playStateBus$)


