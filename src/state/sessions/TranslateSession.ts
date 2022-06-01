import type { TDCallbacks, TLPointerInfo } from 'types'
import { sub } from 'utils/vec'
import type StateManager from '../StateManager'
import BaseSession from '../BaseSession'

class TranslateSession extends BaseSession implements TDCallbacks {
  dragStartPoint: number[]

  constructor(stateManager: StateManager, info: TLPointerInfo) {
    super(stateManager)
    const shape = this.captureShape()

    this.dragStartPoint = sub(info.point, shape.point)
  }

  onDragShape(info: TLPointerInfo) {
    const shape = this.getCapturedShape()
    const newPoint = sub(info.point, this.dragStartPoint)

    this.sm.updateShape(shape.translate(newPoint, this.sm.getGridFactor()))
  }

  onReleaseShape() {
    this.complete()
  }
}
export default TranslateSession
