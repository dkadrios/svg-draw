import { TDCallbacks, TDToolType, TLPointerInfo } from 'types'
import BaseTool from 'state/BaseTool'
import TextSession from './TextSession'
import TextShape from './TextShape'

class TextTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = new TextShape({
      point: info.point,
    })

    this.sm.addShape(shape)
    this.sm.pageState.setEditing(shape.id)
    this.sm.startSession(
      new TextSession(this.sm, shape.id),
      () => this.sm.setTool(TDToolType.Select),
    )
  }
}
export default TextTool
