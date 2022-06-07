import React, { useCallback, useEffect } from 'react'
import { boundsAreEqual, debounce } from 'utils'
import type { TLBounds } from 'core/types'
import { useTLContext } from './useTLContext'

const useResizeObserver = <T extends Element>(
  ref: React.RefObject<T>,
  onBoundsChange: (bounds: TLBounds) => void,
) => {
  const { bounds, callbacks, inputs } = useTLContext()

  // When the element resizes, update the bounds (stored in inputs)
  // and broadcast via the onBoundsChange callback prop.
  const updateBounds = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect()

    if (rect) {
      const newBounds: TLBounds = {
        minX: rect.left,
        maxX: rect.left + rect.width,
        minY: rect.top,
        maxY: rect.top + rect.height,
        width: rect.width,
        height: rect.height,
      }

      // bounds are equal; skip
      if (boundsAreEqual(bounds, newBounds)) return

      inputs.bounds = newBounds
      onBoundsChange(newBounds)

      callbacks.onBoundsChange?.(newBounds)
    }
  }, [ref, inputs, callbacks, onBoundsChange, bounds])

  useEffect(() => {
    const dUpdateBounds = debounce(updateBounds, 100)

    window.addEventListener('scroll', dUpdateBounds)
    return () => {
      window.removeEventListener('scroll', dUpdateBounds)
    }
  }, [updateBounds])

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        updateBounds()
      }
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref, inputs, updateBounds])
}
export default useResizeObserver
