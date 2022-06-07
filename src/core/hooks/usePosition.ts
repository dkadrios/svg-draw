import { useLayoutEffect, useRef } from 'react'
import type { TLBounds } from 'core/types'

const usePosition = (bounds: TLBounds, rotation = 0) => {
  const rBounds = useRef<HTMLDivElement>(null)

  // Update the transform
  useLayoutEffect(() => {
    if (!rBounds.current) return
    const elm = rBounds.current
    const transform = `
      translate(
        calc(${bounds.minX}px - var(--tl-padding)),
        calc(${bounds.minY}px - var(--tl-padding))
      )
      rotate(${rotation + (bounds.rotation || 0)}rad)`
    elm.style.setProperty('transform', transform)
    elm.style.setProperty(
      'width',
      `calc(${Math.floor(bounds.width)}px + (var(--tl-padding) * 2))`,
    )
    elm.style.setProperty(
      'height',
      `calc(${Math.floor(bounds.height)}px + (var(--tl-padding) * 2))`,
    )
  }, [bounds, rotation])

  return rBounds
}
export default usePosition
