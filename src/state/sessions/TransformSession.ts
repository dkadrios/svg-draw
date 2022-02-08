import { CallbacksList, TDShape, TLBounds, TLBoundsCorner, TLBoundsEdge, TLPointerInfo, isTLBoundsCorner, isTLBoundsEdge } from 'types'
import { getTransformedBoundingBox, snapBoundsToGrid, vec } from 'utils'
import type StateManager from '../StateManager'

class TransformSession implements CallbacksList {
  shape: TDShape

  target: TLBoundsCorner | TLBoundsEdge

  originalPoint: number[]

  originalBounds: TLBounds

  constructor(stateManager: StateManager, info: TLPointerInfo) {
    const shape = stateManager.getSelectedShape()
    if (!shape || !(isTLBoundsEdge(info.target) || isTLBoundsCorner(info.target))) {
      stateManager.completeSession()
      throw new TypeError('No selected shape or incorrect handle name')
    }

    this.shape = shape
    this.target = info.target
    this.originalPoint = info.point
    const util = stateManager.getUtil(this.shape)
    this.originalBounds = util.getBounds(shape)
  }

  onPointerMove(stateManager: StateManager, info: TLPointerInfo) {
    const { grid, hideGrid } = stateManager.getSettings()
    const delta = vec.sub(info.point, this.originalPoint)
    const util = stateManager.getUtil(this.shape)

    const newBounds = getTransformedBoundingBox(
      this.originalBounds,
      this.target,
      delta,
      this.shape.rotation,
      info.shiftKey || util.isAspectRatioLocked,
    )
    const newShape = util.transform(
      this.shape,
      hideGrid ? newBounds : snapBoundsToGrid(newBounds, grid),
    )

    stateManager.page.updateShape(this.shape.id, newShape)
  }

  onPointerUp(stateManager: StateManager) {
    stateManager.completeSession()
  }
}
export default TransformSession
