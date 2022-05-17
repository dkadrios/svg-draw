import type { TDPage, TDShape } from 'types'
import { uniqueId } from 'utils'
import { Unit } from 'types'
import { ImageShape } from '../shapes/Image'
import Store from './store'

class Page extends Store {
  state: TDPage

  constructor(opts: Partial<TDPage> = {}) {
    super()
    const { id = uniqueId(), name = 'page', shapes = {} } = opts
    this.state = {
      id, name, shapes,
    }
  }

  getShape(id: string): TDShape {
    return this.state.shapes[id]
  }

  getNextChildIndex() {
    let maxIndex = -Infinity
    Object.values(this.state.shapes).forEach((shape) => {
      maxIndex = Math.max(maxIndex, shape.childIndex)
    })
    return maxIndex + 1
  }

  getMinChildIndex() {
    let minIndex = Infinity
    Object.values(this.state.shapes).forEach((shape) => {
      minIndex = Math.min(minIndex, shape.childIndex)
    })
    return minIndex
  }

  updateShape(patch: TDShape) {
    this.action((draft) => {
      draft.shapes[patch.id] = patch
    })
    return patch
  }

  removeShape(id: string) {
    this.action((draft) => {
      delete draft.shapes[id]
    })
  }

  addShape(shape: TDShape) {
    this.action((draft) => {
      draft.shapes[shape.id] = shape
    })

    return shape
  }

  find(shape: Partial<TDShape>) {
    return Object.values(this.state.shapes).find(sh =>
      // @ts-ignore
      Object.keys(shape).every(key => shape[key] === sh[key]))
  }

  setScale(dist: number, imageSize: number, units: Unit) {
    this.action((draft) => {
      draft.meta.scale = {
        scale: dist / imageSize,
        units,
      }
    })
  }
}
export default Page
