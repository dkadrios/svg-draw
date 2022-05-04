import { TDCallbacks, TDToolType, TLPointerInfo } from 'types'
import BaseTool from '../../BaseTool'
import { MoveHandleSession } from '../../sessions'
import LineShape from './LineShape'

class LineTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = new LineShape({ point: info.point })

    this.sm.addShape(shape)
    this.sm.setSelected(shape.id)
    this.sm.startSession(new MoveHandleSession(this.sm, {
      ...info,
      target: 'end',
    }), () => this.sm.setTool(TDToolType.Select))
  }
}
export default LineTool
