/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Class,
  TDCallbacks,
  TDDocument,
  TDEntitiesList,
  TDEntity,
  TDSettings,
  TDShape,
  TDShapeStyle,
  TDShapesList,
  TLBounds,
  TLCallbackNames,
} from 'types'
import { BASE_SCALE, TDShapeType, TDToolType } from 'types'
import { getBoundsFromPoints } from 'utils'
import { add, div, mul, sub, toFixed } from 'utils/vec'
import { TLShapeUtil, TLShapeUtilsMap } from 'core'
import { Page, PageState, Toolbar } from './stores'
import SelectTool from './SelectTool'
import registerShapes from './shapes'
import { ImageShape } from './shapes/Image'
import { BgImageScale } from './shapes/Image/ImageShape'

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

  rendererBounds: TLBounds = getBoundsFromPoints([
    [0, 0],
    [100, 100],
  ])

  constructor(document: TDDocument, isAdminMode = true) {
    registerShapes(this)

    const { page = { shapes: {} }, pageState, settings } = document

    const shapes = this.loadShapes(page.shapes)
    this.page = new Page({ ...page, shapes })
    this.pageState = new PageState(pageState)
    this.toolbar = new Toolbar(settings, isAdminMode)
  }

  setData(document: TDDocument, isAdminMode = true) {
    const { page = { shapes: {} }, pageState, settings } = document

    const shapes = this.loadShapes(page.shapes)
    this.page.reset({ ...page, shapes })
    this.pageState.reset(pageState)
    this.toolbar.reset(settings, isAdminMode)
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

  getBackgroundImage() {
    const image = this.page.find({ type: TDShapeType.Image, isBackground: true })
    return image ? image as ImageShape : undefined
  }

  getScale() {
    const bgImage = this.getBackgroundImage()
    if (!bgImage || !bgImage.scale) return BASE_SCALE
    return bgImage.getScale()
  }

  createBackgroundImage = (image: ImageShape, scale?: BgImageScale) => {
    const page = this.getPage()
    const imageToAdd = image.produce({
      childIndex: page.getMinChildIndex() - 1,
      isBackground: true,
      scale,
    })

    // Remove previous BG image if exists
    const prevImage = this.getBackgroundImage()
    if (prevImage) page.removeShape(prevImage.id)

    page.addShape(imageToAdd)
    this.setSelected(imageToAdd.id)
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

  updateBounds(bounds: TLBounds) {
    this.rendererBounds = bounds
  }

  getCenterPoint() {
    const { height, width } = this.rendererBounds
    return toFixed([width / 2, height / 2])
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
