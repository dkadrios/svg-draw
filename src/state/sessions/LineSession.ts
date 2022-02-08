import { produce } from 'immer'
import type { CallbacksList, LineShape, TLPointerInfo } from 'types'
import { snapAngleToSegments, vec } from 'utils'
import type StateManager from '../StateManager'

class LineSession implements CallbacksList {
  shape: LineShape

  target: 'start' | 'end'

  originalPoint: number[]

  constructor(stateManager: StateManager, info: TLPointerInfo) {
    const shape = stateManager.getSelectedShape() as LineShape
    if (!shape || (info.target !== 'start' && info.target !== 'end')) {
      stateManager.completeSession()
      throw new TypeError('No selected shape or wrong target')
    }

    this.shape = shape
    this.target = info.target
    this.originalPoint = info.point
  }

  // Calculate new handle point taking into account snapping to angles and grid
  calcDelta(info: TLPointerInfo) {
    const delta = vec.sub(info.point, this.originalPoint)
    const { handles } = this.shape
    if (!info.shiftKey) return delta

    // Snap delta to 15 degree angles
    const A = handles[this.target === 'start' ? 'end' : 'start'].point
    const B = handles[this.target].point
    const C = vec.toFixed(vec.add(B, delta))
    const angle = vec.angle(A, C)
    const adjusted = vec.rotWith(C, A, snapAngleToSegments(angle, 24) - angle)
    return vec.add(delta, vec.sub(adjusted, C))
  }

  onPointerMove(stateManager: StateManager, info: TLPointerInfo) {
    const util = stateManager.getUtil(this.shape)
    const { grid, hideGrid } = stateManager.getSettings()
    const delta = this.calcDelta(info)

    const newShape = produce(this.shape, (draft) => {
      // Handle being dragged
      const handle = draft.handles[this.target]
      const newPoint = vec.add(handle.point, delta)
      handle.point = hideGrid ? newPoint : vec.snap(newPoint, grid)

      const topLeft = draft.point
      const nextBounds = util.getBounds(draft)
      const offset = vec.sub([nextBounds.minX, nextBounds.minY], topLeft)

      // Move shape point to exclude situation with negative handle coords
      if (!vec.isEqual(offset, [0, 0])) {
        Object.values(draft.handles).forEach((handle) => {
          handle.point = vec.toFixed(vec.sub(handle.point, offset))
        })
        draft.point = vec.toFixed(vec.add(draft.point, offset))
      }
    })

    stateManager.page.updateShape(newShape.id, newShape)
  }

  onPointerUp(stateManager: StateManager) {
    stateManager.completeSession()
  }
}
export default LineSession
