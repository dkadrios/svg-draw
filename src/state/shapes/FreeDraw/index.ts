import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import FreeDrawShape from './FreeDrawShape'
import FreeDrawUtil from './FreeDrawUtil'
import FreeDrawTool from './FreeDrawTool'

const freeDrawRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.FreeDraw, FreeDrawShape, FreeDrawUtil)
  sm.registerTool(TDShapeType.FreeDraw, new FreeDrawTool(sm))
}

export { FreeDrawShape, FreeDrawUtil, FreeDrawTool, freeDrawRegister }
export type { FreeDrawEntity } from './FreeDrawShape'
