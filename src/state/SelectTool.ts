import {
  TDCallbacks,
  TDShapeType,
  TLPointerInfo,
  isTLBoundsCorner,
  isTLBoundsEdge,
} from 'types'
import BaseTool from './BaseTool'
import { MoveHandleSession, RotateSession, TransformSession, TranslateSession } from './sessions'
import TextSession from './shapes/Text/TextSession'

class SelectTool extends BaseTool implements TDCallbacks {
  onDragShape(e: TLPointerInfo) {
    this.sm.startSession(new TranslateSession(this.sm, e))
  }

  onPointShape(info: TLPointerInfo) {
    this.sm.setSelected(info.target)
  }

  onPointCanvas() {
    this.sm.setSelected()
  }

  onHoverShape(info: TLPointerInfo) {
    this.sm.setHovered(info.target)
  }

  onUnhoverShape() {
    this.sm.setHovered()
  }

  onDoubleClickShape(info: TLPointerInfo) {
    const shape = this.sm.getShape(info.target)
    if (!shape) return

    if (shape.type === TDShapeType.Text) {
      this.sm.setEditing(info.target)
      this.sm.startSession(new TextSession(this.sm, info.target))
    }
  }

  onDragBoundsHandle(info: TLPointerInfo) {
    if (info.target === 'rotate') {
      this.sm.startSession(new RotateSession(this.sm))
    }

    if (isTLBoundsEdge(info.target) || isTLBoundsCorner(info.target)) {
      this.sm.startSession(new TransformSession(this.sm, info))
    }
  }

  onDragHandle(info: TLPointerInfo) {
    this.sm.startSession(new MoveHandleSession(this.sm, info))
  }
}
export default SelectTool
