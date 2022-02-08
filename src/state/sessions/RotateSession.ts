import type { CallbacksList, TLPointerInfo } from 'types'
import { getBoundsCenter, normalizedAngle, snapAngleToSegments } from 'utils'
import type StateManager from '../StateManager'

class RotateSession implements CallbacksList {
  onDragBoundsHandle(stateManager: StateManager, e: TLPointerInfo) {
    const shape = stateManager.getSelectedShape()
    if (!shape) {
      stateManager.completeSession()
      return
    }

    const util = stateManager.getUtil(shape)
    const bounds = util.getBounds(shape)
    const center = getBoundsCenter(bounds)

    const newAngle = normalizedAngle(center, e.point)
    const rotation = e.shiftKey
      ? snapAngleToSegments(newAngle, 24)
      : newAngle
    stateManager.page.updateShape(shape.id, { rotation })
  }

  onReleaseBoundsHandle(stateManager: StateManager) {
    stateManager.completeSession()
  }
}
export default RotateSession
