/*eslint-env browser */
import Rx, {
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
  PartialObserver,
} from 'rxjs'
import {
  concat,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  share,
  startWith,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators'


/**
 * makeDraggable
 *
 * @param draggableCntr -- element in which to watch for drags
 * @param mapDraggable -- given an element that the mouse is over, return an element that
 *                        is draggable. Return `null` if not draggable.
 * @param mapDropTarget -- given mouse position and the dragged element, return an element that can be dropped on, or null
 * @param createOutlineEl -- create an element that is explicitly sized and can
 *                be used to represent the outline of the object as it is dragged
 * @returns {Observable} of commands reflecting the drag in process
 */
export const ACTION_DRAG_START = 'dragstart',
ACTION_DRAG_MOVE               = 'drag',
ACTION_DRAG_END                = 'dragend'


export function makeDraggable ({
                                 draggableCntr,
                                 mapDraggable,
                                 mapDropTarget,
                                 createOutlineEl,
                               }) {


  const mouseup$   = fromEvent(document, 'mouseup'),
        mousemove$ = fromEvent(document, 'mousemove'),
        mousedown$ = fromEvent(draggableCntr, 'mousedown')

  return mousedown$
    .pipe(
      filter(e => !!mapDraggable(e.target, e)),
      mergeMap(function (e) {
        const el              = mapDraggable(e.target, e),
              start           = { x: e.clientX, y: e.clientY },
              startMs         = (new Date()).getTime(),
              outline         = createOutlineEl(el),
              originalTopLeft = { x: el.getClientRects()[0].left, y: el.getClientRects()[0].top },
              body            = document.getElementsByTagName('BODY')[0]

        body.appendChild(outline)

        function moveOutlineTo (offset) {
          outline.style.left = `${originalTopLeft.x + offset.x}px`
          outline.style.top  = `${originalTopLeft.y + offset.y}px`
        }

        const dragAction$ =
                merge(from([e]), mousemove$)
                  .pipe(
                    map((mme) => {
                      return {
                        name:   ACTION_DRAG_MOVE,
                        dest:   mapDropTarget({
                                                x: mme.clientX,
                                                y: mme.clientY,
                                              }, el),
                        ms:     (new Date()).getTime() - startMs,
                        offset: { x: mme.clientX - start.x, y: mme.clientY - start.y },
                        el,
                        outline,
                      }
                    }),
                    tap(action => moveOutlineTo(action.offset)),
                    distinctUntilChanged(function (a, b) {
                      return a === b ||
                             (a !== null && b !== null && a.offset == b.offset)
                    }))

        const finishAction$ =
                from([{ name: ACTION_DRAG_END }])
                  .pipe(tap(() => outline.parentNode.removeChild(outline)))

        return dragAction$
          .pipe(
            takeUntil(mouseup$),
            concat(finishAction$),
            withLatestFrom(dragAction$, (action, dragAction) => {
              if (action.name !== ACTION_DRAG_END) return action
              return Object.assign({}, dragAction, action)
            }),
            startWith({ name: ACTION_DRAG_START, el: el }),
          )
      }),
      share(),
    )
}
