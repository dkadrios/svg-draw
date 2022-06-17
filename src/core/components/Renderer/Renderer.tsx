import React, { useEffect, useRef, useState } from 'react'
import type {
  TLBounds,
  TLCallbacks,
  TLMeta,
  TLPage,
  TLPageState,
  TLShape,
  TLTheme,
} from 'core/types'
import Inputs from 'core/inputs'
import { TLContext, TLContextType, useTLTheme } from 'core/hooks'
import type { TLShapeUtilsMap } from 'core/TLShapeUtil'
import Canvas from '../Canvas'

export interface RendererProps<T extends TLShape, M extends TLMeta> extends Partial<TLCallbacks> {
  // An object containing instances of your shape classes
  shapeUtils: TLShapeUtilsMap<T>

  // Current page, containing shapes
  page: TLPage<T>

  // Current page state
  pageState: TLPageState

  // (optional) Unique id to be applied to the renderer element, used to scope styles
  id?: string

  // (optional) An object of custom options that should be passed to rendered shapes
  meta?: M

  // (optional) An object of custom theme colors
  theme?: Partial<TLTheme>

  // (optional) When true, the renderer will not show the bounds for selected objects
  hideBounds?: boolean

  // (optional) When true, the renderer will not show the handles of shapes with handles
  hideHandles?: boolean

  // (optional) When true, the renderer will not show resize handles for selected objects
  hideResizeHandles?: boolean

  // (optional) When true, the renderer will not show rotate handles for selected objects
  hideRotateHandles?: boolean

  // (optional) When true, the renderer will not show indicators for selected or hovered shapes
  hideIndicators?: boolean

  // (optional) When true, the renderer will not show the grid
  hideGrid?: boolean

  // (optional) The size of the grid step
  grid?: number

  // (optional) A callback that is fired when the editor's client bounding box changes
  onBoundsChange?: (bounds: TLBounds) => void
}

/**
 * The Renderer component is the main component of the library. It
 * accepts the current `page`, the `shapeUtils` needed to interpret
 * and render the shapes on the `page`, and the current pageState.
 */
const Renderer = <T extends TLShape, M extends TLMeta>({
  id = 'tl',
  shapeUtils,
  page,
  pageState,
  theme,
  meta,
  grid,
  hideHandles = false,
  hideIndicators = false,
  hideResizeHandles = false,
  hideRotateHandles = false,
  hideBounds = false,
  hideGrid = true,
  ...rest
}: RendererProps<T, M>) => {
  useTLTheme(theme, `#${ id}`)

  const rSelectionBounds = useRef<TLBounds>(null)

  const rPageState = useRef<TLPageState>(pageState)

  useEffect(() => {
    rPageState.current = pageState
  }, [pageState])

  const [context] = useState<TLContextType<TLShape>>(() => ({
    callbacks: rest,
    shapeUtils,
    rSelectionBounds,
    rPageState,
    inputs: new Inputs(),
  }))

  return (
    <TLContext.Provider value={context}>
      <Canvas
        grid={grid}
        hideBounds={hideBounds}
        hideGrid={hideGrid}
        hideHandles={hideHandles}
        hideIndicators={hideIndicators}
        hideResizeHandles={hideResizeHandles}
        hideRotateHandle={hideRotateHandles}
        id={id}
        meta={meta}
        page={page}
        pageState={pageState}
      />
    </TLContext.Provider>
  )
}

export default Renderer
