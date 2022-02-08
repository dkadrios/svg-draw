import React, { useEffect, useState } from 'react'
import { Renderer, TLBounds, TLCallbackNames, TLPage, TLPerformanceMode } from 'core'
import { TDShape } from 'types'
import StateManager from 'state'
import { StateManagerContext } from 'state/useStateManager'
import Toolbar from './components/Toolbar'

const emptyPage = { id: 'page', shapes: {} } as TLPage<TDShape>

type SvgDrawProps = {
  data: TLPage<TDShape>
}
export const SvgDraw = ({ data = emptyPage }: SvgDrawProps) => {
  const [stateManager] = useState(() => new StateManager({
    page: data,
  }))

  const [page, setPage] = useState(stateManager.page.state)
  const [pageState, setPageState] = useState(stateManager.pageState.state)

  useEffect(() => {
    stateManager.page.subscribe(setPage)
    stateManager.pageState.subscribe(setPageState)
    return () => {
      stateManager.page.unsubscribe(setPage)
      stateManager.pageState.unsubscribe(setPageState)
    }
  }, [stateManager.page, stateManager.pageState])

  const handleCallback = (eventName: TLCallbackNames) => (...rest: unknown[]) => {
    stateManager.handleCallback(eventName, ...rest)
  }

  const handleBoundsChange = (bounds: TLBounds) => stateManager.updateBounds(bounds)

  const { settings: { grid, hideGrid } } = pageState

  return (
    <StateManagerContext.Provider value={stateManager}>
      <Renderer
        containerRef={undefined} // Required
        grid={grid} // Required
        hideBounds={false}
        hideGrid={hideGrid}
        hideHandles={false}
        hideIndicators={false} // Required
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

export default SvgDraw
