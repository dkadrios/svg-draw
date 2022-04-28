import * as React from 'react'
import {
  useCameraCss,
  useCanvasEvents,
  useKeyEvents,
  usePerformanceCss,
  usePreventNavigationCss,
  useResizeObserver,
} from '../../hooks'
import type {
  TLBounds,
  TLPage,
  TLPageState,
  TLPerformanceMode,
  TLShape,
} from '../../types'
import Page from '../Page'
import { inputs } from '../../inputs'
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
  performanceMode?: TLPerformanceMode
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
  performanceMode,
  hideHandles,
  hideBounds,
  hideIndicators,
  hideResizeHandles,
  hideRotateHandle,
  hideGrid,
  onBoundsChange,
}: CanvasProps<T, M>) => {
  const rCanvas = React.useRef<HTMLDivElement>(null)
  const rContainer = React.useRef<HTMLDivElement>(null)
  const rLayer = React.useRef<HTMLDivElement>(null)

  inputs.zoom = pageState.camera.zoom

  useResizeObserver(rCanvas, onBoundsChange)

  usePreventNavigationCss(rCanvas)

  useCameraCss(rLayer, rContainer, pageState)

  usePerformanceCss(performanceMode, rContainer)

  useKeyEvents()

  const events = useCanvasEvents()

  return (
    <div
      className="tl-container"
      id={id}
      ref={rContainer}
    >
      <div
        className="tl-absolute tl-canvas"
        id="canvas"
        ref={rCanvas}
        {...events}
      >
        {!hideGrid && grid && (
          <Grid
            camera={pageState.camera}
            grid={grid}
          />
        )}
        <div
          className="tl-absolute tl-layer"
          data-testid="layer"
          ref={rLayer}
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
        <Overlay camera={pageState.camera} />
      </div>
    </div>
  )
}
export default Canvas
