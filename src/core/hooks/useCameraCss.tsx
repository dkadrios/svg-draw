import React, { useLayoutEffect } from 'react'
import type { TLPageState } from 'core/types'

const useCameraCss = (
  layerRef: React.RefObject<HTMLDivElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  pageState: TLPageState,
) => {
  const { point, zoom } = pageState.camera

  // Zoom
  useLayoutEffect(() => {
    containerRef.current?.style.setProperty('--tl-zoom', String(zoom))
  }, [zoom, containerRef])

  // Zoom / Pan
  useLayoutEffect(() => {
    layerRef.current?.style.setProperty(
      'transform',
      `scale(${zoom}) translateX(${point[0]}px) translateY(${point[1]}px)`,
    )
  }, [zoom, point, layerRef])
}
export default useCameraCss
