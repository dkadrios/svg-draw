import * as React from 'react'
import type { TLBounds, TLPage, TLPageState, TLShape } from '../types'
import type { TLShapeUtil, TLShapeUtilsMap } from '../TLShapeUtil'
import { useTLContext } from './useTLContext'

const canvasToScreen = (point: number[], camera: TLPageState['camera']): number[] => (
  [(point[0] + camera.point[0]) * camera.zoom, (point[1] + camera.point[1]) * camera.zoom])

const getShapeUtils = <T extends TLShape>(shapeUtils: TLShapeUtilsMap<T>, shape: T) => (
  shapeUtils[shape.type as T['type']] as unknown as TLShapeUtil<T>)

const useSelection = <T extends TLShape>(
  page: TLPage<T>,
  pageState: TLPageState,
  shapeUtils: TLShapeUtilsMap<T>,
) => {
  const { rSelectionBounds } = useTLContext()
  const { selectedId } = pageState
  const rPrevBounds = React.useRef<TLBounds>()
  // TODO: refactor knowing that there' will be not more than 1 selected item

  let bounds: TLBounds | undefined
  let rotation = 0
  let isLocked = false

  if (selectedId) {
    const shape = page.shapes[selectedId]
    rotation = shape.rotation || 0
    isLocked = shape.isLocked || false
    const utils = getShapeUtils(shapeUtils, shape)
    bounds = utils.hideBounds ? undefined : shape.getBounds()
  }

  if (bounds) {
    const [minX, minY] = canvasToScreen([bounds.minX, bounds.minY], pageState.camera)
    const [maxX, maxY] = canvasToScreen([bounds.maxX, bounds.maxY], pageState.camera)
    rSelectionBounds.current = {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    }
  } else {
    rSelectionBounds.current = null
  }

  const prevBounds = rPrevBounds.current

  if (!prevBounds || !bounds) {
    rPrevBounds.current = bounds
  } else if (bounds) {
    if (
      prevBounds.minX === bounds.minX
      && prevBounds.minY === bounds.minY
      && prevBounds.maxX === bounds.maxX
      && prevBounds.maxY === bounds.maxY
    ) {
      bounds = rPrevBounds.current
    }
  }

  return { bounds, rotation, isLocked }
}
export default useSelection
