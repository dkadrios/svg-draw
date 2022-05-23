import {
  DEFAULT_VIEW_SETTINGS,
  TDDocumentViewSettings,
  TDShapeStyle,
  TDToolType,
} from 'types'
import Store from './store'

interface ToolbarState {
  tool: TDToolType,
  styles: TDShapeStyle,
  isAdminMode: boolean,
  settings: TDDocumentViewSettings
}

class Toolbar extends Store<ToolbarState> {
  state = {
    tool: TDToolType.Select,
    styles: {
      color: '#000000',
      fill: 'transparent',
    },
  } as ToolbarState

  constructor(settings = DEFAULT_VIEW_SETTINGS, isAdminMode = true) {
    super()
    this.init(settings, isAdminMode)
  }

  init(settings = DEFAULT_VIEW_SETTINGS, isAdminMode = true) {
    this.state = {
      ...this.state,
      settings,
      isAdminMode,
    }
    this.notify()
  }

  getTool() {
    return this.state.tool
  }

  getStyles() {
    return this.state.styles
  }

  getSettings() {
    return this.state.settings
  }

  setTool(tool: TDToolType) {
    this.action((draft) => {
      draft.tool = tool
    })
  }

  setStyles(styles: Partial<TDShapeStyle>) {
    this.action((draft) => {
      draft.styles = { ...draft.styles, ...styles }
    })
  }

  isVisible(btnId: string) {
    const { settings } = this.state
    if (this.state.isAdminMode) return true

    return !!settings[btnId as keyof TDDocumentViewSettings] || settings.tools[btnId as TDToolType]
  }

  setSettings(key: string, value: boolean) {
    this.action((draft) => {
      // @ts-ignore
      if (key in draft.settings) draft.settings[key] = value
      // @ts-ignore
      if (key in draft.settings.tools) draft.settings.tools[key] = value
    })
  }
}
export default Toolbar
