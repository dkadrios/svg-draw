import { TDCallbacks, TDToolType, TLPointerInfo } from 'types'
import BaseTool from '../../BaseTool'
import { MoveHandleSession } from '../../sessions'
import MeasureLineShape from './MeasureLineShape'

class MeasureLineTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = new MeasureLineShape({ point: info.point }, this.sm)

    this.sm.addShape(shape)
    this.sm.setSelected(shape.id)
    this.sm.startSession(new MoveHandleSession(this.sm, {
      ...info,
      target: 'end',
    }), () => this.sm.setTool(TDToolType.Select))
  }
}
export default MeasureLineTool
