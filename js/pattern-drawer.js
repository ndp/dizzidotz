"use strict";


// VIEWS
const patternListElem = document.getElementsByTagName('ol')[0]

const renderPatterns = (patterns) => {
  patternListElem.innerHTML = ''

  patterns.forEach((pattern) => {
    const link         = document.createElement('A')
    link.className     = 'pattern'
    link.style.height  = '100px'
    link.style.width   = '100px'
    link.style.display = 'block'
    link.innerHTML     = pattern.svg

    const li = document.createElement('LI')
    li.setAttribute('data-key', pattern.name)
    li.appendChild(link)

    const del     = document.createElement('A')
    del.innerHTML = document.getElementById('delete-icon').innerHTML
    del.className = 'delete'
    li.appendChild(del)

    patternListElem.appendChild(li)
  })
}

patternStore$
    .map(hash => Object.values(hash))
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))
    .subscribe(renderPatterns)


// INTENTIONS
const patternsClicks$ = Rx.Observable.fromEvent(patternListElem, 'click')

// INTENTIONS: LOAD
const loadPatternCmd$ = patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className != 'delete')
    .map((link) => link.closest('li'))
    .map(li => li.getAttribute('data-key'))
    .withLatestFrom(patternStore$, function(name, patterns) {
                      return patterns[name]
                    })

loadPatternCmd$
    .map((pattern) => {
           return {pattern, name: 'add pattern'}
         }).subscribe(editorCmdBus$)


// INTENTIONS: DELETE
patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className == 'delete')
    .map((link) => link.closest('li'))
    .map((li) => li.getAttribute('data-key'))
    .map(key => {
           return {name: 'delete', key: key}
         })
    .subscribe(patternStoreBus$)





