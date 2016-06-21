
const playPauseEl = document.getElementById('play-pause')
const playPauseClicks$ = Rx.Observable.fromEvent(playPauseEl, 'click')

const playPause$ = Rx.Observable
    .just(1)
    .merge(playPauseClicks$.scan((acc, e) => 1-acc, 1))

const play$ = playPause$.filter(x => x == 1)
play$.subscribe(() => { playPauseEl.className = 'playing' })

const pause$ = playPause$.filter(x => x == 0)
pause$.subscribe(() => { playPauseEl.className = 'paused' })
