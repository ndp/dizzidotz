/*eslint-env browser */

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/range'
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/startWith'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Subject} from 'rxjs/Subject'

import {labelLog} from './lib/ndp-software/util.js'
import { patternStoreBus$ } from './pattern-store.js'

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


  /**
   *
   * @param draggableCntr -- element in which to watch for drags
   * @param mapDraggable -- given an element that the mouse is over, return an element that
   *                        is draggable. Return `null` if not draggable.
   * @param isDropable -- given an element that the mouse is over, provide the element
   *                        that could be dropped on. false means drop will do nothing
   * @param createDraggableOutlineElement -- create an element that is explicitly sized and can
   *                be used to represent the outline of the object as it is dragged
   * @returns {Observable} of commands reflecting the drag in process
   */
  const ACTION_START = 'start', ACTION_DRAG = 'drag', ACTION_END = 'end'

  function makeDraggable({draggableCntr,
      mapDraggable, isDropable,
      createDraggableOutlineElement}) {


    const mouseup$   = Observable.fromEvent(document, 'mouseup')
    const mousemove$ = Observable.fromEvent(document, 'mousemove')
    const mousedown$ = Observable.fromEvent(draggableCntr, 'mousedown')

    const mapDropable = function(el) {
      while (el) {
        //console.log('considering...', el)
        if (isDropable(el)) return el
        el = el.parentElement || el.parentNode
      }
      return null
    }


    return mousedown$
        .filter(e => !!mapDraggable(e.target))
        .do(e => e.preventDefault())
        .do(e => e.stopPropagation())
        .mergeMap(function(e) {
                    const el      = mapDraggable(e.target)
                    const start   = {x: e.clientX, y: e.clientY}
                    const outline = createDraggableOutlineElement(el)
                    const body    = document.getElementsByTagName('BODY')[0]
                    body.insertBefore(outline, body.firstChild)

                    function moveOutlineTo(offset) {
                      outline.style.transform = `translate(${offset.x}px, ${offset.y}px)`
                    }

                    function findDest(mme) {
                      //console.log('mme', mme)
                      outline.style.display = 'none'
                      const overEl          = document.elementFromPoint(mme.clientX, mme.clientY)
                      outline.style.display = 'block'
                      if (overEl == outline) console.log('*********')
                      return mapDropable(overEl)
                    }


                    const dragAction$ = mousemove$
                        .map((mme) => {
                               return {
                                 name:   ACTION_DRAG,
                                 dest:   findDest(mme),
                                 offset: {x: mme.clientX - start.x, y: mme.clientY - start.y},
                                         el
                               }
                             })
                        .do(action => moveOutlineTo(action.offset))
                        .distinctUntilChanged(function(a, b) {
                                                return a === b ||
                                                    (a !== null && b !== null && a.offset == b.offset)
                                              })


                    const finishAction$ = Observable
                        .from([{name: ACTION_END}])
                        .do(() => outline.parentNode.removeChild(outline))

                    const action$ = dragAction$
                        .takeUntil(mouseup$)
                        .concat(finishAction$)
                        .withLatestFrom(dragAction$, (action, dragAction)=> {
                                          if (action.name !== ACTION_END) return action
                                          return Object.assign({}, dragAction, action)
                                        })
                        .startWith({name: ACTION_START, el: el})
                    return action$
                  })


  }

  const drag$ = makeDraggable({
    draggableCntr: drawingCtx$.getValue().domCntr,
    mapDraggable(target) {
      const dots = target.closest('[data-key]')
      return (dots && dots.className.match('focus')) ? dots : null
    },
    isDropable(el) {
      return el.id === 'delete-all-btn'
    },
    createDraggableOutlineElement(el) {
      const rect             = el.children[0].children[0].getClientRects()[0]
      const outline          = document.createElement('DIV')
      outline.style.position = 'fixed'
      outline.style.top      = `${rect.top}px`
      outline.style.left     = `${rect.left}px`
      outline.style.width    = `${rect.width}px`
      outline.style.height   = `${rect.height}px`
      outline.appendChild(el.children[0].children[0].cloneNode(true))
      return outline
    },
  })

  drag$.subscribe(labelLog('A'))

  drag$
      .filter(action => action.name == ACTION_DRAG)
    //.do(action => console.log(action.el.getAttribute('data-key')))
      .subscribe(function(action) {
                   action.el.style.display = action.dest ? 'none' : 'block'
                 })

  drag$
      .filter(action => action.name == ACTION_END)
      .filter(action => action.dest !== null)
      .map(function(action) {
             return {
               name: 'delete',
               key:  action.el.getAttribute('data-key')
             }
           })
      .subscribe(patternStoreBus$)

  return event$
}