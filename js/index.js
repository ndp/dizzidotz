"use strict";

const savedPatterns$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))
    .filter((x) => /pattern.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((acc, x) => { acc.push(x); return acc }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const patternsToPersist$ = new Rx.Subject()

patternsToPersist$.subscribe((pattern) => {
  pattern.timestamp = (new Date()).getTime()
  pattern.name = `pattern-${pattern.timestamp}`
  localStorage.setItem(pattern.name, JSON.stringify(pattern))
})

const savedPatternsModel$ = Rx.Observable.combineLatest(savedPatterns$, patternsToPersist$.startWith(null), (savedPatterns, newPattern) => {
  if (newPattern) savedPatterns.unshift(newPattern)
  return savedPatterns
})

const patternListElem = document.getElementsByTagName('ol')[0]



const patternsClicks$ = Rx.Observable.fromEvent(patternListElem, 'click')


const patternClicks$ = patternsClicks$
    .filter((e) => e.target.closest('a').className !== 'delete')
const delPatternClick$ = patternsClicks$
    .filter((e) => e.target.closest('a').className == 'delete')

const delPatternLi$ = delPatternClick$
    .map((e) => e.target.closest('li'))

const delPatternRequests$ = delPatternLi$
    .map((li) => li.getAttribute('data-name'))


delPatternRequests$.subscribe((name) => localStorage.removeItem(name))
delPatternLi$.subscribe((li) => li.parentNode.removeChild(li))


const resurrectPattern$ = patternClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className != 'delete')

const clearPatternAction$ = new Rx.BehaviorSubject()
resurrectPattern$.subscribe(clearPatternAction$)
resurrectPattern$.subscribe((link) => {
  const pegData = link.getAttribute('data-pegs')
  const pegs = JSON.parse(pegData)
  pegs.forEach((pegModel) => {
    const screen = normalizedToScreen(pegModel.normalized, radius)
    pegModel.pt = screen.pt
    pegModel.size = screen.size
    renderPeg(newPeg(radius, pegModel.pt, pegModel.size))
  })
})


const drawPatterns = (patterns) => {
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

savedPatternsModel$.subscribe(drawPatterns)

