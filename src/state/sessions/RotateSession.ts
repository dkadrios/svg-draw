import type { TDCallbacks, TLPointerInfo } from 'types'
import type StateManager from '../StateManager'
import BaseSession from '../BaseSession'

class RotateSession extends BaseSession implements TDCallbacks {
  constructor(stateManager: StateManager) {
    super(stateManager)
    this.captureShape()
  }

  onDragBoundsHandle(e: TLPointerInfo) {
    const shape = this.getCapturedShape()
    this.sm.updateShape(shape.rotate(e.point, e.shiftKey))
  }

  onReleaseBoundsHandle() {
    this.complete()
  }
}
export default RotateSession
