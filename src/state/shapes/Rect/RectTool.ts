import { TDCallbacks, TDToolType, TLBoundsCorner, TLPointerInfo } from 'types'
import { TransformSession } from '../../sessions'
import BaseTool from '../../BaseTool'
import RectShape from './RectShape'

class RectTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = new RectShape({
      point: info.point,
    })

    this.sm.addShape(shape)
    this.sm.setSelected(shape.id)
    this.sm.startSession(new TransformSession(this.sm, {
      ...info,
      target: TLBoundsCorner.BottomRight,
    }), () => this.sm.setTool(TDToolType.Select))
  }
}
export default RectTool
