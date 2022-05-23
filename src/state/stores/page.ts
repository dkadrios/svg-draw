import type { TDPage, TDShape } from 'types'
import { uniqueId } from 'utils'
import Store from './store'

class Page extends Store<TDPage> {
  state!: TDPage

  constructor(opts: Partial<TDPage> = {}) {
    super()
    this.init(opts)
  }

  init(opts: Partial<TDPage> = {}) {
    const { id = uniqueId(), name = 'page', shapes = {} } = opts
    this.state = {
      id, name, shapes,
    }
    this.notify()
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
      Object.keys(shape).every(key => shape[key as keyof TDShape] === sh[key as keyof TDShape]))
  }

  export(): TDPage {
    return {
      id: this.state.id,
      name: this.state.name,
      shapes: Object.entries(this.state.shapes).reduce((acc, [id, shape]) =>
        ({ ...acc, [id]: shape.getEntity() }), {}),
    }
  }
}
export default Page
