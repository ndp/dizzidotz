"use strict";

const savedPatternsState$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))
    .filter((x) => /pattern.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((acc, x) => {
      acc.push(x);
      return acc
    }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const persistPatternAction$ = new Rx.Subject()

persistPatternAction$.subscribe((pattern) => {
  pattern.timestamp = (new Date()).getTime()
  pattern.name = `pattern-${pattern.timestamp}`
  localStorage.setItem(pattern.name, JSON.stringify(pattern))
})

// Currently saved patterns
const patternsState$ = Rx.Observable.combineLatest(
    savedPatternsState$,
    persistPatternAction$.startWith(null),
    (savedPatterns, newPattern) => {
      if (newPattern) savedPatterns.unshift(newPattern)
      return savedPatterns
    })


// VIEWS
const patternListElem = document.getElementsByTagName('ol')[0]

const renderPatterns = (patterns) => {
  patternListElem.innerHTML = ''

  patterns.forEach((pattern) => {
    const link = document.createElement('A')
    link.className = 'pattern'
    link.style.height = '100px'
    link.style.width = '100px'
    link.style.display = 'block'
    link.innerHTML = pattern.svg
    link.setAttribute('data-pegs', JSON.stringify(pattern.pegs))

    const li = document.createElement('LI')
    li.setAttribute('data-name', pattern.name)
    li.appendChild(link)

    const del = document.createElement('A')
    del.innerHTML = '<svg viewBox="0 0 100 100" style=""><line x1="0px" y1="0px" x2="100px" y2="100px" style="stroke:white;stroke-width:6"></line><line x1="0px" y1="100px" x2="100px" y2="0px" style="stroke:white;stroke-width:6"></line></svg>'
    del.className = 'delete'
    li.appendChild(del)

    patternListElem.appendChild(li)
  })
}

patternsState$.subscribe(renderPatterns)


// INTENTIONS
const clearEditorPatternAction$ = new Rx.BehaviorSubject()

const patternsClicks$ = Rx.Observable.fromEvent(patternListElem, 'click')

const loadPatternCmd$ = patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className != 'delete')
    .map(link => link.getAttribute('data-pegs'))
    .map(pegData => JSON.parse(pegData))

loadPatternCmd$.subscribe(clearEditorPatternAction$)
loadPatternCmd$
    .subscribe((pegs) => {
      pegs.forEach((pegModel) => {
        const screen = normalizedToScreen(pegModel.normalized, radius)
        pegModel.pt = screen.pt
        pegModel.size = screen.size
        renderPeg(newPeg(radius, pegModel.pt, pegModel.size))
      })
    })


// INTENTIONS: DELETE
const delPatternClick$ = patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className == 'delete')

const delPatternLi$ = delPatternClick$
    .map((link) => link.closest('li'))

const delPatternAction$ = delPatternLi$
    .map((li) => li.getAttribute('data-name'))
delPatternAction$.subscribe((name) => localStorage.removeItem(name))
delPatternLi$.subscribe((li) => li.parentNode.removeChild(li))





