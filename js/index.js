"use strict";

const savedPatterns$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))
    .filter((x) => /pattern.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((acc, x) => {
      acc.push(x)
      return acc
    }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const newPatterns$ = new Rx.Subject()

newPatterns$.subscribe((pattern) => {
  pattern.timestamp = (new Date()).getTime()
  pattern.name = `pattern-${pattern.timestamp}`
  localStorage.setItem(pattern.name, JSON.stringify(pattern))
})

const allPatterns$ = Rx.Observable.combineLatest(savedPatterns$, newPatterns$.startWith(null), (savedPatterns, newPattern) => {
      if (newPattern) savedPatterns.unshift(newPattern)
      return savedPatterns
    })

const patternList = document.getElementsByTagName('ol')[0]

const renderPattern = (e) => {

  const link = e.target.closest('a')
  if (!link) return;

  clearPattern()

  const pegData = link.getAttribute('data-pegs')
  const pegs = JSON.parse(pegData)
  pegs.forEach((pegModel) => {
    newPeg(radius, pegModel.pt, pegModel.size)
    renderPeg(pegModel)
  })
}


const patternClicks$ = Rx.Observable.fromEvent(patternList, 'click')
patternClicks$.subscribe(renderPattern)


const drawPatterns = (patterns) => {
  patternList.innerHTML = ''

  patterns.forEach((pattern) => {
    const link = document.createElement('A')
    link.style.height = '100px'
    link.style.width = '100px'
    link.style.display = 'block'
    link.innerHTML = pattern.svg
    link.setAttribute('data-pegs', JSON.stringify(pattern.pegs))
    const li = document.createElement('LI')
    li.appendChild(link)
    patternList.appendChild(li)
  })
}

allPatterns$.subscribe((x) => {
  drawPatterns(x)
})

