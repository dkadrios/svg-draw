import type { HandlesMoveable, TDCallbacks, TDShape, TLPointerInfo } from 'types'
import type StateManager from 'state/StateManager'
import { sub } from 'utils/vec'
import BaseSession from '../BaseSession'

class MoveHandleSession extends BaseSession implements TDCallbacks {
  target: string

  originalPoint: number[]

  constructor(stateManager: StateManager, info: TLPointerInfo) {
    super(stateManager)
    const shape = this.captureShape()

    if (!shape.getHandle(info.target)) {
      this.throwFromSession(`Wrong handle id provided: ${info.target}`)
    }

    this.target = info.target
    this.originalPoint = info.point
  }

  onPointerMove(info: TLPointerInfo) {
    const shape = this.getCapturedShape() as TDShape & HandlesMoveable

    const newShape = shape.moveHandle(
      this.target,
      sub(info.point, this.originalPoint),
      info.shiftKey, // snap to angle
      this.sm.getGridFactor(), // snap to grid
    )

    this.sm.updateShape(newShape)
  }

  onPointerUp() {
    this.complete()
  }
}
export default MoveHandleSession
