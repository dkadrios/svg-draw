/* eslint-disable no-param-reassign */
import React from 'react'
import type { TLPointerEvent } from '../types'
import { useTLContext } from './useTLContext'

const useCanvasEvents = () => {
  const { callbacks, inputs } = useTLContext()

  return React.useMemo(() => ({
    onPointerDown: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      if (e.button !== 0 && e.button !== 1) return
      if (!inputs.pointerIsValid(e)) return
      e.currentTarget.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, 'canvas')
      if (e.button === 0 || e.button === 1) {
        callbacks.onPointCanvas?.(info, e)
        callbacks.onPointerDown?.(info, e)
      }
    },
    onPointerMove: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      const info = inputs.pointerMove(e, 'canvas')
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragCanvas?.(info, e)
      }
      callbacks.onPointerMove?.(info, e)
    },
    onPointerUp: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (e.button !== 0 && e.button !== 1) return
      inputs.activePointer = undefined
      if (!inputs.pointerIsValid(e)) return
      const isDoubleClick = inputs.isDoubleClick()
      const info = inputs.pointerUp(e, 'canvas')
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
      }
      if (isDoubleClick && !(info.altKey || info.metaKey)) {
        callbacks.onDoubleClickCanvas?.(info, e)
      }
      callbacks.onReleaseCanvas?.(info, e)
      callbacks.onPointerUp?.(info, e)
    },
    onDrop: callbacks.onDrop,
    onDragOver: callbacks.onDragOver,
  }), [callbacks, inputs])
}
export default useCanvasEvents
