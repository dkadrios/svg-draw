import type { TDPageState, TDSettings } from 'types'
import { clamp } from 'utils'
import { add, div, sub } from 'utils/vec'
import Store from './store'

class PageState extends Store<TDPageState> {
  state!: TDPageState

  constructor(opts?: Partial<TDPageState>) {
    super()
    this.reset(opts)
  }

  reset(opts: Partial<TDPageState> = {}) {
    this.action(() => ({
      camera: {
        point: [0, 0],
        zoom: 1,
      },
      editingId: null,
      hoveredId: null,
      selectedId: null,
      settings: {
        hideGrid: true,
        grid: 8,
      },
      ...opts,
    }))
  }

  getSelectedId() {
    return this.state.selectedId
  }

  getCamera() {
    return this.state.camera
  }

  getSettings() {
    return this.state.settings
  }

  setSettings(settings: Partial<TDSettings>) {
    this.action((draft) => {
      draft.settings = { ...draft.settings, ...settings }
    })
  }

  setHovered(id: string | null = null) {
    this.action((draft) => {
      draft.hoveredId = id
    })
  }

  setEditing(id: string | null = null) {
    this.action((draft) => {
      draft.editingId = id
    })
  }

  setSelected(id: string | null = null) {
    this.action((draft) => {
      draft.selectedId = id
    })
  }

  zoom(delta: number, center: number[] /* screen */) {
    this.action((draft) => {
      const { point, zoom } = draft.camera
      const newZoom = clamp(zoom - delta * zoom, 0.5, 2)
      const p0 = sub(div(center, zoom), point)
      const p1 = sub(div(center, newZoom), point)
      draft.camera = {
        point: add(point, sub(p1, p0)),
        zoom: newZoom,
      }
    })
  }

  pan(delta: number[]) {
    this.action((draft) => {
      draft.camera.point = add(draft.camera.point, delta)
    })
  }
}
export default PageState
