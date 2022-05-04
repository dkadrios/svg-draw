import { TDCallbacks, TLDropEventHandler } from 'types'
import type StateManager from './StateManager'
import { ImageShape } from './shapes/Image'

/* Base operations inherent to each tool: drop file, delete shape, zoom etc */
class BaseTool implements TDCallbacks {
  sm: StateManager

  constructor(stateManager: StateManager) {
    this.sm = stateManager
  }

  // TODO: nudge, childIndex management
  onKeyDown(key: string) {
    if (key !== 'Backspace' && key !== 'Delete') return
    const shape = this.sm.getSelectedShape()
    if (!shape) return
    this.sm.clearState()
    this.sm.removeShape(shape.id)
  }

  onDrop: TLDropEventHandler = async (e) => {
    e.preventDefault()
    if (!e.dataTransfer.files?.length) return

    const shape = await ImageShape.createImageShapeFromFile(
      e.dataTransfer.files[0],
      // Better to use canvas point file has been dropped at,
      // but currently onDrop handler doesn't calculate it correctly
      this.sm.getCenterPoint(),
    )
    this.sm.addShape(shape)
  }
}

export default BaseTool
export { BaseTool }
