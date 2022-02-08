import { ShapeStyle, TDToolType } from 'types'
import Store from './store'

class Toolbar extends Store {
  state = {
    tool: TDToolType.Select,
    toolLocked: false,
    styles: {
      color: '#000000',
      fill: 'transparent',
    } as ShapeStyle,
  }

  getTool() {
    return this.state.tool
  }

  getToolLocked() {
    return this.state.toolLocked
  }

  getStyles() {
    return this.state.styles
  }

  setTool(tool: TDToolType) {
    this.action((draft) => {
      draft.tool = tool
    })
  }

  lockTool(flag = true) {
    this.action((draft) => {
      draft.toolLocked = flag
    })
  }

  setStyles(styles: Partial<ShapeStyle>) {
    this.action((draft) => {
      draft.styles = { ...draft.styles, ...styles }
    })
  }
}
export default Toolbar
