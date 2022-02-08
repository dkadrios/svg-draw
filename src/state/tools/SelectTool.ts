import { TDCallbacks, TDShapeType, TLPointerInfo, isTLBoundsCorner, isTLBoundsEdge } from 'types'
import { LineSession, RotateSession, TransformSession, TranslateSession } from '../sessions'
import TextEditSession from '../sessions/TextEditSession'
import BaseTool from './BaseTool'

class SelectTool extends BaseTool implements TDCallbacks {
  onDragShape(e: TLPointerInfo) {
    this.sm.startSession(new TranslateSession(this.sm, e.target, e.point))
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

    const util = this.sm.getUtil(shape)
    if (util.canEdit) this.sm.setEditing(info.target)
    if (util.type === TDShapeType.Text) {
      this.sm.startSession(new TextEditSession(this.sm, info.target))
    }
  }

  onDragBoundsHandle(info: TLPointerInfo) {
    if (info.target === 'rotate') {
      this.sm.startSession(new RotateSession())
    }

    if (isTLBoundsEdge(info.target) || isTLBoundsCorner(info.target)) {
      this.sm.startSession(new TransformSession(this.sm, info))
    }
  }

  onDragHandle(info: TLPointerInfo) {
    this.sm.startSession(new LineSession(this.sm, info))
  }

  /*
  onZoom(stateManager: StateManager, info: TLPointerInfo, e: React.WheelEvent<Element>) {
    // Denormalize event point for correct zoom calculations
    const point = stateManager.canvasToScreen(info.point)

    const delta = e.deltaMode === WheelEvent.DOM_DELTA_PIXEL
      ? info.delta[2] / 500
      : e.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? info.delta[2] / 100
        : info.delta[2] / 2

    stateManager.pageState.zoom(delta, point)
  }
   */
}
export default SelectTool
