/*eslint-env browser */
import { patternStore$ } from './pattern-store.js'
import { editorCmdBus$ } from './editor.js'

import { newDeck }         from './deck.js'
import {
  BehaviorSubject,
  filter,
  map,
  tap,
  withLatestFrom
}             from 'rxjs'

const renderPattern = function (pattern, cntr) {
  cntr.innerHTML = pattern.svg
}

const patternListCtx$ = new BehaviorSubject({
                                              domCntr:    document.getElementById('drawer'),
                                              renderItem: renderPattern
                                            })

const event$ = newDeck(patternListCtx$, patternStore$)

// INTENTIONS
event$
  .pipe(
    tap(x => console.log('received event: ', x)),
    filter(x => x.name === 'load'),
    withLatestFrom(patternStore$, (e, patterns) => patterns[e.key]),
    map(pattern => {
      return { pattern, name: 'add pattern' }
    })
  )
  .subscribe(editorCmdBus$)

event$
  .pipe(
    tap(x => console.log('received event: ', x)),
    filter(x => x.name === 'delete')
  )
  .subscribe(editorCmdBus$)

