import { RefObject, useCallback, useEffect, useRef } from 'react'
import { isEqual, len } from 'utils/vec'
import { clamp } from 'utils'
import type { WebKitGestureEvent } from '../types'
import { useTLContext } from './useTLContext'

const noop = () => undefined

const DELTA_LINE_MULTIPLIER = 8
const DELTA_PAGE_MULTIPLIER = 24
const MAX_WHEEL_DELTA = 32

const midpoint = (touches: TouchList) => {
  const [t1, t2] = Array.from(touches)
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}

const distance = (touches: TouchList) => {
  const [t1, t2] = Array.from(touches)
  return len([t2.clientX - t1.clientX, t2.clientY - t1.clientY])
}

const normalizeWheel = (e: WheelEvent) => {
  let dx = e.deltaX
  let dy = e.deltaY
  if (e.shiftKey && dx === 0) {
    [dx, dy] = [dy, dx]
  }
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    dx *= DELTA_LINE_MULTIPLIER
    dy *= DELTA_LINE_MULTIPLIER
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    dx *= DELTA_PAGE_MULTIPLIER
    dy *= DELTA_PAGE_MULTIPLIER
  }
  return [
    clamp(dx, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA),
    clamp(dy, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA),
  ]
}

const useWheel = <T extends HTMLElement>(ref: RefObject<T>) => {
  const { callbacks, inputs } = useTLContext()

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = normalizeWheel(e)

    // alt+scroll or ctrl+scroll = zoom
    if ((e.altKey || e.ctrlKey || e.metaKey) && e.buttons === 0) {
      const info = inputs.panzoom([0, 0, delta[1] / 700], e)
      callbacks.onZoom?.(info, e)
      return
    }

    // otherwise pan
    if (isEqual(delta, [0, 0])) return
    const info = inputs.panzoom(delta, e)
    callbacks.onPan?.(info, e)
  }, [callbacks, inputs])

  useEffect(() => {
    const el = ref.current
    if (!el) return noop
    el.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [ref, handleWheel])
}

const useTouch = <T extends HTMLElement>(ref: RefObject<T>) => {
  const { callbacks, inputs } = useTLContext()

  const initialTouches = useRef<TouchList | null>(null)
  const touchStart = (e: TouchEvent) => {
    if (e.touches.length !== 2) return
    initialTouches.current = e.touches
    e.preventDefault()
  }

  const touchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2 || !initialTouches.current) return

    const mpInit = midpoint(initialTouches.current)
    const mpCurr = midpoint(e.touches)
    const scale = distance(e.touches) / distance(initialTouches.current)

    const delta = [
      mpCurr.x - mpInit.x,
      mpCurr.y - mpInit.y,
      scale,
    ]
    const info = inputs.panzoom(delta, e)
    callbacks.onZoom?.(info, e)

    e.preventDefault()
  }, [callbacks, inputs])

  const touchEnd = (e: TouchEvent) => {
    initialTouches.current = null
    e.preventDefault()
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return noop
    el.addEventListener('touchstart', touchStart, { passive: false })
    el.addEventListener('touchmove', touchMove, { passive: false })
    el.addEventListener('touchend', touchEnd, { passive: false })
    el.addEventListener('touchcancel', touchEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', touchStart)
      el.removeEventListener('touchmove', touchMove)
      el.removeEventListener('touchend', touchEnd)
      el.removeEventListener('touchcancel', touchEnd)
    }
  }, [ref, touchMove])
}

const useGesture = (ref: RefObject<HTMLElement>) => {
  const { callbacks, inputs } = useTLContext()
  const prevScale = useRef(1)

  const handleGesture = useCallback((e: WebKitGestureEvent) => {
    const scale = -(e.scale / prevScale.current - 1) / 2

    const info = inputs.panzoom([0, 0, scale], e)
    callbacks.onZoom?.(info, e)
    prevScale.current = e.scale
    e.preventDefault()
  }, [callbacks, inputs])

  const endGesture = useCallback((e: WebKitGestureEvent) => {
    handleGesture(e)
    prevScale.current = 1
  }, [handleGesture])

  useEffect(() => {
    const el = ref.current
    if (!el) return noop
    // Only allow gestures on desktop Safari
    // @ts-ignore
    if (!window.GestureEvent || window.TouchEvent) return noop
    // @ts-ignore
    el.addEventListener('gesturestart', handleGesture, { passive: false })
    // @ts-ignore
    el.addEventListener('gesturechange', handleGesture, { passive: false })
    // @ts-ignore
    el.addEventListener('gestureend', endGesture, { passive: false })

    return () => {
      // @ts-ignore
      el.removeEventListener('gesturestart', handleGesture)
      // @ts-ignore
      el.removeEventListener('gesturechange', handleGesture)
      // @ts-ignore
      el.removeEventListener('gestureend', endGesture)
    }
  }, [ref, handleGesture, endGesture])
}

export default function useZoomEvents(ref: RefObject<HTMLElement>) {
  useWheel(ref)
  useTouch(ref)
  useGesture(ref)
}
