/* eslint-disable no-param-reassign */
import * as React from 'react'
import type { TLBoundsHandle, TLPointerEvent } from '../types'
import { useTLContext } from './useTLContext'

const useBoundsHandleEvents = (id: TLBoundsHandle) => {
  const { callbacks, inputs } = useTLContext()

  const onPointerDown = React.useCallback(
    (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (e.button !== 0) return
      if (!inputs.pointerIsValid(e)) return
      e.currentTarget?.setPointerCapture(e.pointerId)
      const info = inputs.pointerDown(e, id)
      if (inputs.isDoubleClick() && !(info.altKey || info.metaKey)) {
        callbacks.onDoubleClickBoundsHandle?.(info, e)
      }
      callbacks.onPointBoundsHandle?.(info, e)
      callbacks.onPointerDown?.(info, e)
    },
    [inputs, callbacks, id],
  )

  const onPointerUp = React.useCallback(
    (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (e.button !== 0) return
      if (!inputs.pointerIsValid(e)) return
      const info = inputs.pointerUp(e, id)
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget?.releasePointerCapture(e.pointerId)
      }
      callbacks.onReleaseBoundsHandle?.(info, e)
      callbacks.onPointerUp?.(info, e)
    },
    [inputs, callbacks, id],
  )

  const onPointerMove = React.useCallback(
    (e: TLPointerEvent) => {
      if (e.dead) return
      e.dead = true
      if (!inputs.pointerIsValid(e)) return
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        callbacks.onDragBoundsHandle?.(inputs.pointerMove(e, id), e)
      }
      const info = inputs.pointerMove(e, id)
      callbacks.onPointerMove?.(info, e)
    },
    [inputs, callbacks, id],
  )

  const onPointerEnter = React.useCallback(
    (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      callbacks.onHoverBoundsHandle?.(inputs.pointerEnter(e, id), e)
    },
    [inputs, callbacks, id],
  )

  const onPointerLeave = React.useCallback(
    (e: React.PointerEvent) => {
      if (!inputs.pointerIsValid(e)) return
      callbacks.onUnhoverBoundsHandle?.(inputs.pointerEnter(e, id), e)
    },
    [inputs, callbacks, id],
  )

  return {
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  }
}
export default useBoundsHandleEvents
