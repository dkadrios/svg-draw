import type { TDCallbacks, TLPointerInfo } from 'types'
import { vec } from 'utils'
import type StateManager from '../StateManager'
import BaseSession from '../BaseSession'

class TranslateSession extends BaseSession implements TDCallbacks {
  dragStartPoint: number[]

  constructor(stateManager: StateManager, info: TLPointerInfo) {
    super(stateManager)
    const shape = this.captureShape()

    this.dragStartPoint = vec.sub(info.point, shape.point)
  }

  onDragShape(info: TLPointerInfo) {
    const shape = this.getCapturedShape()
    const newPoint = vec.sub(info.point, this.dragStartPoint)

    this.sm.updateShape(shape.translate(newPoint, this.sm.getGridFactor()))
  }

  onReleaseShape() {
    this.complete()
  }
}
export default TranslateSession
