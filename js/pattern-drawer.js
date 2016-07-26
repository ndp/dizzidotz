/*eslint-env browser */

import {Observable} from 'rxjs/Observable'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/withLatestFrom'


import { patternStore$ } from './pattern-store.js'
import { patternStoreBus$ } from './pattern-store.js'
import { editorCmdBus$ } from './editor.js'

// VIEWS
const DELETE_PATTERN_CLASS_NAME = 'delete-pattern'

const patternListElem = document.getElementsByTagName('ol')[0]

const renderPatterns = (patterns) => {
  patternListElem.innerHTML = ''

  patterns.forEach((pattern) => {
    const link         = document.createElement('A')
    link.className     = 'pattern'
    link.style.height  = '100px'
    link.style.width   = '100px'
    link.style.display = 'block'
    if (pattern.svg)    link.innerHTML     = pattern.svg

    const li = document.createElement('LI')
    li.setAttribute('data-key', pattern.key)

    const del     = document.createElement('A')
    del.innerHTML = document.getElementById('delete-icon').innerHTML
    del.className = DELETE_PATTERN_CLASS_NAME

    const name     = document.createElement('span')
    name.className = 'name'
    name.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="200px" height="200px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" stroke-widt="0">
    <defs>
        <path id="criclePath" d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0 "/>
    </defs>
    <g>
        <use xlink:href="#criclePath" fill="none"/>
        <text fill="#fff" >
            <textPath xlink:href="#criclePath">${pattern.name}</textPath>
        </text>
    </g>
</svg>`
    li.appendChild(name)
    if (!pattern.key.match(/^template/)) {
      li.appendChild(del)
    }
    li.appendChild(link)

    patternListElem.appendChild(li)
  })
}

patternStore$
    .map(hash => Object.values(hash))
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))
    .subscribe(renderPatterns)


// INTENTIONS
const patternsClicks$ = Observable
    .fromEvent(patternListElem, 'click')
    .do(e => e.preventDefault())

// INTENTIONS: LOAD
patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter(link => link && link.className != DELETE_PATTERN_CLASS_NAME)
    .map(link => link.closest('li'))
    .map(li => li.getAttribute('data-key'))
    .withLatestFrom(patternStore$, (key, patterns) => patterns[key])
    .map(pattern => {
           return {pattern, name: 'add pattern'}
         })
    .subscribe(editorCmdBus$)


// INTENTIONS: DELETE
patternsClicks$
    .map((e) => e.target.closest('a'))
    .filter((link) => link && link.className == DELETE_PATTERN_CLASS_NAME)
    .map((link) => link.closest('li'))
    .map((li) => li.getAttribute('data-key'))
    .map(key => {
           return {name: 'delete', key: key}
         })
    .subscribe(patternStoreBus$)





