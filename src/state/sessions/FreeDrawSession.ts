import produce from 'immer'
import type { CallbacksList, FreeDrawShape, TLPointerInfo } from 'types'
import { translatePoints, vec } from 'utils'
import type StateManager from '../StateManager'

class FreeDrawSession implements CallbacksList {
  shape: FreeDrawShape

  shapeId: string

  constructor(stateManager: StateManager, shapeId: string, info: TLPointerInfo) {
    this.shapeId = shapeId
    this.shape = stateManager.getShape(shapeId) as FreeDrawShape
  }

  onPointerMove(stateManager: StateManager, info: TLPointerInfo) {
    const curPoint = info.point
    const topLeft = [
      Math.min(this.shape.point[0], curPoint[0]),
      Math.min(this.shape.point[1], curPoint[1]),
    ]

    this.shape = produce(this.shape, (draft) => {
      draft.points.push(vec.sub(curPoint, draft.point))

      if (!vec.isEqual(draft.point, topLeft)) {
        draft.points = translatePoints(draft.points, vec.sub(draft.point, topLeft))
        draft.point = topLeft
      }

      draft.points = draft.points.map(p => vec.toFixed(p))
    })

    stateManager.page.updateShape(this.shapeId, this.shape)
  }

  onPointerUp(stateManager: StateManager) {
    stateManager.completeSession()
  }
}
export default FreeDrawSession
