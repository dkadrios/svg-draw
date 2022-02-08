import type { CallbacksList, TLPointerInfo } from 'types'
import { vec } from 'utils'
import type StateManager from '../StateManager'

class TranslateSession implements CallbacksList {
  shapeId: string

  dragStartPoint: number[]

  constructor(stateManager: StateManager, id: string, point: number[]) {
    const shape = stateManager.getShape(id)
    this.shapeId = id
    this.dragStartPoint = vec.sub(point, shape.point)
  }

  onDragShape(stateManager: StateManager, info: TLPointerInfo) {
    const { grid, hideGrid } = stateManager.getSettings()
    const newPoint = vec.sub(info.point, this.dragStartPoint)

    stateManager.updateShape(this.shapeId, {
      point: hideGrid ? newPoint : vec.snap(newPoint, grid),
    })
  }

  onReleaseShape(stateManager: StateManager) {
    stateManager.completeSession()
  }
}
export default TranslateSession
