/* eslint-disable no-param-reassign */
import React from 'react'
import type { TLPointerEvent } from '../types'
import { useTLContext } from './useTLContext'

const useHandleEvents = (id: string) => {
  const { callbacks, inputs } = useTLContext()

  return React.useMemo(() => ({
    onPointerDown: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      if (e.button !== 0) return
      if (!inputs.pointerIsValid(e)) return
      e.currentTarget?.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, id)
      callbacks.onPointHandle?.(info, e)
      callbacks.onPointerDown?.(info, e)
    },
    onPointerUp: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (e.button !== 0) return
      if (!inputs.pointerIsValid(e)) return
      const isDoubleClick = inputs.isDoubleClick()
      const info = inputs.pointerUp(e, id)
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
        if (isDoubleClick && !(info.altKey || info.metaKey)) {
          callbacks.onDoubleClickHandle?.(info, e)
        }
        callbacks.onReleaseHandle?.(info, e)
      }
      callbacks.onPointerUp?.(info, e)
    },
    onPointerMove: (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      const info = inputs.pointerMove(e, id)
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragHandle?.(info, e)
      }
      callbacks.onPointerMove?.(info, e)
    },
    onPointerEnter: (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      const info = inputs.pointerEnter(e, id)
      callbacks.onHoverHandle?.(info, e)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      const info = inputs.pointerEnter(e, id)
      callbacks.onUnhoverHandle?.(info, e)
    },
  }), [inputs, callbacks, id])
}
export default useHandleEvents
