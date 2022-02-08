import type { TDShape, TLPage } from 'types'
import { uniqueId } from 'utils'
import Store from './store'

class Page extends Store {
  state: TLPage<TDShape>

  constructor(opts = {} as TLPage<TDShape>) {
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

  updateShape(id: string, patch: Partial<TDShape>) {
    this.action((draft) => {
      const shape = draft.shapes[id]
      draft.shapes[id] = { ...shape, ...patch }
    })
    return this.getShape(id)
  }

  removeShape(id: string) {
    this.action((draft) => {
      delete draft.shapes[id]
    })
  }

  createShape(shape: Partial<TDShape>) {
    const id = uniqueId()
    this.action((draft) => {
      draft.shapes[id] = {
        ...shape,
        id,
        parentId: 'page',
        childIndex: this.getNextChildIndex(),
        rotation: 0,
      }
    })

    return this.getShape(id)
  }
}
export default Page
