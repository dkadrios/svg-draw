import type { TDCallbacks } from 'types'
import type StateManager from '../../StateManager'
import BaseSession from '../../BaseSession'
import TextShape from './TextShape'

class TextSession extends BaseSession implements TDCallbacks {
  initText: string

  constructor(stateManager: StateManager, shapeId: string) {
    super(stateManager)
    const shape = this.captureShape(shapeId) as TextShape
    this.initText = shape.text
  }

  onPointerDown() {
    this.onShapeBlur()
  }

  onShapeChange({ text = '', reset = false }) {
    const shape = this.getActiveShape() as TextShape
    if (reset) {
      this.sm.updateShape(shape.setText(this.initText))
      this.onShapeBlur()
      return
    }
    this.sm.updateShape(shape.setText(text))
  }

  onShapeBlur() {
    const shape = this.getActiveShape() as TextShape
    this.sm.setEditing()
    this.sm.setHovered()
    this.sm.setSelected()
    if (!shape.text) {
      this.sm.removeShape(shape.id)
    }
    this.complete()
  }
}
export default TextSession
