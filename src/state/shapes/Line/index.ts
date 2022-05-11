import { TDShapeType } from 'types'
import type StateManager from '../../StateManager'
import LineShape from './LineShape'
import LineUtil from './LineUtil'
import LineTool from './LineTool'

const lineRegister = (sm: StateManager) => {
  sm.registerShape(TDShapeType.Line, LineShape, LineUtil)
  sm.registerTool(TDShapeType.Line, new LineTool(sm))
}

export { LineShape, LineUtil, LineTool, lineRegister }
export type { LineEntity } from './LineShape'
