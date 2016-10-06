/*eslint-env browser */

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/range'
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/bufferCount'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/buffer'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'

import { ptInRect, ptInInscribedCircle } from './lib/ndp-software/util.js'

import {
  makeDraggable,
  ACTION_DRAG_START,
  ACTION_DRAG_MOVE,
  ACTION_DRAG_END
} from './draggable'

export function newDeck(drawingCtx$, model$) {

  // MODEL
  const focus$ = new BehaviorSubject(null)
  const state$ = focus$
    .combineLatest(model$, (focus, model)  => ({focus, model}))
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

  function findOrCreateListItem(model, listEl, precedingItemEl) {
    let itemCntrEl = null,
        itemEl     = document.querySelector(`[data-key='${model.key}']`)
    if (!itemEl) {
      itemEl = document.createElement('LI')
      itemEl.setAttribute('data-key', model.key)
      listEl.insertBefore(itemEl, precedingItemEl)

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
    .combineLatest(drawingCtx$, (state, drawingCtx)  => ({state, drawingCtx}))
    .subscribe(function({state, drawingCtx}) {
                 if (state.model.length == 0) {
                   drawingCtx.domCntr.innerHTML = ''
                 }
                 var listEl = findOrCreateListEl(drawingCtx.domCntr)

                 const list          = Object.values(state.model).sort((a, b) => b.timestamp - a.timestamp)
                 let precedingItemEl = null
                 list.forEach(model => {
                   const m          = Object.assign({}, model, {focused: state.focus == model || state.focus == model.key})
                   const itemCntrEl = findOrCreateListItem(m, listEl, precedingItemEl ? precedingItemEl.parentNode : null)
                   drawingCtx.renderItem(model, itemCntrEl)
                   precedingItemEl  = itemCntrEl
                 })
               })

  event$
    .filter(e => e.name == 'focus')
    .subscribe(function(e) {
                 focus$.next(e.key)
               })


  function deleteAllButton() {
    return document.getElementById('delete-all-btn')
  }

  const editorEl = () => document.getElementById('editor')

  const drag$ = makeDraggable({

    draggableCntr: drawingCtx$.getValue().domCntr,

    mapDraggable(target, e) {
      const div = target.closest('[data-key]').children[0]
      if (!div) return null

      const rect = div.getClientRects()[0]

      // Make sure it's actually on the pattern
      if (!ptInInscribedCircle({x: e.clientX, y: e.clientY}, rect))
        return null
      return target.closest('[data-key]')
    },

    mapDropTarget(pos, draggedEl) {
      const key = draggedEl.getAttribute('data-key')
      if (!key.match(/^template/)) {
        const el     = deleteAllButton()
        const bounds = el.getBoundingClientRect()
        if (ptInRect(pos, bounds)) return el
      }

      const editor = editorEl()
      if (ptInInscribedCircle(pos, editor.getBoundingClientRect())) return editor

      return null
    },

    createOutlineEl(el) {
      const rect             = el.children[0].children[0].getClientRects()[0]
      const outline          = document.createElement('DIV')
      outline.style.position = 'fixed'
      outline.style.top      = `${rect.top}px`
      outline.style.left     = `${rect.left}px`
      outline.style.width    = `${rect.width}px`
      outline.style.height   = `${rect.height}px`
      outline.appendChild(el.children[0].children[0].cloneNode(true))
      return outline
    }
  })


  // Draw 'delete all' button as a drop target.
  drag$
    .filter(action => action.name == ACTION_DRAG_START)
    .subscribe(() => deleteAllButton().classList.add('drop-target'))

  // Remove 'delete all' drop as drop target.
  drag$
    .filter(action => action.name == ACTION_DRAG_END)
    .subscribe(() => deleteAllButton().classList.remove('drop-target'))

  // Highlight hovered 'delete all' button
  drag$
    .filter(action => action.name == ACTION_DRAG_MOVE)
    .subscribe(function(action) {
                 if (action.dest == deleteAllButton()) {
                   action.outline.style.transition   = 'opacity 0.4'
                   action.outline.style.opacity      = 0.3
                   action.outline.style['transform'] = 'scale(.5,.5)'
                 } else {
                   action.outline.style.opacity      = 1
                   action.outline.style['transform'] = ''
                 }
               })

  // Drag over 'delete all' button previews deleting pattern.
  drag$
    .filter(action => action.name == ACTION_DRAG_MOVE)
    .subscribe(action => action.el.style.display = (action.dest == deleteAllButton()) ? 'none' : 'block')

  // Trigger the actual delete.
  drag$
    .filter(action => action.name == ACTION_DRAG_END)
    .filter(action => action.dest == deleteAllButton())
    .map(action => ({name: 'delete', key: action.el.getAttribute('data-key')}))
    .subscribe(event$)

  // Provide drag feedback over the editor
  drag$.filter(action => action.name == ACTION_DRAG_MOVE)
    .subscribe(action => editorEl().classList.toggle('drop-target', editorEl() == action.dest))

  drag$.filter(action => action.name == ACTION_DRAG_END)
    .subscribe(() =>  editorEl().classList.remove('drop-target'))

  // Trigger the load of the pattern on drag
  drag$
    .filter(action => action.name == ACTION_DRAG_END)
    .filter(action => action.dest == editorEl())
    .map(action => {
           return {
             name: 'load',
             key:  action.el.getAttribute('data-key')
           }
         })
    .subscribe(event$)

  // Detect simple click to load a pattern
  const itemClick$ = drag$
    .filter(action => action.name == ACTION_DRAG_END)
    .filter(action => action.ms < 400)
    .filter(action => (Math.abs(action.offset.x) + Math.abs(action.offset.y)) < 5)
    .map(action => action.el)

  itemClick$
    .filter(el => el.classList.contains('focus'))
    .map(el => el.getAttribute('data-key'))
    .map(key => ({name: 'load', key}))
    .subscribe(event$)

  itemClick$
    .filter(el => !el.classList.contains('focus'))
    .map(x => x.getAttribute('data-key'))
    .subscribe(x => focus$.next(x))

  return event$
}