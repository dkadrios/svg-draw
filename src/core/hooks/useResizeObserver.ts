import * as React from 'react'
import { debounce } from '../../utils'
import type { TLBounds } from '../types'
import { useTLContext } from './useTLContext'

const useResizeObserver = <T extends Element>(
  ref: React.RefObject<T>,
  onBoundsChange: (bounds: TLBounds) => void,
) => {
  const { callbacks, inputs } = useTLContext()

  const rIsMounted = React.useRef(false)

  // When the element resizes, update the bounds (stored in inputs)
  // and broadcast via the onBoundsChange callback prop.
  const updateBounds = React.useCallback(() => {
    if (rIsMounted.current) {
      const rect = ref.current?.getBoundingClientRect()

      if (rect) {
        const bounds: TLBounds = {
          minX: rect.left,
          maxX: rect.left + rect.width,
          minY: rect.top,
          maxY: rect.top + rect.height,
          width: rect.width,
          height: rect.height,
        }

        inputs.bounds = bounds

        onBoundsChange(bounds)

        callbacks.onBoundsChange?.(bounds)
      }
    } else {
      // Skip the first mount
      rIsMounted.current = true
    }
  }, [ref, inputs, callbacks.onBoundsChange])

  React.useEffect(() => {
    const debouncedupdateBounds = debounce(updateBounds, 100)
    window.addEventListener('scroll', debouncedupdateBounds)
    window.addEventListener('resize', debouncedupdateBounds)
    return () => {
      window.removeEventListener('scroll', debouncedupdateBounds)
      window.removeEventListener('resize', debouncedupdateBounds)
    }
  }, [])

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (inputs.isPinching) {
        return
      }

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
  }, [ref, inputs])

  React.useEffect(() => {
    updateBounds()
  }, [ref])
}
export default useResizeObserver
