import type { CallbacksList, TextShape } from 'types'
import { TLPointerInfo } from 'types'
import type StateManager from '../StateManager'

class TextEditSession implements CallbacksList {
  shapeId: string

  initText: string

  constructor(stateManager: StateManager, shapeId: string) {
    this.shapeId = shapeId
    const shape = stateManager.getShape(shapeId) as TextShape
    this.initText = shape.text
  }

  onPointerDown(stateManager: StateManager) {
    const shape = stateManager.getShape(this.shapeId) as TextShape
    if (!shape) return
    this.onShapeBlur(stateManager, shape)
  }

  onShapeChange(stateManager: StateManager, shape: TextShape, { text = '', reset = false }) {
    if (reset) {
      this.onShapeBlur(stateManager, { text: this.initText } as TextShape)
      return
    }
    stateManager.page.updateShape(this.shapeId, { text })
  }

  onShapeBlur(stateManager: StateManager, shape: TextShape) {
    stateManager.setEditing()
    stateManager.setHovered()
    stateManager.setSelected()
    if (!shape.text) {
      stateManager.removeShape(this.shapeId)
    } else {
      stateManager.updateShape(this.shapeId, { text: shape.text })
    }
    stateManager.completeSession()
  }
}
export default TextEditSession
