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

import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {newDeck} from './deck.js'

const renderPattern = function(pattern, cntr) {
  cntr.innerHTML = pattern.svg
}

const patternListCtx$ = new BehaviorSubject({
  domCntr:    document.getElementById('drawer'),
  renderItem: renderPattern
})

const event$ = newDeck(patternListCtx$, patternStore$)

// INTENTIONS
event$
    .do(x => console.log('received event: ', x))
    .filter(x => x.name == 'load')
    .withLatestFrom(patternStore$, (e, patterns) => patterns[e.key])
    .map(pattern => {
           return {pattern, name: 'add pattern'}
         })
    .subscribe(editorCmdBus$)

event$
    .do(x => console.log('received event: ', x))
    .filter(x => x.name == 'delete')
    .subscribe(editorCmdBus$)

