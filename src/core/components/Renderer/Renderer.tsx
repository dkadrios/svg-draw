/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type {
  TLBounds,
  TLCallbacks,
  TLPage,
  TLPageState,
  TLPerformanceMode,
  TLShape,
  TLTheme,
} from '../../types'
import Canvas from '../Canvas'
import Inputs from '../../inputs'
import { TLContext, TLContextType, useTLTheme } from '../../hooks'
import type { TLShapeUtilsMap } from '../../TLShapeUtil'

export interface RendererProps<T extends TLShape> extends Partial<TLCallbacks> {
  /**
   * An object containing instances of your shape classes.
   */
  shapeUtils: TLShapeUtilsMap<T>
  /**
   * The current page, containing shapes.
   */
  page: TLPage<T>
  /**
   * The current page state.
   */
  pageState: TLPageState
  /**
   * (optional) A unique id to be applied to the renderer element, used to scope styles.
   */
  id?: string
  /**
   * (optional) An object of custom options that should be passed to rendered shapes.
   */
  meta?: Record<string, unknown>
  /**
   * (optional) An object of custom theme colors.
   */
  theme?: Partial<TLTheme>
  /**
   * (optional) When true, the renderer will not show the bounds for selected objects.
   */
  hideBounds?: boolean
  /**
   * (optional) When true, the renderer will not show the handles of shapes with handles.
   */
  hideHandles?: boolean
  /**
   * (optional) When true, the renderer will not show resize handles for selected objects.
   */
  hideResizeHandles?: boolean
  /**
   * (optional) When true, the renderer will not show rotate handles for selected objects.
   */
  hideRotateHandles?: boolean
  /**
   * (optional) When true, the renderer will not show indicators for selected or
   * hovered objects,
   */
  hideIndicators?: boolean
  /**
   * (optional) When true, the renderer will not show the grid.
   */
  hideGrid?: boolean
  /**
   * (optional) The size of the grid step.
   */
  grid?: number
  /**
   * (optional) Use a performance mode.
   */
  performanceMode?: TLPerformanceMode
  /**
   * (optional) A callback that receives the renderer's inputs manager.
   */
  onMount?: (inputs: Inputs) => void
  /**
   * (optional) A callback that is fired when the editor's client bounding box changes.
   */
  onBoundsChange?: (bounds: TLBounds) => void
}

/**
 * The Renderer component is the main component of the library. It
 * accepts the current `page`, the `shapeUtils` needed to interpret
 * and render the shapeson the `page`, and the current
 * `pageState`.
 * @param props
 * @returns
 */
const Renderer = <T extends TLShape>({
  id = 'tl',
  shapeUtils,
  page,
  pageState,
  theme,
  meta,
  grid,
  performanceMode,
  hideHandles = false,
  hideIndicators = false,
  hideResizeHandles = false,
  hideRotateHandles = false,
  hideBounds = false,
  hideGrid = true,
  ...rest
}: RendererProps<T>) => {
  useTLTheme(theme, `#${ id}`)

  const rSelectionBounds = React.useRef<TLBounds>(null)

  const rPageState = React.useRef<TLPageState>(pageState)

  React.useEffect(() => {
    rPageState.current = pageState
  }, [pageState])

  const [context, setContext] = React.useState<TLContextType<T>>(() => ({
    callbacks: rest,
    shapeUtils,
    rSelectionBounds,
    rPageState,
    bounds: {
      minX: 0,
      minY: 0,
      maxX: Infinity,
      maxY: Infinity,
      width: Infinity,
      height: Infinity,
    },
    inputs: new Inputs(),
  }))

  const onBoundsChange = React.useCallback((bounds: TLBounds) => {
    setContext(context => ({
      ...context,
      bounds,
    }))
  }, [])

  return (
    <TLContext.Provider value={context as unknown as TLContextType<TLShape>}>
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
        onBoundsChange={onBoundsChange}
        page={page}
        pageState={pageState}
        performanceMode={performanceMode}
      />
    </TLContext.Provider>
  )
}
export default Renderer
