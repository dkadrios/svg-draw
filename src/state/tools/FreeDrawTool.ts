import { TDCallbacks, TDShapeType, TLPointerInfo } from 'types'
import { vec } from 'utils'
import { FreeDrawSession } from '../sessions'
import BaseTool from './BaseTool'

class FreeDrawTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = this.sm.createShape({
      type: TDShapeType.FreeDraw,
      point: vec.toFixed(info.point),
      points: [[0, 0]],
    })

    this.sm.startSession(new FreeDrawSession(this.sm, shape.id, info))
  }
}
export default FreeDrawTool
