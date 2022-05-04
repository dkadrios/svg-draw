/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Class,
  TDCallbacks,
  TDEntitiesList,
  TDEntity,
  TDSerializedPage,
  TDSettings,
  TDShape,
  TDShapeStyle,
  TDShapesList, TLBounds, TLCallbackNames, TLPageState,
} from 'types'
import { TDToolType } from 'types'
import { getBoundsFromPoints, vec } from 'utils'
import { TLShapeUtil } from '../core'
import { Page, PageState, Toolbar } from './stores'
import SelectTool from './SelectTool'
import BaseShape from './shapes/BaseShape'
import { ImageShape } from './shapes/Image'
import registerShapes from './shapes'

class StateManager {
  shapes: Record<string, Class<TDShape>> = {}

  utils: Record<string, TLShapeUtil<any>> = {}

  tools: Record<string, TDCallbacks> = {
    [TDToolType.Select]: new SelectTool(this),
  }

  session: TDCallbacks | null = null

  onSessionComplete: (() => void) | null = null

  tool: TDCallbacks | null = this.tools[TDToolType.Select]

  page: Page

  pageState: PageState

  toolbar: Toolbar

  rendererBounds: TLBounds = getBoundsFromPoints([
    [0, 0],
    [100, 100],
  ])

  constructor(initState: { page?: TDSerializedPage, pageState?: TLPageState } = {}) {
    registerShapes(this)
    BaseShape.init(this)

    const shapes = (initState && initState.page)
      ? this.loadShapes(initState.page.shapes)
      : {} as TDShapesList
    this.page = new Page({ ...initState.page, shapes })
    this.pageState = new PageState(initState.pageState)
    this.toolbar = new Toolbar()
  }

  registerShape<T extends TDShape>(key: string, Shape: Class<TDShape>, util: TLShapeUtil<T>) {
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

  getGridFactor() {
    const { grid, hideGrid } = this.getSettings()
    return hideGrid ? 1 : grid
  }

  setSettings(settings: Partial<TDSettings>) {
    this.pageState.setSettings(settings)
  }

  getNextChildIndex() {
    return this.page.getNextChildIndex()
  }

  getCurrentStyles() {
    return this.toolbar.getStyles()
  }

  // type checking is too hard here; need tests coverage
  addShape(shape: TDShape) {
    return this.page.addShape(shape)
  }

  updateShape(shape: TDShape) {
    return this.page.updateShape(shape)
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
      const shape = await ImageShape.createImageShapeFromUrl(url, this.getCenterPoint())
      this.addShape(shape)
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

  exportData() {
    return this.page.state
  }
}
export default StateManager
