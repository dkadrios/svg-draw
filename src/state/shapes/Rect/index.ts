import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import RectShape from './RectShape'
import RectUtil from './RectUtil'
import RectTool from './RectTool'

const rectRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.Rectangle, RectShape, RectUtil)
  sm.registerTool(TDShapeType.Rectangle, new RectTool(sm))
}

export { RectShape, RectUtil, RectTool, rectRegister }
export type { RectEntity } from './RectShape'
