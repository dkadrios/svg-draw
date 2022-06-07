import React, { useLayoutEffect } from 'react'
import type { TLPage, TLPageState } from 'core/types'
import { useTLContext } from './useTLContext'

const useCameraCss = (
  layerRef: React.RefObject<HTMLDivElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  pageState: TLPageState,
  canvas: TLPage['canvas'],
) => {
  const { point, zoom } = pageState.camera
  const { bounds } = useTLContext()
  const { size: cSize } = canvas

  // Zoom
  useLayoutEffect(() => {
    containerRef.current?.style.setProperty('--tl-zoom', String(zoom))
  }, [zoom, containerRef])

  // Zoom / Pan
  useLayoutEffect(() => {
    // Calculate camera shift regarding canvas and viewport:
    // [0, 0] is canvas center coincide with viewport center
    const dx = point[0] + (bounds.width - cSize[0]) / 2
    const dy = point[1] + (bounds.height - cSize[1]) / 2
    // console.log(`scale(${zoom}) translateX(${dx}px) translateY(${dy}px)`)
    layerRef.current?.style.setProperty(
      'transform',
      `scale(${zoom}) translateX(${dx}px) translateY(${dy}px)`,
    )
  }, [zoom, point, layerRef, cSize, bounds])
}
export default useCameraCss
