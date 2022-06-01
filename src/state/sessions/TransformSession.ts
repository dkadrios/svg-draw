import {
  TDCallbacks,
  TDShape,
  TLBoundsCorner,
  TLBoundsEdge,
  TLPointerInfo,
  Transformable, isTLBoundsCorner, isTLBoundsEdge,
} from 'types'
import { getTransformedBoundingBox, snapBoundsToGrid } from 'utils'
import { sub } from 'utils/vec'
import type StateManager from '../StateManager'
import BaseSession from '../BaseSession'

class TransformSession extends BaseSession implements TDCallbacks {
  target: TLBoundsCorner | TLBoundsEdge

  originalPoint: number[]

  constructor(sm: StateManager, info: TLPointerInfo) {
    super(sm)
    this.captureShape()

    if (!(isTLBoundsEdge(info.target) || isTLBoundsCorner(info.target))) {
      this.throwFromSession('Incorrect handle name')
    }

    this.target = info.target
    this.originalPoint = info.point
  }

  onPointerMove(info: TLPointerInfo) {
    const grid = this.sm.getGridFactor()
    const delta = sub(info.point, this.originalPoint)
    const shape = this.getCapturedShape() as TDShape & Transformable

    const newBounds = getTransformedBoundingBox(
      shape.getBounds(),
      this.target,
      delta,
      shape.rotation,
      info.shiftKey || shape.isAspectRatioLocked,
    )

    const bounds = grid === 1 ? newBounds : snapBoundsToGrid(newBounds, grid)
    const newShape = shape.transform(bounds)

    this.sm.updateShape(newShape)
  }

  onPointerUp() {
    this.complete()
  }
}
export default TransformSession
