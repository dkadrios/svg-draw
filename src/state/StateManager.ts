/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  CanvasRatioScale,
  Class,
  TDCallbacks,
  TDDocument,
  TDEntitiesList,
  TDEntity,
  TDSettings,
  TDShape,
  TDShapeStyle,
  TDShapesList, TLCallbackNames,
} from 'types'
import { BASE_SCALE, TDShapeType, TDToolType } from 'types'
import { add, div, mul, sub } from 'utils/vec'
import { TLShapeUtil, TLShapeUtilsMap } from 'core'
import { Page, PageState, Toolbar } from './stores'
import SelectTool from './SelectTool'
import registerShapes from './shapes'

class StateManager {
  shapes: Record<string, Class<TDShape>> = {}

  utils = {} as TLShapeUtilsMap<TDShape>

  tools: Record<string, TDCallbacks> = {
    [TDToolType.Select]: new SelectTool(this),
  }

  session: TDCallbacks | null = null

  onSessionComplete: (() => void) | null = null

  tool: TDCallbacks | null = this.tools[TDToolType.Select]

  page: Page

  pageState: PageState

  toolbar: Toolbar

  constructor(document: TDDocument) {
    registerShapes(this)

    const { page = { shapes: {} }, pageState, settings } = document

    const shapes = this.loadShapes(page.shapes)
    this.page = new Page({ ...page, shapes })
    this.pageState = new PageState(pageState)
    this.toolbar = new Toolbar(settings)
  }

  setData(document: TDDocument) {
    const { page = { shapes: {} }, pageState, settings } = document

    const shapes = this.loadShapes(page.shapes)
    this.page.reset({ ...page, shapes })
    this.pageState.reset(pageState)
    this.toolbar.reset(settings)
  }

  registerShape(key: TDShapeType, Shape: Class<TDShape>, util: TLShapeUtil<TDShape>) {
    this.shapes[key] = Shape
    this.utils[key] = util
  }

  registerTool(key: string, tool: TDCallbacks) {
    this.tools[key] = tool
  }

  loadShapes(shapes: TDEntitiesList = {}) {
    return Object.keys(shapes).reduce((acc, key) => ({
      ...acc, [key]: this.initShapeByType(shapes[key]),
    }), {} as TDShapesList)
  }

  initShapeByType(shape: TDEntity) {
    const { type } = shape
    if (!this.shapes[type]) {
      throw new Error(`Unknown shape type: ${type}`)
    }
    return new this.shapes[type](shape)
  }

  getShape(id: string) {
    return this.page.getShape(id)
  }

  getSelectedShape() {
    const selectedId = this.pageState.getSelectedId()
    return selectedId ? this.page.getShape(selectedId) : null
  }

  setSelected(id: string | null = null) {
    this.pageState.setSelected(id)

    // Refresh styles in styles selector to conform with currently selected shape
    const shape = this.getSelectedShape()
    if (shape && shape.styles) this.setStyles(shape.styles)
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

  getPage() {
    return this.page
  }

  getGridFactor() {
    const { grid, hideGrid } = this.getSettings()
    return hideGrid ? 1 : grid
  }

  getNextChildIndex() {
    return this.page.getNextChildIndex()
  }

  getScale(): CanvasRatioScale {
    const { scale = BASE_SCALE } = this.page.state.canvas
    return scale
  }

  getCurrentStyles() {
    return this.toolbar.getStyles()
  }

  addShape(shape: TDShape) {
    const newShape = shape
      .produce({ childIndex: this.getNextChildIndex() })
      .setStyles(this.getCurrentStyles())

    return this.page.addShape(newShape)
  }

  updateShape(shape: TDShape) {
    return this.page.updateShape(shape)
  }

  removeShape(id: string) {
    this.page.removeShape(id)
  }

  // Screen coords -> canvas point
  screenToCanvas(point: number[]) {
    const camera = this.pageState.getCamera()
    return sub(div(point, camera.zoom), camera.point)
  }

  // Canvas point -> screen coords
  canvasToScreen(point: number[]) {
    const camera = this.pageState.getCamera()
    return mul(add(point, camera.point), camera.zoom)
  }

  handleCallback(callbackName: TLCallbackNames, ...rest: unknown[]) {
    const params = rest.map((param) => {
      // @ts-ignore
      if (param.point) return { ...param, point: this.screenToCanvas(param.point) } as unknown
      return param
    })

    if (this.session) {
      // @ts-ignore
      this.session[callbackName]?.(...params)
      return
    }

    if (this.tool && this.tool[callbackName]) {
      // @ts-ignore
      this.tool[callbackName]?.(...params)
    }
  }

  startSession(session: TDCallbacks, cb: (() => void) | null = null) {
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
  setStyles(stylesPatch: Partial<TDShapeStyle>) {
    this.toolbar.setStyles(stylesPatch)
  }

  // Change style in selector => need to change it in currently selected shape
  handleStylesChange(stylesPatch: Partial<TDShapeStyle>) {
    this.setStyles(stylesPatch)
    const styles = this.toolbar.getStyles()

    const shape = this.getSelectedShape()
    if (shape) {
      this.page.updateShape(shape.setStyles(styles))
    }
  }

  export(): TDDocument {
    return {
      page: this.page.export(),
      settings: this.toolbar.getSettings(),
    }
  }
}
export default StateManager
