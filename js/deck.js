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
  function findOrCreateListEl(domCntr) {
    let listEl = domCntr.getElementsByClassName('deck')[0]
    if (!listEl) {
      listEl           = document.createElement('UL')
      listEl.className = 'deck'
      domCntr.appendChild(listEl)
    }
    return listEl
  }

  function findOrCreateListItem(model, numItems, listEl) {
    let itemCntrEl = null,
        itemEl     = document.querySelector(`[data-key='${model.key}']`)
    if (!itemEl) {
      itemEl = document.createElement('LI')
      itemEl.setAttribute('data-key', model.key)
      listEl.appendChild(itemEl)


      itemCntrEl = document.createElement('DIV')
      itemEl.appendChild(itemCntrEl)

      appendNameSpan(model.name, itemEl)

    } else {
      itemCntrEl = itemEl.children[0]
    }

    itemEl.className = model.focused ? 'focus' : ''
    return itemCntrEl
  }

  function appendNameSpan(name, cntrEl) {
    const nameEl     = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    nameEl.setAttributeNS('xmlns', 'xlink', 'http://www.w3.org/1999/xlink')
    nameEl.setAttribute('version', '1.1')
    nameEl.setAttribute('x', '0px')
    nameEl.setAttribute('y', '0px')
    nameEl.setAttribute('class', 'name')
    nameEl.setAttribute('viewBox', '0 0 300 300')
    nameEl.setAttribute('enable-background', 'new 0 0 300 300')
    nameEl.innerHTML = `
    <defs>
        <path id="name-circle-path" d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0 "/>
    </defs>
    <g>
        <use xlink:href="#name-circle-path" fill="none"/>
        <text>
            <textPath xlink:href="#name-circle-path">${name}</textPath>
        </text>
    </g>`
    cntrEl.appendChild(nameEl)
  }


  state$
      .combineLatest(drawingCtx$, function(state, drawingCtx) {
                       return {state, drawingCtx}
                     })
      .subscribe(function({state, drawingCtx}) {
                   //console.log('state', state)
                   //console.log('drawingCtx', drawingCtx)
                   if (state.model.length == 0) {
                     drawingCtx.domCntr.innerHTML = ''
                   }
                   var listEl = findOrCreateListEl(drawingCtx.domCntr)

                   const list = Object.values(state.model).sort((a, b) => b.timestamp - a.timestamp)
                   list.forEach(model => {
                     const m        = Object.assign({}, model, {focused: state.focus == model || state.focus == model.key})
                     var itemCntrEl = findOrCreateListItem(m, list.length, listEl)
                     drawingCtx.renderItem(model, itemCntrEl)
                   })
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