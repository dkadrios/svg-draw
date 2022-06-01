import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
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

  useEffect(() => {
    stateManager.setData(data, isAdminMode)
  }, [stateManager, data, isAdminMode])

  const page = stateManager.page.state
  // Need this for correct updates of page when page shapes are changed
  useSyncExternalStore(stateManager.page.subscribe, () => stateManager.page.state.shapes)
  const pageState = useSyncExternalStore(stateManager.pageState.subscribe, () => stateManager.pageState.state)

  useImperativeHandle(ref, () => () => stateManager.export())

  const handleCallback = (eventName: TLCallbackNames) => (...rest: unknown[]) =>
    stateManager.handleCallback(eventName, ...rest)

  const handleBoundsChange = (bounds: TLBounds) =>
    stateManager.updateBounds(bounds)

  const { settings: { grid, hideGrid } } = pageState

  const scale = stateManager.getScale()
  const meta = useMemo(() => ({
    scale,
  }), [scale])

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
        meta={meta}
        onBoundsChange={handleBoundsChange}
        onDoubleClickShape={handleCallback('onDoubleClickShape')}
        onDragBoundsHandle={handleCallback('onDragBoundsHandle')}
        onDragCanvas={handleCallback('onDragCanvas')}
        onDragHandle={handleCallback('onDragHandle')}
        onDragOver={e => e.preventDefault()}
        onDragShape={handleCallback('onDragShape')}
        onDrop={handleCallback('onDrop')}
        onHoverShape={handleCallback('onHoverShape')}
        onKeyDown={handleCallback('onKeyDown')}
        onPan={handleCallback('onPan')}
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
