/*eslint-env browser */

import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import Rx, {
  combineLatest,
  Observable,
  Subject,
  asapScheduler,
  pipe,
  of,
  from,
  interval,
  merge,
  fromEvent,
  SubscriptionLike,
  Scheduler,
  PartialObserver,
}                          from 'rxjs'

import {
  debounceTime,
  delay,
  filter,
  tap,
  map,
  mapTo,
  throttleTime,
} from 'rxjs/operators'

import { ptInRect, ptInInscribedCircle } from './lib/ndp-software/util.js'

import {
  makeDraggable,
  ACTION_DRAG_START,
  ACTION_DRAG_MOVE,
  ACTION_DRAG_END
} from './draggable'

//  returns events
export function newDeck(drawingCtx$, model$) {

  // MODEL
  const focus$ = new BehaviorSubject(null)
  const state$ = combineLatest(focus$, model$, (focus, model)  => ({focus, model}))
  const event$ = new Subject() // events we are returning, with 'load', 'delete', 'focus'

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
    if (itemEl) {
      itemCntrEl = itemEl.children[0]
    } else {
      itemEl = document.createElement('LI')
      itemEl.setAttribute('data-key', model.key)
      listEl.insertBefore(itemEl, precedingItemEl)

      itemCntrEl = document.createElement('DIV')
      itemEl.appendChild(itemCntrEl)

      appendNameSpan(model.name, itemEl)
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


    combineLatest(
      state$,
      drawingCtx$,
      (state, drawingCtx)  => ({state, drawingCtx}))
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
    .pipe(
      filter(e => e.name == 'focus'),
      map(e => e.key)
    )
    .subscribe(focus$)


  function deleteAllButtonEl() {
    return document.getElementById('delete-all-btn')
  }

  const editorEl = () => document.getElementById('editor')

  const drag$ = makeDraggable({

    draggableCntr: drawingCtx$.getValue().domCntr,

    mapDraggable(target, e) {
      const lis = [...drawingCtx$.getValue().domCntr.getElementsByTagName('li')].reverse()
      for (const li of lis) {
        const rect = li.children[0].getClientRects()[0]
        if (rect && ptInInscribedCircle({x: e.clientX, y: e.clientY}, rect)) {
          return li
        }
      }
      return null
    },

    mapDropTarget(pos, draggedEl) {
      const key = draggedEl.getAttribute('data-key')
      if (!key.match(/^template/)) {
        const el     = deleteAllButtonEl()
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
    .pipe(filter(action => action.name == ACTION_DRAG_START))
    .subscribe(() => deleteAllButtonEl().classList.add('drop-target'))

  // Remove 'delete all' drop as drop target.
  drag$
    .pipe(filter(action => action.name == ACTION_DRAG_END))
    .subscribe(() => deleteAllButtonEl().classList.remove('drop-target'))

  // Highlight hovered 'delete all' button
  drag$
    .pipe(filter(action => action.name == ACTION_DRAG_MOVE))
    .subscribe(function(action) {
                 if (action.dest == deleteAllButtonEl()) {
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
    .pipe(filter(action => action.name == ACTION_DRAG_MOVE))
    .subscribe(action => action.el.style.display = (action.dest == deleteAllButtonEl()) ? 'none' : 'block')

  // Trigger the actual delete.
  drag$
    .pipe(filter(action => action.name == ACTION_DRAG_END),
          filter(action => action.dest == deleteAllButtonEl()),
          map(action => ({ name: 'delete', key: action.el.getAttribute('data-key') }))
    )
    .subscribe(event$)

  // Provide drag feedback over the editor
  drag$.pipe(filter(action => action.name == ACTION_DRAG_MOVE))
    .subscribe(action => editorEl().classList.toggle('drop-target', editorEl() == action.dest))

  drag$.pipe(filter(action => action.name == ACTION_DRAG_END))
    .subscribe(() =>  editorEl().classList.remove('drop-target'))

  // Trigger the load of the pattern on drag
  drag$
    .pipe(
      filter(action => action.name == ACTION_DRAG_END),
      filter(action => action.dest == editorEl()),
      map(action => {
        return {
          name: 'load',
          key:  action.el.getAttribute('data-key'),
        }
      })
    )
    .subscribe(event$)

  // Detect simple click to load a pattern
  const itemClick$ = drag$
    .pipe(filter(action => action.name == ACTION_DRAG_END),
          filter(action => action.ms < 400),
          filter(action => (Math.abs(action.offset.x) + Math.abs(action.offset.y)) < 5),
          map(action => action.el)
    )

  itemClick$
    .pipe(
      filter(el => el.classList.contains('focus')),
      map(el => el.getAttribute('data-key')),
      map(key => ({ name: 'load', key }))
    )
    .subscribe(event$)

  itemClick$
    .pipe(
      filter(el => !el.classList.contains('focus')),
      map(x => ({ name: 'focus', key: x.getAttribute('data-key') }))
    )
    .subscribe(event$)

  return event$
}
