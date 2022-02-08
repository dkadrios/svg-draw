import { TDCallbacks, TDShapeType, TDToolType, TLPointerInfo } from 'types'
import { LineSession } from '../sessions'
import BaseTool from './BaseTool'

class LineTool extends BaseTool implements TDCallbacks {
  onPointerDown(info: TLPointerInfo) {
    const shape = this.sm.createShape({
      type: TDShapeType.Line,
      point: info.point,
      handles: {
        start: { id: 'start', index: 0, point: [0, 0] },
        end: { id: 'end', index: 1, point: [1, 1] },
      },
    })

    this.sm.pageState.setSelected(shape.id)
    this.sm.startSession(new LineSession(this.sm, {
      ...info,
      target: 'end',
    }), () => this.sm.setTool(TDToolType.Select))
  }
}
export default LineTool
