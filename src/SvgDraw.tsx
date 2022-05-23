import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Renderer, TLBounds, TLCallbackNames, TLPerformanceMode } from 'core'
import type { TDDocument } from 'types'
import StateManager from 'state'
import { StateManagerContext } from 'state/useStateManager'
import Toolbar from './components/Toolbar'

const emptyPage = { page: { id: 'page', shapes: {} } } as TDDocument
type Ref = React.ForwardedRef<() => TDDocument>
type SvgDrawProps = {
  data: TDDocument,
  isAdminMode?: boolean,
}

export const SvgDraw = ({ data = emptyPage, isAdminMode = true }: SvgDrawProps, ref?: Ref) => {
  const [stateManager] = useState(() => new StateManager(data, isAdminMode))

  const [page, setPage] = useState(stateManager.page.state)
  const [pageState, setPageState] = useState(stateManager.pageState.state)

  useImperativeHandle(ref, () => () => stateManager.export())

  useEffect(() => {
    stateManager.page.subscribe(setPage)
    stateManager.pageState.subscribe(setPageState)
    return () => {
      stateManager.page.unsubscribe(setPage)
      stateManager.pageState.unsubscribe(setPageState)
    }
  }, [stateManager.page, stateManager.pageState])

  useEffect(() => {
    stateManager.init(data, isAdminMode)
  }, [stateManager, data])

  const handleCallback = (eventName: TLCallbackNames) => (...rest: unknown[]) => {
    stateManager.handleCallback(eventName, ...rest)
  }

  const handleBoundsChange = (bounds: TLBounds) => stateManager.updateBounds(bounds)

  const { settings: { grid, hideGrid } } = pageState

  return (
    <StateManagerContext.Provider value={stateManager}>
      <Renderer
        grid={grid}
        hideBounds={false}
        hideGrid={hideGrid}
        hideHandles={false}
        hideIndicators={false}
        hideRotateHandles={false}
        id={undefined}
        onBoundsChange={handleBoundsChange}
        onDoubleClickShape={handleCallback('onDoubleClickShape')}
        onDragBoundsHandle={handleCallback('onDragBoundsHandle')}
        onDragHandle={handleCallback('onDragHandle')}
        onDragOver={e => e.preventDefault()}
        onDragShape={handleCallback('onDragShape')}
        onDrop={handleCallback('onDrop')}
        onHoverShape={handleCallback('onHoverShape')}
        onKeyDown={handleCallback('onKeyDown')}
        onPointCanvas={handleCallback('onPointCanvas')}
        onPointerDown={handleCallback('onPointerDown')}
        onPointerMove={handleCallback('onPointerMove')}
        onPointerUp={handleCallback('onPointerUp')}
        onPointShape={handleCallback('onPointShape')}
        onReleaseBoundsHandle={handleCallback('onReleaseBoundsHandle')}
        onReleaseShape={handleCallback('onReleaseShape')}
        onShapeBlur={handleCallback('onShapeBlur')}
        onShapeChange={handleCallback('onShapeChange')}
        onUnhoverShape={handleCallback('onUnhoverShape')}
        onZoom={handleCallback('onZoom')}
        page={page} // resize/drag shapes
        pageState={pageState} // hover / selected indicators
        performanceMode={TLPerformanceMode.TransformSelected}
        shapeUtils={stateManager.utils}
      />
      <Toolbar />
    </StateManagerContext.Provider>
  )
}

const ForwardedSvgDraw = React.forwardRef(SvgDraw)
export default ForwardedSvgDraw
