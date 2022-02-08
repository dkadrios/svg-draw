import { TDCallbacks, TDShapeType, TLDropEventHandler } from 'types'
import type StateManager from '../StateManager'
import { ImageUtil } from '../shapes'
import { vec } from '../../utils/vec'

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

    const shape = await ImageUtil.getImageShapeFromFile(
      e.dataTransfer.files[0],
      // Better to use canvas point file has been dropped at,
      // but currently onDrop handler doesn't calculate it correctly
      this.sm.getCenterPoint(),
    )
    this.sm.createShape(shape)
  }
}
export default BaseTool
