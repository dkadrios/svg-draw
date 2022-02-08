import { TDCallbacks, TDShapeType, TDToolType, TLBoundsCorner, TLPointerInfo } from 'types'
import { TransformSession } from '../sessions'
import BaseTool from './BaseTool'

class RectTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const newShape = this.sm.createShape({
      type: TDShapeType.Rectangle,
      point: info.point,
      size: [1, 1],
    })

    this.sm.pageState.setSelected(newShape.id)
    this.sm.startSession(new TransformSession(this.sm, {
      ...info,
      target: TLBoundsCorner.BottomRight,
    }), () => this.sm.setTool(TDToolType.Select))
  }
}
export default RectTool
