/* eslint-disable no-param-reassign */
import React from 'react'
import type { TLPointerEvent } from '../types'
import { useTLContext } from './useTLContext'

const useBoundsEvents = () => {
  const { callbacks, inputs } = useTLContext()

  return React.useMemo(() => ({
    onPointerDown: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      if (e.button === 2) {
        callbacks.onRightPointBounds?.(inputs.pointerDown(e, 'bounds'), e)
        return
      }
      if (e.button !== 0) return
      e.currentTarget?.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, 'bounds')
      callbacks.onPointBounds?.(info, e)
      callbacks.onPointerDown?.(info, e)
    },
    onPointerUp: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (e.button !== 0) return
      inputs.activePointer = undefined
      if (!inputs.pointerIsValid(e)) return
      const isDoubleClick = inputs.isDoubleClick()
      const info = inputs.pointerUp(e, 'bounds')
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
      }
      if (isDoubleClick && !(info.altKey || info.metaKey)) {
        callbacks.onDoubleClickBounds?.(info, e)
      }
      callbacks.onReleaseBounds?.(info, e)
      callbacks.onPointerUp?.(info, e)
    },
    onPointerMove: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragBounds?.(inputs.pointerMove(e, 'bounds'), e)
      }
      const info = inputs.pointerMove(e, 'bounds')
      callbacks.onPointerMove?.(info, e)
    },
    onPointerEnter: (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      callbacks.onHoverBounds?.(inputs.pointerEnter(e, 'bounds'), e)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      callbacks.onUnhoverBounds?.(inputs.pointerEnter(e, 'bounds'), e)
    },
  }), [inputs, callbacks])
}
export default useBoundsEvents
