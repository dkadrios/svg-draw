/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  CallbacksList,
  ShapeStyle, TDCallbacks,
  TDSession, TDSettings,
  TDShape, TLBounds,
  TLCallbackNames,
  TLPage,
  TLPageState,
} from 'types'
import { TDShapeType, TDToolType } from 'types'
import { getBoundsFromPoints, vec } from 'utils'
import { Page, PageState, Toolbar } from './stores'
import { FreeDrawTool, LineTool, RectTool, SelectTool, TextTool } from './tools'
import { FreeDrawUtil, ImageUtil, LineUtil, RectUtil, ShapeUtil, TextUtil } from './shapes'

class StateManager {
  utils = {
    [TDShapeType.Rectangle]: new RectUtil(),
    [TDShapeType.Line]: new LineUtil(),
    [TDShapeType.FreeDraw]: new FreeDrawUtil(),
    [TDShapeType.Text]: new TextUtil(),
    [TDShapeType.Image]: new ImageUtil(),
  }

  tools = {
    [TDToolType.Select]: new SelectTool(this),
    [TDToolType.Rectangle]: new RectTool(this),
    [TDToolType.Line]: new LineTool(this),
    [TDToolType.FreeDraw]: new FreeDrawTool(this),
    [TDToolType.Text]: new TextTool(this),
  }

  session: CallbacksList | null = null

  onSessionComplete: (() => void) | null = null

  tool: TDCallbacks | null = this.tools[TDToolType.Select]

  page: Page

  pageState: PageState

  toolbar: Toolbar

  rendererBounds: TLBounds = getBoundsFromPoints([
    [0, 0],
    [100, 100],
  ])

  constructor(initState: { page?: TLPage<TDShape>, pageState?: TLPageState } = {}) {
    this.page = new Page(initState.page)
    this.pageState = new PageState(initState.pageState)
    this.toolbar = new Toolbar()
  }

  getShape(id: string) {
    return this.page.getShape(id)
  }

  getUtil<T extends TDShape>(shape: T | T['type']) {
    const util = typeof shape === 'string'
      ? this.utils[shape]
      : this.utils[shape.type]
    return util as unknown as ShapeUtil<T>
  }

  getSelectedShape() {
    const selectedId = this.pageState.getSelectedId()

    if (!selectedId) return null
    return this.page.getShape(selectedId)
  }

  setSelected(id: string | null = null) {
    this.pageState.setSelected(id)

    // Refresh styles in styles selector to conform with currently selected shape
    const shape = this.getSelectedShape()
    if (shape) this.setStyles(shape.styles)
  }

  setHovered(id: string | null = null) {
    this.pageState.setHovered(id)
  }

  setEditing(id: string | null = null) {
    this.pageState.setEditing(id)
  }

  clearState() {
    this.setSelected()
    this.setHovered()
    this.setEditing()
  }

  getSettings() {
    return this.pageState.getSettings()
  }

  setSettings(settings: Partial<TDSettings>) {
    this.pageState.setSettings(settings)
  }

  createShape(shape: Partial<TDShape>) {
    if (!shape.type) throw new TypeError('Shape type is mandatory')

    const util = this.getUtil(shape.type)
    const allStyles = this.toolbar.getStyles()
    return this.page.createShape({
      ...shape,
      // add only styles inherent to shape
      styles: util.filterStyles(allStyles),
    })
  }

  updateShape(id: string, patch: Partial<TDShape>) {
    return this.page.updateShape(id, patch)
  }

  removeShape(id: string) {
    this.page.removeShape(id)
  }

  updateBounds(bounds: TLBounds) {
    this.rendererBounds = bounds
  }

  getCenterPoint() {
    const { height, width } = this.rendererBounds
    return vec.toFixed([width / 2, height / 2])
  }

  async addImageByUrl(url: string) {
    try {
      const shape = await ImageUtil.getImageShapeFromUrl(url, this.getCenterPoint())
      this.createShape(shape)
    } catch (e) {
      console.warn((e as Error).message)
    }
  }

  // Screen coords -> canvas point
  screenToCanvas(point: number[]) {
    const camera = this.pageState.getCamera()
    return vec.sub(vec.div(point, camera.zoom), camera.point)
  }

  // Canvas point -> screen coords
  canvasToScreen(point: number[]) {
    const camera = this.pageState.getCamera()
    return vec.mul(vec.add(point, camera.point), camera.zoom)
  }

  handleCallback(callbackName: TLCallbackNames, ...rest: unknown[]) {
    const params = rest.map((param) => {
      // @ts-ignore
      if (param.point) return { ...param, point: this.screenToCanvas(param.point) } as unknown
      return param
    })

    if (this.session) {
      // @ts-ignore
      this.session[callbackName]?.(this, ...params)
      return
    }

    if (this.tool && this.tool[callbackName]) {
      // @ts-ignore
      this.tool[callbackName]?.(...params)
    }
  }

  startSession(session: TDSession, cb: (() => void) | null = null) {
    if (this.session) {
      throw new Error('Session already in progress - need to complete it first')
    }

    this.session = session
    this.onSessionComplete = cb
  }

  completeSession() {
    this.session = null
    if (typeof this.onSessionComplete === 'function') {
      this.onSessionComplete()
      this.onSessionComplete = null
    }
  }

  setTool(type: TDToolType) {
    this.tool = this.tools[type]
    this.toolbar.setTool(type)
  }

  // Set styles in toolbar state
  setStyles(stylesPatch: Partial<ShapeStyle>) {
    this.toolbar.setStyles(stylesPatch)
  }

  // Change style in selector => need to change it in currently selected shape
  handleStylesChange(stylesPatch: Partial<ShapeStyle>) {
    this.setStyles(stylesPatch)
    const styles = this.toolbar.getStyles()

    const shape = this.getSelectedShape()
    if (shape) {
      this.page.updateShape(shape.id, { styles })
    }
  }

  exportData() {
    return this.page.state
  }
}
export default StateManager
