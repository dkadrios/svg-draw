import {
  DEFAULT_STYLES,
  DEFAULT_VIEW_SETTINGS,
  TDDocumentViewSettings,
  TDShapeStyle,
  TDToolType,
} from 'types'
import { isContained } from 'utils'
import Store from './store'

interface ToolbarState {
  tool: TDToolType,
  styles: TDShapeStyle,
  isAdminMode: boolean,
  settings: TDDocumentViewSettings
}

class Toolbar extends Store<ToolbarState> {
  state!: ToolbarState

  constructor(settings?: TDDocumentViewSettings, isAdminMode?: boolean) {
    super()
    this.reset(settings, isAdminMode)
  }

  reset(settings: TDDocumentViewSettings = DEFAULT_VIEW_SETTINGS, isAdminMode = true) {
    this.action(() => ({
      tool: TDToolType.Select,
      styles: DEFAULT_STYLES,
      settings,
      isAdminMode,
    }))
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
    // small optimization; we don't want to update state if there is no actual changes;
    if (isContained(styles, this.state.styles)) return
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
