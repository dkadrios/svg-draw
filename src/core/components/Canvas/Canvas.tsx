import React, { useEffect } from 'react'
import type {
  TLMeta,
  TLPage,
  TLPageState,
  TLShape,
} from 'core/types'
import {
  useCameraCss,
  useCanvasEvents,
  useKeyEvents,
  useTLContext,
  useZoomEvents,
} from 'core/hooks'
import Page from '../Page'
import Grid from '../Grid'
import Overlay from '../Overlay'

interface CanvasProps<T extends TLShape, M extends TLMeta> {
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
}

const Canvas = <T extends TLShape, M extends TLMeta>({
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
}: CanvasProps<T, M>) => {
  const rContainer = React.useRef<HTMLDivElement>(null)
  const rLayer = React.useRef<HTMLDivElement>(null)
  const { inputs } = useTLContext()

  useEffect(() => {
    inputs.rContainer = rContainer.current
  }, [rContainer, inputs])

  inputs.zoom = pageState.camera.zoom

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
          style={{
            width: page.canvas.size[0],
            height: page.canvas.size[1],
            backgroundImage: page.canvas.src ? `url(${page.canvas.src})` : 'none',
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
