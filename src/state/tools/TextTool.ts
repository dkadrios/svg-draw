import { TDCallbacks, TDShapeType, TDToolType, TLPointerInfo } from 'types'
import TextEditSession from '../sessions/TextEditSession'
import BaseTool from './BaseTool'

class TextTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const newShape = this.sm.createShape({
      type: TDShapeType.Text,
      point: info.point,
      text: '',
    })

    this.sm.pageState.setEditing(newShape.id)
    this.sm.startSession(
      new TextEditSession(this.sm, newShape.id),
      () => this.sm.setTool(TDToolType.Select),
    )
  }
}
export default TextTool
