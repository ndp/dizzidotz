/*eslint-env browser */

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/operator/combineLatest'
//import {newCmdBus$, logCmdBus} from './lib/ndp-software/rx-dux/cmdBus.js'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Subject} from 'rxjs/Subject'



export function newDeck(drawingCtx$, model$) {

  // MODEL
  const focus$ = new BehaviorSubject(null)
  const state$ = focus$
      .combineLatest(model$, function(focus, model) {
                       return {focus, model}
                     })
  const event$ = new Subject()

  // VIEW
  state$
      .combineLatest(drawingCtx$, function(state, drawingCtx) {
                       return {state, drawingCtx}
                     })
      .subscribe(function({state, drawingCtx}) {
                   //console.log('state', state)
                   //console.log('drawingCtx', drawingCtx)
                   drawingCtx.domCntr.innerHTML = ''
                   const listEl                 = document.createElement('UL')
                   listEl.className             = 'deck'
                   listEl.style.height          = '100%'
                   listEl.style.width           = '100%'
                   listEl.style.display         = 'block'
                   const list                   = Object.values(state.model).sort((a, b) => b.timestamp - a.timestamp)
                   //console.log('list', list)
                   list.forEach(m => {
                     const itemEl = document.createElement('LI')
                     itemEl.setAttribute('data-key', m.key)
                     if (state.focus == m || state.focus == m.key) {
                       itemEl.className = 'focus'
                     } else {
                       itemEl.style.height = `${80.0 / list.length}%`
                     }
                     listEl.appendChild(itemEl)

                     const itemCntrEl        = document.createElement('DIV')
                     itemCntrEl.style.height = '100px'
                     itemCntrEl.style.width  = '100px'
                     itemEl.appendChild(itemCntrEl)

                     drawingCtx.renderItem(m, itemCntrEl)
                   })
                   drawingCtx.domCntr.appendChild(listEl)
                 })

  event$
      .filter(e => e.name == 'focus')
      .subscribe(function(e) {
                   focus$.next(e.key)
                 })

  // INTENT
  const itemClick$ = Observable
      .fromEvent(drawingCtx$.getValue().domCntr, 'click')
      .do(e => e.preventDefault())
      .map(e => e.target)
      .map(el => el.closest('[data-key]'))
      .filter(key => key)

  // swipe => focus


  // click on focused => send event select
  itemClick$
      .filter(x => x.className.match('focus'))
      .map(x => x.getAttribute('data-key'))
      .map(function(key) {
             return {name: 'load', key}
           })
      .subscribe(event$)

  // click on unfocused => focus
  itemClick$
      .filter(x => !x.className.match('focus'))
      .map(x => x.getAttribute('data-key'))
      .subscribe(x => focus$.next(x))

  return event$
}