import React from 'react'
import type {
  TLBounds,
  TLPage,
  TLPageState,
  TLShape,
} from 'core/types'
import { inputs } from 'core/inputs'
import {
  useCameraCss,
  useCanvasEvents,
  useKeyEvents,
  useResizeObserver,
  useZoomEvents,
} from 'core/hooks'
import Page from '../Page'
import Grid from '../Grid'
import Overlay from '../Overlay'

interface CanvasProps<T extends TLShape, M extends Record<string, unknown>> {
  page: TLPage<T>
  pageState: TLPageState
  grid?: number
  hideBounds: boolean
  hideHandles: boolean
  hideIndicators: boolean
  hideResizeHandles: boolean
  hideRotateHandle: boolean
  hideGrid: boolean
  meta?: M
  id?: string
  onBoundsChange: (bounds: TLBounds) => void
}

const Canvas = <T extends TLShape, M extends Record<string, unknown>>({
  id,
  page,
  pageState,
  grid,
  meta,
  hideHandles,
  hideBounds,
  hideIndicators,
  hideResizeHandles,
  hideRotateHandle,
  hideGrid,
  onBoundsChange,
}: CanvasProps<T, M>) => {
  const rContainer = React.useRef<HTMLDivElement>(null)
  const rLayer = React.useRef<HTMLDivElement>(null)

  inputs.zoom = pageState.camera.zoom

  useResizeObserver(rContainer, onBoundsChange)
  useZoomEvents(rContainer)
  useCameraCss(rLayer, rContainer, pageState)
  useKeyEvents()

  const events = useCanvasEvents()

  return (
    <div
      className="tl-container"
      id={id}
      ref={rContainer}
    >
      {!hideGrid && grid && (
        <Grid
          camera={pageState.camera}
          grid={grid}
        />
      )}
      <div
        className="tl-absolute tl-layer"
        ref={rLayer}
      >
        <div
          className="tl-positioned tl-absolute tl-canvas"
          id="canvas"
          style={{
            width: page.canvas.size[0],
            height: page.canvas.size[1],
            backgroundImage: `url(${page.canvas.src})` || 'none',
            pointerEvents: 'all',
          }}
          {...events}
        >
          <Page
            hideBounds={hideBounds}
            hideHandles={hideHandles}
            hideIndicators={hideIndicators}
            hideResizeHandles={hideResizeHandles}
            hideRotateHandle={hideRotateHandle}
            meta={meta}
            page={page}
            pageState={pageState}
          />
        </div>
      </div>
      <Overlay camera={pageState.camera} />
    </div>
  )
}
export default Canvas
