import type { TDCallbacks, TLPointerInfo } from 'types'
import type StateManager from '../../StateManager'
import BaseSession from '../../BaseSession'
import type FreeDrawShape from './FreeDrawShape'

class FreeDrawSession extends BaseSession implements TDCallbacks {
  constructor(stateManager: StateManager, shapeId: string) {
    super(stateManager)
    this.captureShape(shapeId)
  }

  onPointerMove(info: TLPointerInfo) {
    const shape = this.getActiveShape() as FreeDrawShape

    this.sm.updateShape(shape.addPoint(info.point))
  }

  onPointerUp() {
    this.complete()
  }
}
export default FreeDrawSession
